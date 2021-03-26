// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

// eslint-disable-next-line no-unused-vars
import type { Category } from "./types"

const FieldValue = admin.firestore.FieldValue

export const onCreateCategory = async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { placeId, categoryId } = context.params
  const data = snapshot.data() as Category

  const events = data.events.order?.map(eventId => {
    return admin.firestore().doc(`places/${placeId}/events/${eventId}`)
      .update({ categoryIds: FieldValue.arrayUnion(categoryId) })
  })

  const modifiers = data.modifiers.order?.map(modifierId => {
    return admin.firestore().doc(`places/${placeId}/modifiers/${modifierId}`)
      .update({ categoryIds: FieldValue.arrayUnion(categoryId) })
  })

  const products = data.products.map(productId => {
    return admin.firestore().doc(`places/${placeId}/products/${productId}`)
      .update({ categoryIds: FieldValue.arrayUnion(categoryId) })
  })

  Promise.all([events, modifiers, products])
    .catch(error => console.error(error))

  return null
}

export const onUpdateCategory = async (
  change: functions.Change<functions.firestore.QueryDocumentSnapshot>,
  context: functions.EventContext
) => {
  const { placeId, categoryId } = context.params
  const before = change.before.data() as Category
  const after = change.after.data() as Category

  // events
  const remEvents = before.events.order?.filter(e => !after.events.order.includes(e))
    .map(eventId => {
      return admin.firestore().doc(`places/${placeId}/events/${eventId}/`)
        .update({ categoryIds: FieldValue.arrayRemove(categoryId) })
    })

  const addEvents = after.events.order?.filter(e => !before.events.order.includes(e))
    .map(eventId => {
      return admin.firestore().doc(`places/${placeId}/events/${eventId}/`)
        .update({ categoryIds: FieldValue.arrayUnion(categoryId) })
    })

  // modifiers
  const remModifiers = before.modifiers.order?.filter(e => !after.modifiers.order.includes(e))
    .map(modifierId => {
      return admin.firestore().doc(`places/${placeId}/modifiers/${modifierId}/`)
        .update({ categoryIds: FieldValue.arrayRemove(categoryId) })
    })

  const addModifiers = after.modifiers.order?.filter(e => !before.modifiers.order.includes(e))
    .map(modifierId => {
      return admin.firestore().doc(`places/${placeId}/modifiers/${modifierId}/`)
        .update({ categoryIds: FieldValue.arrayUnion(categoryId) })
    })

  // products
  const remProducts = before.products.filter(e => !after.products.includes(e))
    .map(productId => {
      return admin.firestore().doc(`places/${placeId}/products/${productId}/`)
        .update({ categoryIds: FieldValue.arrayRemove(categoryId) })
    })

  const addProducts = after.products.filter(e => !before.products.includes(e))
    .map(productId => {
      return admin.firestore().doc(`places/${placeId}/products/${productId}/`)
        .update({ categoryIds: FieldValue.arrayUnion(categoryId) })
    })

  Promise.all([remEvents, addEvents, remModifiers, addModifiers, remProducts, addProducts])
    .catch(error => console.error(error))

  return null
}

export const onDeleteCategory = async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { placeId, categoryId } = context.params
  const data = snapshot.data() as Category

  const remEvents = data.events.order?.map(eventId => {
    return admin.firestore().doc(`places/${placeId}/events/${eventId}/`)
      .update({ categoryIds: FieldValue.arrayRemove(categoryId) })
  })

  const remModifiers = data.modifiers.order?.map(modifierId => {
    return admin.firestore().doc(`places/${placeId}/modifiers/${modifierId}/`)
      .update({ categoryIds: FieldValue.arrayRemove(categoryId) })
  })

  const remProducts = data.products.map(productId => {
    return admin.firestore().doc(`places/${placeId}/products/${productId}`)
      .update({ categoryIds: FieldValue.arrayRemove(categoryId) })
  })

  const remCatalogs = data.catalogIds.map(catalogId => {
    return admin.firestore().doc(`places/${placeId}/catalogs/${catalogId}`)
      .update({ categories: FieldValue.arrayRemove(categoryId) })
  })

  Promise.all([remEvents, remModifiers, remProducts, remCatalogs])
    .catch(error => console.error(error))

  return null
}
