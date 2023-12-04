import { Roboto } from 'next/font/google'
import 'material-components-web/dist/material-components-web.css'
import 'material-icons/iconfont/material-icons.css'
import './globals.css'

const roboto = Roboto({ weight: ['300', '400', '500'], display: 'swap', subsets: ['latin'] })

export const metadata = {
  title: 'Fireside Chat',
  description: 'An advanced web-based communication application'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  )
}
