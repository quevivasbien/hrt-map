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
      <body className="sm:bg-slate-100">
        <UserContextProvider>
          <NavBar />
          <div className="p-8 sm:bg-white sm:mx-auto sm:max-w-3xl sm:my-4 sm:drop-shadow">
            {children}
          </div>
        </UserContextProvider>
      </body>
    </html>
  )
}
