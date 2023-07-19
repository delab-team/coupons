import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { MainActions } from '../components/main-actions';

import s from './layout.module.scss';

interface LayoutProps {}

export const Layout: FC<LayoutProps> = ({}) => {
  return (
    <main>
      <div className={`${s.content} container`}>
        <Outlet />
        <div className={s.actions}>
          <MainActions />
        </div>
      </div>
    </main>
  );
};
