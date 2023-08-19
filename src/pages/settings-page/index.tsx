import { FC } from 'react'
import { TonConnectButton } from '@tonconnect/ui-react'

import { MainTitle } from '../../components/main-title'
import { Link } from '../../components/link'
import TelegramLogo from '../../assets/images/settings/telegram-logo.png'
import GithubLogo from '../../assets/images/settings/github-logo.png'
// import LogOut from '../../assets/images/settings/log-out.svg'

import s from './settings-page.module.scss'
import { DeLabAddress } from '@delab-team/connect'

interface SettingsPageProps {
    isTestnet: boolean;
    address: DeLabAddress;
    isConnected: boolean;
    balance: string | undefined;
}

export const SettingsPage: FC<SettingsPageProps> = ({ isTestnet, isConnected, address,  balance }) => (
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
