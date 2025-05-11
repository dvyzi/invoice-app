import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { redirect } from 'next/dist/server/api-utils'

// Liste des routes qui nécessitent une authentification
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/invoice'
    // Ajoutez d'autres routes protégées ici
]

// Liste des routes publiques (accessibles sans authentification)
const publicRoutes = [
    '/',
]

export async function middleware(request) {
    const { pathname } = request.nextUrl

    // Vérifier si la route actuelle est protégée
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Vérifier si la route actuelle est publique
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    // Récupérer le token JWT depuis les cookies
    const token = request.cookies.get('auth-token')?.value

    // Si c'est une route protégée
    if (isProtectedRoute) {
        if (!token) {
            const url = new URL('/', request.url)
            return NextResponse.redirect(url)
        }

        try {
            // Vérifier le JWT

            const { payload } = await jwtVerify(token, process.env.JWT_SECRET)

            // Continuer avec les headers modifiés
            return NextResponse.next()
        } catch (error) {
            // Token invalide ou expiré
            const url = new URL('/', request.url)
            // NextResponse.next().cookies.delete('auth-token')
            return NextResponse.redirect(url) 
        }
    }

    // Continuer la requête normalement
    return NextResponse.next()
}

// Configuration des routes sur lesquelles le middleware s'applique
export const config = {
    matcher: publicRoutes.concat(protectedRoutes)
}