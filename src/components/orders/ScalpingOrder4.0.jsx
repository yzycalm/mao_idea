/**
 * Created by smart-yc.
 */
import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { ScalpingOrderStatus, DeliverGoodsForm4, RefundForm4 } from '../orders/common'
import { Card, Form, Input, Button, Table, DatePicker, Checkbox, Icon, Row, Menu, Col, Dropdown, Popover, Upload } from 'antd';
import { paginationProps, handleScrollTop, openNotificationWithIcon } from '../../utils/index'
import { getScalpingOrderList4, closeScalpingOrder4, exportScalpingOrder4, importScalpingOrder4 } from '../../api/orders/orderList'
import { checkBoxGroup } from "../../utils/commodity";
import { defaultScalpingColumns4 } from "../../utils/order";
import moment from 'moment'
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'

const { RangePicker } = DatePicker;

class ScalpingOrder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //执行操作按钮后的方法
            tableColumns: defaultScalpingColumns4((tag, record) => {
                switch (tag) {
                    case 0:
                        this.viewDetail(tag, record)
                        break
                    case 1:
                        this.closeOrder(tag, record)
                        break
                    case 2:
                        this.deliverTheGoods(tag, record)
                        break
                    case 3:
                        this.refund(tag, record)
                        break
                    case 4:
                        break
                }

            }),
            tableData: [],
            loading: true,
            total: 0,
            fileList: '',
            query: {
                clientId: store.getState().clientId,
                pageNum: store.getState().pageNum,
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                createTimeEnd: "",
                createTimeStart: "",
                currentPayerPhone: "",
                goodsTitle: "",
                orderBy: "",
                orderStatus: "",
                subOrderNo: "",
                updateBy: ""
            },
            width: 177,
            defaultValue: 'all',
            ModalText: 'Content of the modal',
            deliverVisible: false,
            deliverGoodsId: '',
            orderNo: '',
            refundVisible: false,
            Operator: '',
            refundGoodsId: '',
            confirmLoading: false
        }
    }
    componentDidMount () {
        this.initData()
        const column = JSON.parse(localStorage.getItem("scalpingOrder4.0"))
        if (column && column.length > 0) {
            this.onChange(column)
        }
        handleScrollTop(1)
    }

    // 初始化数据
    initData () {
        const that = this
        console.log(that.state.query)
        this.setState({
            loading: true
        }, () => {
            getScalpingOrderList4(that.state.query).then((res) => {
                console.log(res)
                this.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + 1
                        })
                        that.setState({
                            tableData: data.list,
                            total: data.total
                        })
                    }
                })
            })
        })
    }

    // 关闭订单
    closeOrder (tag, record) {
        const params = { orderStatus: 5, orderNo: record.orderNo, updateBy: this.state.query.clientId }
        closeScalpingOrder4(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', '关闭订单成功！')
                this.initData()
            } else {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    viewDetail (tag, record) {
        this.props.history.push({
            pathname: 'children/ViewCalpingDetail4.0', query: { id: record.subOrderNo }
        })
        handleScrollTop(2)
    }

    refund (tag, record) {
        this.setState({
            refundVisible: true,
            refundGoodsId: record.subOrderNo,
            orderNo: record.orderNo,
        });
    }

    deliverTheGoods (tag, record) {
        this.setState({
            deliverVisible: true,
            deliverGoodsId: record.subOrderNo,
            orderNo: record.orderNo,
            Operator: record.updateBy,
        });

    }
    //订单状态
    handlePublicStatus (val) {
        let data = Object.assign({}, this.state.query, { orderStatus: val + "", pageNum: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 退款
    handleRefund (val) {
        this.setState({
            refundVisible: false
        })
        if (val) this.initData()
    }

    // 发货
    handleDeliver (val) {
        this.setState({
            deliverVisible: false
        })
        if (val) this.initData()
    }
    // 字段设置
    onChange = (checkedValues) => {
        let data = []
        let selected = []
        defaultScalpingColumns4((tag, record) => {
            switch (tag) {
                case 0:
                    this.viewDetail(tag, record)
                    break
                case 1:
                    this.closeOrder(tag, record)
                    break
                case 2:
                    this.deliverTheGoods(tag, record)
                    break
                case 3:
                    this.refund(tag, record)
                    break
                case 4:
                    break
            }

        }).forEach((r, index) => {
            checkedValues.forEach(rs => {
                if (r.key == rs) {
                    selected.push(rs)
                    data.push(r)
                }
            })
        })
        localStorage.setItem("scalpingOrder4.0", JSON.stringify(selected))
        this.setState({ tableColumns: data })
    }
    // 批量发货
    handleMenuClick (e) {
        console.log('click', e);
        if (e.key === '1') {
            this.exportToExcel()
        }
    }
    // 导出excel
    exportToExcel () {
        let params = {
            "createTimeEnd": this.state.query.createTimeEnd,
            "createTimeStart": this.state.query.createTimeStart,
            "currentPayerPhone": this.state.query.currentPayerPhone,
            "goodsTitle": this.state.query.goodsTitle,
            "orderStatus": this.state.query.orderStatus,
            "subOrderNo": this.state.query.subOrderNo,
            "updateBy": this.state.query.updateBy
        }
        exportScalpingOrder4(params).then(res => {
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
    // 时间范围
    handleTimeHorizon (val) {
        let data = Object.assign({}, this.state.query, {
            createTimeEnd: val[0].format('YYYY-MM-DD HH:mm:ss'),
            createTimeStart: val[1].format('YYYY-MM-DD HH:mm:ss'),
            pageNum: 1
        })


        const st = new Date(data.createTimeEnd);
        const et = new Date(data.createTimeStart);
        const value = et.getTime() - st.getTime();
        console.log(st)
        if (value > 7776000000) {
            openNotificationWithIcon('warning', `查询时间范围不能大于90天！`)

        } else {
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    removeTime (value) {
        if (value.length === 0) {
            let data = Object.assign({}, this.state.query, { createTimeEnd: '', createTimeStart: '', pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    // 会员昵称
    handleInput (params, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { [params]: value, pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { [params]: '', pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 导入
    customRequest = (files) => {
        let formdata = new FormData()
        formdata.append('file', files.file)
        formdata.append('updateBy', this.state.query.clientId)
        importScalpingOrder4(formdata).then(res => {
            if (res && res.success) {
                this.initData()
                openNotificationWithIcon('success', res.message)
            } else {
                openNotificationWithIcon('error', res.message)
            }
        })
    }
    render () {
        const { deliverVisible, deliverGoodsId, Operator, orderNo, refundVisible, refundGoodsId, total, query } = this.state
        const pagination = paginationProps(total, query, (current, pageSize) => {
            changePageSize(pageSize)
            changeCurPage(1)
            //  每页显示多少条
            let data = Object.assign({}, query, { pageSize: pageSize, pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, { pageNum: current, curPage: current })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        // 获取设置字段值
        const checkBoxValue = (defaultColumns) => {
            let result = []
            const selected = JSON.parse(localStorage.getItem("scalpingOrder4.0"))
            if (selected && selected.length > 0) {
                result = selected
            } else {
                defaultColumns.map(item => {
                    result.push(item.key)
                })
            }
            return result
        }
        const content = (
            <div style={{ width: '380px' }}>
                <Checkbox.Group defaultValue={checkBoxValue(defaultScalpingColumns4())} onChange={this.onChange.bind(this)}>
                    <Row>
                        {
                            checkBoxGroup(defaultScalpingColumns4()).map(item => {
                                return <Col span={12} style={{ marginBottom: '10px' }} key={item.value}>
                                    <Checkbox value={item.value} style={{ display: item.value === 'action' ? 'none' : 'block' }}>{item.label}</Checkbox>
                                </Col>

                            })
                        }
                    </Row>
                </Checkbox.Group>
            </div>
        );
        const menu = (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                <Menu.Item key="1" onClick={this.exportToExcel.bind(this)}>导出物流表格</Menu.Item>
                <Menu.Item key="2">
                    <Upload
                        accept="*/.xls"
                        fileList={this.state.fileList}
                        customRequest={this.customRequest}
                    >导入物流表格</Upload>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="订单管理" second="自营商品订单4.0" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="商品名称">
                                <Input placeholder="请输入商品名称"
                                    onBlur={this.handleInput.bind(this, 'goodsTitle')}
                                />
                            </Form.Item>
                            <Form.Item label="订单编号">
                                <Input placeholder="请输入父订单或子订单编号"
                                    onBlur={this.handleInput.bind(this, 'subOrderNo')}
                                />
                            </Form.Item>
                            <Form.Item label="订单创建时间">
                                <RangePicker showTime={{
                                    defaultValue:
                                        [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }}
                                    format="YYYY-MM-DD HH:mm:ss" onOk={this.handleTimeHorizon.bind(this)}
                                    onChange={this.removeTime.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="会员账号">
                                <Input style={{ width: 180 }} onBlur={this.handleInput.bind(this, 'currentPayerPhone')}
                                    placeholder="请输入会员账号"
                                />
                            </Form.Item>
                            <Form.Item label="订单状态">
                                <ScalpingOrderStatus width={140}
                                    getStatus={this.handlePublicStatus.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item >
                                <Button type={"primary"} onClick={this.initData.bind(this)}>查询</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
                <div className="gutter-box">
                    <Card bordered>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <Dropdown overlay={menu}>
                                    <Button type={"primary"}>
                                        批量发货 <Icon type="down" />
                                    </Button>
                                </Dropdown>
                                <Popover content={content} title="自定义字段" trigger="click">
                                    <Button type={"primary"} style={{ marginBottom: '10px' }}>字段设置<Icon
                                        type="down"
                                                                                                  /></Button>
                                </Popover>
                            </div>
                        </div>
                        <Table columns={this.state.tableColumns}
                            dataSource={this.state.tableData}
                            loading={this.state.loading}
                            pagination={pagination}
                            scroll={{ x: 1800 }}
                            locale={{ emptyText: '无符合条件的记录' }}
                        />
                    </Card>
                </div>
                <DeliverGoodsForm4 deliverVisible={deliverVisible} subOrderNo={deliverGoodsId} orderNo={orderNo} updateBy={query.clientId}
                    getDeliverGoods={this.handleDeliver.bind(this)}
                />
                <RefundForm4 refundVisible={refundVisible} subOrderNo={refundGoodsId} orderNo={orderNo} getRefund={this.handleRefund.bind(this)} />
            </div>
        )
    }
}

export default ScalpingOrder;
