import { FC } from 'react'
import { TonConnectButton } from '@tonconnect/ui-react'

import { useMediaQuery } from '../../hooks/use-media-query'

import s from './login-page.module.scss'

interface LoginPageProps {
}

export const LoginPage: FC<LoginPageProps> = () => {
    const isMobile = useMediaQuery(768)

    return (
        <section>
            <div className={`${s.main} ${isMobile ? 'container-mobile' : 'container-pc'}`}>
                <div className={s.mainInner}>
                    <h1 className={s.mainLogo}>DeCoupons</h1>

                    <div className={s.mainButton}>
                        <TonConnectButton />
                    </div>
                </div>
            </div>
        </section>
    )
}
