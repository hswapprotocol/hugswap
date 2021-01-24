// ChartPanel
import { Currency } from '@src/sdk'
// import React, { useState, useEffect, useRef }  from 'react'
import React, { useState, useEffect, useRef, RefObject } from 'react'
// import { useTranslation } from 'react-i18next'
// import { usePrevious } from 'react-use'
import styled from 'styled-components'
import { timeframeOptions } from '../../constants'
// import { useDarkModeManager } from '../../state/user/hooks'
import CurrencyLogo from '../../components/CurrencyLogo'
// import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useTokenChartData } from '../../contexts/TokenData'
// import { usePairData } from '../../contexts/PairData'
// import { useTokenPriceData } from '../../contexts/TokenData'
// import { XAxis, YAxis, Area, ResponsiveContainer, AreaChart } from 'recharts'
import TradingViewChart, { CHART_TYPES } from '../TradingviewChart'
import { getTimeframe } from '../../utils'
// import { useSelectedListInfo } from '../../state/lists/hooks'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { useTokenBySymbol } from '../../hooks/Tokens'
// import { TokenAmount, Pair, Token } from '@src/sdk'
import { Field } from '../../state/swap/actions'

const ChartWrapper = styled.div`
  width: 100%;
`
const ChartName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;

  .token-symbol-container,
  .pair-name-container {
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
  margin-bottom: 1.75rem;
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
const PriceDiff = ({ diff }: PriceDiffProps) => {
  let wapperStyle = diff == 0 ? '' : diff > 0 ? 'up' : 'down'
  return (
    <>
      <PriceDiffWrapper className={wapperStyle}>
        {diff == 0 ? '' : diff > 0 ? '+' : '-'}
        {diff}%
      </PriceDiffWrapper>
    </>
  )
}
const PriceDiffWrapper = styled.div<{ diff?: number }>`
  font-size: 18px;
  margin-left: 0.75rem;
  color: ${({ theme }) => theme.text10};
  &.up {
    color: ${({ theme }) => theme.text8};
  }
  &.down {
    color: ${({ theme }) => theme.text9};
  }
`
const Resolutions = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  user-select: none;

  li {
    position: relative;
    padding: 0 0.625rem;

    &:after {
      content: '';
      position: absolute;
      right: -1px;
      top: 50%;
      transform: translateY(-50%);
      height: 10px;
      width: 1px;
      background-color: ${({ theme }) => theme.text4};
    }
    &:last-child {
      padding-right: 0;
      &:after {
        display: none;
      }
    }
  }
`
interface ResolutionBottonProps {
  children: any | undefined
  isActive: boolean
  setActiveFn: () => void
}
const ResolutionButton = ({ children, isActive, setActiveFn }: ResolutionBottonProps) => {
  let wapperStyle = isActive ? 'active' : ''
  return (
    <li>
      <ResolutionButtonInner className={wapperStyle} onClick={setActiveFn}>
        {children}
      </ResolutionButtonInner>
    </li>
  )
}
const ResolutionButtonInner = styled.a`
  color: ${({ theme }) => theme.text4};
  cursor: pointer;

  &.active {
    cursor: default;
    color: ${({ theme }) => theme.text6};
  }
`
const Chart = styled.div``

// const CHART_VIEW = {
//   LINE_PRICE: 'Price (Line)',
// }

// const DATA_FREQUENCY = {
//   LINE: 'LINE',
// }
// interface DefaultToken {
//   decimals: number
//   name: string
//   symbol: string
// }

// const defaultTokens = [
//   {
//     decimals: 18,
//     name: 'HT',
//     symbol: 'HT'
//   },
//   {
//     decimals: 18,
//     name: 'HUSD',
//     symbol: 'HUSD'
//   }
// ]

interface ChartData {
  id: number
  date: number
  dayString: number
  dailyVolumeUSD: number | undefined
  totalLiquidityUSD: number | undefined
  priceUSD: number | undefined
  priceChangeUSD: number | undefined
  mostLiquidPairs: undefined
}

// 只用于画图， HT 地址返回 WHT 地址，用于获取价格
const getChartTokenInfo = (currency: Currency | undefined) => {
  let symbol = currency?.symbol
  if (symbol === 'HT') {
    symbol = 'WHT'
  }
  return useTokenBySymbol(symbol)
}

interface ChartPanelProps {
  id: string
}
export default function ChartPanel({ id }: ChartPanelProps) {
  // const currency = tokenA || tokenB || Currency.ETHER
  const ref = useRef<HTMLDivElement>()

  const { currencies } = useDerivedSwapInfo()

  const tokenA = currencies[Field.INPUT]
  const tokenB = currencies[Field.OUTPUT]

  // const theme = useContext(ThemeContext)
  let chartData: ChartData[] = []
  const tokenAInfo = getChartTokenInfo(tokenA)
  // let tokenBInfo
  if (tokenB) {
    // console.log(tokenB)
    // tokenBInfo = getChartTokenInfo(tokenB)
  }

  // let dummyPair
  // if (tokenAInfo && tokenBInfo) {
  //   dummyPair = new Pair(new TokenAmount(tokenAInfo as Token, '0'), new TokenAmount(tokenBInfo as Token, '0'))
  //   console.log('tokenBInfo:', dummyPair)
  // } else {
  chartData = useTokenChartData(tokenAInfo?.address.toLowerCase())
  // }

  console.log('tokenAInfo:', tokenAInfo)
  // settings for the window and candle width
  // const [chartFilter, setChartFilter] = useState(CHART_VIEW.PRICE)
  // const [frequency, setFrequency] = useState(DATA_FREQUENCY.HOUR)

  // hourly and daily price data based on the current time window
  // let price:number, priceDiff:number = 0.00
  // if (chartData?.length) {
  //   price = chartData[chartData.length - 1]?.priceUSD || 0
  //   if (chartData.length >= 2) {
  //     priceDiff = price - (chartData ? chartData[chartData.length - 2]?.priceUSD || price : price)
  //   }
  // }
  // const { t } = useTranslation()

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)
  // const prevWindow = usePrevious(timeWindow)
  // console.log('prevWindow', prevWindow, '-->',timeWindow)

  let utcStartTime = getTimeframe(timeWindow)
  let chartDataFiltered = chartData?.filter((entry: ChartData): boolean => entry.date >= utcStartTime)
  // useEffect(() => {
  //   if (prevWindow !== timeWindow) {
  //     console.log('timeWindow change',prevWindow !== timeWindow, prevWindow, timeWindow)
  //     let utcStartTime = getTimeframe(timeWindow)
  //     chartDataFiltered = chartData?.filter((entry:ChartData):boolean => entry.date >= utcStartTime)
  //     console.log('filtered chartData', chartDataFiltered)
  //   }
  // }, [prevWindow, timeWindow])

  // update the width on a window resize
  // const ref = ref.current
  const isClient = typeof window === 'object'
  const [width, setWidth] = useState(ref?.current?.clientWidth || 600)

  useEffect(() => {
    if (!isClient) {
      return
    }
    function handleResize() {
      setWidth(ref?.current?.clientWidth ?? width)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    // return () => window.removeEventListener('resize', handleResize)
  }, [isClient, width]) // Empty array ensures that effect is only run on mount and unmount

  return (
    <ChartWrapper>
      <ChartName>
        <CurrencyLogo currency={tokenA} size={'24px'} />
        <StyledTokenName className="token-symbol-container" active={Boolean(tokenA && tokenA.symbol)}>
          {(tokenA && tokenA.symbol && tokenA.symbol.length > 20
            ? tokenA.symbol.slice(0, 4) +
              '...' +
              tokenA.symbol.slice(tokenA.symbol.length - 5, tokenA.symbol.length)
            : tokenA?.symbol) || '--'}
        </StyledTokenName>
        {/*
        {tokenA && tokenB ? (
          <DoubleCurrencyLogo currency0={tokenA} currency1={tokenB} size={24} margin={true} />
        ) : tokenA ? (
          <CurrencyLogo currency={tokenA} size={'24px'} />
        ) : null}
        {tokenA && tokenB ? (
          <StyledTokenName className="pair-name-container">
            {tokenA.symbol}:{tokenB.symbol}
          </StyledTokenName>
        ) : (
          <StyledTokenName className="token-symbol-container" active={Boolean(tokenA && tokenA.symbol)}>
            {(tokenA && tokenA.symbol && tokenA.symbol.length > 20
              ? tokenA.symbol.slice(0, 4) + '...' + tokenA.symbol.slice(tokenA.symbol.length - 5, tokenA.symbol.length)
              : tokenA?.symbol) || '--'}
          </StyledTokenName>
        )}
        */}
      </ChartName>
      <ChartTools>
        <PriceBlock id="chart-tooltip">
          <Price>--</Price>
          <PriceDiff diff={0} />
        </PriceBlock>
        <Resolutions>
          <ResolutionButton
            isActive={timeWindow === timeframeOptions.DAY}
            setActiveFn={() => setTimeWindow(timeframeOptions.DAY)}
          >
            1D
          </ResolutionButton>
          <ResolutionButton
            isActive={timeWindow === timeframeOptions.WEEK}
            setActiveFn={() => setTimeWindow(timeframeOptions.WEEK)}
          >
            1W
          </ResolutionButton>
          <ResolutionButton
            isActive={timeWindow === timeframeOptions.ALL_TIME}
            setActiveFn={() => setTimeWindow(timeframeOptions.ALL_TIME)}
          >
            ALL
          </ResolutionButton>
        </Resolutions>
      </ChartTools>
      <Chart ref={ref as RefObject<HTMLDivElement>}>
        <TradingViewChart
          toolTipSelector="#chart-tooltip"
          data={chartDataFiltered}
          base={0}
          baseChange={0}
          field="priceUSD"
          width={width}
          type={CHART_TYPES.AREA}
        />
      </Chart>
    </ChartWrapper>
  )
}
