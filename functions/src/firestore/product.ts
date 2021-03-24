// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

export const onCreateProduct = async (
  // eslint-disable-next-line no-unused-vars
  snapshot: functions.firestore.DocumentSnapshot,
  // eslint-disable-next-line no-unused-vars
  context: functions.EventContext
) => {
  // const { placeId, productId } = context.params
  // const data = snapshot.data()!

  // if (data.type !== "product") return null

  // // - add ref to associated events
  // // const events = Object.keys(data.events).map(event => {
  // //     return global.db.doc(`businesses/${merchant}/events/${event}`)
  // //         .update({ productIds: FieldValue.arrayUnion(product) })
  // // })

  // // - add ref to associated modifiers
  // // const modifiers = Object.keys(data.modifiers).map(modifier => {
  // //     return global.db.doc(`businesses/${merchant}/modifiers/${modifier}`)
  // //         .update({ productIds: FieldValue.arrayUnion(product) })
  // // })

  // // - add ref to associated category
  // const categories = data.categoryIds.map((categoryId: string) => {
  //     console.log("adding", productId, "to", categoryId)
  //     return admin.firestore().doc(`places/${placeId}/categories/${categoryId}`)
  //         .update({ items: admin.firestore.FieldValue.arrayUnion(productId) })
  // })

  // // if (Object.keys(data.siblings).length !== 0) {
  // //     var siblings = Object.keys(data.siblings).map(sibling => {
  // //         return global.db.doc(`businesses/${merchant}/products/${sibling}`)
  // //             .update({ [`siblings.${product}`]: data.price })
  // //     })
  // // }

  // // Promise.all([events, modifiers, categories, siblings])
  // Promise.all([categories])
  //     .catch(error => console.error(error))

  return null
}

export const onDeleteProduct = async (
  // eslint-disable-next-line no-unused-vars
  snapshot: functions.firestore.DocumentSnapshot,
  // eslint-disable-next-line no-unused-vars
  context: functions.EventContext
) => {
  // const { placeId, productId } = context.params
  // const data = snapshot.data()!

  // if (data.type !== "product") return null

  // // - remove ref from events
  // // const updateEvents = Object.keys(data.events).map(event => {
  // //     return global.db.doc(`businesses/${merchant}/events/${event}/`)
  // //         .update({ productIds: FieldValue.arrayRemove(product) })
  // // })

  // // - remove ref from modifiers
  // // const updateModifiers = Object.keys(data.modifiers).map(modifier => {
  // //     return global.db.doc(`businesses/${merchant}/modifiers/${modifier}`)
  // //         .update({ productIds: FieldValue.arrayRemove(product) })
  // // })

  // // const removeFromModifiers = data.modifierIds.map(modifier => {
  // //     return global.global.db.doc(`businesses/${merchant}/modifiers/${modifier}`)
  // //         .update({
  // //             ["products.o"]: FieldValue.arrayRemove(product),
  // //             [`products.p.${product}`]: FieldValue.delete(),
  // //             [`products.r.${product}`]: FieldValue.delete(),
  // //         })
  // // })

  // // const removeFromCombos = data.comboIds.map(combo => {
  // //     return global.global.db.doc(`businesses/${merchant}/products/${combo}`)
  // //         .update({
  // //             ["products.o"]: FieldValue.arrayRemove(product),
  // //             [`products.p.${product}`]: FieldValue.delete(),
  // //         })
  // // })

  // // const removeFromChoices = data.choiceIds.map(choice => {
  // //     return global.global.db.doc(`businesses/${merchant}/products/${choice}`)
  // //         .update({
  // //             ["products.o"]: FieldValue.arrayRemove(product),
  // //             [`products.c.${product}`]: FieldValue.delete(),
  // //         })
  // // })

  // // - remove ref from categories
  // const removeFromCategory = data.categoryIds.map((categoryId: string) => {
  //     return admin.firestore().doc(`places/${placeId}/categories/${categoryId}`)
  //         .update({ items: admin.firestore.FieldValue.arrayRemove(productId) })
  // })

  // // if (Object.keys(data.siblings).length !== 0) {
  // //     var removeFromSiblings = Object.keys(data.siblings).map(sibling => {
  // //         return global.db.doc(`businesses/${merchant}/products/${sibling}`)
  // //             .update({ [`siblings.${product}`]: FieldValue.delete() })
  // //     })
  // // }

  // // Promise.all([
  // //     updateEvents, updateModifiers,
  // //     removeFromModifiers, removeFromCombos, removeFromChoices,
  // //     removeFromCategory, removeFromSiblings,
  // // ]).catch(error => console.error(error))

  // Promise.all([removeFromCategory])
  //     .catch(error => console.error(error))

  return null
}
