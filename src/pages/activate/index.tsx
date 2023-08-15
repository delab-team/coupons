import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeLabAddress, DeLabConnect } from '@delab-team/connect'

import { Button } from '../../components/ui/button'
import { CheckCard } from '../../components/check-card'
import { Check } from '../../components/check'
import { Multichecks } from '../../components/multichecks'
import { Profile } from '../../components/profile'

import { ROUTES } from '../../utils/router'

import { useMediaQuery } from '../../hooks/use-media-query'

import { StorageWallet } from '../../logic/storage'

import PLUS from '../../assets/images/your-checks/plus.svg'

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

    const [ checks, setChecks ] = useState([])

    const isMobile = useMediaQuery(768)

    const navigate = useNavigate()

    async function claim () {
        if (!wallet.address) {
            return undefined
        }
        if (psw === '') {
            return undefined
        }
        const ch = new Coupon(wallet)

        const tx = await ch.claim(address, wallet.address.toString(), psw)
        return true
    }

    return (
        <section>
            <div className={s.headerForm}>
                <MainTitle title="Activate Check" />
                <Profile address={addressWallet} balance={balance} />
            </div>
            <form className={s.form} onSubmit={() => {}}>
                <div className={s.formBlock}>
                    <label className={s.formLabel}>
                    Set a password
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
