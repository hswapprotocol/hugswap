// import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Percent } from '@src/sdk'
import { ALLOWED_PRICE_IMPACT_HIGH, PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN } from '../../constants'

/**
 * Given the price impact, get user confirmation.
 *
 * @param priceImpactWithoutFee price impact of the trade without the fee.
 */
export default function confirmPriceImpactWithoutFee(priceImpactWithoutFee: Percent): boolean {
  const t = i18next.t

  if (!priceImpactWithoutFee.lessThan(PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN)) {
    return (
      window.prompt(
        t('hint31', {amount: PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN.toFixed(0)})
      ) === 'confirm'
    )
  } else if (!priceImpactWithoutFee.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) {
    return window.confirm(
        t('hint32', {amount: ALLOWED_PRICE_IMPACT_HIGH.toFixed(0)})
    )
  }
  return true
}
