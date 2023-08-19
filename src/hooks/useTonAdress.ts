import { CHAIN, toUserFriendlyAddress } from '@tonconnect/ui'
import { useTonWallet } from '@tonconnect/ui-react'

/**
 * Use it to get user's current ton wallet address. If wallet is not connected hook will return empty string.
 * @param [userFriendly=true] allows to choose format of the address.
 */
export function useTonAddress (userFriendly = true): string {
    const wallet = useTonWallet()

    if (wallet) {
        return userFriendly
            ? toUserFriendlyAddress(wallet.account.address, wallet.account.chain === CHAIN.TESTNET)
            : wallet.account.address
    }
    return ''
}
