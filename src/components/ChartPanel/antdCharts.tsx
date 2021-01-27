// @ts-nocheck

import React, { useContext, useState, useEffect } from 'react'
import { Area, Bar } from '@ant-design/charts'
import { useTranslation } from 'react-i18next'
// import { Area } from '@ant-design/charts/index.charts'
import { Currency, TokenAmount, Pair, Token } from '@src/sdk'
import dayjs from 'dayjs'
import styled, { ThemeContext } from 'styled-components'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { timeframeOptions } from '../../constants'
import { Field } from '../../state/swap/actions'
import { useHourlyRateData } from '../../contexts/PairData'
import { useTokenBySymbol } from '../../hooks/Tokens'
import { ReactComponent as ChartLoadingBase } from '../../assets/images/chart-loading.svg'
import { ReactComponent as ChartEmpty } from '../../assets/images/chart-empty.svg'

const ChartWrapper = styled.div`
  width: 100%;
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

const TokenBSpan = styled.span`
  color: ${({ theme }) => theme.text3};
`
// 只用于画图， HT 地址返回 WHT 地址，用于获取价格
const getChartTokenInfo = (currency: Currency | undefined) => {
  let symbol = currency?.symbol
  if (symbol === 'HT') {
    symbol = 'WHT'
  }
  return useTokenBySymbol(symbol)
}
const AreaChart: React.FC = () => {
  const { t } = useTranslation()
  const { currencies } = useDerivedSwapInfo()
  let tokenA,
    tokenB,
    tokenAInfo,
    tokenBInfo,
    pairInfo,
    PairData,
    data = [],
    lastPrice
  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)
  const [loadchart, setLoadchart] = useState(true)
  const [emptychart, setEmptyChart] = useState(false)
  const [showPrice, setShowPrice] = useState('-')
  const [showDiff, setShowDiff] = useState(0)
  const theme = useContext(ThemeContext)

  const getPrev24Price = (mDate: string) => {
    let index = data.findIndex((info: Info) => info.Date === mDate) - 1
    let price: number = data[index + 1]?.Price ?? 0
    while (index >= 0) {
      if (data[index].Date.split(' ')[1] !== mDate.split(' ')[1]) {
        price = data[index].Price
        break
      }
      index--
    }
    return price
  }
  const getDiff = (info: Info) => {
    const price24 = getPrev24Price(info.Date)
    const myPrice = info.Price
    return Number((((myPrice - price24) / price24) * 100).toFixed(2))
  }
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
  pairInfo = new Pair(new TokenAmount(tokenAInfo as Token, '0'), new TokenAmount(tokenBInfo as Token, '0'))
  //   }, [currencies])

  //   useEffect(() => {
  if (pairInfo && timeWindow) PairData = useHourlyRateData(pairInfo.liquidityToken.address, timeWindow)
  //   }, [pairInfo, timeWindow])

  //   useEffect(() => {
  if (PairData && PairData[0]) {
    data = PairData[0]
      .map((info: PairInfo) => {
        const Date = dayjs(Number(info.timestamp) * 1000).format('hh:mmA MM-DD')
        const Price = Number(info.close < 0.0001 ? info.close.toFixed(8) : info.close.toFixed(4))
        return { Date, Price }
      })
      .filter((info: Info) => !!info.Price)

    lastPrice = data.length > 0 ? data[data.length - 1].Price : undefined
    if (lastPrice && lastPrice !== showPrice) {
      setShowPrice(lastPrice)
      setShowDiff(getDiff(data[data.length - 1]))
      setLoadchart(false)
    }
  }
  //   }, [PairData])
  let plot
  const HoverHandle = evt => {
    const { x, y } = evt
    const data = plot.chart.getTooltipItems({ x, y })
    setShowPrice(data[0].data.Price)
    setShowDiff(getDiff(data[0].data))
  }
  var config = {
    data: data,
    xField: 'Date',
    yField: 'Price',
    smooth: true,
    nice: true,

    xAxis: {
      tickCount: 6,
      line: {
        style: {
          stroke: theme.bg6,
          lineWidth: 1
        }
      },
      style: {}
    },
    yAxis: {
      line: {
        style: {
          stroke: theme.bg6,
          lineWidth: 1
        }
      },
      grid: null
    },
    areaStyle: {
      fill: `l(90) 0.349:rgba(45, 197, 188, 0.19) 1:rgba(244, 255, 254, 0)`,
      fillOpacity: 0.84
    },
    color: theme.text6,
    line: {
      color: theme.text6,
      size: 1
    },
    subTickLine: {
      stroke: theme.text6,
      lineWidth: 1
    },
    meta: {
      Date: {
        range: [0, 1]
      }
    },
    // customContent: (data: { name: any }) => data.name,
    tooltip: {
      // tips框
      domStyles: {
        'g2-tooltip': {
          boxShadow: '0px 4px 16px 4px rgba(0, 0, 0, 0.12)',
          border: `1px solid ${theme.text6}`,
          borderRadius: '4px'
        }
      },
      // @ts-ignore
      customContent: name => {
        return (
          <>
            <h5>{name}</h5>
          </>
        )
      },
      //   itemTpl: '',
      //   fields: ['xAxis'],
      //   formatter: () => {},
      // 竖线
      crosshairs: {
        line: {
          style: {
            stroke: theme.text6,
            lineWidth: 2,
            opacity: 0.5
          }
        }
      },
      // 圆圈
      marker: {
        fill: theme.text6,
        r: 6
      }
    },
    onReady: $plot => {
      console.log('ready')
      plot = $plot
      plot.chart.on('plot:mousemove', HoverHandle)
      plot.chart.on('beforedestroy', evt => {
        console.log('beforedestroy')
        plot.chart.off('plot:mousemove', HoverHandle)
      })
    }
  }
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
      {loadchart && <ChartLoading />}
      {emptychart && (
        <ChartEmptyWrap>
          <ChartEmpty />
          <div>{t('No data')}</div>
        </ChartEmptyWrap>
      )}
      {loadchart || emptychart || <Area {...config}></Area>}
    </ChartWrapper>
  )
}
export default AreaChart
