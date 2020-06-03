import React from 'react';
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    Modal,
    Select,
    PageHeader,
    Card,
    Radio,
    Upload,
    Icon,
    AutoComplete,
    Skeleton
} from 'antd/lib/index';
import { clickCancel, openNotificationWithIcon } from "../../../utils";
import { handleVersionInfo, feacthVersionCodeList } from "../../../api/application/version";
import { uploadVideo } from "../../../api/public";

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal
const {TextArea} = Input;
const RadioGroup = Radio.Group;

class AddVersion extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '新增版本',
            loadingFinish: false,
            loading: false,
            isShowAddBtn: true,
            versionList: [],
            content: '',
            forciblyUpdate: 0,
            id: '',
            platform: 1,
            popupMaxVersion: 0,
            upgradeLink: '',
            upgradeMaxVersion: 0,
            versionCode: '',
            versionName: '',
            OSSData: {},
            flag: false,
            fileName: ''
        };
    }
    // 获取活动信息
    componentDidMount () {
        this.feacthVersionCodeLists()
        let params;
        if (this.props.location.hasOwnProperty('query') && this.props.location.query.detail) {
            params = JSON.parse(this.props.location.query.detail)
            sessionStorage.setItem('addVersion', JSON.stringify(params))
            if (params.id !== undefined) {
                this.setState({
                    title: '编辑版本',
                    loadingFinish: true
                })
                this.getVersionInfo(params)
            }
        } else {
            params = JSON.parse(sessionStorage.getItem('addVersion'))
            if (params && params.id !== 'undefined') {
                this.setState({
                    title: '编辑版本',
                    loadingFinish: true
                })
                this.getVersionInfo(params)
            }
        }
    }

    componentWillUnmount () {
        sessionStorage.removeItem('addVersion')
    }
    feacthVersionCodeLists () {
        feacthVersionCodeList().then((res) => {
            if (res && res.success) {
                const data = res.data
                this.setState({
                    versionList: data,
                })
            }
        })
    }
    // 获取活动信息
    getVersionInfo (values) {
        this.props.form.setFieldsValue({
            content: values.content,
            forciblyUpdate: values.forciblyUpdate,
            platform: values.platform,
            popupMaxVersion: values.popupMaxVersion,
            upgradeMaxVersion: values.upgradeMaxVersion,
            versionCode: values.versionCode,
            versionName: values.versionName,
        })
        this.setState({
            id: values.id,
            content: values.content,
            forciblyUpdate: values.forciblyUpdate,
            platform: values.platform,
            popupMaxVersion: values.popupMaxVersion,
            upgradeLink: values.upgradeLink,
            upgradeMaxVersion: values.upgradeMaxVersion,
            versionCode: values.versionCode,
            versionName: values.versionName,
            loadingFinish: false,
            fileName: values.upgradeLink
        })
    }

    // 提交
    handleSubmit = e => {
        e.preventDefault();
        var arr = {}
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({ loading: true }, () => {
                    const params = JSON.parse(sessionStorage.getItem('addVersion'))
                    if (!params) {
                        arr = {
                            id: '',
                            content: values.content,
                            forciblyUpdate: values.forciblyUpdate,
                            platform: values.platform,
                            popupMaxVersion: values.popupMaxVersion,
                            upgradeLink: this.state.upgradeLink,
                            upgradeMaxVersion: values.upgradeMaxVersion,
                            versionCode: values.versionCode,
                            versionName: values.versionName,
                        }
                    } else {
                        arr = {
                            id: params.id,
                            content: values.content,
                            forciblyUpdate: values.forciblyUpdate,
                            platform: values.platform,
                            popupMaxVersion: values.popupMaxVersion,
                            upgradeLink: this.state.upgradeLink,
                            upgradeMaxVersion: values.upgradeMaxVersion,
                            versionCode: values.versionCode,
                            versionName: values.versionName,
                        }
                    }

                    delete values.keys

                    handleVersionInfo(arr).then((res) => {
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

    handleBack () {
        const data = this.props.form.getFieldsValue()
        if (data.content || data.versionCode || data.versionName) {
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

    // 校验
    versionCode = (rule, value, callback) => {
        const code = /^\d(\.\d+)+$/ 
        if (!code.test(value) && value) {
            callback('版本号格式错误，正确格式：X.X.X，X取值0-9')
        } else {
            callback()
        }
    }
    getUpdateSelected(e) {
        if (e.target) {
            this.setState({
                forciblyUpdate: e.target.value
            })
            if (e.target.value == 0) {
                this.setState({
                    upgradeMaxVersion: ''
                })
            }
        }
    }
    getPlatformSelected(e) {
        if (e.target) {
            this.setState({
                platform: e.target.value
            })
            if (e.target.value == 2) {
                this.setState({
                    upgradeLink: '',
                    fileName: ''
                })
            }
        }
    }
    //  1、上传到oss
    handleFilebeforeUpload = (file, uploadOptions) => {
        const fileName = file.name
        const index = fileName.lastIndexOf('.')
        const suffix = fileName.substring(index + 1, fileName.length);
        if (suffix.toUpperCase() !== 'APK') {
           openNotificationWithIcon('error', '请上传APK文件！')
           return false
        }
        let promise = this.ajaxGetOSSToken(fileName);
        promise = promise.then((data) => {

            uploadOptions.data = {
                name: fileName,
                key: `${data.value.dir}${fileName}`,
                policy: data.value.policy,
                OSSAccessKeyId: data.value.accessid,
                success_action_status: 200,
                signature: data.value.signature,
                url: data.value.url
            };
            uploadOptions.action = data.value.host;

            this.setState({
                OSSData: uploadOptions,
                upgradeLink: data.value.url,
                fileName: fileName
            })
            return uploadOptions;
        });
        return promise;

    }
    onChange = ({ fileList }) => {
        const { onChange } = this.props;
        if (onChange) {
          onChange([...fileList]);
        }
      };
    transformFile = file => {
        return file;
    };
    onRemove = file => {
        const { value, onChange } = this.props; 
        const files = value.filter(v => v.url !== file.url);
        if (onChange) {
          onChange(files);
        }
    };
    removeFile() {
        this.setState({
            upgradeLink: '',
            fileName: ''
        })
    }
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
            dir: 0,
            fileName: val
        }
        return new Promise(function (resolve, reject) {
            uploadVideo(params).then(res => {
                resolve({ value: res.data });
            })
        })
    };
    render () {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        const { value } = this.props;
        const props = {
            name: 'file',
            fileList: value,
            action: this.state.OSSData.action,
            onChange: this.onChange,
            onRemove: this.onRemove,
            transformFile: this.transformFile,
            data: this.getExtraData,
            beforeUpload: this.handleFilebeforeUpload,
            showUploadList: true
        };

        const { loading, loadingFinish } = this.state;
        const { getFieldDecorator } = this.props.form;
        //getFieldDecorator('keys', { initialValue: [] });
      
 
        return (
            <div className="gutter-example button-demo">
                <PageHeader onBack={clickCancel} title="版本记录" subTitle={this.state.title} />
                <div className="gutter-box">
                    <Card bordered={false}>
                        <Skeleton loading={loadingFinish} active paragraph={{ rows: 4 }} />
                        <Row gutter={16} style={{display: loadingFinish ? 'none' : 'block'}}>
                           <Form style={{ display: loadingFinish ? 'none' : 'block' }} {...formItemLayout}
                            onSubmit={this.handleSubmit} labelAlign={'right'}  
                        >
                            <FormItem label="版本号">
                                {getFieldDecorator('versionCode', {
                                    rules: [
                                        {
                                            max: 50,
                                            required: true,
                                            message: '版本号不能为空!',
                                        },
                                        {
                                            validator: this.versionCode.bind(this)
                                        }
                                    ],
                                })(
                                    <Input placeholder="版本名不能超过50个字符" style={{ width: '90%' }} />
                                )
                                }
                            </FormItem>
                            <FormItem label="版本名称">
                                {getFieldDecorator('versionName', {
                                    rules: [
                                        {
                                            max: 50,
                                            required: true,
                                            message: '版本名称不能超过50个字符',
                                        }
                                    ],
                                })(
                                    <Input placeholder="请输入版本名称" style={{ width: '90%' }} />
                                )
                                }
                            </FormItem>
                            <FormItem label="系统">
                                {getFieldDecorator('platform', {
                                    initialValue: this.state.platform,
                                })(
                                    <RadioGroup onChange={this.getPlatformSelected.bind(this)}>
                                        <Radio value={1}>Android</Radio>
                                        <Radio value={2}>IOS</Radio>
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem label="APK" style={{ display: this.state.platform == 1? 'block' : 'none' }}>
                                    <Upload {...props}>
                                        <Button type="primary"><Icon type="upload" />上传APK文件</Button>
                                    </Upload>
                                   <div style={{ display: this.state.fileName !== ''? 'block' : 'none' }}>
                                       {this.state.fileName}
                                       <Icon type="delete" 
                                            theme="twoTone" 
                                            twoToneColor="#eb2f96" 
                                            style={{ marginLeft: '17px', cursor: 'pointer'}} 
                                            onClick={this.removeFile.bind(this)} />
                                    </div>
                            </FormItem>
                            <FormItem label="普通更新下发最高版本">
                                {getFieldDecorator('popupMaxVersion', {
                                  initialValue: this.state.popupMaxVersion,
                                })(
                                    <Select placeholder="请输入或选择版本号" style={{ width: '90%' }}>
                                        {this.state.versionList.map(item => {
                                            return <Option key={item.version}
                                                value={item.version}
                                                   >{item.code}</Option>
                                        })}
                                    </Select>
                                )
                                }
                            </FormItem>
                            <FormItem label="是否强制更新">
                                {getFieldDecorator('forciblyUpdate', {
                                    initialValue: this.state.forciblyUpdate,
                                })(
                                    <RadioGroup onChange={this.getUpdateSelected.bind(this)}>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={0}>否</Radio>
                                    </RadioGroup>
                                )
                                }
                            </FormItem>
                            <FormItem label="强制更新下发最高版本" style={{ display: this.state.forciblyUpdate ? 'block' : 'none' }}>
                                {getFieldDecorator('upgradeMaxVersion', {
                                    initialValue: this.state.upgradeMaxVersion,
                                })(
                                    <Select placeholder="请输入或选择版本号" style={{ width: '90%' }}>
                                        {this.state.versionList.map(item => {
                                            return <Option key={item.version}
                                                value={item.version}
                                                   >{item.code}</Option>
                                        })}
                                    </Select>
                                )
                                }
                            </FormItem>
                            <FormItem label="升级文案">
                                {getFieldDecorator('content', {
                                    rules: [
                                        {
                                            max: 200,
                                            message: '文案内容不能超过200个字符!',
                                        },
                                    ],
                                })(
                                    <TextArea rows={4} placeholder="请输入文案内容" style={{ width: '90%' }}/>
                                )
                                }
                            </FormItem>
                            <Row>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <Button type="default" onClick={this.handleBack.bind(this)}>取消</Button>
                                    <Button type="primary" htmlType="submit" loading={loading}>确定</Button>
                                </Col>
                            </Row>
                        </Form>
                        </Row>
                    </Card>
                </div>
            </div>
        )
    }
}

const BasicForm = Form.create()(AddVersion);

export default BasicForm;
