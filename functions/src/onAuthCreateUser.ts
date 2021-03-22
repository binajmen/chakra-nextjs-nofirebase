// eslint-disable-next-line no-unused-vars
import * as firebase from "firebase-admin"

export const onAuthCreateUser = async (
  event: firebase.auth.UserRecord,
) => {
  try {
    console.log(`Function triggered by change to user: ${event.uid}`);
    // console.log(`Created at: ${event.metadata.createdAt}`);

    if (event.email) {
      console.log(`Email: ${event.email}`);
    }
  } catch (err) {
    console.error(err);
  }
}
