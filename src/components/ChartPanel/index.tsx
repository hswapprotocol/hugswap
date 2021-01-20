// ChartPanel
import { Currency, Pair } from '@src/sdk'
import React from 'react'
import styled from 'styled-components'
import { LinkStyledButton } from '../../theme'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'

const ChartWrapper = styled.div`
  
`
const ChartName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;

  .token-symbol-container, .pair-name-container{
    font-size: 18px;
    margin-left: 0.5rem;
  }
`
const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`
const ChartTools = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`
const PriceBlock = styled.div`
  display: flex;
  align-items: center;
`

const Price = styled.div`
  font-size: 2.25rem;
  font-weight: bloder;
`
interface PriceDiffProps {
  diff: Number
}
const PriceDiff = ({diff}:PriceDiffProps) => {
  let wapperStyle = diff == 0 ?'' : (diff > 0 ? 'up' : 'down')
  return <PriceDiffWrapper className={wapperStyle}>{(diff == 0 ?'' : (diff > 0 ? '+' : '-'))}{diff}%</PriceDiffWrapper>
}
const PriceDiffWrapper = styled.div<{ diff?: number }>`
  font-size: 18px;
  margin-left: 0.75rem;
  color: ${({ theme }) => theme.text10};
  &.up{
    color: ${({ theme }) => theme.text8};
  }
  &.down{
    color: ${({ theme }) => theme.text9};
  }
`

const ResolutionButton = styled(LinkStyledButton)`

`
const Resolutions = styled.div`

`

const Chart = styled.div`
  padding-top: 55%;
  background-color: red;
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
      <ChartTools>
        <PriceBlock>
          <Price>6.83777</Price>
          <PriceDiff diff={3.744}></PriceDiff>
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