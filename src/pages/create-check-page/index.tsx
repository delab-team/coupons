import { FC, useState, FormEvent, useEffect } from 'react';

import { MainTitle } from '../../components/main-title';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';

import s from './create-check-page.module.scss';
import TokenPriceHook from '../../hooks/token-price-hook';
import { fixAmount } from '../../utils/fix-amount';

interface CreateCheckPageProps {
  balance: string | undefined;
}

interface FormValues {
  typeCheck: string;
  amount: number | string;
  password: string;
  address: string;
}

export const CreateCheckPage: FC<CreateCheckPageProps> = ({ balance }) => {
  const [values, setValues] = useState<FormValues>({
    typeCheck: '',
    amount: '',
    password: '',
    address: '',
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const options = [
    {
      value: 'Personal',
      label: 'Personal',
    },
    {
      value: 'Personal 2',
      label: 'Personal 2',
    },
  ];

  const handleSelectChange = (value: string) => {
    setValues({ ...values, typeCheck: value });
  };

  return (
    <section>
      <MainTitle title="Create check" />
      <form className={s.form} onSubmit={onSubmit}>
        <div className={s.formBlock}>
          <label className={s.formLabel}>Choose the type of check</label>
          <Select options={options} value={values.typeCheck} onChange={handleSelectChange} />
        </div>

        <div className={s.formBlock}>
          <label className={s.formLabel}>Send the amount of the receipt in TON</label>
          <input
            className={s.formInput}
            placeholder="min. 0.00001 TON"
            required
            value={values.amount}
            onChange={(e) => setValues({ ...values, amount: e.target.value })}
          />
          <div className={s.formSubtext}>balance: {fixAmount(balance ?? '0')} TON ({balance ? <TokenPriceHook tokenAmount={Number(fixAmount(balance))} /> : 0})</div>
        </div>
        <div className={s.formBlock}>
          <label className={s.formLabel}>Set a password</label>
          <input
            type="password"
            className={s.formInput}
            required
            value={values.password}
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
        </div>
        <div className={s.formBlock}>
          <label className={s.formLabel}>Link to an address</label>
          <input
            className={s.formInput}
            value={values.address}
            required
            onChange={(e) => setValues({ ...values, address: e.target.value })}
          />
        </div>
        <Button variant="primary-button" type="submit">
          Create a check
        </Button>
      </form>
    </section>
  );
};
