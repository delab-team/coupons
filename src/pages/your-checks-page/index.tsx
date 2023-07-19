import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/button';
import { CheckCard } from '../../components/check-card';
import { Check } from '../../components/check';
import { Multichecks } from '../../components/multichecks';

import PLUS from '../../assets/images/your-checks/plus.svg';

import s from './your-checks.module.scss';
import { ROUTES } from '../../utils/router';

interface YourChecksPageProps {}

const data = [
  {
    id: '13sad',
    title: 'Check #1',
    notifications: 0,
    sum: 'Sum: 10 TON (17$)',
    type: 'multicheck',
  },
  {
    id: 'wqe123',
    title: 'Check #2',
    notifications: 1,
    sum: 'Sum: 10 TON (17$)',
    type: 'check',
  },
  {
    id: 'wqe1321',
    title: 'Check #3',
    notifications: 0,
    sum: 'Sum: 10 TON (17$)',
    type: 'check',
  }
];

export const YourChecksPage: FC<YourChecksPageProps> = ({}) => {
  const [selectedCheckCard, setSelectedCheckCard] = useState<null | string>(null);

  const navigate = useNavigate();

  const handleCheckCardClick = (type: string) => {
    setSelectedCheckCard(type);
  };

  const renderPopupComponent = () => {
    if (selectedCheckCard === 'multicheck') {
      return <Multichecks setSelectedCheckCard={setSelectedCheckCard} />;
    } else if (selectedCheckCard === 'check') {
      return <Check setSelectedCheckCard={setSelectedCheckCard} />;
    } else {
      return null;
    }
  };

  return (
    <section className={s.yourChecks}>
      <div className="container">
        <div className={s.headerActions}>
          <h1 className={s.headerTitle}>Create Check</h1>
          <Button variant="small-button" startIcon={PLUS} onClick={() => navigate(ROUTES.CREATE_CHECK)} />
        </div>
        <h2 className={s.subtitle}>Your checks</h2>
        <ul className={s.checkList}>
          {data.map((el) => (
            <CheckCard key={el.id} {...el} handleCheckCardClick={handleCheckCardClick} />
          ))}
        </ul>
      </div>

      {renderPopupComponent()}
    </section>
  );
};
