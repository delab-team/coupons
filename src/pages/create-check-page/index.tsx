import { FC, useState, FormEvent, useEffect } from 'react'
import { DeLabAddress, DeLabConnect, DeLabTransaction, DeLabTypeConnect } from '@delab-team/connect'

import { Address, beginCell, Sender, toNano } from 'ton-core'
import { keyPairFromSeed, sign, KeyPair, sha256 } from 'ton-crypto'
import { MainTitle } from '../../components/main-title'
import { Select } from '../../components/ui/select'
import { Button } from '../../components/ui/button'

import TokenPriceHook from '../../hooks/token-price-hook'

import { fixAmount } from '../../utils/fix-amount'

import s from './create-check-page.module.scss'

import { ClaimFunctions, MultiCheque } from '../../logic/wrappers/MultiCheque'
import { OneTimeCheque } from '../../logic/wrappers/OneTimeCheque'
import { Coupon } from '../../logic/coupon'

interface CreateCheckPageProps {
    balance: string | undefined;
    DeLabConnector: DeLabConnect;
    typeConnect: DeLabTypeConnect;
    DeAddress: DeLabAddress;
}

interface FormValues {
    typeCheck: string;
    amount: number | string;
    password: string;
    address: string;
}

export const CreateCheckPage: FC<CreateCheckPageProps> = ({
    balance,
    DeLabConnector,
    typeConnect,
    DeAddress
}) => {
    console.log('🚀 ~ file: index.tsx:26 ~ DeLabConnector:', DeLabConnector)
    const [ values, setValues ] = useState<FormValues>({
        typeCheck: '',
        amount: '',
        password: '',
        address: ''
    })

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    const options = [
        {
            value: 'Personal',
            label: 'Personal'
        },
        {
            value: 'Multicheck',
            label: 'Multicheck'
        }
    ]

    const handleSelectChange = (value: string) => {
        setValues({ ...values, typeCheck: value })
    }

    const [ status, setStatus ] = useState<string>('')

    async function deploy () {
        const coupon = new Coupon(DeLabConnector)
        coupon.deployOne(values.password, values.amount)
    }

    useEffect(() => {
        if (values.typeCheck === 'Personal') {

        } else if (values.typeCheck === 'Multicheck') {

        }
    }, [ values.typeCheck ])

    return (
        <section>
            <MainTitle title="Create check" />
            <form className={s.form} onSubmit={() => {}}>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>Choose the type of check</label>
                    <Select options={options} value={values.typeCheck} onChange={handleSelectChange} />
                </div>

                <div className={s.formBlock}>
                    <label className={s.formLabel}>Send the amount of the receipt in TON</label>
                    <input
                        className={s.formInput}
                        placeholder="min. 0.00001 TON"
                        required
                        value={values.amount}
                        onChange={e => setValues({ ...values, amount: e.target.value })}
                    />
                    <div className={s.formSubtext}>
            balance: {fixAmount(balance ?? '0')} TON (
                        {balance ? <TokenPriceHook tokenAmount={Number(fixAmount(balance))} /> : 0})
                    </div>
                </div>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>Set a password</label>
                    <input
                        type="password"
                        className={s.formInput}
                        required
                        value={values.password}
                        onChange={e => setValues({ ...values, password: e.target.value })}
                    />
                </div>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>Link to an address</label>
                    <input
                        className={s.formInput}
                        value={values.address}
                        required
                        onChange={e => setValues({ ...values, address: e.target.value })}
                    />
                </div>
                <Button variant="primary-button" type="submit" onClick={() => deploy()}>
          Create a check
                </Button>
            </form>
        </section>
    )
}
