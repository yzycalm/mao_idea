/**
 * Created by songyingchun
 */
import React from 'react';
import {
    Button,
    Card,
    Row,
    Col,
    Radio,
    Divider,
    Form,
    Input,
    PageHeader,
    Upload,
    Icon,
    Popover,
    Checkbox,
    Modal
} from "antd";
import {SketchPicker} from 'react-color';
import {clickCancel, handleImgSize, openNotificationWithIcon} from "../../../utils";
import {uploadImg} from "../../../api/public";
import {saveCard, findTileById} from "../../../api/tile/tile";
import store from "../../../store";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: store.getState().iconFont
});

class AddTile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增瓷片',
            value: 1,
            loading: false,
            fileList: [],
            fileList1: [],
            fileList2: [],
            fileList3: [],
            fileList4: [],
            previewVisible: false,
            previewImage: '',
            layoutParams: {
                width: 100,
                height: 50,
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 0,
                name: '',
                bgColor: '',
                scale: 2
            },
            formItems: [{
                type: 'image',
                tangramItemUrl1: '',
                scale: '1.00'
            }, {
                type: 'image',
                tangramItemUrl2: '',
                scale: '1.00'
            }],
            hanziNum: ['一', '二', '三', '四', '五'],
            visible: false
        }
    }

    // 获取瓷片信息
    componentDidMount() {
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.id) {
            params = JSON.parse(this.props.location.query.id)
            sessionStorage.setItem('TileData', JSON.stringify(params))
            if (params) {
                this.setState({
                    title: '编辑瓷片',
                    loadingFinish: true
                })
                this.getTileInfo(params)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('TileData'))
            if (params) {
                this.setState({
                    title: '编辑瓷片',
                    loadingFinish: true
                })
                this.getTileInfo(params)
            }
        }
    }

    componentWillUnmount() {
        sessionStorage.removeItem('TileData')
    }

    // 获取瓷片信息
    getTileInfo(data) {
        findTileById({id: +data}).then(res => {
            if (res && res.success) {
                const data = res.data
                let newData = Object.assign({}, this.state.layoutParams, {
                    height: (100 / data.style.aspectRatio).toFixed(2),
                    marginTop: data.style.margin[0],
                    marginRight: data.style.margin[1],
                    marginBottom: data.style.margin[2],
                    marginLeft: data.style.margin[3],
                    paddingTop: data.style.padding[0],
                    paddingRight: data.style.padding[1],
                    paddingBottom: data.style.padding[2],
                    paddingLeft: data.style.padding[3],
                    bgColor: data.style.bgColor
                })
                this.props.form.setFieldsValue({
                    name: data.name
                })
                let newArr = []
                data.items.map((item, index) => {
                    newArr.push({
                        ['tangramItemUrl' + (index + 1)]: item.tangramItemUrl,
                        scale: item.webScale
                    })
                    this.setState({
                        ['fileList' + (index + 1)]: item.imageUrl ? [{
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: item.imageUrl
                        }] : []
                    })
                })
                this.setState({
                    layoutParams: newData,
                    formItems: newArr,
                    fileList: data.style.bgImgUrl ? [{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: data.style.bgImgUrl
                    }] : [],
                })
                this.setState({
                    value: data.typeId
                })
            } else {
                openNotificationWithIcon('error', '查询详情失败！')
            }
        })
    }

    onChange = e => {
        this.resetState(() => {
            this.handleImgScale(e.target.value)
            this.setState({
                value: e.target.value
            });
        })
    };

    watchChange() {
        this.handleImgScale(this.state.value)
    }

    // 判断图片比例和大小
    handleImgScale(value) {
        const {layoutParams} = this.state
        let obj = Object.assign({}, this.state.layoutParams, {scale: (375 / (375 * (layoutParams.height / 100).toFixed(2)).toFixed(2)).toFixed(2)})
        this.setState({
            layoutParams: obj
        })
        switch (+value) {
            case  1:
                this.setState({
                    formItems: [{
                        type: 'image',
                        tangramItemUrl1: '',
                        scale: ((375 / 2 - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / (375 * (layoutParams.height / 100).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }, {
                        type: 'image',
                        tangramItemUrl2: '',
                        scale: ((375 / 2 - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / (375 * (layoutParams.height / 100).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }]
                });
                break
            case  2:
                this.setState({
                    formItems: [{
                        type: 'image',
                        tangramItemUrl1: '',
                        scale: (((375 / 3).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / (375 * (layoutParams.height / 100).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }, {
                        type: 'image',
                        tangramItemUrl2: '',
                        scale: (((375 / 3).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / (375 * (layoutParams.height / 100).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)

                    }, {
                        type: 'image',
                        tangramItemUrl3: '',
                        scale: (((375 / 3).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / (375 * (layoutParams.height / 100).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }]
                });
                break
            case  3:
                this.setState({
                    formItems: [{
                        type: 'image',
                        tangramItemUrl1: '',
                        scale: (((375 / 2).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / (375 * (layoutParams.height / 100).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }, {
                        type: 'image',
                        tangramItemUrl2: '',
                        scale: (((375 / 2).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / ((375 * (layoutParams.height / 100).toFixed(2) / 2).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }, {
                        type: 'image',
                        tangramItemUrl3: '',
                        scale: (((375 / 2).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / ((375 * (layoutParams.height / 100).toFixed(2) / 2).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }]
                });
                break
            case  4:
                this.setState({
                    formItems: [{
                        type: 'image',
                        tangramItemUrl1: '',
                        scale: (((375 / 2).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / (375 * (layoutParams.height / 100).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }, {
                        type: 'image',
                        tangramItemUrl2: '',
                        scale: (((375 / 2).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / ((375 * (layoutParams.height / 100).toFixed(2) / 2).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }, {
                        type: 'image', tangramItemUrl3: '',
                        scale: (((375 / 4).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / ((375 * (layoutParams.height / 100).toFixed(2) / 2).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)
                    }, {
                        type: 'image', tangramItemUrl4: '',
                        scale: (((375 / 4).toFixed(2) - layoutParams.marginLeft - layoutParams.paddingLeft - layoutParams.marginRight - layoutParams.paddingRight) / ((375 * (layoutParams.height / 100).toFixed(2) / 2).toFixed(2) - layoutParams.marginTop - layoutParams.paddingTop - layoutParams.marginBottom - layoutParams.paddingBottom)).toFixed(2)

                    }]
                });
                break
        }
    }

    // 根据选项更改布局
    getLayout() {
        switch (+this.state.value) {
            case 1:
                return <div style={{
                    display: 'grid',
                    gridTemplateColumns: "repeat(2, 50%)",
                    gridTemplateRows: "repeat(1, auto)",
                    boxSizing: "border-box",
                    height: `${321 * (this.state.layoutParams.height / 100)}px`,
                    padding: `${this.state.layoutParams.paddingTop}px ${this.state.layoutParams.paddingRight}px ${this.state.layoutParams.paddingBottom}px ${this.state.layoutParams.paddingLeft}px`,
                    margin: `${this.state.layoutParams.marginTop}px ${this.state.layoutParams.marginRight}px ${this.state.layoutParams.marginBottom}px ${this.state.layoutParams.marginLeft}px`,
                    border: '1px blue solid',
                    background: this.getShowBgOrImg(1)
                }}>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        background: `url(${this.state.fileList1.length > 0 ? this.state.fileList1[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}>
                    </div>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        background: `url(${this.state.fileList2.length > 0 ? this.state.fileList2[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}>
                    </div>
                </div>
                break
            case 2:
                return <div style={{
                    display: 'grid',
                    gridTemplateColumns: "repeat(3, 33.33%)",
                    gridTemplateRows: "repeat(1, auto)",
                    border: '1px blue solid',
                    height: `${321 * (this.state.layoutParams.height / 100)}px`,
                    padding: `${this.state.layoutParams.paddingTop}px ${this.state.layoutParams.paddingRight}px ${this.state.layoutParams.paddingBottom}px ${this.state.layoutParams.paddingLeft}px`,
                    margin: `${this.state.layoutParams.marginTop}px ${this.state.layoutParams.marginRight}px ${this.state.layoutParams.marginBottom}px ${this.state.layoutParams.marginLeft}px`,
                    background: this.getShowBgOrImg(2)
                }}>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        background: `url(${this.state.fileList1.length > 0 ? this.state.fileList1[0].url : ""}) 0% 0% / 100% 100% no-repeat`,
                    }}></div>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        background: `url(${this.state.fileList2.length > 0 ? this.state.fileList2[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}></div>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        background: `url(${this.state.fileList3.length > 0 ? this.state.fileList3[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}></div>
                </div>
                break
            case 3:
                return <div style={{
                    display: 'grid',
                    gridTemplateColumns: "repeat(2, 50%)",
                    border: '1px blue solid',
                    height: `${321 * (this.state.layoutParams.height / 100)}px`,
                    padding: `${this.state.layoutParams.paddingTop}px ${this.state.layoutParams.paddingRight}px ${this.state.layoutParams.paddingBottom}px ${this.state.layoutParams.paddingLeft}px`,
                    margin: `${this.state.layoutParams.marginTop}px ${this.state.layoutParams.marginRight}px ${this.state.layoutParams.marginBottom}px ${this.state.layoutParams.marginLeft}px`,
                    background: this.getShowBgOrImg(3)
                }}>
                    <div style={{
                        display: 'inline-grid',
                        gridRowStart: 1,
                        gridRowEnd: 3,
                        width: '100%',
                        background: `url(${this.state.fileList1.length > 0 ? this.state.fileList1[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}></div>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        background: `url(${this.state.fileList2.length > 0 ? this.state.fileList2[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}></div>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        background: `url(${this.state.fileList3.length > 0 ? this.state.fileList3[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}></div>
                </div>
                break
            case 4:
                return <div style={{
                    display: 'grid',
                    gridTemplateColumns: "repeat(4, 25%)",
                    border: '1px blue solid',
                    height: `${321 * (this.state.layoutParams.height / 100)}px`,
                    padding: `${this.state.layoutParams.paddingTop}px ${this.state.layoutParams.paddingRight}px ${this.state.layoutParams.paddingBottom}px ${this.state.layoutParams.paddingLeft}px`,
                    margin: `${this.state.layoutParams.marginTop}px ${this.state.layoutParams.marginRight}px ${this.state.layoutParams.marginBottom}px ${this.state.layoutParams.marginLeft}px`,
                    background: this.getShowBgOrImg(4)
                }}>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        gridRowStart: 1,
                        gridRowEnd: 3,
                        gridColumnStart: 1,
                        gridColumnEnd: 3,
                        background: `url(${this.state.fileList1.length > 0 ? this.state.fileList1[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}></div>
                    <div style={{
                        display: 'inline-grid',
                        gridRowStart: 1,
                        gridRowEnd: 2,
                        gridColumnStart: 3,
                        gridColumnEnd: 5,
                        width: '100%',
                        background: `url(${this.state.fileList2.length > 0 ? this.state.fileList2[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}></div>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        background: `url(${this.state.fileList3.length > 0 ? this.state.fileList3[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}></div>
                    <div style={{
                        display: 'inline-grid',
                        width: '100%',
                        background: `url(${this.state.fileList4.length > 0 ? this.state.fileList4[0].url : ""}) 0% 0% / 100% 100% no-repeat`
                    }}></div>
                </div>
                break
        }
    }

    // 联动背景和背景色
    getShowBgOrImg(order) {
        if (this.state.fileList.length > 0) {
            return `url(${this.state.fileList[0].url}) 0% 0% / 100% 100% no-repeat`
        } else {
            if (this.state.layoutParams.bgColor) {
                return `${this.state.layoutParams.bgColor}`
            } else {
                return `url(/images/${order}.png) 0% 0% / 100% 100% no-repeat`
            }
        }
    }

    handleCancel = () => this.setState({previewVisible: false});
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
        // 上传图片比例与大小限制
        let that = this
        const {layoutParams} = this.state
        return handleImgSize(r, file, 0, 0, res => {
            that.setState({
                data: res
            })
        })
    };

    handleChange = (i, file) => {
        this.setState({
            ['fileList' + i]: file.fileList.splice(file.fileList.length - 1)
        })
    }
    handleRemove = (i, file) => {
        this.state['fileList' + i].splice(this.state['fileList' + i].length - 1);
        this.setState({
            ['fileList' + i]: this.state['fileList' + i]
        });
    }
    // 自定义上传
    customRequest = (i, files) => {
        const {file} = files
        const that = this
        uploadImg(this.state.data).then(res => {
            if (res && res.success) {
                that.setState({
                    img: res.data,
                    ['fileList' + i]: [{uid: file.uid, url: res.data, status: 'done'}]
                })
            }
        })
    }

    async handleUpload(options) {
        const formData = new FormData()
        formData.append('file', options.file)

        let progress = {percent: 1}


        const intervalId = setInterval(() => {
            if (progress.percent < 100) {
                progress.percent++
                options.onProgress(progress)
            } else {
                clearInterval(intervalId)
            }
        }, 100)
    }

    // 样式参数
    handleInput(param, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let data = Object.assign({}, this.state.layoutParams, {[param]: value})
            this.setState({
                layoutParams: data
            }, () => {
                // this.watchChange()
            })
        } else {
            let data = Object.assign({}, this.state.layoutParams, {[param]: ""})
            this.setState({
                layoutParams: data
            }, () => {
                // this.watchChange()
            })
        }
    }

    // 链接
    handleInputAction(param, event) {
        if (event && event.target && event.target.value) {
            let value = event.target.value;
            let newFormItems = [...this.state.formItems]
            newFormItems.map((k, index) => {
                Object.keys(k).map((item) => {
                    if (item === param) {
                        k[item] = value
                    }
                })
            })
            this.setState({formItems: newFormItems});
        } else {
            let newFormItems = [...this.state.formItems]
            newFormItems.map((k, index) => {
                Object.keys(k).map((item) => {
                    if (item === param) {
                        k[item] = ""
                    }
                })
            })
            this.setState({formItems: newFormItems});
        }
    }

    // 内外边距全选
    onCheckChange = (type, e) => {
        if (e.target.checked) {
            if (type === 'padding') {
                let data = Object.assign({}, this.state.layoutParams, {
                    paddingRight: this.state.layoutParams.paddingTop,
                    paddingBottom: this.state.layoutParams.paddingTop,
                    paddingLeft: this.state.layoutParams.paddingTop
                })
                this.setState({
                    layoutParams: data
                })
            } else {
                let data = Object.assign({}, this.state.layoutParams, {
                    marginRight: this.state.layoutParams.marginTop,
                    marginBottom: this.state.layoutParams.marginTop,
                    marginLeft: this.state.layoutParams.marginTop
                })
                this.setState({
                    layoutParams: data
                })
            }
        }
    }
// 提交
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({loading: true}, () => {
                    saveCard(this.getParams(values)).then((res) => {
                        if (res && res.success) {
                            openNotificationWithIcon('success', '保存成功！')
                            clickCancel()
                        } else {
                            this.setState({loading: false}, () => {
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

// 组装请求参数
    getParams(values) {
        const {layoutParams, fileList, value, formItems} = this.state
        const params = JSON.parse(sessionStorage.getItem('TileData'))
        if (params) {
            values.id = params
        }
        values.typeId = value
        values.items = []
        formItems.map((item, index) => {
            let obj = {
                type: 'image',
                tangramItemUrl: item['tangramItemUrl' + (index + 1)] ? item['tangramItemUrl' + (index + 1)] : '',
                imageUrl: this.state['fileList' + (index + 1)].length > 0 ? this.state['fileList' + (index + 1)][0].url : '',
                webScale: item.scale
            }
            values.items.push(obj)
        })
        values.style = {
            aspectRatio: (layoutParams.width / layoutParams.height).toFixed(2),
            bgColor: layoutParams.bgColor,
            bgImgUrl: fileList.length > 0 ? fileList[0].url : '',
            margin: [layoutParams.marginTop, layoutParams.marginRight, layoutParams.marginBottom, layoutParams.marginLeft],
            padding: [layoutParams.paddingTop, layoutParams.paddingRight, layoutParams.paddingBottom, layoutParams.paddingLeft],
            scale: layoutParams.scale
        }
        return values
    }

// 清空所有数据
    resetState(callback) {
        this.props.form.setFieldsValue({
            name: ""
        })
        this.setState({
            value: 1,
            fileList: [],
            fileList1: [],
            fileList2: [],
            fileList3: [],
            fileList4: [],
            layoutParams: {
                width: 100,
                height: 50,
                paddingTop: 0,
                paddingRight: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: 0,
                name: ''
            }
        }, () => {
            callback()
        })
    }

    // 选取颜色
    handleChangeComplete = (color) => {
        let newData = Object.assign({}, this.state.layoutParams, {
            bgColor: color.hex
        })
        this.setState({layoutParams: newData, visible: false});
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 4},
                sm: {span: 4},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const {fileList, layoutParams, formItems, hanziNum, previewVisible, previewImage, loading} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">文件上传</div>
            </div>
        );
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="gutter-example">
                <PageHeader onBack={clickCancel} title="瓷片区管理" subTitle={this.state.title}/>
                <div className="gutter-box">
                    <Card bordered={true} title={"布局样式"}
                          extra={<Button type="primary" onClick={this.handleSubmit.bind(this)}
                                         loading={loading}>保存</Button>}>
                        <Row>
                            <Col span={12}>
                                <br/><br/>
                                <Radio.Group onChange={this.onChange} value={this.state.value} style={{width: '100%'}}>
                                    <Col span={4} offset={2}>
                                        <Radio value={1}><IconFont
                                            style={{
                                                fontSize: '50px',
                                                position: 'absolute',
                                                top: '-45px',
                                                left: '-18px'
                                            }}
                                            type="icon-buju" title={"一行两列"}/></Radio>
                                    </Col>
                                    <Col span={4}>
                                        <Radio value={2}><IconFont
                                            style={{
                                                fontSize: '50px',
                                                position: 'absolute',
                                                top: '-45px',
                                                left: '-18px'
                                            }}
                                            type="icon-ai233" title={"一行三列"}/></Radio>
                                    </Col>
                                    <Col span={4}>
                                        <Radio value={3}><IconFont
                                            style={{
                                                fontSize: '50px',
                                                position: 'absolute',
                                                top: '-45px',
                                                left: '-18px'
                                            }}
                                            type="icon-buju-3-2" title={"左一右二"}/></Radio>
                                    </Col>
                                    <Col span={4}>
                                        <Radio value={4}><IconFont
                                            style={{
                                                fontSize: '50px',
                                                position: 'absolute',
                                                top: '-45px',
                                                left: '-18px'
                                            }}
                                            type="icon-ai211" title={"左一右三"}/></Radio>
                                    </Col>
                                </Radio.Group>
                                <br/><br/>
                                <h4>布局效果</h4>
                                <Divider/>
                                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                                    <Form.Item label="宽高比">
                                        <Col span={8}>
                                            <Input type="number" value={layoutParams.width} addonAfter="%"
                                                   disabled/>
                                        </Col>
                                        <Col span={2} className="text-center">
                                            :
                                        </Col>
                                        <Col span={8}>
                                            <Input type="number" value={this.state.layoutParams.height} min={0}
                                                   placeholder="高"
                                                   onChange={this.handleInput.bind(this, 'height')}
                                                   addonAfter="%"/>
                                        </Col>
                                    </Form.Item>
                                    {/*<Form.Item label="内边距 padding">*/}
                                    {/*    <Col span={3}>*/}
                                    {/*        <Input type="number" min={0} max={50}*/}
                                    {/*               value={this.state.layoutParams.paddingTop}*/}
                                    {/*               placeholder="上"*/}
                                    {/*               title="上内边距"*/}
                                    {/*               onChange={this.handleInput.bind(this, 'paddingTop')} disabled />*/}
                                    {/*    </Col>*/}
                                    {/*    <Col span={1}/>*/}
                                    {/*    <Col span={3}>*/}
                                    {/*        <Input type="number" min={0} max={50} value={layoutParams.paddingRight}*/}
                                    {/*               placeholder="右"*/}
                                    {/*               title="右内边距"*/}
                                    {/*               onChange={this.handleInput.bind(this, 'paddingRight')}/>*/}
                                    {/*    </Col>*/}
                                    {/*    <Col span={1}/>*/}
                                    {/*    <Col span={3}>*/}
                                    {/*        <Input type="number" min={0} max={50} value={layoutParams.paddingBottom}*/}
                                    {/*               placeholder="下"*/}
                                    {/*               title="下内边距"*/}
                                    {/*               onChange={this.handleInput.bind(this, 'paddingBottom')} disabled />*/}
                                    {/*    </Col>*/}
                                    {/*    <Col span={1}/>*/}
                                    {/*    <Col span={3}>*/}
                                    {/*        <Input type="number" min={0} max={50} value={layoutParams.paddingLeft}*/}
                                    {/*               placeholder="左"*/}
                                    {/*               title="左内边距"*/}
                                    {/*               onChange={this.handleInput.bind(this, 'paddingLeft')}/>*/}
                                    {/*    </Col>*/}
                                    {/*    <Col span={1}/>*/}
                                    {/*    <Col span={6}>*/}
                                    {/*        <Checkbox*/}
                                    {/*            onChange={this.onCheckChange.bind(this, 'padding')} disabled>内边距相同</Checkbox>*/}
                                    {/*    </Col>*/}
                                    {/*</Form.Item>*/}
                                    {/*<Form.Item label="外边距 margin">*/}
                                    {/*    <Col span={3}>*/}
                                    {/*        <Input type="number" min={0} max={50} value={layoutParams.marginTop}*/}
                                    {/*               title="上外边距"*/}
                                    {/*               placeholder="上" onChange={this.handleInput.bind(this, 'marginTop')} disabled />*/}
                                    {/*    </Col>*/}
                                    {/*    <Col span={1}/>*/}
                                    {/*    <Col span={3}>*/}
                                    {/*        <Input type="number" min={0} max={50} value={layoutParams.marginRight}*/}
                                    {/*               placeholder="右"*/}
                                    {/*               title="右外边距"*/}
                                    {/*               onChange={this.handleInput.bind(this, 'marginRight')}/>*/}
                                    {/*    </Col>*/}
                                    {/*    <Col span={1}/>*/}
                                    {/*    <Col span={3}>*/}
                                    {/*        <Input type="number" min={0} max={50} value={layoutParams.marginBottom}*/}
                                    {/*               placeholder="下"*/}
                                    {/*               title="下外边距"*/}
                                    {/*               onChange={this.handleInput.bind(this, 'marginBottom')} disabled/>*/}
                                    {/*    </Col>*/}
                                    {/*    <Col span={1}/>*/}
                                    {/*    <Col span={3}>*/}
                                    {/*        <Input type="number" min={0} max={50} value={layoutParams.marginLeft}*/}
                                    {/*               placeholder="左"*/}
                                    {/*               title="左外边距"*/}
                                    {/*               onChange={this.handleInput.bind(this, 'marginLeft')}/>*/}
                                    {/*    </Col>*/}
                                    {/*    <Col span={1}/>*/}
                                    {/*    <Col span={6}>*/}
                                    {/*        <Checkbox*/}
                                    {/*            onChange={this.onCheckChange.bind(this, 'margin')} disabled>外边距相同</Checkbox>*/}
                                    {/*    </Col>*/}
                                    {/*</Form.Item>*/}
                                    <Form.Item label="背景图">
                                        <Upload
                                            accept="image/*"
                                            listType="picture-card"
                                            fileList={fileList}
                                            customRequest={this.customRequest.bind(this, "")}
                                            beforeUpload={this.beforeUpload.bind(this, "")}
                                            onPreview={this.handlePreview}
                                            handleUpload={this.handleUpload}
                                            onChange={this.handleChange.bind(this, "")}
                                            onRemove={this.handleRemove.bind(this, "")}>
                                            {fileList.length >= 1 ? null : uploadButton}
                                        </Upload>
                                        <span>大小不超过1M</span>
                                        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}
                                               centered>
                                            <img alt="example" style={{width: '100%'}} src={previewImage}/>
                                        </Modal>
                                    </Form.Item>
                                    <Form.Item label="名称">
                                        {getFieldDecorator('name', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入名称!',
                                                },
                                                {
                                                    max: 30,
                                                    message: '最大输入长度为30个字符!',
                                                }
                                            ],
                                        })(
                                            <Input/>
                                        )
                                        }
                                    </Form.Item>
                                    <Form.Item label="背景色">
                                        <Popover content={<SketchPicker
                                            color={this.state.layoutParams.bgColor}
                                            onChangeComplete={this.handleChangeComplete.bind(this)} />} placement="topLeft" trigger="click" visible={this.state.visible}>
                                            <Input value={this.state.layoutParams.bgColor} onClick={()=>this.setState({visible: true})} />
                                        </Popover>
                                    </Form.Item>
                                    <div>
                                        <br/>
                                        <h4>组件设置</h4>
                                        <Divider/>
                                        {
                                            formItems.map((k, index) => {
                                                return <div key={index}>
                                                    <h5>区块 {hanziNum[index]}</h5>
                                                    <Form.Item label="图片">
                                                        <Upload
                                                            accept="image/*"
                                                            listType="picture-card"
                                                            fileList={this.state['fileList' + (index + 1)]}
                                                            customRequest={this.customRequest.bind(this, (index + 1))}
                                                            beforeUpload={this.beforeUpload.bind(this, k.scale)}
                                                            onPreview={this.handlePreview}
                                                            handleUpload={this.handleUpload}
                                                            onChange={this.handleChange.bind(this, (index + 1))}
                                                            onRemove={this.handleRemove.bind(this, (index + 1))}>
                                                            {this.state['fileList' + (index + 1)].length >= 1 ? null : uploadButton}
                                                        </Upload>
                                                        <span>大小不超过1M</span>
                                                    </Form.Item>
                                                    <Form.Item label="跳转链接">
                                                        <Input
                                                            onChange={this.handleInputAction.bind(this, 'tangramItemUrl' + (index + 1))}
                                                            value={k['tangramItemUrl' + (index + 1)]}/>
                                                    </Form.Item>
                                                </div>
                                            })
                                        }
                                    </div>
                                </Form>
                            </Col>
                            <Col span={12} className="text-center">
                                <div className="device"
                                     style={{
                                         backgroundPosition: "0 0",
                                         display: "inline-block"
                                     }}>
                                    <div className="device-content"
                                         style={{
                                             width: '321px',
                                             backgroundSize: "fill"
                                         }}>
                                        {
                                            this.getLayout()
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddTile);

export default BasicForm;
