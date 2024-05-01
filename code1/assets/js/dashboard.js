$(function () {
    var oPie = echarts.init(document.getElementById('pie_show'));
    var oPieopt =
    {
        title: {
            top: 10,
            text: 'top 5 model',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#5885e8', '#13cfd5'],//, '#00ce68', '#ff9565'],
        legend: {
            x: 'center',
            top: 65,
            data: ['buy', 'sell']
        },
        toolbox: {
            show: true,
            x: 'center',
            top: 35,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        series: [
            {
                name: 'buy/sell',
                type: 'pie',
                radius: ['45%', '60%'],
                center: ['50%', '65%'],
                data: [
                    //  { value: 300, name: 'buy' },
                    //  { value: 100, name: 'sell' },

                ]
            }
        ]
    };


    var other = echarts.init(document.getElementById('column_show'), 'default');
    var otherOption = {
        // color: colors,
        title: { text: 'activeUsers(top10)' },
        legend: { data: ['times'] },
        tooltip: {},
        xAxis: [{
            type: 'value', name: 'times', position: 'top', min: 0, max: 20,
            axisLabel: { formatter: '{value}' }
        }],

        yAxis: {
            type: 'category',
            data: [],

            axisLabel: {
                show: true, rotate: 30,
                textStyle: {
                    color: '#999',  
                    fontSize: 12,      

                }
            },
        },
        series: [{ name: 'times', barGap: 0, type: 'bar', data: [], }]
        //@Html.Raw(JsonSerializer.Serialize(ViewData["other.series"]))
    };




    var oChart = echarts.init(document.getElementById('curve_show'));
    var aList_all = [
        //   { 'count': 36, 'date': '2019-04-13' },
        //   { 'count': 52, 'date': '2019-04-14' },

    ];

    // let aCount = [];
    // let aDate = [];

    // for (var i = 0; i < aList_all.length; i++) {
    //     aCount.push(aList_all[i].count);
    //     aDate.push(aList_all[i].date);
    // }

    var chartopt = {
        title: {
            text: 'latesDaySale',
            left: 'center',
            top: '10'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['daySales','dayAmount'],
            top: '50'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        xAxis: [
            {
                name: 'day',
                type: 'category',
                boundaryGap: false,
                data: []//aDate
            }
        ],
        yAxis: [
            {
                name: 'count',
                type: 'value',
                position: 'left'

            },
            {
                name: 'amount',
                type: 'value',
                position: 'right'

            }

        ],
        series: [
            {
                name: 'daySales',
                type: 'line',
                smooth: true,
                itemStyle: { normal: {  color: '#f80' }, lineStyle: { color: '#f80' } },
                data: [],//aCount
                yAxisIndex: 0
            },
            {
                name: 'dayAmount',
                type: 'line',
                smooth: true,
                itemStyle: { normal: { color: '#f10' }, lineStyle: { color: '#f80' } },
                data: [],//aCount
                yAxisIndex: 1
            }

        ],
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(255,136,0,0.39)'
                }, {
                    offset: .34,
                    color: 'rgba(255,180,0,0.25)'
                }, {
                    offset: 1,
                    color: 'rgba(255,222,0,0.00)'
                }])

            }
        },
        grid: {
            show: true,
            x: 50,
            x2: 50,
            y: 80,
            height: 220
        }
    };




    $.ajax({
        method: 'GET',
        url: '/api/dashboard',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('get dashboard  err')
            }
            //{"brief":[{"iUsers":5,"iCarModels":2834,"iSelling":0,"iOrders":2}]}}
            var brief = res.data.brief
            var fields = ['iUsers', 'iRecall', 'iSelling', 'iOrders']
            for (var i = 0; i < fields.length; i++) {
                $(`#${fields[i]}`).html(brief[fields[i]])
            }

            other.setOption(otherOption);

            var logs = res.data.logs
            logs.forEach(item => {
                otherOption.yAxis.data.push(item.username)
                otherOption.series[0].data.push(item.times)
            })
            otherOption.xAxis[0].max = otherOption.series[0].data[0]
            other.setOption(otherOption)

            var models = res.data.models
            models.forEach(item => {
                oPieopt.series[0].data.push({ value: item.iCount, name: item.model })
                //       oPieopt.series[index].data.push({ value: item.iCount, name: 'buy' })
            })


            oPie.setOption(oPieopt);

            // var aList_all = [
            //     { 'count': 36, 'date': '2019-04-13' },
            //     { 'count': 52, 'date': '2019-04-14' },

            //   ];
            var sales = res.data.sales
            sales.forEach(item => {
                chartopt.xAxis[0].data.push(item.sale_date)
                chartopt.series[0].data.push(item.iCount)
                chartopt.series[1].data.push(item.iAmount)
                // aList_all.push({ count: item.iCount, date: item.sale_date })
            })

            oChart.setOption(chartopt);
        }
    });
})