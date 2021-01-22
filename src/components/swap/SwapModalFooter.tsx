import { Trade, TradeType } from '@src/sdk'
import React, { useContext, useMemo, useState } from 'react'
import { Repeat } from 'react-feather'
import { useTranslation } from 'react-i18next'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { TYPE } from '../../theme'
import { DialogCardStyled } from '../../components/Card'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity
} from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useContext(ThemeContext)
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    allowedSlippage,
    trade
  ])
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <DialogCardStyled>
        <AutoColumn gap="12px">
            <RowBetween align="center">
            <Text fontWeight={400} fontSize={14} color={theme.text4}>
                {t('Price')}
            </Text>
            <Text
                fontWeight={500}
                fontSize={14}
                color={theme.text3}
                style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                textAlign: 'right',
                paddingLeft: '10px'
                }}
            >
                {formatExecutionPrice(trade, showInverted)}
                <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
                <Repeat size={14} />
                </StyledBalanceMaxMini>
            </Text>
            </RowBetween>

            <RowBetween>
            <RowFixed>
                <TYPE.black fontSize={14} fontWeight={400} color={theme.text4}>
                {trade.tradeType === TradeType.EXACT_INPUT ? t('Minimum received') : t('Maximum sold')}
                </TYPE.black>
                <QuestionHelper text={t('hint14')} />
            </RowFixed>
            <RowFixed>
                <TYPE.black fontSize={14} color={theme.text3}>
                {trade.tradeType === TradeType.EXACT_INPUT
                    ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                    : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
                </TYPE.black>
                <TYPE.black fontSize={14} marginLeft={'4px'} color={theme.text3}>
                {trade.tradeType === TradeType.EXACT_INPUT
                    ? trade.outputAmount.currency.symbol
                    : trade.inputAmount.currency.symbol}
                </TYPE.black>
            </RowFixed>
            </RowBetween>
            <RowBetween>
            <RowFixed>
                <TYPE.black color={theme.text4} fontSize={14} fontWeight={400}>
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
                {realizedLPFee ? realizedLPFee?.toSignificant(6) + ' ' + trade.inputAmount.currency.symbol : '-'}
            </TYPE.black>
            </RowBetween>
        </AutoColumn>
      </DialogCardStyled>

        <AutoRow>
            <ButtonError
            onClick={onConfirm}
            disabled={disabledConfirm}
            error={severity > 2}
            style={{ margin: '32px 0 0 0' }}
            id="confirm-swap-or-send"
            >
            <Text fontSize={20} fontWeight={500}>
                {severity > 2 ? t('Swap Anyway') : t('Confirm Swap')}
            </Text>
            </ButtonError>

            {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
        </AutoRow>
    </>
  )
}
