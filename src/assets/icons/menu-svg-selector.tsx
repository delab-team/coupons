import { FC } from 'react'

import { useChangeSvgColor } from '../../hooks/useSvgTelegram'

interface MenuSvgSelectorProps {
    id: string;
    isTg: boolean;
}

export const MenuSvgSelector: FC<MenuSvgSelectorProps> = ({ id, isTg }) => {
    const svgStyleTelegram = useChangeSvgColor(isTg)

    switch (id) {
        case 'checks':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" style={svgStyleTelegram} width="31" height="31" viewBox="0 0 31 31">
                    <path d="M24.4915 4.74818L26.2472 6.50388C27.5443 7.80097 27.5443 9.90399 26.2472 11.2011L23.25 14.1982L11.2335 26.2148C10.2992 27.149 9.032 27.6739 7.7107 27.6739H5.59107C4.33758 27.6739 3.32143 26.6578 3.32143 25.4043V23.2847C3.32143 21.9633 3.84637 20.6961 4.78076 19.7617L16.7976 7.74557L16.7971 7.74534L19.7943 4.74818C21.0913 3.45109 23.1944 3.45109 24.4915 4.74818ZM18.2679 9.40679L6.34646 21.3275C5.82735 21.8466 5.53571 22.5506 5.53571 23.2847V25.4043C5.53571 25.4348 5.5605 25.4596 5.59107 25.4596H7.7107C8.44476 25.4596 9.14875 25.168 9.66782 24.649L21.5893 12.7282L18.2679 9.40679ZM21.36 6.31392L19.9286 7.74534L23.25 11.0668L24.6814 9.63535C25.1138 9.20298 25.1138 8.50198 24.6814 8.06961L22.9257 6.31392C22.4934 5.88155 21.7924 5.88155 21.36 6.31392Z" />
                </svg>
            )
        case 'settings':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" style={svgStyleTelegram} width="31" height="31" viewBox="0 0 33 33">
                    <path d="M18.0888 0.057496C18.6805 0.154029 19.2403 0.384883 19.7429 0.794852C20.5662 1.46644 20.9583 2.31302 21.2613 3.54896C21.3389 3.86536 21.4731 4.23421 21.6409 4.5922C22.0257 4.75903 22.4023 4.94446 22.7693 5.14776C23.1315 5.0565 23.4795 4.9353 23.7573 4.80343C25.7118 3.87566 27.3515 3.9244 28.6942 5.40111C28.8078 5.52602 28.8756 5.60876 29.0232 5.79453L29.8942 6.89121C30.1284 7.18615 30.2285 7.32053 30.3762 7.57128C31.3338 9.19613 30.9604 10.7094 29.7501 12.3492C29.5493 12.6213 29.3442 12.9774 29.1727 13.3521C29.2809 13.7508 29.371 14.1551 29.4427 14.564C29.751 14.8158 30.0787 15.0365 30.3681 15.1871C31.481 15.7661 32.2018 16.3461 32.6584 17.3152C32.9371 17.9067 33.0318 18.5147 32.9909 19.1243C32.9693 19.4465 32.9352 19.6261 32.8441 20.0283L32.5328 21.4032C32.4417 21.8054 32.3952 21.9821 32.2761 22.2813C32.0507 22.8475 31.7042 23.3516 31.1994 23.7587C30.3724 24.4256 29.4752 24.6247 28.2259 24.6478C27.9099 24.6536 27.5323 24.7029 27.1567 24.7873C26.9124 25.1313 26.6523 25.4634 26.3773 25.7824C26.382 26.1693 26.4198 26.5496 26.4844 26.8605C26.7434 28.1068 26.755 29.043 26.3037 30.0146C26.0282 30.6077 25.6244 31.0654 25.1341 31.4167C24.8749 31.6023 24.7165 31.6883 24.3527 31.8692L23.1088 32.4878C22.745 32.6688 22.581 32.7431 22.278 32.837C21.7046 33.0147 21.1023 33.0574 20.4743 32.9136C19.4456 32.678 18.7292 32.0923 17.9254 31.1169C17.713 30.8591 17.4227 30.5785 17.107 30.3258C16.9052 30.3352 16.7028 30.3399 16.5 30.3399C16.2971 30.3399 16.0947 30.3352 15.8929 30.3258C15.5773 30.5785 15.2869 30.8591 15.0745 31.1169C14.2707 32.0923 13.5544 32.678 12.5256 32.9136C11.8976 33.0574 11.2953 33.0147 10.722 32.837C10.4189 32.7431 10.255 32.6688 9.89116 32.4878L8.64723 31.8692C8.53786 31.8149 8.47002 31.7807 8.39078 31.7386C6.5756 30.7748 6.04346 29.1321 6.51554 26.8605C6.58017 26.5496 6.61789 26.1693 6.6226 25.7824C6.34761 25.4634 6.08751 25.1313 5.84328 24.7873C5.46763 24.7029 5.09001 24.6536 4.77399 24.6478C3.52474 24.6247 2.62753 24.4256 1.80054 23.7587C1.29571 23.3516 0.949188 22.8475 0.723832 22.2813C0.604716 21.9821 0.558198 21.8054 0.467142 21.4032L0.15581 20.0283C0.059406 19.6025 0.0238911 19.4126 0.00560391 19.0676C-0.0286782 18.4209 0.092704 17.7783 0.414666 17.1687C0.88377 16.2806 1.57812 15.7353 2.63185 15.1871C2.92128 15.0365 3.24897 14.8158 3.55726 14.564C3.62889 14.1551 3.719 13.7508 3.82721 13.3521C3.65568 12.9774 3.45064 12.6213 3.24983 12.3492C2.03954 10.7094 1.66618 9.19613 2.6237 7.57128C2.77147 7.32053 2.87154 7.18615 3.10578 6.89121L3.97676 5.79453C4.1243 5.60876 4.19211 5.52602 4.30568 5.40111C5.64843 3.9244 7.28812 3.87566 9.24266 4.80343C9.52047 4.9353 9.86838 5.0565 10.2306 5.14776C10.5977 4.94446 10.9742 4.75903 11.359 4.5922C11.5268 4.23421 11.661 3.86536 11.7386 3.54896C12.0417 2.31302 12.4337 1.46644 13.2571 0.794852C13.7597 0.384883 14.3194 0.154029 14.9111 0.057496C15.1613 0.0166764 15.3261 0.0043708 15.5893 0.00108134L17.192 0C17.5967 0 17.776 0.00647154 18.0888 0.057496ZM17.3106 2.8226L15.808 2.82231C15.116 2.82231 14.77 2.82231 14.424 4.23347C14.2319 5.01677 13.8267 6.01745 13.2674 6.87352C12.378 7.17043 11.5416 7.58651 10.7763 8.10327C9.78428 8.00361 8.78321 7.6985 8.07444 7.36207C6.78113 6.74817 6.56338 7.02234 6.12789 7.57067L5.25691 8.66735C4.82143 9.21569 4.60368 9.48985 5.4615 10.6521C5.94432 11.3062 6.45955 12.2748 6.75834 13.2713C6.45238 14.117 6.24934 15.0135 6.16469 15.945C5.47045 16.699 4.59944 17.3318 3.89006 17.7009C2.61936 18.3621 2.6972 18.7059 2.85286 19.3934L3.16419 20.7684C3.31986 21.4559 3.39769 21.7996 4.82405 21.8259C5.61269 21.8405 6.65503 22.0166 7.59603 22.3769C8.07397 23.188 8.6555 23.9284 9.32195 24.5791C9.45253 25.5916 9.38631 26.6617 9.22341 27.4456C8.92769 28.8686 9.23867 29.0232 9.86064 29.3325L11.1046 29.9511C11.7265 30.2605 12.0375 30.4151 12.9552 29.3014C13.4698 28.6769 14.2753 27.9503 15.1564 27.4297C15.5962 27.4877 16.0447 27.5176 16.5 27.5176C16.9553 27.5176 17.4037 27.4877 17.8435 27.4297C18.7247 27.9503 19.5302 28.6769 20.0447 29.3014C20.9624 30.4151 21.2734 30.2605 21.8954 29.9511L23.1393 29.3325C23.7613 29.0232 24.0722 28.8686 23.7765 27.4456C23.6136 26.6617 23.5474 25.5916 23.678 24.5791C24.3444 23.9284 24.926 23.188 25.4039 22.3769C26.3449 22.0166 27.3872 21.8405 28.1759 21.8259C29.6022 21.7996 29.6801 21.4559 29.8357 20.7684L30.1471 19.3934C30.3027 18.7059 30.3806 18.3621 29.1099 17.7009C28.4005 17.3318 27.5295 16.699 26.8352 15.945C26.7506 15.0135 26.5475 14.117 26.2416 13.2713C26.5404 12.2748 27.0556 11.3062 27.5384 10.6521C28.3962 9.48985 28.1785 9.21569 27.743 8.66735L26.872 7.57067C26.4365 7.02234 26.2188 6.74817 24.9255 7.36207C24.2167 7.6985 23.2156 8.00361 22.2236 8.10327C21.4583 7.58651 20.6219 7.17043 19.7326 6.87352C19.1733 6.01745 18.768 5.01677 18.576 4.23347C18.2503 2.90532 17.9247 2.8272 17.3106 2.8226ZM16.5 10.5837C19.9396 10.5837 22.728 13.4268 22.728 16.9339C22.728 20.441 19.9396 23.2841 16.5 23.2841C13.0603 23.2841 10.272 20.441 10.272 16.9339C10.272 13.4268 13.0603 10.5837 16.5 10.5837ZM16.5 13.406C14.5891 13.406 13.04 14.9855 13.04 16.9339C13.04 18.8823 14.5891 20.4618 16.5 20.4618C18.4109 20.4618 19.96 18.8823 19.96 16.9339C19.96 14.9855 18.4109 13.406 16.5 13.406Z" />
                </svg>
            )

        case 'scanner':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" style={svgStyleTelegram} width="31" height="31" viewBox="0 0 28 28">
                    <path d="M24 19.1542C24.5523 19.1542 25 19.6019 25 20.1542C25 21.5244 24.8663 22.2166 24.4811 22.9369C24.1265 23.6 23.6 24.1265 22.9369 24.4811C22.2166 24.8663 21.5244 25 20.1542 25C19.6019 25 19.1542 24.5523 19.1542 24C19.1542 23.4477 19.6019 23 20.1542 23L20.5719 22.9953C21.3313 22.9762 21.6586 22.8967 21.9937 22.7175C22.3083 22.5492 22.5492 22.3083 22.7175 21.9937C22.9266 21.6027 23 21.2224 23 20.1542C23 19.6019 23.4477 19.1542 24 19.1542ZM4 19.1542C4.55228 19.1542 5 19.6019 5 20.1542L5.00468 20.5719C5.02375 21.3313 5.10331 21.6586 5.28251 21.9937C5.45077 22.3083 5.69171 22.5492 6.00633 22.7175C6.39726 22.9266 6.77757 23 7.84583 23C8.39811 23 8.84583 23.4477 8.84583 24C8.84583 24.5523 8.39811 25 7.84583 25C6.47564 25 5.78342 24.8663 5.06313 24.4811C4.39998 24.1265 3.87355 23.6 3.51889 22.9369C3.13367 22.2166 3 21.5244 3 20.1542C3 19.6019 3.44772 19.1542 4 19.1542ZM20 15C20.5128 15 20.9355 15.386 20.9933 15.8834L21 16V17.4361C21 18.3999 20.9008 18.9134 20.6147 19.4484C20.3472 19.9486 19.9486 20.3472 19.4484 20.6147C18.958 20.877 18.4856 20.9822 17.668 20.9979L17.4361 21H10.5639C9.6001 21 9.08664 20.9008 8.55156 20.6147C8.05136 20.3472 7.65283 19.9486 7.38532 19.4484C7.123 18.958 7.01782 18.4856 7.00212 17.668L7 17.4361V16C7 15.4477 7.44772 15 8 15C8.51284 15 8.93551 15.386 8.99327 15.8834L9 16L9.00099 17.6056C9.00692 18.0759 9.04018 18.2732 9.11775 18.4426L9.14895 18.5052C9.23005 18.6569 9.3431 18.7699 9.49475 18.8511C9.68178 18.9511 9.86535 18.9923 10.3944 18.999L10.5639 19L17.6056 18.999C18.1346 18.9923 18.3182 18.9511 18.5052 18.8511C18.6569 18.7699 18.7699 18.6569 18.8511 18.5052C18.9511 18.3182 18.9923 18.1346 18.999 17.6056L19 17.4361V16C19 15.4477 19.4477 15 20 15ZM17.4361 7C18.3999 7 18.9134 7.09916 19.4484 7.38532C19.9486 7.65283 20.3472 8.05136 20.6147 8.55156C20.877 9.04205 20.9822 9.51438 20.9979 10.332L21 10.5639V11H23C23.5523 11 24 11.4477 24 12C24 12.5523 23.5523 13 23 13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H7V10.5639C7 9.68042 7.08332 9.17534 7.31762 8.68515L7.38532 8.55156C7.65283 8.05136 8.05136 7.65283 8.55156 7.38532C9.04205 7.123 9.51438 7.01782 10.332 7.00212L10.5639 7H17.4361ZM17.6056 9.00099H10.3944C9.86535 9.00766 9.68178 9.04892 9.49475 9.14895C9.3431 9.23005 9.23005 9.3431 9.14895 9.49475C9.04892 9.68178 9.00766 9.86535 9.00099 10.3944L9 11H18.999L18.999 10.3944C18.9931 9.92414 18.9598 9.72684 18.8823 9.55745L18.8511 9.49475C18.7699 9.3431 18.6569 9.23005 18.5052 9.14895C18.3182 9.04892 18.1346 9.00766 17.6056 9.00099ZM7.84583 3C8.39811 3 8.84583 3.44772 8.84583 4C8.84583 4.55228 8.39811 5 7.84583 5L7.42808 5.00468C6.66869 5.02375 6.34141 5.10331 6.00633 5.28251C5.69171 5.45077 5.45077 5.69171 5.28251 6.00633C5.07344 6.39726 5 6.77757 5 7.84583C5 8.39811 4.55228 8.84583 4 8.84583C3.44772 8.84583 3 8.39811 3 7.84583C3 6.47564 3.13367 5.78342 3.51889 5.06313C3.87355 4.39998 4.39998 3.87355 5.06313 3.51889C5.78342 3.13367 6.47564 3 7.84583 3ZM20.1542 3C21.5244 3 22.2166 3.13367 22.9369 3.51889C23.6 3.87355 24.1265 4.39998 24.4811 5.06313C24.8663 5.78342 25 6.47564 25 7.84583C25 8.39811 24.5523 8.84583 24 8.84583C23.4477 8.84583 23 8.39811 23 7.84583L22.9953 7.42808C22.9762 6.66869 22.8967 6.34141 22.7175 6.00633C22.5492 5.69171 22.3083 5.45077 21.9937 5.28251C21.6027 5.07344 21.2224 5 20.1542 5C19.6019 5 19.1542 4.55228 19.1542 4C19.1542 3.44772 19.6019 3 20.1542 3Z" />
                </svg>
            )

        case 'activate':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" style={svgStyleTelegram} width="31" height="31" viewBox="0 0 576 448">
                    <path d="M 144 32 Q 129 33 128 48 L 128 352 L 448 352 L 448 48 Q 447 33 432 32 L 144 32 L 144 32 Z M 480 48 L 480 352 L 496 352 Q 511 353 512 368 Q 511 383 496 384 L 480 384 L 448 384 L 128 384 L 96 384 L 80 384 Q 65 383 64 368 Q 65 353 80 352 L 96 352 L 96 48 Q 97 28 110 14 Q 124 1 144 0 L 432 0 Q 452 1 466 14 Q 479 28 480 48 L 480 48 Z M 48 288 L 64 288 L 64 320 L 48 320 Q 33 321 32 336 L 32 400 Q 33 415 48 416 L 528 416 Q 543 415 544 400 L 544 336 Q 543 321 528 320 L 512 320 L 512 288 L 528 288 Q 548 289 562 302 Q 575 316 576 336 L 576 400 Q 575 420 562 434 Q 548 447 528 448 L 48 448 Q 28 447 14 434 Q 1 420 0 400 L 0 336 Q 1 316 14 302 Q 28 289 48 288 L 48 288 Z M 379 142 L 273 249 Q 261 258 250 249 L 197 195 Q 187 184 197 173 Q 208 163 219 173 L 261 215 L 357 119 Q 368 110 379 119 Q 389 131 379 142 L 379 142 Z" />
                </svg>
            )
        case 'chevron-right':
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={svgStyleTelegram} xmlns="http://www.w3.org/2000/svg">
                    <g id="chevron_right_24">
                        <path id="&#226;&#134;&#179; Icon Color" d="M14.2322 12L8.11612 5.88388C7.62796 5.39573 7.62796 4.60427 8.11612 4.11612C8.60427 3.62796 9.39573 3.62796 9.88388 4.11612L16.8839 11.1161C17.372 11.6043 17.372 12.3957 16.8839 12.8839L9.88388 19.8839C9.39573 20.372 8.60427 20.372 8.11612 19.8839C7.62796 19.3957 7.62796 18.6043 8.11612 18.1161L14.2322 12Z" fill="white"/>
                    </g>
                </svg>
            )
        default:
            return null
    }
}
