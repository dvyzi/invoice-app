import { ChevronRight } from 'lucide-react';

export default function Invoice({ id, name, date, total, status }) {
    return (
        <div className="flex items-center justify-between w-full bg-white rounded-lg p-6 lg:hover:cursor-pointer lg:hover:border-primary-light lg:hover:border">
            <div className='flex justify-between w-1/2 gap-8'>
                <p className="text-heading-s text-dark-2"><span className='text-muted-dark text-heading-s'>#</span>{id}</p>
                <p className="text-heading-s-nobold text-dark-gray"><span className='text-gray-2 text-heading-s-nobold pr-2'>Échéance</span>{date}</p>
                <p className="text-heading-s-nobold text-gray-2">{name}</p>
            </div>
            <div className='flex justify-end gap-8 w-1/2 items-center'>
                <p className="text-heading-s text-dark-2">{total} €</p>
                <p className="text-heading-s-nobold text-dark-2">
                    {status === 'Payée' ? (
                        <span className='text-green-1 text-heading-s bg-green-light rounded-md px-2 py-1 flex justify-center items-center'> <div className='bg-green-1 rounded-full w-2 h-2 mr-2'></div> {status}</span>
                    ) : status === 'En attente' ? (
                        <span className='text-muted-dark'>{status}</span>
                    ) : status === 'Brouillon' ? (
                        <span className='text-danger'>{status}</span>
                    ) : (
                        <span>{status}</span>
                    )}
                </p>
                <ChevronRight className='text-primary' />
            </div>
        </div>
    )
}