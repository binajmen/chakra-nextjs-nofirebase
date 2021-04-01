// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
admin.initializeApp()

// eslint-disable-next-line no-unused-vars
import type { Order } from "../types"

export const orderScheduler = async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => {
  const before = change.before.data() as Order
  const after = change.after.data() as Order

  if (before?.orderStatus === "valid" && after?.orderStatus === "accepted") {
    console.log("!!!! valid order to schedule")
    console.log(context)
    console.log(context.params.orderId)
    admin.firestore().doc(`orders/${context.params.orderId}`).update({
      orderStatus: "ongoing",
      ["log.ongoing"]: admin.firestore.FieldValue.serverTimestamp()
    })
  }

  return null
}
