import {
    AuthAction,
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR
} from 'next-firebase-auth'

function UserIndex() {
    const authUser = useAuthUser()

    return (
        <div>
            Welcome {authUser.email}!
        </div>
    )
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(UserIndex)

export function getServerSideProps() { return { props: {} } }