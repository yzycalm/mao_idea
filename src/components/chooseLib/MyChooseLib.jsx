/**
 * Created by smart_yc
 */
import React from 'react';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Typography, Card, Row, Col, Icon, Avatar, Pagination, Modal, Radio, message, Form, Input, Spin } from 'antd';
import { getLibList, deleteItem, updateLib } from '../../api/chooseLib/myChooseLib'
import { guid, openNotificationWithIcon } from '../../utils/index'
import store from "../../store";
import { changeCurPage, changePageSize } from "../../store/actionCreators";

const { Text } = Typography;
const { confirm } = Modal;

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            type: '',
            data: {
                list: [],
                total: 0
            },
            query: {
                curPage: store.getState().curPage,
                pageSize: store.getState().pageSize === 10 ? 11 : store.getState().pageSize,
            },
            emptyUrl: 'https://cloud.hongrz.com/H5/img/empty.jpg',
            editVisible: false,
            teamName: '',
            item: {},
            spinning: true
        }
    }

    componentDidMount () {
        this.initData()
    }

    // 初始化
    initData () {
        getLibList(this.state.query).then(res => {
            if (res && res.success) {
                const data = res.data
                this.setState({
                    spinning: false,
                    data: data,
                    dataLength: data.list.length
                })
            }
        })
    }

    // 选择商品
    handleChooseGoods () {
        this.setState({
            visible: true
        })
    }

    // 详情
    handleToDetail (type, data) {
        if (type === 1) {
            this.props.history.push({
                pathname: 'children/SetRuleLib',
                query: {
                    id: data.id,
                    title: data.groupTitle,
                    createTime: data.createTime,
                    apiParams: data.apiParams,
                    createBy: data.createBy
                }
            })
        } else {
            this.props.history.push({
                pathname: 'children/SetGoodsLib',
                query: {
                    id: data.id,
                    title: data.groupTitle,
                    createTime: data.createTime,
                    createBy: data.createBy,
                    downCount: data.downCount
                }
            })
        }
    }

    // 取消
    handleCancel () {
        this.setState({
            visible: false,
            type: ''
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
    handleDelete (id, e) {
        e.stopPropagation()
        const that = this
        confirm({
            title: '提示',
            content: '确定删除该选品组吗?',
            okText: '确定',
            cancelText: '取消',
            centered: true,
            onOk () {
                const params = { groupId: id }
                deleteItem(params).then(res => {
                    if (res && res.success) {
                        message.success("删除选品组成功")
                        // 判断当前页面有多少条数据，不够显示上一页
                        if (that.state.dataLength <= 1 && that.state.query.curPage > 1) {
                            const current = parseInt(that.state.query.curPage - 1)
                            let data = Object.assign({}, that.state.query, { curPage: current })
                            that.setState({
                                query: data
                            }, () => {
                                that.initData()
                            })
                            return
                        }
                        that.initData()
                    }
                })
            }
        })
    }

    // 修改
    handleEdit (data, e) {
        e.stopPropagation()
        console.log(data.groupTitle)
        this.setState({
            editVisible: true,
            item: data,
            teamName: data.groupTitle
        })
    }

    handleCloseEdit () {
        this.setState({
            editVisible: false,
            teamName: ''
        })
        this.props.form.resetFields()
    }

    handleInput (param, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                [param]: value
            })
        } else {
            this.setState({
                [param]: ""
            })
        }
    }

    handleCommit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let { ...params } = this.state.item
                params.groupTitle = this.state.teamName
                params.type = params.apiType
                updateLib(params).then(res => {
                    if (res && res.success) {
                        message.success("修改分组名成功")
                        this.setState({
                            teamName: "",
                            editVisible: false
                        }, () => {
                            this.initData()
                        })
                    } else {
                        message.error(res.message)
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    }

    changeCurPage (val) {
        //  每页显示多少条
        let data = Object.assign({}, this.state.query, { curPage: val })
        changeCurPage(val)
        this.setState({
            query: data,
            spinning: true
        }, () => {
            this.initData()
        })
    }

    changePageSize (current, val) {
        changePageSize(val)
        changeCurPage(1)
        //  每页显示多少条
        let data = Object.assign({}, this.state.query, { pageSize: val, curPage: 1 })
        this.setState({
            query: data,
            spinning: true
        }, () => {
            this.initData()
        })
    }

    render () {
        const { data, query } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first="选品库" second="我的选品库" />
                <Card>
                    <Spin size="large" spinning={this.state.spinning}>
                        <Text>选品库（{data.total}）</Text>
                        <br /><br />
                        <Row gutter={15}>
                            <Col style={{ marginBottom: '10px' }} sm={24} md={12} lg={8} xl={8} xxl={6}>
                                <Card style={{
                                    textAlign: 'center',
                                    height: '230px',
                                    paddingTop: '40px',
                                    background: '#FAFAFC',
                                    cursor: 'pointer'
                                }} onClick={this.handleChooseGoods.bind(this)}
                                >
                                    <Icon style={{
                                        fontSize: '60px',
                                        color: 'gray',
                                        marginBottom: '10px',
                                        display: 'block'
                                    }}
                                        type="plus-circle"
                                    />
                                    <Text>新建选品组</Text>
                                </Card>
                            </Col>
                            {
                                data.list.map(item => {
                                    return <Col style={{ marginBottom: '10px' }} sm={24} md={12} lg={8} xl={8} xxl={6}
                                        key={item.id} onClick={this.handleToDetail.bind(this, item.apiType, item)}
                                           >
                                        <div className="my_card" style={{ height: '230px', border: '1px solid #e8e8e8' }}>
                                            <div style={{ padding: '15px' }}>
                                                <Text style={{ float: 'right', cursor: 'pointer' }}> <span
                                                    onClick={this.handleEdit.bind(this, item)}
                                                                                                     >修改</span>&nbsp;&nbsp;&nbsp;
                                                <span className="delete"
                                                        onClick={this.handleDelete.bind(this, item.id)}
                                                >删除</span></Text>
                                                <br />
                                                <div style={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    marginTop: '5px',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                >{item.groupTitle}</div>
                                                <Text>商品数量： {item.apiType === 1 ? '按选品规则输出' : item.count + '个'}</Text>
                                            </div>
                                            <div style={{ background: '#fcfcfc', display: 'flex', padding: '10px' }}>
                                                {
                                                    item.imageList.map(value => {
                                                        return <Avatar style={{ marginRight: '15px' }} shape="square"
                                                            size={64}
                                                            src={value} key={guid()}
                                                               />
                                                    })
                                                }
                                                <Avatar style={{
                                                    marginRight: '10px',
                                                    display: item.imageList.length === 0 ? 'inline-block' : 'none'
                                                }} shape="square" size={64}
                                                    src={this.state.emptyUrl} key={new Date().getTime() + ''}
                                                />
                                            </div>
                                            <div style={{ padding: '15px' }}>
                                                <div className="single_omit" style={{
                                                    textAlign: 'right', overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                                >选品人：{item.createBy}</div>
                                            </div>
                                        </div>
                                    </Col>
                                })
                            }
                        </Row>
                        <br />
                        <div>
                            <Pagination
                                style={{ float: 'right' }}
                                total={data.total}
                                showTotal={total => `共有 ${total} 条`}
                                showSizeChanger
                                pageSize={query.pageSize}
                                defaultCurrent={query.curPage}
                                onChange={this.changeCurPage.bind(this)}
                                onShowSizeChange={this.changePageSize.bind(this)}
                            />
                        </div>
                    </Spin>
                </Card>
                <Modal
                    title="选择商品"
                    style={{ top: 20 }}
                    visible={this.state.visible}
                    centered
                    okText={"下一步"}
                    onCancel={this.handleCancel.bind(this)}
                    onOk={this.handleOk.bind(this)}
                >
                    <Radio.Group value={this.state.type} onChange={this.onChangeRadio.bind(this)}>
                        <Radio value={1}>按选品规则输出</Radio>
                        <br />
                        <br />
                        <Radio value={2}>按指定商品输出</Radio>
                    </Radio.Group>
                </Modal>
                <Modal
                    title="修改选品组名"
                    visible={this.state.editVisible}
                    centered
                    onOk={this.handleCommit.bind(this)}
                    onCancel={this.handleCloseEdit.bind(this)}
                >
                    <Form
                        name="customized_form_controls"
                        layout="inline"
                    >
                        <Form.Item label="分组名称">
                            {getFieldDecorator('groupTitle', {
                                initialValue: this.state.teamName,
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
                                <Input style={{ width: '350px' }} onChange={this.handleInput.bind(this, 'teamName')}
                                    placeholder="输入分组名称"
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const BasicForm = Form.create()(Dashboard);

export default BasicForm;
