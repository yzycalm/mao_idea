import React from "react";
import {format, showConfirm} from "../utils"
import {Button} from "antd/lib/index";
import {showStopOrDelete} from "./share";
import {getTableImgShowSpecial} from "./marketing";

// 新人免单
export function getNewPerson(callback) {
    return [{
        title: '排序',
        dataIndex: 'sort',
        width: 80,
        editable: true
    }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: text => {
            let result = ""
            switch(+text){
                case 1:
                    result = "新人免单"
                    break
                case 2:
                    result = "好物推荐"
                    break
                case 3:
                    result = "年货节"
                    break
            }
            return result
        }
    }, {
        title: '商品ID',
        dataIndex: 'gsId',
        key: 'gsId'
    }, {
        title: '商品名称',
        dataIndex: 'gsName',
        key: 'gsName',
        width: 200,
        render: (text, record) => {
            return <a className="word_break" target="_blank"
                      href={record.goodsUrl}
                   >{text}</a>
        }
    }, {
        title: '商品图片',
        dataIndex: 'gsUrl',
        key: 'gsUrl',
        render: (url, record) => {
            return getTableImgShowSpecial(url, record)
        }
    }, {
        title: '券后价(元)',
        dataIndex: 'finalPrice',
        key: 'finalPrice'
    }, {
        title: '优惠券金额(元)',
        dataIndex: 'couponAmount',
        key: 'couponAmount'
    }, {
        title: '最高补贴(元)',
        dataIndex: 'subsidy',
        key: 'subsidy'
    }, {
        title: '库存',
        dataIndex: 'stock',
        key: 'stock'
    }, {
        title: '虚拟销量',
        dataIndex: 'virtualValue',
        key: 'virtualValue'
    }, {
        title: '发布状态',
        dataIndex: 'status',
        key: 'status',
        render: text => {
            if (+text === 0) {
                return "未开始"
            } else {
                return +text === 1 ? "已上架" : "已下架"
            }
        }
    },
        {
            title: '上架时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render: text => {
                return format(text)
            }
        },
        {
            title: '操作',
            dataIndex: 'displayState',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (text, record) => {
                switch (+record.status) {
                    // 1: 下架， 2： 编辑， 3：删除
                    case 1:
                        return <span>
                         <Button type={"primary"}
                                 onClick={() => {
                                     showStopOrDelete('下架', record, () => {
                                         callback(1, record)
                                     })
                                 }}
                         >下架</Button>
                            <Button type={"primary"}
                                    onClick={() => {
                                        callback(2, record)
                                    }}
                            >编辑</Button>
                        </span>
                        break
                    default:
                        return <span>
                            <Button type={"primary"}
                                    onClick={() => {
                                        callback(2, record)
                                    }}
                            >编辑</Button>
                            <Button type={"primary"}
                                    onClick={() => {
                                        showStopOrDelete('删除', record, () => {
                                            callback(3, record)
                                        })
                                    }}
                            >删除</Button>
                        </span>
                        break
                }
            }
        }]
}

// 好物推荐
export function getNewGoods(callback) {
    return [{
        title: '排序',
        dataIndex: 'sort',
        width: 80,
        editable: true
    }, {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: text => {
            let result = ""
            switch(+text){
                case 1:
                    result = "新人免单"
                    break
                case 2:
                    result = "好物推荐"
                    break
                case 3:
                    result = "年货节"
                    break
            }
            return result
        }
    }, {
        title: '商品ID',
        dataIndex: 'gsId',
        key: 'gsId'
    }, {
        title: '商品名称',
        dataIndex: 'gsName',
        key: 'gsName',
        width: 200,
        render: (text, record) => {
            return <a className="word_break" target="_blank"
                      href={record.goodsUrl}
                   >{text}</a>
        }
    }, {
        title: '商品图片',
        dataIndex: 'gsUrl',
        key: 'gsUrl',
        render: (url, record) => {
            return getTableImgShowSpecial(url, record)
        }
    }, {
        title: '券后价(元)',
        dataIndex: 'finalPrice',
        key: 'finalPrice'
    }, {
        title: '优惠券金额(元)',
        dataIndex: 'couponAmount',
        key: 'couponAmount'
    }, {
        title: '发布状态',
        dataIndex: 'status',
        key: 'status',
        render: text => {
            if (+text === 0) {
                return "未开始"
            } else {
                return +text === 1 ? "已上架" : "已下架"
            }
        }
    },
        {
            title: '上架时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render: text => {
                return format(text)
            }
        },
        {
            title: '操作',
            dataIndex: 'displayState',
            key: 'action',
            width: 180,
            fixed: 'right',
            render: (text, record) => {
                switch (+record.status) {
                    case 1:
                        return <span>
                         <Button type={"primary"}
                                 onClick={() => {
                                     showStopOrDelete('下架', record, () => {
                                         callback(1, record)
                                     })
                                 }}
                         >下架</Button>
                            <Button type={"primary"}
                                    onClick={() => {
                                        callback(2, record)
                                    }}
                            >编辑</Button>
                        </span>
                        break
                    default:
                        return <span>
                            <Button type={"primary"}
                                    onClick={() => {
                                        callback(2, record)
                                    }}
                            >编辑</Button>
                            <Button type={"primary"}
                                    onClick={() => {
                                        showStopOrDelete('删除', record, () => {
                                            callback(3, record)
                                        })
                                    }}
                            >删除</Button>
                        </span>
                        break
                }
            }
        }]
}
