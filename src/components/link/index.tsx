import { FC, CSSProperties, useState, useEffect } from 'react'

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
    // const telegramText: CSSProperties = useTextTelegram(isTg)

    const [ style, setStyle ] = useState({})
    const [ styleLink, setStyleLink ] = useState({})

    useEffect(() => {
        if (isTg) {
            setStyle({
                backgroundColor: 'var(--tg-theme-link-color)',
                important: 'true'
            })
        } else {
            setStyle({})
        }
    }, [ isTg ])

    useEffect(() => {
        if (isTg) {
            setStyleLink({
                color: 'var(--tg-theme-link-color)',
                important: 'true'
            })
        } else {
            setStyleLink({})
        }
    }, [ isTg ])

    return (
        <a href={href} target="_blank" className={s.link} style={style}>
            <div className={s.linkBody}>
                {icon && <img src={icon} className={s.linkImg} alt={iconAlt} />}
                <span className={s.linkTitle} style={styleLink}>{text}</span>
            </div>
            <img src={LinkIcon} alt="link icon" />
        </a>
    )
}
