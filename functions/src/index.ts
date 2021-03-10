import * as functions from "firebase-functions";

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
