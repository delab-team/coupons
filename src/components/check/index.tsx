import { FC, useState, useEffect } from 'react'

import { toast } from 'react-toastify'
import { Button } from '../ui/button'

import DONE from '../../assets/images/checks/done.svg'
import SHARE from '../../assets/images/checks/share_outline.svg'
import DELETE from '../../assets/images/checks/delete.svg'
import CANCEL from '../../assets/images/checks/cancel.svg'

// eslint-disable-next-line import/no-cycle
import { CouponDataType, SelectedDataType } from '../../pages/your-checks-page'

import { StorageWallet } from '../../logic/storage'

import TokenPriceHook from '../../hooks/token-price-hook'

import { Coupon } from '../../logic/coupon'

import { fixAmount } from '../../utils/fix-amount'

import { QrCode } from '../qr-code'

import s from './check.module.scss'

interface CheckProps {
    selectedCheckCard: SelectedDataType;
    setSelectedCheckCard: any;
}

export const Check: FC<CheckProps> = ({ selectedCheckCard, setSelectedCheckCard }) => {
    const [ isVisible, setIsVisible ] = useState<boolean>(true)
    const [ qrShow, setQrShow ] = useState<boolean>(false)

    const [ bal, setBal ] = useState<string>('0')

    const [ info, setInfo ] = useState<CouponDataType | null>(null)

    const storageWallet = new StorageWallet()

    useEffect(() => {
        const getCheckData = () => {
            try {
                const result: CouponDataType[] | null = storageWallet.get(selectedCheckCard?.id)

                if (result) {
                    setInfo(result[0])
                }
            } catch (error) {
                console.error(error)
            }
        }

        getCheckData()
    }, [ selectedCheckCard?.id, setSelectedCheckCard ])

    const handleCancelButtonClick = () => {
        setIsVisible(false)
        setSelectedCheckCard('', '')
        setBal('0')

        setInfo(null)
    }

    const handleRemoveCheck = () => {
        if (!info) {
            console.error('Something went wrong')
            return
        }

        if (!info.id) {
            console.error('Something went wrong')
            return
        }

        if (window.confirm('Are you sure you want to delete the coupon?')) {
            storageWallet.del(info.id)
            toast.success('Coupon successfully deleted')

            window.location.reload()
        } else {
            console.log('Coupon deletion was canceled')
        }
    }

    const handleShare = () => {
        if (!info) {
            console.error('Something went wrong')
            return
        }

        if (!info.address) {
            console.error('Something went wrong')
            return
        }

        const tempTextArea = document.createElement('textarea')
        tempTextArea.value = info.address
        document.body.appendChild(tempTextArea)
        tempTextArea.select()
        document.execCommand('copy')
        document.body.removeChild(tempTextArea)

        toast.success('Check has been copied to the clipboard')
    }

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(() => {
                clearTimeout(timer)
            }, 300)

            return () => clearTimeout(timer)
        }
    }, [ isVisible ])

    useEffect(() => {
        const fetchCouponBalance = async () => {
            if (info && info.address) {
                try {
                    const bl = await Coupon.getSumCoupon(info.address)
                    setBal(bl)
                } catch (error) {
                    console.error('Error fetching coupon balance:', error)
                }
            }
        }
        console.log('rerender')
        if (isVisible && info && selectedCheckCard?.id === info.id) {
            fetchCouponBalance()
        }
    }, [ info?.address, selectedCheckCard?.id, isVisible ])

    return (
        <div className={s.checkBody}>
            {isVisible && <div className={s.overlay}></div>}
            <section className={`${s.check} ${isVisible ? s.slideIn : s.slideOut}`}>
                <div className={`container ${s.container}`}>
                    <div className={s.headerTop}>
                        <h1 className={s.headerTitle}>Check</h1>
                        <Button
                            variant="small-button"
                            startIcon={CANCEL}
                            onClick={handleCancelButtonClick}
                        />
                    </div>
                    <div className={s.checkInfo}>
                        <div className={s.item}>
                            <div className={s.title}>Status:</div>
                            <div className={s.description}>{Number(fixAmount(bal)) > 0.001 ? 'Not activated' : 'Activated' }</div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Sum:</div>
                            <div className={s.description}>
                                {fixAmount(bal)} TON (<TokenPriceHook tokenAmount={Number(fixAmount(bal))} />)
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Password:</div>
                            <div className={s.status}>
                                <img src={DONE} alt="Done" />
                            </div>
                        </div>
                        <div className={s.checkActions}>
                            <Button variant="action-button" startIcon={SHARE} onClick={() => setQrShow(true)}>
                                Share
                            </Button>
                            <Button
                                variant="action-button"
                                startIcon={DELETE}
                                onClick={handleRemoveCheck}
                            >
                                Delete
                            </Button>
                        </div>
                        {qrShow && (
                            <div className={s.qrBody}>
                                <QrCode value={'Hi'} handleClose={() => setQrShow(false)} />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
