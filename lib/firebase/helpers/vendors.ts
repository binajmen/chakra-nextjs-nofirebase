import firebase from '@/lib/firebase/client'

import type { Place } from '@/types/place'
import type { Category } from '@/types/category'

export function updatePlace(placeId: string, data: Place) {
    return firebase
        .firestore()
        .collection('places')
        .doc(placeId)
        .set({ ...data }, { merge: true })
}

export function getOpeningHours(placeId: string) {
    return firebase
        .firestore()
        .collection('places')
        .doc(placeId)
        .get()
}

export function getCategories(placeId: string) {
    return firebase
        .firestore()
        .collection('places')
        .doc(placeId)
        .collection('categories')
        .get()
}

export function getCategory(placeId: string, catId: string) {
    return firebase
        .firestore()
        .collection('places')
        .doc(placeId)
        .collection('categories')
        .doc(catId)
        .get()
}
