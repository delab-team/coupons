import { useEffect, useState } from 'react'

const getWindowWidth = () => {
    const { innerWidth: windowWidth } = typeof window !== 'undefined'
        ? window
        : { innerWidth: 0 }

    return { windowWidth }
}

const useWindowWidth = () => {
    const [ windowWidth, setWindowWidth ] = useState(getWindowWidth())

    const handleResize = () => setWindowWidth(getWindowWidth())

    useEffect(() => {
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return { windowWidth, handleResize }
}

export const useMediaQuery = (maxWidth: number): any => {
    const { windowWidth: { windowWidth }, handleResize } = useWindowWidth()
    const [ isMedia, setIsMedia ] = useState(false)

    useEffect(() => {
        if (windowWidth <= maxWidth) {
            setIsMedia(true)
        } else {
            setIsMedia(false)
        }
    }, [ handleResize, maxWidth, windowWidth ])

    return isMedia
}
