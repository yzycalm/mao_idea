/**
 * Created smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, Checkbox, Icon, Popover, Row, Col, Modal, DatePicker, Select } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { GoodsPlatform, GoodsStatus } from '../commodity/common'
import { getGoodsList, sortGoodsList, handleUpdateData } from '../../api/commondity/attract'
import { openNotificationWithIcon, paginationProps, showConfirm } from '../../utils/index'
import {
    defaultAllColumns,
    checkBoxGroup,
    handleGoods,
    onExportGoodList,
    getCollectTable
} from "../../utils/commodity";
import moment from "moment"
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'

const { confirm } = Modal
const { RangePicker } = DatePicker
const { TextArea } = Input
const { Option } = Select
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
// 可编辑单元格
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
        editing: false,
    };
    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id])
                return;
            this.toggleEdit()
            handleSave({ ...record, ...values });
        });
    };
    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${title} 不能为空.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                >
                    {children}
                </div>
            );
    };

    render () {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                        children
                    )}
            </td>
        );
    }
}

class Resource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: defaultAllColumns((tag, record) => {
                if (tag && tag === 3) {
                    this.showEditConfirm('商品不通过原因', 3, record, () => {
                        this.initData()
                    })
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
                productType: 2,
                publishStatus: 0,
                startTime: ""
            },
            width: 177,
            selectedRowKeys: [],
            exportLoading: false,
            deleteLoading: false,
            soldOutLoading: false,
            soldInLoading: false,
            collect: {
                audit: 0,
                notPassed: 0,
                settlement: 0,
                upperShelf: 0
            },
            nopassReason: '',
            startTime: '',
            endTime: '',
            updateLoading: false,
            fiveMinDisabled: false
        }
        this.initData = this.initData.bind(this);
    }

    componentDidMount () {
        this.initCollectInfo(() => {
            this.initData()
        })
        const column = JSON.parse(localStorage.getItem("columnData"))
        if (column && column.length > 0) {
            this.onChange(column)
        }
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }

    // 初始化数据
    initData () {
        const that = this
        that.setState({
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
        getCollectTable(2, (res) => {
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

    // 时间范围
    handleTimeHorizon (val) {
        this.setState({
            startTime: new Date(val[0]).getTime(),
            endTime: new Date(val[1]).getTime()
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

    handleOrderTime (value) {
        let data = Object.assign({}, this.state.query, {
            startTime: new Date(value[0]).getTime(),
            endTime: new Date(value[1]).getTime(),
            curPage: 1
        })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    onChange = (checkedValues) => {
        let data = []
        let selected = []
        defaultAllColumns((tag, record) => {
            if (tag && tag === 3) {
                this.showEditConfirm('商品不通过原因', 3, record, () => {
                    this.initData()
                })
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
        localStorage.setItem("columnData", JSON.stringify(selected))
        this.setState({ tableColumns: data })
    }

    // 批量删除/上架/下架/不通过
    onCommonHandle (operateType, handleTip) {
        const that = this
        if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
            showConfirm(handleTip, () => {
                if (operateType === 2) {
                    this.setState({
                        deleteLoading: true
                    })
                }
                if (operateType === 0) {
                    this.setState({
                        soldInLoading: true
                    })
                }
                if (operateType === 0) {
                    this.setState({
                        soldOutLoading: true
                    })
                }
                const params = {
                    list: that.state.selectedRowKeys,
                    merchantsId: "",
                    nopassReason: this.state.nopassReason,
                    operateType: operateType
                }
                handleGoods(params, handleTip, () => {
                    this.initData()
                    this.setState({
                        deleteLoading: false,
                        soldOutLoading: false,
                        soldInLoading: false
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

    getReasonInfo (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                nopassReason: value
            })
        } else {
            this.setState({
                nopassReason: ''
            })
        }
    }

    handleGoodsName (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { productMsg: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { productMsg: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    showEditConfirm (title, tag, record, callback) {
        const that = this
        if (tag === 4 && this.state.selectedRowKeys.length < 1) {
            openNotificationWithIcon('warning', '请先选择')
            return
        }
        let content = <Form layout="inline" className="login-form">
            <Form.Item label="不通过原因" style={{ display: tag === 3 ? 'block' : 'none' }}>
                <TextArea onChange={that.getReasonInfo.bind(that)} style={{ width: '303px' }} row={4} />
            </Form.Item>
            <Form.Item label="上架时间--下架时间" style={{ display: tag === 4 ? 'block' : 'none' }}>
                <RangePicker renderExtraFooter={() => '红人装'} showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('24:00:00', 'HH:mm:ss')]
                }} onOk={this.handleTimeHorizon.bind(this)} style={{ width: '245px' }} locale={locale}
                />
            </Form.Item>
        </Form>
        confirm({
            title: title,
            content: content,
            icon: '',
            okText: '确认',
            cancelText: '取消',
            centered: true,
            onOk () {
                let params = {}
                if (tag === 3) {
                    params = {
                        list: [record.id],
                        merchantsId: '',
                        nopassReason: that.state.nopassReason,
                        operateType: tag
                    }
                    handleGoods(params, title, callback)
                } else {
                    params = {
                        list: that.state.selectedRowKeys,
                        merchantsId: '',
                        nopassReason: that.state.nopassReason,
                        operateType: tag,
                        startTime: that.state.startTime,
                        endTime: that.state.endTime,
                    }
                    handleGoods(params, title, () => {
                        that.initData()
                    })
                }
            },
            onCancel () {
                that.setState({
                    nopassReason: ''
                })
            },
        });
    }

    handleSave = record => {
        console.log(record)
        const params = {
            activitySelectedFlowItemSortEntityRequests: [{ id: record.id, sequence: record.sequence }],
            merchantsId: ""
        }
        sortGoodsList(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', `修改排序成功！`)
                this.initData()
            } else {
                openNotificationWithIcon('error', `修改排序失败！`)
            }
        })
    };

    handleSynchronization () {
        const that = this
        that.setState({
            updateLoading: true
        }, () => {
            handleUpdateData().then(res => {
                if (res && res.success) {
                    that.setState({
                        updateLoading: false,
                        fiveMinDisabled: true
                    })
                    setTimeout(() => {
                        that.setState({
                            fiveMinDisabled: false
                        })
                    }, 50000)
                    openNotificationWithIcon('success', `同步成功，请耐心等待！`)
                } else {
                    openNotificationWithIcon('error', res.message)
                }
            })
        })
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
            const selected = JSON.parse(localStorage.getItem("columnData"))
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
            <div style={{ width: '320px' }}>
                <Checkbox.Group defaultValue={checkBoxValue(defaultAllColumns())} onChange={this.onChange.bind(this)}>
                    <Row>
                        {
                            checkBoxGroup(defaultAllColumns()).map(item => {
                                return <Col span={12} style={{ marginBottom: '10px' }} key={item.value}>
                                    <Checkbox style={{ display: item.value === 'action' ? 'none' : 'block' }}
                                        value={item.value}
                                    >{item.label}</Checkbox>
                                </Col>

                            })
                        }
                    </Row>
                </Checkbox.Group>
            </div>
        );
        // 可编辑单元格
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell
            }
        };
        const columns = this.state.tableColumns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave
                })
            };
        });
        const { updateLoading, fiveMinDisabled } = this.state
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="栏目管理" second="首页精选" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="平台">
                                <GoodsPlatform width={this.state.width}
                                    getPlatform={this.handleSelected.bind(this, 'platform')}
                                />
                            </Form.Item>
                            <Form.Item label="商品库">
                                <Select defaultValue={'2'} style={{ width: this.state.width }}
                                    onChange={this.handleSelected.bind(this, 'productType')}
                                >
                                    <Option value="2">全部</Option>
                                    <Option value="1">招商商品库</Option>
                                    <Option value="0">运营商品库</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="商品信息">
                                <Input placeholder="请输入商品名称或商品ID"
                                    onBlur={this.handleGoodsName.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="发布状态">
                                <GoodsStatus width={this.state.width} goodsType={2}
                                    getStatus={this.handleSelected.bind(this, 'publishStatus')}
                                />
                            </Form.Item>
                            <Form.Item label="上架时间">
                                <RangePicker showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }} format="YYYY-MM-DD HH:mm:ss" onOk={this.handleOrderTime.bind(this)}
                                    onChange={this.removeTime.bind(this)}
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
                                    onClick={this.onCommonHandle.bind(this, 1, '上架')}
                                    loading={this.state.soldInLoading}
                                >批量上架</Button>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.onCommonHandle.bind(this, 0, '下架')}
                                    loading={this.state.soldOutLoading}
                                >批量下架</Button>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.onCommonHandle.bind(this, 2, '删除')}
                                    loading={this.state.deleteLoading}
                                >批量删除</Button>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.showEditConfirm.bind(this, '批量设置时间', 4)}
                                >更新时间</Button>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.exportGoods.bind(this, this.state.query)}
                                    loading={this.state.exportLoading}
                                >批量导出</Button>
                                <Popover content={content} title="自定义字段" trigger="click">
                                    <Button type={"primary"} style={{ marginBottom: '10px' }}>字段设置<Icon
                                        type="down"
                                                                                                  /></Button>
                                </Popover>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.handleSynchronization.bind(this)} loading={updateLoading}
                                    disabled={fiveMinDisabled}
                                >同步3.x精选商品到4.X</Button>
                            </div>
                            <div>
                                <p style={{ color: 'grey' }}>
                                    <span>待审核：{this.state.collect.audit}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>未通过：{this.state.collect.notPassed}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>已上架：{this.state.collect.upperShelf}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>已结算：{this.state.collect.settlement}</span></p>
                            </div>
                        </div>
                        <Table rowSelection={rowSelection} columns={columns}
                            dataSource={this.state.tableData} components={components}
                            rowClassName={() => "editable-row"}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 2500 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Resource;
