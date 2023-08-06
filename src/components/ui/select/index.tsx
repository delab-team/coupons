import { FC, useState, useEffect } from 'react'

import CHEVRON_DOWN from '../../../assets/images/create-check/chevron-down.svg'

import s from './select.module.scss'

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
}

export const Select: FC<SelectProps> = ({ options, value, onChange }) => {
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

    return (
        <div className={s.customSelect}>
            <div className={s.customSelectActive} onClick={handleToggle}>
                {value || options[0]?.label}
                <img src={CHEVRON_DOWN} className={`${s.customSelectChevron} ${isOpen ? s.chevronRotate : s.chevronNoRotate}`} alt="chevron-down" />
            </div>
            {isOpen && (
                <ul className={s.selectList}>
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
