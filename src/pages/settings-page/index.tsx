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
import { TonConnectButton } from '@tonconnect/ui-react'

interface SettingsPageProps {
    DeLabConnector: DeLabConnect;
    isConnected: boolean;
    balance: string | undefined;
    address: DeLabAddress;
    isTestnet: boolean;
}

export const SettingsPage: FC<SettingsPageProps> = ({
    DeLabConnector,
    isConnected,
    balance,
    address,
    isTestnet
}) => (
    <section className={s.settings}>
        <div className={s.settingsHeader}>
            <MainTitle title="Settings" />
            <TonConnectButton />
        </div>
        <div className={s.settingsActions}>
            <Link
                href="https://t.me/delab"
                icon={TelegramLogo}
                iconAlt="Telegram Logo"
                text="Telegram"
            />
            <Link href="https://github.com/delab-team" icon={GithubLogo} iconAlt="Github Logo" text="Github" />
        </div>

        <div className={s.settingsVersion}>v. 1.0</div>
        <div className={s.settingsVersion}>{isTestnet ? 'testnet' : 'mainnet'}</div>
    </section>
)
