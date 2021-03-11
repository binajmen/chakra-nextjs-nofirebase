export {}
// import * as React from "react"
// import useTranslation from "next-translate/useTranslation"

// import {
//   SimpleGrid,
//   Box,
//   HStack,
//   Heading,
//   Stack,
//   Image,
//   Badge,
// } from '@chakra-ui/react'
// import { FaStar, FaStarHalf, FaStarHalfAlt } from "react-icons/fa"

// export type PlaceCardProps = {
//   name: string
//   address: string
//   score: number
//   reviews: number
//   isNew?: boolean
//   hasNow?: boolean
//   hasCollect?: boolean
//   hasDelivery?: boolean
//   buttonRender: (id: string) => JSX.Element | null
// }

// export default function PlaceCard({
//   name,
//   address,
//   score,
//   reviews,
//   isNew = false,
//   hasNow = false,
//   hasCollect = false,
//   hasDelivery = false,
//   place,
//   buttonRender
// }: PlaceCardProps) {
//   const { t } = useTranslation('common')

//   return (
//     <Box boxShadow="lg" borderRadius="lg" overflow="hidden">
//       {/* TODO: use Next Image for optimization? */}
//       <Image w="100%" src={place.cover} alt="Image du restaurant" />

//       <Box p="3">
//         <HStack spacing="3">
//           {isNew && <Badge borderRadius="full" px="2" colorScheme="primary">{t('new')}</Badge>}
//           {hasNow && <Badge borderRadius="full" px="2">{t('now')}</Badge>}
//           {hasCollect && <Badge borderRadius="full" px="2">{t('collect')}</Badge>}
//           {hasDelivery && <Badge borderRadius="full" px="2">{t('delivery')}</Badge>}
//         </HStack>

//         <Heading size="sm">{name}</Heading>

//         <Text>{address}</Text>

//         <Box d="flex" mt="2" alignItems="center">
//           {Array(10)
//             .fill("")
//             .map((_, index) => {
//               if (index % 2 === 0) {

//               }
//                 if (score * 2 < index)
//             }
//               <FaStar
//                 key={index}
//                 color={index < 3 ? "primary" : "gray.300"}
//               />
//             ))}
//           <Box as="span" ml="2" color="gray.600" fontSize="sm">
//             2 reviews
//           </Box>
//         </Box>

//         {buttonRender &&
//           <Box mt="2" textAlign="right">
//             {buttonRender(place.id!)}
//           </Box>
//         }
//       </Box>
//     </Box>
//   )
// }