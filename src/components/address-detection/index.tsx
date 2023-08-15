import { FC } from 'react'

interface AddressDetectionProps {
    text: string;
}

export const AddressDetection: FC<AddressDetectionProps> = ({ text }) => {
    const detectAddress = (text: string) => {
        const addressRegex = ''

        // return matches ? matches[0] : 'Address not found'
        return ''
    }

    const detectedAddress = detectAddress(text)
    return (
        <div>
            <p></p>
        </div>
    )
}
