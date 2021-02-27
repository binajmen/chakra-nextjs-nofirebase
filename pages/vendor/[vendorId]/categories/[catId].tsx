import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'
import { resetServerContext } from 'react-beautiful-dnd'

import { Flex, Heading, Button, Spacer, useToast } from '@chakra-ui/react'
import { FaSave } from 'react-icons/fa'

import admin from '../../../../src/firebase/admin'
import { getCategory } from '../../../../src/firebase/helpers/vendors'

import VendorLayout from '../../../../src/layout/Vendor'

import Categories from '../../../../src/components/vendor/Categories'

import type { Categories as CategoriesType, Category } from '../../../../src/types/category'

function VendorCategories() {
    const { t } = useTranslation('common')
    const toast = useToast()
    const router = useRouter()

    const [category, setCategory] = React.useState<Category>({})

    const { query: { vendorId, catId } } = router

    React.useEffect(() => {
        getCategory(vendorId as string, catId as string)
            .then(doc => {
                if (doc.exists) {
                    setCategory(doc.data() as Category)
                } else {
                    toast({
                        description: t('vendor:not-found'),
                        status: "warning"
                    })
                    // TOFIX: redirect to categories
                    router.push('/vendor')
                }
            })
            .catch(error => {
                toast({
                    description: error,
                    status: "error"
                })
                router.push('/404')
            })
    }, [])

    // TODO: <Vendor> title props to add in <Head>
    return (
        <VendorLayout>

            <Flex mb={6}>
                <Heading>{t('vendor:category')}</Heading>
                <Spacer />
                <Button leftIcon={<FaSave />} color="gray.900" colorScheme="primary">{t('save')}</Button>
            </Flex>

            {category.name}
            {/* <Categories meta={meta} categories={categories} /> */}

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
