import { FC, useState, useEffect } from 'react'

import { toast } from 'react-toastify'

// eslint-disable-next-line import/no-cycle
import { CouponDataType, SelectedDataType } from '../../pages/your-checks-page'

import { StorageWallet } from '../../logic/storage'

import TokenPriceHook from '../../hooks/token-price-hook'
import { useQRCodeDownloader } from '../../hooks/use-qr-code-downloader'

import { Button } from '../ui/button'

import { Coupon } from '../../logic/coupon'

import { fixAmount } from '../../utils/fix-amount'
import { smlAddr } from '../../utils/sml-addr'

import DOWNLOAD from '../../assets/images/checks/download.svg'
import DONE from '../../assets/images/checks/done.svg'
import SHARE from '../../assets/images/checks/share_outline.svg'
import DELETE from '../../assets/images/checks/delete.svg'
import CANCEL from '../../assets/images/checks/cancel.svg'

import s from './check.module.scss'

interface CheckProps {
    selectedCheckCard: SelectedDataType;
    setSelectedCheckCard: any;
    isTestnet: boolean;
}

export const Check: FC<CheckProps> = ({ selectedCheckCard, setSelectedCheckCard, isTestnet }) => {
    const [ isVisible, setIsVisible ] = useState<boolean>(true)

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
                    const bl = await Coupon.getSumCoupon(info.address, isTestnet)
                    setBal(bl)
                } catch (error) {
                    console.error('Error fetching coupon balance:', error)
                }
            }
        }
        if (isVisible && info && selectedCheckCard?.id === info.id) {
            fetchCouponBalance()
        }
    }, [ info?.address, selectedCheckCard?.id, isVisible ])

    const handleCopyAddress = () => {
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

    const generateQRCodeAndDownload = useQRCodeDownloader(`${window.location.origin}/login?a=${info?.address}` ?? '')

    const handleShareAddress = () => {
        const copyableAddress = `${window.location.origin}/login?a=${info?.address}`
        navigator.clipboard.writeText(copyableAddress)
        toast.success('Check has been copied to the clipboard')
    }
    const handleDeleteAndRedirect = async () => {
        const shouldDelete = window.confirm('Are you sure you want to delete the coupon?')

        if (!info) {
            console.error('Something went wrong')
            return
        }

        if (!info.address) {
            console.error('Something went wrong')
            return
        }

        if (shouldDelete) {
            try {
                const balanceResponse = await Coupon.getSumCoupon(info.address, isTestnet)
                if (balanceResponse) {
                    const balanceData = balanceResponse
                    const balance = Number(fixAmount(balanceData))

                    if (balance < 0.001) {
                        storageWallet.del(selectedCheckCard?.id)
                    } else {
                        window.location.href = `${window.location.origin}/login?a=${info?.address}`
                    }
                } else {
                    window.location.href = `${window.location.origin}/login?a=${info?.address}`
                }
            } catch (error) {
                window.location.href = `${window.location.origin}/login?a=${info?.address}`
            }
        }
    }

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
                            <div className={s.description}>
                                {Number(fixAmount(bal)) > 0.001 ? 'Not activated' : 'Activated'}
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Address:</div>
                            <div
                                className={s.description}
                                onClick={handleCopyAddress}
                                style={{ cursor: 'pointer' }}
                            >
                                {smlAddr(info?.address)}
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Sum:</div>
                            <div className={s.description}>
                                {fixAmount(bal)} TON (
                                <TokenPriceHook tokenAmount={Number(fixAmount(bal))} />)
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Password:</div>
                            <div className={s.status}>
                                <img src={DONE} alt="Done" />
                            </div>
                        </div>
                        <div className={s.itemAction}>
                            <div className={s.titleDownload}>Download:</div>
                            <div>
                                <button className={s.itemDownload} onClick={generateQRCodeAndDownload}>
                                    Download
                                    <img src={DOWNLOAD} alt="Download" />
                                </button>
                            </div>
                        </div>
                        <div className={s.checkActions}>
                            <Button
                                variant="action-button"
                                startIcon={SHARE}
                                onClick={handleShareAddress}
                            >
                                Share
                            </Button>
                            <Button
                                variant="action-button"
                                startIcon={DELETE}
                                onClick={handleDeleteAndRedirect}
                            >
                                    Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
