/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {
    Card,
    Form,
    PageHeader,
    Table,
    Button, Typography, message, Modal
} from 'antd';
import {deleteGoods, findDetail} from '../../../api/chooseLib/myChooseLib'
import {clickCancel, paginationProps} from "../../../utils";
import store from "../../../store";

const {confirm} = Modal;
const {Text} = Typography;

class AddSeeker extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableColumns: [
                {
                    title: '商品信息',
                    dataIndex: 'itemPic',
                    width: 500,
                    render: (url, record) => {
                        return <span style={{display: 'flex'}}>
                            <div style={{position: 'relative'}}>
                                <img
                                    style={{width: '120px', height: '120px', objectFit: "contain"}} src={url} alt=""
                                />
                                    <span style={{
                                        width: '100%',
                                        height: '30',
                                        textAlign: 'center',
                                        color: '#fff',
                                        position: 'absolute',
                                        left: '0',
                                        bottom: '0',
                                        background: 'rgba(92, 36, 59, 0.8)',
                                        display: +record.state === 1 ? 'inline-block' : 'none'
                                    }}
                                    >已失效</span>
                            </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexDirection: 'column',
                            paddingLeft: '10px'
                        }}
                        > <span><a href={record.itemUrl ? record.itemUrl : 'javascript:void(0);'} target="_blank">{record.itemTitle}</a> <br />
                         <span
                             style={{
                                 border: '1px solid #FC5A3B',
                                 color: '#fff',
                                 width: '80px',
                                 display: +record.couponMoney ? 'inline-block' : 'none'
                             }}
                         ><span
                             style={{
                                 background: '#FC5A3B',
                                 fontSize: 12,
                                 padding: 3,
                                 marginRight: 5
                             }}
                         >券</span><span
                             style={{color: '#FC5A3B', marginRight: 5}}
                                  >{record.couponMoney}元</span>
                                            </span>
                        </span>

                         <span><img width={16} height={16} src={`https://cloud.hongrz.com/H5/wholesale_ticket/imgs/${
                             +record.shopType === 1
                                 ? 'taobao'
                                 : 'tianmao'
                             }.png`} alt=""
                               />&nbsp; {record.shopName}</span></div></span>
                    }
                },
                {
                    title: '券后价',
                    dataIndex: 'itemEndPrice',
                    render: (text, record) => {
                        return <span >&yen;<span style={{fontSize: 18,fontWeight: 'bold'}}>{text}</span><br />月销：{record.saleMonth}件</span>
                    }
                },
                {
                    title: '佣金',
                    dataIndex: 'commission',
                    render: (text, record) => {
                        return <span>&yen;<span style={{fontSize: 18,fontWeight: 'bold'}}>{text}</span></span>
                    }
                },
                {
                    title: '佣金比例',
                    dataIndex: 'commissionRate',
                    render: (text, record) => {
                        return <span>{text}%</span>
                    }
                },
                {
                    title: '月销量',
                    dataIndex: 'saleMonth',
                    render: (text, record) => {
                        return <span>{text}件</span>
                    }
                },
                {
                    title: '券面额',
                    dataIndex: 'couponMoney',
                    render: (text, record) => {
                        return <span>&yen;{text}</span>
                    }
                }, {
                    title: '操作',
                    dataIndex: 'displayState',
                    key: 'action',
                    width: 100,
                    fixed: 'right',
                    render: (text, record) => {
                        return <Button type={"primary"}
                                       onClick={this.handleDelete.bind(this, this.state.id, record.itemSourceId, '您确定删除该商品吗？')}
                               >删除</Button>
                    }
                }
            ],
            tableData: [],
            query: {
                curPage: 1,
                pageSize: 10,
            },
            id: '',
            title: '',
            createTime: '',
            createBy: '',
            apiParams: {},
            downCount: 0,
            total: ''
        };
    }

    // 获取商品词信息
    componentDidMount() {
        this.beforeInitData()
    }

    componentWillUnmount() {
        sessionStorage.removeItem('ChooseRule')
    }

    // 判断是否有参数
    beforeInitData() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            const {id, title, createTime, createBy, downCount} = this.props.location.query
            params = {id: id, title: title, createTime: createTime, createBy: createBy, downCount: downCount}
            sessionStorage.setItem('ChooseRule', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    id: params.id,
                    title: params.title,
                    createTime: params.createTime,
                    createBy: params.createBy,
                    downCount: params.downCount
                })
                this.initData(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('ChooseRule'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    id: params.id,
                    title: params.title,
                    createTime: params.createTime,
                    createBy: params.createBy,
                    downCount: params.downCount
                })
                this.initData(params.id)
            }
        }
    }

    // 获取商品词信息
    initData(id) {
        const that = this
        this.setState({
            loading: true
        }, () => {
            const params = {...this.state.query}
            params.groupId = id
            findDetail(params).then((res) => {
                that.setState({
                    loading: false
                }, () => {
                    if (res && res.data) {
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

    // 删除
    handleDelete(id, itemSourceId, title) {
        const that = this
        confirm({
            title: '提示',
            content: title,
            okText: '确定',
            cancelText: '取消',
            centered: true,
            onOk() {
                const params = {groupId: id, itemSourceId: itemSourceId}
                deleteGoods(params).then(res => {
                    if (res && res.success) {
                        message.success("删除商品成功")
                        // 判断当前页面有多少条数据，不够显示上一页
                        if (that.state.dataLength <= 1 && that.state.query.curPage > 1) {
                            const current = parseInt(that.state.query.curPage - 1)
                            let data = Object.assign({}, that.state.query, {curPage: current})
                            that.setState({
                                query: data
                            }, () => {
                                that.initData(id)
                            })
                            return
                        }
                        that.initData(id)
                        that.setState({
                            downCount: 0
                        })
                        const oldParams = JSON.parse(sessionStorage.getItem('ChooseRule'))
                        oldParams.downCount = 0
                        sessionStorage.setItem('ChooseRule', JSON.stringify(oldParams))
                    } else {
                        message.error(res.message)
                    }
                })
            }
        })
    }

    render() {
        const {tableData, loading, tableColumns} = this.state;
        const pagination = paginationProps(this.state.total, this.state.query, (current, pageSize) => {
            //  每页显示多少条
            let data = Object.assign({}, this.state.query, {pageSize: pageSize, curPage: 1})
            this.setState({
                query: data
            }, () => {
                this.beforeInitData()
            })
        }, (current) => {
            // 切换下一页
            let data = Object.assign({}, this.state.query, {curPage: current})
            this.setState({
                query: data
            }, () => {
                this.beforeInitData()
            })
        })
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title={this.state.title}>
                    <p>创建于： {this.state.createTime} &nbsp;&nbsp;&nbsp;&nbsp;商品个数：
                        {this.state.total}  &nbsp;&nbsp;&nbsp;&nbsp; 选品人：{this.state.createBy}</p>
                </PageHeader>
                <div className="gutter-box">
                    <Card bordered={false}>
                        <div style={{marginBottom: 10}}>
                            <Text>失效商品：{this.state.downCount} 个</Text>
                            &nbsp;&nbsp;<Button type="primary"
                                                onClick={this.handleDelete.bind(this, this.state.id, "", '您确定一键清除失效商品？')}
                                                disabled={!this.state.downCount}
                                        >一键删除</Button>
                        </div>
                        <Table
                            dataSource={tableData}
                            loading={loading}
                            pagination={pagination}
                            columns={tableColumns}
                            scroll={{x: 1080}}
                        />
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddSeeker);

export default BasicForm;
