import { FC, useEffect, useState } from 'react'
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'

import { toast } from 'react-toastify'

import { Button } from '../../components/ui/button'

import s from './activate-page.module.scss'
import { Coupon } from '../../logic/coupon'
import { MainTitle } from '../../components/main-title'

interface YourChecksPageProps {
    address: string;
    balance: string | undefined;
    setAddress: Function
}

export const Activate: FC<YourChecksPageProps> = ({ address, balance, setAddress }) => {
    console.log('🚀 ~ file: index.tsx:20 ~ address:', address)

    const [ psw, setPsw ] = useState<string>('')
    console.log('🚀 ~ file: index.tsx:24 ~ psw:', psw)

    const noRamAddres = useTonAddress()

    const [ tonConnectUI, setOptions ] = useTonConnectUI()

    async function claim () {
        if (psw === '') {
            return undefined
        }
        const ch = new Coupon(tonConnectUI)

        try {
            const tx = await ch.claim(address, noRamAddres.toString(), psw)

            if (tx) {
                toast.success('Sent for password verification')
            } else {
                toast.error('Failed to activated coupon')
            }
        } catch (error) {
            console.log('error', error)
            toast.error('Failed to activated coupon')
        }
        return true
    }

    useEffect(
        () => () => {
            setAddress('')
        },
        []
    )

    return (
        <section>
            <div className={s.headerForm}>
                <MainTitle title="Activate" />
                <TonConnectButton />
            </div>
            <form className={s.form} onSubmit={() => {}}>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder='password'
                        className={s.formInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPsw(e.target.value)} value={psw}
                    />
                </div>
                <Button variant={'primary-button'} onClick={() => claim()}>Activate</Button>
            </form>

        </section>
    )
}
