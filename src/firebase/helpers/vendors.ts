import firebase from '../client'

import type { Vendor } from '../../types/vendor'
import type { Category } from '../../types/category'

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

export function createCategory(vendorId: string, catId: string, category: Category) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('categories')
        .doc(catId)
        .set(category)
}

export function updateCategory(vendorId: string, category: Category) {
    const { id, ...data } = category
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('categories')
        .doc(id)
        .update(data)
}

export function deleteCategory(vendorId: string, catId: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('categories')
        .doc(catId)
        .delete()
}

export function updateCategoryOrder(vendorId: string, newOrder: string[]) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('categories')
        .doc('_meta_')
        .update({ order: newOrder })
}

export function updateCategoryAvailability(vendorId: string, catId: string, available: boolean) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('categories')
        .doc(catId)
        .update({ available: available })
}
