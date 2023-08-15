import { useState, useEffect } from 'react'
import numeral from 'numeral'

interface TokenPriceHookProps {
    tokenAmount: number;
}

const TokenPriceHook: React.FC<TokenPriceHookProps> = ({ tokenAmount }) => {
    const [ price, setPrice ] = useState<string>('0')

    useEffect(() => {
        const fetchTokenPrice = async () => {
            try {
                const response = await fetch(
                    'https://api.huobi.pro/market/depth?symbol=tonusdt&type=step0'
                )
                const data: {
                    tick: {
                        asks: [number, number][];
                    };
                } = await response.json()
                const tokenPrice = data.tick.asks[0][0]
                const totalPrice = tokenPrice * tokenAmount
                let formattedPrice = numeral(totalPrice).format('$0.0a')
                formattedPrice = formattedPrice.replace('G', 'B')
                formattedPrice = formattedPrice.replace('M', 'M')
                setPrice(formattedPrice)
            } catch (error) {
                console.error('Error when getting token price:', error)
                setPrice('0')
            }
        }

        fetchTokenPrice()
    }, [ tokenAmount ])

    return price !== null ? <>{price}</> : null
}

export default TokenPriceHook
