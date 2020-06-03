/*
 * @Author: songyingchun
 * @Date: 2020-03-21 09:45:19
 * @Description: 新增商品推荐
 */
import React, { Component } from 'react';
import { Card, Form, Input, Row, Col, Radio, Button, DatePicker, Select, Upload, Icon, PageHeader, Modal } from 'antd';
import { saveOrEditShreItem, findShareDetail } from '../../../api/share/shareList'
import { openNotificationWithIcon, clickCancel, getContent, handleImgSize } from "../../../utils";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { emojis } from "../common/Emojis";
import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { uploadImg } from "../../../api/public";
import { GoodInfo } from "../common";
import moment from "moment";
import { verifyFile } from "../../../utils/verify";
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,
    border: '1px #f1f1f1 solid',
    cursor: 'point',
    marginBottom: grid,
    position: 'relative',

    ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
    display: 'flex',
    padding: 0,
    overflow: 'auto',
});

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option

class AddRecommendGoods extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增推荐商品',
            loading: false,
            editorContent: '',
            contentState: '',
            localStorageNickName: "",
            localStorageNickImg: "",
            editorState: '',
            fileList: [],
            nickHeader: [{ uid: new Date().getTime() + Math.random(), url: 'https://cloud.hongrz.com/img/nickheader.png', status: 'done' }],
            tmpFile: [],
            test: [1, 2, 3, 4],
            activeDrags: 0,
            sendTime: "",
            status: 2,
            sendStatus: 0,
            width: 72,
            height: 72
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }



    // 获取推荐商品信息
    componentDidMount () {
        var nicknameImg = localStorage.getItem('nicknameImgRe')
        let avatarUrlImg = nicknameImg ? nicknameImg : 'https://cloud.hongrz.com/img/nickheader.png'
        this.setState({
            nickHeader: [{ uid: new Date().getTime() + Math.random(), url: avatarUrlImg, status: 'done' }]
        })
        // 默认小编头像
        this.props.form.setFieldsValue({
            avatarUrl: { file: { uid: new Date().getTime() + Math.random(), type: "image/png" }, fileList: [{ uid: new Date().getTime() + Math.random(), url: 'https://cloud.hongrz.com/img/nickheader.png', status: 'done' }] },
        })
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = { id: this.props.location.query.id, title: this.props.location.query.title }
            sessionStorage.setItem('Recommend', JSON.stringify(params))
            var storageNickname = localStorage.getItem('nicknameRe')
            this.setState({
                localStorageNickName: storageNickname ? storageNickname : "红人装小编"
            })
            if (params.id !== undefined) {
                this.setState({
                    title: params.title + '推荐商品'
                })
                this.getAdvertInfo(params.id)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('Recommend'))
            const storageNickname = localStorage.getItem('nicknameRe')
            this.setState({
                localStorageNickName: storageNickname ? storageNickname : "红人装小编"
            })
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.title + '推荐商品'
                })
                this.getAdvertInfo(params.id)
            }
        }
    }

    componentWillUnmount () {
        sessionStorage.removeItem('Recommend')
    }
    onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const fileList = reorder(
            this.state.fileList,
            result.source.index,
            result.destination.index
        );
        this.setState({
            fileList,
        });
    };

    onEditorChange = (editorContent) => {
        this.setState({
            editorContent,
        });
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };
    // 获取推荐商品信息
    getAdvertInfo (id) {
        const params = { id: id }
        findShareDetail(params).then((res) => {
            if (res && res.success) {
                const data = res.data
                let result = Object.assign({}, this.state.query, { platform: data.platform, productId: data.productId })
                let imgs = []
                if (data.activityBurstingMustImgList && data.activityBurstingMustImgList.length > 0) {
                    data.activityBurstingMustImgList.map(item => {
                        imgs.push({ uid: new Date().getTime() + Math.random(), url: item.url, status: 'done' })
                    })
                }
                this.setState({
                    query: result,
                    status: data.sendStatus,
                    sendTime: data.sendTime,
                    fileList: imgs,
                    tmpFile: imgs,
                    sendStatus: data.sendStatus,
                    nickHeader: [{ uid: new Date().getTime() + Math.random(), url: data.avatarUrl ? data.avatarUrl : 'https://cloud.hongrz.com/img/nickheader.png', status: 'done' }]
                })
                this.props.form.setFieldsValue({
                    platform: data.platform + '',
                    productId: data.productId,
                    content: data.content,
                    status: data.sendStatus,
                    nickName: data.nickName ? data.nickName : '红人装小编',
                    virtualShareNum: data.virtualShareNum ? data.virtualShareNum : 3500,
                    avatarUrl: { file: { uid: new Date().getTime() + Math.random(), type: "image/png" }, fileList: [{ uid: new Date().getTime() + Math.random(), url: data.avatarUrl ? data.avatarUrl : 'https://cloud.hongrz.com/img/nickheader.png', status: 'done' }] },
                })
                // 回显
                const contentBlock = htmlToDraft(data.content);
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState });
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
                    values.burstingMustType = 0 // 0 :爆款推荐 , 1 : 必发素材
                    if (this.state.editorContent) {
                        values.content = draftToHtml(this.state.editorContent).replace(/&nbsp;/ig, "").trim()
                    } else {
                        values.content = values.content.replace(/&nbsp;/ig, "").trim()
                    }
                    delete values.status
                    // 排序
                    if (this.state.fileList.length > 0) {
                        let result = []
                        this.state.fileList.map((item, index) => {
                            result.push({ activityBurstingId: "", id: "", sequence: index, url: item.url })
                        })
                        values.activityBurstingMustImgList = result
                    }
                    // 小编头像
                    values.avatarUrl = this.state.nickHeader.length > 0 ? this.state.nickHeader[0].url : ""
                    values.firstImg = this.state.fileList.length > 0 ? this.state.fileList[0].url : ""
                    values.id = ''
                    const bannerId = JSON.parse(sessionStorage.getItem('Recommend'))
                    let text = '新增'


                    if (values.nickName !== "红人装小编") {

                        localStorage.setItem('nicknameRe', values.nickName)
                    }

                    if (bannerId && bannerId.id) {
                        values.id = bannerId.id
                        values.sendTime = new Date(this.state.sendTime).getTime()
                        text = '编辑'
                    } else {
                        this.state.status === 1 ? values.sendTime = "" : values.sendTime = new Date(this.state.sendTime).getTime() // 及时发送是传递时间为空，以服务器时间为准
                    }
                    let params = Object.assign({}, this.state.storeInfo, values)
                    delete params.imgs
                    saveOrEditShreItem(params).then((res) => {
                        if (res.success) {
                            openNotificationWithIcon('success', text + '推荐商品成功！')
                            clickCancel()
                        } else {
                            this.setState({ loading: false }, () => {
                                openNotificationWithIcon('error', text + '推荐商品失败！')
                            })
                        }
                    })
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };
    disabledDate (current) {
        return current < moment().subtract(1, 'day')
    }
    onChangeTime = (value, dateString) => {
        this.setState({
            sendTime: dateString
        })
    }
    getSendTime (date) {
        this.setState({
            sendTime: date
        })
    }

    // 发送时间
    radioChange = e => {
        this.setState({
            status: e.target.value
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
    // 是否禁用
    isDisabled () {
        return this.state.sendStatus === 1
    }
    beforeUpload = (params, file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        let that = this;
        if (params === 1) {
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
    handleChange = (parmas, { fileList }) => {
        if (parmas === 'nickHeader') {
            this.setState({ nickHeader: fileList })
        } else {
            this.setState({ fileList })
        }
    }
    handleRemove = (parmas, file) => {
        if (parmas !== 'nickHeader') {
            this.state.tmpFile.splice(this.state.tmpFile.length - 1);
            this.setState({
                tmpFile: this.state.tmpFile
            });
        } else {
            this.props.form.setFieldsValue({
                avatarUrl: ""
            })
            this.setState({
                nickHeader: []
            })
        }

    }
    // 自定义上传
    customRequest = (params, files) => {
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    [params]: params === 'nickHeader' ? [{ uid: new Date().getTime(), url: res.data, status: 'done' }] : [...this.state.tmpFile, { uid: new Date().getTime(), url: res.data, status: 'done' }]
                }, () => {
                    that.setState({
                        tmpFile: params === 'nickHeader' ? [] : [...this.state.tmpFile, { uid: new Date().getTime(), url: res.data, status: 'done' }]
                    })
                })
                if (params == "nickHeader") {
                    that.props.form.setFieldsValue({
                        avatarUrl: that.props.form.getFieldsValue().avatarUrl
                    })
                    this.setState({
                        localStorageNickImg: res.data
                    })
                    localStorage.setItem('nicknameImgRe', res.data)

                }
            }
        })
    }

    getStoreInfo (val) {
        this.setState({
            storeInfo: val
        })
        const bannerId = JSON.parse(sessionStorage.getItem('Recommend'))
        if (bannerId && bannerId.id) return
        if (val.hasOwnProperty('imgs') && val.imgs.length > 0) {
            let result = []
            val.imgs.map(item => {
                result.push({ uid: new Date().getTime() + Math.random(), url: item, status: 'done' })
            })
            this.setState({
                tmpFile: result,
                fileList: result
            })
        }
    }

    handleSelectPage (value) {
        let data = Object.assign({}, this.state.query, { platform: value })
        this.setState({
            query: data
        })
    }

    getGoodId (event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { productId: value })
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, { productId: "" })
            this.setState({
                query: data
            })
        }
    }

    removeFile (index) {
        this.state.fileList.splice(index, 1)

        const result = this.state.fileList
        this.setState({
            fileList: result,
            tmpFile: result
        })
    }
    compareToContent = (rule, value, callback) => {
        let result
        if (typeof value === 'string' && value.indexOf("<") !== -1) {
            result = getContent(value)
        } else {
            const rsp = draftToHtml(value)
            result = getContent(rsp)
        }
        if (result.length <= 1) {
            callback('')
        } else {
            callback()
        }
    };
    // 获取3000~50000的随机整数
    random (min, max) {
        this.props.form.setFieldsValue({
            virtualShareNum: Math.floor(Math.random() * (max - min)) + min
        })
    };
    // 判断输入位正整数
    compareToNum = (rule, value, callback) => {
        if (value) {
            const reg = /^[1-9]\d*$/;
            reg.test(value) ? callback() : callback("请输入正整数")
        } else {
            callback("")
        }
    }
    // 判断图片上传
    normFile = (rule, value, callback) => {
        const result = verifyFile(rule, value)
        if (result) {
            callback(result)
        } else {
            if (this.state.nickHeader.length > 0 && this.state.nickHeader[0].status === 'uploading') {
                callback('图片正在上传，请稍后')
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
                sm: { span: 18 },
            },
        };

        const { getFieldDecorator } = this.props.form;
        const loading = this.state.loading
        const { editorContent, editorState, fileList, status, nickHeader, previewVisible, previewImage } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );

        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="商品推荐" subTitle={this.state.title} />

                <div className="gutter-box">
                    <Card bordered={false}>
                        <Row>
                            <Col span={14}>
                                <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                                    <FormItem label="商品平台">
                                        {getFieldDecorator('platform', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择推荐商品位置!',
                                                },
                                            ],
                                        })(
                                            <Select placeholder="请选择商品平台" onChange={this.handleSelectPage.bind(this)}
                                                style={{ width: '263px' }} disabled={this.isDisabled()}
                                            >
                                                <Option value="2">淘宝</Option>
                                                <Option value="3">京东</Option>
                                                <Option value="7">拼多多</Option>
                                                <Option value="4">唯品会</Option>
                                            </Select>
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="第三方平台商品ID">
                                        {getFieldDecorator('productId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入第三方平台商品ID',
                                                },
                                            ],
                                        })(
                                            <Input style={{ width: '263px' }} placeholder="第三方平台商品ID"
                                                onBlur={this.getGoodId.bind(this)} disabled={this.isDisabled()}
                                            />
                                        )
                                        }
                                    </FormItem>
                                    <FormItem label="发送时间">
                                        {getFieldDecorator('status', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择发送时间',
                                                }
                                            ],
                                        })(
                                            <RadioGroup onChange={this.radioChange.bind(this)} disabled={this.isDisabled()}>
                                                <Radio defaultChecked value={1}>即时发送</Radio>
                                                <Radio value={2}>定时发送</Radio>
                                            </RadioGroup>
                                        )}
                                        <DatePicker disabled={this.isDisabled()} style={{ display: status === 2 ? 'inline-block' : 'none' }}
                                            showTime
                                            disabledDate={this.disabledDate}
                                            onChange={this.onChangeTime}
                                            onOk={this.getSendTime.bind(this)}
                                            value={this.state.sendTime ? moment(this.state.sendTime, 'YYYY-MM-DD HH:mm:ss') : null}
                                            format={'YYYY-MM-DD HH:mm:ss'}
                                        />
                                    </FormItem>
                                    <FormItem label="分享文案">
                                        {getFieldDecorator('content', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入分享文案!',
                                                },
                                                {
                                                    validator: this.compareToContent,
                                                }
                                            ],
                                        })(
                                            <Editor
                                                editorState={editorState}
                                                initialContentState={editorContent}
                                                toolbarClassName="home-toolbar"
                                                wrapperClassName="home-wrapper"
                                                editorClassName="home-editor"
                                                onEditorStateChange={this.onEditorStateChange}
                                                toolbar={{
                                                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'remove', 'history'],
                                                    history: { inDropdown: true },
                                                    inline: { inDropdown: false },
                                                    list: { inDropdown: true },
                                                    textAlign: { inDropdown: true },
                                                    emoji: emojis()
                                                }}
                                                onContentStateChange={this.onEditorChange}
                                                placeholder="请输入要分享的文案"
                                                spellCheck
                                                localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem label="商品主图">
                                        <DragDropContext onDragEnd={this.onDragEnd}>
                                            <Droppable droppableId="droppable" direction="horizontal">
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        style={getListStyle(snapshot.isDraggingOver)}
                                                        {...provided.droppableProps}
                                                    >
                                                        {this.state.fileList.map((item, index) => (
                                                            <Draggable key={index} draggableId={item.uid} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={getItemStyle(
                                                                            snapshot.isDragging,
                                                                            provided.draggableProps.style
                                                                        )}
                                                                    >
                                                                        <div style={{
                                                                            position: 'absolute',
                                                                            right: '5px',
                                                                            top: '-10px',
                                                                            cursor: 'default'
                                                                        }} onClick={this.removeFile.bind(this, index)}
                                                                        >&times;</div>
                                                                        <img style={{
                                                                            width: '80px',
                                                                            height: '80px',
                                                                            objectFit: 'contain'
                                                                        }} src={item.url} alt=""
                                                                        />
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>

                                        <div className="clearfix">
                                            <Upload
                                                accept="image/*"
                                                listType="picture-card"
                                                showUploadList={false}
                                                fileList={fileList}
                                                customRequest={this.customRequest.bind(this, 'fileList')}
                                                beforeUpload={this.beforeUpload.bind(this, 1)}
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChange.bind(this, 'fileList')}
                                                onRemove={this.handleRemove.bind(this, 'fileList')}
                                            >
                                                {fileList.length >= 9 ? null : uploadButton}
                                            </Upload>
                                        </div>
                                    </FormItem>
                                    <FormItem label="虚拟分享次数">
                                        {getFieldDecorator('virtualShareNum',
                                            {
                                                initialValue: 3500,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请重新生成虚拟分享次数',
                                                    },
                                                    {
                                                        validator: this.compareToNum
                                                    }
                                                ],
                                            })(
                                                <Input style={{ width: '263px' }} placeholder="虚拟分享次数" />
                                            )}
                                        &nbsp; &nbsp;<span style={{ color: '#5F9ACE', cursor: 'pointer' }} onClick={this.random.bind(this, 3000, 50000)}>重新生成</span>
                                    </FormItem>
                                    <FormItem label="小编头像">
                                        {getFieldDecorator('avatarUrl', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择小编头像!',
                                                },
                                                {
                                                    validator: this.normFile
                                                }
                                            ]
                                        })(
                                            <Upload
                                                accept="image/*"
                                                listType="picture-card"
                                                fileList={nickHeader}
                                                customRequest={this.customRequest.bind(this, 'nickHeader')}
                                                beforeUpload={this.beforeUpload.bind(this, 2)}
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChange.bind(this, 'nickHeader')}
                                                onRemove={this.handleRemove.bind(this, 'nickHeader')}
                                            >
                                                {nickHeader.length >= 1 ? null : uploadButton}
                                            </Upload>
                                        )}
                                        <span>要求：图片尺寸为{this.state.width}px * {this.state.height}px；</span>
                                        <Modal visible={previewVisible} footer={null}
                                            onCancel={this.handleCancel.bind(this, 0)} centered
                                        >
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </FormItem>
                                    <FormItem label="小编昵称">
                                        {getFieldDecorator('nickName', {
                                            initialValue: this.state.localStorageNickName,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入小编昵称'
                                                }, {
                                                    min: 1,
                                                    max: 15,
                                                    message: '字符长度为1~15位'
                                                }
                                            ],
                                        })(
                                            <Input style={{ width: '263px' }} />
                                        )}
                                    </FormItem>
                                    <Row>
                                        <Col span={24} style={{ textAlign: 'center' }}>
                                            <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
                                            <Button type="default" onClick={clickCancel}>取消</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                            <Col span={10}>
                                <GoodInfo params={this.state.query} getStoreInfo={this.getStoreInfo.bind(this)} />
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddRecommendGoods);

export default BasicForm;
