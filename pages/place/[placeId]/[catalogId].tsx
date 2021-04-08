import * as React from 'react'
import { useRouter } from 'next/router'
import { withAuthUser } from 'next-firebase-auth'
import useTranslation from 'next-translate/useTranslation'
import { useDocument, useCollection } from '@nandorojo/swr-firestore'

import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext
} from 'next'

import {
  Flex,
  Box,
  Heading,
  Text,
  Stack,
  Center,
  IconButton,
  SimpleGrid,
  Portal,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useBreakpointValue
} from '@chakra-ui/react'
import { FaCartPlus, FaPlus, FaMinus, FaShoppingBasket } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'
import Layout from '@/components/layout/Layout'
import PlaceHeader from "@/components/layout/PlaceHeader"
import ProductDrawer from '@/components/ProductDrawer'
import BasketBar from '@/components/molecules/BasketBar'
import BasketDrawer from '@/components/organisms/BasketDrawer'

import { useStoreState, useStoreActions } from '@/store/hooks'
import { useStoreRehydrated } from 'easy-peasy'

import type { Place } from '@/types/place'
import type { WithID, Catalog, Category, Categories, Product, Products } from '@/types/catalog'

function PlaceCatalog(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation('common')
  const drawer = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const basketDrawer = useDisclosure()
  const router = useRouter()
  const { placeId, catalogId } = router.query

  const basketSize = useStoreState(state => state.basket.size)
  const total = useStoreState(state => state.basket.total)
  const method = useStoreState(state => state.order.method)
  const setMethod = useStoreActions(actions => actions.order.setMethod)
  const isRehydrated = useStoreRehydrated()
  const [product, setProduct] = React.useState<Product | null>(null)

  const { data: place } = useDocument<Place>(`places/${placeId}`, { initialData: props.place })
  const { data: catalog } = useDocument<Catalog>(`places/${placeId}/catalogs/${catalogId}`, { initialData: props.catalog })
  const { data: _categories } = useCollection<Category>(
    `places/${placeId}/categories`, {
    where: ["catalogIds", "array-contains", catalogId]
  }, { initialData: props.categories })
  const { data: _products } = useCollection<Product>(`places/${placeId}/products`, {}, { initialData: props.products })

  const hasCategories = catalog && catalog.categories.length > 0 && _categories && _categories.length > 0
  const categories: Categories = _categories!.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})

  const hasProducts = _products && _products.length > 0
  const products: Products = _products!.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {})

  React.useEffect(() => {
    if (product)
      drawer.onToggle()
  }, [product])

  React.useEffect(() => {
    if (!drawer.isOpen)
      setProduct(null)
  }, [drawer.isOpen])

  React.useEffect(() => {
    if (isRehydrated) {
      setMethod(catalogId as string)
    }
  }, [isRehydrated, catalogId])

  React.useEffect(() => {
    if (method !== catalogId) {
      router.push({
        pathname: "/place/[placeId]/[catalogId]",
        query: { placeId, catalogId: method }
      })
    }
  }, [method])

  return (
    <Layout
      subHeader="datetime"
      metadata={{ title: place!.name }}
      padding={false}
    >
      <PlaceHeader place={place!} />
      {/* <Categories categories={categories} /> */}
      <Box p="3">
        {hasCategories && catalog!.categories.filter(c => categories[c]?.available)
          .map(catId => (
            <Box mb="6" key={catId}>
              <Heading size="lg" mb="6">{categories[catId].name}</Heading>
              <SimpleGrid columns={[1, 1, 2, 3]} spacing={[3, 3, 9, 9]}>
                {hasProducts && categories[catId].products.filter(p => products[p]?.available)
                  .map((prodId, index, array) => (
                    <React.Fragment key={prodId}>
                      <Flex
                        justify="space-between"
                        p={[0, 0, 3]}
                        borderWidth={[0, 0, '1px']}
                        rounded="md"
                        onClick={() => setProduct(products[prodId])}
                      >
                        <Stack direction="column" spacing="0">
                          <Text as="strong">{products[prodId].name}</Text>
                          {products[prodId].description && <Text>{products[prodId].description}</Text>}
                        </Stack>

                        <Stack direction="row" alignItems="center">
                          <Text>{products[prodId].price === 0 ? t("free") : `${products[prodId].price / 100}€`}</Text>
                          <IconButton
                            color="gray.900"
                            colorScheme="primary"
                            aria-label="Add to cart"
                            size="sm"
                            // onClick={() => setProduct(products[prodId])}
                            icon={<FaPlus />}
                          />
                        </Stack>
                      </Flex>
                      {(isMobile && index < array.length - 1) && <hr />}
                    </React.Fragment>
                  ))}
              </SimpleGrid>
            </Box>
          ))}
      </Box>

      <ProductDrawer product={product as WithID<Product>} onClose={drawer.onClose} isOpen={drawer.isOpen} />
      <BasketBar onClick={basketDrawer.onOpen} />
      <BasketDrawer logo={place!.logo} isOpen={basketDrawer.isOpen} onClose={basketDrawer.onClose} />

    </Layout >
  )
}

export default withAuthUser<InferGetServerSidePropsType<typeof getServerSideProps>>()(PlaceCatalog)

export const getServerSideProps: GetServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  try {
    const { placeId, catalogId } = query

    const place = await admin.firestore().doc(`places/${placeId}`).get()
    if (!place.exists)
      return { notFound: true }

    const methods = (place.data() as Place).methods
    if (!methods.includes(catalogId as string)) {
      console.log("no such catalog")
      if (methods.length > 0)
        return {
          redirect: {
            destination: `/place/${placeId}/${methods[0]}`,
            permanent: false,
          },
        }
      else
        return { notFound: true }
    }

    const catalog = await admin.firestore().doc(`places/${placeId}/catalogs/${catalogId}`).get()
    if (!catalog.exists)
      return { notFound: true }

    const _categories = await admin.firestore().collection(`places/${placeId}/categories`)
      .where("catalogIds", "array-contains", catalogId)
      .get()
    if (_categories.empty)
      return { notFound: true }

    const categories = _categories.docs.map(doc => ({ ...doc.data() as Category, id: doc.id }))
    const productIds = categories.reduce((acc, cur) => ([...acc, ...cur.products]), [] as string[])

    const _products = productIds.map(productId => {
      return admin.firestore().doc(`places/${placeId}/products/${productId}`).get()
    })

    const __products = await Promise.all(_products)

    const products = __products.reduce((acc, doc) => {
      return doc.exists ? [...acc, { ...doc.data(), id: doc.id }] : acc
    }, [] as any[])

    return {
      props: {
        place: place.data(),
        catalog: catalog.data(),
        categories: categories,
        products: products
      }
    }
  } catch (error) {
    console.error(error)
    return { notFound: true } // TOFIX: replace by internal server error?
  }
}
