import { FC, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Address, TonClient } from 'ton';
import { DeLabModal, DeLabButton, DeLabConnect } from '@delab-team/connect';

import {
  DeLabNetwork,
  DeLabTypeConnect,
  DeLabAddress,
  DeLabConnecting,
  DeLabTransaction,
  DeLabEvent,
} from '@delab-team/connect';

import { YourChecksPage } from './pages/your-checks-page';
import { SettingsPage } from './pages/settings-page';
import { CreateCheckPage } from './pages/create-check-page';
import { QrScannerPage } from './pages/qr-scanner-page';
import { LoginPage } from './pages/login-page';

import { Layout } from './layout';

import { ROUTES } from './utils/router';

interface AppProps {}

const DeLabConnector = new DeLabConnect('https://delabteam.com/', 'DeCoupons', 'testnet');

export const App: FC<AppProps> = ({}) => {
  const [firstRender, setFirstRender] = useState<boolean>(false);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<DeLabAddress>(undefined);
  const [network, setNetwork] = useState<DeLabNetwork>('testnet');
  const [balance, setBalance] = useState<string | undefined>(undefined);
  console.log('🚀 ~ file: App.tsx:36 ~ balance:', balance);
  const [typeConnect, setTypeConnect] = useState<DeLabTypeConnect>(undefined);

  function listenDeLab() {
    DeLabConnector.on('connect', async (data: DeLabEvent) => {
      setIsConnected(true);
      const connectConfig: DeLabConnecting = data.data;
      setAddress(connectConfig.address);
      setTypeConnect(connectConfig.typeConnect);
      setNetwork(connectConfig.network);

      if (connectConfig.address) {
        const client = new TonClient({ endpoint: 'https://testnet.tonhubapi.com/jsonRPC' });
        const bl = await client.getBalance(Address.parse(connectConfig.address));

        setBalance(bl.toString());
      }
    });
    DeLabConnector.on('disconnect', () => {
      setIsConnected(false);
      setAddress(undefined);
      setTypeConnect(undefined);
      setNetwork('testnet');
      console.log('disconnect');
    });

    DeLabConnector.on('error', (data: DeLabEvent) => {
      console.log('error', data.data);
    });

    DeLabConnector.on('error-transaction', (data: DeLabEvent) => {
      console.log('error-transaction', data.data);
    });

    DeLabConnector.on('error-toncoinwallet', (data: DeLabEvent) => {
      console.log('error-toncoinwallet', data.data);
    });

    DeLabConnector.on('error-tonhub', (data: DeLabEvent) => {
      console.log('error-tonhub', data.data);
    });

    DeLabConnector.on('error-tonkeeper', (data: DeLabEvent) => {
      console.log('error-tonkeeper', data.data);
    });

    DeLabConnector.loadWallet();
  }

  useEffect(() => {
    if (!firstRender && DeLabConnector) {
      setFirstRender(true);
      listenDeLab();
    }
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate(ROUTES.LOGIN);
    } else {
      navigate(ROUTES.YOUR_CHECKS);
    }
  }, [isConnected, history]);

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path={ROUTES.YOUR_CHECKS} element={<YourChecksPage />} />
          <Route path={ROUTES.CREATE_CHECK} element={<CreateCheckPage balance={balance} />} />
          <Route path={ROUTES.QR_SCANNER} element={<QrScannerPage />} />
          <Route
            path={ROUTES.SETTINGS}
            element={<SettingsPage DeLabConnector={DeLabConnector} isConnected={isConnected} />}
          />
        </Route>
        <Route path={ROUTES.LOGIN} element={<LoginPage DeLabConnector={DeLabConnector} />} />
      </Routes>
      <DeLabModal DeLabConnectObject={DeLabConnector} scheme={'dark'} />
    </>
  );
};
