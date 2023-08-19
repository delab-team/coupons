/* eslint-disable max-len */
import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
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

import 'react-toastify/dist/ReactToastify.css'

const isTestnet = window.location.host.indexOf('localhost') >= 0 ? true : window.location.href.indexOf('testnet') >= 0

export const App = (): JSX.Element => {
    const [ firstRender, setFirstRender ] = useState<boolean>(false)

    const [ isConnected, setIsConnected ] = useState<boolean>(false)
    const [ balance, setBalance ] = useState<string | undefined>(undefined)

    const [ tonClient, setTonClient ] = useState<TonClient>(new TonClient({ endpoint: isTestnet ? 'https://testnet.tonhubapi.com/jsonRPC' : 'https://mainnet.tonhubapi.com/jsonRPC' }))
    const [ addressCoupon, setAddressCoupon ] = useState<string>('')

    // =================================

    const RawAddress = useTonAddress()

    // ==================================

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    useEffect(() => {

    }, [ ])

    const navigate = useNavigate()

    // ===============================

    useEffect(() => {
        if (!RawAddress) {
            navigate(ROUTES.LOGIN)
        } else {
            tonClient.getBalance(Address.parse(RawAddress)).then((bl) => {
                setBalance(bl.toString())
            })
            navigate(ROUTES.YOUR_CHECKS)
        }
    }, [ RawAddress ])

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
                                isConnected={isConnected}
                                balance={balance}
                                isTestnet={isTestnet}
                            />
                        }
                    />

                    <Route
                        path={ROUTES.ACTIVATE}
                        element={
                            <Activate
                                balance={balance}
                                address={addressCoupon}
                                setAddress={setAddressCoupon}
                            />
                        }
                    />
                </Route>
                <Route
                    path={ROUTES.LOGIN}
                    element={<LoginPage  />}
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
