/**
 * Created smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, Checkbox, Icon, Popover, Row, Col, Upload, DatePicker } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { GoodsPlatform, GoodsStatus } from '../commodity/common'
import { getGoodsList, toLeadGoods } from '../../api/commondity/attract'
import { handleScrollTop, openNotificationWithIcon, paginationProps, showConfirm } from '../../utils/index'
import { defaultAttractColumns, checkBoxGroup, handleGoods, onExportGoodList, getCollectTable } from "../../utils/commodity";
import moment from "moment";
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'

const { RangePicker } = DatePicker;
class Resource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: defaultAttractColumns((tag, record) => {
                if (tag && record) {
                    this.addGoods(record, tag)
                } else {
                    this.initData()
                }
            }),
            tableData: [],
            loading: true,
            total: 0,
            dataLength: 0, // 获取当前页面有多少条数据
            query: {
                curPage: store.getState().curPage,
                endTime: "",
                merchantsId: "",
                pageSize: store.getState().pageSize,
                platform: 0,
                productMsg: "",
                productType: 1,
                publishStatus: 0,
                startTime: ""
            },
            width: 177,
            fileList: [],
            selectedRowKeys: [],
            file: [],
            toLeadLoading: false,
            exportLoading: false,
            deleteLoading: false,
            soldOutLoading: false,
            collect: {
                audit: 0,
                notPassed: 0,
                settlement: 0,
                upperShelf: 0
            }
        }
    }

    componentDidMount () {
        this.initCollectInfo(() => {
            this.initData()
        })
        const column = JSON.parse(localStorage.getItem("attractColumn"))
        if (column && column.length > 0) {
            this.onChange(column)
        }
        handleScrollTop(1)
    }

    // 初始化数据
    initData () {
        const that = this
        this.setState({
            loading: true
        }, () => {
            getGoodsList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + item.id
                        })
                        that.setState({
                            tableData: data.list,
                            total: data.total,
                            dataLength: data.list.length
                        })
                    }
                })
            })
        })
    }
    // 汇总信息
    initCollectInfo (callback) {
        getCollectTable(1, (res) => {
            callback()
            this.setState({
                collect: res
            })
        })
    }

    // 下拉框
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    // 输入框
    handleInput (param, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { [param]: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { [param]: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    // 订单状态
    handleDisplayState (val) {
        let data = Object.assign({}, this.state.query, { orderStatus: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    handleOrderTime (value) {
        let data = Object.assign({}, this.state.query, { startTime: new Date(value[0]).getTime(), endTime: new Date(value[1]).getTime(), curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    // 时间范围
    handleTimeHorizon (val) {
        let data = Object.assign({}, this.state.query, { startTime: val[0], endTime: val[1], curPage: 1 })
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
    // 新增商品
    addGoods (record, tag) {
        let title = '新增'
        switch (tag) {
            case 1:
                title = '编辑'
                break
            case 2:
                title = '结算'
                break
            case 3:
                title = '续券'
                break
            default:
                title = '新增'
                break
        }
        if (tag === 2) {
            this.props.history.push({
                pathname: 'children/SettleAttractGoods',
                query: { id: record ? record.id : '', title: title }
            })
        } else {
            this.props.history.push({
                pathname: 'children/AddAttractGoods',
                query: { id: record ? record.id : '', title: title }
            })
        }
        handleScrollTop(2)
    }

    onChange = (checkedValues) => {
        let data = []
        let selected = []
        defaultAttractColumns((tag, record) => {
            if (tag && record) {
                this.addGoods(record, tag)
            } else {
                this.initData()
            }
        }).forEach((r, index) => {
            checkedValues.forEach(rs => {
                if (r.key == rs) {
                    selected.push(rs)
                    data.push(r)
                }
            })
        })
        localStorage.setItem("attractColumn", JSON.stringify(selected))
        this.setState({ tableColumns: data })
    }
    // 自定义上传
    customRequest = (files) => {
        this.setState({
            toLeadLoading: true
        })
        let formdata = new FormData()
        formdata.append('file', files.file)
        formdata.append('merchantsId', '123')
        formdata.append('productType', 1)
        toLeadGoods(formdata).then(res => {
            this.setState({
                toLeadLoading: false
            })
            if (res && res.success) {
                this.initData()
                openNotificationWithIcon('success', `导入成功！`)
            } else {
                openNotificationWithIcon('error', `导入失败，请重试！`)
            }
        })
    }
    // 批量删除/上架/下架/不通过
    onCommonHandle (operateType, handleTip, callback) {
        const that = this
        if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
            showConfirm(handleTip, () => {
                if (operateType == 2) {
                    this.setState({
                        deleteLoading: true
                    })
                }
                if (operateType == 0) {
                    this.setState({
                        soldOutLoading: true
                    })
                }
                const params = {
                    list: that.state.selectedRowKeys,
                    merchantsId: "",
                    nopassReason: "",
                    operateType: operateType
                }
                handleGoods(params, handleTip, () => {
                    this.initData()
                    this.setState({
                        deleteLoading: false,
                        soldOutLoading: false
                    })
                })
            })
        } else {
            openNotificationWithIcon('warning', `请选择需要${handleTip}的记录`)
        }
    }
    // 导出
    exportGoods () {
        this.setState({
            exportLoading: true
        })
        onExportGoodList(this.state.query, (() => {
            this.setState({
                exportLoading: false
            })
        }))
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
        // 多选
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                let result = []
                selectedRows.map((item) => {
                    result.push(item.id)
                })
                this.setState({
                    selectedRowKeys: result
                })
            }
        };
        // 获取设置字段值
        const checkBoxValue = (defaultColumns) => {
            let result = []
            const selected = JSON.parse(localStorage.getItem("attractColumn"))
            if (selected && selected.length > 0) {
                result = selected
            } else {
                defaultColumns.map(item => {
                    result.push(item.key)
                })
            }
            return result
        }
        // 字段设置
        const content = (
            <div style={{ width: '380px' }}>
                <Checkbox.Group defaultValue={checkBoxValue(defaultAttractColumns())} onChange={this.onChange.bind(this)}>
                    <Row>
                        {
                            checkBoxGroup(defaultAttractColumns()).map(item => {
                                return <Col span={12} style={{ marginBottom: '10px' }} key={item.value}>
                                    <Checkbox style={{ display: item.value === 'action' ? 'none' : 'block' }} value={item.value}>{item.label}</Checkbox>
                                </Col>

                            })
                        }
                    </Row>
                </Checkbox.Group>
            </div>
        );
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="商品管理" second="招商商品" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="平台">
                                <GoodsPlatform width={this.state.width}
                                    getPlatform={this.handleSelected.bind(this, 'platform')}
                                />
                            </Form.Item>
                            <Form.Item label="商品信息">
                                <Input placeholder="请输入商品名称或商品ID"
                                    onBlur={this.handleInput.bind(this, 'productMsg')}
                                />
                            </Form.Item>
                            <Form.Item label="发布状态">
                                <GoodsStatus width={this.state.width} goodsType={1}
                                    getStatus={this.handleSelected.bind(this, 'publishStatus')}
                                />
                            </Form.Item>
                            <Form.Item label="招商人员">
                                <Input placeholder="" />
                            </Form.Item>
                            <Form.Item label="录入时间">
                                <RangePicker showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }} format="YYYY-MM-DD HH:mm:ss" onOk={this.handleOrderTime.bind(this)} onChange={this.removeTime.bind(this)}
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.addGoods.bind(this)}
                                >新增商品</Button>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.onCommonHandle.bind(this, 0, '下架')} loading={this.state.soldOutLoading}
                                >批量下架</Button>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.onCommonHandle.bind(this, 2, '删除')} loading={this.state.deleteLoading}
                                >批量删除</Button>
                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    <Upload accept="*/.xls"
                                        fileList={this.state.fileList}
                                        customRequest={this.customRequest}
                                    >
                                        <Button type={"primary"} style={{ marginBottom: '10px' }} loading={this.state.toLeadLoading}>批量导入</Button>
                                    </Upload>
                                </span>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.exportGoods.bind(this, this.state.query)} loading={this.state.exportLoading}
                                >批量导出</Button>
                                <Popover content={content} title="自定义字段" trigger="click">
                                    <Button type={"primary"} style={{ marginBottom: '10px' }}>字段设置<Icon
                                        type="down"
                                                                                                  /></Button>
                                </Popover>
                            </div>
                            <div>
                                <p style={{ color: 'grey' }}><span>待审核：{this.state.collect.audit}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>未通过：{this.state.collect.notPassed}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>已上架：{this.state.collect.upperShelf}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>已结算：{this.state.collect.settlement}</span></p>
                            </div>
                        </div>
                        <Table rowSelection={rowSelection} columns={this.state.tableColumns}
                            dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 2550 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Resource;
