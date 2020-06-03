/*
 * @Author: songyingchun
 * @Date: 2019-06-25 11:06:43
 * @Description: http通用工具函数
 */
import axios from 'axios';
import { notification, Modal } from 'antd';

axios.defaults.baseURL = '';
axios.defaults.withCredentials = true
const openNotificationWithIcon = (type, text) => {
    notification[type]({
        message: '提示',
        description: text,
    });
};
/**
 * 公用get请求
 * @param url       接口地址
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const get = ({ url, msg = '接口异常', headers }) =>
    axios.get(url, headers).then(res => res.data).catch(err => {
        if (err && err.response) {
            console.log(err.response);
            allErrorTip(err.response.status)
        } else if (err && err.request) {
            console.log(err.request)
            allErrorTip(err.request.status)
        } else {
            console.log(err.message)
        }
        return
    });

/**
 * 公用post请求
 * @param url       接口地址
 * @param data      接口参数
 * @param msg       接口异常提示
 * @param headers   接口所需header配置
 */
export const post = ({ url, data, msg = '接口异常', headers }) =>
    axios.post(url, data, headers).then(res => res.data).catch(err => {
        if (err && err.response) {
            console.log(err.response);
            allErrorTip(err.response.status)
        } else if (err && err.request) {
            console.log(err, err.request)
            allErrorTip(err.request.status)
        } else {
            console.log(err.message)
        }
        return
    });

export const allErrorTip = (status) => {
    let resultTip = ''
    console.log(status)
    switch (status) {
        case 400: resultTip = '请求错误(400)'; break;
        case 401:
            warning("温馨提示", "用户登录信息已过期，请重新登录！")
            break;
        case 403: resultTip = '拒绝访问(403)'; break;
        case 404: resultTip = '请求出错(404)'; break;
        case 408: resultTip = '请求超时(408)'; break;
        case 500: resultTip = '服务器错误(500)'; break;
        case 501: resultTip = '服务未实现(501)'; break;
        case 502: resultTip = '网络错误(502)'; break;
        case 503: resultTip = '服务不可用(503)'; break;
        case 504: resultTip = '网络超时(504)'; break;
        case 505: resultTip = 'HTTP版本不受支持(505)'; break;
        default: resultTip = `连接出错(${status})!`; break
    }
    if (resultTip) openNotificationWithIcon('error', resultTip)
}

function warning (title, content) {
    Modal.warning({
        title: title,
        content: content,
        centered: true,
        onOk () {
            localStorage.removeItem('user');
            window.location.href = './index.html#/login'
        }
    });
}
