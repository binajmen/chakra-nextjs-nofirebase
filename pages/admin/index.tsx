import {
    AuthAction,
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR
} from 'next-firebase-auth'

import admin from '../../src/firebase/admin'

export type AdminIndexProps = {
    admin: boolean
}

function AdminIndex({ admin }: AdminIndexProps) {
    const authUser = useAuthUser()

    if (!admin) return null

    return (
        <div>
            Welcome {authUser.email}!
        </div>
    )
}

export default withAuthUser<AdminIndexProps>({
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(AdminIndex)

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
    const token = await AuthUser.getIdToken()
    const decodedToken = await admin.auth().verifyIdToken(token ?? '')

    if (decodedToken.admin) {
        return { props: { } }
    } else {
        return { redirect: { destination: '/', permanent: false } }
    }
})
