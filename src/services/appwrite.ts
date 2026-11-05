import { Account, Client, Permission, Role, TablesDB } from 'appwrite';
import { exportAllData, importAllData } from './storage';

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('6aec72aa000ab9b6e984');

export const account = new Account(client);
const tables = new TablesDB(client);

export const MOTIQ_DATABASE_ID = '6aec75880006fc3c39c7';
export const MOTIQ_TABLE_ID = '6aec75da003a544a371d';

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

export async function uploadLocalBackup(userId: string) {
  const data = exportAllData();
  const rowData = {
    user_id: userId,
    data,
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

export async function restoreCloudBackup(userId: string) {
  const row = await tables.getRow({
    databaseId: MOTIQ_DATABASE_ID,
    tableId: MOTIQ_TABLE_ID,
    rowId: userId,
  });
  if (!row.data || typeof row.data !== 'string') {
    throw new Error('Cloud backup is empty or invalid.');
  }
  const imported = importAllData(row.data);
  if (!imported) throw new Error('Cloud backup could not be restored.');
}
