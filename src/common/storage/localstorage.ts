class LocalStorage {
    db: IDBDatabase | null;
    dbName: string = 'life-review-notes';
    constructor() {
        this.db = null
    }
    init() {
        return new Promise((resolve, reject) => {
            const arr = ['task-list', 'abstract-concrete-library', 'experience', 'review', 'utils', 'snapshot']
            const openRequest = indexedDB.open(this.dbName);
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

    downloadJSONData(data: string) {
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

    downloadAllDataAsJSON() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                const allData: Record<string, any> = {};
                // 遍历所有对象存储
                for (let i = 0; i < this.db.objectStoreNames.length; i++) {
                    const storeName = this.db.objectStoreNames[i];
                    if (storeName === 'snapshot') continue
                    const transaction = this.db.transaction([storeName], 'readonly');
                    const store = transaction.objectStore(storeName);

                    // 使用cursor遍历对象存储中的所有数据
                    const objectStoreRequest = store.openCursor();

                    objectStoreRequest.onsuccess = (e) => {
                        // @ts-expect-error 正常报错
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
                                resolve(data)
                                return
                            }
                        }
                    };

                    objectStoreRequest.onerror = function (e) {
                        console.error('读取对象存储数据失败', e);
                    };
                }
            } else {
                reject('db不存在')
            }
        })
    }

    overwriteDataFromIDB(jsonString: string) {
        try {
            const data = JSON.parse(jsonString);
            if (this.db) {
                for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        const object = data[key]
                        const transaction = this.db.transaction([key], 'readwrite');
                        const store = transaction.objectStore(key);

                        // 清空现有数据
                        store.clear();

                        // 将JSON数据写入对象存储
                        for (const key in object) {
                            if (object.hasOwnProperty(key)) {
                                // debugger
                                store.put(object[key], key);
                            }
                        }
                    }
                }
            }
        } catch (err) {
        }
    }

    async saveToSnapShot() {
        try {
            const snapShot = await this.downloadAllDataAsJSON()
            if (this.db) {
                const transaction = this.db.transaction(['snapshot'], 'readwrite');
                const store = transaction.objectStore('snapshot');
                store.put(snapShot, 'snapshot');
                store.put(new Date().getTime(), 'updateDate');
            }
        } catch (err) {
        }
    }
}
export default LocalStorage