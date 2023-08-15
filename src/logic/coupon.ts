/* eslint-disable max-len */
import { DeLabConnect, DeLabTransaction } from '@delab-team/connect'
import { toast } from 'react-toastify'
// import { Cell, toNano } from 'ton-core'

import { Address, beginCell, Cell, contractAddress, StateInit, storeStateInit, toNano, TonClient } from 'ton'
import { KeyPair, keyPairFromSeed, sha256, sign } from 'ton-crypto'
import { StorageWallet } from './storage'
import { ClaimFunctions, OneTimeCheque, Opcodes } from './wrappers/OneTimeCheque'

const oneBoc = 'b5ee9c72410106010055000114ff00f4a413f4bcf2c80b010201200302004ef2d31ff00101821079b0b258ba8e158308d71820f901f8414130f910f2e2bcf800f842d89130e20202d10504001f3b513434ffc07e18750c343b47be18a0000120ed5bde98'

export class Coupon {
    private _wallet: DeLabConnect

    private _client: TonClient

    constructor (wallet: DeLabConnect) {
        this._wallet = wallet

        this._client = new TonClient({ endpoint: 'https://testnet.tonhubapi.com/jsonRPC' })
    }

    public async deployOne (passwordString: string, amount: string | number): Promise<string | boolean> {
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

        if (!data.init) {
            console.error('data.init null', data)
            return false
        }

        const stateInit: StateInit  = {
            code: data.init.code,
            data: data.init.data
        }

        // const stateInitCell = new Cell()

        const initString = beginCell().storeWritable(storeStateInit(stateInit)).endCell().toBoc()
            .toString('base64')
        // stateInit.writeTo(stateInitCell)

        const trans: DeLabTransaction = {
            to: data.address.toString(),
            value: _amount.toString(),
            stateInit: initString
        }

        console.log('address', data)

        console.log('address', data.address.toString())

        try {
            const tx = await this._wallet.sendTransaction(trans)
            console.log('tx', tx)

            const storage = new StorageWallet()
            const couponData = {
                publicKey: keypair.publicKey,
                address: data.address.toString(),
                amount: _amount.toString(),
                type: 'one'
            }

            storage.save('coupons', JSON.stringify(couponData))

            if (tx) {
                toast.success('Coupon created successfully.')
            } else {
                toast.error('Failed to create coupon')
            }
            return data.address.toString()
        } catch (error) {
            console.error('deploy', error)
            return false
        }
    }

    public async claim (address: string, addressForUser: string, passwordString: string) {
        const seed: Buffer = await sha256(passwordString)
        const keypair: KeyPair = keyPairFromSeed(seed)

        const addressFor = Address.parse(addressForUser)

        const signature = sign(beginCell().storeAddress(addressFor).endCell().hash(), keypair.secretKey)

        const oneTimeCheque =             OneTimeCheque.createFromAddress(Address.parse(address))

        console.log('oneTimeCheque', oneTimeCheque)


        const oneTimeChequeO = this._client.open(
            OneTimeCheque.createFromAddress(Address.parse(address))
        )

        const tx = await oneTimeChequeO.sendClaim({
            signature,
            address: addressFor
        })

        // const payload = beginCell().storeUint(Opcodes.claim, 32).storeBuffer(signature).storeAddress(addressFor)
        //     .endCell()
        // const trans: DeLabTransaction = {
        //     to: Address.parse(address).toString({ bounceable: true }),
        //     value: toNano('0.05').toString(),
        //     payload: payload.toBoc().toString('base64')
        // }

        try {
            // const tx = await this._wallet.sendTransaction(trans)
            console.log('tx', tx)
            return true
        } catch (error) {
            console.error('claim', error)
            return false
        }
    }
}
