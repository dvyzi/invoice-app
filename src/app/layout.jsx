import './globals.css'
import Header from '@components/Header'
export const metadata = {
    title: 'Application de Facturation',
    description: 'Gérez vos factures en toute simplicité',
}
import { League_Spartan } from 'next/font/google'

const LeagueSpartan = League_Spartan({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-league-spartan',
})



export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body className={`bg-light ${LeagueSpartan.variable}`}>
                <div className="flex flex-col lg:flex-row h-screen">
                    {/* Sidebar */}
                    <Header />

                    {/* Contenu principal */}
                    <main className="flex-1 overflow-auto p-8">
                        <div className="max-w-7xl mx-auto w-[98%] md:w-4/5 lg:w-3/4 pt-14">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    )
}