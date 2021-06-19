import Vue from 'vue';
import Router from 'vue-router';
import VueCookies from 'vue-cookies';

import index from '@/views/index';
import log from '@/views/log';
import registered from '@/views/registered';
import phone_log from '@/views/phone_log';
import forget_password from '@/views/forget_password';

//二级路由目录
import home from '@/views/menu/home';
import home_two from '@/views/menu/home_two';
import home_three from '@/views/menu/home_three';
import home_four from '@/views/menu/home_four';
import home_five from '@/views/menu/home_five';
import home_six from '@/views/menu/home_six';
import home_seven from '@/views/menu/home_seven';
import home_eight from '@/views/menu/home_eight';

//用户中心
import information from '@/views/table_of_contents/information.vue';
import overview from '@/views/table_of_contents/overview.vue';

//URL管理
import domain_management from '@/views/domain/domain_management.vue';
import accelerate_management from '@/views/domain/accelerate_management.vue';
import yure_management from '@/views/domain/yure_management.vue';
import batch_management from '@/views/domain/batch_management.vue';
import upload from '@/views/domain/upload.vue';
import simple from '@/views/domain/simple.vue';
import add_url from '@/views/domain/add_url.vue';
import lot_operating from '@/views/domain/lot_operating.vue';
import copy_configuration from '@/views/domain/copy_configuration.vue';
//数据中心
import dosage_query from '@/views/data_center/dosage_query.vue';
import log_download from '@/views/data_center/log_download.vue';
import resources from '@/views/data_center/resources.vue';
import statistics from '@/views/data_center/statistics.vue';
import accelerated_log from '@/views/data_center/accelerated_log.vue';
import node_flow from '@/views/data_center/node_flow.vue';


import word_map from '@/views/distributed/word_map.vue';

//终端管理
import terminal_management from '@/views/terminal/terminal_management.vue';

//订单管理
import order_list from '@/views/order/order_list.vue';
import order_detil from '@/views/order/order_detil.vue';

//订单管理
import traffic_list from '@/views/traffic/traffic_list.vue';
import traffic_detil from '@/views/traffic/traffic_detil.vue';

//商品列表
import commodity_list from '@/views/commodity/commodity_list.vue';
import pre_payment from '@/views/commodity/pre_payment.vue';
import commodity_detil from '@/views/commodity/commodity_detil.vue';
import pay_dosage from '@/views/commodity/pay_dosage.vue';
import change_billing from '@/views/commodity/change_billing.vue';


//资金管理
import money_management from '@/views/money/money_management.vue';
import recharge_management from '@/views/money/recharge_management.vue';
import cost_list from '@/views/money/cost_list.vue';
import bill from '@/views/money/bill.vue';
import bill_deail from '@/views/money/bill_deail.vue';
import upcoming from '@/views/money/upcoming.vue';


//提现
import withdraw_list from "../views/withdraw/withdraw_list.vue"
import withdraw_detil from "../views/withdraw/withdraw_detil.vue"

Vue.use(Router);

const router = new Router({
    routes: [{
            path: '/',
            name: '登录',
            component: log,
            hidden: true,
        },
        {
            path: '/phone_log',
            name: '手机号登录',
            component: phone_log,
            hidden: true,
        },
        {
            path: '/forget_password',
            name: '忘记密码',
            component: forget_password,
            hidden: true,
        },
        {
            path: '/registered',
            name: '注册',
            component: registered,
            hidden: true,
        },
        {
            path: '/overview',
            name: '预览',
            component: index,
            hidden: true,
            icon: 'iconfont icon-shujutongji',
            children: [{
                    path: '/information',
                    name: '账号信息',
                    component: information,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                },
                {
                    path: '/overview',
                    name: '概览',
                    component: overview,
                    icon: 'iconfont icon-dian',
                }, {
                    path: '/commodity_list',
                    name: '流量包商城',
                    component: commodity_list,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                }, {
                    path: '/pre_payment',
                    name: '新用户订单',
                    component: pre_payment,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                }, {
                    path: '/commodity_detil',
                    name: '订单',
                    component: commodity_detil,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                }, {
                    path: '/pay_dosage',
                    name: '按量计费',
                    component: pay_dosage,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                },
                {
                    path: '/change_billing',
                    name: '变更计费方式',
                    component: change_billing,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                }
            ],
        },
        {
            path: '/overview',
            name: '概览',
            component: overview,
            bsgc: true,
            icon: 'iconfont icon-shujutongji',
            meta: {
                title: '概览'
            }
        },
        {
            path: '/home_four',
            name: '分发加速配置',
            component: index,
            icon: 'iconfont icon-jiasu',
            hidden: true,
            children: [{
                    path: '/accelerate_management',
                    name: '域名管理',
                    component: accelerate_management,
                    icon: 'iconfont icon-dian',
                    // hidden: true
                }, {
                    path: '/domain_management',
                    name: '点播加速管理',
                    component: domain_management,
                    icon: 'iconfont icon-dian',
                    // hidden: true
                },
                {
                    path: '/upload',
                    name: '上传文件',
                    component: upload,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                },
                {
                    path: '/simple',
                    name: '上传',
                    component: simple,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                },
                {
                    path: '/batch_management',
                    name: '配置',
                    component: batch_management,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                },
                {
                    path: '/yure_management',
                    name: '刷新预热',
                    component: yure_management,
                    icon: 'iconfont icon-dian',
                    // hidden: true
                },
                {
                    path: '/add_url',
                    name: '添加URL',
                    component: add_url,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                },
                {
                    path: '/lot_operating',
                    name: '批量操作',
                    component: lot_operating,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                },
                {
                    path: '/copy_configuration',
                    name: '复制配置',
                    component: copy_configuration,
                    icon: 'iconfont icon-dian',
                    hidden: true,
                },
            ],
        },
        {
            path: '/accelerate_management',
            name: '域名管理',
            component: accelerate_management,
            icon: 'iconfont icon-dian',
            // hidden: true
            meta: {
                title: '内容加速配置'
            }
        },
        {
            path: '/domain_management',
            name: '点播加速管理',
            component: domain_management,
            icon: 'iconfont icon-dian',
            // hidden: true
        },
        {
            path: '/yure_management',
            name: '刷新预热',
            component: yure_management,
            icon: 'iconfont icon-dian',
            // hidden: true
        },
        {
            path: '/home_fosdr',
            name: '节点流量统计',
            component: index,
            icon: 'iconfont icon-tongjichaxun_',
            children: [{
                    path: '/dosage_query',
                    name: '节点流量用量',
                    component: dosage_query,
                    icon: 'iconfont icon-dian',
                },
                {
                    path: '/node_flow',
                    name: '节点流量监控',
                    component: node_flow,
                    icon: 'iconfont icon-dian',
                },
            ],
        },
        {
            path: '/geswg',
            name: '播放统计',
            component: index,
            icon: 'iconfont icon-jiankongtongji',
            children: [{
                    path: '/resources',
                    name: '播放流量',
                    component: resources,
                    icon: 'iconfont icon-dian',
                },
                {
                    path: '/statistics',
                    name: '统计分析',
                    component: statistics,
                    icon: 'iconfont icon-dian',
                },
                {
                    path: '/log_download',
                    name: '点播加速日志',
                    hidden: true,
                    component: log_download,
                    icon: 'iconfont icon-dian',
                },
            ],
        },
        {
            path: '/fdsf',
            name: '订单管理',
            hidden: true,
            component: index,
            icon: 'iconfont icon-zhongduanguanli',
            children: [{
                path: '/order_list',
                name: '订单管理',
                component: order_list,
                icon: 'iconfont icon-dian',
            }, {
                path: '/order_detil',
                name: '订单详情',
                component: order_detil,
                icon: 'iconfont icon-dian',

            }],
        },
        {
            path: '/order_list',
            name: '订单管理',
            component: order_list,
            icon: 'iconfont icon-dian',
            meta: {
                title: "订单管理"
            },
        },
        {
            path: '/jytj',
            name: '流量包管理',
            hidden: true,
            component: index,
            icon: 'iconfont icon-zhongduanguanli',
            children: [{
                    path: '/traffic_list',
                    name: '流量包管理',
                    component: traffic_list,
                    icon: 'iconfont icon-dian',
                    meta: {
                        dot: true
                    },
                },
                {
                    path: '/traffic_detil',
                    name: '流量包详情',
                    component: traffic_detil,
                    icon: 'iconfont icon-dian',

                }
            ],
        },
        {
            path: '/traffic_list',
            name: '流量包管理',
            component: traffic_list,
            icon: 'iconfont icon-zhongduanguanli',
            meta: {
                title: "流量包管理"
            },
        },
        {
            path: '/fdsf',
            name: '终端管理',
            component: index,
            hidden: true,
            icon: 'iconfont icon-zhongduanguanli',
            children: [{
                path: '/terminal_management',
                name: '终端管理',
                component: terminal_management,
                icon: 'iconfont icon-dian',

            }, ],
        },
        {
            path: '/terminal_management',
            name: '终端管理',
            component: terminal_management,
            icon: 'iconfont icon-zhongduanguanli',
            meta: {
                title: "终端管理"
            }
        },
        {
            path: '/word_map',
            name: 'IP分布',
            component: index,
            hidden: true,
            icon: 'iconfont icon-zhongduanguanli',
            children: [{
                path: '/word_map',
                name: 'IP分布',
                component: word_map,
                hidden: false,
            }]
        },
        {
            path: '/dsafd',
            name: '资金管理',
            component: index,
            hidden: true,
            icon: 'iconfont icon-zhongduanguanli',
            children: [{
                    path: '/money_management',
                    name: '资金管理',
                    component: money_management,
                    hidden: false,
                    icon: 'iconfont icon-zhongduanguanli',
                }, {
                    path: '/recharge_management',
                    name: '充值管理',
                    component: recharge_management,
                    hidden: false,
                    icon: 'iconfont icon-zhongduanguanli',
                }, {
                    path: '/cost_list',
                    name: '收支明细',
                    component: cost_list,
                    hidden: false,
                    icon: 'iconfont icon-zhongduanguanli',
                }, {
                    path: '/bill',
                    name: '费用账单',
                    component: bill,
                    hidden: false,
                    icon: 'iconfont icon-zhongduanguanli',
                }, {
                    path: '/bill_deail',
                    name: '账单详情',
                    component: bill_deail,
                    hidden: true,
                    icon: 'iconfont icon-zhongduanguanli',
                }, {
                    path: '/upcoming',
                    name: '待办事件详情',
                    component: upcoming,
                    hidden: true,
                    icon: 'iconfont icon-zhongduanguanli',
                },
                {
                    path: '/withdraw_list',
                    name: '提现管理',
                    component: withdraw_list,
                    hidden: false,
                    icon: 'iconfont icon-zhongduanguanli',
                },
                {
                    path: '/withdraw_detil',
                    name: '提现详情',
                    component: withdraw_detil,
                    hidden: true,
                    icon: 'iconfont icon-zhongduanguanli',
                },
            ]
        },
    ],
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;