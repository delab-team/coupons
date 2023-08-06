import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DeLabAddress } from '@delab-team/connect'

import { Button } from '../../components/ui/button'
import { CheckCard } from '../../components/check-card'
import { Check } from '../../components/check'
import { Multichecks } from '../../components/multichecks'
import { Profile } from '../../components/profile'

import { ROUTES } from '../../utils/router'

import { useMediaQuery } from '../../hooks/use-media-query'

import PLUS from '../../assets/images/your-checks/plus.svg'

import s from './your-checks-page.module.scss'

interface YourChecksPageProps {
    balance: string | undefined;
    address: DeLabAddress;
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

export const YourChecksPage: FC<YourChecksPageProps> = ({ balance, address }) => {
    const [ selectedCheckCard, setSelectedCheckCard ] = useState<null | string>(null)

    const isMobile = useMediaQuery(768)

    const navigate = useNavigate()

    const handleCheckCardClick = (type: string) => {
        setSelectedCheckCard(type)
    }

    const renderPopupComponent = () => {
        if (selectedCheckCard === 'multicheck') {
            return <Multichecks setSelectedCheckCard={setSelectedCheckCard} />
        } if (selectedCheckCard === 'check') {
            return <Check setSelectedCheckCard={setSelectedCheckCard} />
        }
        return null
    }

    return (
        <section className={s.yourChecks}>
            <div className={s.yourChecksBody}>
                <div className={s.headerActions}>
                    <h1 className={s.headerTitle}>Create Check</h1>

                    <div className={s.headerContainer}>
                        {!isMobile && (
                            <Button
                                variant="small-button"
                                startIcon={PLUS}
                                onClick={() => navigate(ROUTES.CREATE_CHECK)}
                            />
                        )}
                        <Profile balance={balance} address={address} />
                    </div>
                </div>
                <h2 className={s.subtitle}>Your checks</h2>
                <ul className={s.checkList}>
                    {data.map(el => (
                        <CheckCard key={el.id} {...el} handleCheckCardClick={handleCheckCardClick} />
                    ))}
                    {isMobile && (
                        <div className={s.actionButton}>
                            <Button
                                variant="small-button"
                                startIcon={PLUS}
                                onClick={() => navigate(ROUTES.CREATE_CHECK)}
                            />
                        </div>
                    )}
                </ul>
            </div>

            {renderPopupComponent()}
        </section>
    )
}
