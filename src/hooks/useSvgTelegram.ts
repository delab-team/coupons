import { useEffect, useState, CSSProperties } from 'react'

export const useChangeSvgColor = (isTg: boolean): CSSProperties => {
    const [ style, setStyle ] = useState({})

    useEffect(() => {
        if (isTg) {
            setStyle({
                fill: 'var(--tg-theme-link-color)',
                important: 'true'
            })
        } else {
            setStyle({})
        }
    }, [ isTg ])

    return style
}
