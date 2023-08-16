import { FC, useEffect, useState } from 'react'

// eslint-disable-next-line import/no-cycle
import { CouponDataType } from '../../pages/your-checks-page'

import CHECK_IMG from '../../assets/images/checks/checklist.svg'
import CHEVRON_RIGHT from '../../assets/images/checks/chevron_right.svg'

import TokenPriceHook from '../../hooks/token-price-hook'

import { Coupon } from '../../logic/coupon'

import { fixAmount } from '../../utils/fix-amount'

import s from './check-card.module.scss'

interface CheckCardProps {
    el: CouponDataType;
    index: number;
    handleCheckCardClick: (id: string, selected: string) => void;
}

export const CheckCard: FC<CheckCardProps> = ({
    el,
    index,
    handleCheckCardClick
}) =>  {
    const [ bal, setBal ] = useState<string>('0')

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const bl = await Coupon.getSumCoupon(el.address)
                setBal(bl)
            } catch (error) {
                console.error(error)
                setBal('0')
            }
        }

        fetchBalance()
    }, [ el.address ])

    return (<li
        className={s.check}
        onClick={() => handleCheckCardClick(el?.id, el?.typeCheck)}
    >
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
                <p className={s.checkTitle}>Check #{index}</p>
                <p className={s.checkSum}>
                    Sum: {fixAmount(bal)} TON
                     {/* (<TokenPriceHook tokenAmount={Number(fixAmount(bal))} />) */}
                </p>
            </div>
        </div>
        <img
            src={CHEVRON_RIGHT}
            className={s.checkChevron}
            alt="chevron right"
        />
    </li>)
}
