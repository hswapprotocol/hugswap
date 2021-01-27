// @ts-nocheck

import React, { useContext } from 'react'
import { Area, Bar } from '@ant-design/charts'
import styled, { ThemeContext } from 'styled-components'

const AreaChart: React.FC = () => {
  const theme = useContext(ThemeContext)
  const data = [
    {
      Date: '08:00PM 01-22',
      Price: 4.004
    },
    {
      Date: '09:00PM 01-22',
      Price: 5.2418
    },
    {
      Date: '10:00PM 01-22',
      Price: 5.2418
    },
    {
      Date: '11:00PM 01-22',
      Price: 5.368
    },
    {
      Date: '12:00AM 01-23',
      Price: 5.368
    },
    {
      Date: '01:00AM 01-23',
      Price: 5.3488
    },
    {
      Date: '02:00AM 01-23',
      Price: 5.3488
    },
    {
      Date: '03:00AM 01-23',
      Price: 5.3488
    },
    {
      Date: '04:00AM 01-23',
      Price: 5.3488
    },
    {
      Date: '05:00AM 01-23',
      Price: 5.3488
    },
    {
      Date: '06:00AM 01-23',
      Price: 5.3488
    },
    {
      Date: '07:00AM 01-23',
      Price: 5.4216
    },
    {
      Date: '08:00AM 01-23',
      Price: 5.4216
    },
    {
      Date: '09:00AM 01-23',
      Price: 5.8668
    },
    {
      Date: '10:00AM 01-23',
      Price: 5.2731
    },
    {
      Date: '11:00AM 01-23',
      Price: 5.3428
    },
    {
      Date: '12:00PM 01-23',
      Price: 5.5974
    },
    {
      Date: '01:00PM 01-23',
      Price: 5.4398
    },
    {
      Date: '02:00PM 01-23',
      Price: 5.6266
    },
    {
      Date: '03:00PM 01-23',
      Price: 5.8128
    },
    {
      Date: '04:00PM 01-23',
      Price: 5.9934
    },
    {
      Date: '05:00PM 01-23',
      Price: 5.875
    },
    {
      Date: '06:00PM 01-23',
      Price: 5.7068
    },
    {
      Date: '07:00PM 01-23',
      Price: 5.7068
    },
    {
      Date: '08:00PM 01-23',
      Price: 5.7068
    },
    {
      Date: '09:00PM 01-23',
      Price: 5.3106
    },
    {
      Date: '10:00PM 01-23',
      Price: 5.6483
    },
    {
      Date: '11:00PM 01-23',
      Price: 5.6483
    },
    {
      Date: '12:00AM 01-24',
      Price: 5.6483
    },
    {
      Date: '01:00AM 01-24',
      Price: 5.6483
    },
    {
      Date: '02:00AM 01-24',
      Price: 5.6807
    },
    {
      Date: '03:00AM 01-24',
      Price: 5.6807
    },
    {
      Date: '04:00AM 01-24',
      Price: 5.6983
    },
    {
      Date: '05:00AM 01-24',
      Price: 5.7644
    },
    {
      Date: '06:00AM 01-24',
      Price: 5.7644
    },
    {
      Date: '07:00AM 01-24',
      Price: 5.7644
    },
    {
      Date: '08:00AM 01-24',
      Price: 5.687
    },
    {
      Date: '09:00AM 01-24',
      Price: 5.7188
    },
    {
      Date: '10:00AM 01-24',
      Price: 5.7188
    },
    {
      Date: '11:00AM 01-24',
      Price: 5.7188
    },
    {
      Date: '12:00PM 01-24',
      Price: 5.946
    },
    {
      Date: '01:00PM 01-24',
      Price: 6.0091
    },
    {
      Date: '02:00PM 01-24',
      Price: 5.8743
    },
    {
      Date: '03:00PM 01-24',
      Price: 5.7285
    },
    {
      Date: '04:00PM 01-24',
      Price: 5.6838
    },
    {
      Date: '05:00PM 01-24',
      Price: 5.6602
    },
    {
      Date: '06:00PM 01-24',
      Price: 6.047
    },
    {
      Date: '07:00PM 01-24',
      Price: 5.7751
    },
    {
      Date: '08:00PM 01-24',
      Price: 5.8552
    },
    {
      Date: '09:00PM 01-24',
      Price: 5.7039
    },
    {
      Date: '10:00PM 01-24',
      Price: 5.5428
    },
    {
      Date: '11:00PM 01-24',
      Price: 5.4763
    },
    {
      Date: '12:00AM 01-25',
      Price: 5.6592
    },
    {
      Date: '01:00AM 01-25',
      Price: 5.8371
    },
    {
      Date: '02:00AM 01-25',
      Price: 5.6434
    },
    {
      Date: '03:00AM 01-25',
      Price: 5.6434
    },
    {
      Date: '04:00AM 01-25',
      Price: 5.6434
    },
    {
      Date: '05:00AM 01-25',
      Price: 5.6434
    },
    {
      Date: '06:00AM 01-25',
      Price: 5.7294
    },
    {
      Date: '07:00AM 01-25',
      Price: 5.7294
    },
    {
      Date: '08:00AM 01-25',
      Price: 5.9846
    },
    {
      Date: '09:00AM 01-25',
      Price: 5.9846
    },
    {
      Date: '10:00AM 01-25',
      Price: 6.0652
    },
    {
      Date: '11:00AM 01-25',
      Price: 6.0652
    },
    {
      Date: '12:00PM 01-25',
      Price: 5.9067
    },
    {
      Date: '01:00PM 01-25',
      Price: 5.9067
    },
    {
      Date: '02:00PM 01-25',
      Price: 5.851
    },
    {
      Date: '03:00PM 01-25',
      Price: 5.8024
    },
    {
      Date: '04:00PM 01-25',
      Price: 6.1199
    },
    {
      Date: '05:00PM 01-25',
      Price: 6.0882
    },
    {
      Date: '06:00PM 01-25',
      Price: 5.8818
    },
    {
      Date: '07:00PM 01-25',
      Price: 5.8818
    },
    {
      Date: '08:00PM 01-25',
      Price: 5.8818
    },
    {
      Date: '09:00PM 01-25',
      Price: 5.8818
    },
    {
      Date: '10:00PM 01-25',
      Price: 5.8818
    },
    {
      Date: '11:00PM 01-25',
      Price: 5.8529
    },
    {
      Date: '12:00AM 01-26',
      Price: 5.5999
    },
    {
      Date: '01:00AM 01-26',
      Price: 5.7975
    },
    {
      Date: '02:00AM 01-26',
      Price: 5.7609
    },
    {
      Date: '03:00AM 01-26',
      Price: 5.7609
    },
    {
      Date: '04:00AM 01-26',
      Price: 5.7609
    },
    {
      Date: '05:00AM 01-26',
      Price: 5.6552
    },
    {
      Date: '06:00AM 01-26',
      Price: 5.6552
    },
    {
      Date: '07:00AM 01-26',
      Price: 5.7101
    },
    {
      Date: '08:00AM 01-26',
      Price: 5.9061
    },
    {
      Date: '09:00AM 01-26',
      Price: 5.4914
    },
    {
      Date: '10:00AM 01-26',
      Price: 5.6984
    },
    {
      Date: '11:00AM 01-26',
      Price: 5.4377
    },
    {
      Date: '12:00PM 01-26',
      Price: 5.6411
    },
    {
      Date: '01:00PM 01-26',
      Price: 5.562
    },
    {
      Date: '02:00PM 01-26',
      Price: 5.562
    },
    {
      Date: '03:00PM 01-26',
      Price: 5.4556
    },
    {
      Date: '04:00PM 01-26',
      Price: 5.757
    },
    {
      Date: '05:00PM 01-26',
      Price: 5.6828
    },
    {
      Date: '06:00PM 01-26',
      Price: 5.5252
    },
    {
      Date: '07:00PM 01-26',
      Price: 5.6624
    },
    {
      Date: '08:00PM 01-26',
      Price: 5.7787
    },
    {
      Date: '09:00PM 01-26',
      Price: 5.7787
    },
    {
      Date: '10:00PM 01-26',
      Price: 5.3767
    },
    {
      Date: '11:00PM 01-26',
      Price: 5.4067
    },
    {
      Date: '12:00AM 01-27',
      Price: 5.4307
    },
    {
      Date: '01:00AM 01-27',
      Price: 5.4307
    },
    {
      Date: '02:00AM 01-27',
      Price: 5.609
    },
    {
      Date: '03:00AM 01-27',
      Price: 5.7115
    },
    {
      Date: '04:00AM 01-27',
      Price: 5.7115
    },
    {
      Date: '05:00AM 01-27',
      Price: 5.5697
    },
    {
      Date: '06:00AM 01-27',
      Price: 5.5697
    },
    {
      Date: '07:00AM 01-27',
      Price: 5.5697
    },
    {
      Date: '08:00AM 01-27',
      Price: 5.4476
    },
    {
      Date: '09:00AM 01-27',
      Price: 5.5909
    },
    {
      Date: '10:00AM 01-27',
      Price: 5.6442
    },
    {
      Date: '11:00AM 01-27',
      Price: 5.6442
    },
    {
      Date: '12:00PM 01-27',
      Price: 5.6421
    },
    {
      Date: '01:00PM 01-27',
      Price: 5.6421
    },
    {
      Date: '02:00PM 01-27',
      Price: 5.64
    },
    {
      Date: '03:00PM 01-27',
      Price: 5.64
    },
    {
      Date: '04:00PM 01-27',
      Price: 5.64
    },
    {
      Date: '05:00PM 01-27',
      Price: 5.64
    },
    {
      Date: '06:00PM 01-27',
      Price: 5.64
    },
    {
      Date: '07:00PM 01-27',
      Price: 5.64
    }
  ]
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
          border: `1px solid red`,
          borderRadius: '4px'
        }
      },
      // @ts-ignore
      customContent: name => {
        return <h5>{name}</h5>
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
    }
    // onReady: $plot => {
    //   console.log('ready')
    //   plot = $plot
    //   // plot.chart.on('plot:mousemove', () => {})
    //   plot.chart.on('beforedestroy', evt => {
    //     console.log('beforedestroy')
    //     plot.chart.off('plot:mousemove', HoverHandle)
    //   })
    // }
  }
  return <Area key={1} {...config}></Area>
}
export default AreaChart
