import { FC, useState } from 'react'
import QRCode from 'react-qr-code'

import { Button } from '../ui/button'

import CANCEL from '../../assets/images/checks/cancel.svg'

import s from './qr-code.module.scss'

interface QrCodeProps {
    value: string;
    handleClose: () => void;
}

export const QrCode: FC<QrCodeProps> = ({ value, handleClose }) => {
    const [ address, setAddress ] = useState<string>('')
    return (
        <div className={s.qrCode}>
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
