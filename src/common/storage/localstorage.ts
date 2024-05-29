class LocalStorage {
    db: IDBDatabase | null;
    collection: string;
    constructor() {
        this.db = null
        this.collection = ''
    }
    init(collection: string) {
        return new Promise((resolve, reject) => {
            this.collection = collection
            const openRequest = indexedDB.open('life-review-notes', 1);
            openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                this.db = event.target?.result as IDBDatabase
                if (!this.db.objectStoreNames.contains(collection)) {
                    this.db.createObjectStore(collection);
                    resolve(true)
                } else {
                    reject()
                }
            };
            openRequest.onsuccess = (e: Event) => {
                this.db = e.target?.result as IDBDatabase;
                resolve(true)
            };
            openRequest.onerror = () => {
                console.log('数据库打开失败');
                reject()
            };
        })

    }
    updateData(key: string, data: unknown) {
        return new Promise<boolean>((resolve) => {
            if (!this.db) return
            const transaction = this.db.transaction([this.collection], 'readwrite');
            const store = transaction.objectStore(this.collection);
            if (store) {
                const getRequest = store.get(key);
                getRequest.onsuccess = (e) => {
                    const record = e.target?.result;
                    if (record !== undefined) {
                        const putRequest = store.put(data, key);
                        putRequest.onsuccess = () => {
                            resolve(true)
                        };
                        putRequest.onerror = () => {
                            resolve(false)
                        };
                    } else {
                        const request = store.add(data, key);
                        request.onsuccess = () => {
                            resolve(true)
                        };
                        request.onerror = () => {
                            resolve(false)
                        };
                    }
                }

            } else {
                resolve(false)
            }
        })
    }
    getData(key: string) {
        return new Promise<unknown>((resolve, reject) => {
            if (!this.db) return
            const transaction = this.db.transaction([this.collection], 'readwrite');
            const store = transaction.objectStore(this.collection);
            if (store) {
                const request = store.get(key);
                request.onsuccess = function (e) {
                    const data = (e.target as IDBRequest).result;
                    resolve(data)
                };
                request.onerror = function (e) {
                    console.log('数据添加失败', e);
                    reject(undefined)
                };
            } else {
                reject(undefined)
            }
        })
    }
}
export default LocalStorage