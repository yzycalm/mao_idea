import React from 'react';
import { Card, Form, Input, Button, Table, Upload } from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import { getTableImgShow } from "../../../utils/marketing";
import { mFItemImport, getMFProductList, removeMFProduct, updateMFPSort } from '../../../api/featured/starsAndSea'
import {
    openNotificationWithIcon,
    paginationProps,
    getContent,
    handleScrollTop
} from '../../../utils/index'
import { showStopOrDelete } from "../../../utils/share";
import { changeCurPage, changePageSize } from '../../../store/actionCreators'
import { getPlatformIcon } from "../../../utils/commodity";

class SpecialManagement extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tableColumns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: 80,
                    key: 'index',
                },
                {
                    title: '商品ID',
                    dataIndex: 'goodsId',
                    textWrap: 'word-break',
                    width: 130,
                    key: 'goodsId',


                },
                {
                    title: '商品名称',
                    dataIndex: 'gsTitle',
                    width: 200,
                    key: 'gsTitle',
                    render: (text, record) => {
                        return text ? <span className="word_break">
                            <a href={record.goodsUrl} target="_blank">{getPlatformIcon(record.platform)}  {text}</a>
                        </span> : <span>'ᅳ'</span>
                    }

                }, {
                    title: '副标题',
                    dataIndex: 'gsSubTitle',
                    width: 120,
                    key: 'gsSubTitle',
                }, {
                    title: '分享文案',
                    dataIndex: 'shareMsg',
                    width: 300,
                    key: 'shareMsg',
                    render: (text => {
                        return <div className="word_break">
                            {text ? getContent(text) : 'ᅳ'}
                        </div>

                    })

                }, {
                    title: '排序',
                    dataIndex: 'sorts',
                    width: 120,
                    key: 'sorts',
                    initialValue: 'sorts',
                    render: (text, record) => {
                        return <span> <Input defaultValue={text} onPressEnter={(e) => this.save({ sorts: +e.target.defaultValue, id: record.id })} /></span>
                    }
                }, {
                    title: '商品图片',
                    dataIndex: 'gsUrl',
                    width: 95,
                    key: 'gsUrl',
                    render: (url, record) => {
                        return getTableImgShow(url, record)
                    }
                }, {
                    title: '券后价',
                    dataIndex: 'finalPrice',
                    width: 80,
                    key: 'finalPrice',
                }, {
                    title: '优惠券金额',
                    dataIndex: 'couponPrice',
                    width: 180,
                    key: 'couponPrice',
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    width: 80,
                    key: 'status',
                    render: (text) => {
                        return +text === 0 ? '已失效' : '已上架'
                    }
                },
                {
                    title: '操作',
                    dataIndex: 'displayState',
                    key: "action",
                    width: 150,
                    fixed: 'right',
                    render: (text, record) => {

                        return <span>
                            <Button type={"primary"} style={{ marginBottom: '10px' }}
                                onClick={() => {
                                    this.EditMaterial(record)
                                }}
                            >编辑</Button>
                            <br />
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
                curPage: 1,
                pageSize: 10,
                featuredId: "",
                goodsId: "",
                gsTitle: "",

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
            },
            title: "",
            name: "",
            goodsId: "",
            featuredId: ''

        }
    }

    componentDidMount () {

        this.getContentGoods();
        handleScrollTop(1)
    }

    // componentWillUnmount() {
    //     sessionStorage.removeItem('specialMerchandise')
    // }

    save = (value) => {

        console.log(value)
        updateMFPSort(value).then((res) => {
            if (res && res.success) {
                openNotificationWithIcon('success', '更改成功')
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




    getContentGoods () {
        let params;

        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            let data = Object.assign({}, this.state.query, { featuredId: this.props.location.query.id })
            this.setState({
                query: data
            })

            params = { id: this.props.location.query.id, title: this.props.location.query.title, name: this.props.location.query.name, featuredId: this.props.location.query.id }
            this.setState({
                name: params.name,
                title: params.title,
                featuredId: params.featuredId
            })
            console.log(params)
            sessionStorage.setItem('specialMerchandise', JSON.stringify(params))

            // if (params.id !== undefined) {
            // this.setState({
            //     title: params.title + '专场',
            //     loadingFinish: true
            // })

            this.initData()
            // }
        } else {
            params = JSON.parse(sessionStorage.getItem('specialMerchandise'))
            this.setState({
                name: params.name,
                title: params.title,
                featuredId: params.featuredId
            })
            console.log(params)
            let data = Object.assign({}, this.state.query, { featuredId: params.id })
            this.setState({
                query: data
            })
            // if (params && params.id !== 'undefined') {
            this.setState({
                title: params.title + '专场',
                loadingFinish: true
            })
            this.initData()
            // }
        }
    }

    // 初始化数据
    initData () {
        const that = this
        this.setState({
            loading: true
        }, () => {
            getMFProductList(this.state.query).then((res) => {
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
        const params = { "id": record.id }
        removeMFProduct(params).then(res => {
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

    //新增、编辑专场
    AddOrEditMaterial (record) {
        console.log(record)
        this.props.history.push({
            pathname: 'children/AddGoods',
            query: { title: '新增', Goodtitle: this.state.title, name: this.state.name, featuredId: this.state.featuredId }
        })
        handleScrollTop(2)
    }

    EditMaterial (record) {
        console.log(record)
        this.props.history.push({
            pathname: 'children/EditGoods',
            query: { id: record.id ? record.id : "", title: '编辑', Goodtitle: this.state.title, name: this.state.name, featuredId: this.state.featuredId, goodsId: record.goodsId }
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
        formdata.append('featuredId', this.state.featuredId)
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

    // 商品ID
    handleContent (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { goodsId: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { goodsId: '', curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }
    }

    // 商品名称
    handleContentName (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { gsTitle: value, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        } else {
            let data = Object.assign({}, this.state.query, { gsTitle: '', curPage: 1 })
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
                <BreadcrumbCustom first="专场管理" second="专场商品" />
                <div className="gutter-box">
                    <Card bordered>
                        <Form layout="inline" labelAlign={"left"}>
                            <Form.Item label="商品ID">
                                <Input placeholder="请输入商品ID"
                                    onBlur={this.handleContent.bind(this)}
                                />
                            </Form.Item>
                            <Form.Item label="商品名称">
                                <Input placeholder="请输入商品名称关键词"
                                    onBlur={this.handleContentName.bind(this)}
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
                        <div style={{ textAlign: "center", fontSize: "150%" }}>
                            <span>活动名称 :   {this.state.title}</span>
                            <span style={{ marginLeft: "10%" }}>专场名称 :    {this.state.name}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>


                            <div>
                                <Button type={"primary"} style={{ marginBottom: '10px' }}
                                    onClick={this.AddOrEditMaterial.bind(this)}
                                >新增</Button>
                                <span style={{ display: 'inline-block', margin: '0 10px' }}>
                                    <Upload accept="*/.xls"
                                        fileList={this.state.fileList}
                                        customRequest={this.customRequest}
                                    >
                                        <Button type={"primary"} style={{ marginBottom: '10px' }} loading={this.state.toLeadLoading}>批量导入</Button>
                                    </Upload>
                                </span>
                            </div>

                        </div>
                        <Table columns={this.state.tableColumns}
                            dataSource={this.state.tableData}
                            loading={this.state.loading} pagination={pagination}
                            scroll={{ x: 1600 }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default SpecialManagement;
