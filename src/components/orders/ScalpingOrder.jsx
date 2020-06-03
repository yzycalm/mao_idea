/**
 * Created by smart-yc.
 */
import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { ScalpingOrderStatus, DeliverGoodsForm, RefundForm } from '../orders/common'
import { Card, Form, Input, Button, Table, DatePicker, Checkbox, Icon, Row, Menu, Col, Dropdown, Popover, Upload } from 'antd';
import { paginationProps, handleScrollTop, jsToFormData, openNotificationWithIcon } from '../../utils/index'
import { getScalpingOrderList, closeScalpingOrder, exportScalpingOrder, importScalpingOrder } from '../../api/orders/orderList'
import { checkBoxGroup } from "../../utils/commodity";
import { defaultScalpingColumns } from "../../utils/order";
import moment from 'moment'
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'

const { RangePicker } = DatePicker;

class ScalpingOrder extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //执行操作按钮后的方法
            tableColumns: defaultScalpingColumns((tag, record) => {
                switch (tag) {
                    case 0:
                        this.viewDetail(tag, record)
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
                goods_name: '',
                ordernum: '',
                start_time: '',
                end_time: '',
                username: '',
                state: '',
                pageSize: store.getState().pageSize,
                curPage: store.getState().curPage
            },
            width: 177,
            defaultValue: 'all',
            ModalText: 'Content of the modal',
            deliverVisible: false,
            deliverGoodsId: '',
            refundVisible: false,
            refundGoodsId: '',
            confirmLoading: false
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
            params.page = params.curPage
            params.page_size = params.pageSize
            delete params.curPage
            delete params.pageSize
            getScalpingOrderList(jsToFormData(params)).then((res) => {
                this.setState({
                    loading: false
                }, () => {
                    if (res && res.code === 1) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + item.id
                            item.index = index + 1
                        })
                        that.setState({
                            tableData: data.list,
                            total: data.total_count
                        })
                    }
                })
            })
        })
    }

    // 关闭订单
    closeOrder (tag, record) {
        closeScalpingOrder(record.id).then(res => {
            if (res && res.code === 1) {
                openNotificationWithIcon('success', '关闭订单成功！')
                this.initData()
            }
        })
    }

    viewDetail (tag, record) {
        this.props.history.push({
            pathname: 'children/ViewCalpingDetail', query: { id: record.id }
        })
        handleScrollTop(2)
    }

    refund (tag, record) {
        this.setState({
            refundVisible: true,
            refundGoodsId: record.id
        });
    }

    deliverTheGoods (tag, record) {
        this.setState({
            deliverVisible: true,
            deliverGoodsId: record.id
        });

    }
    //订单状态
    handlePublicStatus (val) {
        console.log(val)
        let data = Object.assign({}, this.state.query, { state: val + "", curPage: 1 })
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
        defaultScalpingColumns((tag, record) => {
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
        localStorage.setItem("scalpingOrder", JSON.stringify(selected))
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
        const { ...params } = this.state.query
        params.page = params.curPage
        params.page_size = params.pageSize
        delete params.curPage
        delete params.pageSize
        let newParams = ''
        Object.keys(params).map((item, index) => {
            console.log(item);
            newParams += `${item}=${params[item]}${index === Object.keys(params).length - 1 ? '' : '&'}`
        })
        const a = document.createElement('a'); // 创建a标签
        a.setAttribute('target', '_blank')
        a.setAttribute('href', exportScalpingOrder(newParams));// href链接
        a.click();// 自执行点击事件
        a.remove()
    }
    // 时间范围
    handleTimeHorizon (val) {
        let data = Object.assign({}, this.state.query, {
            start_time: val[0].format('YYYY-MM-DD HH:mm:ss'),
            end_time: val[1].format('YYYY-MM-DD HH:mm:ss'),
            curPage: 1
        })


        const st = new Date(data.start_time);
        const et = new Date(data.end_time);
        const value = et.getTime() - st.getTime();
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
            let data = Object.assign({}, this.state.query, { start_time: '', end_time: '', curPage: 1 })
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
            let data = Object.assign({}, this.state.query, { [params]: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { [params]: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 自定义上传
    customRequest = (files) => {
        let formdata = new FormData()
        formdata.append('UploadExcelForm[excelFile]', files.file)
        importScalpingOrder(formdata).then(res => {
            if (res && +res.code === 1) {
                this.initData()
                openNotificationWithIcon('success', res.msg)
            } else {
                openNotificationWithIcon('error', res.msg)
            }
        })
    }
    render () {
        const { deliverVisible, deliverGoodsId, refundVisible, refundGoodsId, total, query } = this.state
        const pagination = paginationProps(total, query, (current, pageSize) => {
            changePageSize(pageSize)
            changeCurPage(1)
            //  每页显示多少条
            let data = Object.assign({}, query, { pageSize: pageSize, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, query, { curPage: current })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        // 获取设置字段值
        const checkBoxValue = (defaultColumns) => {
            let result = []
            const selected = JSON.parse(localStorage.getItem("scalpingOrder"))
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
                <Checkbox.Group defaultValue={checkBoxValue(defaultScalpingColumns())} onChange={this.onChange.bind(this)}>
                    <Row>
                        {
                            checkBoxGroup(defaultScalpingColumns()).map(item => {
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
                <Menu.Item key="1">导出物流表格</Menu.Item>
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
                <BreadcrumbCustom first="订单管理" second="自营商品订单" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="商品名称">
                                <Input placeholder="请输入商品名称"
                                    onBlur={this.handleInput.bind(this, 'goods_name')}
                                />
                            </Form.Item>
                            <Form.Item label="订单编号">
                                <Input placeholder="请输入父订单或子订单编号"
                                    onBlur={this.handleInput.bind(this, 'ordernum')}
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
                            <Form.Item label="会员昵称/账号">
                                <Input style={{ width: 180 }} onBlur={this.handleInput.bind(this, 'username')}
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
                            scroll={{ x: 2100 }}
                            locale={{ emptyText: '无符合条件的记录' }}
                        />
                    </Card>
                </div>
                <DeliverGoodsForm deliverVisible={deliverVisible} id={deliverGoodsId}
                    getDeliverGoods={this.handleDeliver.bind(this)}
                />
                <RefundForm refundVisible={refundVisible} id={refundGoodsId} getRefund={this.handleRefund.bind(this)} />
            </div>
        )
    }
}

export default ScalpingOrder;
