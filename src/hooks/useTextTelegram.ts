import { useEffect, useState, CSSProperties } from 'react'

export const useTextTelegram = (isTg: boolean): CSSProperties => {
    const [ textColor, setTextColor ] = useState<CSSProperties>({})

    useEffect(() => {
        const conditionalTextColor: CSSProperties = {}

        if (isTg) {
            conditionalTextColor.color = 'var(--tg-theme-text-color)'
        }

        setTextColor(conditionalTextColor)
    }, [ isTg ])

    return textColor
}
