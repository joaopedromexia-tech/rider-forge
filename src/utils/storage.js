// Camada de storage com fallback para localStorage, usando IndexedDB quando disponível
// Mantém compatibilidade: operações críticas continuam em localStorage; IndexedDB é best-effort.

const DB_NAME = 'riderForge';
const DB_VERSION = 1;
const STORE_KV = 'kv';
const STORE_RIDERS = 'riders';
const STORE_VERSIONS = 'versions';

function isIndexedDBAvailable() {
  try {
    return typeof indexedDB !== 'undefined';
  } catch (_) {
    return false;
  }
}

function openDb() {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) return resolve(null);
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_KV)) db.createObjectStore(STORE_KV);
        if (!db.objectStoreNames.contains(STORE_RIDERS)) db.createObjectStore(STORE_RIDERS, { keyPath: 'id' });
        if (!db.objectStoreNames.contains(STORE_VERSIONS)) db.createObjectStore(STORE_VERSIONS, { keyPath: 'key' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

async function withStore(storeName, mode, fn) {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve, reject) => {
    try {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const result = fn(store, tx);
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => resolve(null);
      tx.onabort = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

// KV helpers
export async function kvGet(key) {
  try {
    const fromIdb = await withStore(STORE_KV, 'readonly', (store) => store.get(key));
    if (fromIdb && typeof fromIdb.value !== 'undefined') return fromIdb.value;
  } catch (_) {}
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch (_) {
    return null;
  }
}

export async function kvSet(key, value) {
  try {
    await withStore(STORE_KV, 'readwrite', (store) => store.put({ id: key, value }));
  } catch (_) {}
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

// Riders helpers (best-effort)
export async function saveRidersToIndexedDB(riders) {
  try {
    await withStore(STORE_RIDERS, 'readwrite', (store) => {
      // Limpar e regravar simplificadamente
      // Não falhar se clear não estiver disponível
      try { store.clear(); } catch (_) {}
      riders.forEach((r) => store.put(r));
    });
  } catch (_) {}
}

export async function readRidersFromIndexedDB() {
  try {
    const all = await withStore(STORE_RIDERS, 'readonly', (store) => store.getAll());
    return Array.isArray(all) ? all : [];
  } catch (_) {
    return [];
  }
}

// Versioning helpers
const MAX_VERSIONS_PER_RIDER = 20;

export async function saveRiderVersion(riderId, data) {
  try {
    const timestamp = new Date().toISOString();
    const key = `${riderId}::${timestamp}`;
    await withStore(STORE_VERSIONS, 'readwrite', (store) => store.put({ key, riderId, timestamp, data }));
    // Prune old versions
    await pruneOldVersions(riderId);
  } catch (_) {}
}

export async function getRiderVersions(riderId) {
  try {
    const all = await withStore(STORE_VERSIONS, 'readonly', (store) => store.getAll());
    const filtered = Array.isArray(all) ? all.filter(v => v.riderId === riderId) : [];
    return filtered.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  } catch (_) {
    return [];
  }
}

async function pruneOldVersions(riderId) {
  try {
    const versions = await getRiderVersions(riderId);
    if (versions.length <= MAX_VERSIONS_PER_RIDER) return;
    const toDelete = versions.slice(MAX_VERSIONS_PER_RIDER);
    await withStore(STORE_VERSIONS, 'readwrite', (store) => {
      toDelete.forEach(v => store.delete(v.key));
    });
  } catch (_) {}
}

// Background sync helpers
export async function backgroundSyncRiders(riders) {
  // Best effort: não impacta a UI
  await saveRidersToIndexedDB(riders || []);
}

export default {
  kvGet,
  kvSet,
  saveRidersToIndexedDB,
  readRidersFromIndexedDB,
  saveRiderVersion,
  getRiderVersions,
  backgroundSyncRiders
}


