import * as React from "react"
import Image from "next/image"
import useTranslation from "next-translate/useTranslation"

import {
  Flex,
  Box,
  HStack,
  Text,
  LinkBox,
  LinkOverlay,
  Badge,
  Icon,
  Heading,
  Collapse,
  Button,
  useDisclosure,
  VStack,
  IconButton
} from "@chakra-ui/react"
import { FaChair, FaWalking, FaBicycle } from "react-icons/fa"
import { FaHeart, FaRegHeart, FaInfoCircle, FaChevronDown, FaChevronUp, FaGlobe, FaFacebook } from "react-icons/fa"

import type { Place } from "@/types/place"

type HeaderProps = {
  place: Place
}

export default function PlaceHeader({ place }: HeaderProps) {
  const { t } = useTranslation("common")

  return (
    <Box position="relative">
      <Box position="relative" w="full" h="25vh" my="3">
        <Image src={place.cover} alt={`Cover photo from ${place.name}`} layout="fill" objectFit="cover" />
      </Box>
      <Box position="absolute" right="0" top="0" p="2">
        <Flex justify="space-end">
          <IconButton
            aria-label="favorites"
            color="tomato"
            icon={<FaHeart />}
          />
        </Flex>
      </Box>
      <Box position="absolute" bottom="0" w="full" px="2">
        <Flex justify="space-between" alignItems="center">
          <Heading color="white">{place.name}</Heading>
          <Button size="xs" leftIcon={<FaInfoCircle />}>{t("info")}</Button>
        </Flex>
      </Box>
    </Box>
  )
}

// function PlaceInfo({ place }: HeaderProps) {
//   const { t } = useTranslation("common")
//   const collapse = useDisclosure()

//   const currentMethod = useStoreState(state => state.order.method)

//   return (
//     <Box textAlign="right">
//       <Collapse in={collapse.isOpen}>
//         <Flex justify="space-between" borderBottom="1px dashed lightgray">
//           <Box p="3" w="full" textAlign="left">
//             <VStack align="stretch" spacing="2">
//               <Heading size="md">{place.name}</Heading>
//               {/* <OpeningHourInline method={currentMethod} opening={place.opening} /> */}
//               <MethodsAvailable methods={place.methods} />
//             </VStack>
//           </Box>
//           <Box p="3">
//             <IconButton
//               aria-label="website"
//               colorScheme="white"
//               variant="ghost"
//               icon={<FaGlobe />} />
//             <IconButton
//               aria-label="facebook"
//               colorScheme="facebook"
//               variant="ghost"
//               icon={<FaFacebook />} />
//           </Box>
//         </Flex>
//       </Collapse>

//       <Button
//         size="sm"
//         colorScheme="white"
//         variant="ghost"
//         rightIcon={collapse.isOpen ? <FaChevronUp /> : <FaChevronDown />}
//         onClick={collapse.onToggle}
//       >{collapse.isOpen ? "Fermer" : "En savoir plus"}</Button>
//     </Box>
//   )
// }
