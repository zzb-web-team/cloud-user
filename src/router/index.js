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

//终端管理
import terminal_management from '@/views/terminal/terminal_management.vue';

Vue.use(Router);

const router = new Router({
    routes: [{
            path: '/',
            name: '登陆',
            component: log,
            hidden: true,
        },
        {
            path: '/phone_log',
            name: '手机号登陆',
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
                },
                // }, {
                //     path: '/home_six',
                //     name: '目录',
                //     component: home_six,
                //     hidden: true,
                //     children: [{
                //         path: '/overview',
                //         name: '概览',
                //         component: overview,
                //         icon: 'iconfont icon-dian',

                //     }]
                //}
            ],
        },
        {
            path: '/overview',
            name: '概览',
            component: overview,
            bsgc: true,
            icon: 'iconfont icon-shujutongji',
        },
        {
            path: '/gerg',
            name: '配置管理',
            component: index,
            bgc: false,
        },
        {
            path: '/home_four',
            name: '分发加速配置',
            component: index,
            icon: 'iconfont icon-jiasu',
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
                    name: '刷新预热管理',
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
            path: '/fsd156',
            name: '数据中心',
            component: index,
            bgc: false,
        },

        {
            path: '/home_fosdr',
            name: '数据中心',
            component: index,
            hidden: true,
            icon: 'iconfont icon-jiankongtongji',
            children: [{
                    path: '/gewsrg',
                    name: '用量查询',
                    component: home_two,
                    hidden: true,
                    icon: 'iconfont icon-dian',
                    children: [{
                        path: '/dosage_query',
                        name: '用量查询',
                        component: dosage_query,
                        hidden: true,
                        icon: 'iconfont icon-dian',
                    }, ],
                },
                {
                    path: '/geswg',
                    name: '监控统计',
                    component: home_five,
                    hidden: true,
                    icon: 'iconfont icon-dian',
                    children: [{
                            path: '/resources',
                            name: '资源监控',
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
                            name: 'CDN日志下载',
                            component: log_download,
                            icon: 'iconfont icon-dian',
                        },
                        {
                            path: '/accelerated_log',
                            name: '点播加速日志',
                            component: accelerated_log,
                            icon: 'iconfont icon-dian',
                        },
                    ],
                },
            ],
        },
        {
            path: '/dosage_query',
            name: '用量查询',
            component: dosage_query,
            icon: 'iconfont icon-tongjichaxun_',
        },
        {
            path: '/geswg',
            name: '监控统计',
            component: home_five,
            icon: 'iconfont icon-jiankongtongji',
            children: [{
                    path: '/resources',
                    name: '资源监控',
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
                    name: 'CDN日志下载',
                    component: log_download,
                    icon: 'iconfont icon-dian',
                },
                {
                    path: '/accelerated_log',
                    name: '点播加速日志',
                    component: accelerated_log,
                    icon: 'iconfont icon-dian',
                },
            ],
        },
        {
            path: '/fsfg',
            name: '终端管理',
            component: index,
            bgc: false,
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
        },
    ],
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;