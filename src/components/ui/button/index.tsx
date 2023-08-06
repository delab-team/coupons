import { ButtonHTMLAttributes, FC } from 'react'
import clsx from 'clsx'

import './button.scss'

type ButtonVariant = 'small-button' | 'action-button' | 'primary-button' | 'black-button' | 'white-button'

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
}

export const Button: FC<ButtonProps> = ({
    children,
    variant = 'action-button',
    startIcon,
    endIcon,
    onClick,
    ...props
}) => {
    const className = clsx(
        'btn',
        { actionButton: variant === 'action-button' },
        { smallButton: variant === 'small-button' },
        { primaryButton: variant === 'primary-button' },
        { blackButton: variant === 'black-button' },
        { whiteButton: variant === 'white-button' }
    )

    return (
        <button className={className} onClick={onClick} type="button" {...props}>
            {!!startIcon && <img src={startIcon} alt="" />}
            {children}
            {!!endIcon && <img src={endIcon} alt="" />}
        </button>
    )
}
