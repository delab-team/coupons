import { FC, CSSProperties } from 'react'
import { TonConnectButton } from '@tonconnect/ui-react'

import { MainTitle } from '../../components/main-title'
import { Link } from '../../components/link'

import { useTextTelegram } from '../../hooks/useTextTelegram'

import TelegramLogo from '../../assets/images/settings/telegram-logo.png'
import GithubLogo from '../../assets/images/settings/github-logo.png'

import s from './settings-page.module.scss'

interface SettingsPageProps {
    isTestnet: boolean;
    isConnected: boolean;
    balance: string | undefined;
    isTg: boolean;
}

export const SettingsPage: FC<SettingsPageProps> = ({ isTestnet, isTg }) => {
    const telegramText: CSSProperties = useTextTelegram(isTg)

    return (
        <section className={s.settings}>
            <div className={s.settingsHeader}>
                <MainTitle title="Settings" isTg={isTg} />
                <TonConnectButton />
            </div>
            <div className={s.settingsActions}>
                <Link
                    href="https://t.me/delab"
                    icon={TelegramLogo}
                    iconAlt="Telegram Logo"
                    text="Telegram"
                    isTg={isTg}
                />
                <Link href="https://github.com/delab-team" icon={GithubLogo} iconAlt="Github Logo" text="Github" isTg={isTg} />
            </div>

            <div className={s.settingsVersion} style={telegramText}>v. 1.2</div>
            <div className={s.settingsVersion} style={telegramText}>{isTestnet ? 'testnet' : 'mainnet'}</div>
        </section>
    )
}
