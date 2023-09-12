import { useEffect, useState, CSSProperties } from 'react'

export const useChangeSvgColor = (isTg: boolean): CSSProperties => {
    const [ style, setStyle ] = useState<CSSProperties>({})

    useEffect(() => {
        if (isTg) {
            setStyle({
                fill: 'var(--tg-theme-secondary-bg-color)',
                transition: 'fill 0.3s ease'
            })
        } else {
            setStyle({})
        }
    }, [ isTg ])

    return style
}
