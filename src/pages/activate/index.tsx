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

import s from './your-checks-page.module.scss'
import { Coupon } from '../../logic/coupon'

interface YourChecksPageProps {
    address: string;
    wallet: DeLabConnect;
}

const data = [
    {
        id: '13sad',
        title: 'Check #1',
        notifications: 0,
        sum: 'Sum: 10 TON (17$)',
        type: 'multicheck'
    },
    {
        id: 'wqe123',
        title: 'Check #2',
        notifications: 1,
        sum: 'Sum: 10 TON (17$)',
        type: 'check'
    },
    {
        id: 'wqe1321',
        title: 'Check #3',
        notifications: 0,
        sum: 'Sum: 10 TON (17$)',
        type: 'check'
    }
]

export const Activate: FC<YourChecksPageProps> = ({ address, wallet }) => {
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
        <section className={s.yourChecks}>
            <div className={s.yourChecksBody}>
                <input placeholder='password' onChange={(e) => setPsw(e.target.value)} value={psw} />
                <Button variant={'small-button'} onClick={() => claim()}>Activate</Button>
            </div>

        </section>
    )
}
