// the Uniswap Default token list lives here
export const DEFAULT_TOKEN_LIST_URL = `${location.protocol}//${location.hostname}:${location.port}/tokenlist.json?v=1}`
export const DEFAULT_LIST_OF_LISTS: string[] = [
  DEFAULT_TOKEN_LIST_URL,
  't2crtokens.eth', // kleros
  'https://umaproject.org/uma.tokenlist.json'
]
