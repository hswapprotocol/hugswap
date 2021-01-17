import { CurrencyAmount, ETHER, Percent, Route, TokenAmount, Trade } from '@src/sdk'
import { DAI, USDC } from '../constants'
import { MockV1Pair } from '../data/V1'
import v1SwapArguments from './v1SwapArguments'

describe('v1SwapArguments', () => {
  const USDC_WHT = new MockV1Pair('1000000', new TokenAmount(USDC, '1000000'))
  const DAI_WETH = new MockV1Pair('1000000', new TokenAmount(DAI, '1000000'))

  // just some random address
  const TEST_RECIPIENT_ADDRESS = USDC_WHT.liquidityToken.address

  it('exact ht to token', () => {
    const trade = Trade.exactIn(new Route([USDC_WHT], ETHER), CurrencyAmount.ether('100'))
    const result = v1SwapArguments(trade, {
      recipient: TEST_RECIPIENT_ADDRESS,
      allowedSlippage: new Percent('1', '100'),
      deadline: 20 * 60
    })
    expect(result.methodName).toEqual('ethToTokenTransferInput')
    expect(result.args).toEqual(['0x62', '0x4b0', TEST_RECIPIENT_ADDRESS])
    expect(result.value).toEqual('0x64')
  })
  it('exact token to ht', () => {
    const trade = Trade.exactIn(new Route([USDC_WHT], USDC, ETHER), new TokenAmount(USDC, '100'))
    const result = v1SwapArguments(trade, {
      recipient: TEST_RECIPIENT_ADDRESS,
      allowedSlippage: new Percent('1', '100'),
      deadline: 40 * 60
    })
    expect(result.methodName).toEqual('tokenToEthTransferInput')
    expect(result.args[0]).toEqual('0x64')
    expect(result.args[1]).toEqual('0x62')
    expect(result.args[2]).toEqual('0x960')
    expect(result.args[3]).toEqual(TEST_RECIPIENT_ADDRESS)
    expect(result.value).toEqual('0x0')
  })
  it('exact token to token', () => {
    const trade = Trade.exactIn(new Route([USDC_WHT, DAI_WETH], USDC), new TokenAmount(USDC, '100'))
    const result = v1SwapArguments(trade, {
      recipient: TEST_RECIPIENT_ADDRESS,
      allowedSlippage: new Percent('1', '100'),
      deadline: 20 * 60
    })
    expect(result.methodName).toEqual('tokenToTokenTransferInput')
    expect(result.args[0]).toEqual('0x64')
    expect(result.args[1]).toEqual('0x61')
    expect(result.args[2]).toEqual('0x1')
    expect(result.args[3]).toEqual('0x4b0')
    expect(result.args[4]).toEqual(TEST_RECIPIENT_ADDRESS)
    expect(result.args[5]).toEqual(DAI.address)
    expect(result.value).toEqual('0x0')
  })
  it('ht to exact token', () => {
    const trade = Trade.exactOut(new Route([USDC_WHT], ETHER), new TokenAmount(USDC, '100'))
    const result = v1SwapArguments(trade, {
      recipient: TEST_RECIPIENT_ADDRESS,
      allowedSlippage: new Percent('1', '100'),
      deadline: 20 * 60
    })
    expect(result.methodName).toEqual('ethToTokenTransferOutput')
    expect(result.args[0]).toEqual('0x64')
    expect(result.args[1]).toEqual('0x4b0')
    expect(result.args[2]).toEqual(TEST_RECIPIENT_ADDRESS)
    expect(result.value).toEqual('0x66')
  })
  it('token to exact ht', () => {
    const trade = Trade.exactOut(new Route([USDC_WHT], USDC, ETHER), CurrencyAmount.ether('100'))
    const result = v1SwapArguments(trade, {
      recipient: TEST_RECIPIENT_ADDRESS,
      allowedSlippage: new Percent('1', '100'),
      deadline: 20 * 60
    })
    expect(result.methodName).toEqual('tokenToEthTransferOutput')
    expect(result.args[0]).toEqual('0x64')
    expect(result.args[1]).toEqual('0x66')
    expect(result.args[2]).toEqual('0x4b0')
    expect(result.args[3]).toEqual(TEST_RECIPIENT_ADDRESS)
    expect(result.value).toEqual('0x0')
  })
  it('token to exact token', () => {
    const trade = Trade.exactOut(new Route([USDC_WHT, DAI_WETH], USDC), new TokenAmount(DAI, '100'))
    const result = v1SwapArguments(trade, {
      recipient: TEST_RECIPIENT_ADDRESS,
      allowedSlippage: new Percent('1', '100'),
      deadline: 20 * 60
    })
    expect(result.methodName).toEqual('tokenToTokenTransferOutput')
    expect(result.args[0]).toEqual('0x64')
    expect(result.args[1]).toEqual('0x67')
    expect(result.args[2]).toEqual(`0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`)
    expect(result.args[3]).toEqual('0x4b0')
    expect(result.args[4]).toEqual(TEST_RECIPIENT_ADDRESS)
    expect(result.args[5]).toEqual(DAI.address)
    expect(result.value).toEqual('0x0')
  })
})
