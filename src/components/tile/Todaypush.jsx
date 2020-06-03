import React from 'react';
import { Card, Form, Input, Button, Table, DatePicker,Select } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { getTableImgShowSpecial } from "../../utils/marketing";
import { deleteShareItem } from '../../api/share/shareList'
import { getTodayPushList,statusorsort } from '../../api/tile/todayPush'
import { getTableHandleTodaypush } from '../../utils/marketing'
import {
    openNotificationWithIcon,
    paginationProps,
    format,
    getContent,
    handleScrollTop
} from '../../utils/index'
import moment from "moment";
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'

const { RangePicker } = DatePicker;
const Option = Select.Option;
const EditableContext = React.createContext();

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
class todatpush extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [
                {
                    title: '排序',
                    dataIndex: 'sort',
                    width: 60,
                    key: 'sort',
                    editable: true,

                },
                {
                    title: '二级页面',
                    dataIndex: 'type',
                    width: 180,
                    key: 'type',
                    render: (text => {
                        return <div>
                            {this.getType(text)}
                        </div>

                    })

                },
                {
                    title: '广告名称',
                    dataIndex: 'title',
                    textWrap: 'word-break',
                    width: 150,
                    key: 'title',
                    render: (text => {
                        return <div className="word_break">
                            {text ? getContent(text) : 'ᅳ'}
                        </div>

                    })

                },
                {
                    title: '图片',
                    dataIndex: 'picUrl',
                    width: 100,
                    key: 'picUrl',
                    render: (url, record) => {
                        return getTableImgShowSpecial(url, record)
                    }
                }, {
                    title: '跳转地址',
                    dataIndex: 'redirectUrl',
                    width: 400,
                    key: 'redirectUrl',
                    render: text => {
                        return <a className="word_break" target="_blank"
                        href={text}
                               >{text}</a>

                    }
                },
                {
                    title: '展示时间段',
                    dataIndex: 'startTime',
                    width: 260,
                    key: 'startTime',
                    render: (text, record) => {
                        return <span className="word_break">{record.startTime && record.endTime ? format(text) + '-' + format(record.endTime) : '——'}</span>
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    width: 120,
                    key: 'status',
                    render: (text, record) => {
                        if (text == "0") {
                            return <span>展示中</span>
                        } else if (text == "1") {
                            return <span>未开始</span>
                        } else {
                            return <span>已下架</span>
                        }
                    }
                }, {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    width: 200,
                    key: 'createTime',
                    render: text => {
                        return format(text)
                    }
                }, {
                    title: '操作',
                    dataIndex: 'status',
                    key: "id",
                    width: 180,
                    fixed: 'right',
                    render: (text, record) => {

                        return getTableHandleTodaypush(text, record, (item) => {
                            if (item === '停止') {
                                this.handleStop(item, record)
                            } else if (item === '删除') {
                                this.handleDelete(item, record)
                            } else {
                                this.AddOrEditTodayPush(record)
                            }
                        })
                    }
                }
            ]
            ,
            tableData: [],
            loading: true,
            total: 0,
            dataLength: 0, // 获取当前页面有多少条数据
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                endTime: "",
                startTime: "",
                status: "",
                title: "",
            },
            width: 100,
            selectedRowKeys: [],
            fileList: [],
            toLeadLoading: false,
            exportLoading: false,
            deleteLoading: false,
            soldOutLoading: false,
            typevalue: 0,
            collect: {
                audit: 0,
                notPassed: 0,
                settlement: 0,
                upperShelf: 0
            }
        }
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
            getTodayPushList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = item.id
                            item.index = index + 1
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



    //删除数据
    handleDelete(text, record) {
        const params = { id: record.id }
        deleteShareItem(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', text + '成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (this.state.dataLength <= 1 && this.state.query.curPage > 1) {
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

    // 操作 停止
    handleStop(text, record) {
        const params = {
            id: record.id,
            action:1,
            type:record.type,
            sort:record.sort,
            status:2
        }
        console.log(record)
        statusorsort(params).then(res => {
            if(res.success) {
                openNotificationWithIcon('success', text + '成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }


    handleDelete(text, record) {
        const params = {
            id: record.id,
            action:1,
            type:record.type,
            sort:record.sort,
            status:1
        }
        console.log(record)
        statusorsort(params).then(res => {
            if(res.success) {
                openNotificationWithIcon('success', text + '成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    handleSave = row => {
        console.log(row)
        const params = {
            id: row.id,
            action:2,
            type:row.type,
            sort:row.sort,

        }

        statusorsort(params).then(res => {
            if(res.success) {
                openNotificationWithIcon('success', '修改排序成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    };


    getType(val) {
        switch (val) {
            case 0:
                this.state.typevalue = "今日必推"
                return this.state.typevalue
            case 1:
                this.state.typevalue = "淘宝二级页"
                return this.state.typevalue
            case 2:
                this.state.typevalue = "京东二级页"
                return this.state.typevalue
            case 3:
                this.state.typevalue = "拼多多二级页"
                return this.state.typevalue
                case 4:
                this.state.typevalue = "唯品会二级页"
                return this.state.typevalue

        }
    }

    //新增
    AddOrEditTodayPush(record) {
        this.props.history.push({
            pathname: 'children/AddTodayPush',
            query: { id: record ? record.id : '', title: record.id ? '编辑' : '新增' }
        })
        handleScrollTop(2)
    }
    // 平台系统
    handleSysType(val) {
        let data = Object.assign({}, this.state.query, { platform: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 买家信息
    handleTitle(event) {
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

    // 订单状态
    handleDisplayState(val) {
        let data = Object.assign({}, this.state.query, { orderStatus: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 时间范围
    handleTimeHorizon(value) {
        let data = Object.assign({}, this.state.query, { startTime: new Date(value[0]).getTime()/1000, endTime: new Date(value[1]).getTime()/1000, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    removeTime(value) {
        if (value.length === 0) {
            let data = Object.assign({}, this.state.query, { startTime: '', endTime: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 下拉框
    handleSelected(param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    handleTitle(event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, {title: value, curPage: 1})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, {title: '', curPage: 1})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    render() {
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
                <BreadcrumbCustom first="布局配置" second="二级页广告位" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="二级页面：">
                                <Select defaultValue={this.state.query.status} style={{ width:150 }}
                                    onChange={this.handleSelected.bind(this, 'type')}
                                >
                                    <Option value={0}>今日必推</Option>
                                    <Option value={1}>淘宝二级页</Option>
                                    <Option value={2}>京东二级页</Option>
                                    <Option value={3}>拼多多二级页</Option>
                                    <Option value={4}>唯品会二级页</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="广告名称：">
                                <Input placeholder="请输入广告名称"
                                    onBlur={this.handleTitle.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="发布状态">
                                <Select defaultValue={-1} style={{ width: this.state.width }}
                                    onChange={this.handleSelected.bind(this, 'status')}
                                >
                                    <Option value={0}>展示中</Option>
                                    <Option value={1}>未开始</Option>
                                    <Option value={2}>已下架</Option>
                                    <Option value={-1}>全部</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="展示时间">
                                <RangePicker showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }} format="YYYY-MM-DD HH:mm:ss" onOk={this.handleTimeHorizon.bind(this)} onChange={this.removeTime.bind(this)}
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
                                    onClick={this.AddOrEditTodayPush.bind(this)}
                                >新增</Button>
                            </div>

                        </div>
                        <Table components={components}
                            rowClassName={() => 'editable-row'}
                            columns={columns}
                            dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{x: 1600}}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default todatpush;
