import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Card, Row, Col, Pagination, Modal, Tabs, notification, message } from 'antd';
import { deleteItem } from '../../api/chooseLib/myChooseLib'
import { guid } from '../../utils/index'
import { copy } from 'iclipboard'
import axios from 'axios';

const { confirm } = Modal;
const { TabPane } = Tabs;

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            total: 100,
            visible: false,
            type: '',
            pageSizeOptions: ['10', '20', '50', '100'],
            data: [],
            query: {
                curPage: 1,
                pageSize: 20,
                cid: 0,
                type: 1
            },
            emptyUrl: 'https://cloud.hongrz.com/H5/img/empty.jpg'
        }
    }


    componentDidMount () {
        let data = Object.assign({}, this.state.query, { curPage: 1, pageSize: 20 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })


    }

    // 初始化
    initData () {
        let params = {
            sale_type: this.state.query.type,
            cid: this.state.query.cid,
            back: this.state.query.pageSize,
            min_id: this.state.query.curPage,
        }

        var oldCid = sessionStorage.getItem('cid')

        // http://v2.api.haodanku.com/itemlist/hongren?nav=1&cid=0&back=10&min_id=1
        axios.get('https://v2.api.haodanku.com/sales_list/apikey/hongren/sale_type/' + params.sale_type + '/cid/' + params.cid + '/back/' + params.back + '/min_id/' + params.min_id, {
            withCredentials: false,
        }).then(res => {

            if (+res.status === 200) {
                sessionStorage.setItem('cid', params.cid)
                const data = res.data.data
                if (params.cid !== 0) {
                    if (oldCid !== params.cid) {
                        this.setState({
                            total: data.length
                        })
                    }

                    this.setState({
                        pageSizeOptions: ['10', '20', '50', '100']
                    })
                } else {
                    this.setState({
                        total: 100
                    })
                }
                this.setState({
                    data: data
                })
            }
        })





        // getHrzList(this.state.query).then(res => {
        //     if (res && res.success) {
        //         const data = res.data
        //         this.setState({
        //             data: data
        //         })
        //     }
        // })
        // getHrzList(params).then(res => {
        //     if (res && res.success) {
        //         const data = res.data
        //         this.setState({
        //             data: data
        //         })
        //     }
        // })
    }

    // 选择商品
    handleChooseGoods () {
        this.setState({
            visible: true
        })
    }



    // 详情
    handleToDetail (type, id) {
        if (type === 1) {
            this.props.history.push({
                pathname: 'children/SetRuleLib',
                query: { id: id }
            })
        } else {
            this.props.history.push({
                pathname: 'children/SetGoodsLib',
                query: { id: id }
            })
        }
    }
    // 取消
    handleCancel () {
        this.setState({
            visible: false
        })
    }

    onChangeRadio = e => {
        this.setState({
            type: e.target.value
        })
    }

    // 下一步
    handleOk () {
        if (this.state.type) {
            +this.state.type === 1 ? this.props.history.push({
                pathname: 'children/ChooseRuleLib'
            }) : this.props.history.push({
                pathname: 'children/ChooseGoodsLib',
            })
        } else {
            message.warning('请选择类型进行下一步')
        }
    }

    // 删除
    handleDelete (id) {
        confirm({
            title: '提示',
            content: '您确定删除该选品库吗?',
            okText: '确定',
            cancelText: '取消',
            centered: true,
            onOk () {
                const params = { groupId: id }
                deleteItem(params).then(res => {
                    if (res && res.success) {
                        message.success("删除选品组成功")
                        this.initData()
                    }
                })
            }
        })
    }

    changeCurPage (val) {
        //  每页显示多少条
        let data = Object.assign({}, this.state.query, { curPage: val })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    changePageSize (current, val) {
        //  每页显示多少条
        let data = Object.assign({}, this.state.query, { pageSize: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })
    }

    changeType (param, val) {
        this.setState({
            pageSizeOptions: ['10', '20', '50', '100']
        })
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        }, () => {
            this.initData()
        })

    }
    changeCid (param, val) {

        this.setState({
            pageSizeOptions: ['10', '20', '50', '100']
        })
        if (val !== 0) {
            let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1, pageSize: 100 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })

        } else {
            let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1, pageSize: 20 })
            this.setState({
                query: data
            }, () => {
                this.initData()
            })
        }

    }

    jumpUrl (val) {

        if (val) {
            window.open('https://detail.tmall.com/item.htm?id=' + val);
        } else {
            this.openNotificationWithIcon("warning")
        }
    }

    handleClickItem (val) {
        if (val) {
            copy(val)
            this.openNotificationWithIconSuccess("success")
        } else {
            this.openNotificationWithIcon("warning")
        }
    }
    handleClickItemUrl (val) {
        if (val) {
            copy('https://detail.tmall.com/item.htm?id=' + val)
            this.openNotificationWithIconSuccess("success")
        } else {
            this.openNotificationWithIcon("warning")
        }
    }

    openNotificationWithIcon = (type, text) => {
        notification[type]({
            message: '提示',
            description: "此商品无链接",
        });
    };

    openNotificationWithIconSuccess = (type, text) => {
        notification[type]({
            message: '提示',
            description: "复制成功",
        });
    };

    render () {
        const { data, query, total, pageSizeOptions } = this.state
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first="选品库" second="好单库榜单" />
                <Tabs tabBarGutter="200px" defaultActiveKey="1" onChange={this.changeType.bind(this, 'type')} >

                    <TabPane tab="实时销量榜" key="1" />
                    <TabPane tab="今日爆单榜" key="2" />
                    <TabPane tab="昨日爆单榜" key="3" />
                    <TabPane tab="出单指数榜" key="4" />

                </Tabs>


                <div className="site-card-wrapper">
                    <Row>
                        <Col span={2}>
                            <span style={{ lineHeight: "40px", float: "right" }} >按品类筛选:</span>

                        </Col>
                        <Col span={22}>
                            <Tabs size="small" tabBarGutter="3px" defaultActiveKey="0" style={{ marginBottom: 10 }} onChange={this.changeCid.bind(this, 'cid')}>

                                <TabPane tab="全部" key="0" />
                                <TabPane tab="女装" key="1" />
                                <TabPane tab="男装" key="2" />
                                <TabPane tab="内衣" key="3" />
                                <TabPane tab="美妆" key="4" />
                                <TabPane tab="配饰" key="5" />
                                <TabPane tab="鞋品" key="6" />
                                <TabPane tab="箱包" key="7" />
                                <TabPane tab="儿童" key="8" />
                                <TabPane tab="母婴" key="9" />
                                <TabPane tab="居家" key="10" />
                                <TabPane tab="美食" key="11" />
                                <TabPane tab="数码" key="12" />
                                <TabPane tab="家电" key="13" />
                                <TabPane tab="其他" key="14" />
                                <TabPane tab="车品" key="15" />
                                <TabPane tab="文体" key="16" />
                                <TabPane tab="宠物" key="17" />
                            </Tabs>
                        </Col>

                    </Row>
                </div>

                <Card>

                    <Row gutter={16}>
                        {
                            data.map(item => {

                                return <Col style={{ marginBottom: '10px' }} sm={24} md={12} lg={8} xl={6} xxl={4}
                                    key={guid()}
                                       >
                                    <Card className="my_type_item"
                                        hoverable
                                        cover={
                                            <img
                                                style={{ objectFit: 'cover' }}
                                                height={250}
                                                src={item.itempic}
                                                onClick={this.jumpUrl.bind(this, item.itemid)}
                                                alt=""
                                            />
                                        }
                                    >
                                        <div style={{ paddingRight: 15 }}>
                                            <div style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                marginBottom: 10,
                                                color: 'gray'
                                            }}
                                            >{item.itemtitle}
                                            </div>
                                            <div className="barText">
                                                <div style={{ width: item.couponsurplus / item.couponnum * 100 + "%" }} className="bartrue" />
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: 12
                                            }}
                                            >
                                                <div className="text-center" style={{ color: 'gray' }}><span
                                                    style={{
                                                        color: '#FE4800',
                                                        marginRight: 0,
                                                        fontWeight: 'bold'
                                                    }}
                                                                                                       >{item.itemendprice}</span><br />券后
                                                </div>
                                                <div className="text-center" style={{ color: 'gray' }}>{item.tkmoney}
                                                    <br /> 佣金
                                                </div>
                                                <div className="text-center"
                                                    style={{ color: 'gray' }}
                                                >{item.tkrates}% <br /> 佣金比例
                                                </div></div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: 12
                                            }}
                                            >
                                                <div
                                                    style={{ border: '1px solid #f00', color: '#fff' }}
                                                ><span
                                                    style={{ background: '#f00', fontSize: 12, padding: 3, marginRight: 5 }}
                                                >券</span><span
                                                    style={{ color: '#f00', marginRight: 5 }}
                                                         >{item.couponmoney}元</span>
                                                </div>
                                                {/* <div className="text-center">选品人:{item.}</div> */}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div className="text-center" style={{ color: 'gray' }}>月销量 {item.itemsale}</div>
                                                <div className="text-center" title={item.shopname} style={{
                                                    width: '82px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    color: 'gray'
                                                }}
                                                ><img width={16} height={16} src={`https://cloud.hongrz.com/H5/wholesale_ticket/imgs/${
                                                    +item.shopType === "C"
                                                        ? 'taobao'
                                                        : 'tianmao'
                                                    }.png`} alt=""
                                                /> {item.shopname}</div>
                                            </div>
                                        </div>
                                        <div className="select_goods_item" >
                                            <div onClick={this.handleClickItemUrl.bind(this, item.itemid)} style={{ width: "49%", height: "40px", textAlign: "center", display: "inline-block", verticalAlign: "top" }}>复制链接</div>
                                            <div style={{ width: "1px", height: "30px", marginTop: "5px", backgroundColor: "#fff", display: "inline-block", verticalAlign: "top" }} />
                                            <div onClick={this.handleClickItem.bind(this, item.itemdesc)} style={{ width: "49%", height: "40px", textAlign: "center", display: "inline-block", verticalAlign: "top" }}>复制分享文案</div>
                                        </div>
                                    </Card>
                                </Col>
                            })
                        }
                    </Row>
                    <br />
                    <div>
                        <Pagination
                            style={{ float: 'right' }}
                            total={total}
                            showTotal={total => `共有 ${total} 条`}
                            pageSizeOptions={pageSizeOptions}
                            showSizeChanger
                            pageSize={query.pageSize}
                            defaultCurrent={query.curPage}
                            onChange={this.changeCurPage.bind(this)}
                            onShowSizeChange={this.changePageSize.bind(this)}
                        />
                    </div>
                </Card>

            </div>
        )
    }
}

export default Dashboard;
