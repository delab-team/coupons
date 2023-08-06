import { FC } from 'react'

import CHECK_IMG from '../../assets/images/checks/checklist.svg'
import CHEVRON_RIGHT from '../../assets/images/checks/chevron_right.svg'

import s from './check-card.module.scss'

interface CheckCardProps {
    id: string;
    title: string;
    notifications: number;
    sum: string;
    type: string;
    handleCheckCardClick: (type: string) => void;
}

export const CheckCard: FC<CheckCardProps> = ({
    title,
    notifications,
    sum,
    type,
    handleCheckCardClick
}) => (
    <li className={s.check} onClick={() => handleCheckCardClick(type)}>
        <div className={s.checkBody}>
            <div className={s.checkNotifications}>
                {notifications > 0 && (
                    <div
                        className={`${s.checkNotificationsNumbers}, ${
                            notifications >= 10 ? s.checkNotificationsCounts : s.checkNotificationsCount
                        }`}
                    >
                        {notifications}
                    </div>
                )}
                <img src={CHECK_IMG} alt="check image" />
            </div>

            <div className={s.checkInfo}>
                <p className={s.checkTitle}>{title}</p>
                <p className={s.checkSum}>{sum}</p>
            </div>
        </div>
        <img
            src={CHEVRON_RIGHT}
            className={s.checkChevron}
            alt="chevron right"
        />
    </li>
)
