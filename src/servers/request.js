/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import Vue from 'vue';
import router from '../router/index';
import http from './ajax';
import VueCookies from 'vue-cookies';
import axios from 'axios';
import { Message, Loading } from 'element-ui';
import _ from 'lodash';
let v = new Vue();

// import store from '../store/index'
// 环境的切换
// let rootsd = process.env.NODE_ENV;
// switch (rootsd) {
//     case "development": //开发环境
//         axios.defaults.baseURL = 'http://xyj.grapefruitcloud.com';
//         break;
//     case "production": //生产环境
//         axios.defaults.baseURL = 'http://xyj.grapefruitcloud.com';
//         break;
//     default: //测试环境
//         axios.defaults.baseURL = 'http://zzb.onezen.net';
// }
// var href = window.location.href;

// if (href.indexOf('xyj.grapefruitcloud.com') >= 0) {
//     var userUrl = 'http://xyj.grapefruitcloud.com'; //PHP服务URL
// } else {
//     var userUrl = 'http://zzb.onezen.net';
// }
var userUrl = 'http://xyj.grapefruitcloud.com'; //PHP服务URL
// 加载动画
//loading对象
var loading;

//当前正在请求的数量
let needLoadingRequestCount = 0;
//显示loading
function showLoading(target) {
    // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
    // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
    if (needLoadingRequestCount === 0 && !loading) {
        loading = Loading.service({
            lock: true,
            text: 'Loading...',
            background: 'rgba(255, 255, 255, 0.5)',
            target: target || 'body'
        });
    }
    needLoadingRequestCount++;
}

//隐藏loading
function hideLoading() {
    needLoadingRequestCount--;
    needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); //做个保护
    if (needLoadingRequestCount === 0) {
        //关闭loading
        toHideLoading();
    }
}
//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
var toHideLoading = _.debounce(() => {
    /**
     * 坑：在拦截起调用新的Loading之前检测是否有实例存在，如果有则调用close()方法关闭实例，然后再调用新的Loading！！！！！！！！！！！！
     */
    if (loading) {
        loading.close();
        loading = null;
    }
}, 300);
// 请求超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
    (config) => {

        var checkwithout = [
            userUrl + '/clouduser/loginbyphone',
            userUrl + '/clouduser/login',
            userUrl + '/clouduser/register',
            userUrl + '/clouduser/getcode',
            userUrl + '/clouduser/getemail',
            userUrl + '/clouduser/checktoken',
            userUrl + '/clouduser/forgetpassword',
            userUrl + '/clouduser/resetpassword',
        ];
        if (checkwithout.indexOf(config.url) < 0) {
            if (!VueCookies.get('id')) {
                alert('登录已过期');
                alert_is_present();
                router.push('/');
                return false;
            }
            http.request({
                url: userUrl + '/clouduser/checktoken',
                method: 'post',
                data: {
                    id: VueCookies.get('id'),
                    token: VueCookies.get('token'),
                },
                async: true,
                success: function(data) {
                    data = JSON.parse(data);
                    if (data.status != 0) {
                        VueCookies.set('id', '', 0);
                        VueCookies.set('token', '', 0);
                        VueCookies.set('user', '', 0);
                        v.$alert(data.msg, '通知', {
                            confirmButtonText: '确定',
                            showClose: false,
                            center: true,
                            callback: (action) => {
                                router.push('/');
                            },
                        });
                    }
                },
            });
        }
        if (config.headers.showLoading !== false && config.url.indexOf('refresh_state') < 0) {
            showLoading(config.headers.loadingTarget);
        }
        return config;
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
        // const token = store.state.token;
        // token && (config.headers.Authorization = token);
    },
    (error) => {
        //判断当前请求是否设置了不显示Loading
        if (config.headers.showLoading !== false) {
            hideLoading();
        }
        Message.error('请求超时!');
        return Promise.error(error);
    }
);
// 响应拦截器
axios.interceptors.response.use(
    (response) => {

        if (response.config.headers.showLoading !== false) {
            hideLoading();
        }
        //console.log(response.status)
        if (response.status === 200) {
            //console.log(Promise.resolve(response));
            if (response.data.status == -5) {
                Message.error('服务器响应超时!');
            }
            // if (response.data.status == -900) {
            //     alert(response.data.msg);
            //     router.push('/');
            //     return false;
            // }
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是200的情况
    (error) => {
        //判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
        if (error.config.headers.showLoading !== false) {
            hideLoading();
        }
        if (error.response && error.response.status == 404) {
            router.push('/');
        }
        //console.log(error.response.status);
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。
                case 400:
                    Message.error('服务器无法正常响应!');
                    break;
                    // 403 token过期
                    // 登录过期对用户进行提
                    // 清除本地token和清空vuex中token对象
                    // 跳转登录页面
                case 404:
                    Message.error('请求内容不存在!');
                    break;
                    // 404请求不存在
                case 500:
                    Message.error('服务器内部错误!');
                    break;
                    // 其他错误，直接抛出错误提示
                default:
                    this.$message(error.response.data.message);
            }
            return Promise.reject(error.response);
        }
    }
);
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params,
            })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                // console.log(err.data);
                reject(err.data);
            });
    });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err.data);
            });
    });
}