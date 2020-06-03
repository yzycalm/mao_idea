import React from 'react';
import { Card, Button, Table } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { getFeaturedList, mFItemImport, removeFeaturedById } from '../../../api/featured/starsAndSea'
import {
    openNotificationWithIcon,
    paginationProps,
    handleScrollTop
} from '../../../utils/index'
import { showStopOrDelete } from "../../../utils/share";
import store from '../../../store'
import { changeCurPage, changePageSize } from '../../../store/actionCreators'

class SpecialManagement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [
                {
                    title: '序号',
                    dataIndex: 'id',
                    width: 10,
                    key: 'id',
                },
                {
                    title: '活动名称',
                    dataIndex: 'monographicName',
                    textWrap: 'word-break',
                    width: 100,
                    key: 'monographicName',


                },
                {
                    title: '专场名称',
                    dataIndex: 'name',
                    width: 100,
                    key: 'name',

                }, {
                    title: '展示位置',
                    dataIndex: 'sorts',
                    width: 80,
                    key: 'sorts',
                }, {
                    title: '状态',
                    dataIndex: 'isUse',
                    width: 100,
                    key: 'isUse',
                    render: (text) => {
                        return +text === 0 ? '禁用' : '启用'
                    }
                }, {
                    title: '操作',
                    dataIndex: 'displayState',
                    key: "action",
                    width: 120,
                    render: (text, record) => {

                        return +record.isUse === 1 ?
                            <span>
                                <Button type={"primary"}
                                    onClick={() => {
                                        this.AddOrEditMaterial(record)
                                    }}
                                >编辑</Button>
                                <Button type={"primary"}
                                    disabled={record.hasOwnProperty('materielId') && record.materielId}
                                    onClick={() => {
                                        this.Administration(record)
                                    }}
                                >管理</Button>
                            </span> :
                            <span>
                                <Button type={"primary"}
                                    onClick={() => {
                                        this.AddOrEditMaterial(record)
                                    }}
                                >编辑</Button>
                                <Button type={"primary"}
                                    disabled={record.hasOwnProperty('materielId') && record.materielId}
                                    onClick={() => {
                                        this.Administration(record)
                                    }}
                                >管理</Button>
                                <Button type={"primary"}
                                    onClick={() => {
                                        showStopOrDelete('删除', record, () => {
                                            this.handleDelete('删除', record)
                                        })
                                    }}
                                > 删 除</Button>
                            </span>
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

            },
            width: 100,
            selectedRowKeys: [],
            fileList: [],
            toLeadLoading: false,
            exportLoading: false,
            deleteLoading: false,
            soldOutLoading: false,
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
            getFeaturedList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + item.id
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
    handleDelete (text, record) {
        const params = { id: record.id }
        removeFeaturedById(params).then(res => {
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
    //管理
    Administration (record) {
        console.log(record)
        this.props.history.push({
            pathname: 'SpecialMerchandise',
            query: { id: record ? record.id : '', title: record.monographicName, name: record.name }
        })
        handleScrollTop(2)
    }

    //新增、编辑专场
    AddOrEditMaterial (record) {
        console.log(record)
        this.props.history.push({
            pathname: 'children/AddManagement',
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
    handleTitle (event) {
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
    //自定义上传
    customRequest = (files) => {
        this.setState({
            toLeadLoading: true
        })
        let formdata = new FormData()
        formdata.append('file', files.file)
        formdata.append('featuredId', '1')
        mFItemImport(formdata).then(res => {
            this.setState({
                toLeadLoading: false
            })
            if (res && res.success) {
                this.initData()
                openNotificationWithIcon('success', `导入成功！`)
            } else {
                openNotificationWithIcon('error', `导入失败，请重试！`)
            }
        })
    }

    // 订单状态
    handleDisplayState (val) {
        let data = Object.assign({}, this.state.query, { orderStatus: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 时间范围
    handleTimeHorizon (value) {
        let data = Object.assign({}, this.state.query, { startTime: new Date(value[0]).getTime(), endTime: new Date(value[1]).getTime(), curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }
    removeTime (value) {
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
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    // 商品文案
    handleContent (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { content: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { content: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    render () {
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
                <BreadcrumbCustom first="活动专场管理" second="专场管理" />

                <div className="gutter-box">
                    <Card bordered>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.AddOrEditMaterial.bind(this)}
                                >新增</Button>
                                <span style={{ display: 'inline-block', margin: '0 10px' }} />
                            </div>

                        </div>
                        <Table columns={this.state.tableColumns}
                            dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default SpecialManagement;
