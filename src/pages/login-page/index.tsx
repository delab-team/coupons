import { FC, useEffect, CSSProperties } from 'react'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useMediaQuery } from '../../hooks/use-media-query'
import { useTonAddress } from '../../hooks/useTonAdress'
import { useTextTelegram } from '../../hooks/useTextTelegram'

import { ROUTES } from '../../utils/router'

import s from './login-page.module.scss'

interface LoginPageProps {
    isTg: boolean
}

export const LoginPage: FC<LoginPageProps> = ({ isTg }) => {
    const isMobile = useMediaQuery(768)

    const navigate = useNavigate()
    const location = useLocation()
    const RawAddress = useTonAddress()

    const telegramText: CSSProperties = useTextTelegram(isTg)

    useEffect(() => {
        const query = new URLSearchParams(location.search)
        const queryAddress = query.get('a')

        if (queryAddress && RawAddress) {
            navigate(`${ROUTES.ACTIVATE}?a=${queryAddress}`)
        } else if (RawAddress) {
            navigate(ROUTES.YOUR_CHECKS)
        }
    }, [ RawAddress, location.search, navigate ])

    return (
        <section>
            <div className={`${s.main} ${isMobile ? 'container-mobile' : 'container-pc'}`}>
                <div className={s.mainInner}>
                    <h1 className={s.mainLogo} style={telegramText}>DeCoupons</h1>

                    <div className={s.mainButton}>
                        <TonConnectButton />
                    </div>
                </div>
            </div>
        </section>
    )
}
