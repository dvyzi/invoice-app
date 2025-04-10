export const metadata = {
    title: "Factures",
    description: "Gérez vos factures",
}

export default function FactureLayout({ children }) {
    return (
        <div className="space-y-6">
            
            {/* Contenu des sous-pages */}
            <section>
                {children}
            </section>
        </div>
    )
}