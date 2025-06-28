'use client';

import { usePathname } from 'next/navigation';
import Header from '@components/Header';

export default function ClientLayoutWrapper({ children }) {
    const pathname = usePathname();
    const isClientInvoicePage = /\/invoice\/[^/]+\/[^/]+/.test(pathname);
    
    return (
        <div className="flex flex-col lg:flex-row h-screen">
            {/* Le Header décidera lui-même s'il doit s'afficher ou non en fonction du pathname */}
            <Header />
            
            {/* Contenu principal avec mise en page adaptée */}
            {isClientInvoicePage ? (
                <main className="flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            ) : (
                <main className="flex-1 overflow-auto p-8">
                    <div className="max-w-7xl mx-auto w-[98%] md:w-4/5 lg:w-3/4 pt-14">
                        {children}
                    </div>
                </main>
            )}
        </div>
    );
}
