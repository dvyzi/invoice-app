import './globals.css'
import { League_Spartan } from 'next/font/google'
import Header from '@components/Header';
import ClientLayoutWrapper from './ClientLayoutWrapper';

const LeagueSpartan = League_Spartan({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    variable: '--font-league-spartan',
})

export const metadata = {
    title: 'Application de Facturation',
    description: 'Gérez vos factures en toute simplicité',
}

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body className={`bg-light ${LeagueSpartan.variable}`}>
                <ClientLayoutWrapper>
                    {children}
                </ClientLayoutWrapper>
            </body>
        </html>
    )
}
