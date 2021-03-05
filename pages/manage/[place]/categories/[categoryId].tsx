import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import { resetServerContext } from 'react-beautiful-dnd'
import useTranslation from 'next-translate/useTranslation'

import { Flex, Heading, Button, Spacer, useToast, useDisclosure } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import { useStoreState, useStoreActions } from '@/store/hooks'

import admin from '@/lib/firebase/admin'
// import { getCategories } from '@firebase/helpers/vendors'

import VendorLayout from '@/layout/Vendor'

import Categories from '@/components/vendor/Categories'
import Products from '@/components/vendor/Products'
import NewProduct from '@/forms/NewProduct'

import type { Categories as CategoriesType, Category } from '@/types/category'

function VendorCategoryProducts() {
    const { t } = useTranslation('common')
    const modal = useDisclosure()
    const router = useRouter()
    const vendorId = router.query.vendorId as string
    const categoryId = router.query.categoryId as string

    const getProductsInCategory = useStoreActions(actions => actions.products.getProductsInCategory)

    React.useEffect(() => {
        getProductsInCategory({ vendorId, categoryId })
    }, [vendorId, categoryId])

    // TODO: <Vendor> title props to add in <Head>
    return (
        <VendorLayout>

            <Flex mb={6}>
                <Heading>{t('categories')}</Heading>
                <Spacer />
                <Button leftIcon={<FaPlus />} color="gray.900" colorScheme="primary" onClick={modal.onOpen}>{t('manager:new-product')}</Button>
                <NewProduct modal={modal} />
            </Flex>

            <Products categoryId={categoryId} />

        </VendorLayout>
    )
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(VendorCategoryProducts)

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
