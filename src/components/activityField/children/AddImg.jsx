/**
 * Created by yzy on 2020/5/29.
 */
import React, { Component } from 'react';
import {
    Card,
    Form,
    Input,
    Icon,
    Select,
    Row,
    Col,
    Checkbox,
    Radio,
    Button,
    Upload,
    Modal,
    DatePicker,
    PageHeader,
    AutoComplete
} from 'antd';
import { saveBannsaveOrUpdateRewardActivityerEntrance, findByRewardActivityId } from '../../../api/marketing/banner'
import { uploadImg } from '../../../api/public'
import moment from "moment";
import { getList, addOrUpdate, list, get, addOrUpdateBanner, AssList, AssDetails, AddImg, ImgDetails } from '../../../api/assemblyHall/index';
import { format, openNotificationWithIcon, clickCancel, disabledDate, handleImgSize } from "../../../utils";
import { verifyFile, verifyTitle } from "../../../utils/verify";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class AddBanner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            // 图片上传
            previewVisible: false,
            previewImage: '',
            fileList1: [],
            fileList2: [],
            fileList3: [],
            fileList4: [],
            fileList5: [],
            fileList6: [],
            width: 750,
            height: 0,
            typeList: [],
            imgSize: '1M',
            status: 0,
            disabled: false,
            title: '新增图片组合区',

            platform1: "",
            bannerType1: 0,
            bannerUrl1: "",
            productId1: "",

            platform2: "",
            bannerType2: 0,
            bannerUrl2: "",
            productId2: "",

            platform3: "",
            bannerType3: 0,
            bannerUrl3: "",
            productId3: "",

            platform4: "",
            bannerType4: 0,
            bannerUrl4: "",
            productId4: "",

            platform5: "",
            bannerType5: 0,
            bannerUrl5: "",
            productId5: "",

            platform6: "",
            bannerType6: 0,
            bannerUrl6: "",
            productId6: "",

            gpId: "",
            productId: "",
            blockType: 0,
            productId: "",
            isShow: "",
        };
    }

    // 获取横幅信息
    componentDidMount () {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = { id: this.props.location.query.id, title: this.props.location.query.title }
            sessionStorage.setItem('bannerData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '图片组合区'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('bannerData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '图片组合区'
                })
                this.getAdvertInfo(params.id)
            }
        }

        AssList().then((res) => {
            console.log(res)
            this.setState({
                typeList: res.data
            })
        })
    }



    componentWillUnmount () {
        sessionStorage.removeItem('bannerData')
    }

    // 获取横幅信息
    getAdvertInfo (id) {
        const params = { id: id }
        const that = this
        ImgDetails(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                console.log(data)
                // 图片处理
                // const index = data.bannerImg.lastIndexOf('.')
                // const suffix = 'image/' + data.bannerImg.substring(index + 1, data.bannerImg.length);
                // const file = { file: { type: suffix, thumbUrl: data.bannerImg } }
                if(data.blockType == 0){
                    this.setState({
                        width: 750,
                    })
                }else {
                    this.setState({
                        width: 350,
                    })
                }


                if (data.status == 0 || data.status == 2) {
                    this.setState({
                        disabled: true,
                    })
                } else {
                    this.setState({
                        disabled: false,
                    })
                }
                if (data.banners.length == 1) {
                    if (data.banners[0].bannerUrl) {

                        this.setState({
                            bannerType1: 0,
                            bannerUrl1: data.banners[0].bannerUrl,
                        })
                    } else {
                        this.setState({
                            bannerType1: 1,
                            platform1: data.banners[0].platform + "",
                            productId1: data.banners[0].productId
                        })
                    }
                } else if (data.banners.length == 2) {
                    if (data.banners[0].bannerUrl) {
                        this.setState({
                            bannerType2: 0,
                            bannerUrl2: data.banners[0].bannerUrl,
                        })
                    } else {
                        this.setState({
                            bannerType2: 1,
                            platform2: data.banners[0].platform + "",
                            productId2: data.banners[0].productId
                        })
                    }


                    if (data.banners[1].bannerUrl) {
                        this.setState({
                            bannerType3: 0,
                            bannerUrl3: data.banners[1].bannerUrl,
                        })
                    } else {
                        this.setState({
                            bannerType3: 1,
                            platform3: data.banners[1].platform + "",
                            productId3: data.banners[1].productId
                        })
                    }

                } else if (data.banners.length == 3) {
                    if (data.banners[0].bannerUrl) {
                        this.setState({
                            bannerType4: 0,
                            bannerUrl4: data.banners[0].bannerUrl,
                        })
                    } else {
                        this.setState({
                            bannerType4: 1,
                            platform4: data.banners[0].platform + "",
                            productId4: data.banners[0].productId
                        })
                    }


                    if (data.banners[1].bannerUrl) {
                        this.setState({
                            bannerType5: 0,
                            bannerUrl5: data.banners[1].bannerUrl,
                        })
                    } else {
                        this.setState({
                            bannerType5: 1,
                            platform5: data.banners[1].platform + "",
                            productId5: data.banners[1].productId
                        })
                    }

                    if (data.banners[2].bannerUrl) {
                        this.setState({
                            bannerType6: 0,
                            bannerUrl6: data.banners[2].bannerUrl,
                        })
                    } else {
                        this.setState({
                            bannerType6: 1,
                            platform6: data.banners[2].platform + "",
                            productId6: data.banners[2].productId
                        })
                    }

                }




                if (data.banners.length == 1) {

                    let result = []
                    data.banners.map((item, index) => {
                        result.push({ uid: new Date().getTime() + Math.random(), url: item.bannerImg, status: 'done' })
                    })
                    console.log(result)
                    this.setState({
                        fileList1: result,
                    })
                } else if (data.banners.length == 2) {
                    let result = []
                    data.banners.map((item, index) => {
                        result.push({ uid: new Date().getTime() + Math.random(), url: item.bannerImg, status: 'done' })
                    })
                    console.log(result)

                    this.setState({
                        fileList2: result.splice(0, 1),
                        fileList3: result,
                    })
                }
                else if (data.banners.length == 3) {
                    let result = []
                    data.banners.map((item, index) => {
                        result.push({ uid: new Date().getTime() + Math.random(), url: item.bannerImg, status: 'done' })
                    })
                    console.log(result)
                    var NB = result

                    this.setState({
                        fileList4: result.slice(0, 1),
                        fileList5: result.slice(1, 2),
                        fileList6: result.slice(2, 3),
                    })
                }

                // const gsDetails = data.banners
                // gsDetails.map((item, index)=> {
                //     this.setState({
                //         ['fileList' + (index + 1)]: [{uid: new Date().getTime(), url: item, status: 'done'}]
                //     })
                // })

                // this.handleSelectType(data.platform)
                this.setState({
                    productId: data.productId,
                    platform: data.platform + "",
                    gpId: data.gpId,
                    isShow: data.isShow,
                    blockType: data.blockType
                })
                this.props.form.setFieldsValue({
                    bannerTitle: data.bannerTitle + '',
                    sorts: data.sorts + '',
                    // bannerImg: file,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')],
                    gpId: { key: data.gpId, label: data.gpId },
                    isShow: data.isShow,
                    blockTitle: data.blockTitle
                })
                that.setState({
                    // bannerImg: data.bannerImg,
                    // fileList: this.state.fileList
                })
                // if (data.hasOwnProperty('status')) {
                //     this.setState({
                //         disabled: false,
                //         status: data.status
                //     })
                // }
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    handleCancel = () => this.setState({ previewVisible: false });
    // 预览
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };
    beforeUpload = (i, file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        let that = this;
        if (i >= 6) {
            return handleImgSize(r, file, 0, 0, res => {
                that.setState({
                    data: res
                })
            })
        } else {
            return handleImgSize(r, file, this.state.width, this.state.height, res => {
                that.setState({
                    data: res
                })
            })
        }
    };
    handleChange = (i, file) => {
        this.setState({
            ['fileList' + i]: file.fileList.splice(file.fileList.length - 1)
        })
    }
    // 自定义上传
    // 自定义上传
    customRequest = (i, files) => {
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    ['fileList' + i]: [{ uid: new Date().getTime(), url: res.data, status: 'done' }]
                })
            }
        })
    }

    // this.setState({
    //     ['editorState' + (i + 1)]: editorState,
    //     ['editorContent' + (i + 1)]: data.mfProducts[i].shareMsg,
    //     ['id' + (i + 1)]: data.mfProducts[i].id
    // })

    onChange = (params, e) => {
        console.log(params)
        var val = params+""
        var i = val.charAt(val.length-1)
        console.log(i)
        this.setState({ 
            ['bannerUrl' + (i)]: "",
            ['productId' + (i)]: "",
            ['platform' + (i)]: "",
            // bannerUrl: "",
            // productId: "",
            // platform: ""
        });
        this.setState({
            [params]: e.target.value
        });
    };

    onChangeShow = (params, e) => {

        this.setState({
            [params]: e.target.value
        });
    };


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

    handleSelectPage = val => {
        console.log(val)
        this.setState({
            gpId: val.key,
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            console.log(err)
            if (!err) {
                delete values.bannerImg
                delete values.gpId
                // delete values.bannerType
                delete values.status
                values.startTime = parseInt(new Date(values.time[0]).getTime() / 1000)
                values.endTime = parseInt(new Date(values.time[1]).getTime() / 1000)
                // 对状态处理
                if (!this.state.disabled) {
                    values.status = this.state.status
                }
                const bannerId = JSON.parse(sessionStorage.getItem('bannerData'))
                let text = '新增'
                values.id = ''
                if (bannerId && bannerId.id) {
                    values.id = bannerId.id
                    text = '编辑'
                }
                let { time, ...params } = values
                var banners = []
                var allParams = {}


                if (this.state.blockType == 0) {
                    banners = [
                        {
                            bannerImg: this.state.fileList1[0].url,
                            bannerUrl: this.state.bannerUrl1,
                            productId: this.state.productId1,
                            platform: this.state.platform1,
                            sorts: "1"
                        }
                    ]
                } else if (this.state.blockType == 1) {
                    banners = [
                        {
                            bannerImg: this.state.fileList2[0].url,
                            bannerUrl: this.state.bannerUrl2,
                            productId: this.state.productId2,
                            platform: this.state.platform2,
                            sorts: "1"
                        },
                        {
                            bannerImg: this.state.fileList3[0].url,
                            bannerUrl: this.state.bannerUrl3,
                            productId: this.state.productId3,
                            platform: this.state.platform3,
                            sorts: "2"
                        }
                    ]
                }
                else if (this.state.blockType == 2) {
                    banners = [
                        {
                            bannerImg: this.state.fileList4[0].url,
                            bannerUrl: this.state.bannerUrl4,
                            productId: this.state.productId4,
                            platform: this.state.platform4,
                            sorts: "1"
                        }, {
                            bannerImg: this.state.fileList5[0].url,
                            bannerUrl: this.state.bannerUrl5,
                            productId: this.state.productId5,
                            platform: this.state.platform5,
                            sorts: "2"
                        }, {
                            bannerImg: this.state.fileList6[0].url,
                            bannerUrl: this.state.bannerUrl6,
                            productId: this.state.productId6,
                            platform: this.state.platform6,
                            sorts: "3"
                        }
                    ]
                }



                // params.bannerType = this.state.bannerType
                params.gpId = this.state.gpId


                allParams.banners = banners
                allParams.blockType = this.state.blockType

                //     console.log(allParams)


                allParams = Object.assign({}, allParams, params)
                console.log(allParams)
                AddImg(allParams).then((res) => {
                    if (res && res.success) {
                        openNotificationWithIcon('success', text + '组合图片组合区成功！')
                        clickCancel()
                    } else {
                        openNotificationWithIcon('error', text + '组合图片组合区失败！')
                    }
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };

    // 样式参数
    handleInput (params, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                [params]: value
            })
        } else {
            this.setState({
                [params]: ""
            })
        }
        this.setState({
            bannerType: 0
        })

    }
    handleInputID (params, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            this.setState({
                [params]: value
            })
        } else {
            this.setState({
                [params]: ""
            })
        }
        this.setState({
            bannerType: 1
        })

    }

    handleSelectType (params, val) {
        if (val == 0) {
            this.setState({
                width: 750
            })
        } else {
            this.setState({
                width: 350
            })
        }
        console.log(val)
        this.setState({
            [params]: val
        })
    }
    radioChange = e => {
        this.setState({
            status: e.target.value
        })
    }

    handleSelect (params, val) {
        this.setState({
            [params]: val
        })
    }
    // 校验
    compareToTitle = (rule, value, callback) => {
        const result = verifyTitle(rule, value)
        result ? callback(result) : callback()
    };
    // 校验数字
    compareToNumber = (rule, value, callback) => {
        if (value) {
            const reg = /^[1-9]\d*$/;
            reg.test(value) ? callback() : callback("请输入正整数")
        } else {
            callback('请选择或者输入优先级，数字越小优先级越大')
        }
    };
    normFile = (rule, value, callback) => {
        const result = verifyFile(rule, value)
        if (result) {
            callback(result)
        } else {
            if (this.state.fileList.length > 0 && this.state.fileList[0].status === 'uploading') {
                // callback('图片正在上传，请稍后')
            } else {
                callback()
            }
        }
    };

    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };

        const { previewVisible, previewImage, fileList1, fileList2, fileList3, fileList4, fileList5, fileList6 } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );
        const uploadButton2 = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择左图</div>
            </div>
        );
        const uploadButton3 = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择右图</div>
            </div>
        );
        const uploadButton31 = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择左图</div>
            </div>
        );
        const uploadButton32 = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择右上图</div>
            </div>
        );
        const uploadButton33 = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择右下图</div>
            </div>
        );
        const { getFieldDecorator } = this.props.form;
        const dataSource = ['10', '20', '30', '40', '50']
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="图片组合区" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                            <FormItem label="模块">
                                <Select style={{ width: '33%', marginBottom: "2%" }}
                                    onChange={this.handleSelectType.bind(this, "blockType")}
                                    value={this.state.blockType}
                                    disabled={this.state.disabled}
                                >
                                    <Option key="0" value={0}>一图模块</Option>
                                    <Option key="1" value={1}>二图模块</Option>
                                    <Option key="2" value={2}>三图模块</Option>

                                </Select>
                            </FormItem>
                            <FormItem style={{ marginLeft: "21%", width: '88%',display: +this.state.blockType === 0 ? "block" : "none", }} >
                                <div className="clearfix" >

                                    <Upload
                                      
                                        accept="image/*"
                                        listType="picture-card"
                                        fileList={fileList1}
                                        customRequest={this.customRequest.bind(this, 1)}
                                        beforeUpload={this.beforeUpload.bind(this, 1)}
                                        onPreview={this.handlePreview.bind(this)}
                                        handleUpload={this.handleUpload.bind(this, 1)}
                                        onChange={this.handleChange.bind(this, 1)}>
                                        {fileList1.length >= 1 ? null : uploadButton}
                                        
                                    </Upload>

                                    <span>要求：图片尺寸为{this.state.width}px宽度，高度不设限制；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered >
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </div>
                                <Col>
                                    <Radio.Group value={this.state.bannerType1}
                                        onChange={this.onChange.bind(this, 'bannerType1')}
                                    >
                                        <Radio value={0}>关联网页</Radio>
                                        <Radio value={1}>平台</Radio>
                                    </Radio.Group>
                                    <Input placeholder="关联网页"  style={{ display: +this.state.bannerType1 === 0 ? "block" : "none", width: '33%' }} value={this.state.bannerUrl1} onChange={this.handleInput.bind(this, "bannerUrl1")} />
                                    <Select placeholder="请选择平台"  style={{ display: +this.state.bannerType1 === 1 ? "block" : "none", width: '33%' }}
                                        value={this.state.platform1}
                                        onChange={this.handleSelectType.bind(this, "platform1")}
                                    >
                                        <Option key="2" value="2">淘宝</Option>
                                        <Option key="3" value="3">京东</Option>
                                        <Option key="7" value="7">拼多多</Option>
                                        <Option key="4" value="4">唯品会</Option>

                                    </Select>
                                    <Input placeholder="请输入商品ID"  style={{ display: +this.state.bannerType1 === 1 ? "block" : "none", width: '33%', marginTop: "1.5%" }} value={this.state.productId1} onChange={this.handleInputID.bind(this, "productId1")} />

                                </Col>
                            </FormItem>
                            <FormItem style={{ marginLeft: "21%", width: '88%', display: +this.state.blockType === 1 ? "block" : "none", }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                               
                                    <Upload
                                        accept="image/*"
                                        listType="picture-card"
                                        fileList={fileList2}
                                        customRequest={this.customRequest.bind(this, 2)}
                                        beforeUpload={this.beforeUpload.bind(this, 2)}
                                        onPreview={this.handlePreview.bind(this)}
                                        handleUpload={this.handleUpload.bind(this, 2)}
                                        onChange={this.handleChange.bind(this, 2)}>
                                        {fileList2.length >= 1 ? null : uploadButton2}
                                    </Upload>

                                    <Upload
                                        accept="image/*"
                                        listType="picture-card"
                                        fileList={fileList3}
                                        customRequest={this.customRequest.bind(this, 3)}
                                        beforeUpload={this.beforeUpload.bind(this, 3)}
                                        onPreview={this.handlePreview.bind(this)}
                                        handleUpload={this.handleUpload.bind(this, 3)}
                                        onChange={this.handleChange.bind(this, 3)}>
                                        {fileList3.length >= 1 ? null : uploadButton3}
                                    </Upload>


                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                    <span>要求：图片尺寸为{this.state.width}px宽度，高度不设限制；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                </div>

                                左图  <Col>
                                    <Radio.Group value={this.state.bannerType2}
                                        onChange={this.onChange.bind(this, 'bannerType2')}
                                    >
                                        <Radio value={0}>关联网页</Radio>
                                        <Radio value={1}>平台</Radio>
                                    </Radio.Group>
                                    <Input placeholder="关联网页"  style={{ display: +this.state.bannerType2 === 0 ? "block" : "none", width: '33%' }} value={this.state.bannerUrl2} onChange={this.handleInput.bind(this, "bannerUrl2")} />
                                    <Select placeholder="请选择平台"  style={{ display: +this.state.bannerType2 === 1 ? "block" : "none", width: '33%' }}
                                        value={this.state.platform2}
                                        onChange={this.handleSelectType.bind(this, "platform2")}
                                    >
                                        <Option key="2" value="2">淘宝</Option>
                                        <Option key="3" value="3">京东</Option>
                                        <Option key="7" value="7">拼多多</Option>
                                        <Option key="4" value="4">唯品会</Option>

                                    </Select>
                                    <Input placeholder="请输入商品ID"  style={{ display: +this.state.bannerType2 === 1 ? "block" : "none", width: '33%', marginTop: "1.5%" }} value={this.state.productId2} onChange={this.handleInputID.bind(this, "productId2")} />

                                </Col>
                                    右图  <Col>
                                    <Radio.Group value={this.state.bannerType3}
                                        onChange={this.onChange.bind(this, 'bannerType3')}
                                    >
                                        <Radio value={0}>关联网页</Radio>
                                        <Radio value={1}>平台</Radio>
                                    </Radio.Group>
                                    <Input placeholder="关联网页"  style={{ display: +this.state.bannerType3 === 0 ? "block" : "none", width: '33%' }} value={this.state.bannerUrl3} onChange={this.handleInput.bind(this, "bannerUrl3")} />
                                    <Select placeholder="请选择平台"  style={{ display: +this.state.bannerType3 === 1 ? "block" : "none", width: '33%' }}
                                        value={this.state.platform3}
                                        onChange={this.handleSelectType.bind(this, "platform3")}
                                    >
                                        <Option key="2" value="2">淘宝</Option>
                                        <Option key="3" value="3">京东</Option>
                                        <Option key="7" value="7">拼多多</Option>
                                        <Option key="4" value="4">唯品会</Option>

                                    </Select>
                                    <Input placeholder="请输入商品ID"  style={{ display: +this.state.bannerType3 === 1 ? "block" : "none", width: '33%', marginTop: "1.5%" }} value={this.state.productId3} onChange={this.handleInputID.bind(this, "productId3")} />

                                </Col>
                            </FormItem>

                            <FormItem style={{ marginLeft: "21%", width: '88%', display: +this.state.blockType === 2 ? "block" : "none", }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                           

                                    <Upload
                                        accept="image/*"
                                        className="my_upload_top"
                                        listType="picture-card"
                                        fileList={fileList4}
                                        customRequest={this.customRequest.bind(this, 4)}
                                        beforeUpload={this.beforeUpload.bind(this, 4)}
                                        onPreview={this.handlePreview.bind(this)}
                                        handleUpload={this.handleUpload.bind(this, 4)}
                                        onChange={this.handleChange.bind(this, 4)}>
                                        {fileList4.length >= 1 ? null : uploadButton31}
                                    </Upload>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <Upload
                                            className="my_upload"
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList5}
                                            customRequest={this.customRequest.bind(this, 5)}
                                            beforeUpload={this.beforeUpload.bind(this, 5)}
                                            onPreview={this.handlePreview.bind(this)}
                                            handleUpload={this.handleUpload.bind(this, 5)}
                                            onChange={this.handleChange.bind(this, 5)}>
                                            {fileList5.length >= 1 ? null : uploadButton32}
                                        </Upload>

                                        <Upload
                                            className="my_upload"
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList6}
                                            customRequest={this.customRequest.bind(this, 6)}
                                            beforeUpload={this.beforeUpload.bind(this, 6)}
                                            onPreview={this.handlePreview.bind(this)}
                                            handleUpload={this.handleUpload.bind(this, 6)}
                                            onChange={this.handleChange.bind(this, 6)}>
                                            {fileList6.length >= 1 ? null : uploadButton33}
                                        </Upload>
                                    </div>


                                    <span>要求：图片尺寸为{this.state.width}px宽度，高度不设限制；图片大小不超过{this.state.imgSize}，仅支持JPG、JPEG、GIF、PNG格式</span>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </div>
                                左图  <Col>
                                    <Radio.Group value={this.state.bannerType4}
                                        onChange={this.onChange.bind(this, 'bannerType4')}
                                    >
                                        <Radio value={0}>关联网页</Radio>
                                        <Radio value={1}>平台</Radio>
                                    </Radio.Group>
                                    <Input placeholder="关联网页"  style={{ display: +this.state.bannerType4 === 0 ? "block" : "none", width: '33%' }} value={this.state.bannerUrl4} onChange={this.handleInput.bind(this, "bannerUrl4")} />
                                    <Select placeholder="请选择平台"  style={{ display: +this.state.bannerType4 === 1 ? "block" : "none", width: '33%' }}
                                        value={this.state.platform4}
                                        onChange={this.handleSelectType.bind(this, "platform4")}
                                    >
                                        <Option key="2" value="2">淘宝</Option>
                                        <Option key="3" value="3">京东</Option>
                                        <Option key="7" value="7">拼多多</Option>
                                        <Option key="4" value="4">唯品会</Option>

                                    </Select>
                                    <Input placeholder="请输入商品ID"  style={{ display: +this.state.bannerType4 === 1 ? "block" : "none", width: '33%', marginTop: "1.5%" }} value={this.state.productId4} onChange={this.handleInputID.bind(this, "productId4")} />

                                </Col>
                                    右上图  <Col>
                                    <Radio.Group value={this.state.bannerType5}
                                        onChange={this.onChange.bind(this, 'bannerType5')}
                                    >
                                        <Radio value={0}>关联网页</Radio>
                                        <Radio value={1}>平台</Radio>
                                    </Radio.Group>
                                    <Input placeholder="关联网页"  style={{ display: +this.state.bannerType5 === 0 ? "block" : "none", width: '33%' }} value={this.state.bannerUrl5} onChange={this.handleInput.bind(this, "bannerUrl5")} />
                                    <Select placeholder="请选择平台" style={{ display: +this.state.bannerType5 === 1 ? "block" : "none", width: '33%' }}
                                        value={this.state.platform5}
                                        onChange={this.handleSelectType.bind(this, "platform5")}
                                    >
                                        <Option key="2" value="2">淘宝</Option>
                                        <Option key="3" value="3">京东</Option>
                                        <Option key="7" value="7">拼多多</Option>
                                        <Option key="4" value="4">唯品会</Option>

                                    </Select>
                                    <Input placeholder="请输入商品ID"  style={{ display: +this.state.bannerType5 === 1 ? "block" : "none", width: '33%', marginTop: "1.5%" }} value={this.state.productId5} onChange={this.handleInputID.bind(this, "productId5")} />

                                </Col>
                                    右下图  <Col>
                                    <Radio.Group value={this.state.bannerType6}
                                        onChange={this.onChange.bind(this, 'bannerType6')}
                                    >
                                        <Radio value={0}>关联网页</Radio>
                                        <Radio value={1}>平台</Radio>
                                    </Radio.Group>
                                    <Input placeholder="关联网页"  style={{ display: +this.state.bannerType6 === 0 ? "block" : "none", width: '33%' }} value={this.state.bannerUrl6} onChange={this.handleInput.bind(this, "bannerUrl6")} />
                                    <Select placeholder="请选择平台"  style={{ display: +this.state.bannerType6 === 1 ? "block" : "none", width: '33%' }}
                                        value={this.state.platform6}
                                        onChange={this.handleSelectType.bind(this, "platform6")}
                                    >
                                        <Option key="2" value="2">淘宝</Option>
                                        <Option key="3" value="3">京东</Option>
                                        <Option key="7" value="7">拼多多</Option>
                                        <Option key="4" value="4">唯品会</Option>

                                    </Select>
                                    <Input placeholder="请输入商品ID"  style={{ display: +this.state.bannerType6 === 1 ? "block" : "none", width: '33%', marginTop: "1.5%" }} value={this.state.productId6} onChange={this.handleInputID.bind(this, "productId6")} />

                                </Col>
                            </FormItem>

                            <FormItem label="标题">
                                {getFieldDecorator('blockTitle', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入标题!',
                                        },
                                        {
                                            // validator: this.compareToTitle,
                                        }
                                    ],
                                })(
                                    <Input placeholder="中英文均视为一个字符" />
                                )}
                            </FormItem>

                            <FormItem label="前台展示标题">
                                {getFieldDecorator('isShow', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择前台展示标题!',
                                        },
                                    ],
                                })(
                                    <Col>
                                        <Radio.Group value={this.state.isShow}
                                            onChange={this.onChangeShow.bind(this, 'isShow')}
                                        >
                                            <Radio value={1}>显示</Radio>
                                            <Radio value={0}>不显示</Radio>
                                        </Radio.Group>

                                    </Col>)}
                            </FormItem>

                            <FormItem label="起止时间">
                                {getFieldDecorator('time', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择有效期!',
                                        },
                                    ],
                                })(
                                    <RangePicker renderExtraFooter={() => '红人装'} showTime={{
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]
                                    }} format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate} />
                                )
                                }
                            </FormItem>
                            <FormItem label="权重">
                                {getFieldDecorator('sorts', {
                                    rules: [
                                        {
                                            required: true,
                                            validator: this.compareToNumber,
                                        }
                                    ],
                                })(
                                    <AutoComplete
                                        style={{ width: '100%' }}
                                        dataSource={dataSource}
                                        placeholder="请选择或者输入优先级，数字越小优先级越大"
                                        optionLabelProp="value"
                                        filterOption={(inputValue, option) =>
                                            option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                    >
                                        <Input />} />
                                    </AutoComplete>
                                )}
                            </FormItem>
                            <FormItem label="关联组合会场">
                                {getFieldDecorator('gpId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择组合会场!',
                                        },
                                    ],
                                })(
                                    <Select disabled={this.state.disabled} labelInValue onChange={this.handleSelectPage} style={{ width: '35rem' }} >

                                        {this.state.typeList.map(item => (
                                            <Option value={item.id} >{item.title}</Option>
                                        ))}


                                    </Select>
                                )
                                }
                            </FormItem>
                            <Row>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="primary" htmlType="submit">确定</Button>
                                    <Button type="default" onClick={clickCancel}>取消</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddBanner);

export default BasicForm;
