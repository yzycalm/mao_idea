import React from 'react';
import {Table, Input, Button, Form, Card} from 'antd';
import {handleScrollTop, openNotificationWithIcon, paginationProps} from "../../utils";
import {changeCurPage, changePageSize} from "../../store/actionCreators";
import BreadcrumbCustom from "../BreadcrumbCustom";
import store from "../../store";
import {getCardList, removeCard, editCardSort, stopCard} from "../../api/tile/tile";
import {showStopOrDelete} from "../../utils/share";

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

class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableColumns: [
                {
                    title: '排序',
                    dataIndex: 'weight',
                    width: 150,
                    editable: true,
                },
                {
                    title: '名称',
                    dataIndex: 'name',
                },
                {
                    title: '布局样式',
                    dataIndex: 'typeName'
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    render: (text, record) => {
                        if (+text === 1) {
                            return <span>启用</span>
                        } else {
                            return <span>禁用</span>
                        }
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 300,
                    fixed: 'right',
                    render: (text, record) => {
                        return <span>
                            <Button type={"primary"}
                                    onClick={() => {
                                        this.addOrTile(record)
                                    }}
                            >编辑</Button>
                            <Button type={"primary"}
                                    onClick={() => {
                                        showStopOrDelete('删除', record, () => {
                                            this.handleDelete('删除', record)
                                        })
                                    }}
                            >删除</Button>
                            {
                                +record.status === 1 ? <Button type={"primary"}
                                                               onClick={() => {
                                                                   showStopOrDelete('隐藏', record, () => {
                                                                       this.handleStatus(0, record)
                                                                   })
                                                               }}
                                                       >隐藏本模块</Button> : <Button type={"primary"}
                                                                                           onClick={() => {
                                                                                               showStopOrDelete('启用', record, () => {
                                                                                                   this.handleStatus(1, record)
                                                                                               })
                                                                                           }}
                                                                         >启用本模块</Button>
                            }
                        </span>
                    }
                },
            ],
            query: {
                clientId: store.getState().clientId,
                orderBy: "",
                pageNum: store.getState().curPage,
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
            },
            count: 2,
            tableData: [],
            loading: false
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
            getCardList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + new Date().getTime()
                            item.sort = index + 1
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

    addOrTile(record) {
        this.props.history.push({
            pathname: 'children/AddTile',
            query: {id: record.id ? record.id : ''}
        })
        handleScrollTop(2)
    }

    handleSave = row => {
        const that = this
        const newData = this.state.tableData;
        const index = newData.findIndex(item => row.key === item.key);
        newData[index].weight = row.weight;
        this.setState({
            tableData: newData
        }, ()=>{
            const params = {
                id: row.id,
                weight: +row.weight
            }
            editCardSort(params).then(res => {
                if (res && res.success) {
                    that.initData()
                }
            })
        })
    };

    // 修改卡片状态
    handleStatus(status, record) {
        const params = {
            id: record.id,
            status: status
        }
        stopCard(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', status === 1 ? `启动本模块成功` : `隐藏本模块成功`)
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    //删除数据
    handleDelete(text, record) {
        const params = {id: record.id}
        removeCard(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', text + '成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (this.state.dataLength <= 1 && this.state.query.pageNum > 1) {
                    const current = parseInt(this.state.query.pageNum - 1)
                    console.log(current)
                    let data = Object.assign({}, this.state.query, {pageNum: current, curPage: current})
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

    render() {
        const {tableData, loading} = this.state;
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
            let data = Object.assign({}, this.state.query, {pageSize: pageSize, pageNum: 1, curPage: 1})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, {pageNum: current, curPage: current})
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        })
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="布局配置" second="瓷片区管理" />
                <div className="gutter-box">
                    <Card bordered>
                        <Button type="primary" onClick={this.addOrTile.bind(this)} style={{marginBottom: 16}}>
                            新增瓷片区
                        </Button>
                        <Table
                            components={components}
                            rowClassName={() => 'editable-row'}
                            dataSource={tableData}
                            columns={columns}
                            loading={loading}
                            pagination={pagination}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Tile;
