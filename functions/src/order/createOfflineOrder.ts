// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
// eslint-disable-next-line no-unused-vars
import * as admin from "firebase-admin"
admin.initializeApp()
admin.firestore().settings({ ignoreUndefinedProperties: true })

export const createOfflineOrder = async (
  data: any,
  // eslint-disable-next-line no-unused-vars
  _context: functions.https.CallableContext
) => {
  try {
    // TOFIX? validate order totals

    // create order
    const orderDoc = await admin.firestore().collection("orders").add({
      ...data,
      orderStatus: "valid",
      log: { valid: admin.firestore.FieldValue.serverTimestamp() }
    })

    return orderDoc.id
  } catch (error) {
    console.warn("Something went wrong during the offline order", error)
    return false
    // response.status(500).send("Create order failed")
  }
}
