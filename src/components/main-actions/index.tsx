import { FC } from 'react';

import { Link } from 'react-router-dom';

import WRITE_OUTLINE from '../../assets/images/main-actions/write_outline.svg';
import SCAN_VIEWFINDER from '../../assets/images/main-actions/scan_viewfinder.svg';
import SETTINGS from '../../assets/images/main-actions/settings.svg';

import { ROUTES } from '../../utils/router';

import s from './main-actions.module.scss';

interface MainActionsProps {}

export const MainActions: FC<MainActionsProps> = ({}) => {
  return (
    <nav className={s.menu}>
      <Link to={ROUTES.YOUR_CHECKS}>
        <button className={s.menuButton}>
          <img src={WRITE_OUTLINE} alt="write outline" height={28} width={28} />
        </button>
      </Link>
      <Link to={ROUTES.QR_SCANNER}>
        <button className={s.menuButton}>
          <img src={SCAN_VIEWFINDER} alt="scan view finder" height={28} width={28} />
        </button>
      </Link>
      <Link to={ROUTES.SETTINGS}>
        <button className={s.menuButton}>
          <img src={SETTINGS} alt="settings" height={28} width={28} />
        </button>
      </Link>
    </nav>
  );
};
