import { exportAllData, importAllData } from './storage';

const CLOUD_URL = 'https://script.google.com/macros/s/AKfycbydnIZmdafUJIC49XHn96m3eOOqIKSaWfb9v2aD9u07coqfUHUTpzU-BlwtneE-fprP/exec';

type CloudResponse = { ok?: boolean; data?: unknown; error?: string };

function readCloud(): Promise<CloudResponse> {
  return new Promise((resolve, reject) => {
    const callbackName = '__motiqCloud_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const script = document.createElement('script');
    const cleanup = () => {
      delete (window as any)[callbackName];
      script.remove();
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Cloud read timed out. Google sign-in / access तपासा.'));
    }, 20000);

    (window as any)[callbackName] = (result: CloudResponse) => {
      window.clearTimeout(timeout);
      cleanup();
      resolve(result);
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      cleanup();
      reject(new Error('Cloud read failed. Google account access तपासा.'));
    };
    script.src = `${CLOUD_URL}?callback=${callbackName}&t=${Date.now()}`;
    document.body.appendChild(script);
  });
}

// A normal fetch is blocked by Apps Script's cross-origin redirect.
// A browser form POST avoids CORS; the following JSONP read verifies the write.
async function postForm(payload: unknown): Promise<void> {
  const frameName = 'motiq_cloud_frame_' + Date.now();
  const frame = document.createElement('iframe');
  frame.name = frameName;
  frame.style.display = 'none';
  document.body.appendChild(frame);

  try {
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('Google sign-in required or cloud write timed out.')), 20000);
      frame.onload = () => {
        window.clearTimeout(timer);
        resolve();
      };
    });

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = CLOUD_URL;
    form.target = frameName;
    form.style.display = 'none';

    const field = document.createElement('input');
    field.type = 'hidden';
    field.name = 'payload';
    field.value = JSON.stringify(payload);
    form.appendChild(field);
    document.body.appendChild(form);
    form.submit();
    form.remove();

    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('Google Sheet write timed out.')), 30000);
      frame.onload = () => {
        window.clearTimeout(timer);
        resolve();
      };
    });
  } finally {
    frame.remove();
  }
}

export async function pullCloudData(): Promise<void> {
  const response = await readCloud();
  if (!response.ok || !response.data || typeof response.data !== 'object') {
    throw new Error(response.error || 'Cloud मध्ये valid MOTIQ backup सापडला नाही.');
  }
  const data = response.data as Record<string, unknown>;
  if (!Array.isArray(data.leads) || !Array.isArray(data.projects)) {
    throw new Error('Cloud backup format चुकीचा आहे. आधी laptop वरून पहिला backup करा.');
  }
  if (!importAllData(JSON.stringify(data))) {
    throw new Error('Cloud data restore करता आला नाही.');
  }
}

export async function testCloudWrite(): Promise<void> {
  const marker = { motiq_connection_test: true, tested_at: new Date().toISOString() };
  await postForm({ data: marker });

  const response = await readCloud();
  const saved = response.data as Record<string, unknown> | undefined;
  if (!response.ok || saved?.motiq_connection_test !== true || saved?.tested_at !== marker.tested_at) {
    throw new Error('Google Sheet मध्ये test save झाल्याची खात्री मिळाली नाही. Apps Script doPost तपासा.');
  }
}

export async function pushCloudData(): Promise<void> {
  const data = JSON.parse(exportAllData());
  await postForm({ data });

  const response = await readCloud();
  if (!response.ok || JSON.stringify(response.data) !== JSON.stringify(data)) {
    throw new Error('Cloud backup verify झाला नाही.');
  }
}
