import { FC, useState } from 'react'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'
import { useNavigate } from 'react-router-dom'
import { v1 } from 'uuid'

import { MainTitle } from '../../components/main-title'
import { Select } from '../../components/ui/select'
import { Button } from '../../components/ui/button'
// import { Profile } from '../../components/profile'

import TokenPriceHook from '../../hooks/token-price-hook'

import { fixAmount } from '../../utils/fix-amount'

import { Coupon } from '../../logic/coupon'
import { StorageWallet } from '../../logic/storage'

import s from './create-check-page.module.scss'
import { useTonAddress } from '../../hooks/useTonAdress'

interface CreateCheckPageProps {
    balance: string | undefined;
    isTestnet: boolean;
}

interface FormValues {
    typeCheck: string;
    amount: string;
    password: string;
    oneActivation: string;
    amountActivation: string;
}

const DEFAULT_VALUES: FormValues = {
    typeCheck: 'Personal',
    amount: '0',
    password: '',
    oneActivation: '0',
    amountActivation: '0'
}

export const CreateCheckPage: FC<CreateCheckPageProps> = ({ balance, isTestnet }) => {
    const navigate = useNavigate()

    const [ values, setValues ] = useState<FormValues>(DEFAULT_VALUES)
    const [ errors, setErrors ] = useState<Record<string, string>>({})

    const [ isDeploying, setIsDeploying ] = useState<boolean>(false)

    const [ tonConnectUI, setOptions ] = useTonConnectUI()

    const rawAddress = useTonAddress(false)

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

    if (!balance) {
        return null
    }

    const deploy = () => {
        setIsDeploying(true)

        const coupon = new Coupon(tonConnectUI, isTestnet)
        const storageWallet = new StorageWallet()

        const couponKey = v1()

        if (!rawAddress) {
            return
        }

        coupon
            .deployOne(values.password, values.amount)
            .then((couponResult) => {
                const dataToSave = {
                    // sum: values.amount,
                    id: couponKey,
                    address: couponResult,
                    typeCheck: values.typeCheck,
                    userAddress: rawAddress,
                    date: Date.now()
                }

                if (couponResult) {
                    storageWallet.save(couponKey, dataToSave)
                    navigate('/')
                }
                setValues(DEFAULT_VALUES)
            })
            .catch((error) => {
                console.error('Error deploying:', error)
            })
            .finally(() => {
                setIsDeploying(false)
            })
    }

    const deployMultiCheck = () => {
        setIsDeploying(true)

        const multi = new Coupon(tonConnectUI, isTestnet)
        const storageWallet = new StorageWallet()

        const multiKey = v1()

        multi.deployMulti(values.password, values.oneActivation, values.amountActivation).then((multiResult) => {
            const dataToSave = {
                // oneActivation: values.oneActivation,
                amountActivation: values.amountActivation,
                address: multiResult,
                id: multiKey,
                typeCheck: values.typeCheck,
                userAddress: rawAddress,
                date: Date.now()
            }
            if (multiResult) {
                storageWallet.save(multiKey, dataToSave)
                navigate('/')
            }
            setValues(DEFAULT_VALUES)
        })
            .catch((error) => {
                console.error('Error deploying:', error)
            })
            .finally(() => {
                setIsDeploying(false)
            })
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const validationErrors: Record<string, string> = {}

        if (!values.typeCheck) {
            validationErrors.typeCheck = 'Type of check is required'
        } else if (values.typeCheck === 'Personal') {
            const validateAmount = (amount: string) => {
                const parsedAmount = parseFloat(amount)
                return /^\d+(\.\d+)?$/.test(amount) && parsedAmount >= 0.00001 && parsedAmount <= 100000.99999
            }

            if (!validateAmount(values.amount)) {
                validationErrors.amount = 'Invalid amount'
            }
        } else if (values.typeCheck === 'Multicheck') {
            const validateActivationAmount = (amount: string) => {
                const parsedAmount = parseFloat(amount)
                return /^\d+(\.\d+)?$/.test(amount) && parsedAmount >= 0.00001 && parsedAmount <= 1500000
            }

            if (!validateActivationAmount(values.oneActivation)) {
                validationErrors.oneActivation = 'Invalid amount'
            }

            if (!/^\d+$/.test(values.amountActivation)) {
                validationErrors.amountActivation = 'Amount must be an integer'
            } else if (!validateActivationAmount(values.amountActivation)) {
                validationErrors.amountActivation = 'Invalid amount'
            }
        }

        if (values.password.length < 8) {
            validationErrors.password = 'Password must be at least 8 characters long'
        } else if (!/[a-zA-Z]/.test(values.password)) {
            validationErrors.password = 'Password must include English letters'
        } else if (/[а-яА-Я]/.test(values.password)) {
            validationErrors.password = 'Password must not contain Russian characters'
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
        } else if (values.typeCheck === 'Personal') {
            deploy()
        } else if (values.typeCheck === 'Multicheck') {
            deployMultiCheck()
        }
    }

    return (
        <section>
            <div className={s.headerForm}>
                <MainTitle title="Create check" />
                {/* <Profile address={address} balance={balance} /> */}
                <TonConnectButton />
            </div>
            <form onSubmit={onSubmit} className={s.form}>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>Choose the type of check</label>
                    <Select
                        options={options}
                        value={values.typeCheck}
                        onChange={handleSelectChange}
                    />
                    {errors.typeCheck && <div className={s.error}>{errors.typeCheck}</div>}
                </div>

                {values.typeCheck === 'Personal' && (
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
                            {fixAmount(balance ?? '0')} TON (
                            {balance ? (
                                <TokenPriceHook tokenAmount={Number(fixAmount(balance))} />
                            ) : (
                                0
                            )}
                            )
                        </div>
                    </div>
                )}

                {values.typeCheck === 'Multicheck' && (
                    <div className={s.formBlock}>
                        <label className={s.formLabel}>Amount of one activation in TON</label>
                        <input
                            type="string"
                            name="oneActivation"
                            value={values.oneActivation}
                            onChange={e => setValues({ ...values, oneActivation: e.target.value })
                            }
                            className={s.formInput}
                        />
                        {errors.oneActivation && (
                            <div className={s.error}>{errors.oneActivation}</div>
                        )}
                    </div>
                )}

                {values.typeCheck === 'Multicheck' && (
                    <div className={s.formBlock}>
                        <label className={s.formLabel}>Number of activations</label>
                        <input
                            type="string"
                            name="activationAmount"
                            value={values.amountActivation}
                            onChange={e => setValues({ ...values, amountActivation: e.target.value })
                            }
                            className={s.formInput}
                        />
                        {errors.amountActivation && (
                            <div className={s.error}>{errors.amountActivation}</div>
                        )}
                    </div>
                )}

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
