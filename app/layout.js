import './globals.css'

export const metadata = {
  title: 'Trove - Your Digital Collection',
  description: 'Collect and share your favorite things',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}