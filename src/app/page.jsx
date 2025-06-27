"use client"

import Buttons from "@components/buttons";
import Image from "next/image";
import { ChevronDown, Check, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import Invoice from "@components/invoice";
import NewInvoicePopup from "./components/forms/new-invoice-popup";


const FilterDropdown = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);


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
    // Créer un nouvel objet avec tous les filtres à false
    const newFilters = {
      paid: false,
      pending: false,
      draft: false
    };
    
    // Si le filtre cliqué était déjà actif, tout désactiver
    // Sinon, activer uniquement le filtre cliqué
    if (filters[id]) {
      // Tout reste à false (désélectionne tout)
    } else {
      // Active uniquement le filtre cliqué
      newFilters[id] = true;
    }
    
    setFilters(newFilters);
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
        className={`absolute top-full ${isDesktop ? '-left-4' : '-left-8 sm:-left-4'} mt-2 ${isDesktop
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

const Page = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [filters, setFilters] = useState({
    paid: false,
    pending: false,
    draft: false
  });

  const [isAuthentificated, setIsAuthentificated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [lastName, setLastName] = useState('')
  const [lastNameError, setLastNameError] = useState('')
  const [emptyError, setEmptyError] = useState('')

  const [isRegister, setIsRegister] = useState(false)
  const [text, setText] = useState('Pas encore inscrit ? cliquez ici pour vous inscrire !')
  const [invoices, setInvoices] = useState([])


  const fetchInvoice = () => {
    fetch('/api/invoices/all')
      .then(response => {
        if (!response.ok) {
          // Si le statut est 401, l'utilisateur n'est pas authentifié
          if (response.status === 401) {
            setIsAuthentificated(false);
            setIsLoading(false);
            throw new Error('Non authentifié');
          }
          throw new Error('Erreur réseau');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          const formattedInvoices = data.invoices.map(invoice => {
            const date = new Date(invoice.dueDate);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const formattedDate = date.toLocaleDateString('fr-FR', options);
            return { ...invoice, dueDate: formattedDate }
          });
          setInvoices(formattedInvoices);
          setIsAuthentificated(true);
          setIsLoading(false);
        } else {
          console.error('Erreur:', data.message);
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des factures:', error);
        if (error.message === 'Non authentifié') {
          setIsAuthentificated(false);
        }
        setIsLoading(false);
      });
  }
  
  useEffect(() => {
    fetchInvoice();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/user')
      .then(response => {
        if (response.ok) {
          setIsAuthentificated(true);
          // Laisser l'utilisateur sur la page d'accueil
        } else {
          setIsAuthentificated(false);
        }
      })
      .catch(err => {
        console.error('Erreur lors de la vérification de l\'authentification:', err);
        setIsAuthentificated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const requestAuthentification = async () => {
    setNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setEmptyError('');

    if (isRegister) {
      try {
        const response = await fetch("/api/authentification/register", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email, password, lastName, name
          })
        });

        const data = await response.json();

        if (data.error) {
          if (data.fields) {
            data.fields.forEach(element => {
              if (typeof element === 'string') {
                if (element === 'name') {
                  setNameError('*Champs obligatoires');
                }
                if (element === 'lastName') {
                  setLastNameError('*Champs obligatoires');
                }
                if (element === 'email') {
                  setEmailError('Format d\'email invalide');
                }
                if (element === 'password') {
                  setPasswordError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
                }
              } else if (element.field && element.message) {
                if (element.field === 'email') {
                  setEmailError(element.message);
                }
              }
            });
          } else {
            setEmptyError(data.error || 'Une erreur est survenue');
          }
        } else if (data.status === 201) {
          // Inscription réussie - passer en mode connexion
          setIsRegister(false);
          setText('Pas encore inscrit ? cliquez ici pour vous inscrire !');
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        setEmptyError('Une erreur est survenue. Veuillez réessayer.');
      }
    } else {
      try {
        const response = await fetch("/api/authentification", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email, password,
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Connexion réussie - rediriger vers la page d'accueil
          window.location.href = '/';
        } else {
          // Erreur de connexion
          setEmptyError(data.error || 'Email ou mot de passe incorrect');
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        setEmptyError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  }

  const switchregisterlogin = () => {
    setIsRegister(!isRegister)
    if (isRegister) {
      setText('Pas encore inscrit ? cliquez ici pour vous inscrire !')
    } else {
      setText('Déjà inscrit ? cliquez ici pour vous connecter !')
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)] w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-heading-s text-dark-2">Chargement...</p>
          </div>
        </div>
      ) : !isAuthentificated ? (
        <div className="flex items-center justify-center h-[calc(100vh-200px)] w-full">
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
            {isRegister ? (
              <h2 className="text-heading-m text-dark-2 text-center">Inscription</h2>
            ) : (
              <h2 className="text-heading-m text-dark-2 text-center">Connexion</h2>
            )}

            {isRegister ? (
              <>
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-heading-s text-dark-2">Prénom</label>
                    <input type="text" id="name" name="name" required
                      className="p-3 border border-gray-1 rounded-md focus:outline-none focus:border-primary"
                      placeholder="Jean"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <p className="text-danger text-body">{nameError}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-heading-s text-dark-2">Nom</label>
                    <input type="text" id="lastName" name="lastName" required
                      className="p-3 border border-gray-1 rounded-md focus:outline-none focus:border-primary"
                      placeholder="Dupont"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <p className="text-danger text-body">{lastNameError}</p>
                  </div>
                </div>
              </>
            ) : (
              null
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-heading-s text-dark-2">Email</label>
              <input type="email" id="email" name="email" required
                className="p-3 border border-gray-1 rounded-md focus:outline-none focus:border-primary"
                placeholder="votre@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-danger text-body">{emailError}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-heading-s text-dark-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  className="w-full p-3 border border-gray-1 rounded-md focus:outline-none focus:border-primary"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-2 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-danger text-body">{passwordError}</p>
            </div>
            {!isRegister && emptyError && (
              <p className="text-danger text-center text-body-bold">{emptyError}</p>
            )}
            {isRegister ? (
              <button
                type="submit"
                onClick={requestAuthentification}
                className="w-full bg-primary text-white py-3 rounded-full hover:bg-primary-light transition-colors"
              >
                S'inscrire
              </button>
            ) : (
              <button
                type="submit"
                onClick={requestAuthentification}
                className="w-full bg-primary text-white py-3 rounded-full hover:bg-primary-light transition-colors"
              >
                Se connecter
              </button>
            )}
            <span onClick={switchregisterlogin} className="text-heading-s text-gray-2 hover:text-primary transition-colors cursor-pointer text-center">{text}</span>
          </div>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-16 pt-10 lg:pt-0'>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col gap-[6px]'>
                <h1 className='text-heading-m md:text-heading-l'>Factures</h1>
                <p className='text-heading-s-nobold text-gray-2'>
                  <span className='hidden md:inline'>Il y a </span>{invoices.length} facture{invoices.length !== 1 ? 's' : ''}
                  <span className='hidden md:inline'> au total</span>
                </p>
              </div>
              <div className='flex items-center gap-4 md:gap-9'>
                <FilterDropdown filters={filters} setFilters={setFilters} />
                <Buttons
                  type='new-invoice'
                  onPress={() => setIsPopupOpen(true)}
                >
                  Nouvelle facture
                </Buttons>
                <Buttons
                  type='new-invoice-mobile'
                  onPress={() => setIsPopupOpen(true)}
                />
              </div>
            </div>
            <div className='flex flex-col gap-4'>
              {invoices && invoices.length > 0 ? invoices.filter(invoice => {
                // Si aucun filtre n'est actif, afficher toutes les factures
                const noFiltersActive = !filters.paid && !filters.pending && !filters.draft;
                if (noFiltersActive) return true;
                
                // Sinon, vérifier si le statut de la facture correspond à un filtre actif
                if (filters.paid && invoice.status === 'PAID') return true;
                if (filters.pending && invoice.status === 'PENDING') return true;
                if (filters.draft && invoice.status === 'DRAFT') return true;
                
                return false;
              }).map(invoice => (
                <Invoice
                  key={invoice.id}
                  id={invoice.id}
                  name={invoice.clientName}
                  date={invoice.dueDate}
                  total={invoice.total}
                  status={invoice.status}
                />
              )) : (
                <div className="flex items-center flex-col gap-4 w-60 mx-auto h-[calc(100vh-300px)] justify-center overflow-hidden">
                  <Image src="/nothing-here.svg" alt="empty-state" width={240} height={200} />
                  <h2 className="text-heading-m text-dark-2">Il n'y a rien ici</h2>
                  <p className="text-body text-gray-2">  Créez une facture en cliquant sur le bouton <span className="text-body-bold">Nouvelle facture</span> et commencez à travailler</p>
                </div>
              )}
            </div>
          </div>

          <NewInvoicePopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            onInvoiceCreated={fetchInvoice}
          />
        </>
      )}
    </>
  )
}

export default Page
