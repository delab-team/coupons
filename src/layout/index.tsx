import { FC } from 'react'
import { Outlet } from 'react-router-dom'

import { useMediaQuery } from '../hooks/use-media-query'

import { MainActions } from '../components/main-actions'

import s from './layout.module.scss'

interface LayoutProps {
    isTg: boolean
}

export const Layout: FC<LayoutProps> = ({ isTg }) => {
    const isMobile = useMediaQuery(768)

    return (
        <main className={`${s.main} ${isMobile ? 'container-mobile' : 'container-pc'}`}>
            <div className={`${s.content}`}>
                <Outlet />
                <div className={s.actions}>
                    <MainActions isTg={isTg} />
                </div>
            </div>
        </main>
    )
}
