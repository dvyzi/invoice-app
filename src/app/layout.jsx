import './globals.css'
import Header from '@/components/header'
export const metadata = {
    title: 'Application de Facturation',
    description: 'Gérez vos factures en toute simplicité',
}

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
            <body className="bg-light">
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