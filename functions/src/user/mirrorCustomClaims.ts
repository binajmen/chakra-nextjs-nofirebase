// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

type ClaimsDocumentData = admin.firestore.DocumentData & {
  _lastCommitted?: admin.firestore.Timestamp
}

export const mirrorCustomClaims = async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const beforeData: ClaimsDocumentData = change.before.data() || {}
  const afterData: ClaimsDocumentData = change.after.data() || {}

  // Skip updates where _lastCommitted field changed,
  // to avoid infinite loops
  const skipUpdate =
    beforeData._lastCommitted &&
    afterData._lastCommitted &&
    !beforeData._lastCommitted.isEqual(afterData._lastCommitted)
  if (skipUpdate) {
    console.log("No changes")
    return
  }

  // Create a new JSON payload and check that it"s under
  // the 1000 character max
  // eslint-disable-next-line no-unused-vars
  const { _lastCommitted, ...newClaims } = afterData
  const stringifiedClaims = JSON.stringify(newClaims)
  if (stringifiedClaims.length > 1000) {
    console.error("New custom claims object string > 1000 characters", stringifiedClaims)
    return
  }

  const userId = context.params.userId
  console.log(`Setting custom claims for ${userId} (length: ${stringifiedClaims.length})`, newClaims)
  await admin.auth().setCustomUserClaims(userId, newClaims)

  console.log("Updating document timestamp")
  await change.after.ref.update({
    _lastCommitted: admin.firestore.FieldValue.serverTimestamp(),
    ...newClaims
  })
}
