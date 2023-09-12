import { FC, CSSProperties } from 'react'

import { useTextTelegram } from '../../hooks/useTextTelegram'

import LinkIcon from '../../assets/images/settings/arrow-link.svg'

import s from './settings-link.module.scss'

interface LinkProps {
    icon?: string;
    iconAlt?: string;
    text: string;
    href: string;
    isTg: boolean;
}

export const Link: FC<LinkProps> = ({ icon, iconAlt, text, href, isTg }) => {
    const telegramText: CSSProperties = useTextTelegram(isTg)

    return (
        <a href={href} target="_blank" className={s.link}>
            <div className={s.linkBody}>
                {icon && <img src={icon} className={s.linkImg} alt={iconAlt} />}
                <span className={s.linkTitle} style={telegramText}>{text}</span>
            </div>
            <img src={LinkIcon} alt="link icon" />
        </a>
    )
}
