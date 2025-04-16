'use client';

import { User, Moon, Hourglass } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-dark-1 shadow-md h-[72px] w-full md:h-20 lg:h-full lg:w-[103px] lg:rounded-tr-[20px] lg:rounded-br-[20px] fixed z-50">
            <nav className="flex justify-between lg:h-full lg:flex-col">
                <div>
                    <Link href="/">
                        <img src="/logo.svg" alt="Logo" className="h-[72px] md:h-20 lg:h-auto" />
                    </Link>
                </div>

                <div className='flex items-center lg:flex-col'>
                    {/* <div className='px-6 lg:py-6 relative group flex flex-col items-center'>
                        <div className="bg-primary text-white px-4 py-1.5 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center min-w-[120px] absolute -left-6 -top-10 flex items-center justify-center gap-1.5">
                            Soon
                                <Hourglass className='w-4 h-4' />
                        </div>
                        <Moon className='w-8 h-8 text-[#7E88C3] hover:cursor-pointer' />
                    </div> */}
                    <div className="w-full flex items-center justify-center lg:border-t lg:border-l-0 border-l border-[#494E6E] h-full px-6 lg:py-6">
                        <Link href="#" className="flex justify-center">
                            <User className="w-10 h-10 hover:cursor-pointer text-gray-light" />
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}