import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Liste des routes qui nécessitent une authentification
const protectedRoutes = [
    '/invoice'
    // Ajoutez d'autres routes protégées ici
]

// Liste des routes API (toujours accessibles)
const apiRoutes = [
    '/api/authentification',
    '/api/authentification/register',
    '/api/authentification/logout',
    '/api/user'
]

export async function middleware(request) {
    const { pathname } = request.nextUrl
    
    // Ignorer les routes API
    if (apiRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next()
    }
    
    // Récupérer le token JWT depuis les cookies
    const token = request.cookies.get('auth-token')?.value
    
    // Pour les routes protégées, vérifier l'authentification
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
        if (!token) {
            return NextResponse.redirect(new URL('/', request.url))
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
                // Token expiré, supprimer le cookie et rediriger
                const response = NextResponse.redirect(new URL('/', request.url))
                response.cookies.delete('auth-token')
                return response
            }
            
            // Token valide, continuer
            return NextResponse.next()
        } catch (error) {
            // Token invalide, supprimer le cookie et rediriger
            const response = NextResponse.redirect(new URL('/', request.url))
            response.cookies.delete('auth-token')
            return response
        }
    }
    
    // Pour toutes les autres routes (y compris '/')
    // laisser passer la demande sans redirection
    return NextResponse.next()
}

// Configuration des routes sur lesquelles le middleware s'applique
export const config = {
    matcher: [
        // Appliquer à toutes les routes sauf les fichiers statiques et les API déjà exclues
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
}
