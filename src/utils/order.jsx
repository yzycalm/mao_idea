/** 订单归纳方法 */
import React from "react";
import {Button, Modal, Tag, Popover,List} from "antd";
import {showConfirm, isEmpty,openNotificationWithIcon} from "./index";
import {getTableImgShow, getTableImgShowSpecial} from "./marketing";
import {viewScalpingOrder} from "../api/orders/orderList";
import {viewScalpingOrder4} from "../api/orders/orderList";

const confirm = Modal.confirm;

export function getPlatformStatus(status) {
    let result = ''
    switch (status) {
        case 0:
            result = '全部'
            break
        case 1:
            result = '自营'
            break
        case 2:
            result = '淘宝'
            break
        case 3:
            result = '京东'
            break
        case 4:
            result = '唯品会'
            break
        case 5:
            result = '线下'
            break
        case 7:
            result = '拼多多'
            break
        default:
            break
    }
    return result
}

export function getColumnOrderStatus(status) {
    let result = ''
    switch (status) {
        case 1:
            result = '待结算'
            break
        case 2:
            result = '已结算'
            break
        case 3:
            result = '已失效'
            break
        case 4:
            result = '维权'
            break
        default:
            break
    }
    return result
}

//自营商品订单管理状态
export function getScalpingOrder(status) {
    let result = ''
    switch (+status) {
        case 0:
            result = '全部'
            break
        case 1:
            result = '未支付'
            break
        case 2:
            result = '已支付'
            break
        case 3:
            result = '已发货'
            break
        case 4:
            result = '已完成'
            break
        case 5:
            result = '已失效'
            break
        case 6:
            result = '已退款'
            break
        default:
            break
    }
    return result
}
//自营商品订单管理状态4.0
export function getScalpingOrder4(status) {
    let result = ''
    switch (+status) {
        case 0:
            result = '未支付'
            break
        case 1:
            result = '已支付'
            break
        case 2:
            result = '已退款'
            break
        case 3:
            result = '已发货'
            break
        case 4:
            result = '已完成'
            break
        case 5:
            result = '已失效'
            break

        default:
            break
    }
    return result
}

export function getBackOrderStatus(status) {
    let result = ''
    switch (status) {
        case 0:
            result = '未处理'
            break
        case 1:
            result = '补单成功'
            break
        case 2:
            result = '未找到'
            break
        case 3:
            result = '补单失败'
            break
        default:
            break
    }
    return result
}
// 购买时的级别
export function getUserLevel(level) {
    let result = ""
    switch (+level) {
        case 0:
            result = '粉丝'
            break
        case 1:
            result = '皇冠'
            break
        case 2:
            result = '店主'
            break
        default:
            break
    }
    return result
}

// 自营商品订单表格操作按钮
export function getTableHandle(text, record, callback) {
    const details = '详情'
    const closeTheOrder = '关闭订单'
    const deliverGoods = '发货'
    const refund = '退款'
    switch (+text) {
        case 1:
            return <span>
                <Button type={"primary"}
                        onClick={() => {
                            callback(details)
                        }} style={{marginBottom: '10px'}}>详情</Button>
                <Button type={"primary"}
                        onClick={() => {
                            closeOrder(closeTheOrder, record, () => {
                                callback(closeTheOrder)
                            })
                        }} style={{margin: '0 0 10px 0'}}>关闭订单</Button>
            </span>
            break
        case 2:
            return <span>
                <Button type={"primary"}
                        onClick={() => {
                            callback(details)
                        }} style={{marginBottom: '10px'}}>详情</Button>
                <Button type={"primary"}
                        onClick={() => {
                            callback(deliverGoods)
                        }} style={{margin: '0 0 10px 0'}}>发货</Button>
                <Button type={"primary"}
                        onClick={() => {
                            callback(refund)
                        }} style={{margin: '0 0 10px 0'}}>退款</Button>
            </span>
            break
        case 3:
        case 4:
            return <span>
                <Button type={"primary"}
                        onClick={() => {
                            callback(details)
                        }} style={{marginBottom: '10px'}}>详情</Button>
                <Button type={"primary"}
                        onClick={() => {
                            callback(refund)
                        }} style={{margin: '0 0 10px 0'}}>退款</Button>
            </span>
            break
        case 5:
        case 6:
            return <span>
                <Button type={"primary"}
                        onClick={() => {
                            callback(details)
                        }}>详情</Button>
            </span>
    }
}
// 自营商品订单表格操作按钮4.0
export function getNewTableHandle(text, record, callback) {
    const details = '详情'
    const closeTheOrder = '关闭订单'
    const deliverGoods = '发货'
    const refund = '退款'
    switch (+text) {
        case 0:
            return <span>
                <Button type={"primary"}
                        onClick={() => {
                            callback(details)
                        }} style={{marginBottom: '10px'}}>详情</Button>
                <Button type={"primary"}
                        onClick={() => {
                            closeOrder(closeTheOrder, record, () => {
                                callback(closeTheOrder)
                            })
                        }} style={{margin: '0 0 10px 0'}}>关闭订单</Button>
            </span>
            break
        case 1:
            return <span>
                <Button type={"primary"}
                        onClick={() => {
                            callback(details)
                        }} style={{marginBottom: '10px'}}>详情</Button>
                <Button type={"primary"}
                        onClick={() => {
                            callback(deliverGoods)
                        }} style={{margin: '0 0 10px 0'}}>发货</Button>
                <Button type={"primary"}
                        onClick={() => {
                            callback(refund)
                        }} style={{margin: '0 0 10px 0'}}>退款</Button>
            </span>
            break
        case 3:
        case 4:
            return <span>
                <Button type={"primary"}
                        onClick={() => {
                            callback(details)
                        }} style={{marginBottom: '10px'}}>详情</Button>
                <Button type={"primary"}
                        onClick={() => {
                            callback(refund)
                        }} style={{margin: '0 0 10px 0'}}>退款</Button>
            </span>
            break
        case 2:
        case 5:
            return <span>
                <Button type={"primary"}
                        onClick={() => {
                            callback(details)
                        }}>详情</Button>
            </span>
    }
}

export const showStopOrDelete = (text, record, callback) => {
    showConfirm(text, () => {
        callback()
    })
}
export const closeOrder = (text, record, callback) => {
    confirm({
        title: '确认关闭订单？',
        content: `关闭后，该订单将变为无效，无法再进行发货等后续操作!`,
        okText: '确认',
        cancelText: '取消',
        centered: true,
        onCancel() {

        },
        onOk() {
            callback()
        },
    });
}

//自营商品订单列表

export function defaultScalpingColumns(callback) {
    return [{
        title: '序号',
        width: 70,
        dataIndex: 'id',
        key: 'id'
    }, {
        title: '订单创建时间',
        dataIndex: 'create_time',
        width: 200,
        key: 'create_time',
        render: text => {
            return isEmpty(text)
        }
    }, {
        title: '父订单编号',
        dataIndex: 'parent_ordernum',
        width: 200,
        key: 'parent_ordernum',
        render: text => {
            return isEmpty(text)
        }
    }, {
        title: '子订单编号',
        dataIndex: 'ordernum',
        width: 200,
        key: 'ordernum',
        render: text => {
            return isEmpty(text)
        }
    },
        {
            title: '会员昵称/账号',
            width: 200,
            dataIndex: 'username',
            key: 'username',
            render: ((text, record) => {
                return <span>{isEmpty(text)}/{record.mobile}</span>
            })
        },
        {
            title: '商品名称',
            dataIndex: 'goods_name',
            width: 300,
            key: 'goods_name',
            render: (text, record) => {
                return text ? <span style={{width: '100%'}}>
               <div style={{width: '35%', float: 'left'}}>{getTableImgShowSpecial(record.goods_thumb, record)}</div>
                <div style={{width: '65%', float: 'right'}}>{text}</div></span> : 'ᅳ'
            }

        },
        {
            title: '数量',
            dataIndex: 'num',
            key: 'num',
            render: text => {
                return isEmpty(text)
            }
        },
        {
            title: '子订单金额(元)',
            dataIndex: 'pay',
            key: 'pay',
            render: text => {
                return isEmpty(text)
            }
        },
        {
            title: '佣金',
            dataIndex: 'total_commission',
            key: 'total_commission',
            render: ((text, record) => {
                const state = [2, 3, 4]
                return state.indexOf(+record.state) !== -1 && parseInt(record._delete) === 0?  <span >
                <div>总  佣  金：198.00 &times; {record.earnings_count} ={record.total_commission}</div>
                <div >基础佣金: 70.00 &times; {record.crown_earnings_count} ={record.crown_earnings}</div>
                <div >专享佣金: 128.00 &times; {record.shopkeeper_earnings_count} ={record.shopkeeper_earnings}</div>
                <div style={{display: +record.crown_earnings_count === 0 || +record.shopkeeper_earnings_count === 0 ? 'none' : 'block'}}>
                   <Button  size={'small'} onClick={ () => viewScalpingModal(record.id)}>明细</Button>
                </div>
            </span> : '—'
            })
        },
        {
            title: '最后处理时间',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: text => {
                return isEmpty(text)
            }
        },
        {
            title: '操作人',
            dataIndex: 'operator',
            key: 'operator',
            render: text => {
                return isEmpty(text)
            }
        },
        {
            title: '订单状态',
            dataIndex: 'state',
            key: 'state',
            render: text => {
                return <span>{getScalpingOrder(text)}</span>
            }
        },
        {
            title: '操作',
            dataIndex: 'state',
            key: 'action',
            align: 'center',
            width: 100,
            fixed: 'right',

            render: (text, record) => {
                return getTableHandle(text, record, (item) => {
                    if (item === '详情') {
                        callback(0, record)
                    } else if (item === '关闭订单') {
                        callback(1, record)
                    } else if (item === '发货') {
                        callback(2, record)
                    } else if (item === '退款') {
                        callback(3, record)
                    } else {
                        // this.addSeeker(record)
                    }
                })
            }
        }


    ]
}
// 自营商品订单列表4.0
export function defaultScalpingColumns4(callback) {
    return [{
        title: '订单创建时间',
        dataIndex: 'createTime',
        width: 120,
        key: 'createTime',
        render: text => {
            return isEmpty(text)
        }
    }, {
        title: '父订单编号',
        dataIndex: 'orderNo',
        width: 200,
        key: 'orderNo',
        render: text => {
            return isEmpty(text)
        }
    }, {
        title: '子订单编号',
        dataIndex: 'subOrderNo',
        width: 220,
        key: 'subOrderNo',
        render: text => {
            return isEmpty(text)
        }
    },
        {
            title: '会员昵称/账号',
            width: 170,
            dataIndex: 'currentPayerName',
            key: 'currentPayerName',
            render: ((text, record) => {
                return <span>{isEmpty(text)}/{record.currentPayerPhone}</span>
            })
        },
        {
            title: '商品名称',
            dataIndex: 'goodsTitle',
            width: 200,
            key: 'goodsTitle',
            render: (text, record) => {
                return text ? <span >
               <div style={{float: 'left', marginRight: "10px"}}>{getTableImgShowSpecial(record.goodsImg, record)}</div>
                <div style={{float: 'left', width: "100px"}}>{text}</div></span> : 'ᅳ'
            }

        },
        {
            title: '数量',
            dataIndex: 'goodsNum',
            key: 'goodsNum',
            render: text => {
                return isEmpty(text)
            }
        },
        {
            title: '子订单金额(元)',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: text => {
                return isEmpty(text)
            }
        },
        {
            title: '佣金',
            dataIndex: 'totalCommission',
            key: 'totalCommission',
            render: ((text, record) => {
                return <span >
                <div>总  佣  金：{record.totalCommission}  &times; {record.goodsNum} ={record.totalCommission*record.goodsNum}</div>
                <div >基础佣金: {record.basicCommission} &times; {record.goodsNum} ={record.basicCommission*record.goodsNum}</div>
                <div >专享佣金: {record.specialCommission} &times; {record.goodsNum} ={record.specialCommission*record.goodsNum}</div>
                <div style={{display: +record.crown_earnings_count === 0 || +record.shopkeeper_earnings_count === 0 ? 'none' : 'block'}}>
                   <Button style={{ display: record.type == 0 ? 'block' : 'none' }}  size={'small'} onClick={ () => viewScalpingModal4(record)}>明细</Button>
                </div>
            </span>
            })
        },
        {
            title: '订单状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: text => {
                return <span>{getScalpingOrder4(text)}</span>
            }
        },
        {
            title: '最后处理时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 120,
            render: text => {
                return isEmpty(text)
            }
        },
        {
            title: '操作人',
            dataIndex: 'updateBy',
            key: 'updateBy',
            render: text => {
                return isEmpty(text)
            }
        },
        {
            title: '操作',
            dataIndex: 'orderStatus',
            key: 'action',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (text, record) => {
                return getNewTableHandle(text, record, (item) => {
                    if (item === '详情') {
                        callback(0, record)
                    } else if (item === '关闭订单') {
                        callback(1, record)
                    } else if (item === '发货') {
                        callback(2, record)
                    } else if (item === '退款') {
                        callback(3, record)
                    } else {
                        // this.addSeeker(record)
                    }
                })
            }
        }


    ]
}
// 显示明细
export function viewScalpingModal4(record) {
    var params = {}
    params.subOrderNo = record.subOrderNo
    params.totalBasicCommission = record.basicCommission*record.goodsNum
    params.totalSpecialCommission = record.specialCommission*record.goodsNum
    viewScalpingOrder4(params).then(res => {
        if (res && res.code === "00000") {
            var result
            const data = res.data
            data.map((item,indexArr) =>{

                return result = <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={data}
                            renderItem={(item) => (
                            <List.Item key={indexArr}>
                                    <div style={{ display: item.isSystem == 1 && item.profitType == 2 ? 'block' : 'none' }}><span >{item.name}获得{item.commission}元专享佣金</span></div>
                                    <div style={{ display: item.isSystem == 1 && item.profitType == 1 ? 'block' : 'none' }}><span >{item.name}获得{item.commission}元基础佣金</span></div>
                                    <div style={{ display: item.isSystem == 0 ? 'block' : 'none' }}>
                                        <div style={{ display: item.grade == 1 ? 'block' : 'none' }}>
                                            <div style={{ display: item.profitType == 1 ? 'block' : 'none' }}><Tag color="orange">皇冠</Tag><span >{item.name}({item.phone})获得{item.commission}元基础佣金</span></div>
                                            <br />
                                            <div style={{ display: item.profitType == 2 ? 'block' : 'none' }}><Tag color="orange">皇冠</Tag>{item.name}({item.phone})获得{item.commission}元专享佣金</div>
                                        </div>
                                        <div style={{ display: item.grade == 2 ? 'block' : 'none' }}>
                                            <div style={{ display: item.profitType == 1 ? 'block' : 'none' }}><Tag color="lime">店主</Tag><span >{item.name}({item.phone})获得{item.commission}元基础佣金</span></div>
                                            <br />
                                            <div style={{ display: item.profitType == 2 ? 'block' : 'none' }}><Tag color="lime">店主</Tag>{item.name}({item.phone})获得{item.commission}元专享佣金</div>
                                        </div>
                                    </div>
                            </List.Item>
                    )}
                />
            })
            return Modal.success({
                width:469,
                title: '佣金分配详情',
                icon: false,
                content: result,
                centered: true
            });
        }else{
            openNotificationWithIcon('error', res.message)
        }

    })
}

export function viewScalpingModal(id) {
    viewScalpingOrder(id).then(res => {
        if (res && +res.code === 1) {
            const data = res.data
              let  result =  <span>
                            <br/>
                           <div style={{display: data.auth198_username ? 'block': 'none'}}><Tag color="orange">皇冠</Tag><span >{data.auth198_username}({data.auth198_user_phone})获得{data.crown_earnings}元基础佣金</span></div>
                            <br/>
                           <div style={{display: data.auth680_username ? 'block': 'none'}}> <Tag color="lime">店主</Tag>{data.auth680_username}({data.auth680_user_phone})获得{data.shopkeeper_earnings}元专享佣金</div>
                         </span>
            return Modal.success({
                title: '佣金分配详情',
                icon: false,
                content: result,
                centered: true
            });
        }
    })
}




