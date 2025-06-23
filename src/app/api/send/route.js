import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        // Récupérer les données du corps de la requête
        const data = await request.json();
        const { clientEmail, clientName } = data;
        
        // Vérification minimale que l'email existe
        if (!clientEmail) {
            return Response.json({ 
                success: false, 
                error: "L'adresse email du client est requise" 
            }, { status: 400 });
        }

        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [clientEmail.trim()], // Nettoyer l'email et l'utiliser
            subject: 'Votre facture est prête',
            html: `<p>Bonjour ${clientName}</p>
            <p>Une facture vous a été envoyée</p>`,
        });

        console.log(result); // s'affiche dans les logs du terminal
        return Response.json({ success: true, result });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, error });
    }
}
