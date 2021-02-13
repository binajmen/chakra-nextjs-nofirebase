import admin from 'firebase-admin'

import serviceAccount from './serviceAccount.json'

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            privateKey: serviceAccount.private_key,
            clientEmail: serviceAccount.client_email,
            projectId: serviceAccount.project_id,
        }),
        databaseURL: 'https://orderbru.firebaseio.com',
    })
}

export default admin