<template>
    <div>
        <div id="main_costSummary" style="height:250px; width: 560px;"></div>
    </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
    name:'eCostSummary',
    created() {
        this.initCharts();
    },
    methods: {       
        initCharts(){
            axios.get("/costSummary.json").then(res=>{
                //通过ID属性获取DOM对象，并初始化为echarts对象
                let myCharts = echarts.init(document.getElementById('main_costSummary'));
                //构建图表数据
                let mydata = res.data;
                //配置图表参数
                let option = {
                    title: {
                        text: '费用支出',
                        subtext: '数据汇总',
                        left: 'center',
                    },
                    tooltip: {
                        trigger: 'item',
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                    },
                    series: [
                        {
                            name: '支出占比',
                            type: 'pie',
                            radius: '50%',
                            data: mydata,
                            label:{
                                show:true,
                                formatter:"{b}:({d}%)"
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                },
                            },
                        },
                    ],
                };
                myCharts.setOption(option);
            });
        }
    },
}
</script>