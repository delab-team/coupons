import { Coins } from 'ton3'

export function fixAmount (nanoAmount: string | number) {
    const coin = Coins.fromNano(nanoAmount).toString()
    let stringAmount = Number(coin).toFixed(2)

    if (Number(stringAmount) === 0) {
        stringAmount = Number(coin).toFixed(4)
    }
    return stringAmount
}
