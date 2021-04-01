// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

// eslint-disable-next-line no-unused-vars
import type { Catalog } from "../types"

const FieldValue = admin.firestore.FieldValue

export const onCreateCatalog = async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { placeId, catalogId } = context.params
  const data = snapshot.data() as Catalog

  const categories = data.categories.map(categoryId => {
    return admin.firestore().doc(`places/${placeId}/categories/${categoryId}`)
      .update({ catalogIds: FieldValue.arrayUnion(catalogId) })
  })

  Promise.all([categories])
    .catch(error => console.error(error))

  return null
}

export const onUpdateCatalog = async (
  change: functions.Change<functions.firestore.QueryDocumentSnapshot>,
  context: functions.EventContext
) => {
  const { placeId, catalogId } = context.params
  const before = change.before.data() as Catalog
  const after = change.after.data() as Catalog

  const remCategories = before.categories
    .filter(e => !after.categories.includes(e))
    .map(categoryId => {
      return admin.firestore().doc(`places/${placeId}/categories/${categoryId}/`)
        .update({ catalogIds: FieldValue.arrayRemove(catalogId) })
    })

  const addCategories = after.categories
    .filter(e => !before.categories.includes(e))
    .map(categoryId => {
      return admin.firestore().doc(`places/${placeId}/categories/${categoryId}/`)
        .update({ catalogIds: FieldValue.arrayUnion(catalogId) })
    })

  Promise.all([remCategories, addCategories])
    .catch(error => console.error(error))

  return null
}

export const onDeleteCatalog = async (
  snapshot: functions.firestore.DocumentSnapshot,
  context: functions.EventContext
) => {
  const { placeId, catalogId } = context.params
  const data = snapshot.data() as Catalog

  const categories = data.categories.map(categoryId => {
    return admin.firestore().doc(`places/${placeId}/categories/${categoryId}`)
      .update({ catalogIds: FieldValue.arrayRemove(catalogId) })
  })

  Promise.all([categories])
    .catch(error => console.error(error))

  return null
}
