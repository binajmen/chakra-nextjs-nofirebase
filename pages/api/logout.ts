import { unsetAuthCookies } from 'next-firebase-auth'
import type { NextApiRequest, NextApiResponse } from 'next'

import initAuth from '../../src/firebase/auth'

initAuth()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await unsetAuthCookies(req, res)
    } catch (e) {
        return res.status(500).json({ error: 'Unexpected error.' })
    }
    return res.status(200).json({ success: true })
}

export default handler