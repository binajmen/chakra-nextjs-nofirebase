import { init } from 'next-firebase-auth'

const TWELVE_DAYS = 12 * 60 * 60 * 24 * 1000

// https://github.com/gladly-team/next-firebase-auth#example-config
const initAuth = () => {
    init({
        authPageURL: '/signin',
        appPageURL: '/user',
        loginAPIEndpoint: '/api/login',
        logoutAPIEndpoint: '/api/logout',
        firebaseAdminInitConfig: {
            credential: {
                projectId: process.env.FIREBASE_PROJECT_ID!,
                clientEmail: process.env.FIREBASE_ADMIN_CLIENTEMAIL!,
                privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!
            },
            databaseURL: process.env.FIREBASE_DATABASE_URL!
        },
        firebaseClientInitConfig: {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        },
        cookies: {
            name: 'STBK',
            keys: [
                process.env.COOKIE_SECRET_CURRENT,
                process.env.COOKIE_SECRET_PREVIOUS,
            ],
            httpOnly: true,
            maxAge: TWELVE_DAYS,
            overwrite: true,
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' ? true : false,
            signed: true,
        },
    })
}

export default initAuth
