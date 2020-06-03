import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Modal,
    PageHeader,
    Card,
    Select,
    Skeleton
} from 'antd/lib/index';
import { clickCancel, handleImgSize, openNotificationWithIcon } from "../../../utils";
import { uploadImg } from "../../../api/public";
import { Editor } from "react-draft-wysiwyg";
import { emojis } from "../../share/common/Emojis";
import { addMonographicProduct, isDuplicate,coupon } from "../../../api/featured/starsAndSea";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { ContentState, EditorState } from "draft-js";

const FormItem = Form.Item;
const { confirm } = Modal
const { Option } = Select;
let id = 0;

class AddLink extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增活动',
            loadingFinish: false,
            loading: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],
            width: '720',
            height: '320',
            editorContent1: '',
            editorState1: '',
            editorContent2: '',
            editorState2: '',
            editorContent3: '',
            editorState3: '',
            editorContent4: '',
            editorState4: '',
            editorContent5: '',
            editorState5: '',
            editorContent6: '',
            editorState6: '',
            editorContent7: '',
            editorState7: '',
            editorContent8: '',
            editorState8: '',
            editorContent9: '',
            editorState9: '',
            editorContent10: '',
            editorState10: '',
            isShowAddBtn: true,
            Goodtitle: "",
            name: "",
            featuredId: "",
            onlyGoodsId1:"",
            onlyGoodsId2:"",
            onlyGoodsId3:"",
            onlyGoodsId4:"",
            onlyGoodsId5:"",
            onlyGoodsId6:"",
            onlyGoodsId7:"",
            onlyGoodsId8:"",
            onlyGoodsId9:"",
            onlyGoodsId10:"",
            couponId1:"",
            couponId2:"",
            couponId3:"",
            couponId4:"",
            couponId5:"",
            couponId6:"",
            couponId7:"",
            couponId8:"",
            couponId9:"",
            couponId10:"",
            platform1:"",
            platform2:"",
            platform3:"",
            platform4:"",
            platform5:"",
            platform6:"",
            platform7:"",
            platform8:"",
            platform9:"",
            platform10:"",
            

        };
    }

    // 获取活动信息
    componentDidMount () {
        let params;

        if (this.props.location.hasOwnProperty('query')) {
            params = {
                title: this.props.location.query.title,
                name: this.props.location.query.name,
                Goodtitle: this.props.location.query.Goodtitle,
                featuredId: this.props.location.query.featuredId
            }
            console.log(params)
            sessionStorage.setItem('AddGoods', JSON.stringify(params))
            this.setState({
                Goodtitle: params.Goodtitle,
                name: params.name,
                featuredId: params.featuredId,
                title: params.title + '商品',
            })


            // if (params.id !== undefined) {
            this.setState({
                title: params.title + '商品',
                // loadingFinish: true
            })
            // this.getAdvertInfo(params.id)
            // }
        } else {
            params = JSON.parse(sessionStorage.getItem('AddGoods'))
            if (!params) {
                params = {
                    title: this.props.location.query.title,
                    name: this.props.location.query.name,
                    Goodtitle: this.props.location.query.Goodtitle,
                    featuredId: this.props.location.query.featuredId
                }
                console.log(params)
                this.setState({
                    Goodtitle: params.Goodtitle,
                    name: params.name,
                    featuredId: params.featuredId,
                    title: params.title + '商品',
                })
                sessionStorage.setItem('AddGoods', JSON.stringify(params))
            } else {
                this.setState({
                    Goodtitle: params.Goodtitle,
                    name: params.name,
                    featuredId: params.featuredId,
                    title: params.title + '商品',
                })
                sessionStorage.setItem('AddGoods', JSON.stringify(params))
            }
            // if (params && params.id !== 'undefined') {
            this.setState({
                title: params.title + '商品',
                // loadingFinish: true
            })
            // this.getAdvertInfo(params.id)
            // }
        }
    }

    // componentWillUnmount() {
    //     sessionStorage.removeItem('AddGoods')
    // }



    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            
            if (!err) {
                console.log(values)
                this.setState({ loading: true }, () => {

                    let arr = [{
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle1 ? values.gsSubTitle1 : '',
                        goodsUrl: values.goodsUrl1,
                        shareMsg: this.state.editorContent1,
                        goodsId: values.goodsId1,
                        couponUrl:values.couponUrl1,
                        couponId:this.state.couponId1,
                        platform:this.state.platform1
                    }, {
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle2 ? values.gsSubTitle2 : '',
                        goodsUrl: values.goodsUrl2,
                        shareMsg: this.state.editorContent2,
                        goodsId: values.goodsId2,
                        couponUrl:values.couponUrl2,
                        couponId:this.state.couponId2,
                        platform:this.state.platform2
                    }, {
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle3 ? values.gsSubTitle3 : '',
                        goodsUrl: values.goodsUrl3,
                        shareMsg: this.state.editorContent3,
                        goodsId: values.goodsId3,
                        couponUrl:values.couponUrl3,
                        couponId:this.state.couponId3,
                        platform:this.state.platform3
                    }, {
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle4 ? values.gsSubTitle4 : '',
                        goodsUrl: values.goodsUrl4,
                        shareMsg: this.state.editorContent4,
                        goodsId: values.goodsId4,
                        couponUrl:values.couponUrl4,
                        couponId:this.state.couponId4,
                        platform:this.state.platform4
                    }, {
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle5 ? values.gsSubTitle5 : '',
                        goodsUrl: values.goodsUrl5,
                        shareMsg: this.state.editorContent5,
                        goodsId: values.goodsId5,
                        couponUrl:values.couponUrl5,
                        couponId:this.state.couponId5,
                        platform:this.state.platform5
                    }, {
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle6 ? values.gsSubTitle6 : '',
                        goodsUrl: values.goodsUrl6,
                        shareMsg: this.state.editorContent6,
                        goodsId: values.goodsId6,
                        couponUrl:values.couponUrl6,
                        couponId:this.state.couponId6,
                        platform:this.state.platform6,
                    }, {
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle7 ? values.gsSubTitle7 : '',
                        goodsUrl: values.goodsUrl7,
                        shareMsg: this.state.editorContent7,
                        goodsId: values.goodsId7,
                        couponUrl:values.couponUrl7,
                        couponId:this.state.couponId7,
                        platform:this.state.platform7
                    }, {
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle8 ? values.gsSubTitle8 : '',
                        goodsUrl: values.goodsUrl8,
                        shareMsg: this.state.editorContent8,
                        goodsId: values.goodsId8,
                        couponUrl:values.couponUrl8,
                        couponId:this.state.couponId8,
                        platform:this.state.platform8
                    }, {
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle9 ? values.gsSubTitle9 : '',
                        goodsUrl: values.goodsUrl9,
                        shareMsg: this.state.editorContent9,
                        goodsId: values.goodsId9,
                        couponUrl:values.couponUrl9,
                        couponId:this.state.couponId9,
                        platform:this.state.platform9
                    }, {
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle10 ? values.gsSubTitle10 : '',
                        goodsUrl: values.goodsUrl10,
                        shareMsg: this.state.editorContent10,
                        goodsId: values.goodsId10,
                        couponUrl:values.couponUrl10,
                        couponId:this.state.couponId10,
                        platform:this.state.platform10
                    }]

                    for (let i = 0; i < values.length; i++) {
                        delete values['goodsUrl' + (i + 1)]
                        delete values['shareMsg' + (i + 1)]
                        delete values['goodsId' + (i + 1)]
                    }

                    delete values.keys
                    values.activityMFPItemRequsets = arr

                    delete values.goodsId1
                    delete values.goodsUrl1
                    delete values.gsSubTitle1
                    delete values.shareMsg1


                    delete values.goodsId2
                    delete values.goodsUrl2
                    delete values.gsSubTitle2
                    delete values.shareMsg2

                    delete values.goodsId3
                    delete values.goodsUrl3
                    delete values.gsSubTitle3
                    delete values.shareMsg3

                    delete values.goodsId4
                    delete values.goodsUrl4
                    delete values.gsSubTitle4
                    delete values.shareMsg4

                    delete values.goodsId5
                    delete values.goodsUrl5
                    delete values.gsSubTitle5
                    delete values.shareMsg5

                    delete values.goodsId6
                    delete values.goodsUrl6
                    delete values.gsSubTitle6
                    delete values.shareMsg6

                    delete values.goodsId7
                    delete values.goodsUrl7
                    delete values.gsSubTitle7
                    delete values.shareMsg7

                    delete values.goodsId8
                    delete values.goodsUrl8
                    delete values.gsSubTitle8
                    delete values.shareMsg8

                    delete values.goodsId9
                    delete values.goodsUrl9
                    delete values.gsSubTitle9
                    delete values.shareMsg9

                    delete values.goodsId10
                    delete values.goodsUrl10
                    delete values.gsSubTitle10
                    delete values.shareMsg10

                    delete values.couponUrl1
                    delete values.couponUrl2
                    delete values.couponUrl3
                    delete values.couponUrl4
                    delete values.couponUrl5
                    delete values.couponUrl6
                    delete values.couponUrl7
                    delete values.couponUrl8
                    delete values.couponUrl9
                    delete values.couponUrl10

                    delete values.platform1
                    delete values.platform2
                    delete values.platform3
                    delete values.platform4
                    delete values.platform5
                    delete values.platform6
                    delete values.platform7
                    delete values.platform8
                    delete values.platform9
                    delete values.platform10

console.log(values)

                     addMonographicProduct(values).then((res) => {
                        console.log(res)
                        if (res && res.success) {
                            openNotificationWithIcon('success', '保存成功！')
                            clickCancel()
                        } else {
                            this.setState({ loading: false }, () => {
                                openNotificationWithIcon('error', '保存失败！')
                            })
                        }
                    })
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
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
        return handleImgSize(r, file, 0, 0, res => {
            that.setState({
                data: res
            })
        })
    };
    handleChange = ({ fileList }) => {
        this.setState({ fileList })
    }
    // 自定义上传
    customRequest = (files) => {
        const { file } = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    img: res.data,
                    fileList: [{ uid: file.uid, url: res.data, status: 'done' }]
                })
                that.props.form.setFieldsValue({
                    img: that.props.form.getFieldsValue().img
                })
            }
        })
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

    handleBack () {
        if (this.props.form.getFieldsValue().name) {
            confirm({
                title: '提示',
                content: '你还未保存信息，确认取消保存吗？',
                okText: '确定',
                cancelText: '取消',
                centered: true,
                onOk () {
                    clickCancel()
                },
                onCancel () {
                },
            });
        } else {
            clickCancel()
        }
    }

    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 0) {
            return;
        }
        console.log(keys, k)
        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key.key !== k),
        });
    };
    initData = (i, data) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat([{
            key: id++,
            ['goodsUrl' + (i + 1)]: data.mfProducts[i].goodsUrl + '',
            ['goodsId' + (i + 1)]: data.mfProducts[i].goodsId + '',
            ['shareMsg' + (i + 1)]: data.mfProducts[i].shareMsg + ''
        }]);
        // 回显
        const contentBlock = htmlToDraft(data.mfProducts[i].shareMsg);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
            ['editorState' + (i + 1)]: editorState,
            ['editorContent' + (i + 1)]: data.mfProducts[i].shareMsg,
            ['id' + (i + 1)]: data.mfProducts[i].id
        })
        form.setFieldsValue({
            keys: nextKeys
        });
    }

    handleSelectType1 = val => {
        this.setState({
            platform1: val,
        })
    }
    handleSelectType2 = val => {
        this.setState({
            platform2: val,
        })
    }
    handleSelectType3 = val => {
        this.setState({
            platform3: val,
        })
    }
    handleSelectType4 = val => {
        this.setState({
            platform4: val,
        })
    }
    handleSelectType5 = val => {
        this.setState({
            platform5: val,
        })
    }
    handleSelectType6 = val => {
        this.setState({
            platform6: val,
        })
    }
    handleSelectType7 = val => {
        this.setState({
            platform7: val,
        })
    }
    handleSelectType8 = val => {
        this.setState({
            platform8: val,
        })
    }
    handleSelectType9 = val => {
        this.setState({
            platform9: val,
        })
    }
    handleSelectType10 = val => {
        this.setState({
            platform10: val,
        })
    }

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        if (id > 17) {
            this.setState({
                isShowAddBtn: false
            })
            return;
        }
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat([{ key: id++ }]);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };
    onEditorChange = (index, editorContent) => {
        this.setState({
            ['editorContent' + index]: draftToHtml(editorContent),
        });
    };


    onBlur1 = (value) => {
        this.setState({
            onlyGoodsId1:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlur2 = (value) => {
        this.setState({
            onlyGoodsId2:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlur3 = (value) => {
        this.setState({
            onlyGoodsId3:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlur4 = (value) => {
        this.setState({
            onlyGoodsId4:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlur5 = (value) => {
        this.setState({
            onlyGoodsId5:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlur6 = (value) => {
        this.setState({
            onlyGoodsId6:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlur7 = (value) => {
        this.setState({
            onlyGoodsId7:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlur8 = (value) => {
        this.setState({
            onlyGoodsId8:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlur9 = (value) => {
        this.setState({
            onlyGoodsId9:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlur10 = (value) => {
        this.setState({
            onlyGoodsId10:value
        })
        let params = {
            "featuredId": this.state.featuredId,
            "goodsId": value
        }
        isDuplicate(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', res.message)
            }
        })
    }

    onBlurUrl1 = (value) => {
        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId1,
            "platform": this.state.platform1
        }
        
      
            coupon(params).then(res => {
                if (res.success === false) {
                    openNotificationWithIcon('error', res.message)
                }else{
                    this.setState({
                        couponId1 : res.data.couponId
                    }) 
                    openNotificationWithIcon('success', '优惠券有效')
                }
            })
        

    }
    onBlurUrl2 = (value) => {

        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId2,
            "platform": 2
        }
        
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                this.setState({
                    couponId2 : res.data.couponId
                }) 
                openNotificationWithIcon('success', '优惠券有效')
            }
        })

    }
    onBlurUrl3 = (value) => {

        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId3,
            "platform": 2
        }
        
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                this.setState({
                    couponId3 : res.data.couponId
                }) 
                openNotificationWithIcon('success', '优惠券有效')
            }
        })

    }
    onBlurUrl4 = (value) => {

        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId4,
            "platform": 2
        }
        
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                this.setState({
                    couponId4 : res.data.couponId
                }) 
                openNotificationWithIcon('success', '优惠券有效')
            }
        })

    }
    onBlurUrl5 = (value) => {

        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId5,
            "platform": 2
        }
        
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                this.setState({
                    couponId5 : res.data.couponId
                }) 
                openNotificationWithIcon('success', '优惠券有效')
            }
        })

    }
    onBlurUrl6 = (value) => {

        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId6,
            "platform": 2
        }
        
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                this.setState({
                    couponId6 : res.data.couponId
                }) 
                openNotificationWithIcon('success', '优惠券有效')
            }
        })

    }
    onBlurUrl7 = (value) => {

        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId7,
            "platform": 2
        }
        
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                this.setState({
                    couponId7 : res.data.couponId
                }) 
                openNotificationWithIcon('success', '优惠券有效')
            }
        })

    }
    onBlurUrl8 = (value) => {

        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId8,
            "platform": 2
        }
        
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                this.setState({
                    couponId8 : res.data.couponId
                }) 
                openNotificationWithIcon('success', '优惠券有效')
            }
        })

    }
    onBlurUrl9 = (value) => {

        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId9,
            "platform": 2
        }
        
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                this.setState({
                    couponId9 : res.data.couponId
                }) 
                openNotificationWithIcon('success', '优惠券有效')
            }
        })

    }
    onBlurUrl10 = (value) => {

        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId10,
            "platform": 2
        }
        
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                this.setState({
                    couponId10 : res.data.couponId
                }) 
                openNotificationWithIcon('success', '优惠券有效')
            }
        })

    }

    getCoupon(params){
        console.log(params)
        coupon(params).then(res => {
            if (res.success === false) {
                openNotificationWithIcon('error', "该优惠券不存在")
            }else{
                openNotificationWithIcon('success', '优惠券有效')
            }
        })
    }

    //     clickCancel() { 
    //     window.history.back()
    // }

    onEditorStateChange = (index, editorState) => {
        this.setState({
            ['editorState' + index]: editorState
        });
    };
    // 校验
    compareToShareMsg = (result, rule, value, callback) => {
        result = result ? result.replace(/<\/?.+?>/g, "") : ''
        if (result && result.length > 200) {
            callback('最大输入长度为200个字符')
        } else {
            callback()
        }
    };

    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 4 },
            },
        };
        const { loading, loadingFinish } = this.state;
        const { editorContent1, editorState1, editorContent2, editorState2, editorContent3, editorState3,
            editorContent4, editorState4, editorContent5, editorState5, editorContent6, editorState6,
            editorContent7, editorState7, editorContent8, editorState8, editorContent9, editorState9,
            editorContent10, editorState10 } = this.state;
        const { getFieldDecorator } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });

        return (
            <div className="gutter-example button-demo">
                <PageHeader onBack={clickCancel} title="活动管理" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Skeleton loading={loadingFinish} active paragraph={{ rows: 4 }} />
                        <Form style={{ display: loadingFinish ? 'none' : 'block' }} {...formItemLayout}
                            onSubmit={this.handleSubmit} labelAlign={'right'}
                        >
                            <FormItem label="活动名称">
                                {this.state.Goodtitle}
                            </FormItem>
                            <FormItem label="专场名称">
                                {this.state.name}
                            </FormItem>
                            <FormItem label="商品信息">
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUrl1', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle1', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId1', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur1(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg1', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent1),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState1}
                                                initialContentState={editorContent1}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 1)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 1)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl1', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl1(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform1', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType1}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        <Option value="4">唯品会</Option>
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUrl2', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle2', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId2', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur2(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg2', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent2),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState2}
                                                initialContentState={editorContent2}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 2)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 2)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl2', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl2(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform2', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType2}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        <Option value="4">唯品会</Option>
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUrl3', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle3', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId3', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur3(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg3', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent3),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState3}
                                                initialContentState={editorContent3}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 3)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 3)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl3', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl3(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform3', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType3}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUr4', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle4', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId4', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur4(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg4', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent4),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState4}
                                                initialContentState={editorContent4}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 4)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 4)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl4', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl4(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform4', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType4}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        <Option value="4">唯品会</Option>
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUrl5', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle5', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId5', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur5(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg5', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent5),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState5}
                                                initialContentState={editorContent5}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 5)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 5)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl5', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl5(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform5', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType5}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        <Option value="4">唯品会</Option>
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUrl6', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle6', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId6', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur6(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg6', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent6),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState6}
                                                initialContentState={editorContent6}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 6)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 6)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl6', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl6(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform6', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType6}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        <Option value="4">唯品会</Option>
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUrl7', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle7', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId7', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur7(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg7', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent7),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState7}
                                                initialContentState={editorContent7}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 7)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 7)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl7', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl7(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform7', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType7}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        <Option value="4">唯品会</Option>
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUrl8', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle8', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId8', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur8(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg8', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent8),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState8}
                                                initialContentState={editorContent8}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 8)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 8)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl8', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl8(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform8', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType8}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        <Option value="4">唯品会</Option>
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUrl9', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle9', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId9', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur9(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg9', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent9),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState9}
                                                initialContentState={editorContent9}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 9)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 9)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl9', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl9(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform9', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType9}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        <Option value="4">唯品会</Option>
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    {getFieldDecorator('goodsUrl10', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle10', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品副标题',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品副标题" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginRight: '15px' }}>
                                    <FormItem>
                                        {getFieldDecorator('goodsId10', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input onBlur={(e) => this.onBlur10(e.target.defaultValue)} placeholder="商品ID" />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={10} className="share-wrap">
                                    <FormItem>
                                        {getFieldDecorator('shareMsg10', {
                                            rules: [
                                                {
                                                    validator: this.compareToShareMsg.bind(this, editorContent10),
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState10}
                                                initialContentState={editorContent10}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange.bind(this, 10)}
                                                toolbar={{
                                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis(),

                                                }}
                                                onContentStateChange={this.onEditorChange.bind(this, 10)}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px',marginTop: '60px' }}>
                                    {getFieldDecorator('couponUrl10', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl10(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '0px',marginLeft:"-269px" }}>
                                {getFieldDecorator('platform10', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择商品平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                        onChange={this.handleSelectType10}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                        {/* <Option value="0">全部</Option>
                                        <Option value="1">自营</Option>
                                        <Option value="4">唯品会</Option>
                                        <Option value="5">线下</Option>
                                        <Option value="6">蘑菇街</Option> */}
                                        
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>


                            <Row>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="default" onClick={this.handleBack.bind(this)}>取消</Button>
                                    <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddLink);

export default BasicForm;
