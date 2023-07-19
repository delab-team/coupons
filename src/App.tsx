import { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { YourChecksPage } from './pages/your-checks-page';
import { SettingsPage } from './pages/settings-page';
import { CreateCheckPage } from './pages/create-check-page';
import { QrScannerPage } from './pages/qr-scanner';

import { Layout } from './layout';

import { ROUTES } from './utils/router';

interface AppProps {}

export const App: FC<AppProps> = ({}) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.YOUR_CHECKS} element={<YourChecksPage />} />
          <Route path={ROUTES.CREATE_CHECK} element={<CreateCheckPage />} />
          <Route path={ROUTES.QR_SCANNER} element={<QrScannerPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
