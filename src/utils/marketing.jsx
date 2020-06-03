import React from "react";
import { Button, Popover } from "antd";
import { showConfirm } from "../utils"

/** 推广管理的公共方法 */

// 展示页面
export function getShowPageText (text) {
    let result = ''
    switch (text) {
        case 1:
            result = '首页'
            break
        case 2:
            result = '启动页'
            break
        case 3:
            result = '我的页面'
            break
        case 4:
            result = '商品详情页'
            break
        case 5:
            result = '悬浮窗'
            break
        case 6:
            result = '收益页面'
            break
        case 7:
            result = '查看物流页'
            break
        case 8:
            result = '我的粉丝'
            break
        case 9:
            result = '搜索页'
            break
        default:
            break
    }
    return result
}

// 资源位名称
export function getResourceText (text) {
    let result = ''
    switch (text) {
        case 'banner':
            result = 'banner'
            break
        case 'entrance':
            result = '十大入口'
            break
        case 'topResource':
            result = '邮票位'
            break
        case 'suspension':
            result = '悬浮窗'
            break
        case 'detailResource':
            result = '商品详情资源'
            break
        case 'profit':
            result = '收益资源位'
            break
        case 'personal':
            result = '我的页面资源位'
            break
        case 'screenAd':
            result = '启动页'
            break
        case 'logistics':
            result = '查看物流'
            break
        case 'myFans':
            result = '激活潜在粉丝帮助'
            break
        case 'searchPage':
            result = '搜索页资源位'
            break
        default:
            break
    }
    return result
}

// 系统类型
export function getSystemTypeText (text) {
    let result = ''
    switch (text) {
        case 0:
            result = 'ios/安卓'
            break
        case 1:
            result = 'android'
            break
        case 2:
            result = 'ios'
            break
        default:
            break
    }
    return result
}

// 状态类型
export function getStatusText (text) {
    let result = ''
    switch (text) {
        case 2:
            result = '未开始'
            break
        case 1:
            result = '展示中'
            break
        case 3:
            result = '已停止'
            break
        case 4:
            result = '已过期'
            break
        default:
            break
    }
    return result
}

// 底部消息条状态类型
export function getStatusBottom (text) {
    let result = ''
    switch (text) {
        case 0:
            result = '展示中'
            break
        case 1:
            result = '未开始'
            break
        case 2:
            result = '已停止'
            break
        default:
            break
    }
    return result
}

//  搜索词位置
export function getSearchLocation (text) {
    let result = ''
    switch (text) {
        case 1:
            result = '搜索栏搜索'
            break
        case 2:
            result = '大家正在搜'
            break
        default:
            break
    }
    return result
}

// 豆腐块请求参数
export function handleParams (values) {
    const bannerId = JSON.parse(sessionStorage.getItem('doufuData'))
    let text = '新增'
    values.id = ''
    let addOrUpdate = 0
    if (bannerId && bannerId.id) {
        values.id = bannerId.id
        addOrUpdate = 1
        text = '编辑'
    }
    let arr = [
        {
            sysType: values.sysType,
            sequence: values.sequence,
            startTime: new Date(values.time[0]).getTime(),
            endTime: new Date(values.time[1]).getTime(),
            title: values.title0,
            url: values.url0,
            status: values.status,
        },
        {
            sysType: values.sysType,
            sequence: values.sequence,
            startTime: new Date(values.time[0]).getTime(),
            endTime: new Date(values.time[1]).getTime(),
            title: values.title1,
            url: values.url1,
            status: values.status,
        },
        {
            sysType: values.sysType,
            sequence: values.sequence,
            startTime: new Date(values.time[0]).getTime(),
            endTime: new Date(values.time[1]).getTime(),
            title: values.title2,
            url: values.url2,
            status: values.status,
        },
        {
            sysType: values.sysType,
            sequence: values.sequence,
            startTime: new Date(values.time[0]).getTime(),
            endTime: new Date(values.time[1]).getTime(),
            title: values.title3,
            url: values.url3,
            status: values.status,
        }
    ]
    const params = {
        activityBlockWebRequestList: arr,
        addOrUpdate: addOrUpdate
    }
    return [params, text]
}

// 页面和资源位联动
export const resourceOptions = [
    { title: '邮票位', value: 'topResource' },
    { title: 'banner页', value: 'banner' },
    { title: '十大入口', value: 'entrance' },
    { title: '商品详情资源位', value: 'detailResource' },
    { title: '收益页资源位', value: 'profit' },
    { title: '我的资源位', value: 'personal' },
    { title: '启动页', value: 'screenAd' },
    { title: '悬浮窗', value: 'suspension' },
    { title: '查看物流', value: 'logistics' },
    { title: '激活潜在粉丝帮助', value: 'myFans' },
]

export function getResourceOptions (val) {
    let result = []
    switch (val) {
        case '1':
            result = [
                { title: '邮票位', value: 'topResource' },
                { title: 'banner页', value: 'banner' },
                { title: '十大入口', value: 'entrance' }
            ]
            break
        case '2':
            result = [
                { title: '启动页', value: 'screenAd' }
            ]
            break
        case '3':
            result = [
                { title: '我的资源位', value: 'personal' }
            ]
            break
        case '4':
            result = [
                { title: '商品详情资源位', value: 'detailResource' }
            ]
            break
        case '5':
            result = [
                { title: '悬浮窗', value: 'suspension' }
            ]
            break
        case '6':
            result = [
                { title: '收益页资源位', value: 'profit' }
            ]
            break
        case '7':
            result = [
                { title: '查看物流', value: 'logistics' }
            ]
            break
        case '8':
            result = [
                { title: '激活潜在粉丝帮助', value: 'myFans' }
            ]
            break
        case '9':
            result = [
                { title: '搜索页资源位', value: 'searchPage' }
            ]
            break
        default:
            result = [
                { title: '邮票位', value: 'topResource' },
                { title: 'banner页', value: 'banner' },
                { title: '十大入口', value: 'entrance' },
                { title: '商品详情资源位', value: 'detailResource' },
                { title: '收益页资源位', value: 'profit' },
                { title: '我的资源位', value: 'personal' },
                { title: '启动页', value: 'screenAd' },
                { title: '悬浮窗', value: 'suspension' },
                { title: '查看物流', value: 'logistics' },
                { title: '激活潜在粉丝帮助', value: 'myFans' },
                { title: '搜索页资源位', value: 'searchPage' }
            ]
            break
    }
    return result
}

// 包含全部的页面资源联动
export const resourceAllOptions = [
    { title: '全部', value: 'all' },
    { title: '邮票位', value: 'topResource' },
    { title: 'banner页', value: 'banner' },
    { title: '十大入口', value: 'entrance' },
    { title: '商品详情资源位', value: 'detailResource' },
    { title: '收益页资源位', value: 'profit' },
    { title: '我的资源位', value: 'personal' },
    { title: '启动页', value: 'screenAd' },
    { title: '悬浮窗', value: 'suspension' },
    { title: '查看物流', value: 'logistics' },
    { title: '激活潜在粉丝帮助', value: 'myFans' },
    { title: '搜索页资源位', value: 'searchPage' }
]

export function getResourceAllOptions (val) {
    let result = []
    switch (val) {
        case '1':
            result = [
                { title: '邮票位', value: 'topResource' },
                { title: 'banner页', value: 'banner' },
                { title: '十大入口', value: 'entrance' },
            ]
            break
        case '2':
            result = [
                { title: '启动页', value: 'screenAd' }
            ]
            break
        case '3':
            result = [
                { title: '我的资源位', value: 'personal' }
            ]
            break
        case '4':
            result = [
                { title: '商品详情资源位', value: 'detailResource' }
            ]
            break
        case '5':
            result = [
                { title: '悬浮窗', value: 'suspension' }
            ]
            break
        case '6':
            result = [
                { title: '收益页资源位', value: 'profit' }
            ]
            break
        case '7':
            result = [
                { title: '查看物流', value: 'logistics' }
            ]
            break
        case '8':
            result = [
                { title: '激活潜在粉丝帮助', value: 'myFans' }
            ]
            break
        case '9':
            result = [
                { title: '搜索页资源位', value: 'searchPage' }
            ]
            break
        default:
            result = [
                { title: '全部', value: 'all' },
                { title: '邮票位', value: 'topResource' },
                { title: 'banner页', value: 'banner' },
                { title: '十大入口', value: 'entrance' },
                { title: '商品详情资源位', value: 'detailResource' },
                { title: '收益页资源位', value: 'profit' },
                { title: '我的资源位', value: 'personal' },
                { title: '启动页', value: 'screenAd' },
                { title: '悬浮窗', value: 'suspension' },
                { title: '查看物流', value: 'logistics' },
                { title: '激活潜在粉丝帮助', value: 'myFans' },
                { title: '搜索页资源位', value: 'searchPage' }
            ]
            break
    }
    return result
}

// 资源位和像素联动
export function getWidthAndHeigth (val) {
    let result = {}
    switch (val) {
        case 'banner':
            result = {
                width: 750,
                height: 300
            }
            break
        case 'topResource':
            result = {
                width: 750,
                height: 364
            }
            break
        case 'entrance':
            result = {
                width: 92,
                height: 92
            }
            break
        case 'profit':
            result = {
                width: 710,
                height: 166
            }
            break
        case 'suspension':
            result = {
                width: 140,
                height: 140
            }
            break
        case 'screenAd':
            result = {
                width: 750,
                height: 1334
            }
            break
        case 'logistics':
        case 'myFans':
            result = {
                width: 750,
                height: 364
            }
            break
        case 'detailResource':
        case 'personal':
        case 'searchPage':
            result = {
                width: 750,
                height: 170
            }
            break
        default:
            break
    }
    return result
}

// 表格图片显示及调整(长方形)
export function getTableImgShow (url, record) {
    const content = <a href={record.url} target="_blank">
        <img style={{ width: '500px', height: '400px', objectFit: 'contain' }} onError={(e) => {
            e.target.onerror = null;
            e.target.src = "images/default.jpg"
        }} src={url ? url : 'images/default.jpg'} /></a>
    return <Popover content={content}>
        <img style={{ width: '100px', height: '50px', objectFit: "contain" }} onError={(e) => {
            e.target.onerror = null;
            e.target.src = "images/default.jpg"
        }} src={url ? url : 'images/default.jpg'} />
    </Popover>
}

// 表格图片显示及调整(正方形)
export function getTableImgShowSpecial (url, record) {
    const content = <a href={record.url} target="_blank">
        <img style={{ width: '500px', height: '400px', objectFit: 'contain' }} onError={(e) => {
            e.target.onerror = null;
            e.target.src = "images/default.jpg"
        }} src={url ? url : 'images/default.jpg'} /></a>
    return <Popover content={content}>
        <img style={{ width: '50px', height: '50px', objectFit: "contain" }} onError={(e) => {
            e.target.onerror = null;
            e.target.src = "images/default.jpg"
        }} src={url ? url : 'images/default.jpg'} />
    </Popover>
}

export function getTableImgShowSpecialImg (url, record) {

    if (url && url.length == "1") {
        const content = <a href={record.url} target="_blank">
            <img style={{ width: '500px', height: '400px', objectFit: 'contain' }} onError={(e) => {
                e.target.onerror = null;
                e.target.src = "images/default.jpg"
            }} src={url[0] ? url[0].bannerImg : 'images/default.jpg'} /></a>
        return <Popover content={content}>
            <img style={{ width: '100px', height: '100px', objectFit: "contain" }} onError={(e) => {
                e.target.onerror = null;
                e.target.src = "images/default.jpg"
            }} src={url[0] ? url[0].bannerImg : 'images/default.jpg'} />
        </Popover>
    } else if (url && url.length == "2") {
        const content = <a href={record.url} target="_blank">
            <img style={{ width: '500px', height: '400px', objectFit: 'contain' }} onError={(e) => {
                e.target.onerror = null;
                e.target.src = "images/default.jpg"
            }} src={url[0] ? url[0].bannerImg : 'images/default.jpg'} /></a>
        const content1 = <a href={record.url} target="_blank">
            <img style={{ width: '500px', height: '400px', objectFit: 'contain' }} onError={(e) => {
                e.target.onerror = null;
                e.target.src = "images/default.jpg"
            }} src={url[1] ? url[1].bannerImg : 'images/default.jpg'} /></a>
        return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Popover content={content}>
                <img style={{ width: '100px', height: '100px', objectFit: "contain" }} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "images/default.jpg"
                }} src={url[0] ? url[0].bannerImg : 'images/default.jpg'} />
            </Popover>
            <Popover content={content1}>
                <img style={{ width: '100px', height: '100px', objectFit: "contain" }} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "images/default.jpg"
                }} src={url[1] ? url[1].bannerImg : 'images/default.jpg'} />
            </Popover>
        </div>

    }
    else if (url && url.length == "3") {
        const content = <a href={record.url} target="_blank">
            <img style={{ width: '500px', height: '400px', objectFit: 'contain' }} onError={(e) => {
                e.target.onerror = null;
                e.target.src = "images/default.jpg"
            }} src={url[0] ? url[0].bannerImg : 'images/default.jpg'} /></a>
        const content1 = <a href={record.url} target="_blank">
            <img style={{ width: '500px', height: '400px', objectFit: 'contain' }} onError={(e) => {
                e.target.onerror = null;
                e.target.src = "images/default.jpg"
            }} src={url[1] ? url[1].bannerImg : 'images/default.jpg'} /></a>
            const content2 = <a href={record.url} target="_blank">
            <img style={{ width: '500px', height: '400px', objectFit: 'contain' }} onError={(e) => {
                e.target.onerror = null;
                e.target.src = "images/default.jpg"
            }} src={url[2] ? url[2].bannerImg : 'images/default.jpg'} /></a>
        return <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Popover content={content}>
                <img style={{ width: '100px', height: '82px', objectFit: "contain" }} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "images/default.jpg"
                }} src={url[0] ? url[0].bannerImg : 'images/default.jpg'} />
            </Popover>
            <div  style={{ display: 'flex', flexDirection: 'column' }}>
               <Popover content={content1}>
                <img style={{ width: '100px', height: '41px', objectFit: "contain" }} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "images/default.jpg"
                }} src={url[1] ? url[1].bannerImg : 'images/default.jpg'} />
            </Popover>
            <Popover content={content2}>
                <img style={{ width: '100px', height: '41px', objectFit: "contain" }} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "images/default.jpg"
                }} src={url[2] ? url[2].bannerImg : 'images/default.jpg'} />
            </Popover> 
            </div>
            
        </div>

    }


}



// 组合会场表格操作按钮
export function getTableHandleAss (text, record, callback) {
    const deleteText = '删除'
    const stopText = '下架'
    const upText = '上架'
    const editText = '编辑'
    switch (text) {
        case 0:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(stopText, record, () => {
                            callback(stopText)
                        })
                    }}>下架</Button>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break
        case 1:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(upText, record, () => {
                            callback(upText)
                        })
                    }}>上架</Button>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break
        case 2:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(upText, record, () => {
                            callback(upText)
                        })
                    }}>上架</Button>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break

    }
}



// 二级页广告位表格操作按钮
export function getTableHandleTodaypush (text, record, callback) {
    const deleteText = '删除'
    const stopText = '停止'
    const editText = '编辑'
    switch (text) {
        case 1:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break
        case 2:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break
        case 0:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(stopText, record, () => {
                            callback(stopText)
                        })
                    }}>停止</Button>
            </span>
            break
        case 3:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break
        case 4:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
            </span>
    }
}

// 底部消息条表格操作按钮
export function getTableHandleBottom (text, record, callback) {
    const deleteText = '删除'
    const stopText = '停止'
    const editText = '编辑'
    switch (text) {
        case 0:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(stopText, record, () => {
                            callback(stopText)
                        })
                    }}>停止</Button>
            </span>
            break
        case 1:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break
        case 2:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break

    }
}

// 表格操作按钮
export function getTableHandle (text, record, callback) {
    const deleteText = '删除'
    const stopText = '停止'
    const editText = '编辑'
    switch (text) {
        case 0:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break
        case 2:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break
        case 1:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(stopText, record, () => {
                            callback(stopText)
                        })
                    }}>停止</Button>
            </span>
            break
        case 3:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
                <Button type={"primary"}
                    onClick={() => {
                        showStopOrDelete(deleteText, record, () => {
                            callback(deleteText)
                        })
                    }}>删除</Button>
            </span>
            break
        case 4:
            return <span>
                <Button type={"primary"}
                    onClick={() => {
                        callback(editText)
                    }}>编辑</Button>
            </span>
    }
}

export const showStopOrDelete = (text, record, callback) => {
    showConfirm(text, () => {
        callback()
    })
}
