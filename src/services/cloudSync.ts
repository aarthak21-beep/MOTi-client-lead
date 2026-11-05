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

export async function pushCloudData(): Promise<void> {
  const payload = JSON.stringify({ data: JSON.parse(exportAllData()) });
  await fetch(CLOUD_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: payload,
  });
}
