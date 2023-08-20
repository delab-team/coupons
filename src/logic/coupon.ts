/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { DeLabConnect, DeLabTransaction } from '@delab-team/connect'
import { toast } from 'react-toastify'
// import { Cell, toNano } from 'ton-core'

import { Address, beginCell, Cell, contractAddress, StateInit, storeStateInit, toNano, TonClient } from 'ton'
import { KeyPair, keyPairFromSeed, sha256, sign } from 'ton-crypto'
import { TonConnectUI, TonConnectUiOptions, SendTransactionRequest } from '@tonconnect/ui'
import { StorageWallet } from './storage'
import { ClaimFunctions, OneTimeCheque } from './wrappers/OneTimeCheque'
import { MultiCheque, Opcodes, ClaimFunctions as ClaimFunctionsMulti } from './wrappers/MultiCheque'

const oneBoc = 'b5ee9c72410106010055000114ff00f4a413f4bcf2c80b010201200302004ef2d31ff00101821079b0b258ba8e158308d71820f901f8414130f910f2e2bcf800f842d89130e20202d10504001f3b513434ffc07e18750c343b47be18a0000120ed5bde98'
const multiBoc = 'b5ee9c7241020a01000102000114ff00f4a413f4bcf2c80b010202d00302001bd7c80383a6465816503e5ffe4e8402012007040201200605002b1c321633c5be0a33c5b2c0327e119db232c13333326000233e11723b5134201035c8f3c5b2cff27b55200201200908004d3b513434ffc07e187e80007e18f4cfc07e19200835c874cfc07e197500743b47be18b50c3e19a000f30835d270482456f834c7fc00486084088d5b19aea38cdb0860c235c6083e407e10504c3e443cb8af3e117e112e7cb8afbc00c83c011da0063232c15633c59c3e80b2daf33260103ec0238b40608424f4deea2ea38800741d35c87e900c087c00fc010071c17cb8af7e10fe1084b63e11693e197c00a456f8b8a0c03c18ca'
const helperBoc = 'b5ee9c7241010601007f000114ff00f4a413f4bcf2c80b010202d1030200214f843c8f841cf16f842cf16ca00c9ed548020120050400273b51343e90007e187e90007e18b480007e18f46000790c3c00741d35c87e900c3e108071c17cb8af3e10fcb4af5ffe18e08424f4deea1c20063232c17e10b3c5887e80b2dab2c7fe1073c5b260103ec03c00a051acd827'

export class Coupon {
    private _wallet: TonConnectUI

    private _client: TonClient

    constructor (wallet: TonConnectUI, isTestnet: boolean) {
        this._wallet = wallet

        this._client = new TonClient({
            endpoint: isTestnet
                ? 'https://testnet.tonhubapi.com/jsonRPC'
                : 'https://mainnet.tonhubapi.com/jsonRPC'
        })
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

        const transactionTon: SendTransactionRequest = {
            validUntil: Date.now() + 1000000,
            messages: [
                {
                    address: Address.parseFriendly(data.address.toString()).address.toString(),
                    amount: _amount.toString(),
                    stateInit: initString
                }
            ]
        }

        console.log('address', data)

        console.log('address', data.address.toString())

        try {
            const tx = await this._wallet.sendTransaction(transactionTon)
            console.log('tx', tx)

            const storage = new StorageWallet()
            const couponData = {
                publicKey: keypair.publicKey,
                address: data.address.toString(),
                amount: _amount.toString(),
                type: 'one'
            }

            // if (tx.error) {
            //     toast.error('Failed to create check')
            //     return false
            // }
            storage.save('coupons', JSON.stringify(couponData))

            // if (tx) {
            //     toast.success('Check created successfully.')
            // }
            return data.address.toString()
        } catch (error) {
            // toast.error('Failed to create check')
            console.error('deploy', error)
            return false
        }
    }

    public async claim (address: string, addressForUser: string, passwordString: string): Promise<boolean> {
        const seed: Buffer = await sha256(passwordString)
        const keypair: KeyPair = keyPairFromSeed(seed)

        const addressFor = Address.parse(addressForUser)

        const signature = sign(beginCell().storeAddress(addressFor).endCell().hash(), keypair.secretKey)

        const oneTimeCheque = OneTimeCheque.createFromAddress(Address.parse(address))

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

    public static async getSumCoupon (address: string): Promise<string> {
        try {
            const client = new TonClient({ endpoint: 'https://testnet.tonhubapi.com/jsonRPC' })
            const bl = await client.getBalance(Address.parse(address))
            return bl.toString()
        } catch (error) {
            return '0'
        }
    }

    public async deployMulti (
        passwordString: string,
        one_use_amount: string | number,
        number_of_uses: string | number
    ): Promise<string | boolean> {
        const seed: Buffer = await sha256(passwordString)
        const keypair: KeyPair = keyPairFromSeed(seed)

        const _one_use_amount = toNano(one_use_amount)
        const _number_of_uses = BigInt(number_of_uses)
        const _amount = _number_of_uses * _one_use_amount + toNano('0.05')

        const data = MultiCheque.createFromConfig(
            {
                publicKey: keypair.publicKey,
                claimCont: ClaimFunctionsMulti.toncoin,
                chequeAmount: _one_use_amount,
                activaitions: _number_of_uses,
                helperCode: Cell.fromBoc(Buffer.from(helperBoc, 'hex'))[0]
            },
            Cell.fromBoc(Buffer.from(multiBoc, 'hex'))[0]
        )

        if (!data.init) {
            console.error('data.init null', data)
            return false
        }

        const stateInit: StateInit  = {
            code: data.init.code,
            data: data.init.data
        }

        const initString = beginCell().storeWritable(storeStateInit(stateInit)).endCell().toBoc()
            .toString('base64')

        const transactionTon: SendTransactionRequest = {
            validUntil: Date.now() + 1000000,
            messages: [
                {
                    address: Address.parseFriendly(data.address.toString()).address.toString(),
                    amount: _amount.toString(),
                    stateInit: initString
                }
            ]
        }

        console.log('address', data)

        console.log('address', data.address.toString())

        try {
            const tx = await this._wallet.sendTransaction(transactionTon)
            console.log('tx', tx)

            const storage = new StorageWallet()
            const couponData = {
                publicKey: keypair.publicKey,
                address: data.address.toString(),
                amount: _amount.toString(),
                type: 'multi'
            }

            // if (tx.error) {
            //     toast.error('Failed to create Multicheck')
            //     return false
            // }

            storage.save('coupons', JSON.stringify(couponData))

            // if (tx) {
            //     toast.success('Multicheck created successfully.')
            // }
            return data.address.toString()
        } catch (error) {
            // toast.error('Failed to create Multicheck')
            console.error('deployMulti', error)
            return false
        }
    }

    public async claimMulti (address: string, addressForUser: string, passwordString: string): Promise<boolean> {
        const seed: Buffer = await sha256(passwordString)
        const keypair: KeyPair = keyPairFromSeed(seed)

        const addressFor = Address.parse(addressForUser)

        const signature = sign(beginCell().storeAddress(addressFor).endCell().hash(), keypair.secretKey)

        const payload = beginCell()
            .storeUint(0x22356c66, 32) // TODO
            .storeBuffer(signature)
            .storeAddress(addressFor)
            .endCell()

        const transactionTon: SendTransactionRequest = {
            validUntil: Date.now() + 1000000,
            messages: [
                {
                    address: Address.parseFriendly(address.toString()).address.toString(),
                    amount: toNano('0.05').toString(),
                    payload: payload.toBoc().toString('base64')
                }
            ]
        }

        try {
            const tx = await this._wallet.sendTransaction(transactionTon)
            console.log('tx', tx)

            if (tx) {
                toast.success('Coupon activated successfully.')
            } else {
                toast.error('Failed to activated coupon')
            }
            return true
        } catch (error) {
            toast.error('Failed to activated coupon')
            console.error('claimMulti', error)
            return false
        }
    }
}
