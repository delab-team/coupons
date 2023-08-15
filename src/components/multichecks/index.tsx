import { FC, useState, useEffect, Dispatch, SetStateAction } from 'react'

import DONE from '../../assets/images/checks/done.svg'
import SHARE from '../../assets/images/checks/share_outline.svg'
import DELETE from '../../assets/images/checks/delete.svg'
import CANCEL from '../../assets/images/checks/cancel.svg'

// eslint-disable-next-line import/no-cycle
import { SelectedDataType } from '../../pages/your-checks-page'

import { Button } from '../ui/button'

import s from './multichecks.module.scss'
import { StorageWallet } from '../../logic/storage'

interface MultichecksProps {
    selectedCheckCard: SelectedDataType;
    setSelectedCheckCard: any;
}

export const Multichecks: FC<MultichecksProps> = ({ selectedCheckCard, setSelectedCheckCard }) => {
    const [ isVisible, setIsVisible ] = useState<boolean>(true)

    // const [ couponInfo, setCouponInfo ] = useState({})
    // console.log('🚀 ~ file: index.tsx:25 ~ couponInfo:', couponInfo)

    // const storageWallet = new StorageWallet()

    // useEffect(() => {
    //     const couponInfo = storageWallet.get(selectedCheckCard.id)

    //     setCouponInfo(couponInfo)
    // }, [ selectedCheckCard.id ])

    const handleCancelButtonClick = () => {
        setIsVisible(false)
        setSelectedCheckCard({ id: '', selected: '' })
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

    return (
        <div>
            {isVisible && <div className={s.overlay}></div>}
            <div className={`${s.multicheck} ${isVisible ? s.slideIn : s.slideOut}`}>
                <div className={`container ${s.container}`}>
                    <div className={s.headerTop}>
                        <h1 className={s.headerTitle}>Multicheck #1</h1>
                        <Button variant="small-button" startIcon={CANCEL} onClick={handleCancelButtonClick} />
                    </div>
                    <div className={`${s.multicheckInfo}`}>
                        <div className={s.item}>
                            <div className={s.title}>Status:</div>
                            <div className={s.description}>Not activated</div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Sum:</div>
                            <div className={s.description}>
                              10 TON (<span>$17</span>)
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Amount of one activation:</div>
                            <div className={s.description}>
                              0.5 TON (<span>$0.91</span>)
                            </div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Number of activations:</div>
                            <div className={s.description}>20</div>
                        </div>
                        <div className={s.item}>
                            <div className={s.title}>Password:</div>
                            <div className={s.status}>
                                <img src={DONE} alt="Done" />
                            </div>
                        </div>
                        <div className={s.multicheckActions}>
                            <Button variant="action-button" startIcon={SHARE}>
                              Share
                            </Button>
                            <Button variant="action-button" startIcon={DELETE}>
                              Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
