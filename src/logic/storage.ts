// eslint-disable-next-line import/no-cycle
import { CouponDataType } from '../pages/your-checks-page'

export class StorageWallet {
    private _data: globalThis.Storage

    private _keyPrefix: string = 'decoupons-'

    constructor () {
        this._data = window.localStorage
    }

    private getFullKey (key: string): string {
        return this._keyPrefix + key
    }

    public save (key: string, data: any | object): boolean {
        try {
            const existingData = this._data.getItem(this.getFullKey(key)) || '[]'
            const dataArray = JSON.parse(existingData)

            dataArray.push(data)

            this._data.setItem(this.getFullKey(key), JSON.stringify(dataArray))
        } catch (error) {
            console.error(error)
            return false
        }
        return true
    }

    public getAllCoupons (): CouponDataType[] {
        const allCoupons: CouponDataType[] = []

        try {
            for (let i = 0; i < this._data.length; i++) {
                const key = this._data.key(i)
                if (key && key.startsWith(this._keyPrefix)) {
                    const dataArray = this.get(key.replace(this._keyPrefix, ''))
                    if (Array.isArray(dataArray) && dataArray.length > 0 && typeof dataArray[0] === 'object') {
                        allCoupons.push(...dataArray)
                    }
                }
            }

            allCoupons.sort((a, b) => a.date - b.date)
        } catch (error) {
            console.error(error)
        }

        return allCoupons
    }

    public get (key: string): any[] | null {
        try {
            const dataArray = this._data.getItem(this.getFullKey(key))
            return dataArray ? JSON.parse(dataArray) as any[] : null
        } catch (error) {
            console.error(error)
            return null
        }
    }

    public del (key: string): boolean {
        try {
            this._data.removeItem(this.getFullKey(key))
        } catch (error) {
            console.error(error)
            return false
        }
        return true
    }
}
