
import { UserProfile } from '../types.ts';

const DB_NAME = 'CycleCareDB';
const DB_VERSION = 1;
const STORES = {
  PROFILES: 'profiles',
  SESSIONS: 'sessions'
};

/**
 * World-class Database Service using IndexedDB.
 * This provides a persistent NoSQL-style storage that survives session resets.
 */
class DatabaseService {
  private db: IDBDatabase | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.PROFILES)) {
          db.createObjectStore(STORES.PROFILES, { keyPath: 'email' });
        }
        if (!db.objectStoreNames.contains(STORES.SESSIONS)) {
          db.createObjectStore(STORES.SESSIONS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => reject(request.error);
    });
  }

  // --- Profiles Collection ---

  async getProfile(email: string): Promise<UserProfile | null> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORES.PROFILES, 'readonly');
      const store = transaction.objectStore(STORES.PROFILES);
      const request = store.get(email);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async saveProfile(email: string, profile: UserProfile): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROFILES, 'readwrite');
      const store = transaction.objectStore(STORES.PROFILES);
      const request = store.put({ ...profile, email });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProfile(email: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.PROFILES, 'readwrite');
      const store = transaction.objectStore(STORES.PROFILES);
      const request = store.delete(email);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- Sessions Collection ---

  async getActiveSession(): Promise<{ email: string; name: string } | null> {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORES.SESSIONS, 'readonly');
      const store = transaction.objectStore(STORES.SESSIONS);
      const request = store.get('current');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  async saveSession(email: string, name: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.SESSIONS, 'readwrite');
      const store = transaction.objectStore(STORES.SESSIONS);
      const request = store.put({ id: 'current', email, name });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearSession(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORES.SESSIONS, 'readwrite');
      const store = transaction.objectStore(STORES.SESSIONS);
      const request = store.delete('current');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbService = new DatabaseService();
