import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TonConnectUIProvider, useTonAddress } from '@tonconnect/ui-react'

import eruda from 'eruda'

import { App } from './App'

import './index.scss'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const el = document.createElement('div')
document.body.appendChild(el)

eruda.init({
    container: el,
    tool: [ 'console', 'elements' ]
})

root.render(
    <TonConnectUIProvider manifestUrl="https://gist.github.com/anovic123/80cd4f1a001af87d0d7463e9abd00db8.txt">
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </TonConnectUIProvider>
)
