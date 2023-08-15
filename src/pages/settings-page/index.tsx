import { FC } from 'react'
import { DeLabConnect, DeLabAddress } from '@delab-team/connect'

import { MainTitle } from '../../components/main-title'
import { Link } from '../../components/link'
import { Button } from '../../components/ui/button'
import { Profile } from '../../components/profile'

import TelegramLogo from '../../assets/images/settings/telegram-logo.png'
import GithubLogo from '../../assets/images/settings/github-logo.png'
import LogOut from '../../assets/images/settings/log-out.svg'

import s from './settings-page.module.scss'

interface SettingsPageProps {
    DeLabConnector: DeLabConnect;
    isConnected: boolean;
    balance: string | undefined;
    address: DeLabAddress;
}

export const SettingsPage: FC<SettingsPageProps> = ({
    DeLabConnector,
    isConnected,
    balance,
    address
}) => (
    <section className={s.settings}>
        <div className={s.settingsHeader}>
            <MainTitle title="Settings" />
            <Profile address={address} balance={balance} />
        </div>
        <div className={s.settingsActions}>
            <Link
                href="https://web.telegram.org/"
                icon={TelegramLogo}
                iconAlt="Telegram Logo"
                text="Telegram"
            />
            <Link href="https://github.com/" icon={GithubLogo} iconAlt="Github Logo" text="Github" />
            {isConnected && (
                <Button
                    variant="black-button"
                    endIcon={LogOut}
                    onClick={() => {
                        localStorage.clear()
                        DeLabConnector.disconnect()
                    }}
                >
                  Sign out
                </Button>
            )}
        </div>

        <div className={s.settingsVersion}>v. 1.0</div>
    </section>
)
