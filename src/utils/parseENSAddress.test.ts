import { parseENSAddress } from './parseENSAddress'

describe('parseENSAddress', () => {
  it('test cases', () => {
    expect(parseENSAddress('hello.ht')).toEqual({ ensName: 'hello.ht', ensPath: undefined })
    expect(parseENSAddress('hello.ht/')).toEqual({ ensName: 'hello.ht', ensPath: '/' })
    expect(parseENSAddress('hello.world.ht/')).toEqual({ ensName: 'hello.world.ht', ensPath: '/' })
    expect(parseENSAddress('hello.world.ht/abcdef')).toEqual({ ensName: 'hello.world.ht', ensPath: '/abcdef' })
    expect(parseENSAddress('abso.lutely')).toEqual(undefined)
    expect(parseENSAddress('abso.lutely.ht')).toEqual({ ensName: 'abso.lutely.ht', ensPath: undefined })
    expect(parseENSAddress('ht')).toEqual(undefined)
    expect(parseENSAddress('ht/hello-world')).toEqual(undefined)
    expect(parseENSAddress('hello-world.ht')).toEqual({ ensName: 'hello-world.ht', ensPath: undefined })
    expect(parseENSAddress('-prefix-dash.ht')).toEqual(undefined)
    expect(parseENSAddress('suffix-dash-.ht')).toEqual(undefined)
    expect(parseENSAddress('it.ht')).toEqual({ ensName: 'it.ht', ensPath: undefined })
    expect(parseENSAddress('only-single--dash.ht')).toEqual(undefined)
  })
})
