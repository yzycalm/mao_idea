/*
 * @Author: songyingchun
 * @Date: 2019-06-25 11:06:44
 * @Description: 常用工具类
 */
import { Modal, notification } from "antd";
import moment from "moment";
import { scrollTopFrame } from "../store/actionCreators";
import store from "../store";
import React from "react";

const confirm = Modal.confirm;
/**
 * @description: 获取url的参数
 * @param {type} 
 * @return: 
 */
export const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _consts = _query.split('&');
    _consts.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};

/**
 * @description: 时间戳转日期
 * @param {m: 传入值} 
 * @return: 补0
 */
function add0 (m) {
    return m < 10 ? '0' + m : m
}

export const format = (val) => {
    if (!val || parseInt(val) === 0) {
        return 'ᅳ'
    }
    let result = val.toString()
    if (result.length === 10) {
        result = val + '000'
    } else if (val.length > 13) {
        return val
    }
    const time = new Date(parseInt(result));
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    const s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
export const formatDate = (val) => {
    const time = new Date(parseInt(val));
    const y = time.getFullYear();
    const m = time.getMonth() + 1;
    const d = time.getDate();
    return y + add0(m) + add0(d);
}
/**
 * @description: 图片大小转换（B KB MB GB）
 * @param {limit: 图片大小} 
 * @return: 转换后的大小
 */
export function converSize (limit) {
    let size = '';
    if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B
        size = limit.toFixed(2) + 'B';
    } else if (limit < 0.1 * 1024 * 1024) {//如果小于0.1MB转化成KB
        size = (limit / 1024).toFixed(2) + 'KB';
    } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
    } else { //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
    }

    let sizestr = size + '';
    let len = sizestr.indexOf('\.');
    let dec = sizestr.substr(len + 1, 2);
    if (dec === '00') {//当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
}
/**
 * @description: 图片base64处理
 * @param {data: 图片信息} 
 * @return: 
 */
export function handleImg (data) {
    const index = data.img.lastIndexOf('.')
    const suffix = 'image/' + data.img.substring(index + 1, data.img.length);
    const file = { file: { type: suffix, thumbUrl: data.img } }
    return file
}
/**
 * @description: 操作提示
 * @param {type: 通知弹窗类型；text: 显示文字} 
 * @return: 
 */
export const openNotificationWithIcon = (type, text) => {
    notification[type]({
        message: '提示',
        description: text,
    });
};

/**
 * @description: 操作确认
 * @param {text: 缺人文字提醒；callbaxk: 确认完成之后回调} 
 * @return: 
 */
export const showConfirm = (text, callback) => {
    confirm({
        title: '提示',
        content: `您确定${text}该项吗？`,
        okText: '确认',
        cancelText: '取消',
        centered: true,
        onCancel () {

        },
        onOk () {
            callback()
        },
    });
}

//  为空判断显示短横线
export function isEmpty (text) {
    return <span>{text && parseInt(text) !== 0 ? text : 'ᅳ'}</span>
}

// 为空判断显示“0”
export function isEmptyNum (text) {
    return <span>{text ? text : 0}</span>
}

// 取消 || 返回上一页
export function clickCancel () {
    window.history.back()
}

// 禁止选中当天以前
export function disabledDate (current) {
    return current < moment().subtract(1, "days")
}

// 分页操作
export function paginationProps (totals, query, callback1, callback2) {
    const paginationProps = {
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: () => `共有${totals}条数据`,
        pageSize: query.pageSize,
        current: query.curPage,
        total: totals,
        onShowSizeChange: (current, pageSize) => {
            callback1(current, pageSize)
        },
        onChange: (current) => {
            callback2(current)
        }
    };
    return paginationProps
}

// 分页操作
export function paginationPropsFuck (totals, query, callback1, callback2) {
    const paginationPropsFuck = {
        showSizeChanger: true,
        showQuickJumper: false,
        showTotal: () => `共有${totals}条数据`,
        pageSize: query.pageSize,
        current: query.pageNum,
        total: totals,
        onShowSizeChange: (current, pageSize) => {
            callback1(current, pageSize)
        },
        onChange: (current) => {
            callback2(current)
        }
    };
    return paginationPropsFuck
}

export function overwriteAssign () {
    if (typeof Object.assign != 'function') {
        Object.assign = function (target) {

            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            target = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key];
                        }
                    }
                }
            }
            return target;
        };
    }
}


// 过滤html标签
export function getContent (str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
    str = str.replace(/<[^>]+>|&[^>]+;/g, "").trim()
    return str;
}

// 过滤html标签
export function getContentBT (str,url) {
    var val = ""
    if(str == "0"){
        return <a style = {{textDecoration:"none", color:"#19AFF1" }} target = "_blank" href={url}>关联网页</a>;
    }else if(str == "1"){
        val = "平台"
        return val;
    }else{
        val = "空"
        return val;
    }
}

export function getContentType (str) {
    var val = ""
    if(str == "0"){
        val = "一图模块"
        return val;
    }else if(str == "1"){
        val = "二图模块"
        return val;
    }else{
        val = "三图模块"
        return val;
    }
}

// 滚动条事件
export function handleScrollTop (type) {
    let layoutNode = document.getElementById("layoutRef");
    if (layoutNode) {
        if (type === 1) {
            layoutNode.addEventListener("scroll", e => {
                layoutNode.scrollTop = e.target.scrollTop;
            })
            const timer = setInterval(function () {
                if (layoutNode.scrollTop < store.getState().defaultScrollTop) {
                    layoutNode.scrollTop = layoutNode.scrollTop + 10;
                } else {
                    clearInterval(timer)
                }
            }, 0);
        } else {
            layoutNode.removeEventListener("scroll", e => {
                layoutNode.scrollTop = e.target.scrollTop;
            })
            scrollTopFrame(layoutNode.scrollTop)
        }
    }
}


// 处理视频上传宽高与时长
export function checkVideoWH (file, width, height, callback) {
    // console.log(file)
    return new Promise(function (resolve, reject) {
        const url = URL.createObjectURL(file)
        const video = document.createElement('video')

        video.onloadedmetadata = evt => {

            URL.revokeObjectURL(url)
            // console.log(video.videoWidth)
            // console.log(video.videoHeight)
            // console.log(video.duration)

            // if (width && video.videoWidth / video.videoHeight !== width / height) {
            //   Modal.error({
            //     title: '上传视频的宽高比例不符合要求，请重传',
            //   })
            //   callback(false)
            // // return false
            //   reject()
            // }
            if (video.duration > 15) {
                Modal.error({
                    title: '上传视频的时常应为15秒内的短视频，请重传',
                })
                callback(false)
                reject()
            }
            else {

                callback(video.videoWidth / video.videoHeight)
                resolve()
            }
        }
        video.src = url
        video.load() // fetches metadata

    })
}

// 上传图片像素限制
// fileSize
export function handleImgSize (r, file, width, height, callback, imgSize) {
    return new Promise(function (resolve, reject) {
        r.onload = e => {
            file = e.target.result;
            const index = file.lastIndexOf("base64");
            const baseCodeImg = file.substring(index + 7, file.length);
            const suffix = file.substring(11, file.lastIndexOf(";base64"))
            callback({ fileExtensions: suffix, baseCodeImg: baseCodeImg })
            // 限制图片大小
            const size = (e.total / 1024).toFixed(2)
            if (imgSize && size > imgSize) {
                openNotificationWithIcon('warning', `请上传大小不超过${imgSize}KB的图片`);
                return false
            } else if (size > 1024) {
                openNotificationWithIcon('warning', '请上传大小不超过1M的图片');
                return false
            }
            // 限制图片像素
            const image = new Image();
            image.onload = function () {
                if (width === height === 0) { // 不限制图片像素
                    resolve()
                } else {
                    if (width && this.width != width) {
                        openNotificationWithIcon('warning', '请上传宽为' + width + '像素的图片');
                        reject();
                    } else if (height && this.height != height) {
                        openNotificationWithIcon('warning', '请上传高为' + height + '像素的图片');
                        reject();
                    } else {
                        resolve();
                    }
                }
            };
            image.onerror = reject;
            image.src = file;
        };
    });
}

// 图片比例和像素限制
export function handleImgScaleAndSize (r, file, scale, fileSize, callback) {
    return new Promise(function (resolve, reject) {
        r.onload = e => {
            file = e.target.result;
            const index = file.lastIndexOf("base64");
            const baseCodeImg = file.substring(index + 7, file.length);
            const suffix = file.substring(11, file.lastIndexOf(";base64"))
            callback({ fileExtensions: suffix, baseCodeImg: baseCodeImg })
            // 限制图片大小
            const size = (e.total / 1024).toFixed(2)
            if (size > fileSize) {
                openNotificationWithIcon('warning', `请上传大小不超过${fileSize}KB的图片`);
                reject();
                return false
            }
            // 限制图片像素
            const image = new Image();
            image.onload = function () {
                // if (scale !== (this.width / this.height).toFixed(2)) {
                //     openNotificationWithIcon('warning', `请上传长宽比例为${scale}的图片`);
                //     reject();
                // } else {
                resolve();
                // }
            };
            image.onerror = reject;
            image.src = file;
        };
    });
}
/**
 * @description: 限制上传图片为正方形
 * @param {file: 文件洗脑洗；width：图片宽度；height：图片高度； imgSize： 图片大小} 
 * @return: 图片流
 */
export function handleImgSquare (r, file, callback, imgSize) {
    return new Promise(function (resolve, reject) {
        r.onload = e => {
            file = e.target.result;
            const index = file.lastIndexOf("base64");
            const baseCodeImg = file.substring(index + 7, file.length);
            const suffix = file.substring(11, file.lastIndexOf(";base64"))
            callback({ fileExtensions: suffix, baseCodeImg: baseCodeImg })
            // 限制图片大小
            const size = (e.total / 1024).toFixed(2)
             if (size > 1024) {
                openNotificationWithIcon('warning', '请上传大小不超过1M的图片');
                return false
            } else if (imgSize && size > imgSize) {
                openNotificationWithIcon('warning', `请上传大小不超过${imgSize}KB的图片`);
                return false
            }
            // 限制图片像素
            const image = new Image();
            image.onload = function () {

                if (this.width === this.height) {
                    resolve();
                } else {
                    openNotificationWithIcon('warning', '上传图片需为正方形');
                    reject();
                }

            };
            image.onerror = reject;
            image.src = file;
        };
    });
}
/**
 * @description: 对象转formData格式(注意不能纯数组！！！
 * @param {type} 
 * @return: 
 */
export function jsToFormData (val) {
    let formData = new FormData();
    for (let i in val) {
        isArray(val[i], i);
    }

    function isArray (array, key) {
        if (array === undefined || typeof array === "function") {
            return false;
        }
        if (typeof array != "object") {
            formData.append(key, array);
        } else if (array instanceof Array) {
            if (array.length == 0) {
                formData.append(`${key}`, "");
            } else {
                let first = true
                for (let i in array) {
                    if (typeof array[i] !== "object") {
                        if (first) {
                            formData.append(`ids`, JSON.stringify(array))
                        }
                        first = false
                    } else {
                        for (let j in array[i]) {
                            isArray(array[i][j], `${key}[${i}].${j}`);
                        }
                    }
                }
            }
        } else {
            let arr = Object.keys(array);
            if (arr.indexOf("uid") == -1) {
                for (let j in array) {
                    isArray(array[j], `${key}.${j}`);
                }
            } else {
                formData.append(`${key}`, array);
            }
        }
    }

    return formData;
}
// 获取随机数
export function guid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
