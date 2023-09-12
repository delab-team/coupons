import { FC, useEffect, useState } from 'react'
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/select'
import { MainTitle } from '../../components/main-title'

import { fixAmount } from '../../utils/fix-amount'
import { ROUTES } from '../../utils/router'

import { useAuth } from '../../hooks/useAuth'

import { Coupon } from '../../logic/coupon'

import s from './activate-page.module.scss'

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

    const [ checkType, setCheckType ] = useState<'Personal' | 'Multicheck' | ''>('')
    const [ usage, setUsage ] = useState<number>(0)

    const coupon = new Coupon(tonConnectUI, isTestnet)

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
                toast.error('Incorrect password')
            }

            return tx
        } catch (error) {
            console.log('error', error)
            toast.error('Incorrect password')
            throw error
        }
    }

    async function fetchUsage () {
        if (!address) return
        try {
            const res = await coupon.getSumActivation(address)
            if (typeof res === 'number') {
                setUsage(res)
                setCheckType('Multicheck')
            } else {
                setCheckType('Personal')
            }
        } catch (error) {
            console.error('Error fetching usage:', error)
        }
    }

    useEffect(() => {
        const query = new URLSearchParams(location.search)
        const queryAddress = query.get('a')

        if (queryAddress && noRamAddres) {
            navigate(`${ROUTES.ACTIVATE}?a=${queryAddress}`)
            setAddress(queryAddress)
        } else if (noRamAddres && address) {
            navigate(ROUTES.ACTIVATE)
            // setAddress(noRamAddres)
        } else {
            navigate(ROUTES.YOUR_CHECKS)
        }
        fetchUsage()
    }, [ noRamAddres, location.search, address ])

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
    }, [ address, location.search ])

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
        } else if (psw.length < 8) {
            setPswError('Password cannot be less than 8 symbols')
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
                Balance coupon: {fixAmount(bal)} TON
            </div>
            <br />
            {checkType === 'Multicheck' && (
                <>
                    <div className={s.item}>
                        <div className={s.title}>Number of activations:</div>
                        <div className={s.description}>{usage === 0 ? '0' : usage} times activated</div>
                    </div>
                    <br />
                </>
            )}
            <form className={s.form} onSubmit={handleSubmit}>
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
                <Button variant={'primary-button'} type="submit" disabled={bal === '0'}>Activate</Button>
            </form>
        </section>
    )
}
