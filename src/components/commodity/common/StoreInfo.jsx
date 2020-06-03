/** 店铺信息  */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Form, Col, Card, Popover, Icon, Input, Upload, Modal } from 'antd';
import { doItemAnalyze } from '../../../api/commondity/attract'
import { format } from '../../../utils/index'
import LocationSelect from "../../marketing/common/LocationSelect";
import '../../../style/index.less';
import { handleImgSquare,openNotificationWithIcon} from "../../../utils";
import { uploadImg } from '../../../api/public'
const { TextArea } = Input;
class StoreInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            storeData: {
                imgs: []
            },
            // 图片上传
            previewVisible: false,
            previewImage: '',
            couponPrice: "0",
            isCanChange: true,
            fileList: [],
            productName: '',
            picUrl: '',
            isDisable: true
        };
    }
    componentWillReceiveProps (nextProps) {
        this.setState({
            couponPrice: ""
        })

        const that = this
        this.setState({
            couponPrice: that.props.params.couponPrice ? that.props.params.couponPrice : 0
        })
        if (that.props.params !== nextProps.params) {
            if (nextProps.params.productUrl || nextProps.params.productId && nextProps.params.platform) {
                this.getStoreDetail(nextProps)
            }
        }
    }
    getStoreDetail (nextProps) {

        const { ...params } = nextProps.params
        delete params.type
        delete params.couponPrice
        doItemAnalyze(params).then((res) => {
            if (res && res.success) {
                let data = res.data
                const isCustomImg = this.handelExitInImgs(data)
                this.setState({
                    storeData: data,
                    picUrl: this.props.picUrl ? this.props.picUrl : data.picUrl,
                    productName: this.props.productName ? this.props.productName : data.productName,
                    fileList: isCustomImg ? [] : [{ uid: -1, url: this.props.picUrl ? this.props.picUrl : data.picUrl, status: 'done' }]
                })


                this.props.getStoreInfo(data)
            }
        })
    }
    // 判断主图是否是图片列表内的
    handelExitInImgs (data) {
        let isExit = false
        data.imgs.map(item => {
            if (this.props.picUrl && item === this.props.picUrl) {
                isExit = true
            } else if (item === data.picUrl) {
                isExit = true
            }
        })
        return isExit
    }
    handleCancel = () => this.setState({ previewVisible: false });
    // 预览
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    beforeUpload = (file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        let that = this;
        return handleImgSquare(r, file, res => {
            that.setState({
                data: res
            })
        }, 1024)
    };
    handleChange = ({ fileList }) => {
        this.setState({ 
            fileList,
            isDisable:true
         })
    }
    // 自定义上传
    customRequest = (files) => {
        const { file } = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                let data = Object.assign({}, this.state.storeData, { picUrl: res.data })
                that.setState({
                    storeData: data,
                    picUrl: res.data,
                    img: res.data,
                    fileList: [{ uid: file.uid, url: res.data, status: 'done' }]
                })
                openNotificationWithIcon('success', '设为封面图成功！')
                this.props.getStoreInfo(data)

            }
        })
    }
    handleRemove(){
        openNotificationWithIcon('success', '删除成功！');
    }
    async handleUpload (options) {
        const formData = new FormData()
        formData.append('file', options.file)

        let progress = { percent: 1 }


        const intervalId = setInterval(() => {
            if (progress.percent < 100) {
                progress.percent++
                options.onProgress(progress)
            } else {
                clearInterval(intervalId)
            }
        }, 100)
    }
    changeProduceName (e) {
        let data = Object.assign({}, this.state.storeData, { productName: e.target.value })
        this.setState({
            productName: e.target.value,
            storeData: data
        })
        this.props.getStoreInfo(data)

    }
    selectMainPic (url, e) {
        let data = Object.assign({}, this.state.storeData, { picUrl: url })
        this.setState({
            picUrl: url,
            storeData: data
        },()=>{
            openNotificationWithIcon('success', '设为封面图成功！');
        })
        this.props.getStoreInfo(data)
    }
    render () {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Card style={{ backgroundColor: '#F0F2F5' }}>
                <Form labelAlign={'left'} {...formItemLayout}>
                    <Form.Item label="店铺名称">
                        <span>{this.state.storeData.shopName}</span>
                    </Form.Item>
                    <Form.Item label="商品名称:"> {getFieldDecorator('sysType', { initialValue: this.state.productName })(
                        <TextArea maxLength ={60} disabled={this.state.isDisable} rows={1} style={{ width: '50%' }} onBlur={this.changeProduceName.bind(this)} />
                    )}
                        <Icon type="form" style={{ backgroundColor: "#F0F2F5", fontSize: '20px', width: '30px' }} onClick={() => {
                            this.setState({
                                isDisable: false
                            })
                        }}
                        />
                        <span>修改</span>
                    </Form.Item>
                    <Form.Item label="商品主图">
                        <div style={{ overflow: "hidden" }} >
                            {
                                this.state.storeData.imgs.map((item, index) => {
                                    const content = <img
                                        style={{ width: '500px', height: '400px', objectFit: 'contain' }} src={item} alt="图片"
                                                    />
                                    return <div className="imgbox" key={item} onClick={this.selectMainPic.bind(this, item)} >
                                        <img style={{ width: '100px', height: '100px', objectFit: 'contain' }} src={item} alt="" />
                                        <span style={{ display: this.state.picUrl === item ? 'block' : 'none' }} >设为封面图</span>
                                    </div>
                                })
                            }
                        </div>
                        <div className="UploadBox" style={{
                            position: "relative", height: "100px",maxWidth:"120px"
                        }}
                        onClick={(event)=> {
                            if(event.target.tagName !=='svg'&& event.target.tagName !=='path'){ //排除用户点击预览与删除按钮元素时触发'设为封面图成功！'事件）
                                if(this.state.fileList.length > 0){
                                    let data = Object.assign({}, this.state.storeData, { picUrl: this.state.fileList[0].url })
                                    this.setState({
                                        picUrl: this.state.fileList[0].url,
                                        storeData: data
                                    },()=>{
                                        openNotificationWithIcon('success', '设为封面图成功！');
                                    })
                                    this.props.getStoreInfo(data)
                                }
                            }
                        }}
                        >
                            <Upload
                                accept="image/*"
                                listType="picture-card"
                                fileList={this.state.fileList}
                                customRequest={this.customRequest}
                                beforeUpload={this.beforeUpload}
                                onPreview={this.handlePreview}
                                onRemove = {this.handleRemove}
                                handleUpload={this.handleUpload}
                                onChange={this.handleChange}
                            >
                                {this.state.fileList.length > 0 ? null : '上传封面图'}
                            </Upload>
                            <div className="tip-checked" style={{ display: this.state.fileList.length >0 && this.state.picUrl === this.state.fileList[0].url ? 'block' : 'none' }}>设为封面图</div>
                        </div>
                        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel} centered>
                            <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
                        </Modal>
                        <p style={{ color: "gray"}}>图片格式必须为jpg、png格式。图片比例须为正方形。大小不能超过1M</p>
                    </Form.Item>
                    <Form.Item>
                        <Col span={5}>
                            商品原价：
                        </Col>
                        <Col span={7} style={{ textAlign: 'center' }}>
                            {this.state.storeData.zkFinalPrice ? this.state.storeData.zkFinalPrice + '元' : ''}
                        </Col>
                        <Col span={5}>
                            商品现价：
                        </Col>
                        <Col span={7} style={{ textAlign: 'center' }}>
                            {this.state.couponPrice ? this.state.storeData.zkFinalPrice - this.state.couponPrice + '元' : this.state.storeData.finalPrice + '元'}
                            {/* {this.state.storeData.finalPrice && this.state.storeData.finalPrice !== 0  ? this.state.storeData.finalPrice + '元' : ''} */}
                        </Col>
                    </Form.Item>
                    <Form.Item>
                        <Col span={5}>
                            优惠券金额：
                        </Col>
                        <Col span={7} style={{ textAlign: 'center' }}>
                            {this.state.couponPrice ? this.state.couponPrice + '元' : this.state.storeData.couponPrice ? this.state.storeData.couponPrice + '元' : ""}
                        </Col>
                        <Col span={5}>
                            佣金比例：
                        </Col>
                        <Col span={7} style={{ textAlign: 'center' }}>
                            {this.state.storeData.commissionShare ? (this.state.storeData.commissionShare * 100).toFixed(2) + '%' : ''}
                        </Col>
                    </Form.Item>
                    <Form.Item label="优惠券有效期:">
                        <span> &nbsp; &nbsp;{this.state.storeData.couponStartTime ? format(this.state.storeData.couponStartTime) + ' - ' : ''}{this.state.storeData.couponEndTime ? format(this.state.data.couponEndTime) : ''}</span>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

StoreInfo.propTypes = {
    params: PropTypes.object,
    picUrl: PropTypes.string,
    productName: PropTypes.string,
    getStoreInfo: PropTypes.func
}
LocationSelect.defaultProps = {
    params: { imgs: [] },
    picUrl: "",
    productName: ''
}
const BasicForm = Form.create()(StoreInfo);

export default BasicForm;

