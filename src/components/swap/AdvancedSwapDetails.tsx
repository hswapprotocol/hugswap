import { Trade, TradeType } from '@src/sdk'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { useTranslation } from 'react-i18next'
import { TYPE, ExternalLink } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn as AutoColumnbase } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'

const InfoLink = styled(ExternalLink)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 6px 6px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text3};
`
const AutoColumn = styled(AutoColumnbase)`
  padding: 10px 10px;
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 12px;
`

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <>
      <AutoColumn>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text4}>
              {isExactIn ? t('Minimum received') : t('Maximum sold')}
            </TYPE.black>
            <QuestionHelper text={t('hint14')} />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.text3} fontSize={14}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween padding="10px 0">
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text4}>
              {t('Price Impact')}
            </TYPE.black>
            <QuestionHelper text={t('hint13')} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.text4}>
              {t('Liquidity Provider Fee')}
            </TYPE.black>
            <QuestionHelper text={t('hint12')} />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme.text3}>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    {t('Route')}
                  </TYPE.black>
                  <QuestionHelper text={t('Routing through these tokens resulted')} />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
          <AutoColumn style={{ padding: '0 24px' }}>
            <InfoLink
              href={'https://info.hugswap.com/pair/' + trade.route.pairs[0].liquidityToken.address}
              target="_blank"
            >
              {t('viewPair')} ↗
            </InfoLink>
          </AutoColumn>
        </>
      )}
    </AutoColumn>
  )
}
