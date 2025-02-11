import uriToHttp from './uriToHttp'

describe('uriToHttp', () => {
  it('returns .ht.link for ens names', () => {
    expect(uriToHttp('t2crtokens.ht')).toEqual([])
  })
  it('returns https first for http', () => {
    expect(uriToHttp('http://test.com')).toEqual(['https://test.com', 'http://test.com'])
  })
  it('returns https for https', () => {
    expect(uriToHttp('https://test.com')).toEqual(['https://test.com'])
  })
  it('returns ipfs gateways for ipfs:// urls', () => {
    expect(uriToHttp('ipfs://QmV8AfDE8GFSGQvt3vck8EwAzsPuNTmtP8VcQJE3qxRPaZ')).toEqual([
      'https://cloudflare-ipfs.com/ipfs/QmV8AfDE8GFSGQvt3vck8EwAzsPuNTmtP8VcQJE3qxRPaZ/',
      'https://ipfs.io/ipfs/QmV8AfDE8GFSGQvt3vck8EwAzsPuNTmtP8VcQJE3qxRPaZ/'
    ])
  })
  it('returns ipns gateways for ipns:// urls', () => {
    expect(uriToHttp('ipns://app.hugswap.com')).toEqual([
      'https://cloudflare-ipfs.com/ipns/app.hugswap.com/',
      'https://ipfs.io/ipns/app.hugswap.com/'
    ])
  })
  it('returns empty array for invalid scheme', () => {
    expect(uriToHttp('blah:test')).toEqual([])
  })
})
