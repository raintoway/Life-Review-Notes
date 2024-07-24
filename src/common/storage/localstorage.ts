class LocalStorage {
    db: IDBDatabase | null;
    constructor() {
        this.db = null
    }
    init() {
        return new Promise((resolve, reject) => {
            const arr = ['task-list', 'abstract-concrete-library', 'experience', 'review', 'utils']
            const openRequest = indexedDB.open('life-review-notes', 1);
            openRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                // 版本升级事务，已知的版本升级情况有对象存储列表的改变
                // @ts-expect-error 忽略错误
                const db = event.target?.result as IDBDatabase
                console.log('db-update');
                arr.forEach(item => {
                    if (db) {
                        if (!db.objectStoreNames.contains(item)) {
                            db.createObjectStore(item);
                        }
                    }
                })
            };
            openRequest.onsuccess = (e: Event) => {
                // @ts-expect-error 忽略错误
                this.db = e.target?.result as IDBDatabase;
                console.log('db-success');
                resolve(true)
            };
            openRequest.onerror = () => {
                console.log('数据库打开失败');
                console.log('db-fail');
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
                    // @ts-expect-error 忽略错误
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
    downloadAllDataAsJSON() {
        const downloadJSONData = (data: string) => {
            // 创建一个Blob对象，包含JSON数据
            const blob = new Blob([data], { type: 'application/json' });

            // 创建一个下载链接
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'allData.json'; // 下载文件的名称

            // 触发下载
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
        if (this.db) {
            const allData: Record<string, any> = {};

            // 遍历所有对象存储
            for (let i = 0; i < this.db.objectStoreNames.length; i++) {
                const storeName = this.db.objectStoreNames[i];
                const transaction = this.db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);

                // 使用cursor遍历对象存储中的所有数据
                const objectStoreRequest = store.openCursor();

                objectStoreRequest.onsuccess = (e) => {
                    const cursor = e.target?.result;
                    if (cursor) {
                        // 将键和值添加到allData对象的对应对象存储中
                        if (!allData[storeName]) {
                            allData[storeName] = {};
                        }
                        allData[storeName][cursor.key] = cursor.value

                        // 继续遍历
                        cursor.continue();
                    } else {
                        // 检查是否是最后一个对象存储
                        if (this.db && i === this.db.objectStoreNames.length - 1) {
                            // 所有数据都已读取完毕，准备下载
                            const data = JSON.stringify(allData, null, 2); // 格式化JSON
                            downloadJSONData(data);
                        }
                    }
                };

                objectStoreRequest.onerror = function (e) {
                    console.error('读取对象存储数据失败', e);
                };
            }
        }

    }


}
export default LocalStorage