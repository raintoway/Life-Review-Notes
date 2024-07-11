class LocalStorage {
    db: IDBDatabase | null;
    constructor() {
        this.db = null
    }
    init() {
        return new Promise((resolve, reject) => {
            const arr = ['task-list', 'abstract-concrete-library', 'experience', 'review']
            const openRequest = indexedDB.open('life-review-notes', 1);
            openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                // 版本升级事务，已知的版本升级情况有对象存储列表的改变
                this.db = event.target?.result as IDBDatabase
                arr.forEach(item => {
                    if (this.db) {
                        if (!this.db.objectStoreNames.contains(item)) {
                            this.db.createObjectStore(item);
                        }
                    }
                })
                resolve(true)
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
    updateData(collection: string, key: string, data: unknown) {
        return new Promise<boolean>((resolve) => {
            if (!this.db) return
            const transaction = this.db.transaction([collection], 'readwrite');
            const store = transaction.objectStore(collection);
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
    getData(collection: string, key: string) {
        return new Promise<unknown>((resolve, reject) => {
            if (!this.db) return
            const transaction = this.db.transaction([collection], 'readwrite');
            const store = transaction.objectStore(collection);
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