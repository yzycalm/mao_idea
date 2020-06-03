/**
 * Created by smart_yc.
 */
import React from 'react';
import {
    Card,
    Pagination,
    PageHeader,
    Form,
    Input,
    Button,
    Row,
    Col,
    Select,
    DatePicker,
    Affix,
    Modal, Typography,
    Icon, message,
    Checkbox, Empty, InputNumber, Spin
} from 'antd';
import { clickCancel, openNotificationWithIcon } from "../../../utils";
import { getGoodsList, getLibList, saveLib, updateLib } from '../../../api/chooseLib/myChooseLib'
import { guid } from '../../../utils/index'
import { typeList, sort } from '../common/index'
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker
const { Text } = Typography;

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            isCreate: false,
            data: {
                list: [],
                total: 0
            },
            query: {
                cid: '0',
                couponMax: "",
                couponMin: "",
                curPage: 1,
                pageSize: 12,
                itemSourceId: '',
                keyword: '',
                moneyMin: "",
                priceMax: "",
                priceMin: "",
                ratesMax: 0,
                ratesMin: "",
                saleMax: 0,
                saleMin: "",
                groupId: '',
                sort: '',
                startTime: '',
                endTime: ''
            },
            activeItem: '',
            libList: [],
            option: typeList,
            sortList: sort,
            selectedGoods: [],
            current: [],
            createTeam: {
                createBy: '',
                groupTitle: ''
            },
            dialogQuery: {
                curPage: 1,
                pageSize: 10,
            },
            dialogData: {
                list: [],
                total: 0
            },
            brand: 0,
            juhuasuan: 0,
            qianggou: 0,
            shop: 0,
            sortText: sort[0].value,
            isSame: false,
            spinning: true
        }
    }

    componentDidMount () {
        this.initData()
    }

    initData () {
        getGoodsList(this.state.query).then(res => {
            if (res && res.success) {
                const data = res.data
                this.setState({
                    data: data,
                    spinning: false
                })
            }
        })
    }

    // 输入框
    handleInput (param, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { [param]: value, curPage: 1 })
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, { [param]: '', curPage: 1 })
            this.setState({
                query: data
            })
        }
    }

    // 下拉框
    handleSelected (param, val) {
        let data = Object.assign({}, this.state.query, { [param]: val, curPage: 1 })
        this.setState({
            query: data
        })
    }

    // 排序
    handleSort (param, val) {
        if (val.value === this.state.sortText) {
            this.setState({
                isSame: !this.state.isSame,
                spinning: true
            }, () => {
                this.switchSort(param, val)
            })
        } else {
            this.setState({
                isSame: false,
                spinning: true
            }, () => {
                this.switchSort(param, val)
            })
        }

    }

    switchSort (param, val) {
        const { isSame } = this.state
        let data = Object.assign({}, this.state.query, { [param]: isSame ? val.key[1] : val.key[0], curPage: 1 })
        this.setState({
            query: data,
            sortText: val.value
        }, () => {
            this.initData();
        })
    }

    // 保存到选品库
    handleSaveToLib () {
        if (this.state.selectedGoods.length > 0) {
            const { ...params } = this.state.dialogQuery
            getLibList(params).then(res => {
                if (res && res.success) {
                    const data = res.data
                    let newLibList = []
                    data.list.map(item => {
                        if (+item.apiType === 1) {
                            item.count = '按选品规则输出'
                        } else {
                            item.count = item.count + '/500个'
                        }
                        newLibList.push(item)
                    })
                    this.setState({
                        libList: newLibList,
                        visible: true,
                        dialogData: data,

                    })
                }
            })
        } else {
            message.warning('你还未选中商品 ')
        }
    }

    handleCloseLib () {
        this.setState({
            visible: false,
            activeItem: '',
            isCreate: false
        }, () => {
            this.setState({
                dialogQuery: { curPage: 1, pageSize: 10 }
            })
            this.props.form.resetFields()
        })
    }


    handleSwitchCreate () {
        this.setState({
            isCreate: !this.state.isCreate
        })
        this.props.form.resetFields()
    }

    // 选组
    handleLib (val) {
        if (this.state.activeItem && this.state.activeItem === val) {
            this.setState({
                groupId: '',
                activeItem: ''
            })
        } else {
            this.setState({
                groupId: val,
                activeItem: val
            })
        }
    }

    handleOrderTime (value) {
        let data = Object.assign({}, this.state.query, {
            startTime: value.length > 1 ? moment(value[0]).format("YYYY-MM-DD") + ' 00:00:00' : '',
            endTime: value.length > 1 ? moment(value[1]).format("YYYY-MM-DD") + ' 23:59:59' : '',
            curPage: 1
        })
        this.setState({
            query: data
        })
    }

    // 添加到选品库
    handleAddLib () {
        if (this.state.selectedGoods.length === 0) {
            message.warn("请先选择选品库")
            return false
        }
        const user = JSON.parse(localStorage.getItem('user'))
        let itemSourceId = ""
        if (this.state.selectedGoods.length > 500) {
            message.warn("分组商品最大上限 500")
            return
        }
        this.state.selectedGoods.map(item => {
            itemSourceId = itemSourceId ? itemSourceId + ',' + item : item
        })
        const params = {
            id: this.state.activeItem,
            createBy: user.userName,
            updateBy: user.userName,
            itemSourceId: itemSourceId,
            type: 0
        }
        updateLib(params).then(res => {
            if (res && res.success) {
                message.success("加入成功！")
                this.setState({
                    visible: false
                })
            } else {
                message.error(res.message)
            }
        })
    }

    changeCurPage (val) {
        //  每页显示多少条
        let data = Object.assign({}, this.state.query, { curPage: val })
        this.setState({
            query: data,
            spinning: true
        }, () => {
            this.initData()
        })
    }

    changePageSize (current, val) {
        //  每页显示多少条
        let data = Object.assign({}, this.state.query, { pageSize: val, curPage: 1 })
        this.setState({
            query: data,
            spinning: true
        }, () => {
            this.initData()
        })
    }

    // 跳转我的选品库
    handleToChoose () {
        clickCancel()
    }

    // 本页全选
    handleSelectAll (e) {
        let newArr = [...new Set(this.state.selectedGoods)]
        let newCurrent = [...new Set(this.state.current)]
        if (e.target.checked) {
            this.state.data.list.map(item => {
                if (this.state.selectedGoods.length < 500) {
                    newArr.push(item.itemSourceId)
                }
            })
            if (this.state.selectedGoods.length < 500) {
                newCurrent.push(this.state.query.curPage)
            }
        } else {
            newCurrent.splice(newCurrent.indexOf(this.state.query.curPage), 1)

            this.state.data.list.map(item => {
                newArr.splice(newArr.indexOf(item.itemSourceId), 1)
            })
        }
        this.setState({
            selectedGoods: newArr,
            current: newCurrent
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let { ...params } = values
                params.type = 0
                saveLib(params).then(res => {
                    if (res && res.success) {
                        message.success("新建分组成功")
                        this.setState({
                            isCreate: !this.state.isCreate
                        }, () => {
                            this.handleSaveToLib()
                        })
                    } else {
                        message.error(res.message)
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

    handleChange (param, value) {
        let data = Object.assign({}, this.state.query, { [param]: value, curPage: 1 })
        this.setState({
            query: data
        })
    }

    changeDialogCurPage (val) {
        //  每页显示多少条
        let data = Object.assign({}, this.state.dialogQuery, { curPage: val })
        this.setState({
            dialogQuery: data
        }, () => {
            this.handleSaveToLib()
        })
    }

    changeDialogPageSize (current, val) {
        //  每页显示多少条
        let data = Object.assign({}, this.state.dialogQuery, { pageSize: val, curPage: 1 })
        this.setState({
            dialogQuery: data
        }, () => {
            this.handleSaveToLib()
        })
    }

    // 选择商品
    handleSelectGoods (val, e) {
        let newArr = [...new Set(this.state.selectedGoods)]
        let newCurrent = [...new Set(this.state.current)]
        if (e.target.checked) { // 选中全部
            let isAll = true
            if (this.state.selectedGoods.length < 500) {
                newArr.push(val)
            }
            const that = this
            this.setState({
                selectedGoods: newArr
            }, () => {
                that.state.data.list.map(item => {
                    if (that.state.selectedGoods.indexOf(item.itemSourceId) === -1) {
                        isAll = false
                    }
                })
                if (isAll) {
                    newCurrent.push(this.state.query.curPage)
                    that.setState({
                        current: newCurrent
                    })
                }
            })
        } else { // 取消选中全部
            let isAll = true
            newArr.splice(newArr.indexOf(val), 1)
            const that = this
            this.setState({
                selectedGoods: newArr
            }, () => {
                that.state.data.list.map(item => {
                    if (that.state.selectedGoods.indexOf(item.itemSourceId) === -1) {
                        isAll = false
                    }
                })
                if (!isAll) {
                    newCurrent.splice(newCurrent.indexOf(that.state.query.curPage), 1)
                    that.setState({
                        current: newCurrent
                    })
                }
            })
        }

    }

    handleSelectType (param, e) {
        let data = Object.assign({}, this.state.query, { [param]: e.target.checked ? 1 : 0 })
        this.setState({
            query: data
        })
    }

    render () {
        const { data, query, libList, dialogData, dialogQuery } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="gutter-example button-demo">
                <PageHeader onBack={clickCancel} title="我的商品库" subTitle="指定商品" />
                <Card bordered>
                    <Form layout="inline" labelAlign={"left"}>
                        <Form.Item label="价格:">
                            <Row gutter={8}>
                                <Col span={10}>
                                    <InputNumber style={{ width: '100px' }}
                                        defaultValue={this.state.query.priceMin}
                                        maxLength={9}
                                        min={0}
                                        formatter={value => `￥${value}`}
                                        parser={value => value.replace('￥', '')}
                                        onChange={this.handleChange.bind(this, 'priceMin')}
                                    />
                                </Col>
                                <Col span={2} style={{ textAlign: 'center' }}>
                                    &nbsp;~
                                </Col>
                                <Col span={10}>
                                    <InputNumber style={{ width: '100px' }}
                                        defaultValue={this.state.query.priceMax}
                                        maxLength={9}
                                        min={0}
                                        formatter={value => `￥${value}`}
                                        parser={value => value.replace('￥', '')}
                                        onChange={this.handleChange.bind(this, 'priceMax')}
                                    />
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item label="月销量≥">
                            <InputNumber style={{ width: '150px' }} defaultValue={this.state.query.saleMin}
                                maxLength={8}
                                min={0}
                                formatter={value => `${value}`.replace(/[^\d]/g, '')}
                                onChange={this.handleChange.bind(this, 'saleMin')}
                            />
                        </Form.Item>
                        <Form.Item label="券面额≥">
                            <InputNumber style={{ width: '150px' }} defaultValue={this.state.query.couponMin}
                                maxLength={9}
                                min={0}
                                formatter={value => `￥${value}`.replace(/[^￥\d]/g, '')}
                                parser={value => value.replace('￥', '')}
                                onChange={this.handleChange.bind(this, 'couponMin')}
                            />
                        </Form.Item>
                        <Form.Item label="佣金比例≥">
                            <InputNumber style={{ width: '170px' }} defaultValue={this.state.query.ratesMin}
                                min={0}
                                max={100}
                                maxLength={4}
                                formatter={value => `${value}%`.replace(/^(0+)|[^%\d]+/g, '')}
                                parser={value => value.replace('%', '')}
                                onChange={this.handleChange.bind(this, 'ratesMin')}
                            />
                        </Form.Item>
                        <Form.Item label="品 类">
                            <Select defaultValue={this.state.query.cid} style={{ width: 184 }}
                                onChange={this.handleSelected.bind(this, 'cid')}
                            >
                                {
                                    this.state.option.map(item => {
                                        return <Option value={item.key + ""} key={item.key}>{item.value}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="优惠券有效期">
                            <RangePicker format="YYYY-MM-DD" onChange={this.handleOrderTime.bind(this)} />
                        </Form.Item>
                        <Form.Item label="标题包含">
                            <Input defaultValue={this.state.query.keyword}
                                maxLength={30}
                                onBlur={this.handleInput.bind(this, 'keyword')}
                            />
                        </Form.Item>
                        <Form.Item label="商品ID">
                            <InputNumber defaultValue={this.state.query.itemSourceId}
                                style={{ width: 184 }}
                                maxLength={20}
                                formatter={value => `${value}`.replace(/^(0+)|[^\d]+/g, '')}
                                onChange={this.handleChange.bind(this, 'itemSourceId')}
                            />
                        </Form.Item>
                        <br />
                        <Form.Item>
                            <Checkbox onChange={this.handleSelectType.bind(this, 'qianggou')}>淘抢购商品</Checkbox>
                            <Checkbox onChange={this.handleSelectType.bind(this, 'juhuasuan')}>聚划算商品</Checkbox>
                            <Checkbox onChange={this.handleSelectType.bind(this, 'brand')}>品牌产品</Checkbox>
                        </Form.Item>
                        <Form.Item label="店铺类型">
                            <Select defaultValue={this.state.query.shop} style={{ width: 184 }}
                                onChange={this.handleSelected.bind(this, 'shop')}
                            >
                                <Option value={0}>全部</Option>
                                <Option value={1}>淘宝</Option>
                                <Option value={2}>天猫</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type={"primary"} onClick={this.initData.bind(this)}>查询商品</Button>
                        </Form.Item>
                    </Form>
                </Card>
                <p style={{ paddingLeft: 30 }}>共 {data.total} 个商品</p>
                <Card className="my_type" style={{ marginBottom: 10 }}>
                    {
                        this.state.sortList.map((item, index) => {
                            return <span style={{ cursor: 'pointer' }}
                                onClick={this.handleSort.bind(this, 'sort', item)}
                                key={item.key}
                                   ><span
                                    style={{ color: item.key.indexOf(+query.sort) !== -1 ? "#598EBA" : "" }}
                                   >{item.value}<Icon
                                        style={{ display: index === 0 ? 'none' : '' }}
                                        type={item.key[1] === query.sort ? "sort-descending" : "sort-ascending"}
                                                /></span></span>
                        })
                    }
                </Card>
                <Spin size="large" spinning={this.state.spinning}>
                    <Empty style={{ display: data.list.length === 0 ? 'block' : 'none' }}
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                    <Row gutter={16}>
                        {
                            data.list.map(item => {
                                return <Col style={{ marginBottom: '10px' }} sm={24} md={12} lg={8} xl={6} xxl={4}
                                    key={guid()}
                                       >
                                    <a href={item.itemUrl ? item.itemUrl : 'javascript:void(0);'} target="_blank">
                                        <Card className="my_type"
                                            cover={
                                                <img
                                                    style={{ objectFit: 'cover' }}
                                                    height={250}
                                                    src={item.itemPic}
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
                                                >{item.itemTitle}
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 12
                                                }}
                                                >
                                                    <div className="text-center" style={{ color: 'gray' }}><span
                                                        style={{
                                                            color: '#FC7575',
                                                            marginRight: 0,
                                                            fontWeight: 'bold'
                                                        }}
                                                                                                           >{item.itemEndPrice}</span><br />券后
                                                    </div>
                                                    <div className="text-center"
                                                        style={{ color: 'gray' }}
                                                    >{item.commission}
                                                        <br /> 佣金
                                                    </div>
                                                    <div className="text-center"
                                                        style={{ color: 'gray' }}
                                                    >{item.commissionRate}% <br /> 佣金比例
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 12
                                                }}
                                                >
                                                    <div
                                                        style={{ border: '1px solid #f00', color: '#fff' }}
                                                    ><span
                                                            style={{
                                                                background: '#f00',
                                                                fontSize: 12,
                                                                padding: 3,
                                                                marginRight: 5
                                                            }}
                                                    >券</span><span
                                                                style={{
                                                                    color: '#f00',
                                                                    marginRight: 5
                                                                }}
                                                             >{item.couponMoney}元</span>
                                                    </div>
                                                    <div className="text-center"><img width={16} height={16}
                                                        src={`https://cloud.hongrz.com/H5/wholesale_ticket/imgs/${
                                                            +item.shopType === 1
                                                                ? 'taobao'
                                                                : 'tianmao'
                                                            }.png`}
                                                            alt=""
                                                                                 /></div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div className="text-center"
                                                        style={{ color: 'gray' }}
                                                    >月销量 {+item.saleMonth > 9999 ? (+item.saleMonth / 10000).toFixed(1) + '万' : item.saleMonth}</div>
                                                    <div className="text-center" title={item.shopName} style={{
                                                        width: '100px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        color: 'gray'
                                                    }}
                                                    >{item.shopName}</div>
                                                </div>
                                            </div>
                                            <Checkbox
                                                checked={this.state.selectedGoods.indexOf(item.itemSourceId) !== -1}
                                                className="select_goods"
                                                style={{ display: this.state.selectedGoods.indexOf(item.itemSourceId) !== -1 ? 'block' : '' }}
                                                onChange={this.handleSelectGoods.bind(this, item.itemSourceId)}
                                            >放入选品库</Checkbox>
                                        </Card>
                                    </a>
                                </Col>
                            })
                        }
                    </Row>
                    <Card bordered>
                        <Pagination
                            style={{ float: 'right' }}
                            total={data.total}
                            showTotal={total => `共有 ${total} 条`}
                            showSizeChanger
                            pageSizeOptions={['10', '20', '30', '40', '100']}
                            pageSize={query.pageSize}
                            defaultCurrent={query.curPage}
                            onChange={this.changeCurPage.bind(this)}
                            onShowSizeChange={this.changePageSize.bind(this)}
                        />
                    </Card>
                </Spin>
                <Affix offsetBottom={10}>
                    <Card className="my_goods">
                        <div style={{ paddingTop: 15 }}><Checkbox
                            checked={this.state.current.indexOf(query.curPage) !== -1}
                            onChange={this.handleSelectAll.bind(this)}
                                                        >选取全页商品</Checkbox></div>
                        <div style={{ paddingTop: 15 }}>已选取 <span
                            style={{ color: '#f00' }}
                                                            >{this.state.selectedGoods.length}</span>/500个普通商品
                        </div>
                        <div className="my_goods_btn">
                            <span onClick={this.handleSaveToLib.bind(this)}>保存到选品库</span>
                            <span onClick={this.handleToChoose.bind(this)}>我的选品库</span>
                        </div>
                    </Card>
                </Affix>
                <Modal
                    title="选择分组"
                    visible={this.state.visible}
                    centered
                    onCancel={this.handleCloseLib.bind(this)}
                    onOk={this.handleAddLib.bind(this)}
                    okButtonProps={{ disabled: !this.state.activeItem }}
                    okText={"加入"}
                    width={700}
                >
                    <div>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <Form.Item style={{ display: !this.state.isCreate ? 'none' : 'inline-block' }}>
                                {getFieldDecorator('groupTitle', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入分组名称',
                                        }, {
                                            max: 30,
                                            message: '最多可输入30个字符'
                                        }
                                    ],
                                })(
                                    <Input placeholder="输入分组名称" />
                                )}
                            </Form.Item>
                            <Form.Item style={{ display: !this.state.isCreate ? 'none' : 'inline-block' }}>
                                {getFieldDecorator('createBy', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入选品人',
                                        }, {
                                            max: 30,
                                            message: '最多可输入30个字符'
                                        }
                                    ],
                                })(
                                    <Input placeholder="输入选品人" />
                                )}
                            </Form.Item>
                            <Form.Item style={{ display: !this.state.isCreate ? 'none' : 'inline-block' }}>
                                <Button type="primary" htmlType="submit">
                                    创 建
                                </Button>
                                <Button type="default" onClick={this.handleSwitchCreate.bind(this)}>
                                    取 消
                                </Button>
                            </Form.Item>
                            <Form.Item style={{ display: this.state.isCreate ? 'none' : 'inline-block' }}>
                                <Button type="primary" onClick={this.handleSwitchCreate.bind(this)}>
                                    新建分组
                                </Button>
                            </Form.Item>
                        </Form>
                        <br />
                        <div style={{
                            background: '#FAFAFA',
                            padding: 10,
                            height: 550,
                            position: 'relative',
                            overflowY: 'auto'
                        }}
                        >
                            {
                                libList.map(item => {
                                    return <div
                                        className={this.state.activeItem === item.id ? 'select_item active_item' : 'select_item'}
                                        onClick={this.handleLib.bind(this, item.id)} key={guid()}
                                           >
                                        <div>{item.groupTitle}</div>
                                        <Text>商品数量: {item.count}</Text>
                                        <br />
                                        <Text>选品人: {item.createBy}</Text>
                                    </div>
                                })
                            }
                        </div>
                        <br />
                        <Pagination
                            total={dialogData.total}
                            showTotal={total => `共有 ${total} 条`}
                            showSizeChanger
                            pageSize={dialogQuery.pageSize}
                            defaultCurrent={dialogQuery.curPage}
                            onChange={this.changeDialogCurPage.bind(this)}
                            onShowSizeChange={this.changeDialogPageSize.bind(this)}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

const BasicForm = Form.create()(Dashboard);

export default BasicForm;
