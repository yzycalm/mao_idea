import React from 'react';
import { Card, Form, Button, Icon, Row, Col, Radio, DatePicker, Upload, PageHeader, Input, Select ,Modal} from 'antd';
import { saveOrEditShreItem, findShareDetail } from '../../../api/share/shareList';
import { addOrEdit,getTypeList,getTodayPushDetail } from '../../../api/tile/todayPush';
import { Editor } from 'react-draft-wysiwyg';
import { openNotificationWithIcon, format, clickCancel, getContent, handleImgSize } from '../../../utils/index';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { uploadImg } from "../../../api/public";
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { getCollectTable } from "../../../utils/commodity";
import moment from "moment";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';
import {verifyTitle, verifyFile} from "../../../utils/verify";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const reorder = (list, startIndex, endIndex) => {
    console.log(list)
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

class AddTile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            tableData: [],
            loading: false,
            previewVisible: false,
            previewImage: '',
            editorContent: '',
            tmpFile: [],
            total: 0,
            isShow:"block",
            img:'',
            value: '',
            sendTime: "",
            sendStatus: 2,
            mode: 'time',
            title: '新增二级页广告位',
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
            contentC: '',
            width: 100,
            selectedRowKeys: [],
            fileList: [],
            typeList:[],
            collect: {
                audit: 0,
                notPassed: 0,
                settlement: 0,
                upperShelf: 0
            }
        }
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
       

        this.initCollectInfo()
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


    // 获取今日必推信息
    componentDidMount() {

        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            console.log(this.props.location)
            params = { id: this.props.location.query.id, item: this.props.location.query.title }
            sessionStorage.setItem('todayPush', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: params.item + '二级页广告位'
                })
                
                this.getDetail(params.id)
            }
        } else {
            
            params = JSON.parse(sessionStorage.getItem('todayPush'))
            console.log(params)
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: params.item + '二级页广告位'
                })
                this.getDetail(params.id)
            }
        }
        getTypeList().then((res) =>{
            // console.log(res)
            this.setState({
                typeList : res.data
            })
        })

    }

    componentWillUnmount() {
        sessionStorage.removeItem('todayPush')
    }

    //获取今日必推具体信息

    getDetail(id) {
        const params = { id: id }
        const that = this
        getTodayPushDetail(params).then((res) => {
            console.log(res)
            if(res.success){
                const data = res.data;
                const typeDetail = res.data.type
                console.log(data.picUrl.split('.')[1], data.picUrl)
                if(typeDetail == 0 || typeDetail == 1){
                    this.setState({
                        isShow : "none"
                    })
                }
                const index = data.picUrl.lastIndexOf('.')
                const suffix = 'image/' + data.picUrl.substring(index + 1, data.picUrl.length);
                const file = {file: {type: suffix, thumbUrl: data.picUrl}}
                this.props.form.setFieldsValue({
                    type : data.type,
                    title: data.title,
                    redirectUrl : data.redirectUrl,
                    bgColor : data.bgColor,
                    time: [moment(format(data.startTime), 'YYYY-MM-DD HH:mm:ss'), moment(format(data.endTime), 'YYYY-MM-DD HH:mm:ss')],
                    // sys : data.sys+'',
                    img: file,
                })
                that.setState({
                    img: data.picUrl,
                    fileList: [{uid: '-1', url: data.picUrl, status: 'done'}],
                })
            }else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
            // if (res && res.success) {
            //     const data = res.data;
            //     this.props.form.setFieldsValue({
            //         content: data.content,
            //     })
            //     this.setState({
            //         value: data.sendTime ? 2 : 1,
            //         visible: data.sendTime ? true : false,
            //         sendTime: data.sendTime,
            //         contentC: data.content,
            //         sendStatus: data.sendStatus
            //     })
            //     if (data.activityBurstingMustImgList.length > 0) {

            //         let result = []
            //         data.activityBurstingMustImgList.map((item, index) => {
            //             result.push({ uid: new Date().getTime() + Math.random(), url: item.url, status: 'done' })
            //         })
            //         this.setState({
            //             fileList: result,
            //             tmpFile: result
            //         })
            //     }
            //     //回显
             
            //     // const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            //     // const editorState = EditorState.createWithContent(contentState);
            //     // this.setState({ editorState });
            // } else {
            //     openNotificationWithIcon('error', '查询详情失败！')
            // }
        })
    }


    //提交数据
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log(values)
            if (!err ) {
                
                const bannerId = JSON.parse(sessionStorage.getItem('todayPush'))
                this.setState({ loading: true }, () => {
                    let text = '新增'
                    if (bannerId && bannerId.id) {
                        values.id = bannerId.id
                        text = '编辑'
                    }else{
                        values.id = ""
                    }
                    if (values.time && values.time.length === 2) {
                        values.startTime = parseInt(new Date(values.time[0]).getTime()/1000) 
                        values.endTime = parseInt(new Date(values.time[1]).getTime()/1000) 
                    }
                    // 排序 
                    values.picUrl = this.state.img
                    // if(values.sys == "ios/安卓"){
                    //     values.sys = 0
                    // }
                    // values.picUrl = this.state.fileList.length > 0 ? this.state.fileList[0].url : ''


                    let params = Object.assign({}, this.state.storeInfo, values)
                    delete params.time
                    console.log(params)
                    addOrEdit(params).then((res) => {
                        if (res.success) {
                            openNotificationWithIcon('success', text + '二级页广告位成功！')
                            clickCancel()
                        } else {
                            this.setState({ loading: false }, () => {
                                openNotificationWithIcon('error', text + '二级页广告位失败！')
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
    initCollectInfo() {
        getCollectTable(0, (res) => {
            this.setState({
                collect: res
            })
        })
    }

    getSortInfo(val) {
        console.log(val)
    }


    beforeUpload = (file) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        let that = this;
        return handleImgSize(r, file, 750, 350, res => {
            that.setState({
                data: res
            })
        })
    };

    getStoreInfo(val) {
        this.setState({
            storeInfo: val
        })
        // if (val.hasOwnProperty('imgs') && val.imgs.length > 0) {
        //     let result = []
        //     val.imgs.map(item => {
        //         result.push({ uid: new Date().getTime() + Math.random(), url: item, status: 'done' })
        //     })
        //     this.setState({
        //         tmpFile: result,
        //         fileList: result
        //     })
        // }
    }

    handleChange = ({ fileList }) => {
        this.setState({ fileList })
    }


    // 自定义上传
    customRequest = (files) => {
        const {file} = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    img: res.data,
                    fileList: [{uid: file.uid, url: res.data, status: 'done'}]
                })
                that.props.form.setFieldsValue({
                    img: that.props.form.getFieldsValue().img
                })
            }
        })
    }

    compareToContent = (rule, value, callback) => {
        const rsp = draftToHtml(value)
        const result = getContent(rsp)
        if (result.length < 1) {
            callback('请输入分享文案！')
        } else {
            callback()
        }
    };

    handleRemove = (file) => {
        this.state.tmpFile.splice(this.state.tmpFile.length - 1);
        this.setState({
            tmpFile: this.state.tmpFile
        });
    }
    handleCancel = () => this.setState({previewVisible: false});

    //预览
    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    getCouponUrl(event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.query, { couponUrl: value })
            this.setState({
                query: data
            })
        } else {
            let data = Object.assign({}, this.state.query, { couponUrl: "" })
            this.setState({
                query: data
            })
        }
    }


    onContentStateChange = (contentState) => {
        console.log('contentState', contentState);
    };

    disabledDate(current) {
        // console.log(current)
        // return current && current < moment().endOf('day');
        return current < moment().subtract(1, 'day')
    }

    regColor = (rule, value, callback) => {
        const colorReg = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/
        if (!colorReg.test(value) && value) {
            callback('请输入正确的色值代码')
        } else {
            callback()
        }
    }


    //单选
    onChange = e => {
        // console.log('radio checked', e.target.value);
        let num = e.target.value;
        if (num == "1") {
            this.setState({ visible: false })
            let immediately = new Date().getTime();
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

    handleSelectPage(value) {
        let data = Object.assign({}, this.state.query, { platform: value })
        console.log(value)
        if(value == 0 || value == 1){
            this.setState({
                isShow : "none"
            })
            // this.props.form.validateFieldsAndScroll
            this.props.form.validateFields(['bgColor'], { required: false });
        }else{
            this.setState({
                isShow : "block"
            })
            this.props.form.validateFields(['bgColor'], { required: true });
        }

        this.setState({
            query: data
        })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };


    handlePanelChange = (value, mode) => {
        this.setState({ mode });
    };

    //自定义发送时间选择
    onChangeTime = (value, dateString) => {

        this.state.sendTime = dateString;
        console.log(this.state.sendTime)
    }

    removeFile(index) {
        this.state.fileList.splice(index, 1)

        const result = this.state.fileList
        this.setState({
            fileList: result,
            tmpFile: result
        })
    }

    onOk(value) {
        // console.log('onOk: ', value);
        // console.log('Formatted Selected Time: ', dateString);
    }

    normFile = (rule, value, callback) => {
        const result = verifyFile(rule, value)
        result ? callback(result) : callback()
    };

    onEditorChange = (editorContent) => {

        this.setState({
            editorContent,
        });

    }

    render() {

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
        const { editorContent, editorState } = this.state;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">请选择文件</div>
            </div>
        );


        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="二级页广告位" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Form {...formItemLayout} onSubmit={this.handleSubmit} labelAlign={'right'}>

                        <FormItem label="二级页面">
                                {getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择二级页面!',
                                        },
                                    ],
                                })(
                                    <Select onChange={this.handleSelectPage.bind(this)} style={{ width: '35rem' }} >

                                        {this.state.typeList.map(item => (
                                            <Option value={item.value} key = {item.key}>{item.key}</Option>
                                            ))}

                                       
                                    </Select>
                                )
                                }
                            </FormItem>

                            <FormItem label="广告名称">
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入广告名称!',
                                        }
                                    ],
                                })(
                                    <Input style={{ width: '35rem' }} />
                                )
                                }
                            </FormItem>

                            {/* <FormItem label="系统">
                                {getFieldDecorator('sys', {
                                    // initialValue: "ios/安卓",
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择推荐商品位置!',
                                        },
                                    ],
                                })(
                                    <Select style={{ width: '35rem' }} >
                                        <Option value="0">ios/安卓</Option>
                                        <Option value="2">ios</Option>
                                        <Option value="1">安卓</Option>
                                    </Select>
                                )
                                }
                            </FormItem> */}
                            <FormItem label="跳转链接">
                                {getFieldDecorator('redirectUrl', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请输入优惠券链接'
                                        },
                                    ],
                                })(
                                    <TextArea rows={4} onBlur={this.getCouponUrl.bind(this)} style={{ width: '35rem' }} />
                                )
                                }
                            </FormItem>

                            <FormItem label="广告图片">
                            <div className="clearfix">
                                    {getFieldDecorator('img', {
                                        rules: [
                                            {
                                                required: true,
                                                validator: this.normFile
                                            }
                                        ]
                                    })(
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList}
                                            customRequest={this.customRequest}
                                            beforeUpload={this.beforeUpload}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleChange}>
                                            {fileList.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    )}
                                </div>
                                <span>要求：图片尺寸为750px * 350px；图片大小不超过1M，仅支持JPG、JPEG、GIF、PNG格式</span>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} centered>
                                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                </Modal>
                               
                            </FormItem>
                            
                            <FormItem label="banner背景颜色" style = {{display:this.state.isShow}} >
                                <div style={{display: 'flex', lineHeight: '35px'}}>
                                    {getFieldDecorator('bgColor',{
                                        rules: [
                                            {
                                                required: false,
                                                message: '请输入背景颜色',
                                            },
                                            {
                                                validator: this.regColor.bind(this)
                                            }
                                        ],
                                    })(
                                        <Input style={{width: '33%'}}/>
                                    )
                                    }
                                    <span style={{
                                        width: '10px',
                                        height: '10px',
                                        margin: '8px 0 0 5px',
                                        background: this.props.form.getFieldsValue().bgColor
                                    }}></span>
                                </div>
                            </FormItem>
                            <FormItem label="展示时间段">
                                {getFieldDecorator('time', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择展示时间段!',
                                        },
                                    ],
                                })(
                                    <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                )}
                            </FormItem>
                            <Row>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
                                    <Button type="default" onClick={clickCancel}>取消</Button>
                                </Col>
                            </Row>

                        </Form>
                        {/* <Col span={10}>
                            <GoodInfo params={this.state.query} getStoreInfo={this.getStoreInfo.bind(this)} />
                        </Col> */}
                    </Card>
                </div>
            </div>
        );
    }
}

const AddTodayPush = Form.create()(AddTile);

export default AddTodayPush;
