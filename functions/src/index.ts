import * as functions from "firebase-functions"
// eslint-disable-next-line no-unused-vars
import * as firebase from "firebase-admin"
// Firestore Triggers > Products

export const onCreateProduct =
  functions.region("europe-west1")
    .firestore.document("places/{placeId}/products/{productId}")
    .onCreate(async (snapshot, context) => {
      await (await import("./firestore/product")).onCreateProduct(snapshot, context)
    })

export const onDeleteProduct =
  functions.region("europe-west1")
    .firestore.document("places/{placeId}/products/{productId}")
    .onDelete(async (snapshot, context) => {
      await (await import("./firestore/product")).onDeleteProduct(snapshot, context)
    })

export const retrieveMollieAccessToken =
  functions.region("europe-west1")
    .https.onCall(async (data, context) => {
      return await (await import("./mollie/index")).retrieveMollieAccessToken(data, context)
    })

export const listMollieProfiles =
  functions.region("europe-west1")
    .https.onCall(async (data, context) => {
      return await (await import("./mollie/index")).listMollieProfiles(data, context)
    })

export const createOfflineOrder =
  functions.region("europe-west1")
    .https.onCall(async (data, context) => {
      return await (await import("./mollie/index")).createOfflineOrder(data, context)
    })

export const createOnlineOrder =
  functions.region("europe-west1")
    .https.onCall(async (data, context) => {
      return await (await import("./mollie/index")).createOnlineOrder(data, context)
    })

export const webhookMollie =
  functions
    .region("europe-west1")
    .https.onRequest(async (request, response) => {
      await (await import("./mollie/index")).webhookMollie(request, response)
    })

export const onAuthCreateUser =
  functions
    .region("europe-west1")
    .auth.user().onCreate(async (event: firebase.auth.UserRecord) => {
      await (await import("./onAuthCreateUser")).onAuthCreateUser(event)
    })
