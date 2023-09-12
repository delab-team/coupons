/* eslint-disable import/no-cycle */
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TonConnectButton } from '@tonconnect/ui-react'

import { Button } from '../../components/ui/button'
import { CheckCard } from '../../components/check-card'
import { Check } from '../../components/check'
import { Multichecks } from '../../components/multichecks'

import { ROUTES } from '../../utils/router'

import { useMediaQuery } from '../../hooks/use-media-query'

import { StorageWallet } from '../../logic/storage'

import PLUS from '../../assets/images/your-checks/plus.svg'

import s from './your-checks-page.module.scss'
import { useTonAddress } from '../../hooks/useTonAdress'

export interface CouponDataType {
    // sum: number;
    id: string;
    address: string;
    typeCheck: 'Personal' | 'Multicheck';
    userAddress: string;
    date: number;
}

export interface MultiDataType {
    address: string;
    amountActivation: string;
    id: string;
    // oneActivation: string;
    typeCheck: 'Personal' | 'Multicheck';
}

export interface SelectedDataType {
    id: string;
    selected: string;
}

interface YourChecksPageType {
    isTestnet: boolean;
}

export const YourChecksPage: FC<YourChecksPageType> = ({ isTestnet }) => {
    const [ selectedCheckCard, setSelectedCheckCard ] = useState<SelectedDataType>({
        id: '',
        selected: ''
    })

    const [ checks, setChecks ] = useState<any[]>([])
    const storageWallet = new StorageWallet()
    const rawAddress = useTonAddress(false)

    useEffect(() => {
        const allCoupons = storageWallet.getAllCoupons()

        setChecks(allCoupons)
    }, [])
    const isMobile = useMediaQuery(768)

    const navigate = useNavigate()

    const handleCheckCardClick = (id: string, selected: string) => {
        setSelectedCheckCard({ id, selected })
    }

    const renderPopupComponent = () => {
        if (selectedCheckCard.selected === 'Multicheck') {
            return <Multichecks selectedCheckCard={selectedCheckCard} setSelectedCheckCard={setSelectedCheckCard} isTestnet={isTestnet} />
        } if (selectedCheckCard.selected === 'Personal') {
            return <Check selectedCheckCard={selectedCheckCard} setSelectedCheckCard={setSelectedCheckCard} isTestnet={isTestnet} />
        }
        return null
    }

    return (
        <section className={s.yourChecks}>
            <div className={s.yourChecksBody}>
                <div className={s.yourChecksTop}>
                    <div className={s.headerActions}>
                        <h1 className={s.headerTitle}>DeCoupons</h1>

                        <div className={s.headerContainer}>
                            {!isMobile && (
                                <Button
                                    variant="small-button"
                                    startIcon={PLUS}
                                    onClick={() => navigate(ROUTES.CREATE_CHECK)}
                                />
                            )}
                            <TonConnectButton />
                        </div>
                    </div>
                    <div className={s.checkTop}>
                        <h2 className={s.subtitle}>Your checks</h2>
                        {isMobile && (
                            <div className={s.actionButton}>
                                <Button
                                    variant="small-button"
                                    startIcon={PLUS}
                                    onClick={() => navigate(ROUTES.CREATE_CHECK)}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <ul className={`${s.checkList} ${checks.length > 1 ? s.checkLists : ''}`}>
                    {checks.length < 1 ? (
                        <div className={s.pureCheck}>Your check list is empty</div>
                    ) : (
                        checks.map((el, index) => (
                            el.userAddress === rawAddress && (
                                <CheckCard
                                    key={el.id} el={el}
                                    index={index + 1} handleCheckCardClick={handleCheckCardClick} isTestnet={isTestnet} />
                            )
                        ))
                    )}
                </ul>

            </div>

            {renderPopupComponent()}
        </section>
    )
}
