import { NextResponse } from 'next/server';

export async function POST(request) {
    // Créer une réponse qui supprime le cookie auth-token
    const response = NextResponse.json(
        {
            message: 'Déconnexion réussie',
            status: 200
        },
        { status: 200 }
    );
    
    // Supprimer le cookie d'authentification
    response.cookies.delete('auth-token');
    
    return response;
}
