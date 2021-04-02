// eslint-disable-next-line no-unused-vars
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as protos from "@google-cloud/tasks/build/protos/protos"
import { CloudTasksClient } from "@google-cloud/tasks"
admin.initializeApp()

const dayjs = require("dayjs")

// eslint-disable-next-line no-unused-vars
import type { Order } from "../types"

interface ExpirationTaskPayload {
  docPath: string
}

export const orderScheduler = async (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  // eslint-disable-next-line no-unused-vars
  context: functions.EventContext
) => {
  const before = change.before.data() as Order
  const after = change.after.data() as Order

  if (before?.orderStatus === "valid" && after?.orderStatus === "accepted") {
    // in development, skip cloud task scheduling
    if (functions.config().development === true) {
      updateOrder(change.after.ref.path, "ongoing")
      return null
    }

    // TOFIX : take into account RUSH parameter from place
    // X--- NOW --(schedule time (s))-- START --(preparation time (m))-- EXPECTED --->
    const expectedTime = dayjs.unix(after.timing.expectedAt.seconds)
    const preparationTime = after.method === "delivery" ? 30 : 15
    const startTime = expectedTime.subtract(preparationTime, "minute")
    const scheduleTime = startTime.diff(dayjs(), "second")

    console.log("prepTime:", preparationTime, "expectedTime:", expectedTime, "startTime:", startTime, "scheduleTime:", scheduleTime)

    // negative schedule time means it must start now
    // skip cloud task scheduling in development
    if (scheduleTime < 0 || functions.config().portal.development === true) {
      updateOrder(change.after.ref.path, "ongoing")
      return null
    } else {
      const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId
      const location = "europe-west1"
      const queue = "order-scheduler"

      const tasksClient = new CloudTasksClient()
      const queuePath = tasksClient.queuePath(project, location, queue)

      const url = `https://${location}-${project}.cloudfunctions.net/orderAlarm`
      const docPath = change.after.ref.path
      const payload: ExpirationTaskPayload = { docPath }

      const task = {
        httpRequest: {
          httpMethod: protos.google.cloud.tasks.v2.HttpMethod.POST,
          url,
          body: Buffer.from(JSON.stringify(payload)).toString("base64"),
          headers: {
            "Content-Type": "application/json",
          },
        },
        scheduleTime: {
          seconds: scheduleTime
        }
      }

      console.log("scheduling", docPath)
      await tasksClient.createTask({ parent: queuePath, task })
    }
  }

  return null
}

export const orderAlarm = async (
  request: functions.https.Request,
  response: functions.Response<any>
) => {
  const payload = request.body as ExpirationTaskPayload
  try {
    await updateOrder(payload.docPath, "valid")
    response.send(200)
  }
  catch (error) {
    console.error(error)
    response.status(500).send(error)
  }
}

function updateOrder(docPath: string, status: string) {
  return admin.firestore().doc(docPath).update({
    orderStatus: status,
    [`log.${status}`]: admin.firestore.FieldValue.serverTimestamp()
  })
}
