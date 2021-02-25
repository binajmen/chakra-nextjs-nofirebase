import firebase from '../client'
// import admin from '../admin'

type Vendor = {
    address?: string
    cover?: string
    geo?: {
        hash: string
        lat: number
        lng: number
    },
    name?: string
    phone?: string
    slug?: string
    web?: string
    types?: string[]                    // now, takeaway, delivery
    opening?: {
        [index: string]: {              // now, takeaway, delivery
            [index: string]: string[]   // mon - sun
        }
    }
}

// export async function isMemberOf(userId: string, vendorId: string) {
//     const doc = await admin
//         .firestore()
//         .collection('roles')
//         .doc(userId)
//         .get()

//     if (doc.exists) {
//         if (doc.data()!.vendors?.includes(vendorId)) return true
//         else return false
//     } else {
//         return false
//     }
// }

export function updateVendor(id: string, vendor: Vendor) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(id)
        .set({ ...vendor }, { merge: true })
}

export function getOpeningHours(id: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(id)
        .get()
}