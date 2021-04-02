// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
// eslint-disable-next-line no-unused-vars
import * as admin from "firebase-admin"
admin.initializeApp()
admin.firestore().settings({ ignoreUndefinedProperties: true })

import getToken from "./getToken"

export const webhookMollie = async (
  request: functions.https.Request,
  response: functions.Response<any>
) => {
  try {
    const paymentId = request.body.id

    // retrieve business id via order
    const snap = await admin.firestore().collection("orders").where("payment.id", "==", paymentId).get()
    if (snap.empty) {
      console.error("No order found with payment id", paymentId)
      response.status(404).send("No order found for specific payment id")
    }
    // we should only have one order for a specific payment id
    const doc = snap.docs[0]
    const order = doc.data()

    const mollieRef = admin.firestore().doc(`places/${order.placeId}/settings/mollie`)
    const mollieDoc = await mollieRef.get()
    if (!mollieDoc.exists) {
      console.error("Unable to process payment: private data missing for ", mollieRef)
      response.status(404).send("Unable to process payment: private data missing")
    }
    const mollieData = mollieDoc.data()
    if (mollieData === undefined)
      throw new Error("Unable to process payment: Mollie settings undefined")

    // retrieve customer access token
    const access_token = await getToken(mollieData, mollieRef)

    // create mollie client instance with customer access token
    const { createMollieClient } = require("@mollie/api-client");
    const mollieClient = createMollieClient({ apiKey: access_token })

    // retrieve payment info
    const testmode = "testmode" in mollieData ? mollieData.testmode : false
    const payment = await mollieClient.payments.get(paymentId, { testmode: testmode });

    // update payment info
    await admin.firestore().collection("orders").doc(payment.metadata.orderId).update({
      payment: { ...payment },
      valid: payment.status === "paid" ? true : false,
      ...(payment.status === "paid" && {
        orderStatus: "valid",
        ["log.valid"]: admin.firestore.FieldValue.serverTimestamp()
      })
    })

    response.status(200).send()
  } catch (error) {
    console.warn(error)
    response.status(500).send()
  }
}
