import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeLabAddress, DeLabConnect } from '@delab-team/connect'
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'

import { Button } from '../../components/ui/button'

import { useMediaQuery } from '../../hooks/use-media-query'

import s from './activate-page.module.scss'
import { Coupon } from '../../logic/coupon'
import { MainTitle } from '../../components/main-title'

interface YourChecksPageProps {
    address: string;
    setAddress: (address: string) => void;
}

export const Activate: FC<YourChecksPageProps> = ({ address, setAddress }) => {
    console.log('🚀 ~ file: index.tsx:20 ~ address:', address)
    const [ selectedCheckCard, setSelectedCheckCard ] = useState<null | string>(null)

    const [ psw, setPsw ] = useState<string>('')
    console.log('🚀 ~ file: index.tsx:24 ~ psw:', psw)

    const noRamAddres = useTonAddress()

    const [ checks, setChecks ] = useState([])

    const [ tonConnectUI, setOptions ] = useTonConnectUI()

    async function claim () {
        if (psw === '') {
            return undefined
        }
        const ch = new Coupon(tonConnectUI)

        const tx = await ch.claim(address, noRamAddres.toString(), psw)
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
