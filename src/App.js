import React, {Component} from 'react';
import Routes from './routes';
import DocumentTitle from 'react-document-title';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import {BackTop, Layout, LocaleProvider} from 'antd';
import {ThemePicker} from './components/widget';
import {connectAlita} from 'redux-alita';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {overwriteAssign} from './utils'

moment.locale('zh-cn');
const {Content} = Layout;
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            title: ''
        };
    }

    componentWillMount() {
        overwriteAssign();
        const {setAlitaState} = this.props;
        const user = JSON.parse(localStorage.getItem('user'));
        // user && receiveData(user, 'auth');
        user && setAlitaState({stateName: 'auth', data: user});
        // receiveData({a: 213}, 'auth');
        // fetchData({funcName: 'admin', stateName: 'auth'});
        this.getClientWidth();
        window.onresize = () => {
            this.getClientWidth();
        }
    }

    getClientWidth = () => { // 获取当前浏览器宽度并设置responsive管理响应式
        const {setAlitaState} = this.props;
        const clientWidth = window.innerWidth;
        setAlitaState({stateName: 'responsive', data: {isMobile: clientWidth <= 992}});
        // receiveData({isMobile: clientWidth <= 992}, 'responsive');
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const {title} = this.state;
        const {auth = {data: {}}, responsive = {data: {}}} = this.props;
        return (
            <DocumentTitle title={title}>
                <Layout>
                    {!responsive.data.isMobile && <SiderCustom collapsed={this.state.collapsed} />}
                    {/*<ThemePicker />*/}
                    <Layout id={'layoutRef'} style={{flexDirection: 'column'}}>
                        <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth.data || {}} />
                        <LocaleProvider locale={zh_CN}>
                            <Content style={{margin: '16px', overflow: 'initial', flex: '1 1 0'}}>
                                <Routes auth={auth} />
                                <BackTop visibilityHeight={1080} target ={()=>document.getElementById('layoutRef')} style={{zIndex: 1000000000}}>
                                    <img src="images/back.png"style={{width: '50px', height: '50px'}} alt="" />
                                </BackTop>
                            </Content>
                        </LocaleProvider>
                    </Layout>
                </Layout>
            </DocumentTitle>
        );
    }
}

export default connectAlita(['auth', 'responsive'])(App);
