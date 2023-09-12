import { FC, CSSProperties } from 'react'

import { useTextTelegram } from '../../hooks/useTextTelegram'

import s from './main-title.module.scss'

interface MainTitleProps {
    title: string;
    isTg: boolean;
}

export const MainTitle: FC<MainTitleProps> = ({ title, isTg }) => {
    const telegramText: CSSProperties = useTextTelegram(isTg)

    return (
        <div className={s.mainTitle}>
            <h1 style={telegramText}>{title}</h1>
        </div>
    )
}
