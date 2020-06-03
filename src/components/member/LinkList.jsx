import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { getTableImgShow } from "../../utils/marketing";
import store from "../../store";
import { handleScrollTop, openNotificationWithIcon, paginationProps, format } from "../../utils";
import { getVenueLinkList, deleteVenueLink, updateScene, exportScene } from "../../api/member/venueLink";
import { changeCurPage, changePageSize } from "../../store/actionCreators";
import { Button, Card, DatePicker, Form, Input, Modal, Table } from "antd";
import { showStopOrDelete } from "../../utils/share";
import moment from "moment";

const { RangePicker } = DatePicker;

class LinkList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [{
                title: '编码',
                dataIndex: 'id',
                key: 'id',
                width: 80
            },
            {
                title: '会场名称',
                dataIndex:
                    'sceneName',
                key:
                    'sceneName',
                width: 180
            }
                ,
            {
                title: '会场背景图',
                dataIndex:
                    'sceneImg',
                key:
                    'sceneImg',
                render:
                    (url, record) => {
                        return getTableImgShow(url, record)
                    }
            }
                ,
            {
                title: '会场链接/会场ID',
                dataIndex:
                    'promotionSceneId',
                key:
                    'promotionSceneId',
                width:
                    200,
                render: text => {
                    return <span className="word_break">{text}</span>
                }
            }
                ,
            {
                title: '分享文案',
                dataIndex:
                    'shareMsg',
                key:
                    'shareMsg',
                width:
                    250,
            }
                ,
            {
                title: '截止时间',
                dataIndex:
                    'endTime',
                key:
                    'endTime',
                width:
                    150,
                render:
                    text => {
                        if (+text === 0) {
                            return '—'
                        } else {
                            return format(text)
                        }
                    }
            }
                ,
            {
                title: '状态',
                dataIndex:
                    'status',
                key:
                    'status',
                render:
                    text => {
                        return text = +text === 1 ? '已上线' : '已下线'
                    }
            }
                ,
            {
                title: '配置链接',
                dataIndex:
                    'special',
                key:
                    'special',
                width: 350,
                render:
                    (text, record) => {
                        let url = ''
                        if (process.env.NODE_ENV === 'production') {
                            url = `https://cloud.hongrz.com/H5/link_page/index.html?unionid=[userid]&promotionSceneId=${record.id}&urlType=2&type=tanhuiyi`
                        } else {
                            url = `https://cloud.hongrz.com/H5/link_page/index.html?unionid=[userid]&promotionSceneId=${record.id}&urlType=2&type=tanhuiyi&env=test`
                        }
                        return <span className="word_break">{url}</span>
                    }
            }
                ,
            {
                title: '操作',
                dataIndex:
                    'displayState',
                key:
                    'action',
                width:
                    180,
                fixed:
                    'right',
                render:
                    (text, record) => {
                        return <span>
                            <Button type={"primary"}
                                onClick={() => {
                                    this.addLink(record)
                                }}
                            >编辑</Button>
                            <Button type={"primary"}
                                onClick={() => {
                                    showStopOrDelete('删除', record, () => {
                                        this.handleDelete(record)
                                    })
                                }}
                            >删除</Button>
                        </span>
                    }
            }
            ],
            tableData: [],
            width:
                177,
            query:
            {
                curPage: store.getState().curPage,
                pageSize:
                    store.getState().pageSize
            }
            ,
            loading: false,
            updateLoad: false,
            exportLoad: false,
            visible: false
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
            getVenueLinkList(this.state.query).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.data) {
                        const data = res.data
                        data.list.forEach((item, index) => {
                            item.key = index + '' + item.id + new Date().getTime()
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

    // 一键更新
    handleUpdate () {
        const that = this
        this.setState({
            updateLoad: true
        }, () => {
            updateScene().then((res) => {
                that.setState({
                    updateLoad: false
                }, () => {
                    openNotificationWithIcon('success', '一键更新成功！')
                    that.initData()
                })
            })
        })
    }

    addLink (record) {
        this.props.history.push({
            pathname: 'children/AddLink',
            query: { id: record ? record.id : '', title: record ? '编辑' : '新增' }
        })
        handleScrollTop(2)
    }

    // 操作 删除
    handleDelete (record) {
        const params = { id: record.id }
        deleteVenueLink(params).then(res => {
            if (res && res.success) {
                openNotificationWithIcon('success', '删除成功')
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

    // 导出数据
    exportGoods () {
        this.setState({
            visible: true
        })
    }

    hideModal () {
        this.setState({
            visible: false
        })
        this.props.form.resetFields()
    }

    // 导出数据
    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            exportLoad: true
        }, () => {
            this.props.form.validateFields((err, values) => {
                this.setState({
                    exportLoad: false
                })
                if (!err) {
                    const params = {
                        endTime: moment(values.time[1], 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000,
                        id: values.id,
                        startTime: moment(values.time[0], 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000
                    }
                    exportScene(params).then(res => {
                        if (res && res.success) {
                            const data = res.data
                            const a = document.createElement('a')
                            a.setAttribute('target', '_blank')
                            a.setAttribute('href', data)
                            a.click()
                            a.remove()
                            this.hideModal()
                        } else {
                            openNotificationWithIcon('warning', res.message)
                        }
                    })
                } else {
                    this.setState({
                        exportLoad: false
                    })
                }
            });
        })
    };

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
        const { visible } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first={'会场转链管理'} second={'转链页管理'} />
                <div className="gutter-box">
                    <Card bordered>
                        <Button type={"primary"} style={{ marginBottom: '10px' }}
                            onClick={this.addLink.bind(this)}
                        >新增转链页</Button>
                        <Button type={"primary"} loading={this.state.updateLoad}
                            onClick={this.handleUpdate.bind(this)}
                        >一键更新</Button>
                        <Button type={"primary"}
                            onClick={this.exportGoods.bind(this)}
                        >导出数据</Button>
                        <Table columns={this.state.tableColumns} dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination} scroll={{ x: 1600 }}
                        />
                    </Card>
                    <Modal
                        title="请填写完毕再导出"
                        visible={visible}
                        onOk={this.handleSubmit}
                        onCancel={this.hideModal.bind(this)}
                        confirmLoading={this.state.exportLoad}
                        okText="确认"
                        cancelText="取消"
                        centered
                    >
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item label="编码">
                                {getFieldDecorator('id', {
                                    rules: [{ required: true, message: '请输入编码' }],
                                })(
                                    <Input style={{ width: '340px' }} placeholder={"输入编码"} />
                                )}
                            </Form.Item>
                            <Form.Item label="时间范围">
                                {getFieldDecorator('time', {
                                    rules: [{ required: true, message: '请选择时间范围' }],
                                })(
                                    <RangePicker renderExtraFooter={() => '红人装'} showTime={{
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                    }} format="YYYY-MM-DD HH:mm:ss" showToday={false}
                                    />
                                )}
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(LinkList);

export default BasicForm;
