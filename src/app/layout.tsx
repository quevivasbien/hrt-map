import './globals.css'
import type { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import { UserContextProvider } from '@/components/UserContext'

export const metadata: Metadata = {
  title: 'HRT Map',
  description: 'App for logging your HRT doses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100">
        <UserContextProvider>
          <NavBar />
          <div className="bg-white mx-4 sm:mx-auto sm:max-w-3xl my-8 p-8 drop-shadow">
            {children}
          </div>
        </UserContextProvider>
      </body>
    </html>
  )
}
