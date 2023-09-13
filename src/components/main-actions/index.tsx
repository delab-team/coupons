import { FC, useState, CSSProperties, useEffect } from 'react'

import { Link } from 'react-router-dom'

import { useMediaQuery } from '../../hooks/use-media-query'
import { useBg2Telegram } from '../../hooks/useBg2Telegram'
import { useTextTelegram } from '../../hooks/useTextTelegram'

// import WRITE_OUTLINE from '../../assets/images/main-actions/write_outline.svg'
// import SCAN_VIEWFINDER from '../../assets/images/main-actions/scan_viewfinder.svg'
// import SETTINGS from '../../assets/images/main-actions/settings.svg'

import { SvgSelector } from '../../assets/icons/svg-selector'

import { ROUTES } from '../../utils/router'

import s from './main-actions.module.scss'

interface MainActionsProps {
    isTg: boolean;
}

const mobileMenu = [
    {
        id: 14124,
        path: ROUTES.YOUR_CHECKS,
        icon: 'checks'
    },
    // {
    //     id: 12357,
    //     path: ROUTES.ACTIVATE,
    //     icon: 'activate'
    // },
    {
        id: 15677,
        path: ROUTES.QR_SCANNER,
        icon: 'scanner'
    },
    {
        id: 12345,
        path: ROUTES.SETTINGS,
        icon: 'settings'
    }
]

const pcMenu = [
    {
        id: 12671,
        path: ROUTES.YOUR_CHECKS,
        icon: 'checks',
        content: 'Checks'
    },
    // {
    //     id: 12357,
    //     path: ROUTES.ACTIVATE,
    //     icon: 'activate',
    //     content: 'Activate'
    // },
    {
        id: 17155,
        path: ROUTES.QR_SCANNER,
        icon: 'scanner',
        content: 'Scanner'
    },
    {
        id: 17147,
        path: ROUTES.SETTINGS,
        icon: 'settings',
        content: 'Settings'
    }
]

export const MainActions: FC<MainActionsProps> = ({ isTg }) => {
    const isMobile = useMediaQuery(768)

    const path = window.location.pathname

    const telegramBG: CSSProperties = useBg2Telegram(isTg)
    const telegramText: CSSProperties = useTextTelegram(isTg)

    const [ activeLink, setActiveLink ] = useState<string>(path)

    const [ style, setStyle ] = useState({})

    useEffect(() => {
        if (isTg) {
            setStyle({
                backgroundColor: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)',
                important: 'true'
            })
        } else {
            setStyle({})
        }
    }, [ isTg ])

    return (
        <>
            {isMobile ? (
                <nav className={s.menuMobile} style={style}>
                    {mobileMenu.map(el => (
                        <Link to={el.path} key={`mobile-el-${el.id}`} style={telegramText}>
                            <button className={s.menuMobileButton}>
                                <SvgSelector id={el.icon} />
                            </button>
                        </Link>
                    ))}
                </nav>
            ) : (
                <nav className={s.menuPc} style={style}>
                    {pcMenu.map(el => (
                        <Link to={el.path} key={`pc-el-${el.id}`}>
                            <button
                                className={`${s.menuPcButton} ${
                                    activeLink === el.path ? s.activeLink : ''
                                }`}
                                onClick={() => setActiveLink(el.path)}
                            >
                                <SvgSelector id={el.icon} />
                                <span style={telegramText}>{el.content}</span>
                            </button>
                        </Link>
                    ))}
                </nav>
            )}
        </>
    )
}
