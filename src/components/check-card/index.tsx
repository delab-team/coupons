/* eslint-disable no-nested-ternary */
import { FC, useEffect, useState, CSSProperties } from 'react'

// eslint-disable-next-line import/no-cycle
import { CouponDataType } from '../../pages/your-checks-page'

import CHECK_IMG from '../../assets/images/checks/checklist.svg'
import CHEVRON_RIGHT from '../../assets/images/checks/chevron_right.svg'

import TokenPriceHook from '../../hooks/token-price-hook'
import { useBgTelegram } from '../../hooks/useBgTelegram'
import { useTextTelegram } from '../../hooks/useTextTelegram'

import { Coupon } from '../../logic/coupon'

import { fixAmount } from '../../utils/fix-amount'

import s from './check-card.module.scss'
import { MenuSvgSelector } from '../../assets/icons/menu-svg-selector'

interface CheckCardProps {
    el: CouponDataType;
    index: number;
    handleCheckCardClick: (id: string, selected: string) => void;
    isTestnet: boolean;
    isTg: boolean;
}

export const CheckCard: FC<CheckCardProps> = ({ el, index, handleCheckCardClick, isTestnet, isTg }) => {
    const [ bal, setBal ] = useState<string>('0')

    const [ inter, setInter ] = useState<any>(undefined)

    const telegramBG: CSSProperties = useBgTelegram(isTg)
    const telegramText: CSSProperties = useTextTelegram(isTg)

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const bl = await Coupon.getSumCoupon(el.address, isTestnet)
                setBal(bl)
            } catch (error) {
                console.error(error)
                setBal('0')
            }
        }

        if (inter) clearInterval(inter)
        const timer = setInterval(() => {
            Coupon.getSumCoupon(el.address, isTestnet).then((bl) => {
                setBal(bl)
            })
        }, 5000)

        setInter(timer)

        fetchBalance()
    }, [ el.address ])

    return (
        <li className={s.check} onClick={() => handleCheckCardClick(el?.id, el?.typeCheck)} style={telegramBG}>
            <div className={s.checkBody}>
                <div className={s.checkNotifications}>
                    {/* {notifications > 0 && (
                    <div
                        className={`${s.checkNotificationsNumbers}, ${
                            notifications >= 10 ? s.checkNotificationsCounts : s.checkNotificationsCount
                        }`}
                    >
                        {notifications}
                    </div>
                )} */}
                    <img src={CHECK_IMG} alt="check image" />
                </div>

                <div className={s.checkInfo}>
                    <p className={s.checkTitle} style={telegramText}>
                        {el.typeCheck === 'Personal'
                            ? 'Check'
                            : el.typeCheck === 'Multicheck'
                                ? 'Multicheck'
                                : null}
                        <span className={s.checkIndex} style={telegramText}>#{index}</span>
                    </p>
                    <p className={s.checkSum} style={telegramText}>
                        Sum: {fixAmount(bal)} TON (
                        <TokenPriceHook tokenAmount={Number(fixAmount(bal))} />)
                    </p>
                </div>
            </div>
            <MenuSvgSelector id="chevron-right" isTg={isTg} />
        </li>
    )
}
