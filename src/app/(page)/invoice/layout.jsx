export const metadata = {
    title: 'Facture',
    description: 'Consultez et gérez votre facture',
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