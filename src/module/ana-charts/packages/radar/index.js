/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Base from '../base'
import { checkKeyInModel, init } from '../../common'

const TYPE = 'radar'

/**
 * Radar chart
 */
export default class Radar extends Base {
  /**
   * Initialization method called on separate export
   * @param {*} el Selector or DOM object
   * @param {*} data data source
   * @param {*} options Optional
   */
  static init(el, data, options) {
    return init(Radar, el, data, options)
  }

  /**
   * Convert user configuration to a configuration format that conforms to the format of echarts API
   */
  transform() {
    const {
      // data
      data = [],
      // Chart title
      title = 'Radar chart',
      // Attribute dictionary
      keyMap = {
        textKey: 'key',
        legendKey: 'typeName',
        dataKey: 'value',
      },
    } = this.settings

    if (data.length === 0) {
      throw new Error('Data source is empty!')
    }

    // Attribute name corresponding to text, attribute name corresponding to legend, attribute name corresponding to data value
    const { textKey, legendKey, dataKey } = keyMap
    checkKeyInModel(data[0], textKey, legendKey, dataKey)

    const legendData = []
    const seriesData = []
    const indicator = []

    // Set legend and initialize data series
    for (let i = 0; i < data.length; i++) {
      const legendItem = data[i][legendKey]
      const textItem = data[i][textKey]
      const dataItem = data[i][dataKey]

      // Legend
      if (!legendData.includes(legendItem)) {
        legendData.push(legendItem)
      }

      // series
      let targetSeries = seriesData.find((s) => s.name === legendItem)
      if (!targetSeries) {
        targetSeries = {
          name: legendItem,
          value: [],
          _raw: [],
        }
        seriesData.push(targetSeries)
      }
      targetSeries.value.push(dataItem)
      targetSeries._raw.push(data[i])

      // index
      const targetIndicator = indicator.find((i) => i.name === textItem)
      if (!targetIndicator) {
        indicator.push({ name: textItem })
      }
    }

    return { title, seriesData, legendData, indicator }
  }

  /**
   * Drawing charts
   */
  apply() {
    const { title, seriesData, legendData = [], indicator } = this.options
    this.echart.setOption(
      {
        title: {
          text: title,
        },
        tooltip: {},
        legend: {
          data: legendData,
        },
        radar: {
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5],
            },
          },
          indicator,
        },
        series: [
          {
            type: TYPE,
            data: seriesData,
          },
        ],
      },
      true
    )
  }
}
