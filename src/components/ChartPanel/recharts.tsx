// @ts-nocheck
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import React, { PureComponent, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// import { Area } from '@ant-design/charts/index.charts'
import { Currency, TokenAmount, Pair, Token } from '@src/sdk'
import dayjs from 'dayjs'
import styled, { ThemeContext } from 'styled-components'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import TradingViewChart, { CHART_TYPES } from '../TradingviewChart'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { timeframeOptions } from '../../constants'
import { Field } from '../../state/swap/actions'
import { useHourlyRateData as getHourlyRateData } from '../../contexts/PairData'
import { useTokenBySymbol } from '../../hooks/Tokens'
import { ReactComponent as ChartLoadingBase } from '../../assets/images/chart-loading.svg'
import { ReactComponent as ChartLoadingBaseBlack } from '../../assets/images/chart-loading-black.svg'
import { ReactComponent as ChartEmpty } from '../../assets/images/chart-empty.svg'
import { useDarkModeManager } from '../../state/user/hooks'

const ChartWrapper = styled.div`
  width: 100%;
`

const ChartBlackLoading = styled(ChartLoadingBaseBlack)`
  width: 100%;
  height: 350px;
  path {
    width: 100%;
  }
`

const ChartLoading = styled(ChartLoadingBase)`
  width: 100%;
  height: 350px;
  path {
    width: 100%;
  }
`

const ChartEmptyWrap = styled.div`
  padding: 50px 0 100px 0;
  display: block;
  text-align: center;
  color: ${({ theme }) => theme.text4};
  border-left: 1px solid ${({ theme }) => theme.bg6};
  border-bottom: 1px solid ${({ theme }) => theme.bg6};
`

const ChartName = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;

  .token-symbol-container,
  .pair-name-container {
    font-size: 18px;
  }
`
const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 8px;' : '  margin: 0 0.25rem 0 0.25rem;')}
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
        {diff > 0 ? '+' : ''}
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
const ChartTooltip = styled.div`
  box-shadow: 0px 4px 16px 4px rgba(0, 0, 0, 0.12);
  border: 0.5px solid ${({ theme }) => theme.text6};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text2};
  padding: 10px 16px;
  font-size: 12px;
`

interface ResolutionBottonProps {
  children: any | undefined
  isActive: boolean
  setActiveFn: () => void
}
interface PairInfo {
  timestamp: string
  close: number
  open: number
}
interface Info {
  Date: string
  Price: number
}
const ResolutionButtonInner = styled.a`
  color: ${({ theme }) => theme.text4};
  cursor: pointer;

  &.active {
    cursor: default;
    color: ${({ theme }) => theme.text6};
  }
`
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
const TokenBSpan = styled.span`
  color: ${({ theme }) => theme.text3};
`
const getSymbol = symbol => {
  const $symbol = symbol?.toUpperCase()
  if ($symbol === 'WHT' || $symbol === 'HT') {
    return 'WHT'
  } else {
    return symbol
  }
}
// 只用于画图， HT 地址返回 WHT 地址，用于获取价格
const getChartTokenInfo = (currency: Currency | undefined) => {
  let symbol = getSymbol(currency?.symbol)
  return useTokenBySymbol(symbol)
}

const checkAreaConfig = (prevArea: any, nextArea: any): boolean => {
  console.log('checkAreaConfig')
  console.log(!!prevArea, JSON.stringify(prevArea.data) === JSON.stringify(nextArea.data))
  return !!prevArea && JSON.stringify(prevArea.data) === JSON.stringify(nextArea.data)
}

const getPrev24Price = (data = [], mDate: string) => {
  let index = data.findIndex((info: Info) => info.date === mDate) - 1
  let price: number = data[index + 1]?.price ?? 0
  while (index >= 0) {
    if (data[index].date.split(' ')[1] !== mDate.split(' ')[1]) {
      price = data[index].price
      console.log(242, { index, price }, data)
      break
    }
    index--
  }
  if (index < 0 && data[0]) {
    price = data[0].price
  }
  return price
}
const getDiff = (data, info: Info) => {
  const price24 = getPrev24Price(data, info.date)
  const myPrice = info.price
  return Number((((myPrice - price24) / price24) * 100).toFixed(2))
}

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100
  }
]
let theValue
let count = 0
export default () => {
  const { t } = useTranslation()
  const { currencies } = useDerivedSwapInfo()
  const [darkMode] = useDarkModeManager()
  let tokenA,
    tokenB,
    tokenAInfo,
    tokenBInfo,
    pairInfo,
    PairData,
    lastPrice,
    data,
    loadchart = true,
    emptychart = false
  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)
  //   const [loadchart, setLoadchart] = useState(true)
  //   const [emptychart, setEmptyChart] = useState(false)
  let [showPrice, setShowPrice] = useState('-')
  const [showDiff, setShowDiff] = useState(0)
  //   const [data, setData] = useState([])
  const theme = useContext(ThemeContext)

  //   useEffect(() => {
  tokenA = currencies[Field.INPUT]
  tokenB = currencies[Field.OUTPUT]
  if (!tokenA) {
    tokenA = currencies[Field.OUTPUT] || Currency.ETHER
    if (tokenB) {
      tokenB = Currency.USD
    }
  }
  if (!tokenB) {
    tokenB = Currency.USD
  }
  tokenAInfo = getChartTokenInfo(tokenA)
  tokenBInfo = getChartTokenInfo(tokenB)

  //   useEffect(() => {
  if (tokenAInfo && tokenBInfo) {
    if (getSymbol(tokenAInfo.symbol) === getSymbol(tokenBInfo.symbol)) {
      //   console.log('wht - ht')
      //   loadchart = false
      //   emptychart = true
      //   pairInfo = null
      //   PairData = null
      //   data = []
    } else {
    }
  }

  emptychart = false
  try {
    console.log('try: ----')
    pairInfo = new Pair(new TokenAmount(tokenAInfo as Token, '0'), new TokenAmount(tokenBInfo as Token, '0'))
  } catch (error) {
    console.log('catch: ----')
    loadchart = false
    emptychart = true
    pairInfo = null
    PairData = null
    data = []
  }
  // if (pairInfo && timeWindow) {
  PairData = getHourlyRateData(pairInfo?.liquidityToken.address, timeWindow)
  // }
  //   }, [tokenAInfo, tokenBInfo])

  //   useEffect(() => {

  //   }, [pairInfo, timeWindow])

  //   useEffect(() => {
  if (PairData && PairData.Rate0) {
    console.log({ PairData })
    let $data = getSymbol(tokenB.symbol) === getSymbol(PairData.token0?.symbol) ? PairData.Rate0 : PairData.Rate1
    $data = $data
      .map((info: PairInfo) => {
        const date = dayjs(Number(info.timestamp) * 1000).format('HH:mm MM-DD')
        const price = Number(info.close < 0.0001 ? info.close.toFixed(8) : info.close.toFixed(4))
        return { date, price }
      })
      .filter((info: Info) => !!info.price)
    // data !== $data && setData($data)
    data = $data
    lastPrice = $data.length > 0 ? $data[$data.length - 1].price : undefined
    if (lastPrice && lastPrice !== showPrice) {
      setShowPrice(lastPrice)
      setShowDiff(getDiff($data, $data[$data.length - 1]))
    }
    loadchart = false
    emptychart = !lastPrice
  }
  //   }, [PairData, tokenA, tokenB, timeWindow])

  const CustomTooltip = ({ payload, label, active }) => {
    if (active) {
      if (payload && theValue !== payload[0]?.value) {
        theValue = payload[0]?.value
        setShowPrice(theValue)
        setShowDiff(getDiff(data, { date: label, price: payload[0]?.value }))
      }
      return <ChartTooltip>{label}</ChartTooltip>
    }

    return null
  }
  //   console.log('data', data)
  //   console.log(count++)
  console.log({ loadchart, emptychart })
  return (
    <ChartWrapper>
      <ChartName>
        <DoubleCurrencyLogo currency0={tokenA} currency1={tokenB} size={24} margin={false} />
        <StyledTokenName className="token-symbol-container" active={Boolean(tokenA && tokenA.symbol)}>
          {tokenA?.symbol} / <TokenBSpan>{tokenB?.symbol}</TokenBSpan>
        </StyledTokenName>
      </ChartName>
      <ChartTools>
        <PriceBlock id="chart-tooltip">
          <Price>{showPrice}</Price>
          <PriceDiff diff={showDiff} />
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
      {loadchart && (darkMode ? <ChartBlackLoading /> : <ChartLoading />)}
      {emptychart && (
        <ChartEmptyWrap>
          <ChartEmpty />
          <div>{t('No data')}</div>
        </ChartEmptyWrap>
      )}
      {/*loadchart || emptychart || <MemoizedArea {...config}></MemoizedArea>*/}
      {loadchart || emptychart || (
        <AreaChart
          key="AreaChart"
          width={690}
          height={400}
          data={data}
          margin={{
            top: 0,
            right: 0,
            left: -40,
            bottom: 0
          }}
        >
          <defs>
            <linearGradient id="color1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="34.9%" stopColor="rgba(45, 197, 188, 0.19)" stopOpacity={1} />
              <stop offset="100%" stopColor="rgba(244, 255, 254, 0)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            allowDecimals={false}
            tickCount={4}
            tickLine={false}
            stroke={theme.bg2}
            fontSize={12}
            axisLine={{ stroke: theme.bg6 }}
            tick={{ fill: theme.text4 }}
            padding={{
              left: 0,
              right: 0
            }}
          />
          <YAxis
            stroke={theme.bg6}
            tickLine={false}
            fontSize={12}
            axisLine={{ stroke: theme.bg6 }}
            tick={{ fill: theme.text4 }}
          />
          <Tooltip content={CustomTooltip} axisLine={{ stroke: theme.text6 }} />
          <Area
            type="monotone"
            dataKey="price"
            strokeWidth="0.5"
            stroke={theme.text6}
            fillOpacity={0.84}
            fill="url(#color1)"
            axisLine={{ stroke: theme.text6 }}
          />
        </AreaChart>
      )}
    </ChartWrapper>
  )
}
