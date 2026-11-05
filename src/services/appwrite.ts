import { Account, Client, Permission, Role, TablesDB } from 'appwrite';
import { exportAllData, importAllData } from './storage';

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('6aec72aa000ab9b6e984');

export const account = new Account(client);
const tables = new TablesDB(client);

export const MOTIQ_DATABASE_ID = '6aec75880006fc3c39c7';
export const MOTIQ_TABLE_ID = '6aec75da003a544a371d';

const ENCRYPTED_BACKUP_PREFIX = 'MOTIQ_ENC_V1:';
const PBKDF2_ITERATIONS = 310_000;

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function deriveEncryptionKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encryptBackup(plainText: string, passphrase: string): Promise<string> {
  if (!crypto?.subtle) throw new Error('Secure browser encryption is unavailable. Please use the HTTPS MOTIQ website in an updated browser.');
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plainText),
  );
  return ENCRYPTED_BACKUP_PREFIX + JSON.stringify({
    version: 1,
    kdf: 'PBKDF2-SHA256',
    iterations: PBKDF2_ITERATIONS,
    cipher: 'AES-256-GCM',
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
  });
}

async function decryptBackup(encryptedText: string, passphrase: string): Promise<string> {
  try {
    const envelope = JSON.parse(encryptedText.slice(ENCRYPTED_BACKUP_PREFIX.length));
    if (envelope.version !== 1 || envelope.kdf !== 'PBKDF2-SHA256' || envelope.cipher !== 'AES-256-GCM') {
      throw new Error('Unsupported encrypted backup format.');
    }
    const salt = fromBase64(envelope.salt);
    const iv = fromBase64(envelope.iv);
    const ciphertext = fromBase64(envelope.ciphertext);
    const key = await deriveEncryptionKey(passphrase, salt);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(plaintext);
  } catch {
    throw new Error('Encryption password is incorrect or the cloud backup is damaged. No local data was changed.');
  }
}

export async function getCurrentCloudUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function signInToMotiq(email: string, password: string) {
  await account.createEmailPasswordSession({ email, password });
  return account.get();
}

export async function signOutFromMotiq() {
  await account.deleteSession({ sessionId: 'current' });
}

export async function uploadLocalBackup(userId: string, encryptionPassword: string) {
  const plainText = exportAllData();
  const encryptedData = await encryptBackup(plainText, encryptionPassword);
  const rowData = {
    user_id: userId,
    data: encryptedData,
    updated_at: new Date().toISOString(),
  };

  try {
    await tables.getRow({
      databaseId: MOTIQ_DATABASE_ID,
      tableId: MOTIQ_TABLE_ID,
      rowId: userId,
    });
    await tables.updateRow({
      databaseId: MOTIQ_DATABASE_ID,
      tableId: MOTIQ_TABLE_ID,
      rowId: userId,
      data: rowData,
    });
  } catch (error: any) {
    if (error?.code !== 404) throw error;
    await tables.createRow({
      databaseId: MOTIQ_DATABASE_ID,
      tableId: MOTIQ_TABLE_ID,
      rowId: userId,
      data: rowData,
      permissions: [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });
  }
}

export async function restoreCloudBackup(userId: string, encryptionPassword: string) {
  const row = await tables.getRow({
    databaseId: MOTIQ_DATABASE_ID,
    tableId: MOTIQ_TABLE_ID,
    rowId: userId,
  });
  if (!row.data || typeof row.data !== 'string') {
    throw new Error('Cloud backup is empty or invalid.');
  }
  if (!row.data.startsWith(ENCRYPTED_BACKUP_PREFIX)) {
    throw new Error('This cloud backup is an older unencrypted backup. Go to the device that has the original data and use Upload this device to replace it with an encrypted backup first.');
  }
  const plainText = await decryptBackup(row.data, encryptionPassword);
  const imported = importAllData(plainText);
  if (!imported) throw new Error('Cloud backup could not be restored.');
}
