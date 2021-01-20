// ChartPanel
import { Currency } from '@src/sdk'
// import React, { useState, useEffect, useRef }  from 'react'
import React, { useState, useContext }  from 'react'
import { useTranslation } from 'react-i18next'
import { useMedia } from 'react-use'
import styled, { ThemeContext } from 'styled-components'
import { timeframeOptions } from '../../constants'
// import { useDarkModeManager } from '../../state/user/hooks'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useTokenChartData, useTokenPriceData } from '../../contexts/TokenData'
import { XAxis, YAxis, Area, ResponsiveContainer, Tooltip, AreaChart } from 'recharts'
import { toK, toNiceDate, toNiceDateYear, formattedNum } from '../../utils'
import { useSelectedListInfo } from '../../state/lists/hooks'
import { ZERO_ADDRESS } from '../../constants/index' // HT的地址，是零地址

const ChartWrapper = styled.div``
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
interface ResolutionButtonProps {
  children: any
  active: boolean
  setActive: () => void
}
const ResolutionButton = ({ children, active, setActive }: ResolutionButtonProps) => {
  let wapperStyle = active ? 'active' : ''
  return (
    <li>
      <ResolutionButtonInner className={wapperStyle} onClick={setActive}>
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


const Resolutions = () => {
  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)

  return (
    <ResolutionsWrapper>
      <ResolutionButton
        active={timeWindow === timeframeOptions.DAY}
        setActive={() => setTimeWindow(timeframeOptions.DAY)}
      >
        1D
      </ResolutionButton>
      <ResolutionButton
        active={timeWindow === timeframeOptions.WEEK}
        setActive={() => setTimeWindow(timeframeOptions.WEEK)}
      >
        1W
      </ResolutionButton>
      <ResolutionButton
        active={timeWindow === timeframeOptions.ALL_TIME}
        setActive={() => setTimeWindow(timeframeOptions.ALL_TIME)}
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
interface DefaultToken {
  decimals: number
  name: string
  symbol: string
}

const defaultTokens = [
  {
    decimals: 18,
    name: 'HT',
    symbol: 'HT'
  },
  {
    decimals: 18,
    name: 'HUSD',
    symbol: 'HUSD'
  }
]

const getTokenInfo = (symbol: any = '') => {
  const allTokens = useSelectedListInfo()
  if (symbol === 'HT') {
    return {
      ...Currency.ETHER,
      address: ZERO_ADDRESS
    }
  }
  return allTokens?.current?.tokens?.find(token => token.symbol === symbol)
}

interface ChartPanelProps {
  id: string
  tokenA: Currency | DefaultToken | undefined
  tokenB: Currency | undefined
}
export default function ChartPanel({ id, tokenA = defaultTokens[0], tokenB = defaultTokens[1] }: ChartPanelProps) {
  const currency = tokenA || tokenB || Currency.ETHER
  const theme = useContext(ThemeContext)
  const [tokenAInfo] = useState(getTokenInfo(tokenA?.symbol))
  const [tokenBInfo] = useState(getTokenInfo(tokenB?.symbol))
  console.log('address tokenA:', tokenAInfo?.address)
  console.log('tokenAInfo:', tokenAInfo)
  console.log('tokenBInfo:', tokenBInfo)
  // settings for the window and candle width
  // const [chartFilter, setChartFilter] = useState(CHART_VIEW.PRICE)
  // const [frequency, setFrequency] = useState(DATA_FREQUENCY.HOUR)

  // let address = '0x74600730ae6dd1E8745A996F176b8d2D29257090'
  let chartData = useTokenChartData(tokenAInfo?.address)
  const [timeWindow] = useState(timeframeOptions.WEEK)
  // const prevWindow = usePrevious(timeWindow)

  // hourly and daily price data based on the current time window
  const dataDay = useTokenPriceData(tokenAInfo?.address, timeframeOptions.DAY, 900)
  const dataWeek = useTokenPriceData(tokenAInfo?.address, timeframeOptions.WEEK, 3600)
  const dataAll = useTokenPriceData(tokenAInfo?.address, timeframeOptions.ALL_TIME, 3600)

  let priceData = dataDay
  switch (timeWindow) {
    case timeframeOptions.DAY:
      priceData = dataDay
      break
    case timeframeOptions.WEEK:
      priceData = dataWeek
      break
    case timeframeOptions.ALL_TIME:
      priceData = dataAll
      break
  }
  const { t } = useTranslation()
  console.log('priceData', priceData)
  const below1080 = useMedia('(max-width: 1080px)')
  const below600 = useMedia('(max-width: 600px)')

  // let utcStartTime = getTimeframe(timeWindow)
  // const domain = AxisDomain([(dataMin:any) => (dataMin > utcStartTime ? dataMin : utcStartTime), 'dataMax'])
  const calAspect = below1080 ? 60 / 32 : below600 ? 60 / 42 : 60 / 22
  const color = theme.text6
  const textColor = theme.text4
  // chartData = chartData?.filter((entry) => entry.date >= utcStartTime)

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
        ) : currency ? (
          <CurrencyLogo currency={currency} size={'24px'} />
        ) : null}
        {tokenA && tokenB ? (
          <StyledTokenName className="pair-name-container">
            {tokenA.symbol}:{tokenB.symbol}
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
          <PriceDiff diff={3.744} />
        </PriceBlock>
        <Resolutions />
      </ChartTools>
      <Chart>
        <ResponsiveContainer aspect={calAspect}>
          <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={120}
              tickFormatter={tick => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor }}
              type={'number'}
            />
            <YAxis
              type="number"
              orientation="left"
              tickFormatter={tick => '$' + toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
              tick={{ fill: textColor }}
            />
            <Tooltip
              cursor={true}
              formatter={(val: any) => formattedNum(val, true)}
              labelFormatter={label => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: '10px 14px',
                borderRadius: 10,
                borderColor: color,
                color: 'black'
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Area
              key={'other'}
              dataKey={'priceUSD'}
              stackId="2"
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={t('Price')}
              yAxisId={0}
              stroke={color}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Chart>
    </ChartWrapper>
  )
}
