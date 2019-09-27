<template>
  <div class="hello">
    <query-renderer :cubejs-api="cubejsApi" :query="query">
      <template v-slot="{ measures, resultSet, loading }">
        <highcharts :options="lineChart(resultSet)"></highcharts>
        <highcharts :options="stackChart(resultSet)"></highcharts>
      </template>
    </query-renderer>
  </div>
</template>

<script>
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/vue';
import Vue from 'vue';
import HighchartsVue from 'highcharts-vue'

Vue.use(HighchartsVue);
const cubejsApi = cubejs(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Njc3MTMwOTEsImV4cCI6MTU3MDMwNTA5MX0.PhmALpeO2m_yhInQ_TdlJa5Siimy9-LfOdzm2NL-Fl8', 
  { apiUrl: 'http://localhost:4000/cubejs-api/v1' }
);

export default {
  name: 'HelloWorld',
  components: {
    QueryRenderer,
  },
  props: {
    msg: String,
  },
  data() {
    const query={
      dimensions: ["ResponseAnswers.value"], 
      timeDimensions: [{
        dimension: "ResponseAnswers.createdAt", 
        granularity: "month",
        dateRange: "This year"
      }],
      filters: [{
        dimension: "Responses.surveyableId",
        operator: "equals",
        values: ["393"]
      }],
      measures: ["ResponseAnswers.total"]
    };

    return {
      cubejsApi,
      query,
    };
  },
  methods: {
    stackChart(resultSet){
      const seriesNames = resultSet.seriesNames();
      const pivot = resultSet.chartPivot();

      var good = [];
      var bad = [];

      pivot.map((p) => {
        good.push(p[seriesNames[2].key] + p[seriesNames[10].key]);
        bad.push(p[seriesNames[0].key] + p[seriesNames[1].key] + 
                 p[seriesNames[3].key] + p[seriesNames[4].key] + 
                 p[seriesNames[5].key] + p[seriesNames[6].key] + 
                 p[seriesNames[7].key]);
      });

      return {
        chart: {
          type: 'column'
        },
        title: {
          style: {
            fontSize: '30px'
          },
          text: 'Monthly NPS Weigth'
        },
        subtitle: {
          style: {
            fontSize: '15px'
          },
          text: 'Source: Trustvox Surveyl Database'
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          labels: {
            style: {
              color: '#000000',
              fontSize: '20px'
            }
          }
        },
        yAxis: {
          min: 0,
          labels: {
            style: {
              fontSize: '20px',
              color: '#000000'
            },
          },
          title: {
            style: {
              fontSize: '20px',
              color: '#000000'
            },
            text: 'Total weigths'
          }
        },
        legend: {
          align: 'right',
          x: -30,
          verticalAlign: 'top',
          y: 25,
          floating: true,
          backgroundColor: 'white',
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: false
        },
        tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [
          {
            name: 'Promoters',
            data: good
          }, 
          {
            name: 'Detractors',
            data: bad
          }
        ]
      }
    },
    lineChart(resultSet){
      const seriesNames = resultSet.seriesNames();
      const pivot = resultSet.chartPivot();
      const seriesData = [];

      pivot.map((p) => {
        const nps = Math.floor((p[seriesNames[2].key] + p[seriesNames[10].key] - (
                                p[seriesNames[0].key] + p[seriesNames[1].key] + 
                                p[seriesNames[3].key] + p[seriesNames[4].key] + 
                                p[seriesNames[5].key] + p[seriesNames[6].key] + 
                                p[seriesNames[7].key]))/100);
        seriesData.push(nps);
      });
      
      return {
        chart: {
            type: 'line'
        },
        title: {
          style: {
            fontSize: '30px'
          },
          text: 'Monthly NPS Store'
        },
        subtitle: {
          style: {
            fontSize: '15px'
          },
          text: 'Source: Trustvox Surveyl Database'
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          labels: {
            style: {
              color: '#000000',
              fontSize: '20px'
            }
          }
        },
        yAxis: {
          title: {
            style: {
              fontSize: '20px',
              color: '#000000'
            },
            text: 'NPS Score'
          },
          labels: {
            style: {
              color: '#000000',
              fontSize: '20px'
            }
          },
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: false,
          },
          series: {
            dataLabels: {
              style: {
                fontSize: '20px'
              }
            }
          }
        },
        series: [{
          name: 'Centauro',
          data: seriesData,
        }]
      }
    }
  }
};
</script>
