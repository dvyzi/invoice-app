"use client"    

import Buttons from "@/components/buttons";
import { ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

const FilterDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        paid: false,
        pending: false,
        draft: false
    });

    const filterOptions = [
        { id: 'paid', label: 'Payée' },
        { id: 'pending', label: 'En attente' },
        { id: 'draft', label: 'Brouillon' }
    ];

    const handleFilterChange = (id) => {
        setSelectedFilters(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div 
            className="relative group"
        >
            <button className="flex items-center gap-2">
                <span className="text-heading-s text-dark-2">
                    Filtrer<span className="hidden md:inline"> par statut</span>
                </span>
                <ChevronDown className={`w-6 h-6 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div 
                className={`absolute top-full -left-4 mt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200`}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
            >
                <div className="bg-white rounded-lg shadow-lg p-4 min-w-[192px] z-10">
                    {filterOptions.map((option) => (
                        <label key={option.id} className="flex items-center gap-3 py-2 cursor-pointer">
                            <div className="relative w-4 h-4">
                                <input
                                    type="checkbox"
                                    id={option.id}
                                    checked={selectedFilters[option.id]}
                                    onChange={() => handleFilterChange(option.id)}
                                    className="peer w-4 h-4 appearance-none bg-gray-1 checked:bg-primary hover:border hover:border-primary rounded-sm"
                                />
                                <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 stroke-[4]" />
                            </div>
                            <span className="text-heading-s">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function DashboardPage() {
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
}