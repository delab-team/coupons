/* eslint-disable max-len */
import { DeLabConnect, DeLabTransaction } from '@delab-team/connect'
import { Cell, toNano } from 'ton-core'
import { KeyPair, keyPairFromSeed, sha256 } from 'ton-crypto'
import { StorageWallet } from './storage'
import { ClaimFunctions, OneTimeCheque } from './wrappers/OneTimeCheque'

const oneBoc = 'b5ee9c72410106010055000114ff00f4a413f4bcf2c80b010201200302004ef2d31ff00101821079b0b258ba8e158308d71820f901f8414130f910f2e2bcf800f842d89130e20202d10504001f3b513434ffc07e18750c343b47be18a0000120ed5bde98'

export class Coupon {
    private _wallet: DeLabConnect

    constructor (wallet: DeLabConnect) {
        this._wallet = wallet
    }

    public async deployOne (passwordString: string, amount: string | number): Promise<boolean> {
        const seed: Buffer = await sha256(passwordString)
        const keypair: KeyPair = keyPairFromSeed(seed)

        const _amount = toNano(amount)

        // const oneTimeCheque = provider.open(
        const data = OneTimeCheque.createFromConfig(
            {
                publicKey: keypair.publicKey,
                claimCont: ClaimFunctions.toncoin
            },
            Cell.fromBoc(Buffer.from(oneBoc, 'hex'))[0]
        )
        // )

        const trans: DeLabTransaction = {
            to: data.address.toString(),
            value: _amount.toString(),
            stateInit: data.init?.code.toBoc().toString()
        }

        await this._wallet.sendTransaction(trans)

        // await oneTimeCheque.sendDeploy(provider.sender(), amount)
        // console.log(cell)
        // console.log(data)

        const storage = new StorageWallet()
        const couponData = {
            publicKey: keypair.publicKey,
            address: data.address.toString(),
            amount: _amount.toString(),
            stateInit: data.init?.code.toBoc().toString()
        }
        storage.save('coupons', JSON.stringify(couponData))

        return true
    }
}
