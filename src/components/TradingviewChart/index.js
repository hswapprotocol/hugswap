import React, { useState, useEffect, useRef, useContext } from 'react'
import { createChart } from 'lightweight-charts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { formattedNum } from '../../utils'
import styled, { ThemeContext } from 'styled-components'
import { usePrevious } from 'react-use'
import { useDarkModeManager } from '../../state/user/hooks'

dayjs.extend(utc)

export const CHART_TYPES = {
  BAR: 'BAR',
  AREA: 'AREA',
}

const Wrapper = styled.div`
  position: relative;
  color: ${({ theme }) => theme.text3}
`

// constant height for charts
const HEIGHT = 300

const TradingViewChart = ({
  type = CHART_TYPES.BAR,
  data,
  base,
  baseChange,
  field,
  toolTipSelector,
  width,
  useWeekly = false,
}) => {
  // reference for DOM element to create with chart
  const ref = useRef()
  const theme = useContext(ThemeContext)

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false)
  const [seriesCreated, setSeriesCreated] = useState(false)
  const [diffSeriesCreated, setDiffSeriesCreated] = useState(false)
  const dataPrev = usePrevious(data)

  console.log('chart got', data)
  useEffect(() => {
    if (data !== dataPrev && chartCreated && type === CHART_TYPES.BAR) {
      // remove the tooltip element
      let toolTip = document.querySelector(toolTipSelector)
      if (toolTip) {toolTip.innerHTML = ''}
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, data, dataPrev, type])

  // parese the data and format for tardingview consumption
  const formattedData = data?.map((entry) => {
    return {
      time: dayjs.unix(entry.date).utc().format('YYYY-MM-DD'),
      value: parseFloat(entry[field]),
    }
  })
  let diffData
  if (formattedData) {
    diffData = formattedData.map((item, i, a) => {
      let diff = 0;
      if (i > 0) {
        diff = ((item.value - a[i-1].value) / a[i-1].value) * 100
      }
      return {
        time: item.time,
        value: diff
      }
    })
  }

  // adjust the scale based on the type of chart
  const topScale = type === CHART_TYPES.AREA ? 0.32 : 0.2

  const [darkMode] = useDarkModeManager()
  const titleColor = theme.text2
  const textColor = theme.text4
  const previousTheme = usePrevious(darkMode)

  // reset the chart if them switches
  useEffect(() => {
    if (chartCreated && previousTheme !== darkMode) {
      // remove the tooltip element
      let toolTip = document.querySelector(toolTipSelector)
      if (toolTip) {toolTip.innerHTML = ''}
      chartCreated.resize(0, 0)
      setChartCreated()
    }
  }, [chartCreated, darkMode, previousTheme, type])

  // if no chart created yet, create one with options and add to DOM manually
  let chart
  let series
  let diffSeries
  useEffect(() => {
    if (!chartCreated && formattedData) {
      chart = createChart(ref.current, {
        width: width,
        height: HEIGHT,
        layout: {
          backgroundColor: 'transparent',
          textColor: textColor,
        },
        rightPriceScale: {
          scaleMargins: {
            top: topScale,
            bottom: 0,
          },
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
        },
        grid: {
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false,
          },
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
            visible: false,
          },
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: 'rgba(32, 38, 46, 0.1)',
            labelVisible: false,
          },
        },
        localization: {
          priceFormatter: (val) => formattedNum(val, true),
        },
      })

      series =
        (type === CHART_TYPES.BAR
          ? chart.addHistogramSeries({
              color: '#BA40F3',
              priceFormat: {
                type: 'volume',
              },
              scaleMargins: {
                top: 0.32,
                bottom: 0,
              },
              lineColor: '#BA40F3',
              lineWidth: 3,
            })
          : chart.addAreaSeries({
              topColor: '#BA40F3',
              bottomColor: 'rgba(186, 64, 243, 0.17)',
              lineColor: '#BA40F3',
              lineWidth: 1,
              scaleMargins: {
                top: 0.2,
                bottom: 0.1,
              },
            })
        )

      series.setData(formattedData)
      
      diffSeries = chart.addLineSeries({
        visible: false,
        priceScaleId: 'left'
      })

      diffSeries.setData(diffData)

      var toolTip = document.querySelector(toolTipSelector)

      // format numbers
      let percentChange = baseChange?.toFixed(2)
      let formattedPercentChange = percentChange ? (percentChange > 0 ? '+' : '-') + percentChange + '%' : ''
      let color = percentChange >= 0 ? theme.text8 : theme.text9

      // get the title of the chart
      function setLastBarText() {
        toolTip.innerHTML =
          `<div style="font-size: 2.25rem; font-weight: bloder; color:${titleColor}" >` +
            formattedNum(base ?? 0, true)  +
          '</div>'+ 
          (baseChange !== 0 ?
            `<div style="margin-left: 10px; font-size: 16px; color: ${color};">${formattedPercentChange}</div>`
            : ''
          )
      }
      setLastBarText()

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function (param) {
        if (
          param === undefined ||
          param.time === undefined ||
          param.point.x < 0 ||
          param.point.x > width ||
          param.point.y < 0 ||
          param.point.y > HEIGHT
        ) {
          setLastBarText()
        } else {
          let dateStr = useWeekly
            ? dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
                .startOf('week')
                .format('MMMM D, YYYY') +
              '-' +
              dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day)
                .endOf('week')
                .format('MMMM D, YYYY')
            : dayjs(param.time.year + '-' + param.time.month + '-' + param.time.day).format('MMMM D, YYYY')
          var price = param.seriesPrices.get(series)
          var diff = param.seriesPrices.get(diffSeries)

          let formattedPercentChangeNow = diff ? (diff > 0 ? '+' : '') + diff + '%' : ''
          let colorNow = diff >= 0 ? theme.text8 : theme.text9

          toolTip.innerHTML =
            `<div style="font-size: 2.25rem; font-weight: bloder; color:${titleColor}">` +
            formattedNum(price, true) +
            '</div>' +
            (diff !== 0 ?
              `<div style="margin-left: 10px; font-size: 16px; color: ${colorNow};">${formattedPercentChangeNow}</div>`
              : ''
            )
        }
      })

      chart.timeScale().fitContent()

      setChartCreated(chart)
      setSeriesCreated(series)
      setDiffSeriesCreated(diffSeries)
    }
  }, [
    base,
    baseChange,
    chartCreated,
    darkMode,
    data,
    formattedData,
    diffData,
    textColor,
    toolTipSelector,
    topScale,
    type,
    useWeekly,
    width,
  ])

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, HEIGHT)
      chartCreated && chartCreated.timeScale().scrollToPosition(0)
    }
  }, [chartCreated, width])
  // data change
  useEffect(() => {
    if (chartCreated && data !== dataPrev && formattedData) {
      seriesCreated?.setData(formattedData)
      diffSeriesCreated?.setData(diffData)
      chartCreated.timeScale().fitContent()
    }
  }, [chartCreated, data, dataPrev, formattedData, diffData, seriesCreated, diffSeriesCreated])

  return (
    <Wrapper>
      <div ref={ref} id={'test-id' + type} />
    </Wrapper>
  )
}

export default TradingViewChart
