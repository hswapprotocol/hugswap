import React, { useContext, useState } from 'react'
import { Area } from '@ant-design/charts'
import { Currency } from '@src/sdk'
import styled, { ThemeContext } from 'styled-components'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useDerivedSwapInfo } from '../../state/swap/hooks'
import { timeframeOptions } from '../../constants'
import { Field } from '../../state/swap/actions'
// import { useTokenBySymbol } from '../../hooks/Tokens'

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

const TokenBSpan = styled.span`
  color: ${({ theme }) => theme.text3};
`

// // 只用于画图， HT 地址返回 WHT 地址，用于获取价格
// const getChartTokenInfo = (currency: Currency | undefined) => {
//   let symbol = currency?.symbol
//   if (symbol === 'HT') {
//     symbol = 'WHT'
//   }
//   return useTokenBySymbol(symbol)
// }

const DemoArea: React.FC = () => {
  const { currencies } = useDerivedSwapInfo()
  // @ts-ignore
  let tokenA = currencies[Field.INPUT],
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
  //   const tokenAInfo = getChartTokenInfo(tokenA)
  //   const tokenBInfo = getChartTokenInfo(tokenB)
  //   console.log('tokenAInfo', tokenAInfo, tokenBInfo)
  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK)
  const theme = useContext(ThemeContext)
  const data = [
    {
      Date: '2010-01',
      Price: 1998
    },
    {
      Date: '2010-02',
      Price: 1850
    },
    {
      Date: '2010-03',
      Price: 1720
    },
    {
      Date: '2010-04',
      Price: 1818
    },
    {
      Date: '2010-05',
      Price: 1920
    },
    {
      Date: '2010-06',
      Price: 1802
    },
    {
      Date: '2010-07',
      Price: 1945
    },
    {
      Date: '2010-08',
      Price: 1856
    },
    {
      Date: '2010-09',
      Price: 2107
    },
    {
      Date: '2010-10',
      Price: 2140
    },
    {
      Date: '2010-11',
      Price: 2311
    },
    {
      Date: '2010-12',
      Price: 1972
    },
    {
      Date: '2011-01',
      Price: 1760
    },
    {
      Date: '2011-02',
      Price: 1824
    },
    {
      Date: '2011-03',
      Price: 1801
    },
    {
      Date: '2011-04',
      Price: 2001
    },
    {
      Date: '2011-05',
      Price: 1640
    },
    {
      Date: '2011-06',
      Price: 1502
    },
    {
      Date: '2011-07',
      Price: 1621
    },
    {
      Date: '2011-08',
      Price: 1480
    },
    {
      Date: '2011-09',
      Price: 1549
    },
    {
      Date: '2011-10',
      Price: 1390
    },
    {
      Date: '2011-11',
      Price: 1325
    },
    {
      Date: '2011-12',
      Price: 1250
    },
    {
      Date: '2012-01',
      Price: 1394
    },
    {
      Date: '2012-02',
      Price: 1406
    },
    {
      Date: '2012-03',
      Price: 1578
    },
    {
      Date: '2012-04',
      Price: 1465
    },
    {
      Date: '2012-05',
      Price: 1689
    },
    {
      Date: '2012-06',
      Price: 1755
    },
    {
      Date: '2012-07',
      Price: 1495
    },
    {
      Date: '2012-08',
      Price: 1508
    },
    {
      Date: '2012-09',
      Price: 1433
    },
    {
      Date: '2012-10',
      Price: 1344
    },
    {
      Date: '2012-11',
      Price: 1201
    },
    {
      Date: '2012-12',
      Price: 1065
    },
    {
      Date: '2013-01',
      Price: 1255
    },
    {
      Date: '2013-02',
      Price: 1429
    },
    {
      Date: '2013-03',
      Price: 1398
    },
    {
      Date: '2013-04',
      Price: 1678
    },
    {
      Date: '2013-05',
      Price: 1524
    },
    {
      Date: '2013-06',
      Price: 1688
    },
    {
      Date: '2013-07',
      Price: 1500
    },
    {
      Date: '2013-08',
      Price: 1670
    },
    {
      Date: '2013-09',
      Price: 1734
    },
    {
      Date: '2013-10',
      Price: 1699
    },
    {
      Date: '2013-11',
      Price: 1508
    },
    {
      Date: '2013-12',
      Price: 1680
    },
    {
      Date: '2014-01',
      Price: 1750
    },
    {
      Date: '2014-02',
      Price: 1602
    },
    {
      Date: '2014-03',
      Price: 1834
    },
    {
      Date: '2014-04',
      Price: 1722
    },
    {
      Date: '2014-05',
      Price: 1430
    },
    {
      Date: '2014-06',
      Price: 1280
    },
    {
      Date: '2014-07',
      Price: 1367
    },
    {
      Date: '2014-08',
      Price: 1155
    },
    {
      Date: '2014-09',
      Price: 1289
    },
    {
      Date: '2014-10',
      Price: 1104
    },
    {
      Date: '2014-11',
      Price: 1246
    },
    {
      Date: '2014-12',
      Price: 1098
    },
    {
      Date: '2015-01',
      Price: 1189
    },
    {
      Date: '2015-02',
      Price: 1276
    },
    {
      Date: '2015-03',
      Price: 1033
    },
    {
      Date: '2015-04',
      Price: 956
    },
    {
      Date: '2015-05',
      Price: 845
    },
    {
      Date: '2015-06',
      Price: 1089
    },
    {
      Date: '2015-07',
      Price: 944
    },
    {
      Date: '2015-08',
      Price: 1043
    },
    {
      Date: '2015-09',
      Price: 893
    },
    {
      Date: '2015-10',
      Price: 840
    },
    {
      Date: '2015-11',
      Price: 934
    },
    {
      Date: '2015-12',
      Price: 810
    },
    {
      Date: '2016-01',
      Price: 782
    },
    {
      Date: '2016-02',
      Price: 1089
    },
    {
      Date: '2016-03',
      Price: 745
    },
    {
      Date: '2016-04',
      Price: 680
    },
    {
      Date: '2016-05',
      Price: 802
    },
    {
      Date: '2016-06',
      Price: 697
    },
    {
      Date: '2016-07',
      Price: 583
    },
    {
      Date: '2016-08',
      Price: 456
    },
    {
      Date: '2016-09',
      Price: 524
    },
    {
      Date: '2016-10',
      Price: 398
    },
    {
      Date: '2016-11',
      Price: 278
    },
    {
      Date: '2016-12',
      Price: 195
    },
    {
      Date: '2017-01',
      Price: 145
    },
    {
      Date: '2017-02',
      Price: 207
    }
  ]
  //   const [data, setData] = useState(json)
  //   useEffect(() => {
  //     asyncFetch()
  //   }, [])
  //   const asyncFetch = () => {
  //     fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
  //       .then(response => response.json())
  //       .then(json => setData(json))
  //       .catch(error => {
  //         console.log('fetch data failed', error)
  //       })
  //   }
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
      }
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
    tooltip: {
      // tips框
      domStyles: {
        'g2-tooltip': {
          boxShadow: 'none',

          border: `1px solid ${theme.text6}`
        }
      },
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
    }
  }
  return (
    <ChartWrapper>
      <ChartName>
        <DoubleCurrencyLogo currency0={tokenA} currency1={tokenB} size={24} margin={false} />
        <StyledTokenName className="token-symbol-container" active={Boolean(tokenA && tokenA.symbol)}>
          {tokenA?.symbol} / <TokenBSpan>{tokenB?.symbol}</TokenBSpan>
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
      <Area {...config} />
    </ChartWrapper>
  )
}
export default DemoArea
