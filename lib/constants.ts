import { Buffer } from 'buffer'

export const VIVO_LOGO = '/images/vivo.jpg'

// This URL already includes the /ODataV4/Company('VIVO') segment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

const username = process.env.NEXT_PUBLIC_API_USERNAME!
const password = process.env.NEXT_PUBLIC_API_PASSWORD!

export const API_AUTHORIZATION = `Basic ${
  Buffer.from(`${username}:${password}`).toString('base64')
}`