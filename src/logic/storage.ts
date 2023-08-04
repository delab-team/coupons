export class StorageWallet {
    private _data: globalThis.Storage

    constructor () {
        this._data = window.localStorage
    }

    public save (key: string, data: any | string): boolean {
        try {
            this._data.setItem(`decoupons-${key}`, data)
        } catch (error) {
            console.error(error)
            return false
        }
        return true
    }

    public get (key: string): any | undefined {
        try {
            return this._data.getItem(`decoupons-${key}`) ?? this._data.getItem(`decoupons-${key}`)
        } catch (error) {
            console.error(error)
            return false
        }
    }

    public del (key: string): boolean {
        try {
            this._data.removeItem(`decoupons-${key}`)
            this._data.removeItem(`decoupons-${key}`)
        } catch (error) {
            console.error(error)
            return false
        }
        return true
    }
}
