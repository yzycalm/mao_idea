/**
 * Created smart-yc
 */
import React from 'react';
import { Card, Form, Input, Button, Table, Select } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { PageSelect, StatusSelect, SystemSelect } from '../marketing/common'
import { findBannerEntranceList, stopBannerEntranceById, deleteBannerEntranceById } from '../../api/marketing/generalize'
import { format, handleScrollTop, openNotificationWithIcon, paginationProps } from '../../utils/index'
import { getShowPageText, getResourceText, getSystemTypeText, getStatusText, resourceAllOptions, getResourceAllOptions, getTableImgShow, getTableHandle } from '../../utils/marketing'
import store from '../../store'
import {
    changeCurPage,
    changePageSize,
    inputFirstFrame,
    selectFirstFrame, selectFourthFrame,
    selectSecondFrame, selectThirdFrame
} from '../../store/actionCreators'

const Option = Select.Option;
class Resource extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '广告ID',
                dataIndex: 'id',
                key: 'id'
            }, {
                title: '页面',
                dataIndex: 'place',
                key: 'place',
                render: text => {
                    return <span>{getShowPageText(text)}</span>
                }
            }, {
                title: '资源位名称',
                dataIndex: 'type',
                key: 'type',
                render: text => {
                    return <span>{getResourceText(text)}</span>
                }
            },
            {
                title: '广告名称',
                dataIndex: 'title',
                key: 'adName',
            },
            {
                title: '展现方式',
                dataIndex: 'displayType',
                key: 'displayType',
            },
            {
                title: '系统',
                dataIndex: 'sysType',
                key: 'sysType',
                render: text => {
                    return <span>{getSystemTypeText(text)}</span>
                }
            },
            {
                title: '图片预览',
                dataIndex: 'img',
                key: 'img',
                render: (url, record) => {
                    return getTableImgShow(url, record)
                }
            },
            {
                title: '有效期',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 180,
                render: (text, record) => {
                    return <span className="word_break">{record.startTime && record.endTime ? format(text) + '-' + format(record.endTime) : '——'}</span>
                }
            },
            {
                title: '状态',
                dataIndex: 'displayState',
                key: 'displayState',
                render: text => {
                    return <span>{getStatusText(text)}</span>
                }
            },
            {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: text => {
                    return <span>{format(text)}</span>
                }
            },
            {
                title: '操作人',
                dataIndex: 'updateBy',
                key: 'updateBy',
                render: text => {
                    return <span>{text && parseInt(text) !== 0 ? text : 'ᅳ'}</span>
                }
            },
            {
                title: '操作',
                dataIndex: 'displayState',
                key: 'action',
                width: 180,
                fixed: 'right',
                render: (text, record) => {
                    return getTableHandle(text, record, (item) => {
                        if (item === '停止') {
                            this.handleStop(item, record)
                        } else if (item === '删除') {
                            this.handleDelete(item, record)
                        } else {
                            this.addAdvertising(record)
                        }
                    })
                }
            }],
            tableData: [],
            loading: true,
            total: 0,
            dataLength: 0, // 获取当前页面有多少条数据
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize,
                adName: store.getState().firstInput,
                displayState: store.getState().secondSelect !== "" ? store.getState().secondSelect : '0', //  0 :所有；1：未开始；2：展示中；3：已停止
                showPlace: store.getState().firstSelect !== "" ? store.getState().firstSelect : '0', // 0、全部；1、首页；2、启动页；3、我的页面；4、商品详情页；5、悬浮窗、6、收益页面；7、查看物流页
                sysType: store.getState().thirdSelect !== "" ? store.getState().thirdSelect : '-1', // -1: 所有; 0:ios/android ; 1:android ; 2:ios
                type: store.getState().fourthSelect !== "" ? store.getState().fourthSelect : 'all' // 全部：all；banner：banner；五大入口 : entrance；邮票位:topResource；悬浮窗：suspension；商品详情资源为：detailResource；收益资源位:profit；我的页面资源位:personal；启动页:screenAd；查看物流:logistics
            },
            width: 177,
            type: resourceAllOptions
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
            findBannerEntranceList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.success) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + item.id
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

    // 下拉框
    handleSelected (param, val) {
        const result = getResourceAllOptions(val)
        const data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            defaultValue: '',
            query: data,
            type: result,
        }, () => {
            this.initData()
        })
    }

    // 广告名称
    handleTitle (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { adName: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { adName: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }
    // 新增广告
    addAdvertising (record) {
        inputFirstFrame(this.state.query.adName)
        selectFirstFrame(this.state.query.showPlace)
        selectSecondFrame(this.state.query.displayState)
        selectThirdFrame(this.state.query.sysType)
        selectFourthFrame(this.state.query.type)
        this.props.history.push({ pathname: 'children/Advertising', query: { id: record ? record.id : '', title: record ? '编辑' : '新增' } })
        handleScrollTop(2)
    }
    // 操作 停止
    handleStop (text, record) {
        const params = { id: record.id }
        stopBannerEntranceById(params).then(res => {
            if (res.success) {
                openNotificationWithIcon('success', text + '成功')
                this.initData()
            } else {
                openNotificationWithIcon('error', '操作失败，请重试！')
            }
        })
    }

    // 操作 删除
    handleDelete (text, record) {
        const params = { id: record.id }
        deleteBannerEntranceById(params).then(res => {
            if (res.success) {
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
                <BreadcrumbCustom first="推广管理" second="资源位管理" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="页面">
                                <PageSelect width={this.state.width} defaultValue={this.state.query.showPlace}
                                    getShowPlace={this.handleSelected.bind(this, 'showPlace')}
                                />
                            </Form.Item>
                            <Form.Item label="资源位名称">
                                <Select defaultValue={this.state.query.type} style={{ width: this.state.width }}
                                    onChange={this.handleSelected.bind(this, 'type')}
                                >
                                    {this.state.type.map(item => {
                                        return <Option key={item.title} value={item.value}>{item.title}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item label="广告名称">
                                <Input placeholder="请输入广告名称" defaultValue={this.state.query.adName}
                                    onBlur={this.handleTitle.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="系统">
                                <SystemSelect width={this.state.width} defaultValue={this.state.query.sysType}
                                    getSystem={this.handleSelected.bind(this, 'sysType')}
                                />
                            </Form.Item>
                            <Form.Item label="状态">
                                <StatusSelect width={this.state.width} defaultValue={this.state.query.displayState}
                                    getStatus={this.handleSelected.bind(this, 'displayState')}
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
                        <Button type={"primary"} style={{ marginBottom: '10px' }}
                            onClick={this.addAdvertising.bind(this)}
                        >新增广告</Button>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Resource;
