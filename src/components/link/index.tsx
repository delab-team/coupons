import { FC } from 'react';

import LinkIcon from '../../assets/images/settings/arrow-link.svg';

import s from './settings-link.module.scss';

interface LinkProps {
  icon?: string;
  iconAlt?: string;
  text: string;
  href: string;
}

export const Link: FC<LinkProps> = ({ icon, iconAlt, text, href }) => {
  return (
    <a href={href} target="_blank" className={s.link}>
      <div className={s.linkBody}>
        {icon && <img src={icon} className={s.linkImg} alt={iconAlt} />}
        <span className={s.linkTitle}>{text}</span>
      </div>
      <img src={LinkIcon} alt="link icon" />
    </a>
  );
};
