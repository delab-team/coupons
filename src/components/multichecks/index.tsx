/* eslint-disable consistent-return */
/* eslint-disable import/no-cycle */
import { FC, useState, useEffect } from 'react'
import { useTonConnectUI } from '@tonconnect/ui-react'

import { toast } from 'react-toastify'

import { MultiDataType, SelectedDataType } from '../../pages/your-checks-page'

import { Button } from '../ui/button'

import { StorageWallet } from '../../logic/storage'
import { Coupon } from '../../logic/coupon'

import { fixAmount } from '../../utils/fix-amount'
import { smlAddr } from '../../utils/sml-addr'

import TokenPriceHook from '../../hooks/token-price-hook'
import { useQRCodeDownloader } from '../../hooks/use-qr-code-downloader'

import DOWNLOAD from '../../assets/images/checks/download.svg'
import DONE from '../../assets/images/checks/done.svg'
import SHARE from '../../assets/images/checks/share_outline.svg'
import DELETE from '../../assets/images/checks/delete.svg'
import CANCEL from '../../assets/images/checks/cancel.svg'

import s from './multichecks.module.scss'

interface MultichecksProps {
    selectedCheckCard: SelectedDataType;
    setSelectedCheckCard: any;
    isTestnet: boolean;
}

export const Multichecks: FC<MultichecksProps> = ({ selectedCheckCard, setSelectedCheckCard, isTestnet }) => {
    const [ isVisible, setIsVisible ] = useState<boolean>(true)
    const [ bal, setBal ] = useState<string>('0')
    const [ info, setInfo ] = useState<MultiDataType | null>(null)
    const [ usage, setUsage ] = useState<number>(0)
    console.log('🚀 ~ file: index.tsx:39 ~ usage:', usage)

    const storageWallet = new StorageWallet()

    const [ tonConnectUI, setOptions ] = useTonConnectUI()
    const cp = new Coupon(tonConnectUI, isTestnet)

    async function fetchUsage () {
        if (!info?.address) return
        try {
            const res = await cp.getSumActivation(info?.address)
            setUsage(res)
        } catch (error) {
            console.error('Error fetching usage:', error)
        }
    }

    useEffect(() => {
        const getMultiData = () => {
            try {
                const result: MultiDataType[] | null = storageWallet.get(selectedCheckCard?.id)

                if (result) {
                    setInfo(result[0])
                }
            } catch (error) {
                console.error(error)
            }
        }

        getMultiData()
    }, [ selectedCheckCard?.id ])

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
        console.log('rerender')
        if (isVisible && info && selectedCheckCard?.id === info.id) {
            fetchCouponBalance()
            fetchUsage()
        }
    }, [ info?.address, selectedCheckCard?.id, isVisible ])

    const handleCancelButtonClick = () => {
        setIsVisible(false)
        setSelectedCheckCard({ id: '', selected: '' })
        setBal('0')
        setInfo(null)
    }

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
        const copyableAddress = window.location.origin + `/login?a=${info?.address}`
        navigator.clipboard.writeText(copyableAddress)
        toast.success('Check has been copied to the clipboard')
    }

    // const handleDeleteAndRedirect = async () => {
    //     const shouldDelete = window.confirm('Are you sure you want to delete the coupon?')

    //     if (!info) {
    //         console.error('Something went wrong')
    //         return
    //     }

    //     if (!info.address) {
    //         console.error('Something went wrong')
    //         return
    //     }

    //     if (shouldDelete) {
    //         try {
    //             const balanceResponse = await Coupon.getSumCoupon(info.address, isTestnet)
    //             if (balanceResponse) {
    //                 const balanceData = balanceResponse
    //                 const balance = Number(fixAmount(balanceData))

    //                 if (balance < 0.001) {
    //                     const deleteSuccessful = storageWallet.del(selectedCheckCard?.id)
    //                     if (deleteSuccessful) {
    //                         handleCancelButtonClick()
    //                         window.location.href = '/'
    //                     }
    //                 } else {
    //                     window.location.href = `${window.location.origin}/login?a=${info?.address}`
    //                 }
    //             } else {
    //                 window.location.href = `${window.location.origin}/login?a=${info?.address}`
    //             }
    //         } catch (error) {
    //             window.location.href = `${window.location.origin}/login?a=${info?.address}`
    //         }
    //     }
    // }

    const handleRemove = async () => {
        const us = new Coupon(tonConnectUI, isTestnet)
        if (!info?.address) return console.error(123)
        try {
            const res = await us.destroyMulti(info?.address)
            console.log('🚀 ~ file: index.tsx:170 ~ handleRemove ~ res:', res)
            return res
        } catch (error) {
            console.error('Error fetching usage:', error)
        }
    }

    return (
        <div>
            {isVisible && <div className={s.overlay}></div>}
            <section className={`${s.multicheck} ${isVisible ? s.slideIn : s.slideOut}`}>
                <div className={`container ${s.container}`}>
                    <div className={s.headerTop}>
                        <h1 className={s.headerTitle}>Multicheck</h1>
                        <Button
                            variant="small-button"
                            startIcon={CANCEL}
                            onClick={handleCancelButtonClick}
                        />
                    </div>
                    <div className={`${s.multicheckInfo}`}>
                        <div className={s.item}>
                            <div className={s.title}>Status:</div>
                            <div className={s.description}>
                                {Number(fixAmount(bal)) > 0.001 ? 'Not activated' : 'Activated'}
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Address:</div>
                            <div className={s.description} onClick={handleCopyAddress} style={{ cursor: 'pointer' }}>
                                {smlAddr(info?.address)}
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Sum:</div>
                            <div className={s.description}>
                                {fixAmount(Number(bal))} TON (
                                <TokenPriceHook tokenAmount={Number(fixAmount(bal))} />)
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Amount of one activation:</div>
                            <div className={s.description}>
                                {usage !== 0
                                    ? fixAmount(Number(bal) / Number(usage))
                                    : 0 + ' '}
                                TON (
                                <TokenPriceHook
                                    tokenAmount={
                                        usage !== 0
                                            ? Number(fixAmount(Number(bal) / Number(usage)))
                                            : 0
                                    }
                                />
                                )
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Number of activations:</div>
                            <div className={s.description}>{usage === 0 ? '0' : usage}</div>
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
                        <div className={s.multicheckActions}>
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
                                onClick={handleRemove}
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
