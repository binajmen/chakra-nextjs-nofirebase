import * as React from 'react'
import { useRouter } from 'next/router'
import { AuthAction, withAuthUser, withAuthUserSSR } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'
import { resetServerContext } from 'react-beautiful-dnd'

import { Flex, Heading, Button, Spacer, useToast, useDisclosure } from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'

import admin from '../../../src/firebase/admin'
import { getProducts } from '../../../src/firebase/helpers/products'

import VendorLayout from '../../../src/layout/Vendor'

import Products from '../../../src/components/vendor/Products'
import NewProduct from '../../../src/forms/NewProduct'

import type { Products as ProductsType, Product } from '../../../src/types/product'

function VendorProducts() {
    const { t } = useTranslation('common')
    const toast = useToast()
    const router = useRouter()
    const modal = useDisclosure()

    const [order, setOrder] = React.useState<string[]>([])
    const [products, setProducts] = React.useState<ProductsType>({})

    const { query: { vendorId } } = router

    React.useEffect(() => {
        getProducts(vendorId as string)
            .then(snapshot => {
                let order: string[] = []
                let docs: ProductsType = {}
                snapshot.forEach(doc => {
                    if (doc.id === '_meta_') order = doc.data().order
                    else docs[doc.id] = { ...doc.data(), id: doc.id }
                })
                setProducts(docs)
                setOrder(order)
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
                <Heading>{t('products')}</Heading>
                <Spacer />
                <Button leftIcon={<FaPlus />} color="gray.900" colorScheme="primary" onClick={modal.onOpen}>{t('vendor:new-product')}</Button>
                <NewProduct modal={modal} order={order} setOrder={setOrder} setProducts={setProducts} />
            </Flex>

            <Products
                order={order}
                setOrder={setOrder}
                products={products}
                setProducts={setProducts}
            />

        </VendorLayout>
    )
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
})(VendorProducts)

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
