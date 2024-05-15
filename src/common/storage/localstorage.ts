interface IProps {
    collection: string
}
class LocalStorage {
    db: IDBDatabase | null;
    store: IDBObjectStore | null;
    collection: string;
    constructor(props: IProps) {
        const { collection } = props
        this.db = null
        this.store = null
        this.collection = ''
        this.init(collection)
    }
    init(collection: string) {
        const openRequest = indexedDB.open('life-review-notes', 1);
        openRequest.onsuccess = (e: Event) => {
            this.db = e.target?.result as IDBDatabase;
            this.collection = collection
            const transaction = this.db.transaction([collection], 'readwrite');
            this.store = transaction.objectStore(collection);
        };
        openRequest.onerror = () => {
            console.log('数据库打开失败');
        };
    }
    addData(key: string, data: unknown) {
        return new Promise<boolean>((resolve) => {
            if (this.store) {
                const request = this.store.put(data, key);
                request.onsuccess = function () {
                    resolve(true)
                };
                request.onerror = function () {
                    resolve(false)
                };
            } else {
                resolve(false)
            }
        })
    }
    getData(key: string) {
        return new Promise<boolean>((resolve, reject) => {
            if (this.store) {
                const request = this.store.get(key);
                request.onsuccess = function (e) {
                    const data = (e.target as IDBRequest).result;
                    resolve(data)
                };
                request.onerror = function () {
                    reject(null)
                    console.log('数据添加失败');
                };
            } else {
                reject(null)
            }
        })
    }
}
export default LocalStorage