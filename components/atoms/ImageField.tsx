import * as React from 'react'
import Image from "next/image"
import { nanoid } from 'nanoid'

import {
  Flex,
  Box,
  Center,
  Text,
  Input,
  InputProps,
  Stack,
  Icon
} from '@chakra-ui/react'
import { FaUpload, FaCloudUploadAlt } from 'react-icons/fa'

import firebase from '@/lib/firebase/client'

export type ImageFieldProps = InputProps & {
  value: string
  storagePath: string
  onImage: (imageUrl: string) => void
}

const inactiveColor = "#E2E8F0"
const activeColor = "green"
const validTypes = ['image/jpeg', 'image/jpg', 'image/png']

export default function ImageField(props: ImageFieldProps) {
  const { value, storagePath, onImage, ...inputProps } = props
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [borderColor, setBorderColor] = React.useState<string>(inactiveColor)

  function dragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setBorderColor(activeColor)
  }

  function dragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setBorderColor(activeColor)
  }

  function dragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setBorderColor(inactiveColor)
  }

  function fileDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    handleFiles(event.dataTransfer.files)
    setBorderColor(inactiveColor)
  }

  function dropZoneClicked() {
    fileInputRef?.current?.click()
  }

  function filesSelected() {
    if (fileInputRef?.current?.files?.length) {
      handleFiles(fileInputRef.current.files);
    }
  }

  function handleFiles(files: FileList) {
    const file = files[0]
    if (validTypes.indexOf(file.type) === -1) {
      setBorderColor(inactiveColor)
      return "wrong format"
    }

    let storageRef = firebase.storage().ref()
    let imageRef = storageRef.child(`${storagePath}/${nanoid()}.${file.type}`)
    let uploadTask = imageRef.put(file)

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.error(error.code)
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        // switch (error.code) {
        //   case 'storage/unauthorized':
        // }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log('File available at', downloadURL)
          onImage(downloadURL)
        })
      }
    )
  }

  if (value) {
    return (
      <Box position="relative" h="85%" w="full">
        <Image src={value} alt="Picture of the product" layout="fill" objectFit="cover" />
      </Box>
    )
  } else {
    return (
      <Box
        h="85%" w="full"
        border="2px dashed"
        borderColor={borderColor}
        borderRadius="lg"
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={fileDrop}
        onClick={dropZoneClicked}
        p="6"
      >
        <Center h="100%" bgColor="#EDF2F7" borderRadius="lg" p="3">
          <Stack direction="column" textAlign="center">
            <Center><Icon color="gray" as={FaUpload} boxSize="8" /></Center>
            <Text>Glissez et déposez une image ou cliquez ici pour associer une nouvelle image au produit.</Text>
            <Text fontSize="xs">
              Formats acceptés: {validTypes.map(t => t.split("/")[1]).join(", ")}.
            </Text>
            <Input type="file" ref={fileInputRef} onChange={filesSelected} display="none" />
          </Stack>
        </Center>
      </Box>
    )
  }

  return (
    <Flex h="85%" w="full">
      {value &&
        <Box flex="1" h="100%">
          <Box position="relative" w="100%" h="100%">
            <Image src={value} alt="Picture of the product" layout="fill" objectFit="cover" />
          </Box>
        </Box>
      }
      <Box
        flex="1"
        h="100%"
        border="2px dashed"
        borderColor={borderColor}
        borderRadius="lg"
        onDragOver={dragOver}
        onDragEnter={dragEnter}
        onDragLeave={dragLeave}
        onDrop={fileDrop}
        onClick={dropZoneClicked}
        p="6"
      >
        <Center h="100%" bgColor="#EDF2F7" borderRadius="lg" p="3">
          <Stack direction="column" textAlign="center">
            <Center><Icon color="gray" as={FaUpload} boxSize="8" /></Center>
            <Text>Glissez et déposez une image ou cliquez ici pour associer une nouvelle image au produit.</Text>
            <Text fontSize="xs">
              Formats acceptés: {validTypes.map(t => t.split("/")[1]).join(", ")}.
            </Text>
            <Input type="file" ref={fileInputRef} onChange={filesSelected} display="none" />
          </Stack>
        </Center>
      </Box>
    </Flex>
  )
}
