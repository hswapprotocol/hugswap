// ChartPanel
import { Currency, Pair } from '@src/sdk'
import React from 'react'

import styled from 'styled-components'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'

const ChartWrapper = styled.div`

`
const ChartTools = styled.div`

`
const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`
const ChartName = styled.div`

`
const Price = styled.div`

`
const PriceDiff = styled.div`

`
const PriceBlock = styled.div`

`
const ResolutionButton = styled.div`

`
const Resolutions = styled.div`

`

const Chart = styled.div`

`
interface ChartPanelProps {
  id: string
  pair?: Pair | null
  currency?: Currency | null
  otherCurrency?: Currency | null
}
export default function ChartPanel({
  id,
  pair,
  currency,
  otherCurrency,
}: ChartPanelProps) {
  // const theme = useContext(ThemeContext)
  currency = Currency.ETHER;
  return (
		<ChartWrapper>
      <ChartTools>
        <ChartName>
          {pair ? (
            <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
          ) : currency ? (
            <CurrencyLogo currency={currency} size={'24px'} />
          ) : null}
          {pair ? (
            <StyledTokenName className="pair-name-container">
              {pair?.token0.symbol}:{pair?.token1.symbol}
            </StyledTokenName>
          ) : (
            <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
              {(currency && currency.symbol && currency.symbol.length > 20
                ? currency.symbol.slice(0, 4) +
                  '...' +
                  currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                : currency?.symbol) || '--'}
            </StyledTokenName>
          )}
        </ChartName>
        <PriceBlock>
          <Price>6.83777</Price>
          <PriceDiff>+1.382%</PriceDiff>
        </PriceBlock>
        <Resolutions>
          <ResolutionButton>1D</ResolutionButton>
          <ResolutionButton>1W</ResolutionButton>
          <ResolutionButton>ALL</ResolutionButton>
        </Resolutions>
      </ChartTools>
      <Chart></Chart>
    </ChartWrapper>
  )
}