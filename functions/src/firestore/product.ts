// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

// eslint-disable-next-line no-unused-vars
import type { Product } from "../types"

const FieldValue = admin.firestore.FieldValue

export const onCreateProduct = async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { placeId, productId } = context.params
  const data = snapshot.data() as Product

  if (data.type !== "product") return null

  const events = data.events.order?.map(eventId => {
    return admin.firestore().doc(`places/${placeId}/events/${eventId}`)
      .update({ productIds: FieldValue.arrayUnion(productId) })
  })

  const modifiers = data.modifiers.order?.map(modifierId => {
    return admin.firestore().doc(`places/${placeId}/modifiers/${modifierId}`)
      .update({ productIds: FieldValue.arrayUnion(productId) })
  })

  Promise.all([events, modifiers])
    .catch(error => console.error(error))

  return null
}

export const onUpdateProduct = async (
  change: functions.Change<functions.firestore.QueryDocumentSnapshot>,
  context: functions.EventContext
) => {
  const { placeId, productId } = context.params
  const before = change.before.data() as Product
  const after = change.after.data() as Product

  // not a product or avoid update looping when 
  if (before.type !== "product" ||
    before.categoryIds.length !== after.categoryIds.length ||
    before.modifierIds.length !== after.modifierIds.length) {
    return null
  }

  // events
  const remEvents = before.events.order?.filter(e => !after.events.order.includes(e))
    .map(eventId => {
      return admin.firestore().doc(`places/${placeId}/events/${eventId}/`)
        .update({ productIds: FieldValue.arrayRemove(productId) })
    })

  const addEvents = after.events.order?.filter(e => !before.events.order.includes(e))
    .map(eventId => {
      return admin.firestore().doc(`places/${placeId}/events/${eventId}/`)
        .update({ productIds: FieldValue.arrayUnion(productId) })
    })

  // modifiers
  const remModifiers = before.modifiers.order?.filter(e => !after.modifiers.order.includes(e))
    .map(modifierId => {
      return admin.firestore().doc(`places/${placeId}/modifiers/${modifierId}/`)
        .update({ productIds: FieldValue.arrayRemove(productId) })
    })

  const addModifiers = after.modifiers.order?.filter(e => !before.modifiers.order.includes(e))
    .map(modifierId => {
      return admin.firestore().doc(`places/${placeId}/modifiers/${modifierId}/`)
        .update({ productIds: FieldValue.arrayUnion(productId) })
    })

  const updModifiers = after.modifierIds.map(modifier => {
    return admin.firestore().doc(`places/${placeId}/modifiers/${modifier}`)
      .update({ [`products.product.${productId}`]: after })
  })

  Promise.all([remEvents, addEvents, remModifiers, addModifiers, updModifiers])
    .catch(error => console.error(error))

  return null
}

export const onDeleteProduct = async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { placeId, productId } = context.params
  const data = snapshot.data() as Product

  if (data.type !== "product") return null

  // events
  const updEvents = data.events.order?.map(eventId => {
    return admin.firestore().doc(`places/${placeId}/events/${eventId}/`)
      .update({ productIds: FieldValue.arrayRemove(productId) })
  })

  // modifiers
  const updModifiers = data.modifiers.order?.map(modifierId => {
    return admin.firestore().doc(`places/${placeId}/modifiers/${modifierId}`)
      .update({ productIds: FieldValue.arrayRemove(productId) })
  })

  const remModifiers = data.modifierIds.map(modifierId => {
    return admin.firestore().doc(`places/${placeId}/modifiers/${modifierId}`)
      .update({
        ["products.order"]: FieldValue.arrayRemove(productId),
        [`products.product.${productId}`]: FieldValue.delete(),
        [`products.price.${productId}`]: FieldValue.delete(),
      })
  })

  // categories
  const remCategory = data.categoryIds.map(categoryId => {
    return admin.firestore().doc(`places/${placeId}/categories/${categoryId}`)
      .update({ products: FieldValue.arrayUnion(productId) })
  })

  Promise.all([updEvents, updModifiers, remModifiers, remCategory])
    .catch(error => console.error(error))

  return null
}
