import { FC, useState, CSSProperties } from 'react'
import QRCode from 'react-qr-code'

import { Button } from '../ui/button'

import { useBgTelegram } from '../../hooks/useBgTelegram'

import CANCEL from '../../assets/images/checks/cancel.svg'

import s from './qr-code.module.scss'

interface QrCodeProps {
    value: string;
    handleClose: () => void;
    isTg: boolean;
}

export const QrCode: FC<QrCodeProps> = ({ value, handleClose, isTg }) => {
    const [ address, setAddress ] = useState<string>('')

    const telegramBG: CSSProperties = useBgTelegram(isTg)

    return (
        <div className={s.qrCode} style={telegramBG}>
            <div className={s.qrCodeButton}>
                <Button
                    variant="small-button"
                    startIcon={CANCEL}
                    onClick={handleClose}
                />
            </div>
            <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={value}
                viewBox={'0 0 256 256'}
            />
        </div>
    )
}
