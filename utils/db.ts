
import { UserModel, CycleModel } from '../types.ts';

const DB_NAME = 'CycleCareRemoteSync';
const DB_VERSION = 1;
const STORES = {
  USERS: 'users',      // Maps to MongoDB 'users' collection
  SESSION: 'session'   // Local browser session only
};

/**
 * CycleCare Database Service (MongoDB API Simulation)
 * This service handles data as Documents/Models.
 */
class DatabaseService {
  private db: IDBDatabase | null = null;

  private async connect(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
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

  // --- User Collection (Simulation of MongoDB API calls) ---

  async findUserByEmail(email: string): Promise<UserModel | null> {
    const db = await this.connect();
    return new Promise((resolve) => {
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
      name: updates.name || existing?.name || '',
      password: updates.password || existing?.password || '',
      profile: updates.profile || existing?.profile,
      createdAt: existing?.createdAt || Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.USERS, 'readwrite');
      const store = transaction.objectStore(STORES.USERS);
      const request = store.put(updatedUser);
      request.onsuccess = () => resolve(updatedUser);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteUser(email: string): Promise<void> {
    const db = await this.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.USERS, 'readwrite');
      const store = transaction.objectStore(STORES.USERS);
      const request = store.delete(email);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- Session Management ---

  async getActiveSession(): Promise<{ email: string; name: string } | null> {
    const db = await this.connect();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORES.SESSION, 'readonly');
      const store = transaction.objectStore(STORES.SESSION);
      const request = store.get('current');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async saveSession(email: string, name: string): Promise<void> {
    const db = await this.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.SESSION, 'readwrite');
      const store = transaction.objectStore(STORES.SESSION);
      const request = store.put({ id: 'current', email, name });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearSession(): Promise<void> {
    const db = await this.connect();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.SESSION, 'readwrite');
      const store = transaction.objectStore(STORES.SESSION);
      const request = store.delete('current');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbService = new DatabaseService();
