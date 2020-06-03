import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Upload,
    Icon,
    Modal,
    Select,
    PageHeader,
    Card,
    Radio,
    Skeleton
} from 'antd/lib/index';
import { clickCancel, handleImgSize, openNotificationWithIcon } from "../../../utils";
import { addOrEditActivity, viewActivityDetail,coupon} from "../../../api/acrivityField/event";
import { uploadImg } from "../../../api/public";
import { Editor } from "react-draft-wysiwyg";
import { emojis } from "../../share/common/Emojis";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { ContentState, EditorState } from "draft-js";

const FormItem = Form.Item;
const { confirm } = Modal;
const { Option } = Select;
const RadioGroup = Radio.Group;
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
            fileList1: [],
            fileList2: [],
            width: '750',
            height: '320',
            shareWidth: '100',
            shareHeight: '100',
            editorContent1: '',
            editorState1: '',
            editorContent2: '',
            editorState2: '',
            editorContent3: '',
            editorState3: '',
            isShowAddBtn: true,
            isShowImg: '',
            isShare: '',
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
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = { id: this.props.location.query.id, title: this.props.location.query.title }
            sessionStorage.setItem('ActivityData', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '活动',
                    loadingFinish: true
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('ActivityData'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '活动',
                    loadingFinish: true
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount () {
        sessionStorage.removeItem('ActivityData')
    }

    // 获取活动信息
    getAdvertInfo (id) {
        const params = { id: id + '' }
        viewActivityDetail(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                this.setState({
                    fileList1: [{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data.img
                    }],
                    loadingFinish: false,
                    isShare: data.isShare,
                    isShowImg: data.type,
                })
                if (data.isShare) {
                    this.setState({
                        fileList2: [
                            {
                                uid: '-1',
                                name: 'image.png',
                                status: 'done',
                                url: data.shareImg
                            }
                        ]
                    })
                }
                this.props.form.setFieldsValue({
                    name: data.name + '',
                    type: data.type + '',
                    isUse: data.isUse,
                    img: data.img,
                    shareImg: data.shareImg,
                    bgColor: data.bgColor,
                    isShare: data.isShare,
                    shareSubTitle: data.shareSubTitle,
                    shareTitle: data.shareTitle,
                })
                if (data.mfProducts.length > 0) {
                    data.mfProducts.forEach((item, index) => {
                        
                        this.props.form.setFieldsValue({

                            ['goodsUrl' + (index + 1)]: data.mfProducts[index].goodsUrl + '',
                            ['goodsId' + (index + 1)]: data.mfProducts[index].goodsId + '',
                            ['couponUrl' + (index + 1)]: data.mfProducts[index].couponUrl + '',
                            ['platform' + (index + 1)]: data.mfProducts[index].platform + '',
                        })
                        // 回显
                        const contentBlock = htmlToDraft(data.mfProducts[index].shareMsg);
                        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                        const editorState = EditorState.createWithContent(contentState);
                        this.setState({
                            ['editorState' + (index + 1)]: editorState,
                            ['editorContent' + (index + 1)]: data.mfProducts[index].shareMsg,
                            ['id' + (index + 1)]: data.mfProducts[index].id,
                            
                        })
                    })
                    if (data.mfProducts.length > 3) {
                        for (let i = 3; i < data.mfProducts.length; i++) {
                          
                            this.props.form.setFieldsValue({
                                ['goodsId' + (i + 1)]: data.mfProducts[i].goodsId,
                                ['couponUrl' + (i + 1)]: data.mfProducts[i].couponUrl,
                                ['platform' + (i + 1)]: data.mfProducts[i].platform+"",
                            })
                            this.initData(i, data)
                        }
                    }
                    if (data.mfProducts.length >= 20) {
                        this.setState({
                            isShowAddBtn: false
                        })
                    }
                }
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true }, () => {
                    const bannerId = JSON.parse(sessionStorage.getItem('ActivityData'))
                    values.id = ''
                    delete values.img
                    if (+this.state.isShowImg === 0) {
                        values.img = this.state.fileList1[0].url
                    }
                    if (+this.state.isShare) {
                        values.shareImg = this.state.fileList2[0].url
                    } else {
                        // 不显示时情况分享内容
                        values.shareImg = ""
                        values.shareSubTitle = ""
                        values.shareTitle = ""
                        this.setState({ fileList2: [] })
                    }
                    let arr = [{
                        id: this.state.id1 ? this.state.id1 : '',
                        goodsUrl: values.goodsUrl1,
                        shareMsg: this.state.editorContent1,
                        goodsId: values.goodsId1,
                        couponUrl:values.couponUrl1,
                        couponId:this.state.couponId1,
                        platform:this.state.platform1
                    }, {
                        id: this.state.id2 ? this.state.id2 : '',
                        goodsUrl: values.goodsUrl2,
                        shareMsg: this.state.editorContent2,
                        goodsId: values.goodsId2,
                        couponUrl:values.couponUrl2,
                        couponId:this.state.couponId2,
                        platform:this.state.platform2
                    }, {
                        id: this.state.id3 ? this.state.id3 : '',
                        goodsUrl: values.goodsUrl3,
                        shareMsg: this.state.editorContent3,
                        goodsId: values.goodsId3,
                        couponUrl:values.couponUrl3,
                        couponId:this.state.couponId3,
                        platform:this.state.platform3
                    }]
                    arr.forEach((value, index) => {
                        delete values['goodsUrl' + (index + 1)]
                        delete values['shareMsg' + (index + 1)]
                        delete values['goodsId' + (index + 1)]
                        delete values['couponUrl' + (index + 1)]
                        delete values['couponId' + (index + 1)]
                        delete values['platform' + (index + 1)]
                    })
                    // 新增的商品
                    for (let i = 0; i < values.keys.length; i++) {
                        arr.push({
                            id: this.state[`id${(i + 4)}`] ? this.state[`id${(i + 4)}`] : '',
                            goodsUrl: values['goodsUrl' + (i + 4)],
                            shareMsg: this.state[`editorContent${i + 4}`],
                            goodsId: values['goodsId' + (i + 4)],
                            couponUrl: values['couponUrl' + (i + 4)],
                            couponId: this.state[`couponId${i + 4}`],
                            platform:this.state[`platform${i + 4}`],
                        })
                        delete values['goodsUrl' + (i + 4)]
                        delete values['shareMsg' + (i + 4)]
                        delete values['goodsId' + (i + 4)]
                        delete values['couponUrl' + (i + 4)]
                        delete values['couponId' + (i + 4)]
                        delete values['platform' + (i + 4)]
                    }
                    if (+this.state.isShowImg === 1) {
                        values.mfProducts = arr
                    }
                    delete values.keys
                    if (bannerId && bannerId.id) {
                        values.id = bannerId.id
                    }
                    console.log(values)
                    addOrEditActivity(values).then((res) => {
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
    beforeUpload = (i, file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        let that = this;
        let width = this.state.width
        let height = this.state.height
        if (i === 2) {
            width = this.state.shareWidth
            height = this.state.shareHeight
        }
        return handleImgSize(r, file, width, height, res => {
            that.setState({
                data: res
            })
        })
    };
    handleChange = (i, fileList) => {
        this.setState({
            ['fileList' + i]: fileList.fileList
        })
    }
    // 自定义上传
    customRequest = (i, files) => {
        const { file } = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    img: i === 1 ? res.data : '',
                    goodsUrl: i === 2 ? res.data : '',
                    ['fileList' + i]: [{ uid: file.uid, url: res.data, status: 'done' }]
                })
                that.props.form.setFieldsValue({
                    img: that.props.form.getFieldsValue().img,
                    goodsUrl: that.props.form.getFieldsValue().goodsUrl
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
        console.log(data.mfProducts[i])
        const nextKeys = keys.concat([{
            key: id++,
            ['goodsUrl' + (i + 1)]: data.mfProducts[i].goodsUrl + '',
            ['goodsId' + (i + 1)]: data.mfProducts[i].goodsId + '',
            ['couponUrl' + (i + 1)]: data.mfProducts[i].couponUrl + '',
            ['platform' + (i + 1)]: data.mfProducts[i].platform+"",
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
    onBlur = (value,index) => {
        // console.log(value)
        // console.log(index)
        this.setState({
            ['onlyGoodsId' + index]: value,
        });
        // this.setState({
        //     onlyGoodsId1:value
        // })
        
    }
    onBlurUrl = (value,index) => {
        console.log(value)
        console.log(index)
       
        let params = {
            "couponUrl": value,
            "goodsId": this.state['onlyGoodsId' + index],
            "platform": 2
        }
        
            coupon(params).then(res => {
                if (res.success === false) {
                    openNotificationWithIcon('error', "该优惠券不存在")
                }else{
                    this.setState({
                        ['couponId' + index]: res.data.couponId,
                        // couponId1 : res.data.couponId
                    }) 
                    openNotificationWithIcon('success', '优惠券有效')
                }
            })
    }
    handleSelectPlatform = (val,index) => {
        // console.log(val)
        // console.log(index)
        this.setState({
            ['platform' + index]: val,
        })
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
    onBlur1 = (value) => {
        this.setState({
            onlyGoodsId1:value
        })
        
    }
    onBlurUrl1 = (value) => {
        console.log(11)
        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId1,
            "platform": this.state.platform1
        }
        
            coupon(params).then(res => {
                if (res.success === false) {
                    openNotificationWithIcon('error', "该优惠券不存在")
                }else{
                    this.setState({
                        couponId1 : res.data.couponId
                    }) 
                    openNotificationWithIcon('success', '优惠券有效')
                }
            })
    }
    onBlur2 = (value) => {
        this.setState({
            onlyGoodsId1:value
        })
        
    }
    onBlurUrl2 = (value) => {
        
        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId2,
            "platform": this.state.platform2
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
    onBlur3 = (value) => {
        this.setState({
            onlyGoodsId1:value
        })
        
    }
    onBlurUrl3 = (value) => {
        let params = {
            "couponUrl": value,
            "goodsId": this.state.onlyGoodsId3,
            "platform": this.state.platform3
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
    
    onEditorChange = (index, editorContent) => {
        this.setState({
            ['editorContent' + index]: draftToHtml(editorContent),
        });
    };

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
    regColor = (rule, value, callback) => {
        const colorReg = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/
        if (!colorReg.test(value) && value) {
            callback('请输入正确的色值代码')
        } else {
            callback()
        }
    }
    handleSelectType = val => {
        this.setState({
            isShowImg: val,
        })
    }
    getIsShowShare = e => {
        this.setState({
            isShare: e.target.value
        })
    }

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
        const { previewVisible, previewImage, fileList1, fileList2, loading, width, height, loadingFinish, isShowAddBtn, isShowImg, isShare } = this.state;
        const { editorContent1, editorState1, editorContent2, editorState2, editorContent3, editorState3, shareWidth, shareHeight } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );

        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });

        const keys = getFieldValue('keys');
        const formItems = keys.map((item, index) => (
            <FormItem key={item.key} {...formItemLayoutWithOutLabel}
                style={{ display: isShowAddBtn && +isShowImg === 1 || isShowImg === '' ? 'block' : 'none' }}
            >
                <Col span={6} style={{ marginRight: '15px' }}>
                    {getFieldDecorator(`goodsUrl${index + 4}`, {
                        initialValue: item[`goodsUrl${index + 4}`],
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
                        {getFieldDecorator(`goodsId${index + 4}`, {
                            initialValue: item[`goodsId${index + 4}`] ? item[`goodsId${index + 4}`] : '',
                            rules: [
                                {
                                    required: +isShowImg === 1 ? true : false,
                                    message: '请输入商品ID',
                                }
                            ],
                        })(
                            <Input onBlur={(e) => this.onBlur(e.target.defaultValue,index + 4)} placeholder="商品ID" />
                        )
                        }
                    </FormItem>
                </Col>
                <Col span={9} className="share-wrap">
                    <FormItem>
                        {getFieldDecorator(`shareMsg${index + 4}`, {
                            rules: [
                                {
                                    validator: this.compareToShareMsg.bind(this, this.state['editorContent' + (index + 4)]),
                                }
                            ],
                        })(
                            <Editor
                                editorState={this.state['editorState' + (index + 4)]}
                                initialContentState={this.state['editorContent' + (index + 4)]}
                                toolbarClassName="home-toolbar"
                                wrapperClassName="home-wrapper"
                                editorClassName="home-editor"
                                onEditorStateChange={this.onEditorStateChange.bind(this, (index + 4))}
                                toolbar={{
                                    options: ['blockType', 'fontSize', 'textAlign', 'emoji', 'remove', 'history'],
                                    history: { inDropdown: true },
                                    textAlign: { inDropdown: true },
                                    emoji: emojis(),

                                }}
                                onContentStateChange={this.onEditorChange.bind(this, (index + 4))}
                                placeholder="请输入要分享的文案"
                                spellCheck
                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                            />
                        )
                        }
                    </FormItem>
                </Col>
                <Col span={6} style={{ marginTop: '-125px' ,marginLeft:"285px" }}>
                    {getFieldDecorator(`couponUrl${index + 4}`, {
                         initialValue: item[`couponUrl${index + 4}`] ? item[`couponUrl${index + 4}`] : '',
                        // initialValue: item[`couponUrl${index + 4}`],
                        rules: [
                            {
                                required: false,
                                message: '优惠券链接',
                            }
                        ],
                    })(
                        <Input onBlur={(e) => this.onBlurUrl(e.target.defaultValue,index + 4)} placeholder="优惠券链接" />
                    )
                    }
                </Col>
                <Col span={6} style={{ marginTop: '-125px',marginLeft:"0px" }}>
                                {getFieldDecorator(`platform${index + 4}`, {
                                     initialValue: item[`platform${index + 4}`] ? item[`platform${index + 4}`] : '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" 
                                    onChange={(e) => this.handleSelectPlatform(e,index + 4)}
                                        // onChange={this.handleSelectType(index + 4)}
                                    >
                                        <Option value="2">淘宝</Option>
                                        <Option value="3">京东</Option>
                                        <Option value="7">拼多多</Option>
                                        <Option value="4">唯品会</Option>
                                    </Select>
                                )
                                }
                                </Col>
                {(index + 1) === keys.length ? (
                    <Col span={1} className="text-center">
                        <Icon
                            className="minus"
                            type="minus-circle-o"
                            onClick={() => this.remove(item.key)}
                        />
                    </Col>
                ) : null}
            </FormItem>
        ));
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
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入活动名称',
                                        },
                                        {
                                            max: 20,
                                            message: '最大输入长度为20个字符'
                                        }
                                    ],
                                })(
                                    <Input style={{ width: '33%' }} />
                                )
                                }
                            </FormItem>
                            <Form.Item label="背景色">
                                <div style={{ display: 'flex', lineHeight: '35px' }}>
                                    {getFieldDecorator('bgColor', {
                                        initialValue: '#ffe3e2',
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入背景颜色',
                                            },
                                            {
                                                validator: this.regColor.bind(this)
                                            }
                                        ],
                                    })(
                                        <Input style={{ width: '33%' }} />
                                    )
                                    }
                                    <span style={{
                                        width: '10px',
                                        height: '10px',
                                        margin: '8px 0 0 5px',
                                        background: this.props.form.getFieldsValue().bgColor
                                    }}
                                    />
                                </div>
                            </Form.Item>
                            <FormItem label="显示">
                                {getFieldDecorator('isShare', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择状态!',
                                        }
                                    ]
                                })(
                                    <RadioGroup onChange={this.getIsShowShare.bind(this)}>
                                        <Radio value={1}>显示</Radio>
                                        <Radio value={0}>不显示</Radio>
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem label="分享主标题" style={{ display: isShare ? 'block' : 'none' }}>
                                {getFieldDecorator('shareTitle', {
                                    rules: [
                                        {
                                            required: isShare,
                                            message: '请输入分享主标题!',
                                        },
                                        {
                                            max: 15,
                                            min: 1,
                                            message: '字符长度为1—15位'
                                        }
                                    ]
                                })(
                                    <Input style={{ width: '33%' }} />
                                )
                                }
                            </FormItem>
                            <FormItem label="分享副标题" style={{ display: isShare ? 'block' : 'none' }}>
                                {getFieldDecorator('shareSubTitle', {
                                    rules: [
                                        {
                                            required: isShare,
                                            message: '请输入分享副标题!',
                                        },
                                        {
                                            max: 30,
                                            min: 1,
                                            message: '字符长度为1—30位'
                                        }
                                    ]
                                })(
                                    <Input style={{ width: '33%' }} />
                                )
                                }
                            </FormItem>
                            <FormItem label="分享图" style={{ display: isShare ? 'block' : 'none' }}>
                                {getFieldDecorator('shareImg', {
                                    rules: [
                                        {
                                            required: isShare,
                                            message: '请上传分享图封面',
                                        }
                                    ],
                                })(
                                    <Upload
                                        accept="image/*"
                                        listType="picture-card"
                                        fileList={fileList2}
                                        customRequest={this.customRequest.bind(this, 2)}
                                        beforeUpload={this.beforeUpload.bind(this, 2)}
                                        onPreview={this.handlePreview}
                                        handleUpload={this.handleUpload}
                                        onChange={this.handleChange.bind(this, 2)}
                                    >
                                        {fileList2.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )
                                }
                                <p>建议尺寸{shareWidth}*{shareHeight}格式为JPG、PNG图片</p>
                            </FormItem>
                            <FormItem label="活动类型">
                                {getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择活动类型',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择活动类型" style={{ width: '33%' }}
                                        onChange={this.handleSelectType}
                                    >
                                        <Option value="0">图片模式</Option>
                                        <Option value="1">商品模式</Option>
                                    </Select>
                                )
                                }
                            </FormItem>
                            <FormItem label="活动图片" style={{ display: +isShowImg === 1 ? 'none' : 'block' }}>
                                {getFieldDecorator('img', {
                                    rules: [
                                        {
                                            required: +isShowImg === 0,
                                            message: '活动图片不能为空'
                                        }
                                    ]
                                })(
                                    <Upload
                                        accept="image/*"
                                        listType="picture-card"
                                        fileList={fileList1}
                                        customRequest={this.customRequest.bind(this, 1)}
                                        beforeUpload={this.beforeUpload.bind(this, 1)}
                                        onPreview={this.handlePreview}
                                        handleUpload={this.handleUpload}
                                        onChange={this.handleChange.bind(this, 1)}
                                    >
                                        {fileList1.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                                <p>建议尺寸{width}*{height}格式为JPG、PNG图片</p>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
                            </FormItem>
                            <FormItem label="状态">
                                {getFieldDecorator('isUse', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择状态!',
                                        }
                                    ]
                                })(
                                    <RadioGroup>
                                        <Radio value={1}>启用</Radio>
                                        <Radio value={0}>禁用</Radio>
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem label="商品信息"
                                style={{ display: +isShowImg === 1 || isShowImg === '' ? 'block' : 'none' }}
                            >
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
                                        {getFieldDecorator('goodsId1', {
                                            rules: [
                                                {
                                                    required: +isShowImg === 1 ? true : false,
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
                                <Col span={6} style={{ marginTop: '-125px',marginLeft:'285px' }}>
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
                                  <Col span={6} style={{ marginTop: '-125px',marginLeft:'0px' }}>
                                {getFieldDecorator('platform1', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择平台',
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
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}
                                style={{ display: +isShowImg === 1 || isShowImg === '' ? 'block' : 'none' }}
                            >
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
                                        {getFieldDecorator('goodsId2', {
                                            rules: [
                                                {
                                                    required: +isShowImg === 1 ? true : false,
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
                                <Col span={6} style={{ marginTop: '-125px',marginLeft:'285px' }}>
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
                                <Col span={6} style={{ marginTop: '-125px',marginLeft:'0px' }}>
                                {getFieldDecorator('platform2', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择平台',
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
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            <FormItem {...formItemLayoutWithOutLabel}
                                style={{ display: +isShowImg === 1 || isShowImg === '' ? 'block' : 'none' }}
                            >
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
                                        {getFieldDecorator('goodsId3', {
                                            rules: [
                                                {
                                                    required: +isShowImg === 1 ? true : false,
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
                                <Col span={6} style={{ marginTop: '-125px',marginLeft:'285px' }}>
                                    {getFieldDecorator('couponUrl3', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input onBlur={(e) => this.onBlurUrl3(e.target.defaultValue)} placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginTop: '-125px',marginLeft:'0px' }}>
                                {getFieldDecorator('platform3', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择平台',
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
                                    </Select>
                                )
                                }
                                </Col>
                            </FormItem>
                            {formItems}
                            <FormItem {...formItemLayoutWithOutLabel}
                                style={{ display: isShowAddBtn && +isShowImg === 1 || isShowImg === '' ? 'block' : 'none' }}
                            >
                                <Button type="dashed" onClick={this.add} style={{ width: '33%' }}>
                                    <Icon type="plus" /> 新增选项
                                </Button>
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
