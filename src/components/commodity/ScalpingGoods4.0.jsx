/*
 * @Author: songyingchun
 * @Date: 2020-04-15 18:41:19
 * @Description: 运营商品录入
 */ 
import React from 'react';
import { Card, Form, Input, Button, Table, Checkbox, Icon, Popover, Row, Col } from 'antd/lib/index';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { GoodsStatus } from '../commodity/common'
import { getScalpingList4 } from '../../api/commondity/attract'
import { handleScrollTop, openNotificationWithIcon, paginationProps, showConfirm } from '../../utils/index'
import {
    defaultScalpingColumns4,
    checkBoxGroup,
    deleteOrStandScalpingGoods
} from "../../utils/commodity";
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'

class Resource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: defaultScalpingColumns4((tag, record) => {
                if (tag && record) {
                    this.addGoods(record, tag)
                } else {
                    this.setState({
                        curPage: 1,
                        pageNum: 1
                    }, () => {
                        this.initData()
                    })
                }
            }),
            tableData: [],
            loading: true,
            total: 0,
            dataLength: 0, // 获取当前页面有多少条数据
            query: {
                clientId: store.getState().clientId,
                pageNum: store.getState().curPage,
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                goods_name: '',
                status: ''
            },
            width: 177,
            selectedRowKeys: [],
            fileList: [],
            toLeadLoading: false,
            exportLoading: false,
            deleteLoading: false,
            soldOutLoading: false
        }
    }
    componentDidMount () {
        this.initData()
        const column = JSON.parse(localStorage.getItem("scalpingColumn"))
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
            getScalpingList4(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + new Date().getTime()
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
    // 买家信息
    handleTitle (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { goodsTitle: value, pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { goodsTitle: '', pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    handlePublicStatus (val) {
        let data = Object.assign({}, this.state.query, { status: val, pageNum: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    // 新增商品
    addGoods (record) {
        this.props.history.push({
            pathname: 'children/AddScalpingGoods4.0',
            query: { id: record ? record.goodsCode : '', title: record ? '查看/编辑' : '新增' }
        })
        handleScrollTop(2)
    }
    onChange = (checkedValues) => {
        let data = []
        let selected = []
        defaultScalpingColumns4((tag, record) => {
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
        localStorage.setItem("scalpingColumn", JSON.stringify(selected))
        this.setState({ tableColumns: data })
    }
    clearCheck = () => { // 处理勾选数据后清空勾选
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        })
    }
    // 批量删除/下架
    onCommonHandle (operateType, handleTip, callback) {
        if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
            // 判断选择里面的包含状态
            const ids = []
            const status = []
            this.state.selectedRows.map(item => {
                ids.push(item.goodsCode)
                status.push(item.status)
            })
            if (operateType === 2) {
                if (status.indexOf(3) !== -1) {
                    openNotificationWithIcon('warning', `你选择的商品必须为“已上架”状态`)
                    return
                }
            }
            if (operateType === 3) {
                if (status.indexOf(2) !== -1) {
                    openNotificationWithIcon('warning', `你选择的商品必须为“已下架”状态`)
                    return;
                }
            }
            showConfirm(handleTip, () => {
                const params = {
                    goodsCodes: ids
                }
                deleteOrStandScalpingGoods(params, operateType, () => {
                    this.initData()
                    this.clearCheck()
                    this.setState({
                        deleteLoading: false,
                        exportLoading: false
                    })
                })
            })
        } else {
            openNotificationWithIcon('warning', `请选择需要${handleTip}的商品`)
        }
    }
    render () {
        const pagination = paginationProps(this.state.total, this.state.query, (current, pageSize) => {
            changePageSize(pageSize)
            changeCurPage(1)
            //  每页显示多少条
            let data = Object.assign({}, this.state.query, { pageSize: pageSize, pageNum: 1, curPage: 1 })
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
        // 多选
        const { selectedRowKeys } = this.state
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                    selectedRows
                })
            }
        };
        // 获取设置字段值
        const checkBoxValue = (defaultColumns) => {
            let result = []
            const selected = JSON.parse(localStorage.getItem("scalpingColumn"))
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
                <Checkbox.Group defaultValue={checkBoxValue(defaultScalpingColumns4())} onChange={this.onChange.bind(this)}>
                    <Row>
                        {
                            checkBoxGroup(defaultScalpingColumns4()).map(item => {
                                return <Col span={12} style={{ marginBottom: '10px' }} key={item.value}>
                                    <Checkbox value={item.value} style={{ display: item.value === 'publishStatus' ? 'none' : 'block' }}>{item.label}</Checkbox>
                                </Col>

                            })
                        }
                    </Row>
                </Checkbox.Group>
            </div>
        );
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="商品管理" second="自营商品4.0" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="商品名称">
                                <Input placeholder="请输入商品名称"
                                    onBlur={this.handleTitle.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="发布状态">
                                <GoodsStatus width={this.state.width} goodsType={4} defaultValue={6}
                                    getStatus={this.handlePublicStatus.bind(this)}
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
                                    onClick={this.onCommonHandle.bind(this, 2, '批量下架')} loading={this.state.exportLoading}
                                >批量下架</Button>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.onCommonHandle.bind(this, 3, '批量删除')} loading={this.state.deleteLoading}
                                >批量删除</Button>
                                <Popover content={content} title="自定义字段" trigger="click">
                                    <Button type={"primary"} style={{ marginBottom: '10px' }}>字段设置<Icon
                                        type="down"
                                                                                                  /></Button>
                                </Popover>
                            </div>
                        </div>
                        <Table rowSelection={rowSelection} columns={this.state.tableColumns}
                            dataSource={this.state.tableData}
                            locale={{ emptyText: '无符合条件的记录' }}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Resource;
