import { useEffect, useState, CSSProperties } from 'react'

export const useBg2Telegram = (isTg: boolean): CSSProperties => {
    const [ style, setStyle ] = useState({})

    useEffect(() => {
        if (isTg) {
            setStyle({
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                important: 'true'
            })
        } else {
            setStyle({})
        }
    }, [ isTg ])

    return style
}
