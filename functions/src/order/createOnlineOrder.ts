// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
// eslint-disable-next-line no-unused-vars
import * as admin from "firebase-admin"
admin.initializeApp()
admin.firestore().settings({ ignoreUndefinedProperties: true })

import getToken from "../mollie/getToken"

export const createOnlineOrder = async (
  data: any,
  // eslint-disable-next-line no-unused-vars
  _context: functions.https.CallableContext
) => {
  try {
    // TOFIX? validate order totals

    // retrieve private data
    const mollieRef = admin.firestore().doc(`places/${data.placeId}/settings/mollie`)
    const mollieDoc = await mollieRef.get()
    if (!mollieDoc.exists)
      throw new Error("Unable to process payment: missing Mollie settings")
    const mollieData = mollieDoc.data()
    if (mollieData === undefined)
      throw new Error("Unable to process payment: Mollie settings undefined")

    // retrieve customer access token
    const access_token = await getToken(mollieData, mollieRef)

    // create order
    const orderDoc = await admin.firestore().collection("orders").add({
      ...data,
      orderStatus: "payment",
      log: { payment: admin.firestore.FieldValue.serverTimestamp() }
    })

    const totDecimals = data.total / 100

    // create mollie client instance with customer access token
    const { createMollieClient } = require("@mollie/api-client")
    const mollieClient = createMollieClient({ apiKey: access_token })

    // create payment
    let paymentIntent = {
      amount: {
        currency: "EUR",
        value: `${totDecimals.toFixed(2)}`,
      },
      description: `${data.placeId} #${orderDoc.id}`,
      redirectUrl: `${functions.config().portal.baseurl}/orders/${orderDoc.id}?emptyBasket=1`,
      webhookUrl: `${functions.config().mollie.webhook}`,
      metadata: {
        orderId: orderDoc.id,
      },
      profileId: mollieData.profileId,
      testmode: mollieData.testmode
    }

    const payment = await mollieClient.payments.create(paymentIntent)

    // update order doc with payment info
    await admin.firestore().collection("orders").doc(orderDoc.id).update({ payment: payment })

    return payment
  } catch (error) {
    console.warn("Something went wrong during the online order", error)
    return false
    // response.status(500).send("Create order failed")
  }
}
