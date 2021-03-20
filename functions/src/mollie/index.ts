// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()
admin.firestore().settings({ ignoreUndefinedProperties: true })

export const retrieveMollieAccessToken = async (
  data: any,
  // eslint-disable-next-line no-unused-vars
  _context: functions.https.CallableContext
) => {
  try {
    const snap = await admin.firestore().collectionGroup("settings").where("csrf", "==", data.state).get()

    // no matching csrf?
    if (snap.empty) {
      console.warn("No matching CSRF token", data.state)
      return "No matching CSRF token"
    } else {
      // create mollie private doc ref
      const place = snap.docs[0]
      const placeRef = admin.firestore().doc(`place/${place.id}/settings/mollie`)

      // use auth token to retrieve access/refresh token
      // const axios = require("axios")
      const axios = await (await import("axios")).default
      const response = await axios({
        method: "post",
        url: "https://api.mollie.com/oauth2/tokens",
        data: {
          grant_type: "authorization_code",
          code: data.code,
          redirect_uri: `${functions.config().portal.baseurl}/setupMollie`
        },
        withCredentials: true,
        auth: {
          username: `${functions.config().mollie.appid}`,
          password: `${functions.config().mollie.secret}`
        },
      })

      // save response in mollie private
      await placeRef.set({
        ...response.data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true })

      return {
        success: true,
        slug: place.data().slug
      }
    }
  } catch (error) {
    console.error(error)
    return {
      error: true
    }
  }
}

async function getToken(mollieDoc: any, mollieRef: any) {
  const dayjs = require("dayjs")
  const duration = require("dayjs/plugin/duration")
  dayjs.extend(duration)

  var now = new dayjs()
  var updatedAt = new dayjs(mollieDoc.updatedAt.seconds * 1000)
  var _duration = dayjs.duration(now.diff(updatedAt)).as("seconds")

  // current access token is still valid
  if (_duration < mollieDoc.expires_in) {
    return mollieDoc.access_token
  }

  // refresh token
  const axios = require("axios")
  const response = await axios({
    method: "post",
    url: "https://api.mollie.com/oauth2/tokens",
    data: {
      grant_type: "refresh_token",
      refresh_token: mollieDoc.refresh_token,
      redirect_uri: `${functions.config().portal.baseurl}/setupMollie`
    },
    withCredentials: true,
    auth: {
      username: `${functions.config().mollie.appid}`,
      password: `${functions.config().mollie.secret}`
    },
  })

  // save response data in mollie private
  await mollieRef.set({
    ...response.data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true })

  return response.data.access_token
}

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
      status: "accepted",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    return orderDoc.id
  } catch (error) {
    console.warn("Something went wrong during the offline order", error)
    return false
    // response.status(500).send("Create order failed")
  }
}

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
      status: "onhold",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
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

    const payment = await mollieClient.payments.create(paymentIntent);

    // update order doc with payment info
    await admin.firestore().collection("orders").doc(orderDoc.id).update({ payment: { ...payment } })

    return payment
  } catch (error) {
    console.warn("Something went wrong during the online order", error)
    return false
    // response.status(500).send("Create order failed")
  }
}

// exports.listMollieProfiles = functions
//   .region("europe-west1")
//   .https.onCall(async (data, context) => {
//     try {
//       // TODO: replication of code => refactor in function
//       const privateRef = admin.firestore().collection(`businesses/${data.id}/private`).doc("mollie")
//       const privateData = await privateRef.get()
//       if (!privateData.exists) {
//         console.error("Unable to process payment: private data missing for ", privateRef)
//         response.status(404).send("Unable to process payment: private data missing")
//       }
//       const customer = privateData.data()

//       const access_token = await getToken(customer, privateRef)

//       const axios = require("axios")
//       const response = await axios({
//         method: "get",
//         url: "https://api.mollie.com/v2/profiles",
//         headers: {
//           "Authorization": `Bearer ${access_token}`
//         },
//       })

//       return response.data
//     } catch (error) {
//       console.warn("OOps!", error)
//       return error
//     }
//   })

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
    const testmode = mollieData ?? false
    const payment = await mollieClient.payments.get(paymentId, { testmode: testmode });

    // update payment info
    await admin.firestore().collection("orders").doc(payment.metadata.orderId).update({
      payment: { ...payment },
      status: payment.status === "paid" ? "accepted" : "onhold"
    })

    response.status(200).send()
  } catch (error) {
    console.warn(error);
    response.status(500).send()
  }
}
