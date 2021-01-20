// ChartPanel
import { Currency, Pair } from '@src/sdk'
// import React, { useState, useEffect, useRef }  from 'react'
import React, { useState, useContext } from 'react'
import { useMedia } from 'react-use'
import styled, { ThemeContext } from 'styled-components'
import { timeframeOptions } from '../../constants'
// import { useDarkModeManager } from '../../state/user/hooks'
import CurrencyLogo from '../../components/CurrencyLogo'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useTokenChartData, useTokenPriceData } from '../../contexts/TokenData'
import { XAxis, YAxis, Area, ResponsiveContainer, Tooltip, AreaChart } from 'recharts'
import { toK, toNiceDate, toNiceDateYear, formattedNum } from '../../utils'

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
const PriceDiff = ({ diff }: PriceDiffProps) => {
  let wapperStyle = diff == 0 ? '' : diff > 0 ? 'up' : 'down'
  return (
    <PriceDiffWrapper className={wapperStyle}>
      {diff == 0 ? '' : diff > 0 ? '+' : '-'}
      {diff}%
    </PriceDiffWrapper>
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

interface ResolutionButtonProps {
  children: any
  active: boolean
  setActive: () => void
}
const ResolutionButton = ({ children, active, setActive }: ResolutionButtonProps) => {
  let wapperStyle = active ? 'active' : ''
  return (
    <ResolutionButtonInner className={wapperStyle} onClick={setActive}>
      {children}
    </ResolutionButtonInner>
  )
}
const ResolutionButtonInner = styled.a`
  .active {
    color: red;
  }
`
const ResolutionsWrapper = styled.div``

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

interface ChartPanelProps {
  id: string
  pair?: Pair | null
  currency?: Currency | null
  otherCurrency?: Currency | null
}
export default function ChartPanel({ id, pair, currency, otherCurrency }: ChartPanelProps) {
  currency = Currency.ETHER
  const theme = useContext(ThemeContext)
  // settings for the window and candle width
  // const [chartFilter, setChartFilter] = useState(CHART_VIEW.PRICE)
  // const [frequency, setFrequency] = useState(DATA_FREQUENCY.HOUR)

  // const [darkMode] = useDarkModeManager()
  // const textColor = darkMode ? 'white' : 'black'
  let address = '0x74600730ae6dd1E8745A996F176b8d2D29257090'
  let chartData = useTokenChartData(address)
  const [timeWindow] = useState(timeframeOptions.WEEK)
  // const prevWindow = usePrevious(timeWindow)

  // hourly and daily price data based on the current time window
  const dataDay = useTokenPriceData(address, timeframeOptions.DAY, 900)
  const dataWeek = useTokenPriceData(address, timeframeOptions.WEEK, 3600)
  const dataAll = useTokenPriceData(address, timeframeOptions.ALL_TIME, 3600)

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
  console.log({ priceData })
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
              name={'Price'}
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
