/* eslint-disable max-len */
import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Address, TonClient } from 'ton'
import {
    DeLabConnect,
    DeLabConnecting,
    DeLabEvent
} from '@delab-team/connect'

import { useTonAddress } from '@tonconnect/ui-react'

import { ToastContainer } from 'react-toastify'

import { YourChecksPage } from './pages/your-checks-page'
import { SettingsPage } from './pages/settings-page'
import { CreateCheckPage } from './pages/create-check-page'
import { QrScannerPage } from './pages/qr-scanner-page'
import { LoginPage } from './pages/login-page'
import { Activate } from './pages/activate'

import { Layout } from './layout'

import { ROUTES } from './utils/router'

import 'react-toastify/dist/ReactToastify.css'

const isTestnet = window.location.host.indexOf('localhost') >= 0 ? true : window.location.href.indexOf('testnet') >= 0

const DeLabConnector = new DeLabConnect('https://delabteam.com/', 'DeCoupons', isTestnet ? 'testnet' : 'mainnet')

export const App = (): JSX.Element => {
    const [ firstRender, setFirstRender ] = useState<boolean>(false)

    const [ tonClient, setTonClient ] = useState<TonClient>(new TonClient({ endpoint: isTestnet ? 'https://testnet.tonhubapi.com/jsonRPC' : 'https://mainnet.tonhubapi.com/jsonRPC' }))

    const [ isConnected, setIsConnected ] = useState<boolean>(false)
    const [ balance, setBalance ] = useState<string | undefined>(undefined)

    const [ addressCoupon, setAddressCoupon ] = useState<string>('')

    const rawAddress = useTonAddress(false)

    function listenDeLab () {
        DeLabConnector.on('connect', async (data: DeLabEvent) => {
            setIsConnected(true)
            const connectConfig: DeLabConnecting = data.data
            if (connectConfig.address) {
                const bl = await tonClient.getBalance(Address.parse(connectConfig.address))

                setBalance(bl.toString())
            }
        })
    }

    useEffect(() => {
        if (!firstRender && DeLabConnector) {
            setFirstRender(true)
            listenDeLab()
        }
    }, [])

    const navigate = useNavigate()

    useEffect(() => {
        if (!rawAddress) {
            navigate(ROUTES.LOGIN)
        } else {
            navigate(ROUTES.YOUR_CHECKS)
        }
    }, [ rawAddress ])

    return (
        <>
            <Routes>
                <Route element={<Layout />}>
                    <Route
                        path={ROUTES.YOUR_CHECKS}
                        element={<YourChecksPage />}
                    />
                    <Route
                        path={ROUTES.CREATE_CHECK}
                        element={
                            <CreateCheckPage
                                balance={balance}
                            />
                        }
                    />
                    <Route
                        path={ROUTES.QR_SCANNER}
                        element={
                            <QrScannerPage
                                setAddress={setAddressCoupon}
                                address={addressCoupon}
                            />
                        }
                    />
                    <Route
                        path={ROUTES.SETTINGS}
                        element={
                            <SettingsPage
                                isTestnet={isTestnet}
                            />
                        }
                    />

                    <Route
                        path={ROUTES.ACTIVATE}
                        element={
                            <Activate
                                setAddress={setAddressCoupon}
                                address={addressCoupon}
                            />
                        }
                    />
                </Route>
                <Route
                    path={ROUTES.LOGIN}
                    element={<LoginPage />}
                />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}
