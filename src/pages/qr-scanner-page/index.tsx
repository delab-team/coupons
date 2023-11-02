import { FC, useState, useEffect, useRef, CSSProperties } from 'react'
import QrScanner from 'qr-scanner'
import { Address } from 'ton-core'
import { useNavigate } from 'react-router-dom'

import { MainTitle } from '../../components/main-title'
import { Link } from '../../components/link'

import { ROUTES } from '../../utils/router'

import { useTextTelegram } from '../../hooks/useTextTelegram'
import { useBg2Telegram } from '../../hooks/useBg2Telegram'

import QR from '../../assets/images/qr/qr.svg'

import s from './qr-scanner-page.module.scss'

interface QrScannerPageProps {
    address: string,
    setAddress: Function,
    isTg: boolean
}

export const QrScannerPage: FC<QrScannerPageProps> = ({ address, setAddress, isTg }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [ qrResult, setQRResult ] = useState<string>('')

    const telegramText: CSSProperties = useTextTelegram(isTg)

    const navigate = useNavigate()

    useEffect(() => {
        const initializeScanner = async () => {
            const videoElement = videoRef.current

            if (!videoElement) {
                console.error('Video element not found')
                return
            }

            try {
                const hasCamera = await QrScanner.hasCamera()
                if (!hasCamera) {
                    console.error('No camera found')
                    return
                }

                const scanner = new QrScanner(videoElement, (result: string) => {
                    setQRResult(result)
                })

                scanner.start()

                // eslint-disable-next-line consistent-return
                return () => {
                    scanner.stop()
                }
            } catch (error) {
                console.error('Error initializing QR scanner:', error)
            }
        }

        initializeScanner()
    }, [])

    useEffect(() => {
        const scanQRCodeFromImage = async () => {
            try {
                const result = await QrScanner.scanImage(QR)
                if (result) {
                    const string = result.split('=')
                    const string2 = string[string.length - 1]
                    try {
                        const addr = Address.parse(string2)

                        setAddress(addr.toString())
                    } catch (error) {
                        console.log(error)
                    }
                    setQRResult(result)
                } else {
                    console.error('QR code not found in the image')
                }
            } catch (error) {
                console.error('Error scanning QR code from image:', error)
            }
        }

        scanQRCodeFromImage()
    }, [])

    useEffect(() => {
        if (address) {
            try {
                const addr = Address.parse(address)
                navigate(`${ROUTES.ACTIVATE}?a=${addr}`)
            } catch (err) {
                console.error(err)
            }
        }
    }, [ address ])

    const telegramBG2: CSSProperties = useBg2Telegram(isTg)
    const inputStyles = { ...telegramBG2, ...telegramText }

    return (
        <section>
            <MainTitle title="Scan QR code" isTg={isTg} />
            <div className={s.qrContent}>
                <div className={s.qr}>
                    <video className={s.qrCamera} ref={videoRef} autoPlay playsInline />
                    <img src={QR} alt="qr img" className={s.qrImage} />
                </div>
            </div>

            {qrResult.length > 1 && <Link text={qrResult} href={qrResult} isTg={isTg} />}
            <div className={s.formBlock}>
                <label className={s.formLabel} style={telegramText}>Address coupon</label>
                <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Search by address coupon"
                    className={s.formInput}
                    style={inputStyles}
                />
            </div>
        </section>
    )
}
