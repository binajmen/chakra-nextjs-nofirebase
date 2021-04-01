// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

// eslint-disable-next-line no-unused-vars
import type { Modifier } from "../types"

const FieldValue = admin.firestore.FieldValue

export const onCreateModifier = async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { placeId, modifierId } = context.params
  const data = snapshot.data() as Modifier

  // update linked products as options
  const products = data.products.order?.map(productId => {
    return admin.firestore().doc(`places/${placeId}/products/${productId}`)
      .update({ modifierIds: FieldValue.arrayUnion(modifierId) })
  })

  Promise.all([products])
    .catch(error => console.error(error))

  return null
}

export const onUpdateModifier = async (
  change: functions.Change<functions.firestore.QueryDocumentSnapshot>,
  context: functions.EventContext
) => {
  const { placeId, modifierId } = context.params
  const before = change.before.data() as Modifier
  const after = change.after.data() as Modifier

  // avoid update looping when 
  if (before.categoryIds.length !== after.categoryIds.length ||
    before.productIds.length !== after.productIds.length) {
    return null
  }

  // update linked categories
  const categories = after.categoryIds.map(categoryId => {
    return admin.firestore().doc(`places/${placeId}/categories/${categoryId}`)
      .update({ [`modifiers.modifier.${modifierId}`]: after })
  })

  // update linked products
  const products = after.productIds.map(productId => {
    return admin.firestore().doc(`places/${placeId}/products/${productId}`)
      .update({ [`modifiers.modifier.${modifierId}`]: after })
  })

  // update linked products added/removed as options
  const remOptions = before.products.order?.filter(e => !after.products.order.includes(e))
    .map(productId => {
      return admin.firestore().doc(`places/${placeId}/products/${productId}/`)
        .update({ modifierIds: FieldValue.arrayRemove(modifierId) })
    })

  const addOptions = after.products.order?.filter(e => !before.products.order.includes(e))
    .map(productId => {
      return admin.firestore().doc(`places/${placeId}/products/${productId}/`)
        .update({ modifierIds: FieldValue.arrayUnion(modifierId) })
    })

  Promise.all([categories, products, remOptions, addOptions])
    .catch(error => console.error(error))

  return null
}

export const onDeleteModifier = async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { placeId, modifierId } = context.params
  const data = snapshot.data() as Modifier

  // remove from linked categories
  const categories = data.categoryIds.map(categoryId => {
    return admin.firestore().doc(`places/${placeId}/categories/${categoryId}`)
      .update({
        ["modifiers.order"]: FieldValue.arrayRemove(modifierId),
        [`modifiers.modifier.${modifierId}`]: FieldValue.delete()
      })
  })

  // remove from linked products
  const products = data.productIds.map(productId => {
    return admin.firestore().doc(`places/${placeId}/products/${productId}`)
      .update({
        ["modifiers.order"]: FieldValue.arrayRemove(modifierId),
        [`modifiers.modifier.${modifierId}`]: FieldValue.delete()
      })
  })

  // remove linked products as options
  const options = data.products.order?.map(productId => {
    return admin.firestore().doc(`places/${placeId}/products/${productId}/`)
      .update({ modifierIds: FieldValue.arrayRemove(modifierId) })
  })

  Promise.all([categories, products, options])
    .catch(error => console.error(error))

  return null
}
