/*
 * @Author: songyingchun
 * @Date: 2020-04-15 18:41:19
 * @Description: 新人专区
 */
import React from 'react';
import { Card, Form, Input, Button, Table, Select } from 'antd/lib/index';
import { getNewPersonList, editNewPersonStatus, editNewPersonSort } from '../../api/tile/freeCharge'
import { handleScrollTop, openNotificationWithIcon, paginationProps } from "../../utils";
import store from '../../store'
import {
    changeCurPage,
    changePageSize,
    inputFirstFrame,
    selectFirstFrame,
    selectSecondFrame
} from '../../store/actionCreators'
import { getNewPerson, getNewGoods } from '../../utils/FreeCharge'
import BreadcrumbCustom from '../BreadcrumbCustom';

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

const Option = Select.Option;

class SearchTerms extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: getNewPerson((type, res) => {
                this.handleBack(type, res)
            }),
            tableData: [],
            width: 177,
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                gsId: store.getState().firstInput,
                status: store.getState().secondSelect !== "" ? store.getState().secondSelect : 1,
                type: store.getState().firstSelect !== "" ? store.getState().firstSelect : 1
            },
            loading: false
        }
    }

    componentDidMount () {
        // 判断类型
        this.setState({
            tableColumns: +this.state.query.type === 1 || +this.state.query.type === 3 ? getNewPerson((type, res) => {
                this.handleBack(type, res)
            }) : getNewGoods((type, res) => {
                this.handleBack(type, res)
            })
        })
        this.initData()
        handleScrollTop(1)
    }

    // 初始化数据
    initData () {
        const that = this
        this.setState({
            loading: true
        }, () => {
            getNewPersonList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.data) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + item.id + new Date().getTime()
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

    addFreeCharge (record) {
        inputFirstFrame(this.state.query.gsId)
        selectFirstFrame(this.state.query.type)
        selectSecondFrame(this.state.query.status)
        this.props.history.push({
            pathname: 'children/AddFreeCharge',
            query: { id: record.id ? record.id : '' }
        })
        handleScrollTop(2)
    }

    // 操作 回调
    handleBack (val, data) {
        switch (val) {
            case 1:
                this.handleDelete(true, 2, data)
                break
            case 2:
                this.addFreeCharge(data)
                break
            case 3:
                this.handleDelete(false, 1, data)
                break
        }
    }

    // 操作 删除和上下架
    handleDelete (type, value, record) {
        const params = { id: record.id, status: value }
        editNewPersonStatus(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', type ? '下架成功' : '删除成功')
                // 判断当前页面有多少条数据，不够显示上一页
                if (type && this.state.dataLength <= 1 && this.state.query.curPage > 1) {
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
            let data = Object.assign({}, this.state.query, { gsId: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { gsId: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    // 下拉框
    handleSelected (param, val) {
        // 判断类型
        if (param === 'type') {
            this.setState({
                tableColumns: +val === 1 || +val === 3 ? getNewPerson((type, res) => {
                    this.handleBack(type, res)
                }) : getNewGoods((type, res) => {
                    this.handleBack(type, res)
                })
            })
        }
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
        newData[index].sort = row.sort;
        this.setState({
            tableData: newData
        }, () => {
            console.log(row)
            const params = {
                currentSorts: row.currentSorts,
                goalSorts: +row.sort,
                id: row.id,
                type: this.state.query.type
            }
            editNewPersonSort(params).then(res => {
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
                <BreadcrumbCustom first="布局配置" second="新人专区" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="类型:">
                                <Select defaultValue={this.state.query.type} style={{ width: this.state.width }}
                                    onChange={this.handleSelected.bind(this, 'type')}
                                >
                                    <Option value={1}>新人免单</Option>
                                    <Option value={2}>好物推荐</Option>
                                    <Option value={3}>年货节</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="商品ID:">
                                <Input defaultValue={this.state.query.gsId} onBlur={this.handleID.bind(this)} />
                            </Form.Item>
                            <Form.Item label="发布状态:">
                                <Select defaultValue={this.state.query.status} style={{ width: this.state.width }}
                                    onChange={this.handleSelected.bind(this, 'status')}
                                >
                                    <Option value={1}>已上架</Option>
                                    <Option value={0}>未开始</Option>
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
                        <Button type={"primary"} style={{ marginBottom: '10px' }}
                            onClick={this.addFreeCharge.bind(this)}
                        >新增</Button>
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

export default SearchTerms;
