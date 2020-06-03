import React from "react";
import { getTableImgShowSpecial } from "./marketing";
import { Button, Tooltip, Icon, Popover, Tag, Modal } from "antd";
import { format, openNotificationWithIcon, isEmpty, isEmptyNum, jsToFormData } from "./index";
import { exportPro } from '../api/proposal/proposal'
import { collectGoods, commonHandle, exportGoods, revocationGoods, handleScalpingItem, deleteScalpingItem, handleScalpingItem4 } from "../api/commondity/attract"

/** 商品管理的公共方法 */
const confirm = Modal.confirm;
// 发布状态
export function getPublishStatusText (text) {
    let result = ''
    switch (text) {
        case 0:
            result = '全部'
            break
        case 1:
            result = '待审核'
            break
        case 2:
            result = '不通过'
            break
        case 3:
            result = '已上架'
            break
        case 4:
            result = '已下架'
            break
        case 5:
            result = '已结算'
            break
        case 6:
            result = '草稿'
            break
        case 7:
            result = '待上架'
        default:
            break
    }
    return result
}

// 招商商品默认列
export function defaultAttractColumns (callback) {
    return [
        {
            title: '合作时间',
            dataIndex: 'cooperationTime',
            width: 100,
            key: 'cooperationTime'
        },
        {
            title: '招商人员',
            dataIndex: 'updateBy',
            width: 100,
            key: 'updateBy',
            render: text => {
                return isEmpty(text)
            }
        }, {
            title: '店铺名称',
            dataIndex: 'shopName',
            width: 100,
            key: 'shopName',
            render: text => {
                return isEmpty(text)
            }
        }, {
            title: '商品名称',
            dataIndex: 'productName',
            width: 300,
            key: 'productName',
            render: (text, record) => {
                return text ? <span className="word_break">
                    <a href={record.productUrl ? record.productUrl : 'javascript:void(0);'} target="_blank">{getPlatformIcon(record.platform)} {text}</a>
                </span> : <span>'ᅳ'</span>
            }
        },
        {
            title: '预览图片',
            dataIndex: 'img',
            width: 100,
            key: 'img',
            render: (url, record) => {
                return getTableImgShowSpecial(url, record)
            }
        },
        {
            title: '券后价（元）',
            dataIndex: 'finalPrice',
            width: 120,
            key: 'finalPrice',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            special: true,
            otherTitle: '原价（元）',
            title: () => {
                return (
                    <span>原价（元）
                        <Tooltip placement="top" title="商品原价">
                            <Icon type="question-circle" style={{ color: 'grey' }} />
                        </Tooltip>
                    </span>
                );
            },
            dataIndex: 'orgPrice',
            width: 120,
            key: 'orgPrice',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '优惠券金额（元）',
            dataIndex: 'coupon',
            width: 150,
            key: 'coupon',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '佣金比例',
            dataIndex: 'commissionRate',
            width: 100,
            key: 'commissionRate',
            render: text => {
                return text ? (text * 100).toFixed(2) + '%' : '0'
            }
        },
        {
            title: '优惠券有效期',
            dataIndex: 'couponStartTime',
            width: 180,
            key: 'couponStartTime',
            render: (text, record) => {
                return <span className="word_break">{record.couponStartTime && record.couponEndTime ? format(text) + '-' + format(record.couponEndTime) : 'ᅳ'}</span>
            }
        }, {
            title: '红人装实际销量',
            dataIndex: 'saleVolume',
            width: 150,
            key: 'saleVolume',
            render: text => {
                return isEmptyNum(text)
            }
        }, {
            title: '服务费结算销量',
            dataIndex: 'serviceFeeSettleAmount',
            width: 150,
            key: 'serviceFeeSettleAmount',
            render: text => {
                return isEmptyNum(text)
            }
        }, {
            title: '服务费结算金额（元）',
            dataIndex: 'serviceFeeSettleVolume',
            width: 180,
            key: 'serviceFeeSettleVolume',
            render: text => {
                return isEmptyNum(text)
            }
        }, {
            title: '服务费结算时间',
            dataIndex: 'serviceFeeSettleTime',
            width: 150,
            key: 'serviceFeeSettleTime',
            render: (text, record) => {
                return text ? format(text) : 'ᅳ'
            }
        }, {
            title: '备注',
            dataIndex: 'remark',
            width: 150,
            key: 'remark',
            render: text => {
                return isEmpty(text)
            }
        }, {
            title: '发布状态',
            dataIndex: 'publishStatus',
            width: 100,
            key: 'publishStatus',
            render: (text, record) => {
                if (text === 2) {
                    const content = <div>{record.nopassReason}</div>
                    return <Popover content={content}>
                        <span style={{ color: text === 2 ? 'red' : '' }}>{getPublishStatusText(text)}</span>
                    </Popover>
                } else {
                    return <span>{getPublishStatusText(text)}</span>
                }
            }
        }, {
            title: '录入时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text, record) => {
                return format(text)
            }
        }, {
            title: '操作',
            dataIndex: 'publishStatus',
            key: 'action',
            width: 60,
            align: 'center',
            fixed: 'right',
            render: (text, record) => {
                return getTableHandle(text, record, 1, (item) => {
                    const params = {
                        list: [record.id],
                        merchantsId: '',
                        nopassReason: ''
                    }
                    switch (item) {
                        case '撤销':
                            removeGoods(record, '撤销', callback)
                            break
                        case '编辑':
                            callback(1, record)
                            break
                        case '删除':
                            params.operateType = 2
                            handleGoods(params, '删除', callback)
                            break
                        case '下架':
                            params.operateType = 0
                            handleGoods(params, '下架', callback)
                            break
                        case '结算':
                            callback(2, record)
                            break
                        case '续券':
                            callback(3, record)
                            break
                        default: break
                    }
                })
            }
        }
    ]
}

// 运营商品默认列
export function defaultOperateColumns (callback) {
    return [
        {
            title: '商品名称',
            dataIndex: 'productName',
            width: 300,
            key: 'productName',
            fixed: 'left',
            render: (text, record) => {
                return text ? <span className="word_break"><a
                    href={record.productUrl ? record.productUrl : 'javascript:void(0);'} target="_blank"
                                                           >{getPlatformIcon(record.platform)} {text}</a></span> :
                    <span>ᅳ</span>
            }
        },
        {
            title: '预览图片',
            dataIndex: 'img',
            width: 100,
            key: 'img',
            render: (url, record) => {
                return getTableImgShowSpecial(url, record)
            }
        },
        {
            title: '券后价/折后价（元）',
            dataIndex: 'finalPrice',
            width: 180,
            key: 'finalPrice',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            special: true,
            otherTitle: '原价（元）',
            title: () => {
                return (
                    <span>原价（元）
                        <Tooltip placement="top" title="商品原价">
                            <Icon type="question-circle" style={{ color: 'grey' }} />
                        </Tooltip>
                    </span>
                );
            },
            dataIndex: 'orgPrice',
            width: 150,
            key: 'orgPrice',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '优惠券金额（元）',
            dataIndex: 'coupon',
            width: 150,
            key: 'coupon',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '佣金比例',
            dataIndex: 'commissionRate',
            width: 100,
            key: 'commissionRate',
            render: text => {
                return text ? (text * 100).toFixed(2) + '%' : '0'
            }
        },
        {
            title: '优惠券有效期',
            dataIndex: 'couponStartTime',
            width: 180,
            key: 'couponStartTime',
            render: (text, record) => {
                return <span className="word_break">{record.couponStartTime && record.couponEndTime ? format(text) + '-' + format(record.couponEndTime) : 'ᅳ'}</span>
            }
        }, {
            title: '第三方平台销量',
            dataIndex: 'thirdSaleVolume',
            width: 150,
            key: 'thirdSaleVolume',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '红人装实际销量',
            dataIndex: 'saleVolume',
            width: 150,
            key: 'saleVolume',
            render: text => {
                return isEmptyNum(text)
            }
        }, {
            title: '上架-下架时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (text, record) => {
                return <span className="word_break">{record.startTime && record.endTime ? format(text) + '-' + format(record.endTime) : 'ᅳ'}</span>
            }
        }, {
            title: '发布状态',
            dataIndex: 'publishStatus',
            width: 100,
            key: 'publishStatus',
            render: (text, record) => {
                if (text === 2) {
                    const content = <div>{record.nopassReason}</div>
                    return <Popover content={content}>
                        <span style={{ color: text === 2 ? 'red' : '' }}>{getPublishStatusText(text)}</span>
                    </Popover>
                } else {
                    return <span>{getPublishStatusText(text)}</span>
                }
            }
        }, {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            width: 300,
            render: text => {
                return <span style={{width: '300px', '-webkit-box-orient': 'vertical'}} className="omit-3">{ text }</span>
            }
        }, {
            title: '最近编辑时间',
            dataIndex: 'updateTime',
            width: 150,
            key: 'updateTime',
            render: text => {
                return format(text)
            }
        }, {
            title: '操作人',
            dataIndex: 'updateBy',
            key: 'updateBy',
            render: text => {
                return isEmpty(text)
            }
        }, {
            title: '操作',
            dataIndex: 'publishStatus',
            key: 'action',
            width: 60,
            fixed: 'right',
            render: (text, record) => {
                return getTableHandle(text, record, 0, (item) => {
                    const params = {
                        list: [record.id],
                        merchantsId: '',
                        nopassReason: ''
                    }
                    switch (item) {
                        case '撤销':
                            removeGoods(record, '撤销', callback)
                            break
                        case '编辑':
                            callback(1, record)
                            break
                        case '删除':
                            params.operateType = 2
                            handleGoods(params, '删除', callback)
                            break
                        case '下架':
                            params.operateType = 0
                            handleGoods(params, '下架', callback)
                            break
                        default: break
                    }
                })
            }
        }
    ]
}

// 精选商品
export function defaultAllColumns (callback) {
    return [
        {
            title: '排序',
            dataIndex: 'sequence',
            width: 80,
            key: 'sequence',
            editable: true,
            sorter: (a, b) => a.sequence - b.sequence
        }, {
            title: '商品库',
            dataIndex: 'productType',
            width: 120,
            key: 'productType',
            render: (text) => {
                return text === 0 ? '运营商品库' : '招商商品库'
            }
        }, {
            title: '商品名称',
            dataIndex: 'productName',
            width: 300,
            key: 'productName',
            render: (text, record) => {
                return text ? <span className="word_break"><a
                    href={record.productUrl ? record.productUrl : 'javascript:void(0);'} target="_blank"
                                                           >{getPlatformIcon(record.platform)} {text}</a></span> : 'ᅳ'
            }
        },
        {
            title: '预览图片',
            dataIndex: 'img',
            width: 100,
            key: 'img',
            render: (url, record) => {
                return getTableImgShowSpecial(url, record)
            }
        },
        {
            title: '券后价（元）',
            dataIndex: 'finalPrice',
            width: 150,
            key: 'finalPrice',
            sorter: (a, b) => a.finalPrice - b.finalPrice,
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            special: true,
            otherTitle: '原价（元）',
            title: () => {
                return (
                    <span>原价（元）
                        <Tooltip placement="top" title="商品原价">
                            <Icon type="question-circle" style={{ color: 'grey' }} />
                        </Tooltip>
                    </span>
                );
            },
            dataIndex: 'orgPrice',
            width: 150,
            key: 'orgPrice',
            sorter: (a, b) => a.orgPrice - b.orgPrice,
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '优惠券金额（元）',
            dataIndex: 'coupon',
            width: 180,
            key: 'coupon',
            sorter: (a, b) => a.coupon - b.coupon,
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '佣金比例',
            dataIndex: 'commissionRate',
            width: 120,
            key: 'commissionRate',
            render: text => {
                return text ? (text * 100).toFixed(2) + '%' : '0'
            },
            sorter: (a, b) => a.commissionRate - b.commissionRate,

        },
        {
            title: '优惠券有效期',
            dataIndex: 'couponStartTime',
            width: 180,
            key: 'couponStartTime',
            render: (text, record) => {
                return <span className="word_break">{record.couponStartTime && record.couponEndTime ? format(text) + '-' + format(record.couponEndTime) : 'ᅳ'}</span>
            }
        }, {
            title: '第三方平台销量',
            dataIndex: 'thirdSaleVolume',
            width: 150,
            key: 'thirdSaleVolume',
            render: text => {
                return isEmptyNum(text)
            }
        }, {
            title: '红人装实际销量',
            dataIndex: 'saleVolume',
            width: 150,
            key: 'saleVolume',
            render: text => {
                return isEmptyNum(text)
            }
        }, {
            title: '上架时间',
            dataIndex: 'startTime',
            width: 120,
            key: 'startTime',
            render: text => {
                return <span>{text ? format(text) : '/'}</span>
            },
            sorter: (a, b) => a.startTime - b.startTime
        }, {
            title: '下架时间',
            dataIndex: 'endTime',
            width: 120,
            key: 'endTime',
            render: text => {
                return <span>{text ? format(text) : '/'}</span>
            },
            sorter: (a, b) => a.endTime - b.endTime
        }, {
            title: '最近编辑时间',
            dataIndex: 'updateTime',
            width: 150,
            key: 'updateTime',
            render: text => {
                return format(text)
            }
        }, {
            title: '发布状态',
            dataIndex: 'publishStatus',
            width: 100,
            key: 'publishStatus',
            render: (text, record) => {
                if (text === 2) {
                    const content = <div>{record.nopassReason}</div>
                    return <Popover content={content}>
                        <span style={{ color: text === 2 ? 'red' : '' }}>{getPublishStatusText(text)}</span>
                    </Popover>
                } else {
                    return <span>{getPublishStatusText(text)}</span>
                }
            }
        },
        {
            title: '操作人',
            dataIndex: 'updateBy',
            key: 'updateBy',
            render: text => {
                return isEmpty(text)
            }
        }, {
            title: '操作',
            dataIndex: 'publishStatus',
            key: 'action',
            width: 60,
            fixed: 'right',
            render: (text, record) => {
                return getTableHandle(text, record, 2, (item) => {
                    const params = {
                        list: [record.id],
                        merchantsId: '',
                        nopassReason: ''
                    }
                    switch (item) {
                        case '删除':
                            params.operateType = 2
                            handleGoods(params, '删除', callback)
                            break
                        case '上架':
                            params.operateType = 1
                            handleGoods(params, '上架', callback)
                            break
                        case '下架':
                            params.operateType = 0
                            handleGoods(params, '下架', callback)
                            break
                        case '不通过':
                            callback(3, record)
                            break
                            default:break
                    }
                })
            }
        }
    ]
}

// 自营商品默认列
export function defaultScalpingColumns (callback) {
    return [
        {
            title: '商品名称',
            dataIndex: 'name',
            width: 200,
            key: 'name',
            fixed: 'left',
            render: (text, record) => {
                const colors = ['orange', 'lime', 'orange', 'lime', 'orange', 'lime', 'orange', 'lime', 'orange', 'lime', 'orange', 'lime']
                return <span >
                    <div style={{ float: 'left', marginRight: "10px" }}> {getTableImgShowSpecial(record.thumb, record)}</div>
                    <div style={{ float: 'left', display: 'flex', flexDirection: "column", justifyContent: "space-around" }}>
                        <span style={{ marginBottom: "10px", width: "100px" }}>{text}</span>
                        <div>
                            {
                                record.sku_label.map((item, index) => {
                                    return <Tag key={index + item} color={colors[index]}>{item.name}</Tag>
                                })
                            }
                        </div>
                    </div>
                </span>
            }
        },
        {
            title: '库存(件)',
            dataIndex: 'stock',
            key: 'stock',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '市场价(元)',
            dataIndex: 'price',
            key: 'price',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '购买价(元)',
            dataIndex: 'auth680 ',
            key: 'auth680',
            render: ((text, record) => {
                return <span>
                    <div style={{ marginBottom: '5px' }}><Tag color="magenta">粉丝</Tag>{record.auth0}</div>
                    <div style={{ marginBottom: '5px' }}><Tag color="gold">皇冠</Tag>{record.auth198}</div>
                    <div><Tag color="purple">店主</Tag>{record.auth680}</div>
                </span>
            })
        },
        {
            title: '店主进货价',
            dataIndex: 'auth_agent',
            key: 'auth_agent',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '佣金总金额(元)',
            dataIndex: 'market',
            key: 'market',
            render: (text, record) => {
                return <span> {record.profile_auth198 && record.profile_auth680 ? (parseInt(record.profile_auth198) + parseInt(record.profile_auth680)).toFixed(2) : '0'}</span>
            }
        }, {
            title: '基础佣金(元)',
            dataIndex: 'profile_auth198',
            key: 'profile_auth198',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '专享佣金(元)',
            dataIndex: 'profile_auth680',
            key: 'profile_auth680',
            render: text => {
                return isEmptyNum(text)
            }
        }, {
            title: '发布状态',
            dataIndex: 'state_sale',
            key: 'state_sale',
            render: (text, record) => {
                return <span>{text === 1 ? '已上架' : '已下架'}</span>
            }
        }, {
            title: '最近操作时间',
            dataIndex: 'update_time',
            key: 'update_time',
            render: text => {
                return isEmpty(text)
            }
        }, {
            title: '操作人',
            dataIndex: 'updateBy',
            key: 'updateBy',
            render: text => {
                return isEmpty(text)
            }
        }, {
            title: '操作',
            dataIndex: 'publishStatus',
            key: 'publishStatus',
            width: 60,
            fixed: 'right',
            render: (text, record) => {
                return getTableHandle(record.state_sale, record, 3, (item) => {
                    switch (item) {
                        case '上架':
                            handleGoodsSaleState(record, 1, callback)
                            break
                        case '下架':
                            handleGoodsSaleState(record, 2, callback)
                            break
                        case '删除':
                            deleteScalpingGoods(record, 1, callback)
                            break
                        case '详情':
                            callback(1, record)
                            break
                            default:break
                    }
                })
            }
        }
    ]
}

// 获取标签
function getTagShow (val) {
    let result
    switch (+val) {
        case 0:
            result = <Tag color={'orange'}>精选</Tag>
            break
        case 1:
            result = <Tag color={'lime'}>推荐</Tag>
            break
        case 2:
            result = <div><Tag color={'orange'}>推荐</Tag> <Tag color={'lime'}>精选</Tag></div>
            break
        default: break
    }
    return result
}
// 自营商品默认列4.0
export function defaultScalpingColumns4 (callback) {
    return [
        {
            title: '商品名称',
            dataIndex: 'goodsTitle',
            width: 200,
            fixed: 'left',
            key: 'goodsTitle',
            render: (text, record) => {
                return <span >
                    <div style={{ float: 'left', marginRight: '10px' }}> {getTableImgShowSpecial(record.goodsImg, record)}</div>
                    <div style={{ float: 'left', display: 'flex', flexDirection: "column", justifyContent: "space-around" }}>
                        <span style={{ marginBottom: "10px", width: "100px" }}> {text}</span>
                        <div>{getTagShow(record.showPlace)}</div>
                    </div>
                </span>
            }
        },
        {
            title: '库存(件)',
            dataIndex: 'remainVolume',
            key: 'remainVolume',
            render: text => {
                return isEmptyNum(text)
            }
        },
        {
            title: '市场价(元)',
            dataIndex: 'marketPrice',
            key: 'marketPrice',
            render: text => {
                return isEmptyNum(text.toFixed(2))
            }
        },
        {
            title: '购买价(元)',
            dataIndex: 'orgPrice',
            key: 'orgPrice',
            render: text => {
                return isEmptyNum(text.toFixed(2))
            }
        },
        {
            title: '店主进货价(元)',
            dataIndex: 'shopmanStockPrice',
            key: 'shopmanStockPrice',
            render: text => {
                return isEmptyNum(text.toFixed(2))
            }
        },
        {
            title: '佣金总金额(元)',
            dataIndex: 'totalCommission',
            key: 'totalCommission',
            render: text => {
                return isEmptyNum(text.toFixed(2))
            }
        }, {
            title: '基础佣金(元)',
            dataIndex: 'commBasicComm',
            key: 'commBasicComm',
            render: text => {
                return isEmptyNum(text.toFixed(2))
            }
        },
        {
            title: '专享佣金(元)',
            dataIndex: 'commSpecialComm',
            key: 'commSpecialComm',
            render: text => {
                return isEmptyNum(text.toFixed(2))
            }
        }, {
            title: '发布状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                return <span>{getNewPublicState(text)}</span>
            }
        }, {
            title: '最近操作时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            render: text => {
                return isEmpty(text)
            }
        }, {
            title: '操作人',
            dataIndex: 'createBy',
            key: 'createBy',
            render: text => {
                return isEmpty(text)
            }
        }, {
            title: '操作',
            dataIndex: 'status',
            key: 'publishStatus',
            width: 60,
            fixed: 'right',
            render: (text, record) => {
                return getTableHandle(record.status, record, 4, (item) => {
                    switch (item) {
                        case '上架':
                            deleteOrStandScalpingGoods(record, 1, callback)
                            break
                        case '下架':
                            deleteOrStandScalpingGoods(record, 4, callback)
                            break
                        case '删除':
                            deleteOrStandScalpingGoods(record, 5, callback)
                            break
                        case '详情':
                            callback(1, record)
                            break
                        default: break
                    }
                })
            }
        }
    ]
}
// 获取4.0发布状态
export function getNewPublicState (text) {
    let result = ''
    switch (+text) {
        case 0:
            result = '审核中'
            break
        case 1:
            result = '待上架'
            break
        case 2:
            result = '已上架'
            break
        case 3:
            result = '已下架'
            break
        case 4:
            result = '审核不通过'
            break
        case 5:
            result = '删除'
            break
        default:
            break
    }
    return result
}

// 获取设置字段值
export const checkBoxValue = (defaultColumns) => {
    const result = []
    defaultColumns.map((item, index) => {
        result.push(item.key)
    })
    return result
}
export const checkBoxGroup = (defaultColumns) => {
    const result = []
    defaultColumns.map((item, index) => {
        if (item.special) {
            result.push({
                label: item.otherTitle,
                value: item.key
            })
        } else {
            result.push({
                label: item.title,
                value: item.key
            })
        }
    })
    return result
}

// 表格操作按钮
export function getTableHandle (text, record, tag, callback) {
    const revocation = '撤销'
    const noPss = '不通过'
    const deleteText = '删除'
    const soldOut = '下架'
    const soldIn = '上架'
    const close = '结算'
    const continueStamps = '续券'
    const editText = '编辑'
    const detailText = '详情'
    // 根据商品类型显示不同按钮
    if (tag === 1) {
        switch (text) {
            case 1:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(revocation, record, () => {
                                callback(revocation)
                            })
                        }} style={{ marginBottom: '10px' }}
                    >{revocation}</Button>
                </span>
                break
            case 2:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(editText)
                        }} style={{ marginBottom: '10px' }}
                    >{editText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            case 3:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(soldOut, record, () => {
                                callback(soldOut)
                            })
                        }}
                    >{soldOut}</Button>
                </span>
                break
            case 4:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(close)
                        }}
                    >{close}</Button>
                </span>
                break
            case 5:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(continueStamps)
                        }}
                    >{continueStamps}</Button>
                </span>
                break
            case 6:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(editText)
                        }} style={{ marginBottom: '10px' }}
                    >{editText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            case 7:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(editText)
                        }} style={{ marginBottom: '10px' }}
                    >{editText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            default:
                break
        }
    } else if (tag === 0) {
        switch (text) {
            case 1:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(revocation, record, () => {
                                callback(revocation)
                            })
                        }} style={{ marginBottom: '10px' }}
                    >{revocation}</Button>
                </span>
                break
            case 2:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(editText)
                        }} style={{ marginBottom: '10px' }}
                    >{editText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            case 3:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(soldOut, record, () => {
                                callback(soldOut)
                            })
                        }}
                    >{soldOut}</Button>
                </span>
                break
            case 4:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(editText)
                        }} style={{ marginBottom: '10px' }}
                    >{editText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            case 6:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(editText)
                        }} style={{ marginBottom: '10px' }}
                    >{editText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            case 7:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(editText)
                        }} style={{ marginBottom: '10px' }}
                    >{editText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            default:
                break
        }
    } else if (tag === 2) {
        switch (text) {
            case 1:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(soldIn, record, () => {
                                callback(soldIn)
                            })
                        }} style={{ marginBottom: '10px' }}
                    >{soldIn}</Button>
                    <Button type={"primary"} style={{ display: record.platform === 0 ? 'block' : 'none' }}
                        onClick={() => {
                            callback(noPss)
                        }} style={{ margin: '0 0 10px 0' }}
                    >{noPss}</Button>
                </span>
                break
            case 2:
                return <span />
                break
            case 3:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(soldOut, record, () => {
                                callback(soldOut)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{soldOut}</Button>
                </span>
                break
            case 4:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(soldIn, record, () => {
                                callback(soldIn)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{soldIn}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            case 7:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            default:
                break
        }
    } else if (tag === 3) {
        switch (text) {
            case 1:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(detailText)
                        }} style={{ marginBottom: '10px' }}
                    >{detailText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(soldOut, record, () => {
                                callback(soldOut)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{soldOut}</Button>
                </span>
                break
            case 2:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(detailText)
                        }} style={{ marginBottom: '10px' }}
                    >{detailText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            if (record.stock === 0) {
                                openNotificationWithIcon('warning', `该商品库存为0，无法上架，请及时补货`)
                                return;
                            }
                            showStopOrDelete(soldIn, record, () => {
                                callback(soldIn)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{soldIn}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            default:
                break
        }
    } else if (tag === 4) {
        switch (text) {
            case 2:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(detailText)
                        }} style={{ marginBottom: '10px' }}
                    >{detailText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(soldOut, record, () => {
                                callback(soldOut)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{soldOut}</Button>
                </span>
                break
            case 3:
                return <span>
                    <Button type={"primary"}
                        onClick={() => {
                            callback(detailText)
                        }} style={{ marginBottom: '10px' }}
                    >{detailText}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            if (+record.remainVolume === 0) {
                                openNotificationWithIcon('warning', `该商品库存为0，无法上架，请及时补货`)
                                return;
                            }
                            showStopOrDelete(soldIn, record, () => {
                                callback(soldIn)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{soldIn}</Button>
                    <Button type={"primary"}
                        onClick={() => {
                            showStopOrDelete(deleteText, record, () => {
                                callback(deleteText)
                            })
                        }} style={{ margin: '0 0 10px 0' }}
                    >{deleteText}</Button>
                </span>
                break
            default:
                break
        }
    }
}

export const showStopOrDelete = (text, record, callback) => {
    showConfirm(text, () => {
        callback()
    })
}
export const showConfirm = (text, callback) => {
    confirm({
        title: '提示',
        content: `确定${text}该商品？`,
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
// 根据商铺显示图标
export function getPlatformIcon (platform) {
    let iconName = "taobao"
    switch (platform) {
        case 2:
            iconName = 'taobao'
            break
        case 3:
            iconName = 'jindong'
            break
        case 4:
            iconName = 'weipinhui'
            break
        case 7:
            iconName = 'pinduoduo'
            break
    }
    return <img style={{ width: '18px', height: '18px', objectFit: 'contain' }} src={`images/${iconName}.png`} />
}
// 编辑 | 下架 | 结算 | 续券 | 删除
export function handleGoods (params, handleTip, callback) {
    commonHandle(params).then(res => {
        callback(res)
        if (res && res.success) {
            openNotificationWithIcon('success', handleTip + '该项成功！')
        } else {
            openNotificationWithIcon('error', handleTip + '该项失败！')
        }
    })
}
// 撤销
export function removeGoods (record, handleTip, callback) {
    const params = {
        id: record.id,
        merchantsId: record.merchantsId,
        publishStatus: 6
    }
    revocationGoods(params).then(res => {
        if (res && res.success) {
            openNotificationWithIcon('success', handleTip + '该项成功！')
            callback()
        } else {
            openNotificationWithIcon('error', handleTip + '该项失败！')
        }
    })
}

// 导出
export function onExportGoodList (params, callback) {
    exportGoods(params).then(res => {
        callback()
        if (res && res.success) {
            const a = document.createElement('a'); // 创建a标签
            a.setAttribute('href', res.data);// href链接
            a.click();// 自执行点击事件
            a.remove()
        } else {
            openNotificationWithIcon('error', `导出失败！`)
        }
    })
}

// 建议
export function onExportGoodListPro (params, callback) {
    exportPro(params).then(res => {
        callback()
        if (res && res.success) {
            const a = document.createElement('a'); // 创建a标签
            a.setAttribute('href', res.data);// href链接
            a.click();// 自执行点击事件
            a.remove()
        } else {
            openNotificationWithIcon('error', `导出失败！`)
        }
    })
}

// 获取汇总信息
export function getCollectTable (type, callback) {
    const params = { productType: type }
    collectGoods(params).then(res => {
        if (res && res.success) {
            callback(res.data)
        }
    })
}

// 自营商品上下架
export function handleGoodsSaleState (record, type, callback) {
    const params = {
        id: record.id,
        state_sale: type
    }
    handleScalpingItem(jsToFormData(params)).then(res => {
        if (res && +res.code === 1) {
            callback()
            if (type === 1 && record.stock > 0 && record.stock < 10) {
                openNotificationWithIcon('warning', `该商品库存小于10件，请及时补货`)
            } else {
                openNotificationWithIcon('success', type === 1 ? '已成功上架' : '已成功下架' + '该商品！')
            }
        } else {
            openNotificationWithIcon('error', res.msg)
        }
    })
}
// 自营商品删除
export function deleteScalpingGoods (record, type, callback) {
    const params = {}
    switch (type) {
        case 1: params.id = record.id
            break
        case 2: params.ids = record.sku_ids
            break
        case 3: params.ids = record.sku_ids
            params.state_sale = 2
            break
        default: break
    }
    if (type === 3) {
        handleScalpingItem(jsToFormData(params)).then(res => {
            if (res && +res.code === 1) {
                callback()
                openNotificationWithIcon('success', `已成功批量下架${params.ids.length}件商品！`)
            } else {
                openNotificationWithIcon('error', res.msg)
            }
        })
    } else {
        deleteScalpingItem(jsToFormData(params)).then(res => {
            if (res && +res.code === 1) {
                callback()
                openNotificationWithIcon('success', type === 2 ? `已成功删除${params.ids.length}件商品` : '已成功删除该商品！')
            } else {
                openNotificationWithIcon('error', res.msg)
            }
        })
    }
}

// 自营商品上下架 || 删除
export function deleteOrStandScalpingGoods (record, type, callback) {
    const params = {}
    switch (type) {
        case 1:
            params.flag = 1
            params.goodsCode = record.goodsCodes ? record.goodsCodes : [record.goodsCode]
            break
        case 2:
        case 4:
            params.flag = 2
            params.goodsCode = record.goodsCodes ? record.goodsCodes : [record.goodsCode]
            break
        case 3:
        case 5:
            params.flag = 3
            params.goodsCode = record.goodsCodes ? record.goodsCodes : [record.goodsCode]
            break
        default: break
    }
    handleScalpingItem4(params).then(res => {
        if (res && res.success) {
            callback()
            if (type === 1 && +record.remainVolume > 0 && +record.remainVolume < 10) {
                openNotificationWithIcon('warning', `该商品库存小于10件，请及时补货`)
                return
            }
            if (type === 1) {
                openNotificationWithIcon('success', `已成功上架该商品！`)
                return;
            }
            if (type === 4) {
                openNotificationWithIcon('success', `已成功下架该商品！`)
                return;
            }
            if (type === 5) {
                openNotificationWithIcon('success', `已成功删除该商品！`)
                return;
            }
            openNotificationWithIcon('success', `已成功批量${judgeHandleType(type)}${params.goodsCode.length}件商品！`)
        } else {
            openNotificationWithIcon('error', res.message)
        }
    })
}
function judgeHandleType (type) {
    let result = ""
    if (type === 1) {
        result = "上架"
    } else if (type === 2) {
        result = "下架"
    } else {
        result = "删除"
    }
    return result
}
