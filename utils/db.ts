
import { UserModel, CycleModel } from '../types.ts';

const DB_NAME = 'CycleCareRemoteSync_v2';
const DB_VERSION = 1;
const STORES = {
  USERS: 'users',
  SESSION: 'session'
};

// Public Key-Value Storage Bucket for anonymous remote sync
const REMOTE_BUCKET_ID = 'A7q8S9f2g3h4j5k6l7m8n9_CycleCare';
const REMOTE_URL = `https://kvdb.io/${REMOTE_BUCKET_ID}/`;

/**
 * CycleCare Database Service (Hybrid Remote/Local Storage)
 * This service automatically syncs data to a remote cloud store to enable cross-device usage.
 */
class DatabaseService {
  private db: IDBDatabase | null = null;

  private async connect(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          db.createObjectStore(STORES.USERS, { keyPath: 'email' });
        }
        if (!db.objectStoreNames.contains(STORES.SESSION)) {
          db.createObjectStore(STORES.SESSION, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // --- Remote Storage Helpers ---

  private async fetchRemoteUser(email: string): Promise<UserModel | null> {
    try {
      const response = await fetch(`${REMOTE_URL}${encodeURIComponent(email)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Remote fetch failed, using local fallback.");
    }
    return null;
  }

  private async saveRemoteUser(user: UserModel): Promise<void> {
    try {
      await fetch(`${REMOTE_URL}${encodeURIComponent(user.email)}`, {
        method: 'POST',
        body: JSON.stringify(user)
      });
    } catch (e) {
      console.warn("Remote save failed.");
    }
  }

  // --- User Operations ---

  async findUserByEmail(email: string): Promise<UserModel | null> {
    const db = await this.connect();
    
    // 1. Try Remote First (for cross-device sync)
    const remoteUser = await this.fetchRemoteUser(email);
    if (remoteUser) {
      // Sync local with remote if found
      const transaction = db.transaction(STORES.USERS, 'readwrite');
      transaction.objectStore(STORES.USERS).put(remoteUser);
      return remoteUser;
    }

    // 2. Fallback to Local
    return new Promise<UserModel | null>((resolve) => {
      const transaction = db.transaction(STORES.USERS, 'readonly');
      const store = transaction.objectStore(STORES.USERS);
      const request = store.get(email);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async updateUserInfo(email: string, updates: Partial<UserModel>): Promise<UserModel> {
    const db = await this.connect();
    const existing = await this.findUserByEmail(email);
    
    const updatedUser: UserModel = {
      _id: existing?._id || crypto.randomUUID(),
      email: email,
      name: updates.name || existing?.name || email.split('@')[0],
      profile: updates.profile || existing?.profile,
      createdAt: existing?.createdAt || Date.now()
    };

    // Save Local
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORES.USERS, 'readwrite');
      const store = transaction.objectStore(STORES.USERS);
      const request = store.put(updatedUser);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Save Remote (Async Background Sync)
    this.saveRemoteUser(updatedUser);

    return updatedUser;
  }

  async deleteUser(email: string): Promise<void> {
    const db = await this.connect();
    
    // Delete Local
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORES.USERS, 'readwrite');
      const store = transaction.objectStore(STORES.USERS);
      const request = store.delete(email);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Delete Remote
    try {
      await fetch(`${REMOTE_URL}${encodeURIComponent(email)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn("Remote delete failed.");
    }
  }

  // --- Session Management ---

  async getActiveSession(): Promise<{ email: string; name: string } | null> {
    const db = await this.connect();
    return new Promise<{ email: string; name: string } | null>((resolve) => {
      const transaction = db.transaction(STORES.SESSION, 'readonly');
      const store = transaction.objectStore(STORES.SESSION);
      const request = store.get('current');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async saveSession(email: string, name: string): Promise<void> {
    const db = await this.connect();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORES.SESSION, 'readwrite');
      const store = transaction.objectStore(STORES.SESSION);
      const request = store.put({ id: 'current', email, name });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearSession(): Promise<void> {
    const db = await this.connect();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORES.SESSION, 'readwrite');
      const store = transaction.objectStore(STORES.SESSION);
      const request = store.delete('current');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbService = new DatabaseService();
