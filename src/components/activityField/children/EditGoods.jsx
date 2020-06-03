import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Modal,
    PageHeader,
    Select,
    Card,
    Radio,
    Skeleton,
} from 'antd/lib/index';
import { clickCancel, handleImgSize, openNotificationWithIcon } from "../../../utils";
import { uploadImg } from "../../../api/public";
import { Editor } from "react-draft-wysiwyg";
import { emojis } from "../../share/common/Emojis";
import { getMFPDetail, updateMonographicProduct,coupon } from "../../../api/featured/starsAndSea";
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
            editorState: '',
            editorContent: '',
            editorContent1: '',
            editorState1: '',
            editorContent2: '',
            editorState2: '',
            editorContent3: '',
            editorState3: '',
            isShowAddBtn: true,
            Goodtitle: "",
            name: "",
            featuredId: "",
            imagesList: [],
            value: 1,
            id: "",
            goodsId1: "",
            couponUrl:"",
            goodsUrl:"",
            platform:""
        };
    }

    // 获取活动信息
    componentDidMount () {
        let params;

        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = {
                id: this.props.location.query.id,
                title: this.props.location.query.title,
                name: this.props.location.query.name,
                Goodtitle: this.props.location.query.Goodtitle,
                featuredId: this.props.location.query.featuredId,
                goodsId1: this.props.location.query.goodsId,
                platform: this.props.location.query.platform,
            }


            console.log(params)
            sessionStorage.setItem('AddGoods', JSON.stringify(params))
            this.setState({
                Goodtitle: params.Goodtitle,
                name: params.name,
                featuredId: params.featuredId,
                title: params.title + '商品',
                goodsId1: params.goodsId1,
                platform:params.platform
            })


            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '商品',
                    // loadingFinish: true
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('AddGoods'))
            if (!params) {
                params = {
                    id: this.props.location.query.id,
                    title: this.props.location.query.title,
                    name: this.props.location.query.name,
                    Goodtitle: this.props.location.query.Goodtitle,
                    featuredId: this.props.location.query.featuredId,
                    goodsId1: this.props.location.query.goodsId,
                    platform: this.props.location.query.platform,
                }
                this.setState({
                    Goodtitle: params.Goodtitle,
                    name: params.name,
                    featuredId: params.featuredId,
                    title: params.title + '商品',
                    goodsId1: params.goodsId1,
                    platform:params.platform
                })
                sessionStorage.setItem('AddGoods', JSON.stringify(params))
            } else {
                this.setState({
                    Goodtitle: params.Goodtitle,
                    name: params.name,
                    featuredId: params.featuredId,
                    title: params.title + '商品',
                    goodsId1: params.goodsId1,
                    platform:params.platform
                })
                sessionStorage.setItem('AddGoods', JSON.stringify(params))
            }
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '商品',
                    // loadingFinish: true
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    // componentWillUnmount() {
    //     sessionStorage.removeItem('AddGoods')
    // }

    // 获取活动信息
    getAdvertInfo (id) {
        this.setState({
            id: id
        })
        const params = { id: id + '' }
        getMFPDetail(params).then((res) => {
            console.log(res)
            if (res && res.success) {
                const data = res.data
                this.setState({
                    imagesList: data.imgs,
                    loadingFinish: false,
                    value: data.imgs[0],
                    editorContent1: data.shareMsg,
                    goodsUrl:data.goodsUrl,
                    couponUrl:data.couponUrl,
                    couponId:data.couponId,
                    platform: data.platform,

                })
                console.log(this.state.imagesList)

                // 图片处理
                this.props.form.setFieldsValue({
                    goodsUrl: data.goodsUrl + '',
                    gsSubTitle: data.gsSubTitle + '',
                    goodsId1: this.state.goodsId1 + '',
                    shareMsg1: data.shareMsg,
                    couponUrl1:data.couponUrl,
                    platform: data.platform+ '',


                })
                // 回 显
                const contentBlock = htmlToDraft(data.shareMsg);
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                // this.setState({editorState});
                this.setState({ 'editorState1': editorState, })
                // if (data.mfProducts.length > 0) {
                //     const defaultGoods = [1, 2, 3]
                //     defaultGoods.forEach((item, index) => {
                //         this.props.form.setFieldsValue({
                //             ['goodsUrl' + item]: data.mfProducts[index].goodsUrl + '',
                //             ['goodsId' + item]: data.mfProducts[index].goodsId + ''
                //         })
                //         // 回显
                //         const contentBlock = htmlToDraft(data.mfProducts[index].shareMsg);
                //         const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                //         const editorState = EditorState.createWithContent(contentState);
                //         this.setState({
                //             ['editorState' + item]: editorState,
                //             ['editorContent' + item]: data.mfProducts[index].shareMsg,
                //             ['id' + item]: data.mfProducts[index].id,
                //         })
                //     })
                //     if (data.mfProducts.length > 3) {
                //         for (let i = 3; i < data.mfProducts.length; i++) {
                //             this.props.form.setFieldsValue({
                //                 ['goodsId' + (i + 1)]: data.mfProducts[i].goodsId
                //             })
                //             this.initData(i, data)
                //         }
                //     }
                //     if (data.mfProducts.length >= 20) {
                //         this.setState({
                //             isShowAddBtn: false
                //         })
                //     }
                // }
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
                // console.log(this.state.value)
                this.setState({ loading: true }, () => {

                    let arr = {
                        platform: this.state.platform,
                        featuredId: this.state.featuredId,
                        gsSubTitle: values.gsSubTitle ? values.gsSubTitle : '',
                        goodsUrl: this.state.goodsUrl,
                        shareMsg: this.state.editorContent1,
                        goodsId: values.goodsId1,
                        id: this.state.id,
                        couponId:this.state.couponId2 ? this.state.couponId2 :this.state.couponId,
                        couponUrl:this.state.couponUrl,
                        gsUrl:this.state.value
                    }


                    delete values.keys
                    // values.activityMFPItemRequsets = arr

                    delete values.goodsId1
                    delete values.goodsUrl1
                    delete values.goodsUrl
                    delete values.gsSubTitle
                    delete values.shareMsg1
                    console.log(arr)
                    updateMonographicProduct(arr).then((res) => {
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
    handleSelectType = val => {
        this.setState({
            platform: val,
        })
    }
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

    onBlurUrl2 = (value) => {
        this.setState({
            couponUrl:value
        })
        let params = {}
        params = JSON.parse(sessionStorage.getItem('AddGoods'))
        if (!params) {

            params = {
                "couponUrl": value,
                "goodsId": this.props.location.query.goodsId,
                "platform": this.props.location.query.platform,
            }
            
        } else {
            params = {
                "couponUrl": value,
                "goodsId": params.goodsId1,
                "platform": params.platform
            }
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

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

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
        const { loading, loadingFinish } = this.state;
        const { editorContent1, editorState1 } = this.state;
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
                                <Col span={10} style={{ marginRight: '55px' }}>
                                    {getFieldDecorator('goodsUrl', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入商品链接',
                                            }
                                        ],
                                    })(
                                        <Input disabled placeholder="商品链接" />
                                    )
                                    }
                                </Col>
                                <Col span={10} style={{ marginRight: '55px' }}>
                                    <FormItem>
                                        {getFieldDecorator('gsSubTitle', {
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
                                                    required: false,
                                                    message: '请输入商品ID',
                                                }
                                            ],
                                        })(
                                            <Input placeholder="商品ID" />
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
                                <Col span={6} style={{ marginLeft: '15px',marginTop:"-10px"  }}>
                                    {getFieldDecorator('couponUrl1', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入优惠券链接',
                                            }
                                        ],
                                    })(
                                        <Input  onBlur={(e) => this.onBlurUrl2(e.target.defaultValue)}  placeholder="优惠券链接" />
                                    )
                                    }
                                </Col>
                                <Col span={6} style={{ marginLeft: '15px' }}>
                                {getFieldDecorator('platform', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择平台',
                                        }
                                    ],
                                })(
                                    <Select placeholder="请选择平台" style={{ width: '100%',marginTop:"10px" }}
                                        onChange={this.handleSelectType}
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
                            <FormItem label="活动图片">
                                <Radio.Group onChange={this.onChange} value={this.state.value}>
                                    {this.state.imagesList.map((item, index) => (
                                        <span key={index}>
                                            <Radio key={index} style={{ position: "relative", top: "0%", left: "0%" }} value={this.state.imagesList[index]}>
                                                <img alt="example" key={index} style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    margin: "0 10px",
                                                    objectFit: 'contain'
                                                }} src={this.state.imagesList[index]}
                                                />
                                            </Radio>
                                        </span>
                                    ))}
                                </Radio.Group>
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
