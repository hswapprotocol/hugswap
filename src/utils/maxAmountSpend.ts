import { CurrencyAmount, ETHER, JSBI } from '@src/sdk'
import { MIN_HT } from '../constants'

/**
 * Given some token amount, return the max that can be spent of it
 * @param currencyAmount to return max of
 */
export function maxAmountSpend(currencyAmount?: CurrencyAmount): CurrencyAmount | undefined {
  if (!currencyAmount) return undefined
  if (currencyAmount.currency === ETHER) {
    if (JSBI.greaterThan(currencyAmount.raw, MIN_HT)) {
      return CurrencyAmount.ether(JSBI.subtract(currencyAmount.raw, MIN_HT))
    } else {
      return CurrencyAmount.ether(JSBI.BigInt(0))
    }
  }
  return currencyAmount
}
