import { FC, useState, useEffect, CSSProperties } from 'react'

import CHEVRON_DOWN from '../../../assets/images/create-check/chevron-down.svg'

import s from './select.module.scss'
import { useBgTelegram } from '../../../hooks/useBgTelegram';
import { useTextTelegram } from '../../../hooks/useTextTelegram';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    style?: CSSProperties;
    isTg: boolean;
}

export const Select: FC<SelectProps> = ({ options, value, onChange, style, isTg }) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false)
    const [ filteredOptions, setFilteredOptions ] = useState<Option[]>([])
    const [ hasMadeSelection, setHasMadeSelection ] = useState<boolean>(false)

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    const handleOptionClick = (optionValue: string) => {
        onChange(optionValue)
        setIsOpen(false)
        setHasMadeSelection(true)
    }

    useEffect(() => {
        if (hasMadeSelection) {
            setFilteredOptions(options.filter(option => option.value !== value))
        } else {
            setFilteredOptions(options.slice(1))
        }
    }, [ options, value, hasMadeSelection ])

    const telegramBG: CSSProperties = useBgTelegram(isTg)
    const telegramText: CSSProperties = useTextTelegram(isTg)

    const styleSelect = { ...telegramBG, ...telegramText }

    return (
        <div className={s.customSelect} style={style}>
            <div className={s.customSelectActive} onClick={handleToggle} style={styleSelect}>
                {value || options[0]?.label}
                <img src={CHEVRON_DOWN} className={`${s.customSelectChevron} ${isOpen ? s.chevronRotate : s.chevronNoRotate}`} alt="chevron-down" />
            </div>
            {isOpen && (
                <ul className={s.selectList} style={styleSelect}>
                    {filteredOptions.map(option => (
                        <li
                            key={option.value}
                            className={`${s.selectItem} ${option.value === value ? s.active : ''}`}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
