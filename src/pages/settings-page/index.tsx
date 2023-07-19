import { FC } from 'react';
import { DeLabConnect } from '@delab-team/connect';

import { MainTitle } from '../../components/main-title';
import { Link } from '../../components/link';
import { Button } from '../../components/ui/button';

import TelegramLogo from '../../assets/images/settings/telegram-logo.png';
import GithubLogo from '../../assets/images/settings/github-logo.png';
import LogOut from '../../assets/images/settings/log-out.svg';

import s from './settings-page.module.scss';

interface SettingsPageProps {
  DeLabConnector: DeLabConnect;
  isConnected: boolean;
}

export const SettingsPage: FC<SettingsPageProps> = ({ DeLabConnector, isConnected }) => {
  return (
    <section className={s.settings}>
      <MainTitle title="Settings" />
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
            onClick={() => DeLabConnector.disconnect()}
          >
            Sign out
          </Button>
        )}
      </div>

      <div className={s.settingsVersion}>v. 1.0</div>
    </section>
  );
};
