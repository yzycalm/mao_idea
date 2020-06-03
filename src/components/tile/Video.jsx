import React from 'react';
import {Table, Input, Button, Form, Card, Icon} from 'antd';
import {handleScrollTop, openNotificationWithIcon, paginationProps} from "../../utils";
import {changeCurPage, changePageSize} from "../../store/actionCreators";
import BreadcrumbCustom from "../BreadcrumbCustom";
import store from "../../store";
import {getVideoList, removeVideo, editVideoStatus, editVideoSort} from "../../api/tile/video";
import {showStopOrDelete} from "../../utils/share";

const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: store.getState().iconFont
});
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
                    editable: true,
                },
                {
                    title: '视频专题名称',
                    dataIndex: 'title',
                },
                {
                    title: '首页布局样式',
                    dataIndex: 'style',
                    render: text => {
                        return text === 1 ? <IconFont
                                style={{
                                    fontSize: '50px',
                                }}
                                type="icon-icon-hengxianghuadong"
                                            /> :
                            <IconFont
                                style={{
                                    fontSize: '50px',
                                }}
                                type="icon-sanhangmoshi-"
                            />
                    }
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    render: (text, record) => {
                        if (+text === 1) {
                            return <span>展示中</span>
                        } else if (+text === 2) {
                            return <span>未开始</span>
                        } else if (+text === 3) {
                            return <span>已停止</span>
                        } else {
                            return <span>已过期</span>
                        }
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    width: 300,
                    fixed: 'right',
                    render: (text, record) => {
                        if (+record.status === 1) {
                            return <span>
                            <Button type={"primary"}
                                    onClick={() => {
                                        this.addOrVideo(record)
                                    }}
                            >编辑</Button>
                           <Button type={"primary"}
                                   onClick={() => {
                                       showStopOrDelete('停止', record, () => {
                                           this.handleStatus(1, record)
                                       })
                                   }}
                           >停止</Button>
                            </span>
                        } else if (+record.status === 3) {
                            return <span>
                            <Button type={"primary"}
                                    onClick={() => {
                                        this.addOrVideo(record)
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

                                    new Date().getTime() < (record.endTime * 1000) ?

                                        <Button type={"primary"}
                                                onClick={() => {
                                                    showStopOrDelete('启用', record, () => {
                                                        this.handleStatus(0, record)
                                                    })
                                                }}
                                        >启用</Button> : ""
                                }
                                    </span>
                        } else {
                            return <span>
                                <Button type={"primary"}
                                        onClick={() => {
                                            this.addOrVideo(record)
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
            getVideoList(this.state.query).then((res) => {
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

    addOrVideo(record) {
        this.props.history.push({
            pathname: 'children/AddVideo',
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
        }, () => {
            const params = {
                id: row.id,
                weight: +row.weight,
                operator: "赛亚超人"
            }
            editVideoSort(params).then(res => {
                if (res && res.success) {
                    openNotificationWithIcon('success', '修改排序成功')
                    that.initData()
                }
            })
        })
    };

    // 修改视频专题状态
    handleStatus(status, record) {
        const params = {
            id: record.id,
            invisible: status
        }
        editVideoStatus(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', status === 0 ? `启动成功` : `停止成功`)
                this.initData()
            } else {
                openNotificationWithIcon('error', res.message ? res.message : '操作失败，请重试！')
            }
        })
    }

    //删除数据
    handleDelete(text, record) {
        const params = {id: record.id}
        removeVideo(params).then(res => {
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
                <BreadcrumbCustom first="布局配置" second="视频专题管理" />
                <div className="gutter-box">
                    <Card bordered>
                        <Button type="primary" onClick={this.addOrVideo.bind(this)} style={{marginBottom: 16}}>
                            新增视频专题
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
