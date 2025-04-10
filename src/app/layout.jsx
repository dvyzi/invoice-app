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
                        <div className="max-w-7xl mx-auto w-[90%] md:w-[672px] lg:w-[730px] pt-14">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    )
} 