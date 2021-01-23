// ChartPanel
import { Currency } from '@src/sdk'
// import React, { useState, useEffect, useRef }  from 'react'
import React, { useState, useContext, useEffect }  from 'react'
// import { useTranslation } from 'react-i18next'
import { useMedia, usePrevious } from 'react-use'
import styled, { ThemeContext } from 'styled-components'
import { timeframeOptions } from '../../constants'
// import { useDarkModeManager } from '../../state/user/hooks'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useTokenChartData } from '../../contexts/TokenData'
// import { useTokenPriceData } from '../../contexts/TokenData'
import { XAxis, YAxis, Area, ResponsiveContainer, AreaChart } from 'recharts'
import { toK, toNiceDate, getTimeframe } from '../../utils'
// import { useSelectedListInfo } from '../../state/lists/hooks'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { useTokenBySymbol } from '../../hooks/Tokens'
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
const ResolutionsWrapper = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  user-select: none;
  
  li {
    position: relative;
    padding: 0 0.625rem;
    
    &:after {
      content: "";
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

interface ResolutionProps {
  active: string
  setActive: (timeWindow:string) => void
}
const Resolutions = ({ active, setActive }: ResolutionProps) => {
  return (
    <ResolutionsWrapper>
      <ResolutionButton
        isActive={active === timeframeOptions.DAY}
        setActiveFn={() => setActive(timeframeOptions.DAY)}
      >
        1D
      </ResolutionButton>
      <ResolutionButton
        isActive={active === timeframeOptions.WEEK}
        setActiveFn={() => setActive(timeframeOptions.WEEK)}
      >
        1W
      </ResolutionButton>
      <ResolutionButton
        isActive={active === timeframeOptions.ALL_TIME}
        setActiveFn={() => setActive(timeframeOptions.ALL_TIME)}
      >
        ALL
      </ResolutionButton>
    </ResolutionsWrapper>
  )
}
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
  id: number,
  date: number,
  dayString: number,
  dailyVolumeUSD: number | undefined,
  totalLiquidityUSD: number | undefined,
  priceUSD: number | undefined
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
  const { currencies } = useDerivedSwapInfo()

  const tokenA = currencies[Field.INPUT]
  const tokenB = currencies[Field.OUTPUT]



  const theme = useContext(ThemeContext)
  const tokenAInfo = getChartTokenInfo(tokenA)
  let tokenBInfo = undefined
  if (tokenB) {
    tokenBInfo = getChartTokenInfo(tokenB)
    console.log('tokenBInfo:', tokenBInfo)
  }
  
  console.log('tokenAInfo:', tokenAInfo)
  // settings for the window and candle width
  // const [chartFilter, setChartFilter] = useState(CHART_VIEW.PRICE)
  // const [frequency, setFrequency] = useState(DATA_FREQUENCY.HOUR)

  let chartData:ChartData[] = useTokenChartData(tokenAInfo?.address.toLowerCase())
  console.log('chartData', chartData)
  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)
  const prevWindow = usePrevious(timeWindow)

  // hourly and daily price data based on the current time window
  let price:any, priceDiff:any = 0
  if (chartData?.length) {
    price = chartData[chartData.length - 1]?.priceUSD || 0
    if (chartData.length >= 2) {
      priceDiff = price - (chartData ? chartData[chartData.length - 2]?.priceUSD || price : price)
    }
    price = toK(price)
    priceDiff = toK(priceDiff)
  }
  // const { t } = useTranslation()

  const below1080 = useMedia('(max-width: 1080px)')
  const below600 = useMedia('(max-width: 600px)')

  let utcStartTime = getTimeframe(timeWindow)
  // const domain = [(dataMin:any) => (dataMin > utcStartTime ? dataMin : utcStartTime), 'dataMax']
  const calAspect = below1080 ? 60 / 32 : below600 ? 60 / 42 : 60 / 22

  let chartDataFiltered = chartData?.filter((entry:ChartData):boolean => entry.date >= utcStartTime)
  console.log(useEffect,prevWindow)
  // useEffect(() => {
  //   console.log('timeWindow', timeWindow)
  //   let utcStartTime = getTimeframe(timeWindow)
  //   chartDataFiltered = chartData?.filter((entry:ChartData):boolean => entry.date >= utcStartTime)
  //   console.log('filtered chartData', chartDataFiltered)
  // }, [prevWindow, timeWindow])

  if (chartDataFiltered?.length) {
    console.log('chartDataFiltered', chartDataFiltered)
    for (var i = 0; i < chartData.length; ++i) {
      chartDataFiltered[i]?.priceUSD && console.log(toNiceDate(chartDataFiltered[i].date), chartDataFiltered[i].priceUSD)
    }
  }
  // update the width on a window resize
  // const ref = useRef()
  // const isClient = typeof window === 'object'
  // const [width, setWidth] = useState(ref?.current?.container?.clientWidth)
  // useEffect(() => {
  //   if (!isClient) {
  //     return false
  //   }
  //   function handleResize() {
  //     setWidth(ref?.current?.container?.clientWidth ?? width)
  //   }
  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, [isClient, width]) // Empty array ensures that effect is only run on mount and unmount

  return (
    <ChartWrapper>
      <ChartName>
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
              ? tokenA.symbol.slice(0, 4) +
                '...' +
                tokenA.symbol.slice(tokenA.symbol.length - 5, tokenA.symbol.length)
              : tokenA?.symbol) || '--'}
          </StyledTokenName>
        )}
      </ChartName>
      <ChartTools>
        <PriceBlock>
          <Price>{price}</Price>
          <PriceDiff diff={priceDiff} />
        </PriceBlock>
        <Resolutions active={timeWindow} setActive={setTimeWindow} />
      </ChartTools>
      <Chart>
        <ResponsiveContainer aspect={calAspect}>
            <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartDataFiltered}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={'#BA40F3'} stopOpacity={0.17} />
                  <stop offset="95%" stopColor={'#171426'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                tickLine={false}
                axisLine={false}
                interval="preserveEnd"
                minTickGap={120}
                tickFormatter={(tick) => toNiceDate(tick)}
                dataKey="date"
                tick={{ fill: theme.text4 }}
                type={'number'}
                domain={['dataMin', 'dataMax']}
              />
              <YAxis
                type="number"
                orientation="right"
                tickFormatter={(tick) => '$' + toK(tick)}
                axisLine={false}
                tickLine={false}
                interval="preserveEnd"
                minTickGap={80}
                yAxisId={0}
                tick={{ fill: theme.text4 }}
              />
              <Area
                key={'other'}
                dataKey={'priceUSD'}
                stackId="2"
                strokeWidth={2}
                dot={false}
                type="monotone"
                name={'Price'}
                yAxisId={0}
                stroke="#BA40F3"
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
      </Chart>
    </ChartWrapper>
  )
}
