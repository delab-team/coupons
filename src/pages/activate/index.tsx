import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeLabAddress, DeLabConnect } from '@delab-team/connect'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { TonConnectUIProvider, useTonAddress } from '@tonconnect/ui-react'

import { Button } from '../../components/ui/button'
import { Profile } from '../../components/profile'

import { useMediaQuery } from '../../hooks/use-media-query'

import s from './activate-page.module.scss'
import { Coupon } from '../../logic/coupon'
import { MainTitle } from '../../components/main-title'

interface YourChecksPageProps {
    address: string;
    wallet: DeLabConnect;
    balance: string | undefined;
    addressWallet: DeLabAddress;
}

export const Activate: FC<YourChecksPageProps> = ({ address, wallet, balance, addressWallet }) => {
    const [ selectedCheckCard, setSelectedCheckCard ] = useState<null | string>(null)

    const [ psw, setPsw ] = useState<string>('')

    const noRamAddres = useTonAddress()

    const [ checks, setChecks ] = useState([])

    const [ tonConnectUI, setOptions ] = useTonConnectUI()

    const isMobile = useMediaQuery(768)

    const navigate = useNavigate()

    async function claim () {
        if (psw === '') {
            return undefined
        }
        const ch = new Coupon(tonConnectUI)

        const tx = await ch.claim(address, noRamAddres.toString(), psw)
        return true
    }

    return (
        <section>
            <div className={s.headerForm}>
                <MainTitle title="Activate" />
                <Profile address={addressWallet} balance={balance} />
            </div>
            <form className={s.form} onSubmit={() => {}}>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>
                        Password
                    </label>
                    <input
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
