/* eslint-disable max-len */
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Address, TonClient } from 'ton'

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
import { PrivateRoute } from './utils/privateRouter'

import 'react-toastify/dist/ReactToastify.css'

declare global {
    interface Window {
        Telegram?: any
    }
}

const isTestnet = window.location.host.indexOf('localhost') >= 0
    ? true
    : window.location.href.indexOf('testnet') >= 0

export const App = (): JSX.Element => {
    const [ firstRender, setFirstRender ] = useState<boolean>(false)

    const [ isConnected, setIsConnected ] = useState<boolean>(false)
    const [ balance, setBalance ] = useState<string | undefined>(undefined)

    const [ isTg, setIsTg ] = useState<boolean>(false)

    console.log('0003')

    const [ tonClient, setTonClient ] = useState<TonClient>(
        new TonClient({
            endpoint: isTestnet
                ? 'https://testnet.tonhubapi.com/jsonRPC'
                : 'https://mainnet.tonhubapi.com/jsonRPC'
        })
    )
    const [ addressCoupon, setAddressCoupon ] = useState<string>('')

    const RawAddress = useTonAddress()

    useEffect(() => {
        const isTgCheck = window.Telegram.WebApp.initData !== ''
        const TgObj = window.Telegram.WebApp
        const bodyStyle = document.body.style

        setIsTg(isTgCheck)
        if (isTgCheck) {
            TgObj.ready()
            TgObj.enableClosingConfirmation()
            TgObj.expand()
            bodyStyle.backgroundColor = 'var(--tg-theme-secondary-bg-color)'
            bodyStyle.setProperty('background-color', 'var(--tg-theme-secondary-bg-color)', 'important')
        }
    }, [ firstRender ])

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    useEffect(() => {
        if (RawAddress) {
            tonClient.getBalance(Address.parse(RawAddress)).then((bl) => {
                setBalance(bl.toString())
            })
        }
    }, [ RawAddress ])

    return (
        <>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route element={<Layout isTg={isTg} />}>
                        <Route path={ROUTES.YOUR_CHECKS} element={<YourChecksPage isTestnet={isTestnet} isTg={isTg} />} />
                        <Route
                            path={ROUTES.CREATE_CHECK}
                            element={<CreateCheckPage balance={balance} isTestnet={isTestnet} isTg={isTg} />}
                        />
                        <Route
                            path={ROUTES.QR_SCANNER}
                            element={
                                <QrScannerPage
                                    setAddress={setAddressCoupon}
                                    address={addressCoupon}
                                    isTg={isTg}
                                />
                            }
                        />
                        <Route
                            path={ROUTES.SETTINGS}
                            element={
                                <SettingsPage
                                    isConnected={isConnected}
                                    balance={balance}
                                    isTestnet={isTestnet}
                                    isTg={isTg}
                                />
                            }
                        />
                        <Route
                            path={ROUTES.ACTIVATE}
                            element={
                                <Activate
                                    isTg={isTg}
                                    balance={balance}
                                    isTestnet={isTestnet}
                                    address={addressCoupon}
                                    setAddress={setAddressCoupon}
                                />
                            }
                        />
                    </Route>
                </Route>
                <Route path={ROUTES.LOGIN} element={<LoginPage isTg={isTg} />} />
                <Route path="*" element={<Navigate to='/' replace />} />
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
