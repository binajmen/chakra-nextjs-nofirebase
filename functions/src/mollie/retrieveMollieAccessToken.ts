// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
// eslint-disable-next-line no-unused-vars
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
      const placeRef = admin.firestore().doc(`places/${place.data().id}/settings/mollie`)

      // use auth token to retrieve access/refresh token
      // const axios = require("axios")
      const axios = await (await import("axios")).default
      const response = await axios({
        method: "post",
        url: "https://api.mollie.com/oauth2/tokens",
        data: {
          grant_type: "authorization_code",
          code: data.code,
          redirect_uri: `${functions.config().mollie.redirecturl}`
        },
        withCredentials: true,
        auth: {
          username: `${functions.config().mollie.appid}`,
          password: `${functions.config().mollie.secret}`
        },
      })

      console.log(response.data)

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
