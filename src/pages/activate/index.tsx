import { FC, useEffect, useState } from 'react'
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'

import { toast } from 'react-toastify'

import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'

import s from './activate-page.module.scss'
import { Coupon } from '../../logic/coupon'
import { MainTitle } from '../../components/main-title'
import { fixAmount } from '../../utils/fix-amount'
import { ROUTES } from '../../utils/router'
import { useAuth } from '../../hooks/useAuth'
import { Select } from '../../components/ui/select'

interface YourChecksPageProps {
    address: string;
    balance: string | undefined;
    setAddress: Function;
    isTestnet: boolean;
}

export const Activate: FC<YourChecksPageProps> = ({ address, balance, setAddress, isTestnet }) => {
    const [ psw, setPsw ] = useState<string>('')
    const [ pswError, setPswError ] = useState<string>('')

    const noRamAddres = useTonAddress()

    const [ bal, setBal ] = useState<string>('0')

    const [ tonConnectUI, setOptions ] = useTonConnectUI()

    const navigate = useNavigate()
    const auth = useAuth()
    const location = useLocation()

    const [ checkType, setCheckType ] = useState<'Personal' | 'Multicheck'>('Personal')

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
        setCheckType(value as 'Personal' | 'Multicheck')
    }

    async function activateCoupon () {
        if (psw === '') {
            return undefined
        }

        const ch = new Coupon(tonConnectUI, isTestnet)

        try {
            let tx

            if (checkType === 'Personal') {
                tx = await ch.claim(address, noRamAddres.toString(), psw)
            } else if (checkType === 'Multicheck') {
                tx = await ch.claimMulti(address, noRamAddres.toString(), psw)
            }

            if (tx) {
                toast.success('Sent for password verification')
                navigate(ROUTES.YOUR_CHECKS)
            } else {
                toast.error('Failed to activate coupon')
            }

            return tx
        } catch (error) {
            console.log('error', error)
            toast.error('Failed to activate coupon')
            throw error
        }
    }

    useEffect(() => {
        const query = new URLSearchParams(location.search)
        const queryAddress = query.get('a')

        if (queryAddress) {
            if (auth) {
                navigate(ROUTES.ACTIVATE)
                setAddress(queryAddress)
            } else {
                navigate(`${ROUTES.LOGIN}?a=${queryAddress}`)
            }
        }
    }, [ location.search, auth, setAddress, navigate ])

    async function claimMulti () {
        if (psw === '') {
            return undefined
        }
        const ch = new Coupon(tonConnectUI, isTestnet)

        try {
            const tx = await ch.claimMulti(address, noRamAddres.toString(), psw)

            if (tx) {
                toast.success('Sent for password verification')
                navigate(ROUTES.YOUR_CHECKS)
            } else {
                toast.error('Failed to activated coupon #2')
            }
        } catch (error2) {
            console.log('error', error2)
            toast.error('Failed to activated coupon')
        }
    }

    async function claim () {
        if (psw === '') {
            return undefined
        }
        const ch = new Coupon(tonConnectUI, isTestnet)

        try {
            const tx = await ch.claim(address, noRamAddres.toString(), psw)

            if (tx) {
                toast.success('Sent for password verification')
                navigate(ROUTES.YOUR_CHECKS)
            } else {
                toast.error('Failed to activated coupon #2')
            }
        } catch (error) {
            console.log(error)
            toast.success('Failed to activated coupon #4')
            // try {
            //     const tx = await ch.claimMulti(address, noRamAddres.toString(), psw)

            //     if (tx) {
            //         toast.success('Sent for password verification')
            //         navigate(ROUTES.YOUR_CHECKS)
            //     } else {
            //         toast.error('Failed to activated coupon #2')
            //     }
            // } catch (error2) {
            //     console.log('error', error2)
            //     toast.error('Failed to activated coupon')
            // }
        }
        return true
    }

    useEffect(
        () => () => {
            setAddress('')
        },
        []
    )

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const bl = await Coupon.getSumCoupon(address, isTestnet)
                setBal(bl)
            } catch (error) {
                console.error(error)
                setBal('0')
            }
        }

        fetchBalance()
    }, [ address ])

    const handlePasswordChange = (newPassword: string) => {
        setPsw(newPassword)

        if (newPassword.trim() === '') {
            setPswError('Password cannot be empty')
        } else {
            setPswError('')
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (psw.trim() === '') {
            setPswError('Password cannot be empty')
        } else {
            setPswError('')
            activateCoupon()
        }
    }

    return (
        <section>
            <div className={s.headerForm}>
                <MainTitle title="Activate" />
                <TonConnectButton />
            </div>

            <div>
                Balance coupon {fixAmount(bal)} TON
            </div>
            <br />
            <form className={s.form} onSubmit={handleSubmit}>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>Choose the type of check</label>
                    <Select
                        options={options}
                        value={checkType}
                        onChange={handleSelectChange}
                    />
                </div>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>Password</label>
                    <input
                        type="password"
                        placeholder='password'
                        className={s.formInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePasswordChange(e.target.value)}
                        value={psw}
                    />
                    {pswError && <p className={s.errorText}>{pswError}</p>}
                </div>
                <Button variant={'primary-button'} type="submit">Activate</Button>
            </form>
        </section>
    )
}
