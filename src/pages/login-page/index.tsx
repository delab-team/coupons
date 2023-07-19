import { FC } from 'react';
import { DeLabConnect } from '@delab-team/connect';

import { Button } from '../../components/ui/button';

import s from './login-page.module.scss';

interface LoginPageProps {
  DeLabConnector: DeLabConnect;
}

export const LoginPage: FC<LoginPageProps> = ({ DeLabConnector }) => {
  return (
    <div className={`${s.main} container`}>
      <div className={s.mainInner}>
        <h1 className={s.mainLogo}>DeCoupons</h1>

        <Button variant="white-button" onClick={() => DeLabConnector.openModal()}>
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};
