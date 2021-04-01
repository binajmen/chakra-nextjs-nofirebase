// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
// eslint-disable-next-line no-unused-vars
import * as admin from "firebase-admin"
admin.initializeApp()
admin.firestore().settings({ ignoreUndefinedProperties: true })

import getToken from "./getToken"

export const listMollieProfiles = async (
  data: any,
  // eslint-disable-next-line no-unused-vars
  _context: functions.https.CallableContext
) => {
  try {
    // TODO: replication of code => refactor in function
    const mollieRef = admin.firestore().doc(`places/${data.placeId}/settings/mollie`)
    const mollieDoc = await mollieRef.get()
    if (!mollieDoc.exists) {
      throw new Error("Unable to retrieve mollie profiles")
    }
    const mollieData = mollieDoc.data()

    const access_token = await getToken(mollieData, mollieRef)
    console.log(access_token)
    const axios = require("axios")
    const response = await axios({
      method: "get",
      url: "https://api.mollie.com/v2/profiles",
      headers: {
        "Authorization": `Bearer ${access_token}`
      },
    })

    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
    return error
  }
}
