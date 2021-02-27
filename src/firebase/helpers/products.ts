import firebase from '../client'

import type { Product } from '../../types/product'

export function getProducts(vendorId: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('products')
        .get()
}

export function getProduct(vendorId: string, productId: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('products')
        .doc(productId)
        .get()
}

export function createProduct(vendorId: string, productId: string, product: Product) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('products')
        .doc(productId)
        .set(product)
}

export function updateProduct(vendorId: string, product: Product) {
    const { id, ...data } = product
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('products')
        .doc(id)
        .update(data)
}

export function deleteProduct(vendorId: string, productId: string) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('products')
        .doc(productId)
        .delete()
}

export function updateProductOrder(vendorId: string, newOrder: string[]) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('products')
        .doc('_meta_')
        .update({ order: newOrder })
}

export function updateProductAvailability(vendorId: string, productId: string, available: boolean) {
    return firebase
        .firestore()
        .collection('vendors')
        .doc(vendorId)
        .collection('products')
        .doc(productId)
        .update({ available: available })
}
