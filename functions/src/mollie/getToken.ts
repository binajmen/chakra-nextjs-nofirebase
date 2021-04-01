// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
// eslint-disable-next-line no-unused-vars
import * as admin from "firebase-admin"
// admin.initializeApp()
// admin.firestore().settings({ ignoreUndefinedProperties: true })

const dayjs = require("dayjs")
const duration = require("dayjs/plugin/duration")
dayjs.extend(duration)

export default async function getToken(mollieDoc: any, mollieRef: any) {
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
      redirect_uri: `${functions.config().mollie.redirecturl}`
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
