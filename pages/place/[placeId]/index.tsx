import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext
} from 'next'

function PlaceIndex(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return null
}

export default (PlaceIndex)

export const getServerSideProps: GetServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const { placeId } = query

  return {
    redirect: {
      destination: `/place/${placeId}/collect`,
      permanent: false,
    },
  }
}
