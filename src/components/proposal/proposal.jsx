import React from 'react';
import { Card, Form, Input, Button, Table, DatePicker, Select, Tooltip } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { getTableImgShowSpecial } from "../../utils/marketing";
import { deleteShareItem } from '../../api/share/shareList'
import { onExportGoodListPro } from "../../utils/commodity";
import { getProposalList } from '../../api/proposal/proposal'
import { getTodayPushList, statusorsort } from '../../api/tile/todayPush'
import { listBanner, actionScene, actionTheme, addOrUpdateBanner, themeList, AddTheme } from '../../api/assemblyHall/index';
import { getTableHandleAss } from '../../utils/marketing'
import {
    openNotificationWithIcon,
    paginationPropsFuck,
    format,
    getContent,
    getContentBT,
    handleScrollTop
} from '../../utils/index'
import moment from "moment";
import store from '../../store'
import { changeCurPage, changePageSize } from '../../store/actionCreators'

const { RangePicker } = DatePicker;
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
class AssBanner extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [
                {
                    title: '序号',
                    dataIndex: 'id',
                    key: 'id',
                    width: 20,
                    editable: false,

                },

                {
                    title: '提交时间',
                    dataIndex: 'createTime',
                    width: 130,
                    key: 'createTime',
                    render: (text => {
                        return <div className="word_break">
                            {text ? getContent(text) : 'ᅳ'}
                        </div>

                    })

                },
                {
                    title: '内容类别',
                    dataIndex: 'type',
                    textWrap: 'word-break',
                    width: 130,
                    key: 'type',
                    render: (text => {
                        return <div className="word_break">
                            {text ? this.typeContent(text) : 'ᅳ'}
                        </div>

                    })

                },
                {
                    title: '详细内容',
                    dataIndex: 'content',
                    key: 'content',
                    width: 160,
                    ellipsis: {
                        showTitle: false,
                    },
                    render: text => (
                            
                            <Tooltip placement="topLeft" title={text}>
                               <span  className="word_break_proposal" style={{width: '300px', '-webkit-box-orient': 'vertical'}}>{text}</span>
                            
                            </Tooltip>
                       
                    ),
                },

                {
                    title: '所属区域',
                    dataIndex: 'region',
                    width: 100,
                    key: 'region',
                    render: (text => {
                        return <div className="word_break">
                            {text ? getContent(text) : 'ᅳ'}
                        </div>

                    })

                },
                {
                    title: '昵称',
                    dataIndex: 'nickname',
                    width: 100,
                    key: 'nickname',
                    render: (text => {
                        return <div className="word_break">
                            {text ? getContent(text) : 'ᅳ'}
                        </div>

                    })

                },
                {
                    title: '绑定手机号',
                    dataIndex: 'phone',
                    width: 180,
                    key: 'phone',
                    render: (text => {
                        return <div className="word_break">
                            {text ? getContent(text) : 'ᅳ'}
                        </div>

                    })

                },






            ]
            ,
            tableData: [],
            loading: true,
            total: 0,
            dataLength: 0, // 获取当前页面有多少条数据
            query: {
                pageNum: store.getState().curPage,
                pageSize: store.getState().pageSize,
                type: "",
                clientId: "hrz_app"
            },
            width: 200,
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
            getProposalList(this.state.query).then((res) => {
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

    typeContent (val) {
        var type = ""
        if (val == 1) {
            return "APP使用问题"
        } else if (val == 2) {
            return "商业及推广合作；"
        } else if (val == 3) {
            return "市场推广及运营"
        } else if (val == 5) {
            return "投诉"
        }
    }

    exportGoods () {
        this.setState({
            exportLoading: true
        })
        onExportGoodListPro(this.state.query, (() => {
            this.setState({
                exportLoading: false
            })
        }))
    }

    getContentDetail (str) {
        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
        str = str.replace(/\n[\s| | ]*\r/g, '\n'); //去除多余空行
        str = str.replace(/<[^>]+>|&[^>]+;/g, "").trim()
        return str;
    }


    upScn (text, record) {
        const params = {
            action: "1",
            id: record.id,
            gpId: record.gpId
        }
        actionTheme(params).then(res => {
            if (res.success) {
                openNotificationWithIcon('success', text + '成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    // 操作 停止
    handleStop (text, record) {
        const params = {
            action: "2",
            id: record.id,
            gpId: record.gpId
        }
        actionTheme(params).then(res => {
            if (res.success) {
                openNotificationWithIcon('success', text + '成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    handleSave = row => {
        AddTheme(row).then(res => {
            if (res.success) {
                openNotificationWithIcon('success', '修改排序成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    };




    getType (val) {
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
    AddOrEditTodayPush (record) {
        this.props.history.push({
            pathname: 'children/AddTheme',
            query: { id: record ? record.id : '', title: record.id ? '编辑' : '新增' }
        })
        handleScrollTop(2)
    }
    // 平台系统
    handleSysType (val) {
        let data = Object.assign({}, this.state.query, { platform: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 买家信息
    // handleTitle(event) {
    //     if (event && event.target && event.target.value) {
    //         let value = event.target.value;
    //         let data = Object.assign({}, this.state.query, { productMsg: value, curPage: 1 })
    //         this.setState({
    //             query: data
    //         }, () => {
    //             this.initData()
    //         })
    //     } else {
    //         let data = Object.assign({}, this.state.query, { productMsg: '', curPage: 1 })
    //         this.setState({
    //             query: data
    //         }, () => {
    //             this.initData()
    //         })
    //     }
    // }

    // 订单状态
    handleDisplayState (val) {
        let data = Object.assign({}, this.state.query, { orderStatus: val, pageNum: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 时间范围
    handleTimeHorizon (value) {
        let data = Object.assign({}, this.state.query, { startTime: format(new Date(value[0]).getTime()), endTime: format(new Date(value[1]).getTime()), pageNum: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    removeTime (value) {
        if (value.length === 0) {
            let data = Object.assign({}, this.state.query, { pageNum: 1 })
            delete data.startTime
            delete data.endTime
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 下拉框
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, pageNum: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    handleTitle (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { phone: value, pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { pageNum: 1 })
            delete data.phone
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
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
        const pagination = paginationPropsFuck(this.state.total, this.state.query, (current, pageSize) => {
            changePageSize(pageSize)
            changeCurPage(1)
            //  每页显示多少条
            let data = Object.assign({}, this.state.query, { pageSize: pageSize, pageNum: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, { pageNum: current })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="建议及投诉" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="提交时间">
                                <RangePicker showTime={{
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                }} format="YYYY-MM-DD HH:mm:ss" onOk={this.handleTimeHorizon.bind(this)} onChange={this.removeTime.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="内容类别" >
                                <Select defaultValue={"全部"} style={{ width: this.state.width }}
                                    onChange={this.handleSelected.bind(this, 'type')}
                                >
                                    <Option value={""}>全部</Option>
                                    <Option value={1}>APP使用问题</Option>
                                    <Option value={2}>商业及推广合作</Option>
                                    <Option value={3}>市场推广及运营</Option>
                                    <Option value={5}>投诉</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="绑定手机号">
                                <Input placeholder="请输入手机号"
                                    onBlur={this.handleTitle.bind(this)}
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
                                    onClick={this.exportGoods.bind(this, this.state.query)} loading={this.state.exportLoading}
                                >导出</Button>
                            </div>

                        </div>
                        <Table components={components}
                            rowClassName={() => 'editable-row'}
                            columns={columns}
                            dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default AssBanner;
