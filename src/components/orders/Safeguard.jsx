/**
 * Created smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, DatePicker } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { OrderPlatform, RepairOrderStatus } from '../orders/common'
import { getBackOrderList, getInfoById } from '../../api/orders/orderList'
import { handleScrollTop, paginationProps, isEmpty } from '../../utils/index'
import { getPlatformStatus, getBackOrderStatus } from '../../utils/order'
import moment from "moment";
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'

const { RangePicker } = DatePicker;
class Resource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '申请时间',
                dataIndex: 'createTime',
                key: 'createTime',
            }, {
                title: '申请人红人装ID',
                dataIndex: 'accountId',
                key: 'accountId'
            }, {
                title: '申请人信息',
                dataIndex: 'userName',
                key: 'userName',
                render: (text, record) => {

                    return record.nickName || record.phone ? <span>
                        <span>{record.nickName}</span><br />
                        <span>{record.phone}</span>
                    </span> : isEmpty(text)
                }
            }, {
                title: '平台',
                dataIndex: 'platform',
                key: 'platform',
                render: text => {
                    return <span>{getPlatformStatus(text)}</span>
                }
            }, {
                title: '第三方订单号',
                dataIndex: 'parentOrderNo',
                key: 'parentOrderNo',
            },
            {
                title: '订单状态',
                dataIndex: 'status',
                key: 'status',
                render: text => {
                    return <span>{getBackOrderStatus(text)}</span>
                }
            },
            {
                title: '操作',
                dataIndex: 'publishStatus',
                key: 'action',
                width: 60,
                fixed: 'right',
                render: (text, record) => {
                    return <Button type={"primary"} onClick={this.promptlyOrder.bind(this, record)}>立即补单</Button>
                }
            }],
            tableData: [],
            loading: true,
            total: 0,
            dataLength: 0, // 获取当前页面有多少条数据
            query: {
                curPage: store.getState().curPage,
                endTime: '',
                orderNo: '',
                pageSize: store.getState().pageSize,
                platform: 0,
                startTime: '',
                status: 0
            },
            width: 177,
            defaultValue: 'all'
        }
    }

    componentDidMount () {
        this.initData()
        handleScrollTop(1)
    }

    // 初始化数据
    initData () {
        const that = this
        this.setState({
            loading: true
        }, () => {
            const { ...params } = this.state.query
            if (!params.phone) {
                delete params.phone
            }
            getBackOrderList(params).then((res) => {
                if (res && res.success) {
                    const data = res.data
                    data.list.map((item, index) => {
                        item.key = index + item.accountId
                        that.handleUserInfo(item.accountId).then(respond => {
                            if (respond) {
                                item.nickName = respond.hasOwnProperty('nickName') ? respond.nickName : ''
                                item.phone = respond.hasOwnProperty('phone') ? respond.phone : ''
                            }
                        });
                    })
                    setTimeout(() => {
                        this.setState({
                            loading: false
                        }, () => {
                            that.setState({
                                tableData: data.list,
                                total: data.total,
                                dataLength: data.list.length
                            })
                        })
                    }, 500)
                }
            })
        })
    }

    // 获取用户信息
    handleUserInfo (accountId) {
        return new Promise((reslove, reject) => {
            const params = { accountId: accountId }
            getInfoById(params).then(res => {
                if (res && res.success) {
                    reslove(res.data)
                } else {
                    reject({})
                }
            })
        }).catch(reason => {
        });
    }

    // 平台系统
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 订单号
    handleOrderNum (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { orderNo: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { orderNo: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 时间范围
    handleOrderTime (val) {
        let data = Object.assign({}, this.state.query, { startTime: val[0].format('X'), endTime: val[1].format('X'), curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    removeTime (value) {
        if (value.length === 0) {
            let data = Object.assign({}, this.state.query, { startTime: '', endTime: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 补单
    addOrder () {
        this.props.history.push({
            pathname: 'children/AddOrder',
            query: { title: '录入订单' }
        })
    }

    // 立即录入
    promptlyOrder (record) {
        sessionStorage.setItem('safeguard', JSON.stringify(record))
        this.props.history.push({
            pathname: 'children/PromptlyOrder',
            query: { title: '录入订单' }
        })
        handleScrollTop(2)
    }

    render () {
        const pagination = paginationProps(this.state.total, this.state.query, (current, pageSize) => {
            changePageSize(pageSize)
            changeCurPage(1)
            //  每页显示多少条
            let data = Object.assign({}, this.state.query, { pageSize: pageSize, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, { curPage: current })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="订单管理" second="订单列表" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="平台">
                                <OrderPlatform width={this.state.width}
                                    getPlatform={this.handleSelected.bind(this, 'platform')}
                                />
                            </Form.Item>
                            <Form.Item label="第三方订单号">
                                <Input placeholder="第三方订单号"
                                    onChange={this.handleOrderNum.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="状态">
                                <RepairOrderStatus width={this.state.width}
                                    getStatus={this.handleSelected.bind(this, 'status')}
                                />
                            </Form.Item>
                            <Form.Item label="申请时间">
                                <RangePicker showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }} onOk={this.handleOrderTime.bind(this)} onChange={this.removeTime.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type={"primary"} onClick={this.initData.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
                <div className="gutter-box">
                    <Card bordered>
                        <Button type={"primary"} style={{ marginBottom: '10px' }}
                            onClick={this.addOrder.bind(this)}
                        >录入补单</Button>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Resource;
