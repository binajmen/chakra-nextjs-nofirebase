import firebase from '@/lib/firebase/client'

import type { Vendor } from '@/types/vendor'
import type { Category } from '@/types/category'

export function updateVendor(vendorId: string, data: Vendor) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .set({ ...data }, { merge: true })
}

export function getOpeningHours(vendorId: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .get()
}

export function getCategories(vendorId: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('categories')
        .get()
}

export function getCategory(vendorId: string, catId: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('categories')
        .doc(catId)
        .get()
}
