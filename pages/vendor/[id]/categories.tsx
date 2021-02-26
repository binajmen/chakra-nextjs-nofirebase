import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'
import { resetServerContext } from 'react-beautiful-dnd'

import { Flex, Box, Heading, Button, Spacer, useToast } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import admin from '../../../src/firebase/admin'
import { getCategories } from '../../../src/firebase/helpers/vendors'

import VendorLayout from '../../../src/layout/Vendor'

import Categories from '../../../src/components/vendor/Categories'

import type { Categories as CategoriesType, Category } from '../../../src/types/category'

function VendorCategories() {
    const { t } = useTranslation('common')
    const toast = useToast()
    const router = useRouter()

    const [meta, setMeta] = React.useState<string[]>([])
    const [categories, setCategories] = React.useState<CategoriesType>({})

    const { query: { id } } = router

    React.useEffect(() => {
        getCategories(id as string)
            .then(snapshot => {
                let meta: string[] = []
                let docs: CategoriesType = {}
                snapshot.forEach(doc => {
                    if (doc.id === '_meta_') meta = doc.data().items
                    else docs[doc.id] = doc.data()
                })
                setCategories(docs)
                setMeta(meta)
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

            <Flex>
                <Heading>{t('categories')}</Heading>
                <Spacer />
                <Button leftIcon={<FaPlus />} color="gray.900" colorScheme="primary">{t('vendor:new-category')}</Button>
            </Flex>

            <Categories meta={meta} categories={categories} />

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
        const { id } = query

        // retrieve roles for the current user
        const doc = await admin.firestore()
            .collection('roles')
            .doc(AuthUser.id!)
            .get()

        // if no roles or no roles for the requested vendor, 404
        if (!doc.exists || !doc.data()!.vendors?.includes(id)) return { notFound: true }

        // else
        return { props: {} }
    } catch (error) {
        console.error(error)
        return { notFound: true }
    }
})
