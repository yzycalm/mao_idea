import React from 'react';
import { Card, Form, Input, Button, Table, DatePicker,Select } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { getTableImgShowSpecial } from "../../utils/marketing";
import { deleteShareItem } from '../../api/share/shareList'
import { getTodayPushList,statusorsort } from '../../api/tile/todayPush'
import { list,actionScene } from '../../api/assemblyHall/index';
import { getTableHandleAss } from '../../utils/marketing'
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
                    title: '序号',
                    dataIndex: 'index',
                    key: 'index',
                    width: 100,
                    editable: false,

                },
                {
                    title: '组合会场名称',
                    dataIndex: 'title',
                    width: 220,
                    key: 'title',
                    render: (text => {
                        return <div className="word_break">
                            {text ? getContent(text) : 'ᅳ'}
                        </div>

                    })

                },
                {
                    title: '关联活动管理名称',
                    dataIndex: 'monographicName',
                    textWrap: 'word-break',
                    width: 230,
                    key: 'monographicName',
                    render: (text => {
                        return <div className="word_break">
                            {text ? getContent(text) : 'ᅳ'}
                        </div>

                    })

                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    width: 120,
                    key: 'status',
                    render: (text, record) => {
                        if (text == "0") {
                            return <span>已上架</span>
                        } else if (text == "1") {
                            return <span>未开始</span>
                        } else {
                            return <span>已下架</span>
                        }
                    }
                },
                 {
                    title: '会场链接',
                    dataIndex: 'redirectUrl',
                    key: 'redirectUrl',
                    render: (text, record) => {
                        
                            let url = ''
                            if (process.env.NODE_ENV === 'production') {
                                url = `https://cloud.hongrz.com/H5/hrz-618_place/index.html?unionid=[userid]&gpSceneId=${record.id}&type=tanhuiyi`
                            } else {
                                url = `https://cloud.hongrz.com/H5/hrz-618_place/index.html?unionid=[userid]&gpSceneId=${record.id}&type=tanhuiyi&env=test`
                            } 
                            return <a target = "_blank" style = {{textDecoration:"none", color:"#19AFF1" }} href={url} className="word_break">{url}</a>
                        

                    }
                },
                 {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    width: 220,
                    key: 'createTime',
                    render: text => {
                        return format(text)
                    }
                }, {
                    title: '操作',
                    dataIndex: 'status',
                    key: "id",
                    width: 300,
                    fixed: 'right',
                    render: (text, record) => {

                        return getTableHandleAss(text, record, (item) => {
                            if (item === '下架') {
                                this.handleStop(item, record)
                            } else if (item === '删除') {
                                this.handleDelete(item, record)
                            } else if(item === '上架'){
                                this.upScn(item, record)
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
            list(this.state.query).then((res) => {
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
        const params = {
            action:"3",
            id: record.id,
            gpId:record.id
        }
        actionScene(params).then(res => {
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
            action:"2",
            id: record.id,
            gpId:record.id
        }
        actionScene(params).then(res => {
            if(res.success) {
                openNotificationWithIcon('success', text + '成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    upScn(text, record){
        const params = {
            action:"1",
            id: record.id,
            gpId:record.id
        }
        actionScene(params).then(res => {
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
            pathname: 'children/AddHall',
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
                <BreadcrumbCustom first="组合会场" second="组合会场" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            
                            <Form.Item label="组合会场名称:">
                                <Input placeholder="请输入组合会场名称"
                                    onBlur={this.handleTitle.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="发布状态">
                                <Select defaultValue={"全部"} style={{ width: this.state.width }}
                                    onChange={this.handleSelected.bind(this, 'status')}
                                >   
                                    <Option value={""}>全部</Option>
                                    <Option value={0}>已上架</Option>
                                    <Option value={2}>已下架</Option>
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
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.AddOrEditTodayPush.bind(this)}
                                >新增组合会场</Button>
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