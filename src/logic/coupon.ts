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
const multiBoc = 'b5ee9c7241020d01000144000114ff00f4a413f4bcf2c80b010201620302000da119f1e003f08b0202cd0504001bd7c80383a6465816503e5ffe4e8402012009060201200807002b1c321633c5be0a33c5b2c0327e119db232c13333326000233e11723b5134201035c8f3c5b2cff27b55200201200b0a00573b513434ffc07e187e80007e18fe90007e19f4cfc07e19200835c874cfc07e197500743b47be18b50c3e19a001e70835d270482456f834c7c0b41d35c87e900c3c00486084088d5b19aea394c8608424f4deea2ea3864c487c00fc010071c17cb8af7e10fe1084b63e11693e197c00a38b4ca0841ee917e16ea3883e113e197e11f1c163855c20063232c17e11f3c5887e80b2dab26040283ec037a44c38b8b8c3600c00645b8308d71820f901f8414130f910f2e2bcf845f844b9f2e2bef00320f004768018c8cb0558cf1670fa02cb6bccc98040fb0077ba2c63'
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

    public static async getSumCoupon (address: string, isTestnet: boolean): Promise<string> {
        try {
            const client = new TonClient({
                endpoint: isTestnet
                    ? 'https://testnet.tonhubapi.com/jsonRPC'
                    : 'https://mainnet.tonhubapi.com/jsonRPC'
            })
            const bl = await client.getBalance(Address.parse(address))
            return bl.toString()
        } catch (error) {
            return '0'
        }
    }

    public async deployMulti (
        passwordString: string,
        one_use_amount: string | number,
        number_of_uses: string | number,
        rawAddress: string
    ): Promise<string | boolean> {
        const seed: Buffer = await sha256(passwordString)
        const keypair: KeyPair = keyPairFromSeed(seed)

        const _one_use_amount = toNano(one_use_amount)
        const _number_of_uses = BigInt(number_of_uses)
        const _amount = _number_of_uses * _one_use_amount + toNano('0.05')
        const _owner_address = Address.parse(rawAddress)

        const data = MultiCheque.createFromConfig(
            {
                publicKey: keypair.publicKey,
                claimCont: ClaimFunctionsMulti.toncoin,
                chequeAmount: _one_use_amount,
                ownerAddress: _owner_address,
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
            .storeUint(Opcodes.claim, 32)
            .storeBuffer(signature)
            .storeAddress(addressFor)
            .endCell()

        const transactionTon: SendTransactionRequest = {
            validUntil: Date.now() + 1000000,
            messages: [
                {
                    address: Address.parseFriendly(address.toString()).address.toString(),
                    amount: toNano('0.04').toString(),
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

    public async getSumActivation (address: string): Promise<number | Error> {
        try {
            const result = await this._client.runMethodWithError(
                Address.parse(address),
                'get_number_of_uses',
                []
            )

            if (result.exit_code !== 0) {
                console.error('An error occurred: exit code ', result.exit_code)
                return new Error('An error occurred: exit code ' + result.exit_code)
            }

            const usage = result.stack
            const amount = usage.readBigNumber()

            console.log(amount)

            return Number(amount)
        } catch (error) {
            console.error('An error occurred:', error)
            return new Error('An error occurred: ' + error)
        }
    }

    public async destroyMulti (address: string): Promise<boolean> {
        const payload = beginCell().storeUint(Opcodes.destroy, 32).endCell()

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
                toast.success('All balance coupon destroyed successfully..')
            } else {
                toast.error('Failed to destroy all coupon balance')
            }
            return true
        } catch (error) {
            toast.error('Failed to destroy all coupon balance')
            console.error('claimMulti', error)
            return false
        }
    }
}
