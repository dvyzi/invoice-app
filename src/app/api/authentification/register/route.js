import { NextResponse } from "next/server";
import { PrismaClient } from '../../../../generated/prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();


export async function POST(request) {

    const body = await request?.json();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-@$!%*?&])[A-Za-z\d\-@$!%*?&]{8,}$/

    let fieldsError = []

    if (!body.email || !emailRegex.test(body.email)) {
        fieldsError.push('email')
    }

    const alreadyEmail = await prisma.user.findUnique({
        where: {
            email: body.email,
        },
    })

    if(alreadyEmail){
        fieldsError.push({
            field : 'email',
            message : 'Email déjà utilisé'
        })
    }

    if (!body.password || !passwordRegex.test(body.password)) {
        fieldsError.push('password')
    }

    if (!body.name) {
        fieldsError.push('name')
    }

    if (!body.lastName) {
        fieldsError.push('lastName')
    }

    if (fieldsError.length > 0) {
        return NextResponse.json(
            {
                error: 'Field Error',
                fields: fieldsError,
                status: 400
            },
            { status: 400 }
        );
    }


    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
            name: body.name,
            lastName: body.lastName
        }
    });

    return NextResponse.json(
        {
            message: 'Utilisateur créé avec succès',
            status: 201,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastName: user.lastName
                // Ne pas inclure le mot de passe ici pour des raisons de sécurité
            }
        },
        { status: 201 }
    );
}