import { FC, useState, useRef, useEffect, CSSProperties } from 'react'
import { DeLabAddress } from '@delab-team/connect'
import { useTonAddress, useTonWallet } from '@tonconnect/ui-react'

import { fixAmount } from '../../utils/fix-amount'
import { smlAddr } from '../../utils/sml-addr'

import { useTextTelegram } from '../../hooks/useTextTelegram'

import PROFILE from '../../assets/images/profile/profile-icon.svg'

import s from './profile.module.scss'

interface ProfileProps {
    balance: string | undefined;
    address: DeLabAddress;
    isTg: boolean;
}

export const Profile: FC<ProfileProps> = ({ balance, address, isTg }) => {
    const [ openStats, setOpenStats ] = useState<boolean>(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const telegramText: CSSProperties = useTextTelegram(isTg)

    const rawAddress = useTonAddress(false)
    const wallet = useTonWallet()

    const handleOpen = () => {
        setOpenStats(prev => !prev)
    }

    const handleOutsideClick = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setOpenStats(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    return (
        <div className={s.profile} ref={containerRef}>
            <button className={s.profileInfo} onClick={handleOpen} style={telegramText}>
                <img src={PROFILE} alt="profile icon" />
                <span className={s.profileAddress}>
                    {/* {smlAddr(address)} */}
                    <span>{smlAddr(rawAddress)}</span>
                </span>
            </button>

            <div className={`${s.profileBalance} ${openStats ? s.profileBalanceShow : ''}`}>
                <div className={s.profileBalanceInner}>
                    <div className={s.profileBalanceStats} style={telegramText}>
                        <>
                            Balance:
                            {fixAmount(balance ?? '0')}
                            TON
                        </>
                    </div>
                </div>
            </div>
        </div>
    )
}
