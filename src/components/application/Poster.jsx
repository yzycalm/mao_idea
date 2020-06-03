import React from 'react';
import { Table, Input, Button, Form, Card, Select } from 'antd';
import { format, handleScrollTop, openNotificationWithIcon, paginationProps } from "../../utils";
import { changeCurPage, changePageSize } from "../../store/actionCreators";
import BreadcrumbCustom from "../BreadcrumbCustom";
import { getTableImgShow } from "../../utils/marketing";
import store from "../../store";
import { feacthPosterInfo, delPosterInfo, updateSequence, updatePosterStatus} from "../../api/application/poster";
import { showStopOrDelete } from "../../utils/share";
const Option = Select.Option;

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
class Poster extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [
                {
                    title: '排序',
                    dataIndex: 'sequence',
                    width: 200,
                    editable: true
                },
                {
                    title: '海报名称',
                    dataIndex: 'title',
                },
                {
                    title: '海报图',
                    dataIndex: 'img',
                    width: 200,
                    key: 'img',
                    render: (url, record) => {
                        return getTableImgShow(url, record)
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    render: (text, record) => {
                        if (record.status === 1) {
                            return <span>展示中</span>
                        } else if (record.status === 2) {
                            return <span>未开始</span>
                        } else {
                            return <span>已停止</span>
                        }
                    }
                },
                {
                    title: '展示时间',
                    dataIndex: 'startTime',
                    render: (text, record) => {
                        return <div>
                            <div>{format(record.startTime)}</div>
                            <div>{format(record.endTime)}</div>
                        </div>
                    }
                },
                {
                    title: '最近编辑时间',
                    dataIndex: 'lastUpdateTime',
                    render: text => {
                        return format(text)
                    }
                },
                {
                    title: '操作',
                    width: 180,
                    fixed: 'right',
                    dataIndex: 'operation',
                    render: (text, record) => {
                        if (record.status === 1) {
                            return <span>
                                <Button type={"primary"}
                                    onClick={() => {
                                        this.addPoster(record)
                                    }}
                                >编辑</Button>
                                <Button type={"primary"}
                                    onClick={() => {
                                        showStopOrDelete('停止', record, () => {
                                            this.handleStop('停止', record)
                                        })
                                    }}
                                >停止</Button>
                            </span>
                        } else {
                            return <span>
                                <Button type={"primary"}
                                    onClick={() => {
                                        this.addPoster(record)
                                    }}
                                >编辑</Button>

                                <Button type={"primary"}
                                    onClick={() => {
                                        showStopOrDelete('删除', record, () => {
                                            this.handleDelete('删除', record)
                                        })
                                    }}
                                >删除</Button>
                            </span>
                        }
                    }
                },
            ],
            query: {
                status: 0,
                title: '',
                clientId: store.getState().clientId,
                pageNum: store.getState().curPage,
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
            },
            total: 0,
            dataLength: 0,
            tableData: [],
            loading: false
        }
    }

    componentDidMount () {
        this.initData()
        handleScrollTop(1)
    }
    initData () {
        const that = this
        this.setState({
            loading: true
        }, () => {
            feacthPosterInfo(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + '' + item.id
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
    addPoster (record) {
        this.props.history.push({
            pathname: 'children/AddPoster',
            query: { detail: record.id ? JSON.stringify(record) : '' }
        })
        handleScrollTop(2)
    }
    handleDelete (text, record) {
        const params = { id: record.id }
        delPosterInfo(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', text + '成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (this.state.dataLength <= 1 && this.state.query.curPage > 1) {
                    const current = parseInt(this.state.query.curPage - 1)
                    let data = Object.assign({}, this.state.query, { curPage: current, pageNum: current })
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
    handleStop (text, record) {
        const userInfo = JSON.parse(localStorage.getItem('user'))
        const params = { 
            id: record.id, 
            operator: userInfo.userName,
            status: 1
        }
        updatePosterStatus(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', text + '成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (this.state.dataLength <= 1 && this.state.query.curPage > 1) {
                    const current = parseInt(this.state.query.curPage - 1)
                    let data = Object.assign({}, this.state.query, { curPage: current, pageNum: current })
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
    handleSave = row => {
        const that = this
        const newData = this.state.tableData;
        const index = newData.findIndex(item => row.key === item.key);
        const curRow = newData[index]
        const userInfo = JSON.parse(localStorage.getItem('user'))
        const sendData = {
            id: curRow.id,
            newSeq: parseInt(row.sequence),
            oldSeq: curRow.sequence,
            operator: userInfo.userName
        }
        updateSequence(sendData).then(res => {
            if (res && res.success) {
                that.initData()
            }
        })
    };
    // 标题
    handleTitle (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { title: value, curPage: 1, pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { title: '', curPage: 1, pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    
    // 下拉框
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1, pageNum: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData();
        })
    }

    render () {
        const { tableData } = this.state;
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
            let data = Object.assign({}, this.state.query, { pageSize: pageSize, curPage: 1, pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, { curPage: current, pageNum: current })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="应用配置" second="海报推广" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="海报名称:">
                                <Input defaultValue={this.state.query.message} onBlur={this.handleTitle.bind(this)} />
                            </Form.Item>
                            <Form.Item label="状态:">
                                <Select defaultValue={this.state.query.status} style={{ width: '200px' }}
                                    onChange={this.handleSelected.bind(this, 'status')}
                                >
                                    <Option value={0}>全部</Option>
                                    <Option value={1}>展示中</Option>
                                    <Option value={2}>未开始</Option>
                                    <Option value={3}>已停止</Option>
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
                            onClick={this.addPoster.bind(this)}
                        >新增海报</Button>
                        <Table
                            components={components}
                            rowClassName={() => 'editable-row'}
                            dataSource={tableData}
                            columns={columns}
                            loading={this.state.loading}
                            pagination={pagination}
                        />
                        {/* <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        /> */}
                    </Card>
                </div>
            </div>
        );
    }
}

export default Poster