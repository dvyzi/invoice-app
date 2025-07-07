export const metadata = {
    title: 'Administration',
    description: 'Interface d\'administration des factures',
}

export default function AdminInvoiceLayout({ children }) {
    return (
        <div className="space-y-6">
            {/* Contenu des sous-pages */}
            <section>
                {children}
            </section>
        </div>
    )
}
