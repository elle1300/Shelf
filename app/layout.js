import './globals.css'

export const metadata = {
  title: 'Trove - Your Digital Library',
  description: 'Organize and share your favorite things',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
