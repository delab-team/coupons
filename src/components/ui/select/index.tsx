import { FC, useState, useEffect, CSSProperties } from 'react'

import CHEVRON_DOWN from '../../../assets/images/create-check/chevron-down.svg'

import { useTextTelegram } from '../../../hooks/useTextTelegram'
import { useBg2Telegram } from '../../../hooks/useBg2Telegram'

import s from './select.module.scss'

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

    const [ styles, setStyles ] = useState({})

    useEffect(() => {
        if (isTg) {
            setStyles({
                backgroundColor: 'var(--tg-theme-link-color)',
                important: 'true'
            })
        } else {
            setStyles({})
        }
    }, [ isTg ])

    // const telegramBG2: CSSProperties = useBg2Telegram(isTg)

    // const telegramText: CSSProperties = useTextTelegram(isTg)

    const styleSelect = { ...styles }

    return (
        <div className={s.customSelect} style={styleSelect}>
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
