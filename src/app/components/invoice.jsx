import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Status from '@components/Status';

export default function Invoice({ id, name, date, dateYear, total, status }) {
    return (
        <Link href={`/invoice`} className="flex items-center justify-between w-full bg-white rounded-lg p-6 lg:hover:cursor-pointer lg:hover:outline lg:hover:outline-primary-light lg:hover:outline-1">
            <div className='flex flex-col gap-3 md:flex-row md:justify-between md:w-1/2 md:gap-8'>
                <p className="text-heading-s text-dark-2 pb-3 md:pb-0"><span className='text-muted-dark text-heading-s'>#</span>{id}</p>
                <p className="text-heading-s-nobold text-dark-gray"><span className='text-gray-2 text-heading-s-nobold pr-2'>Échéance</span>{date} <span className='hidden md:inline'>{dateYear}</span></p>
                <p className="text-heading-s-nobold text-gray-2 hidden md:block">{name}</p>
                <p className="text-heading-s text-dark-2 block md:hidden">{total} €</p>
            </div>
            <div className='flex flex-col items-end gap-11 md:flex-row md:justify-end md:gap-8 w-1/2 md:items-center'>
                <p className="text-heading-s text-dark-2 hidden md:block">{total} €</p>
                <p className="text-heading-s-nobold text-gray-2 block md:hidden">{name}</p>
                <div className='flex items-center gap-2'>
                    <Status status={status} />
                    <ChevronRight className='text-primary hidden md:block' />
                </div>
            </div>
        </Link>
    )
}