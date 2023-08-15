import { FC, useState } from 'react'

import { Link } from 'react-router-dom'

import { useMediaQuery } from '../../hooks/use-media-query'

// import WRITE_OUTLINE from '../../assets/images/main-actions/write_outline.svg'
// import SCAN_VIEWFINDER from '../../assets/images/main-actions/scan_viewfinder.svg'
// import SETTINGS from '../../assets/images/main-actions/settings.svg'

import { MenuSvgSelector } from '../../assets/icons/menu-svg-selector'

import { ROUTES } from '../../utils/router'

import s from './main-actions.module.scss'

interface MainActionsProps {}

const mobileMenu = [
    {
        id: 14124,
        path: ROUTES.YOUR_CHECKS,
        icon: 'checks'
    },
    {
        id: 12357,
        path: ROUTES.ACTIVATE,
        icon: 'activate'
    },
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
    {
        id: 12357,
        path: ROUTES.ACTIVATE,
        icon: 'activate',
        content: 'Activate'
    },
    {
        id: 17147,
        path: ROUTES.SETTINGS,
        icon: 'settings',
        content: 'Settings'
    },
    {
        id: 17147,
        path: ROUTES.QR_SCANNER,
        icon: 'scanner',
        content: 'Scanner'
    }
]

export const MainActions: FC<MainActionsProps> = () => {
    const isMobile = useMediaQuery(768)

    const path = window.location.pathname

    const [ activeLink, setActiveLink ] = useState<string>(path)

    return (
        <>
            {isMobile ? (
                <nav className={s.menuMobile}>
                    {mobileMenu.map(el => (
                        <Link to={el.path} key={`mobile-el-${el.id}`}>
                            <button className={s.menuMobileButton}>
                                <MenuSvgSelector id={el.icon} />
                            </button>
                        </Link>
                    ))}
                </nav>
            ) : (
                <nav className={s.menuPc}>
                    {pcMenu.map(el => (
                        <Link to={el.path} key={`pc-el-${el.id}`}>
                            <button
                                className={`${s.menuPcButton} ${activeLink === el.path ? s.activeLink : ''}`}
                                onClick={() => setActiveLink(el.path)}>
                                <MenuSvgSelector id={el.icon} />
                                <span>{el.content}</span>
                            </button>
                        </Link>
                    ))}
                </nav>
            )}
        </>
    )
}
