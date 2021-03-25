import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

import type { Event } from "./types"

const FieldValue = admin.firestore.FieldValue

export const onUpdateEvent = async (
  change: functions.Change<functions.firestore.QueryDocumentSnapshot>,
  context: functions.EventContext
) => {
  const { placeId, eventId } = context.params
  const before = change.before.data() as Event
  const after = change.after.data() as Event

  // avoid update looping when 
  if (before.categoryIds.length !== after.categoryIds.length ||
    before.productIds.length !== after.productIds.length) {
    return null
  }

  // categories
  const categories = after.categoryIds.map(categoryId => {
    return admin.firestore().doc(`places/${placeId}/categories/${categoryId}`)
      .update({ [`events.event.${eventId}`]: after })
  })

  // products
  const products = after.productIds.map(productId => {
    return admin.firestore().doc(`places/${placeId}/products/${productId}`)
      .update({ [`events.event.${eventId}`]: after })
  })

  Promise.all([categories, products])
    .catch(error => console.error(error))

  return null
}

export const onDeleteEvent = async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { placeId, eventId } = context.params
  const data = snapshot.data() as Event

  // remove from linked categories
  const categories = data.categoryIds.map(categoryId => {
    return admin.firestore().doc(`places/${placeId}/categories/${categoryId}`)
      .update({
        ['events.order']: FieldValue.arrayRemove(eventId),
        [`events.event.${eventId}`]: FieldValue.delete()
      })
  })

  // remove from linked products
  const products = data.productIds.map(productId => {
    return admin.firestore().doc(`places/${placeId}/products/${productId}`)
      .update({
        ['events.order']: FieldValue.arrayRemove(eventId),
        [`events.event.${eventId}`]: FieldValue.delete()
      })
  })

  Promise.all([categories, products])
    .catch(error => console.error(error))

  return null
}
