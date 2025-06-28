'use client';

import { User, Moon, Hourglass, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const profileMenuRef = useRef(null);
    const pathname = usePathname();
    
    // Vérifier si nous sommes sur une page d'accès client aux factures
    const isClientInvoicePage = /\/invoice\/[^/]+\/[^/]+/.test(pathname);
    
    // Récupérer les informations de l'utilisateur au chargement du composant
    // seulement si nous ne sommes pas sur une page d'accès client
    useEffect(() => {
        const fetchUserData = async () => {
            // Ne pas récupérer les données utilisateur sur les pages d'accès client
            if (isClientInvoicePage) {
                setIsLoading(false);
                return;
            }
            
            try {
                const response = await fetch('/api/user');
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.user);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateur:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUserData();
    }, [isClientInvoicePage, pathname]);
    
    // Fermer le menu de profil quand on clique ailleurs sur la page
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/authentification/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    // Si nous sommes sur une page d'accès client, ne pas afficher le header
    if (isClientInvoicePage) {
        return null;
    }
    
    return (
        <header className="bg-dark-1 shadow-md h-[72px] w-full md:h-20 lg:h-full lg:w-[103px] lg:rounded-tr-[20px] lg:rounded-br-[20px] fixed z-50">
            <nav className="flex justify-between lg:h-full lg:flex-col">
                <div>
                    <Link href="/">
                        <img src="/logo.svg" alt="Logo" className="h-[72px] md:h-20 lg:h-auto" />
                    </Link>
                </div>

                <div className='flex items-center lg:flex-col'>
                    <div className="w-full flex items-center justify-center lg:border-t lg:border-l-0 border-l border-[#494E6E] h-full px-6 lg:py-6 relative" ref={profileMenuRef}>
                        <div 
                            className="flex justify-center cursor-pointer p-2 rounded-full"
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        >
                            <User className="w-8 h-8 hover:cursor-pointer text-gray-light" />
                        </div>
                        
                        {isProfileMenuOpen && userData && (
                            <div className="fixed lg:absolute top-[72px] md:top-20 lg:top-[-18px] right-0 lg:left-[103px] lg:right-auto w-auto lg:w-auto bg-white rounded-lg shadow-lg min-w-[200px] py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-700">
                                        {userData.name} {userData.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {userData.email}
                                    </p>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-left text-red-500 hover:bg-gray-100"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}