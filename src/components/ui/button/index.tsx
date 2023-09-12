import { ButtonHTMLAttributes, FC, CSSProperties, useState, useEffect } from 'react'
import clsx from 'clsx'

import { useBgTelegram } from '../../../hooks/useBgTelegram'
import { useTextTelegram } from '../../../hooks/useTextTelegram'

import './button.scss'

type ButtonVariant = 'small-button' | 'action-button' | 'primary-button' | 'black-button' | 'blackS-button'

interface ButtonProps
    extends React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    /**
   * icon
   */
    icon?: string;
    /**
   * start Icon
   */
    startIcon?: string;
    /**
   * end Icon
   */
    endIcon?: string;
    /**
   * variant button
   */
    variant: ButtonVariant;
    /**
     * isTg
     */
    isTg: boolean;
}

export const Button: FC<ButtonProps> = ({
    children,
    variant = 'action-button',
    startIcon,
    endIcon,
    onClick,
    isTg,
    ...props
}) => {
    const className = clsx(
        'btn',
        { actionButton: variant === 'action-button' },
        { smallButton: variant === 'small-button' },
        { primaryButton: variant === 'primary-button' },
        { blackButton: variant === 'black-button' },
        { blackSmallButton: variant === 'blackS-button' }
    )

    const [ style, setStyle ] = useState({})

    useEffect(() => {
        if (isTg) {
            setStyle({
                backgroundColor: 'var(--tg-theme-button-color)',
                color: 'var(--tg-theme-button-text-color)',
                important: 'true'
            })
        } else {
            setStyle({})
        }
    }, [ isTg ])

    const telegramText: CSSProperties = useTextTelegram(isTg)

    // const styleButton = { ...button_color, ...telegramText }

    return (
        <button className={className} onClick={onClick} type="button" {...props} style={style}>
            {!!startIcon && <img src={startIcon} alt="" />}
            {children}
            {!!endIcon && <img src={endIcon} alt="" />}
        </button>
    )
}
