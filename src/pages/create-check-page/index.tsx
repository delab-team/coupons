import * as Yup from 'yup'
import { FC, useState, useEffect } from 'react'
import { DeLabAddress, DeLabConnect, DeLabTypeConnect } from '@delab-team/connect'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { v1 } from 'uuid'

import { MainTitle } from '../../components/main-title'
import { Select } from '../../components/ui/select'
import { Button } from '../../components/ui/button'
import { Profile } from '../../components/profile'

import TokenPriceHook from '../../hooks/token-price-hook'

import { fixAmount } from '../../utils/fix-amount'

import { Coupon } from '../../logic/coupon'
import { StorageWallet } from '../../logic/storage'

import s from './create-check-page.module.scss'

interface CreateCheckPageProps {
    balance: string | undefined;
    DeLabConnector: DeLabConnect;
    typeConnect: DeLabTypeConnect;
    address: DeLabAddress;
}

interface FormValues {
    typeCheck: string;
    amount: string;
    password: string;
}

const DEFAULT_VALUES: FormValues = {
    typeCheck: 'Personal',
    amount: '0',
    password: ''
}

export const CreateCheckPage: FC<CreateCheckPageProps> = ({
    balance,
    DeLabConnector,
    address
    // typeConnect
}) => {
    const navigate = useNavigate()

    const [ values, setValues ] = useState<FormValues>(DEFAULT_VALUES)
    const [ errors, setErrors ] = useState<Record<string, string>>({})

    const [ isDeploying, setIsDeploying ] = useState<boolean>(false)

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

    const deploy = () => {
        setIsDeploying(true)

        const coupon = new Coupon(DeLabConnector)
        const storageWallet = new StorageWallet()

        const couponKey = v1()

        coupon.deployOne(values.password, values.amount)
            .then((couponResult) => {
                const dataToSave = {
                    sum: values.amount,
                    id: couponKey,
                    address: couponResult,
                    typeCheck: values.typeCheck
                }

                if (couponResult) {
                    storageWallet.save(couponKey, dataToSave)
                }
                setValues(DEFAULT_VALUES)
                navigate('/')
            })
            .catch((error) => {
                console.error('Error deploying:', error)
            })
            .finally(() => {
                setIsDeploying(false)
            })
    }

    useEffect(() => {
        if (values.typeCheck === 'Personal') {
            //
        } else if (values.typeCheck === 'Multicheck') {
            //
        }
    }, [ values.typeCheck ])

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors: Record<string, string> = {}

        if (!values.typeCheck) {
            validationErrors.typeCheck = 'Type of check is required'
        }

        if (!/^\d+(\.\d+)?$/.test(values.amount)) {
            validationErrors.amount = 'Invalid amount'
        } else {
            const parsedAmount = parseFloat(values.amount)
            if (parsedAmount < 0.00001 || parsedAmount > 100000.99999) {
                validationErrors.amount = 'Invalid amount'
            }
        }

        if (values.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters long'
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else {
            deploy()
        }
    }

    return (
        <section>
            <div className={s.headerForm}>
                <MainTitle title="Create check" />
                <Profile address={address} balance={balance} />
            </div>
            <form onSubmit={onSubmit} className={s.form}>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>Choose the type of check</label>
                    <Select options={options} value={values.typeCheck} onChange={handleSelectChange} />
                    {errors.typeCheck && <div className={s.error}>{errors.typeCheck}</div>}
                </div>

                <div className={s.formBlock}>
                    <label className={s.formLabel}>Send the amount of the receipt in TON</label>
                    <input
                        type="string"
                        name="amount"
                        value={values.amount}
                        onChange={e => setValues({ ...values, amount: e.target.value })}
                        placeholder="min. 0.00001 TON"
                        className={s.formInput}
                    />
                    {errors.amount && <div className={s.error}>{errors.amount}</div>}
                    <div className={s.formSubtext}>
                        balance:
                        {fixAmount(balance ?? '0')} TON ({balance ? <TokenPriceHook tokenAmount={Number(fixAmount(balance))} /> : 0})
                    </div>
                </div>

                <div className={s.formBlock}>
                    <label className={s.formLabel}>Set a password</label>
                    <input
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={e => setValues({ ...values, password: e.target.value })}
                        className={s.formInput}
                    />
                    {errors.password && <div className={s.error}>{errors.password}</div>}
                </div>

                <Button type="submit" variant="primary-button" disabled={isDeploying}>
                    {isDeploying ? 'Creating...' : 'Create a check'}
                </Button>
            </form>
        </section>
    )
}
