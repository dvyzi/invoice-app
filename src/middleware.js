import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Liste des routes qui nécessitent une authentification
const protectedRoutes = [
    '/admin-invoice',
    '/invoice'
    // Ajoutez d'autres routes protégées ici
]

// Liste des routes API (toujours accessibles)
const apiRoutes = [
    '/api/authentification',
    '/api/authentification/register',
    '/api/authentification/logout',
    '/api/user',
    '/api/invoices/access',
    '/api/invoices/'
]

export async function middleware(request) {
    const { pathname } = request.nextUrl
    const url = request.nextUrl.clone()
    
    // 1. Permettre l'accès aux routes API sans authentification
    if (apiRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next()
    }
    
    // 2. Permettre l'accès aux routes client de factures sans authentification
    // Format: /invoice/[clientName]/[invoiceId]
    const invoiceClientPattern = /\/invoice\/[^/]+\/[^/]+/;
    if (invoiceClientPattern.test(pathname)) {
        return NextResponse.next();
    }
    
    // 3. Vérifier l'authentification pour les routes protégées
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        // Récupérer le token JWT depuis les cookies
        const token = request.cookies.get('auth-token')?.value
        
        // Si pas de token, rediriger vers la page d'accueil
        if (!token) {
            url.pathname = '/'
            return NextResponse.redirect(url)
        }
        
        try {
            // Vérifier le JWT
            const { payload } = await jwtVerify(
                token, 
                new TextEncoder().encode(process.env.JWT_SECRET)
            )
            
            // Vérifier si le token est expiré
            const currentTime = Math.floor(Date.now() / 1000)
            if (payload.exp && payload.exp < currentTime) {
                // Token expiré, rediriger
                url.pathname = '/'
                const response = NextResponse.redirect(url)
                response.cookies.delete('auth-token')
                return response
            }
            
            // Token valide, continuer
            return NextResponse.next()
        } catch (error) {
            console.error('Erreur de vérification JWT:', error)
            // Token invalide, rediriger
            url.pathname = '/'
            const response = NextResponse.redirect(url)
            response.cookies.delete('auth-token')
            return response
        }
    }
    
    // 4. Pour toutes les autres routes (y compris '/')
    return NextResponse.next()
}

// Configuration des routes sur lesquelles le middleware s'applique
export const config = {
    matcher: [
        // Appliquer à toutes les routes sauf les fichiers statiques et les API déjà exclues
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
}
