export const metadata = {
    title: 'Factures',
    description: 'Consultez et gérez vos factures',
}

export default function InvoiceLayout({ children }) {
    return (
        <div className="space-y-6">
            
            {/* Contenu des sous-pages */}
            <section>
                {children}
            </section>
        </div>
    )
}