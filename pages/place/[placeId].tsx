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

import type { Place } from '@/types/place'
import type { Category, CategoryMeta, Categories } from '@/types/category'
import type { Product, Products } from '@/types/product'

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
  useDisclosure,
} from '@chakra-ui/react'
import { FaCartPlus, FaPlus, FaMinus, FaShoppingBasket } from 'react-icons/fa'

import admin from '@/lib/firebase/admin'
import Wrapper from '@/layout/Wrapper'
import Header from '@/layout/place/Header'
import Footer from '@/layout/client/Footer'
import ProductDrawer from '@/components/ProductDrawer'
import BasketBar from '@/components/molecules/BasketBar'
import BasketDrawer from '@/components/organisms/BasketDrawer'
import { useStoreState } from '@/store/hooks'

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation('common')
  const drawer = useDisclosure()
  const basketDrawer = useDisclosure()
  const router = useRouter()
  const placeId = router.query.placeId

  const basketSize = useStoreState(state => state.basket.size)
  const total = useStoreState(state => state.basket.total)
  const [product, setProduct] = React.useState<Product | null>(null)

  const { data: place } = useDocument<Place>(`places/${placeId}`, { initialData: props.place })
  const { data: meta } = useDocument<CategoryMeta>(`places/${placeId}/categories/_meta_`, { initialData: props.meta })
  const { data: _categories } = useCollection<Category>(`places/${placeId}/categories`, {}, { initialData: props.categories })
  const { data: _products } = useCollection<Product>(`places/${placeId}/products`, {}, { initialData: props.products })

  const hasCategories = meta && meta.order.length > 0 && _categories && _categories.length > 0
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

  return (
    <Wrapper
      title="Order.brussels"
      renderHeader={() =>
        <Header
          cover={place!.cover}
          logo={place!.logo}
          opening={place!.opening}
        />
      }
      renderFooter={() => <Footer />}
    >
      <Box>
        {hasCategories && meta!.order.map(catId => (
          <Box mb="3">
            <Heading key={catId} mb="6" pb="1" borderBottom="1px solid lightgray">{categories[catId].name}</Heading>
            <SimpleGrid columns={[1, 1, 2, 3]} spacing={[0, 0, 9, 9]}>
              {hasProducts && categories[catId].items.map((prodId, index, array) => (
                <Flex key={prodId} p={[0, 0, 3]} mb={[3, 3, 0]} borderWidth={[0, 0, '1px']} rounded="md">
                  <Box m="auto 0" w="full">
                    <Stack direction="column">
                      <Heading size="md">{products[prodId].name}</Heading>
                      <Text>{products[prodId].desc}</Text>
                    </Stack>
                  </Box>
                  {/* <Spacer /> */}
                  <Box pl="3">
                    <Center h="100%">
                      {products[prodId].price / 100}€
                    </Center>
                  </Box>
                  <Box pl="3">
                    <Center h="100%">
                      <IconButton
                        color="gray.900"
                        colorScheme="primary"
                        aria-label="Add to cart"
                        onClick={() => setProduct(products[prodId])}
                        icon={<FaPlus />}
                      />
                    </Center>
                  </Box>
                </Flex>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </Box>

      <ProductDrawer product={product} onClose={drawer.onClose} isOpen={drawer.isOpen} />
      <BasketBar onClick={basketDrawer.onOpen} />
      <BasketDrawer logo={place!.logo} isOpen={basketDrawer.isOpen} onClose={basketDrawer.onClose} />

    </Wrapper >
  )
}

export default withAuthUser<InferGetServerSidePropsType<typeof getServerSideProps>>()(Index)

export const getServerSideProps: GetServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  try {
    const placeId = query.placeId

    const place = await admin.firestore().doc(`places/${placeId}`).get()
    if (!place.exists)
      return { notFound: true }

    const _categories = await admin.firestore().collection(`places/${placeId}/categories`).get()
    if (_categories.empty)
      return { notFound: true }

    const meta = _categories.docs.find(doc => doc.id === "_meta_")
    if (!meta?.exists)
      return { notFound: true }

    const categories = _categories.docs.filter(doc => doc.id !== "_meta_").map(doc => ({ ...doc.data(), id: doc.id }))

    const _products = await admin.firestore().collection(`places/${placeId}/products`).get()
    if (_products.empty)
      return { notFound: true }
    const products = _products.docs.map(doc => ({ ...doc.data(), id: doc.id }))

    return {
      props: {
        place: place.data(),
        meta: meta.data(),
        categories: categories,
        products: products
      }
    }
  } catch (error) {
    console.error(error)
    return { notFound: true } // TOFIX: replace by internal server error?
  }
}
