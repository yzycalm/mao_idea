/**
 * Created by smart-yc
 */
import React, { Component } from 'react';
import {
    Card,
    Form,
    PageHeader,
    Table
} from 'antd';
import { findDetail } from '../../../api/chooseLib/myChooseLib'
import { clickCancel, paginationProps } from "../../../utils";
import { changeCurPage, changePageSize } from "../../../store/actionCreators";
import { typeList } from "../common";

const getCidName = id => {
    let name = ""
    typeList.map(item => {
        if (+item.key === +id) {
            name = item.value
        }
    })
    return name
}

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
                        return <span style={{ display: 'flex' }}><img
                            style={{ width: '120px', height: '120px', objectFit: "contain" }} src={url} alt=""
                                                                 />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                flexDirection: 'column',
                                paddingLeft: '10px'
                            }}
                            >
                                <span><a href={record.itemUrl ? record.itemUrl : 'javascript:void(0);'} target="_blank">{record.itemTitle}</a> <br />
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
                                                style={{ color: '#FC5A3B', marginRight: 5 }}
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
                        return <span >&yen;<span style={{ fontSize: 18, fontWeight: 'bold' }}>{text}</span><br />月销：{record.saleMonth}件</span>
                    }
                },
                {
                    title: '佣金',
                    dataIndex: 'commission',
                    render: (text, record) => {
                        return <span>&yen;<span style={{ fontSize: 18, fontWeight: 'bold' }}>{text}</span></span>
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
                },
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
            apiParams: {}
        };
    }

    // 获取商品词信息
    componentDidMount () {
        this.beforeInitData()
    }

    componentWillUnmount () {
        sessionStorage.removeItem('ChooseRule')
    }

    // 判断是否有参数
    beforeInitData () {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            const { id, title, createTime, apiParams, createBy } = this.props.location.query
            params = {
                id: id,
                title: title,
                createTime: createTime,
                apiParams: apiParams ? apiParams : {},
                createBy: createBy
            }
            sessionStorage.setItem('ChooseRule', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    id: params.id,
                    title: params.title,
                    createTime: params.createTime,
                    apiParams: apiParams ? JSON.parse(apiParams) : {},
                    createBy: params.createBy
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
                    apiParams: params.apiParams ? JSON.parse(params.apiParams) : {},
                    createBy: params.createBy
                })
                this.initData(params.id)
            }
        }
    }

    // 获取商品词信息
    initData (id) {
        const that = this
        this.setState({
            loading: true
        }, () => {
            const params = { ...this.state.query }
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

    render () {
        const { tableData, loading, tableColumns, apiParams } = this.state;
        const pagination = paginationProps(this.state.total, this.state.query, (current, pageSize) => {
            changePageSize(pageSize)
            changeCurPage(1)
            //  每页显示多少条
            let data = Object.assign({}, this.state.query, { pageSize: pageSize, curPage: 1 })
            this.setState({
                query: data
            }, () => {
                this.beforeInitData()
            })
        }, (current) => {
            changeCurPage(current)
            // 切换下一页
            let data = Object.assign({}, this.state.query, { curPage: current })
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
                        按选品规则输出  &nbsp;&nbsp;&nbsp;&nbsp; 选品人： {this.state.createBy}</p>
                    <h3>商品规则</h3>
                    <p style={{ display: apiParams.priceMin || apiParams.priceMax ? 'block' : 'none' }}>价格
                        ¥{apiParams.priceMin} - ¥{apiParams.priceMax}</p>
                    <p style={{ display: apiParams.saleMin ? 'block' : 'none' }}>月销量 ≥ {apiParams.saleMin} 件</p>
                    <p style={{ display: apiParams.ratesMin ? 'block' : 'none' }}>佣金比例 ≥ {apiParams.ratesMin}%</p>
                    <p style={{ display: apiParams.cid ? 'block' : 'none' }}>品类: {getCidName(apiParams.cid)}</p>
                    <p style={{ display: apiParams.moneyMin ? 'block' : 'none' }}>券面额 ≥ ¥{apiParams.moneyMin}</p>
                    <p style={{ display: apiParams.keyword ? 'block' : 'none' }}>标题包含: {apiParams.keyword}</p>
                    <p style={{ display: apiParams.itemSourceId ? 'block' : 'none' }}>商品ID: {apiParams.itemSourceId}</p>
                    <p style={{ display: apiParams.startTime ? 'block' : 'none' }}>优惠券有效期: {apiParams.startTime} 至 {apiParams.endTime} </p>
                    <p style={{ display: apiParams.juhuasuan ? 'block' : 'none' }}>聚划算商品 </p>
                    <p style={{ display: apiParams.brand ? 'block' : 'none' }}>品牌商品 </p>
                    <p style={{ display: apiParams.qianggou ? 'block' : 'none' }}>淘抢购商品 </p>
                    <p style={{ display: apiParams.shop ? 'block' : 'none' }}>{+apiParams.shop === 1 ? "淘宝" : '天猫'} </p>
                </PageHeader>
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Table
                            dataSource={tableData}
                            loading={loading}
                            pagination={pagination}
                            columns={tableColumns}
                            scroll={{ x: 1080 }}
                        />
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddSeeker);

export default BasicForm;
