// import { get, post } from './http'
import axios from 'axios';
import {get, post } from './request';
var href = window.location.href;

if (href.indexOf('xyj.grapefruitcloud.com') >= 0) {
    var userUrl = 'http://xyj.grapefruitcloud.com'; //PHP服务URL
} else if (href.indexOf('service.kclgames.com') >= 0) {
    var userUrl = 'http://service.kclgames.com'; //PHP服务URL
} else if (href.indexOf('zzb.stguarantee.com') >= 0) {
    var userUrl = 'http://zzb.stguarantee.com'; //PHP服务URL
} else if (href.indexOf('test.zzb.com') >= 0) {
    var userUrl = 'http://test.zzb.com'; //测试
} else {
    // var userUrl = 'http://zzb.stguarantee.com';
    // var userUrl = 'http://www.forteatime.com';
    var userUrl = 'http://service.kclgames.com';
    // var userUrl = 'http://xyj.grapefruitcloud.com'; //PHP服务URL
    // var myurl = "http://10.0.0.75:8090"
    var testurl = "http://test.zzb.com"
}



export const uploadurl = userUrl;
//用户管理
//忘记密码--重置密码
export const loginbyphone = (params) =>
    post(`${userUrl}/clouduser/loginbyphone`, params);
//登录
export const login = (params) => post(`${userUrl}/clouduser/login`, params);
//注册
export const register = (params) =>
    post(`${userUrl}/clouduser/register`, params);
//获取手机验证码
export const getcode = (params) => post(`${userUrl}/clouduser/getcode`, params);
//获取用户信息
export const getuser = (params) => post(`${userUrl}/clouduser/getuser`, params);
//修改邮箱
export const editemail = (params) =>
    post(`${userUrl}/clouduser/editemail`, params);
//修改用户名
export const editusername = (params) =>
    post(`${userUrl}/clouduser/editusername`, params);
//修改手机号
export const editphone = (params) =>
    post(`${userUrl}/clouduser/editphone`, params);
//获取邮箱验证码
export const getemail = (params) =>
    post(`${userUrl}/clouduser/getemail`, params);
//忘记密码---获取邮箱验证码
export const forgetpassword = (params) =>
    post(`${userUrl}/clouduser/forgetpassword`, params);
//忘记密码--重置密码
export const resetpassword = (params) =>
    post(`${userUrl}/clouduser/resetpassword`, params);
//重置密钥
export const resecret = (params) =>
    post(`${userUrl}/clouduser/resecret`, params);
/**配置管理 */

//校验标签

export const check_label = (params) =>
    post(`${userUrl}/url_mgmt/check_label`, params);
//获取URL列表
export const query_url = (params) =>
    post(`${userUrl}/url_mgmt/query_url`, params);
//url导出
export const url_export_for_admin = (params) =>
    post(`${userUrl}/url_mgmt/url_export_for_admin`, params);
//获取URL配置
export const query_config = (params) =>
    post(`${userUrl}/url_mgmt/query_config`, params);
//添加URL
export const add_url = (params) => post(`${userUrl}/url_mgmt/add_url`, params);
//批量管理标签
// export const modify_label = params =>  post(`${userUrl}/url_mgmt/modify_label`, params);
export const modify_label = (params) =>
    post(`${userUrl}/url_mgmt/modify_label`, params);
//禁用启用
export const change_state = (params) =>
    post(`${userUrl}/url_mgmt/change_state`, params);
//删除
export const delete_url = (params) =>
    post(`${userUrl}/url_mgmt/delete_url`, params);
//配置url
export const config_url = (params) =>
    post(`${userUrl}/url_mgmt/config_url`, params);
//查询url标签
export const query_urllabel = (params) =>
    post(`${userUrl}/url_mgmt/query_urllabel`, params);
//添加域名
export const add_domain = (params) =>
    post(`${userUrl}/url_mgmt/add_domain`, params);
//修改域名
export const modify_domain = (params) =>
    post(`${userUrl}/url_mgmt/modify_domain`, params);
//启用禁用域名
export const change_domainstate = (params) =>
    post(`${userUrl}/url_mgmt/change_domainstate`, params);
//删除域名
export const del_domain = (params) =>
    post(`${userUrl}/url_mgmt/del_domain`, params);
//查询域名
export const query_domain = (params) =>
    post(`${userUrl}/url_mgmt/query_domain`, params);
//检查url名字
export const check_urlname = (params) =>
    post(`${userUrl}/url_mgmt/check_urlname`, params);

/**预热刷新 */
//预热刷新
export const resource_refresh = (params) =>
    post(`${userUrl}/node_mgmt/resource_refresh`, params);
//预热状态
export const refresh_state = (params) =>
    post(`${userUrl}/node_mgmt/refresh_state`, params);

/**数据中心 */
/** 用量查询*/
//查询条件
export const getvideo = (params) =>
    post(`${userUrl}/url_mgmt/getvideo`, params);
//获取查询条件
export const query_conditions = (params) =>
    post(`${userUrl}/resource_usage/query_conditions`, params);
//流量使用曲线
export const dataflow_curve = (params) =>
    post(`${userUrl}/resource_usage/dataflow_curve`, params);
//流量使用表格
export const dataflow_table = (params) =>
    post(`${userUrl}/resource_usage/dataflow_table`, params);

/**节点流量 */
//节点流量图
export const node_traffic_curve = params => {
    return post(`${userUrl}/resource_manage/ipfs_flow_curve`, params)
};

//节点流量统计表
export const node_traffic_table = params => {
    return post(`${userUrl}/resource_manage/ipfs_flow_table`, params)
};

//节点流量监控下载
export const node_traffic_download = params => {
    return post(`${userUrl}/file_download/export_ipfs_flow_table_file`, params)
};

//TOP加速次数排行
export const top_accelcnt_ranking = params => {
    return post(`${userUrl}/resource_manage/query_accelcnt_ranking`, params)
};

//TOP加速流量排行
export const top_dataflow_ranking = params => {
    return post(`${userUrl}/resource_manage/query_dataflow_ranking`, params)
};

//TOP加速次数排行下载接口
export const export_accelcnt_ranking_table_file = params => {
    return post(`${userUrl}/file_download/export_accelcnt_ranking_table_file`, params)
};

//TOP加速流量排行下载接口
export const export_dataflow_ranking_table_file = params => {
    return post(`${userUrl}/file_download/export_dataflow_ranking_table_file`, params)
};

//获取节点渠道node_mgmt/get_nodetype_enum
export const get_nodetype_enum = params => {
    return post(`${userUrl}/node_mgmt/get_nodetype_enum`, params)
};

/**资源用量 */
//加速流量加载查询条件
export const accelerate_flow_query_conditions = (params) =>
    post(`${userUrl}/resource_manage/accelerate_flow_query_conditions`, params);
//加速流量柱状图
export const accelerate_flow = (params) =>
    post(`${userUrl}/resource_manage/accelerate_flow`, params);
//加速流量表格
export const accelerate_flow_table = (params) =>
    post(`${userUrl}/resource_manage/accelerate_flow_table`, params);
//回源查询条件
export const backsource_flow_query_conditions = (params) =>
    post(`${userUrl}/resource_manage/backsource_flow_query_conditions`, params);
//回源流量柱状图
export const backsource_flow = (params) =>
    post(`${userUrl}/resource_manage/backsource_flow`, params);
/**播放流量地区分布表*/
export const query_dataflow_location_table = params => {
    return post(`${userUrl}/resource_manage/query_dataflow_location_table`, params)
};
/**播放流量地区分布表*/
export const query_dataflow_location_curve = params => {
    return post(`${userUrl}/resource_manage/query_dataflow_location_curve`, params)
};

/**统计分析 */
//PV/UV 查询条件
export const pv_uv_query_conditions = (params) =>
    post(`${userUrl}/videoaccess_statistic/pv_uv_query_conditions`, params);
//PV/UV 曲线图
export const pv_uv_curve = (params) =>
    post(`${userUrl}/videoaccess_statistic/pv_uv_curve`, params);

//地区访问次数查询条件
export const region_query_conditions = (params) =>
    post(`${userUrl}/videoaccess_statistic/region_query_conditions`, params);
//地区访问次数曲线和表格
export const query_topregion_accesscnt_curve = (params) =>
    post(
        `${userUrl}/videoaccess_statistic/query_topregion_accesscnt_curve`,
        params
    );
//运营商访问次数查询条件
export const isp_query_conditions = (params) =>
    post(`${userUrl}/videoaccess_statistic/isp_query_conditions`, params);
//运营商访问次数曲线和表格
export const query_topisp_accesscnt_curve = (params) =>
    post(
        `${userUrl}/videoaccess_statistic/query_topisp_accesscnt_curve`,
        params
    );

//播放统计查询条件
export const query_playtimes_conditions = (params) =>
    post(`${userUrl}/videoplay_statistic/query_playtimes_conditions`, params);
//播放次数曲线图
export const query_playtimes_curve = (params) =>
    post(`${userUrl}/videoplay_statistic/query_playtimes_curve`, params);
//运营商访问次数曲线和表格
export const query_playdata_table = (params) =>
    post(`${userUrl}/videoplay_statistic/query_playdata_table`, params);

/**终端管理 */

//添加终端
export const addterminal = (params) =>
    post(`${userUrl}/cloudterminal/addterminal`, params);
//获取终端token列表
export const getterminal = (params) =>
    post(`${userUrl}/cloudterminal/getterminal`, params);
//删除终端
export const deleteterminal = (params) =>
    post(`${userUrl}/cloudterminal/deleteterminal`, params);
//设置终端名称
export const editterminal = (params) =>
    post(`${userUrl}/cloudterminal/editterminal`, params);

//获取终端sdk列表
export const sdklist = (params) => post(`${userUrl}/cloud/sdklist`, params);
//sdk下载
export const editsdk = (params) => post(`${userUrl}/cloud/editsdk`, params);

/**CDN日志 */
//加速日志下载--表格数据
export const query_logfile_table = (params) =>
    post(`${userUrl}/logfile_download/query_logfile_table`, params);
//加速日志下载--日志下载
export const download_logfile = (params) =>
    post(`${userUrl}/logfile_download/download_logfile`, params);

//pvuv导出
export const export_pv_uv_curve_file = (params) =>
    post(`${userUrl}/file_download/export_pv_uv_curve_file`, params);
//播放加速内容图表导出接口
export const export_playdata_table_file = (params) =>
    post(`${userUrl}/file_download/export_playdata_table_file`, params);
//播放加速内容图表导出接口
export const export_playtimes_curve_file = (params) =>
    post(`${userUrl}/file_download/export_playtimes_curve_file`, params);
//访问用户分布导出接口
export const export_topregion_accesscnt_curve_file = (params) =>
    post(`${userUrl}/file_download/export_topregion_accesscnt_curve_file`, params);
//加速流量图表导出接口
export const export_accelerate_flow_file = (params) =>
    post(`${userUrl}/file_download/export_accelerate_flow_file`, params);
//加速流量列表导出接口
export const export_accelerate_flow_table_file = (params) =>
    post(`${userUrl}/file_download/export_accelerate_flow_table_file`, params);
//回源统计导出接口
export const export_backsource_flow_file = (params) =>
    post(`${userUrl}/file_download/export_backsource_flow_file`, params);
//资源用量导出接口
export const export_dataflow_curve_file = (params) =>
    post(`${userUrl}/file_download/export_dataflow_curve_file`, params);
//资源用量导出接口
export const export_topisp_accesscnt_curve_file = (params) =>
    post(`${userUrl}/file_download/export_topisp_accesscnt_curve_file`, params);

//流量占比图表
export const sdk_flow = (params) =>
    post(`${userUrl}/resource_manage/sdk_flow`, params);
//流量占比表格
export const sdk_flow_table = (params) =>
    post(`${userUrl}/resource_manage/sdk_flow_table`, params);
//流量监控
export const sdk_flow_control = (params) =>
    post(`${userUrl}/resource_manage/sdk_flow_control`, params);

//流量占比导出
export const export_sdk_flow_table_user_file = (params) =>
    post(`${userUrl}/file_download/export_sdk_flow_table_user_file`, params);
//流量监控导出
export const export_sdk_flow_control_user_file = (params) =>
    post(`${userUrl}/file_download/export_sdk_flow_control_user_file`, params);

//用量查询图表
export const manage_dataflow_curve = (params) =>
    post(`${userUrl}/resource_usage/manage_dataflow_curve`, params);
//用量查询表格
export const manage_dataflow_table = (params) =>
    post(`${userUrl}/resource_usage/manage_dataflow_table`, params);
//用量导出
export const export_manage_dataflow_table_file = (params) =>
    post(`${userUrl}/file_download/export_manage_dataflow_table_file`, params);


//首页概览数据
export const ipfs_flow_summay = (params) => {
    return post(`${userUrl}/resource_manage/ipfs_flow_summay`, params)
};
//查询流量包产品
export const query_pktproduct = (params) => {
    return post(`${testurl}/pktproduct_mgmt/query_pktproduct`, params)
};
//查询订单
export const query_pktorder_for_admin = (params) => {
    return post(`${testurl}/pktorder_mgmt/query_pktorder_for_admin`, params)
};
//通知支付结果
export const notify_payment = (params) => {
    return post(`${testurl}/order_mgmt/notify_payment`, params)
};
//创建订单
export const create_pktorder = (params) => {
    return post(`${testurl}/pktorder_mgmt/create_pktorder`, params)
};
//删除订单
export const del_pktorder = (params) => {
    return post(`${testurl}/pktorder_mgmt/del_pktorder`, params)
};
//营销查询
export const query_adslot = (params) => {
    return post(`${testurl}/ad_mgmt/query_adslot`, params)
};
//查询当前待显示营销
export const query_cur_adslot = (params) => {
    return post(`${testurl}/ad_mgmt/query_cur_adslot`, params)
};
//查询用户当前可用流量包
export const query_user_pkt = (params) => {
    return post(`${testurl}/pktorder_mgmt/query_user_pkt`, params)
};



//开启/停止加速服务
export const endbale_speedup = (params) => {
    return post(`${testurl}/useraccount_mgmt/endbale_speedup`, params)
};
//更改收费方式
export const change_chargetype = (params) => {
    return post(`${testurl}/useraccount_mgmt/change_chargetype`, params)
};
//查询用户账户余额
export const query_user_acount = (params) => {
    return post(`${testurl}/useraccount_mgmt/query_user_acount`, params)
};
//开通按量计费
export const setup_flowcharge = (params) => {
    return post(`${testurl}/flowcharge_mgmt/setup_flowcharge`, params)
};
//流量计费充值
export const create_chargeorder = (params) => {
    return post(`${testurl}/flowcharge_mgmt/create_chargeorder`, params)
};
//通知支付结果
export const mgmt_notify_payment = (params) => {
    return post(`${testurl}/flowcharge_mgmt/notify_payment`, params)
};
//查询充值记录
export const query_chargeorder = (params) => {
    return post(`${testurl}/flowcharge_mgmt/query_chargeorder`, params)
};
//查询充值记录
export const query_chargeorder_for_admin = (params) => {
    return post(`${testurl}/flowcharge_mgmt/query_chargeorder_for_admin`, params)
};
//查询账户流水
export const query_user_sz = (params) => {
    return post(`${testurl}/flowcharge_mgmt/query_user_sz`, params)
};
//查询账户流水
export const query_user_sz_for_admin = (params) => {
    return post(`${testurl}/flowcharge_mgmt/query_user_sz_for_admin`, params)
};
//查询账户流水
export const query_help = (params) => {
    return post(`${testurl}/help_mgmt/query_help`, params)
};
//流量包使用详情
export const query_pktuse_info = (params) => {
    return post(`${testurl}/pktorder_mgmt/query_pktuse_info`, params)
};