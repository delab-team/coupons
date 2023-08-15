import { FC, useState, useEffect, useRef } from 'react'
import QrScanner from 'qr-scanner'

import { Address } from 'ton-core'
import { useNavigate } from 'react-router-dom'
import { MainTitle } from '../../components/main-title'
import { Link } from '../../components/link'

import { ROUTES } from '../../utils/router'

import { useMediaQuery } from '../../hooks/use-media-query'

import QR from '../../assets/images/qr/qr.svg'

import s from './qr-scanner-page.module.scss'

interface QrScannerPageProps {
    address: string,
    setAddress: Function
}

export const QrScannerPage: FC<QrScannerPageProps> = ({ address, setAddress }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [ qrResult, setQRResult ] = useState<string>('')

    // const [ address, setAddress ] = useState<string>('')

    const isMobile = useMediaQuery(768)

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
                    try {
                        const addr = Address.parse(result)

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

                navigate(ROUTES.ACTIVATE)
            } catch (err) {
                console.error(err)
            }
        }
    }, [ address ])

    return (
        <section>
            <MainTitle title="Scan QR code" />
            <div className={s.qrContent}>
                <div className={s.qr}>
                    <video className={s.qrCamera} ref={videoRef} autoPlay playsInline />
                    <img src={QR} alt="qr img" className={s.qrImage} />
                </div>
            </div>

            {/* {qrResult.length > 1 && <Link text={qrResult} href={qrResult} />} */}
            <div className={s.formBlock}>
                <label className={s.formLabel}>Address coupon</label>
                <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className={s.formInput}
                />
            </div>

        </section>
    )
}
