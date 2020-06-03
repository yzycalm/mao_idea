/**
 * Created by smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, Select } from 'antd/lib/index';
import { findByList, handlePit, handleSort } from '../../api/marketing/homePit'
import { format, handleScrollTop, openNotificationWithIcon, paginationProps } from "../../utils";
import store from '../../store'
import {
    changeCurPage,
    changePageSize,
    inputFirstFrame,
    selectFirstFrame,
    selectSecondFrame
} from '../../store/actionCreators'
import BreadcrumbCustom from '../BreadcrumbCustom';
import { getTableImgShowSpecial } from "../../utils/marketing";
import { showStopOrDelete } from "../../utils/share";

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

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
        record.currentSorts = record.sort
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
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
                            message: `${title}不能为空.`,
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

const Option = Select.Option;

class HomePit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '排序',
                dataIndex: 'sequence',
                width: 80,
                editable: true
            }, {
                title: '平台',
                dataIndex: 'platform',
                width: 120,
                key: 'platform',
                render: text => {
                    let result = ""
                    switch (+text) {
                        case 2:
                            result = "淘宝"
                            break
                        case 3:
                            result = "京东"
                            break
                        case 4:
                            result = "唯品会"
                            break

                        case 6:
                            result = "蘑菇街"
                            break
                        case 7:
                            result = "拼多多"
                            break
                        default:
                            result = "线下"
                            break
                    }
                    return result
                }
            }, {
                title: '活动坑位名称',
                dataIndex: 'title',
                key: 'title',
                width: 200,
            }, {
                title: '图片',
                dataIndex: 'img',
                key: 'img',
                render: (url, record) => {
                    return getTableImgShowSpecial(url, record)
                }
            }, {
                title: '跳转地址',
                dataIndex: 'url',
                key: 'url',
                width: 200,
                render: url => {
                    return <a className="word_break" target="_blank" href={url}>{url}</a>
                }
            }, {
                title: '展示时间段',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 190,
                render: (text, record) => {
                    return <span className="word_break">{record.startTime && record.endTime ? format(text) + '至' + format(record.endTime) : '——'}</span>
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: text => {
                    if (+text === 0) {
                        return "展示中"
                    } else {
                        return +text === 1 ? "未开始" : "已停止"
                    }
                }
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: text => {
                    return format(text)
                }
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: 180,
                fixed: 'right',
                render: (text, record) => {
                    switch (+record.status) {
                        // 1: 下架， 2： 编辑， 3：删除
                        case 0:
                            return <span>
                                <Button type={"primary"}
                                    onClick={() => {
                                        showStopOrDelete('停止', record, () => {
                                            this.handleDelete(true, 2, record)
                                        })
                                    }}
                                >停止</Button>
                                <Button type={"primary"}
                                    onClick={() => {
                                        this.AddHomePit(record)
                                    }}
                                >编辑</Button>
                            </span>
                        case 1:
                            return <span>
                                <Button type={"primary"}
                                    onClick={() => {
                                        this.AddHomePit(record)
                                    }}
                                >编辑</Button>
                                <Button type={"primary"}
                                    onClick={() => {
                                        showStopOrDelete('删除', record, () => {
                                            this.handleDelete(true, 1, record)
                                        })
                                    }}
                                >删除</Button>
                            </span>
                        default:
                            return <span>
                                <Button type={"primary"}
                                    onClick={() => {
                                        this.AddHomePit(record)
                                    }}
                                >编辑</Button>
                                <Button type={"primary"}
                                    onClick={() => {
                                        showStopOrDelete('删除', record, () => {
                                            this.handleDelete(true, 1, record)
                                        })
                                    }}
                                >删除</Button>
                            </span>
                    }
                }
            }],
            tableData: [],
            width: 177,
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                title: store.getState().firstInput,
                status: store.getState().secondSelect !== "" ? store.getState().secondSelect : '0',
                platform: store.getState().firstSelect !== "" ? store.getState().firstSelect : '2'
            },
            loading: false
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
            that.setState({
                tableData: []
            })
            findByList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.data) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + ',' + item.id + new Date().getTime()
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

    AddHomePit (record) {
        inputFirstFrame(this.state.query.title)
        selectFirstFrame(this.state.query.platform)
        selectSecondFrame(this.state.query.status)
        this.props.history.push({
            pathname: 'children/AddHomePit',
            query: { id: record.id ? record.id : '' }
        })
        handleScrollTop(2)
    }

    // 操作 删除和上下架
    handleDelete (platform, value, record) {
        const params = { id: record.id, status: value }
        handlePit(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', value === 2 ? '停止成功' : '删除成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (platform && this.state.dataLength <= 1 && this.state.query.curPage > 1) {
                    const current = parseInt(this.state.query.curPage - 1)
                    let data = Object.assign({}, this.state.query, { curPage: current })
                    this.setState({
                        query: data
                    }, () => {
                        this.initData()
                    })
                    return
                }
                this.initData()

            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    // 商品ID
    handleID (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { title: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { title: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    // 下拉框
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData();
        })
    }

    handleSave = row => {
        const that = this
        const newData = this.state.tableData;
        const index = newData.findIndex(item => row.key === item.key);
        newData[index].sequence = row.sequence;
        this.setState({
            tableData: newData
        }, () => {
            console.log(row)
            const params = {
                sequence: +row.sequence,
                id: row.id,
            }
            handleSort(params).then(res => {
                if (res && res.success) {
                    openNotificationWithIcon('success', '修改排序成功')
                    that.initData()
                }
            })
        })
    };
    render () {
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
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
                    handleSave: this.handleSave,
                }),
            };
        });
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
                <BreadcrumbCustom first="推广管理" second="首页活动坑位" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="平台:">
                                <Select value={this.state.query.platform} onChange={this.handleSelected.bind(this, 'platform')} style={{ width: this.state.width }}>
                                    <Option value="2">淘宝</Option>
                                    <Option value="3">京东</Option>
                                    <Option value="7">拼多多</Option>
                                    <Option value="4">唯品会</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="广告名称:">
                                <Input defaultValue={this.state.query.title} onBlur={this.handleID.bind(this)} />
                            </Form.Item>
                            <Form.Item label="发布状态:">
                                <Select value={this.state.query.status} onChange={this.handleSelected.bind(this, 'status')} style={{ width: this.state.width }}>
                                    <Option value="3">全部</Option>
                                    <Option value="0">展示中</Option>
                                    <Option value="1">未开始</Option>
                                    <Option value="2">已停止</Option>
                                </Select>

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
                            onClick={this.AddHomePit.bind(this)}
                        >新增活动坑位</Button>
                        <Table columns={columns} dataSource={this.state.tableData}
                            rowClassName={() => 'editable-row'}
                            components={components}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default HomePit;
