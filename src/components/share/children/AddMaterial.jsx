/*
 * @Author: songyingchun
 * @Date: 2020-03-21 09:45:19
 * @Description: 必发素材
 */
import React from 'react';
import { Card, Form, Button, Icon, Input, Row, Col, Radio, DatePicker, Upload, PageHeader, Modal, Select } from 'antd';
import { verifyTitle } from "../../../utils/verify";
import { saveOrEditShreItem, findShareDetail } from '../../../api/share/shareList';
import { Editor } from 'react-draft-wysiwyg';
import { openNotificationWithIcon, format, clickCancel, getContent, handleImgSize, checkVideoWH } from '../../../utils/index';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { emojis } from "../common/Emojis";
import { uploadImg, uploadVideo } from "../../../api/public";
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { getCollectTable } from "../../../utils/commodity";
import moment from "moment";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { verifyFile } from "../../../utils/verify";
import ReactDOM from 'react-dom';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

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
    cursor: 'move',
    marginBottom: grid,
    position: 'relative',

    ...draggableStyle,
});
const getListStyle = isDraggingOver => ({
    display: 'flex',
    overflow: 'auto',
});

class AddMaterials extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 72,
            height: 72,
            OSSData: {},
            visible: false,
            tableData: [],
            loading: false,
            flag: false,
            localStorageNickName: "",
            localStorageNickImg: "",
            videoUrl: "",
            editorContent: '',
            shareVideo: [],
            videoFlag: false,
            nickHeader: [{ uid: new Date().getTime() + Math.random(), url: 'https://cloud.hongrz.com/img/nickheader.png', status: 'done' }],
            tmpFile: [],
            total: 0,
            value: '',
            sendTime: "",
            sendStatus: 2,
            typeType: 0,
            mode: 'time',
            videoName: "",
            title: '新增素材',
            editorState: '',
            dataLength: 0, // 获取当前页面有多少条数据
            sendData: {
                activityBurstingMustImgList: [
                    {
                        activityBurstingId: "",
                        id: "",
                        sequence: 0,
                        url: ""
                    }
                ],
                burstingMustType: 1,
                content: "",
                createTime: "",
                firstImg: "",
                createBy: "",
                id: "",
                platform: 0,
                sendStatus: '',
                updateBy: '',
                productId: "",
                productName: "",
                sendTime: "",
                updateTime: ""
            },
            selectedRowKeys: [],
            fileList: [],
            collect: {
                audit: 0,
                notPassed: 0,
                settlement: 0,
                upperShelf: 0
            }
        }
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount () {

        this.initCollectInfo()
        this.getMaterialInfo()
    }

    componentWillUnmount () {
        sessionStorage.removeItem('Material')
    }
    // 获取必发素材信息
    getMaterialInfo () {
        var nicknameImg = localStorage.getItem('nicknameImg')
        let avatarUrlImg = nicknameImg ? nicknameImg : 'https://cloud.hongrz.com/img/nickheader.png'
        // this.setState({
        //     localStorageNickImg : nicknameImg ? nicknameImg : 'https://cloud.hongrz.com/img/nickheader.png'
        // })
        this.setState({
            nickHeader: [{ uid: new Date().getTime() + Math.random(), url: avatarUrlImg, status: 'done' }]
        })
        this.props.form.setFieldsValue({
            avatarUrl: { file: { uid: new Date().getTime() + Math.random(), type: "image/png" }, fileList: [{ uid: new Date().getTime() + Math.random(), url: avatarUrlImg, status: 'done' }] },
        })
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) { //第一次进
            params = { id: this.props.location.query.id, item: this.props.location.query.title }
            sessionStorage.setItem('Material', JSON.stringify(params))
            var storageNickname = localStorage.getItem('nickname')
            this.setState({
                localStorageNickName: storageNickname ? storageNickname : "红人装小编"
            })
            if (params.id !== undefined) {
                this.setState({
                    title: params.item + '素材'
                })
                this.getMaterial(params.id)
            }
        } else { //刷新页面
            params = JSON.parse(sessionStorage.getItem('Material'))
            const storageNickname = localStorage.getItem('nickname')
            this.setState({
                localStorageNickName: storageNickname ? storageNickname : "红人装小编"
            })
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.item + '素材'
                })
                this.getMaterial(params.id)
            }
        }
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
    //获取必发素材具体信息

    getMaterial (id) {
        const params = { id: id }
        findShareDetail(params).then((res) => {
            if (res && res.success) {
                const data = res.data;
                this.props.form.setFieldsValue({
                    content: data.content,
                })
                this.setState({
                    value: data.sendTime ? 2 : 1,
                    visible: data.sendTime ? true : false,
                    sendTime: data.sendTime,
                    sendStatus: data.sendStatus,
                    tabType: data.tabType,
                    nickHeader: [{ uid: new Date().getTime() + Math.random(), url: data.avatarUrl ? data.avatarUrl : 'https://cloud.hongrz.com/img/nickheader.png', status: 'done' }]
                })
                if (data.activityBurstingMustImgList.length > 0) {

                    let result = []
                    data.activityBurstingMustImgList.map((item, index) => {
                        result.push({ uid: new Date().getTime() + Math.random(), url: item.url, status: 'done' })
                    })
                    this.setState({
                        fileList: result,
                        tmpFile: result
                    })
                }

                const tabType_default = [
                    "全部",
                    "早安签到",
                    "公司实力",
                    "红人说",
                    "红人公益",
                    "热门活动"
                ]

                this.props.form.setFieldsValue({
                    platform: data.platform + '',
                    productId: data.productId,
                    content: data.content,
                    status: data.sendStatus,
                    tabType: tabType_default[data.tabType],
                    nickName: data.nickName ? data.nickName : "红人装小编",
                    virtualShareNum: data.virtualShareNum ? data.virtualShareNum : 3500,
                    avatarUrl: { file: { uid: new Date().getTime() + Math.random(), type: "image/png" }, fileList: [{ uid: new Date().getTime() + Math.random(), url: data.avatarUrl ? data.avatarUrl : 'https://cloud.hongrz.com/img/nickheader.png', status: 'done' }] },
                })

                if (data.firstFrameImg) {

                    this.setState({
                        shareVideo: [{ uid: new Date().getTime(), url: data.firstFrameImg, status: 'done', }],
                        videoFlag: true,
                        flag: data.aspectRatio,
                        videoUrl: data.videoUrl
                    })


                }

                //回显
                const contentBlock = htmlToDraft(data.content);
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.setState({ editorState });
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }


    //提交数据
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, value) => {
            if (!err) {
                let values = this.state.sendData;
                this.setState({ loading: true }, () => {
                    if (this.state.editorContent) {
                        values.content = draftToHtml(this.state.editorContent).replace(/&nbsp;/ig, "").trim()
                    } else {
                        values.content = value.content.replace(/&nbsp;/ig, "").trim()
                    }
                    values.sendTime = this.state.sendTime;
                    // 排序
                    if (this.state.fileList.length > 0) {
                        let result = []
                        this.state.fileList.map((item, index) => {
                            result.push({ activityBurstingId: "", id: "", sequence: index, url: item.url })
                        })
                        values.activityBurstingMustImgList = result
                    } else {
                        let result = []
                        this.state.fileList.map((item, index) => {
                            result.push({ activityBurstingId: "", id: "", sequence: index, url: item.url })
                        })
                        values.activityBurstingMustImgList = result
                    }



                    if (this.state.videoFlag && this.state.flag) {
                        let x = String(this.state.flag).indexOf('.') + 1;
                        let y = String(this.state.flag).length - x
                        values.aspectRatio = y > 2 ? this.state.flag.toFixed(2) : this.state.flag
                        values.firstFrameImg = this.state.shareVideo[0].url
                        values.videoUrl = this.state.videoUrl ? this.state.videoUrl : this.state.OSSData.data.url
                        values.firstImg = this.state.shareVideo[0].url
                        values.activityBurstingMustImgList = []

                    } else {
                        values.aspectRatio = ""
                        values.firstFrameImg = ""
                        values.firstImg = this.state.fileList.length > 0 ? this.state.fileList[0].url : ''
                        values.videoUrl = ""

                    }

                    values.avatarUrl = this.state.nickHeader.length > 0 ? this.state.nickHeader[0].url : ""

                    values.id = ''
                    values.virtualShareNum = value.virtualShareNum
                    values.nickName = value.nickName
                    if (value.nickName !== "红人装小编") {

                        localStorage.setItem('nickname', value.nickName)
                    }

                    // 默认值反转
                    if (value.tabType == '全部') {
                        values.tabType = 0
                    } else if (value.tabType == '早安签到') {
                        values.tabType = 1
                    } else if (value.tabType == '公司实力') {
                        values.tabType = 2
                    } else if (value.tabType == '红人说') {
                        values.tabType = 3
                    } else if (value.tabType == '红人公益') {
                        values.tabType = 4
                    } else if (value.tabType == '热门活动') {
                        values.tabType = 5
                    } else {
                        values.tabType = value.tabType
                    }

                    const bannerId = JSON.parse(sessionStorage.getItem('Material'))
                    let text = '新增'
                    if (bannerId && bannerId.id) {
                        values.id = bannerId.id
                        text = '编辑'
                    }

                    let params = Object.assign({}, this.state.storeInfo, values)
                    saveOrEditShreItem(params).then((res) => {
                        if (res.success) {
                            openNotificationWithIcon('success', text + '素材成功！')
                            clickCancel()
                        } else {
                            this.setState({ loading: false }, () => {
                                openNotificationWithIcon('error', text + '素材失败！')
                            })
                        }
                    })
                })
            } else {
                openNotificationWithIcon('warning', '校验不通过，请根据提示填写表单！')
            }
        });
    };


    compareToTitle = (rule, value, callback) => {
        let val = value.blocks.text
        const result = verifyTitle(rule, val)
        result ? callback(result) : callback()
    };


    // 汇总信息
    initCollectInfo () {
        getCollectTable(0, (res) => {
            this.setState({
                collect: res
            })
        })
    }


    imageUploadCallBack = file => new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
            xhr.open('POST', 'https://api.imgur.com/3/image');
            xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
            const data = new FormData(); // eslint-disable-line no-undef
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        }
    );

    getSortInfo (val) {
    }


    beforeUpload = (file) => {
        if (this.state.videoFlag && this.state.flag) {
            openNotificationWithIcon('error', '分享视频和分享图片只能二选一')
        } else {
            const r = new FileReader();
            r.readAsDataURL(file);
            let that = this;
            return handleImgSize(r, file, 0, 0, res => {
                that.setState({
                    data: res
                })
            })
        }

    };

    beforeUploadAvatar = (file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        let that = this;
        return handleImgSize(r, file, this.state.width, this.state.height, res => {
            that.setState({
                data: res
            })
        })
    };

    getStoreInfo (val) {
        this.setState({
            storeInfo: val
        })
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

    handleChange = (parmas, { fileList }) => {

        if (parmas === 'nickHeader') {
            this.setState({ nickHeader: fileList })
        } else {
            this.setState({ fileList })
        }
    }

    handleChangeList = ({ fileList }) => {
        this.setState({ fileList })
    }


    //       1、上传视频到oss
    handleFilebeforeUpload = (file, uploadOptions) => {
        checkVideoWH(file, 720, 1480, res => {

            this.setState({
                flag: res
            })

        })

        let promise = this.ajaxGetOSSToken(file.name);

        promise = promise.then((data) => {

            uploadOptions.data = {
                name: file.name,
                key: `${data.value.dir}${file.name}`,
                policy: data.value.policy,
                OSSAccessKeyId: data.value.accessid,
                success_action_status: 200,
                signature: data.value.signature,
                url: data.value.url
            };
            uploadOptions.action = data.value.host;

            this.setState({
                OSSData: uploadOptions
            })
            this.setState({
                videoFlag: true,

            })
            return uploadOptions;
        });

        return promise;

    }



    //     2、获取签名
    customRequestVideo = (type) => {
        let params = {
            dir: 2,
            fileName: this.state.videoName
        }

    }
    //  3、上传oss
    handleChangeVideo = (file) => {

        let url = ""
        if (this.state.flag) {
            url = this.state.OSSData.data.url + "?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast"
            this.setState({
                shareVideo: [{ uid: new Date().getTime(), url: url, status: 'done', }]
            })
        }




    }

    transformFile = file => {
        return file;
    };

    getExtraData = file => {

        return {
            key: this.state.OSSData.data.key,
            OSSAccessKeyId: this.state.OSSData.data.OSSAccessKeyId,
            policy: this.state.OSSData.data.policy,
            Signature: this.state.OSSData.data.signature,
        }
    }

    ajaxGetOSSToken = (val) => {
        let params = {
            dir: 2,
            fileName: val
        }
        return new Promise(function (resolve, reject) {
            uploadVideo(params).then(res => {
                resolve({ value: res.data });
            })

        })


    };


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
                    localStorage.setItem('nicknameImg', res.data)

                }
            }
        })
    }

    compareToContent = (rule, value, callback) => {
        let result
        if (typeof value === 'string' && value.indexOf("<") != -1) {
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

    handleRemove = (parmas, file) => {
        if (parmas !== 'nickHeader') {
            this.setState({
                shareVideo: []
            })
            this.setState({
                videoFlag: false,
                flag: false
            })

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


    //预览
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };


    onContentStateChange = (contentState) => {
    };

    disabledDate (current) {
        return current < moment().subtract(1, 'day')
    }



    //单选
    onChange = e => {
        let num = e.target.value;
        if (+num === 1) {
            this.setState({ visible: false })
            let immediately = new Date().getTime();
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.sendData.sendTime = format(immediately);
        } else {
            this.setState({ visible: true })
        }
        this.setState({
            value: e.target.value,
        });
    };

    handleOpenChange = open => {
        if (open) {
            this.setState({ mode: 'time' });
        }
    };

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
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

    handleCancel = () => this.setState({ previewVisible: false });


    handlePanelChange = (value, mode) => {
        this.setState({ mode });
    };

    //自定义发送时间选择
    onChangeTime = (value, dateString) => {

        this.state.sendTime = dateString;
    }

    removeFile (index) {
        this.state.fileList.splice(index, 1)

        const result = this.state.fileList
        this.setState({
            fileList: result,
            tmpFile: result
        })
    }

    onOk (value) {
    }

    onEditorChange = (editorContent) => {

        this.setState({
            editorContent,
        });

    }

    render () {

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const loading = this.state.loading

        const { editorContent, editorState, previewVisible, previewImage, fileList, nickHeader, shareVideo } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );
        const uploadButtonVideo = (
            <div>
                <Icon style={{ fontSize: '26px', color: '#7DC1EF' }} type="play-circle" />
                <div className="ant-upload-text">请选择视频</div>
            </div>
        );


        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="必发素材" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>
                        <FormItem label="素材类型">
                                {getFieldDecorator('tabType', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择素材类型!',
                                        },
                                    ],
                                    initialValue : '0',
                                })(
                                    <Select placeholder="请选择素材类型">
                                        <Option value="0">全部</Option>
                                        <Option value="1">早安签到</Option>
                                        <Option value="2">公司实力</Option>
                                        <Option value="3">红人说</Option>
                                        <Option value="4">红人公益</Option>
                                        <Option value="5">热门活动</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem label="发送时间">
                                {getFieldDecorator('type', {
                                    initialValue: this.state.value,
                                    rules: [{
                                        required: true,
                                        message: '请选择发送时间！'
                                    },],

                                })(
                                    <RadioGroup onChange={this.onChange}
                                        disabled={+this.state.sendStatus === 2 ? false : true}
                                    >
                                        <Radio value={1}>即时发送</Radio>
                                        <Radio value={2}>定时发送</Radio>
                                        {this.state.visible ? (
                                            <DatePicker
                                                showTime
                                                placeholder="选择发送时间"
                                                disabledDate={this.disabledDate}
                                                onChange={this.onChangeTime}
                                                onOk={this.onOk}

                                                disabled={+this.state.sendStatus === 2 ? false : true}
                                                defaultValue={this.state.sendTime ? moment(this.state.sendTime, 'YYYY-MM-DD HH:mm:ss') : null}
                                            />

                                        ) : null}
                                    </RadioGroup>
                                )}
                            </FormItem>

                            <FormItem label="分享文案">
                                {getFieldDecorator('content', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入要分享的文案',
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
                                            emoji: emojis(),

                                        }}
                                        onContentStateChange={this.onEditorChange}
                                        placeholder="请输入要分享的文案"
                                        spellCheck
                                        localization={{ locale: 'zh', translations: { 'generic.add': 'Test-Add' } }}
                                    />
                                )}
                            </FormItem>
                            <FormItem label="分享视频">
                                <div className="clearfix">
                                    {getFieldDecorator('img', {
                                    })(
                                        <Upload
                                            accept="video/*"
                                            listType="picture-card"
                                            fileList={shareVideo}
                                            beforeUpload={this.handleFilebeforeUpload}
                                            action={this.state.OSSData.action}
                                            onChange={this.handleChangeVideo}
                                            onRemove={this.handleRemove}
                                            data={this.getExtraData}
                                        >

                                            {shareVideo.length >= 1 ? null : uploadButtonVideo}


                                        </Upload>
                                    )}
                                </div>
                                <span>要求：时长为15秒内的短视频</span>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>

                            </FormItem>
                            <FormItem label="分享图片">

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
                                                                }}
                                                                    onClick={this.removeFile.bind(this, index)}
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
                                        beforeUpload={this.beforeUpload}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChangeList}
                                        onRemove={this.handleRemove}
                                        withCredentials={false}
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
                                        beforeUpload={this.beforeUploadAvatar}
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
                    </Card>
                </div>
            </div>
        );
    }
}

const AddMaterial = Form.create()(AddMaterials);

export default AddMaterial;