import { FC } from 'react';

import s from './main-title.module.scss';

interface MainTitleProps {
  title: string;
}

export const MainTitle: FC<MainTitleProps> = ({ title }) => {
  return (
    <div className={s.mainTitle}>
      <h1>{title}</h1>
    </div>
  );
};