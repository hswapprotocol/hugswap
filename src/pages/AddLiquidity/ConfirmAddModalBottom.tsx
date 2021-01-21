import { Currency, CurrencyAmount, Fraction, Percent } from '@src/sdk'
import { useTranslation } from 'react-i18next'
import React, { useContext } from 'react'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'

const BgWrap = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  border-radius: 12px;
  padding: 1rem;
  line-height: 2.5;
`

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  return (
    <>
      <BgWrap>
        <RowBetween>
          <TYPE.body color={theme.text4}>{currencies[Field.CURRENCY_A]?.symbol} {t('Deposited')}</TYPE.body>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
            <TYPE.body color={theme.text3}>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.body>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <TYPE.body color={theme.text4}>{currencies[Field.CURRENCY_B]?.symbol} {t('Deposited')}</TYPE.body>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <TYPE.body color={theme.text3}>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.body>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <TYPE.body color={theme.text4}>{t('Rates')}</TYPE.body>
          <TYPE.body color={theme.text3}>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </TYPE.body>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <TYPE.body color={theme.text3} lineHeight={1.5}>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </TYPE.body>
        </RowBetween>
        <RowBetween>
          <TYPE.body color={theme.text4}>{t('Share of Pool')}:</TYPE.body>
          <TYPE.body color={theme.text3}>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.body>
        </RowBetween>
      </BgWrap>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
        </Text>
      </ButtonPrimary>
    </>
  )
}
