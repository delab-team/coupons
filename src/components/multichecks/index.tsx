/* eslint-disable import/no-cycle */
import { FC, useState, useEffect } from 'react'

import { toast } from 'react-toastify'

import { MultiDataType, SelectedDataType } from '../../pages/your-checks-page'

import { Button } from '../ui/button'

import { StorageWallet } from '../../logic/storage'
import { Coupon } from '../../logic/coupon'

import { fixAmount } from '../../utils/fix-amount'

import TokenPriceHook from '../../hooks/token-price-hook'
import { useQRCodeDownloader } from '../../hooks/use-qr-code-downloader'

import DONE from '../../assets/images/checks/done.svg'
import SHARE from '../../assets/images/checks/share_outline.svg'
import DELETE from '../../assets/images/checks/delete.svg'
import CANCEL from '../../assets/images/checks/cancel.svg'

import s from './multichecks.module.scss'

interface MultichecksProps {
    selectedCheckCard: SelectedDataType;
    setSelectedCheckCard: any;
}

export const Multichecks: FC<MultichecksProps> = ({ selectedCheckCard, setSelectedCheckCard }) => {
    const [ isVisible, setIsVisible ] = useState<boolean>(true)
    const [ bal, setBal ] = useState<string>('0')
    const [ info, setInfo ] = useState<MultiDataType | null>(null)
    const storageWallet = new StorageWallet()

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

    const handleCancelButtonClick = () => {
        setIsVisible(false)
        setSelectedCheckCard({ id: '', selected: '' })
        setBal('0')
        setInfo(null)
    }

    const handleRemoveCheck = () => {
        if (!info?.id) {
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

    const qrCodeValue = 'https://www.youtube.com/watch?v=Qw2LUsS-Ujo&ab_channel=RandomVideos'
    const generateQRCodeAndDownload = useQRCodeDownloader(qrCodeValue)

    return (
        <div>
            {isVisible && <div className={s.overlay}></div>}
            <section className={`${s.multicheck} ${isVisible ? s.slideIn : s.slideOut}`}>
                <div className={`container ${s.container}`}>
                    <div className={s.headerTop}>
                        <h1 className={s.headerTitle}>Multicheck</h1>
                        <Button variant="small-button" startIcon={CANCEL} onClick={handleCancelButtonClick} />
                    </div>
                    <div className={`${s.multicheckInfo}`}>
                        <div className={s.item}>
                            <div className={s.title}>Status:</div>
                            <div className={s.description}>{Number(fixAmount(bal)) > 0.001 ? 'Not activated' : 'Activated' }</div>
                        </div>
                        {/* <div className={s.item}>
                            <div className={s.title}>Sum:</div>
                            <div className={s.description}>
                              10 TON (<span>$17</span>)
                            </div>
                        </div> */}
                        <div className={s.item}>
                            <div className={s.title}>Amount of one activation:</div>
                            <div className={s.description}>
                                {fixAmount(Number(bal))} TON (<TokenPriceHook tokenAmount={Number(fixAmount(bal))} />)
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Number of activations:</div>
                            <div className={s.description}>{info?.amountActivation}</div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Password:</div>
                            <div className={s.status}>
                                <img src={DONE} alt="Done" />
                            </div>
                        </div>
                        <div className={s.multicheckActions}>
                            <Button variant="action-button" startIcon={SHARE} onClick={generateQRCodeAndDownload}>
                              Share
                            </Button>
                            <Button variant="action-button" startIcon={DELETE} onClick={handleRemoveCheck}>
                              Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
