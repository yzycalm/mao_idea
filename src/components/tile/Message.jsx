import React from 'react';
import {Table, Input, Button, Form, Card, Modal, DatePicker} from 'antd';
import {disabledDate, format, handleScrollTop, openNotificationWithIcon, paginationProps} from "../../utils";
import {changeCurPage, changePageSize} from "../../store/actionCreators";
import BreadcrumbCustom from "../BreadcrumbCustom";
import store from "../../store";
import {
    getMessageList,
    removeMessage,
    editMessageSort,
    editMessageStatus,
    saveOrEditMessage, findMessageById
} from "../../api/tile/message";
import {showStopOrDelete} from "../../utils/share";
import moment from "moment";

const EditableContext = React.createContext();
const {TextArea} = Input;
const {RangePicker} = DatePicker;
const EditableRow = ({form, index, ...props}) => (
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
        this.setState({editing}, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const {record, handleSave} = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({...record, ...values});
        });
    };

    renderCell = form => {
        this.form = form;
        const {children, dataIndex, record, title} = this.props;
        const {editing} = this.state;
        return editing ? (
            <Form.Item style={{margin: 0}}>
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
                style={{paddingRight: 24}}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
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

class FootNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableColumns: [
                {
                    title: '排序',
                    dataIndex: 'weight',
                    width: 100,
                    editable: true
                },
                {
                    title: '消息标题',
                    dataIndex: 'content',
                    width: 300
                },
                {
                    title: '跳转链接',
                    dataIndex: 'action',
                    width: 400,
                    render: (text => {
                        return <div className="word_break">
                            {text}
                        </div>

                    })
                },
                {
                    title: '添加时间',
                    dataIndex: 'createTime',
                    render: text => {
                        return format(text)
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    render: (text, record) => {
                        let statusText = null
                        switch (+text) {
                            case 1:
                                statusText = "展示中"
                                break
                            case 2:
                                statusText = "未开始"
                                break
                            case 3:
                                statusText = "已停止"
                                break
                            case 4:
                                statusText = "已过期"
                                break
                        }
                        return <span>{statusText}</span>
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 180,
                    fixed: 'right',
                    render: (text, record) => {
                        if (+record.status === 1) {
                            return <span>
                            <Button type={"primary"}
                                    onClick={() => {
                                        this.setState({
                                            visible: true,
                                            title: '编辑消息内容'
                                        }, () => {
                                            this.viewDetail(record.id)
                                        })
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
                        } else if (+record.status === 2) {
                            return <span>
                            <Button type={"primary"}
                                    onClick={() => {
                                        this.setState({
                                            visible: true,
                                            title: '编辑消息内容'
                                        }, () => {
                                            this.viewDetail(record.id)
                                        })
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
                        } else {
                            return <Button type={"primary"}
                                           onClick={() => {
                                               showStopOrDelete('删除', record, () => {
                                                   this.handleDelete('删除', record)
                                               })
                                           }}
                                   >删除</Button>
                        }
                    }
                },
            ],
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                clientId: store.getState().clientId
            },
            count: 2,
            tableData: [],
            loading: false,
            visible: false,
            title: '新增消息内容'
        };
    }

    componentDidMount() {
        this.initData()
        handleScrollTop(1)
    }

    // 初始化数据
    initData() {
        const that = this
        this.setState({
            loading: true
        }, () => {
            getMessageList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index.toString() + item.id + new Date().getTime()
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

    AddOrMessage(record) {
        this.props.history.push({
            pathname: 'children/addMessageStyle',
            query: {detail: record.id ? JSON.stringify(record) : ''}
        })
        handleScrollTop(2)
    }

    viewDetail(id) {
        this.setState({id: id})
        findMessageById({id: id}).then(res => {
            if (res && res.success) {
                const data = res.data
                this.props.form.setFieldsValue({
                    content: data.content,
                    action: data.action,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')]
                })
            }
        })
    }

    handleSave = row => {
        const that = this
        const newData = this.state.tableData;
        const index = newData.findIndex(item => row.key === item.key);
        newData[index].weight = row.weight;
        this.setState({
            tableData: newData
        }, () => {
            editMessageSort({id: row.id, weight: row.weight}).then(res => {
                if (res && res.success) {
                    openNotificationWithIcon('success', '修改排序成功')
                    that.initData()
                }
            })
        })
    };

    // 停止展示
    handleStop(text, record) {
        const params = {id: record.id, invisible: 1}
        editMessageStatus(params).then(res => {
            if (res && res.success) {
                this.initData()
                openNotificationWithIcon('success', text + '成功')
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })

    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (this.state.id) {
                    values.id = this.state.id
                }
                values.startTime = moment(values.time[0]).valueOf() / 1000
                values.endTime = moment(values.time[1]).valueOf() / 1000
                delete values.time
                saveOrEditMessage(values).then(res => {
                    if (res && res.success) {
                        openNotificationWithIcon('success', '保存成功！')
                        this.handleClose()
                        this.initData()
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

    //删除数据
    handleDelete(text, record) {
        const params = {id: record.id}
        removeMessage(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', text + '成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (this.state.dataLength <= 1 && this.state.query.curPage > 1) {
                    const current = parseInt(this.state.query.curPage - 1)
                    let data = Object.assign({}, this.state.query, {curPage: current})
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

    handleClose() {
        this.setState({visible: false, id: ""}, () => {
            this.props.form.resetFields()
        })
    }

    render() {
        const {tableData, visible, loading, id, isReset} = this.state;
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
            let data = Object.assign({}, this.state.query, {pageSize: pageSize, curPage: 1})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, {curPage: current})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 5},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 19},
            },
        };
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="布局配置" second="消息栏管理" />
                <div className="gutter-box">
                    <Card bordered>
                        <Button type="primary" onClick={() => {
                            this.setState({visible: true, title: "新增消息内容", isReset: true})
                        }} style={{marginBottom: 16}}
                        >
                            新增内容
                        </Button>
                        <Button type="primary" onClick={this.AddOrMessage.bind(this)} style={{marginBottom: 16}}>
                            样式设置
                        </Button>
                        <Table
                            components={components}
                            rowClassName={() => 'editable-row'}
                            dataSource={tableData}
                            columns={columns}
                            loading={loading}
                            pagination={pagination}
                            scroll={{x: 1300}}
                        />
                    </Card>
                    <Modal
                        title={this.state.title}
                        visible={visible}
                        centered
                        okText="确认"
                        cancelText="取消"
                        onCancel={this.handleClose.bind(this)}
                        onOk={this.handleSubmit}
                    >
                        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                            <Form.Item label="消息标题">
                                {getFieldDecorator('content', {
                                    initialValue: "",
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入消息标题!',
                                        }, {
                                            min: 1,
                                            max: 20,
                                            message: '不超过20个中英字符'
                                        }
                                    ],
                                })(<Input />)}
                            </Form.Item>
                            <Form.Item label="跳转链接">
                                {getFieldDecorator('action', {
                                    initialValue: "",
                                    rules: [
                                        {
                                            required: false,
                                            message: '请输入跳转链接!',
                                        }
                                    ],
                                })(<TextArea rows={4} />)}
                            </Form.Item>
                            <Form.Item label="展示时间段">
                                {getFieldDecorator('time', {
                                    initialValue: "",
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择展示时间段!',
                                        },
                                    ],
                                })(<RangePicker showTime disabledDate={disabledDate} format="YYYY-MM-DD HH:mm:ss" />)}
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        );
    }
}

const BasicForm = Form.create()(FootNav);

export default BasicForm;
