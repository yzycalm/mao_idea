import React from 'react';
import { Table, Input, Button, Form, Card } from 'antd';
import { format, handleScrollTop, openNotificationWithIcon, paginationProps } from "../../utils";
import { changeCurPage, changePageSize } from "../../store/actionCreators";
import BreadcrumbCustom from "../BreadcrumbCustom";
import store from "../../store";
import { findSysContentTypeList, addOrUpdateSysContentType, deleteSysContentTypeById } from "../../api/application/mine";
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
        console.log(record)
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            record.sort = values.sort
            handleSave(record);
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

class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableColumns: [
                {
                    title: '排序',
                    dataIndex: 'sort',
                    width: 200,
                    editable: true
                },
                {
                    title: '模块名称',
                    dataIndex: 'name',
                },
                {
                    title: '级别',
                    dataIndex: 'level',
                    render: (text, record) => {
                        if (text === "0") {
                            return <span>一级图标</span>
                        } else {
                            return <span>二级图标</span>
                        }
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'isAble',
                    render: (text, record) => {
                        if (text === "1") {
                            return <span>禁用</span>
                        } else {
                            return <span>启用</span>
                        }
                    }
                },
                {
                    title: '最近编辑时间',
                    dataIndex: 'updateTime',
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
                        if (record.isAble === 1) {
                            return <span>
                                <Button type={"primary"}
                                    onClick={() => {
                                        this.AddOrNav(record)
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
                            return <span>
                                <Button type={"primary"}
                                    onClick={() => {
                                        this.AddOrNav(record)
                                    }}
                                >编辑</Button>

                                <Button type={"primary"}
                                    onClick={() => {
                                        this.management(record)
                                    }}
                                >管理</Button>
                            </span>
                        }
                    }
                },
            ],
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
            },
            count: 2,
            tableData: [],
            loading: false
        };
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
            findSysContentTypeList(this.state.query).then((res) => {
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

    AddOrNav (record) {
        this.props.history.push({
            pathname: 'children/addMine',
            query: { detail: record.id ? JSON.stringify(record) : '' }
        })
        handleScrollTop(2)
    }

    management (record) {
        this.props.history.push({
            pathname: "entryManagement",
            query: { id: record.id, name: record.name, level: record.level }
        })
    }

    handleSave = row => {
        console.log(row)
        addOrUpdateSysContentType(row).then(res => {
            if (res && res.success) {
                this.initData()
            }
        })

        // const that = this
        // const newData = this.state.tableData;
        // const index = newData.findIndex(item => row.key === item.key);
        // newData[index].sort = row.sort;
        // this.setState({
        //     tableData: newData
        // }, ()=>{
        //     console.log(row)
        // addOrUpdateSysContentType(row).then(res => {
        //     if (res && res.success) {
        //         that.initData()
        //     }
        // })
        // })
    };

    //删除数据
    handleDelete (text, record) {
        const params = { id: record.id }
        deleteSysContentTypeById(params).then(res => {
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
                <BreadcrumbCustom first="应用配置" second="我的页面" />
                <div className="gutter-box">
                    <Card bordered>
                        <Button type="primary" onClick={this.AddOrNav.bind(this)} style={{ marginBottom: 16 }}>
                            新增模块
                        </Button>
                        <Table
                            components={components}
                            rowClassName={() => 'editable-row'}
                            dataSource={tableData}
                            columns={columns}
                            pagination={pagination}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Mine;
