import { FC } from 'react'
import { DeLabConnect } from '@delab-team/connect'

import { Button } from '../../components/ui/button'

import { useMediaQuery } from '../../hooks/use-media-query'

import s from './login-page.module.scss'

interface LoginPageProps {
    DeLabConnector: DeLabConnect;
}

export const LoginPage: FC<LoginPageProps> = ({ DeLabConnector }) => {
    const isMobile = useMediaQuery(768)

    return (
        <section>
            <div className={`${s.main} ${isMobile ? 'container-mobile' : 'container-pc'}`}>
                <div className={s.mainInner}>
                    <h1 className={s.mainLogo}>DeCoupons</h1>

                    <div className={s.mainButton}>
                        <Button variant="white-button" onClick={() => DeLabConnector.openModal()}>
            Connect Wallet
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
