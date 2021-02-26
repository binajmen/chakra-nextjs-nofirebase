import firebase from '../client'

import type { Vendor } from '../../types/vendor'

export function updateVendor(vendorId: string, data: Vendor) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .set({ ...data }, { merge: true })
}

export function getCategories(vendorId: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('categories')
        .get()
}

export function getOpeningHours(vendorId: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .get()
}