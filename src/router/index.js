import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
				{
					path: '/coordinates',
					component: () => import(/* webpackChunkName: "coordinates" */ '../components/views/map/coordinates.vue'),
					meta: { title: '坐标数据' }
				},{
                    path:"/introduction",
                    component:()=>import(/*webpackChunkName:"introduction"*/'../components/views/base/inrtoduction.vue'),
                    meta:{title:'简介信息'}
                },{
                    path:"/baseResource",
                    component:()=>import(/*webpackChunkName:"baseResource"*/'../components/views/base/baseResource.vue'),
                    meta:{title:'技术资源'}
                },{
                    path:"/marketDistribution",
                    component:()=>import(/*webpackChunkName:"marketDistribution"*/'../components/views/base/marketDistribution.vue'),
                    meta:{title:'技术资源'}
                },{
                    path:"/priceSummary",
                    component:()=>import(/*webpackChunkName:"priceSummary"*/'../components/views/base/priceSummary.vue'),
                    meta:{title:'技术资源'}
                },{
                    path: '/costInfo',
                    component: () => import(/* webpackChunkName: "costInfo" */ '../components/views/condition/expense/costInfo.vue'),
                    meta: { title: '费用支出数据' }
                },{
                    path: '/costSummary',
                    component: () => import(/* webpackChunkName: "costSummary" */ '../components/views/condition/expense/costSummary.vue'),
                    meta: { title: '费用支出汇总' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
