/**
 * Created by smart-yc
 */
import React from 'react';
import { Form, Icon, Input, Button, Row, Col, Modal } from 'antd';
import { connectAlita } from 'redux-alita';
import { BASE_URL } from '../../axios/config'
import { login } from '../../api/login'

const host = BASE_URL

const FormItem = Form.Item;

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            captcha: host + '/captcha.jpg',
            loading: false
        }
    }

    componentDidMount () {
        const { setAlitaState } = this.props;
        setAlitaState({ stateName: 'auth', data: null });
    }

    componentDidUpdate (prevProps) { // React 16.3+弃用componentWillReceiveProps
        // const { history } = this.props;
        // console.log(nextAuth.data && nextAuth.data.uid)
        // if (nextAuth.data && nextAuth.data.uid) { // 判断是否登陆
        // const userInfo = {"uid":1,"permissions":["auth","auth/testPage","auth/authPage","auth/authPage/edit","auth/authPage/visit"],"role":"系统管理员","roleType":1,"userName":"系统管理员"}
        // if (localStorage.getItem('user')) {
        //     localStorage.setItem('user', JSON.stringify(userInfo));
        //     history.push('/');
        //     }
        // }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        }, () => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    values.username = values.username.replace(/(^\s*)|(\s*$)/g, "") // 去除账号前后空格
                    values.password = values.password.replace(/(^\s*)|(\s*$)/g, "")
                    login(values).then(res => {
                        this.setState({
                            loading: false
                        })
                        if (res && res.success) {
                            const userInfo = { "uid": 1, "permissions": [], "userName": values.username }
                            const { history } = this.props;
                            localStorage.setItem('user', JSON.stringify(userInfo));
                            history.push('/');
                        } else {
                            Modal.error({
                                title: '登录失败',
                                content: '用户名或密码错误，请检查后重新输入!',
                                centered: true,
                                okText: '确定'
                            });
                            // this.refreshCode()
                        }
                    })
                } else {
                    this.setState({
                        loading: false
                    })
                }
            });
        })
    };
    refreshCode = () => {
        this.setState({
            captcha: host + '/captcha.jpg?random=' + Math.random()
        })
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.state;
        return (
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <span>红人装4.0运营支撑系统</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{ maxWidth: '300px' }}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                                    placeholder="管理员输入admin"
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password"
                                    placeholder="管理员输入admin"
                                />
                            )}
                        </FormItem>
                        <FormItem style={{ display: "none" }}>
                            <Row gutter={8}>
                                <Col span={12}>
                                    <img src={this.state.captcha} style={{ width: '120px', height: '33px' }} alt=""
                                        onClick={this.refreshCode.bind(this)}
                                    />
                                </Col>
                                <Col span={12}>
                                    {/*{getFieldDecorator('captcha', {*/}
                                    {/*    rules: [{required: true, message: '请输入验证码!'}],*/}
                                    {/*})(*/}
                                    {/*    <Input placeholder="请输入验证码"/>*/}
                                    {/*)}*/}
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button"
                                loading={loading}
                                style={{ width: '100%' }}
                            >
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default connectAlita(['auth'])(Form.create()(Login));
