import { useEffect, useState, CSSProperties } from 'react'

export const useText2Telegram = (isTg: boolean): CSSProperties => {
    const [ textColor, setTextColor ] = useState<CSSProperties>({})

    useEffect(() => {
        const conditionalTextColor: CSSProperties = {}

        if (isTg) {
            conditionalTextColor.color = 'var(--tg-theme-button-text-color)'
        }

        setTextColor(conditionalTextColor)
    }, [ isTg ])

    return textColor
}
