"use client"    

import Buttons from "@/components/buttons";
import { ChevronDown, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

const FilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [filters, setFilters] = useState({
        paid: false,
        pending: false,
        draft: false
    });

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filterOptions = [
        { id: 'paid', label: 'Payée' },
        { id: 'pending', label: 'En attente' },
        { id: 'draft', label: 'Brouillon' }
    ];

    const toggleFilter = (id) => {
        setFilters(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className={`relative ${isDesktop ? 'group' : ''}`}>
            <button 
                className="flex items-center gap-2"
                onClick={() => !isDesktop && setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className="text-heading-s text-dark-2">
                    Filtrer<span className="hidden md:inline"> par statut</span>
                </span>
                <ChevronDown 
                    className={`w-6 h-6 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                />
            </button>

            <div 
                className={`absolute top-full ${isDesktop ? '-left-4' : '-left-8 sm:-left-4'} mt-2 ${
                    isDesktop 
                    ? 'invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200' 
                    : isOpen ? 'block' : 'hidden'
                }`}
                onMouseEnter={() => isDesktop && setIsOpen(true)}
                onMouseLeave={() => isDesktop && setIsOpen(false)}
                role="menu"
            >
                <div className="pt-2">
                    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[192px] z-10">
                        {filterOptions.map((option) => (
                            <label 
                                key={option.id} 
                                className="flex items-center gap-3 py-2 cursor-pointer"
                            >
                                <div className="relative w-4 h-4">
                                    <input
                                        type="checkbox"
                                        id={option.id}
                                        checked={filters[option.id]}
                                        onChange={() => toggleFilter(option.id)}
                                        className="peer w-4 h-4 appearance-none bg-gray-1 checked:bg-primary hover:border-2 hover:border-primary rounded-sm"
                                    />
                                    <Check 
                                        className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 stroke-[4]"
                                        aria-hidden="true"
                                    />
                                </div>
                                <span className="text-heading-s">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardPage = () => {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-heading-m md:text-heading-l">Factures</h1>
                <p className="text-heading-s text-gray-2">
                    <span className="hidden md:inline">Il y a </span>
                    7 factures
                    <span className="hidden md:inline"> au total</span>
                </p>
            </div>
            <div className="flex items-center gap-4 md:gap-9">
                <FilterDropdown />
                <Buttons type="new-invoice">
                    Nouvelle facture
                </Buttons>
                <Buttons type="new-invoice-mobile"/>
            </div>
        </div>
    );
};

export default DashboardPage;