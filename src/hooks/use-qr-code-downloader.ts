import QRCode from 'qrcode'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useQRCodeDownloader = (qrCodeValue: string) => {
    const generateAndDownloadQRCode = async () => {
        try {
            const qrCodeDataURL = await QRCode.toDataURL(qrCodeValue)

            const link = document.createElement('a')
            link.download = 'qrcode.png'
            link.href = qrCodeDataURL
            link.click()
        } catch (error) {
            console.error('Error generating or downloading QR code:', error)
        }
    }

    return generateAndDownloadQRCode
}
