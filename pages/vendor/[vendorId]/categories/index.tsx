import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import useTranslation from 'next-translate/useTranslation'

import { Flex, Heading, Button, Spacer, useToast, useDisclosure } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '../../../../src/store/hooks'

import admin from '../../../../src/firebase/admin'
// import { getCategories } from '../../../../src/firebase/helpers/vendors'

import VendorLayout from '../../../../src/layout/Vendor'

import Categories from '../../../../src/components/vendor/Categories'
import NewCategory from '../../../../src/forms/NewCategory'

import type { Categories as CategoriesType, Category } from '../../../../src/types/category'

function VendorCategories() {
    const { t } = useTranslation('common')
    const toast = useToast()
    const router = useRouter()
    const modal = useDisclosure()

    const getCategories = useStoreActions(actions => actions.categories.getCategories)

    const vendorId = router.query.vendorId as string

    React.useEffect(() => {
        getCategories(vendorId)
    }, [])

    // TODO: <Vendor> title props to add in <Head>
    return (
        <VendorLayout>

            <Flex mb={6}>
                <Heading>{t('categories')}</Heading>
                <Spacer />
                <Button leftIcon={<FaPlus />} color="gray.900" colorScheme="primary" onClick={modal.onOpen}>{t('vendor:new-category')}</Button>
                <NewCategory modal={modal} />
            </Flex>

            <Categories />

        </VendorLayout>
    )
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(VendorCategories)

export const getServerSideProps = withAuthUserSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ query, AuthUser }) => {
    resetServerContext()
    try {
        // retrieve vendor id
        const { vendorId } = query

        // retrieve roles for the current user
        const doc = await admin.firestore()
            .collection('roles')
            .doc(AuthUser.id!)
            .get()

        // if no roles or no roles for the requested vendor, 404
        if (!doc.exists || !doc.data()!.vendors?.includes(vendorId)) return { notFound: true }

        // else
        return { props: {} }
    } catch (error) {
        console.error(error)
        return { notFound: true }
    }
})
