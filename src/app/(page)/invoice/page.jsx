// import Controls from "@components/controls";
import { ChevronLeft } from 'lucide-react';
import Link from "next/link";
import Status from "@components/Status";
import Buttons from "@components/buttons";


function ProductItem({ name, quantity, price, total }) {
    return (
        <div className='grid grid-cols-4 w-full pb-6'>
            <p className='text-heading-s text-dark-2'>{name}</p>
            <p className='text-heading-s text-dark-gray text-center'>{quantity}</p>
            <p className='text-heading-s text-dark-gray text-center'>{price} €</p>
            <p className='text-heading-s text-dark-2 text-right'>{total} €</p>
        </div>
    )
}
const InvoicePage = () => {
    return (
        <>
            <div className="flex flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 text-dark-2 text-heading-s-nobold cursor-pointer hover:text-muted-dark w-fit"><ChevronLeft className="text-primary w-5 h-5" /> Retour</Link>
                <div className="flex items-center justify-between bg-white rounded-lg p-6">
                    <div className="flex items-center w-full md:w-auto justify-between md:gap-7">
                        <p className="text-body text-dark-gray">Statut</p>
                        <Status status="En attente" />
                    </div>
                    <div className="hidden md:flex flex-row items-center gap-4">
                        <Buttons type="secondary">Modifier</Buttons>
                        <Buttons type="delete" >Supprimer</Buttons>
                        <Buttons type="primary">Marquer comme payé</Buttons>
                    </div>
                </div>
                <div className='bg-white rounded-lg p-12 my-5 flex flex-col gap-6'>
                    <div className='flex flex-col gap-5 md:flex-row md:justify-between md:items-center'>
                        <div className='flex flex-col gap-1 md:gap-2'>
                            <p className='text-heading-s text-dark-2'><span className='text-muted-dark text-heading-s'>#</span>XM9141</p>
                            <p className='text-body text-dark-gray'>Design graphique</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='text-dark-gray text-body'>19 Union Terrace</p>
                            <p className='text-dark-gray text-body'>London</p>
                            <p className='text-dark-gray text-body'>E1 0AR</p>
                            <p className='text-dark-gray text-body'>United Kingdom</p>
                        </div>
                    </div>
                    <div className='flex items-start justify-between pr-0 md:pr-24'>
                        <div className='flex flex-col gap-6'>
                            <div className='flex flex-col gap-2'>
                                <p className='text-body text-dark-gray'>Date de la facture</p>
                                <p className='text-heading-s text-dark-2'>21 août 2025</p>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-body text-dark-gray'>Date limite de paiement</p>
                                <p className='text-heading-s text-dark-2'>21 septembre 2025</p>
                            </div>
                        </div>
                        <div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-body text-dark-gray'>Facturer à</p>
                                <p className='text-heading-s text-dark-2'>John Doe</p>
                            </div>
                            <p className='text-dark-gray text-body'>19 Union Terrace</p>
                            <p className='text-dark-gray text-body'>London</p>
                            <p className='text-dark-gray text-body'>E1 0AR</p>
                            <p className='text-dark-gray text-body'>United Kingdom</p>
                        </div>
                        <div className='hidden md:flex md:flex-col md:gap-2'>
                            <p className='text-body text-dark-gray'>Envoyé à</p>
                            <p className='text-heading-s text-dark-2'>johndoe@mail.com</p>
                        </div>
                    </div>
                    <div className='flex md:hidden flex-col gap-2'>
                        <p className='text-body text-dark-gray'>Envoyé à</p>
                        <p className='text-heading-s text-dark-2'>johndoe@mail.com</p>
                    </div>
                    <div className='flex flex-col items-center gap-2 bg-gray-light rounded-lg p-10 mt-6'>
                        <div className='grid grid-cols-4 w-full pb-8'>
                            <p className='text-body text-dark-gray'>Nom du produit</p>
                            <p className='text-body text-dark-gray text-center'>QTE.</p>
                            <p className='text-body text-dark-gray text-center'>Prix</p>
                            <p className='text-body text-dark-gray text-right'>Total</p>
                        </div>
                        <ProductItem name="Banner Design" quantity={2} price={200} total={400} />
                        <ProductItem name="Email Design" quantity={1} price={156} total={156} />
                    </div>
                </div>
            </div>

            <div className='md:hidden flex justify-between items-center gap-1 w-full bg-white rounded-lg p-4 fixed bottom-0 left-0 right-0'>
                <Buttons type="secondary">Modifier</Buttons>
                <Buttons type="delete" >Supprimer</Buttons>
                <Buttons type="primary">Marquer comme payé</Buttons>
            </div>
        </>

    )
}

export default InvoicePage;