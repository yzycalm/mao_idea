/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, {Component} from 'react';
import avater from '../style/imgs/b1.jpg';
import SiderCustom from './SiderCustom';
import {Menu, Icon, Layout, Popover} from 'antd';
import {withRouter} from 'react-router-dom';
// import { PwaInstaller } from './widget';
import {connectAlita} from 'redux-alita';
import { resetAllValue } from '../store/actionCreators'

const {Header} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeaderCustom extends Component {
    state = {
        user: '',
        visible: false,
    };

    componentDidMount() {
        const _user = JSON.parse(localStorage.getItem('user')) || '测试';
        this.setState({
            user: _user
        });
    };
    menuClick = e => {
        console.log(e);
        e.key === 'logout' && this.logout();
    };
    logout = () => {
        localStorage.removeItem('user');
        resetAllValue()
        this.props.history.push('/login')
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible) => {
        this.setState({visible});
    };

    render() {
        const {responsive = {data: {}}, path} = this.props;
        return (
            <Header className="custom-theme header">
                {
                    responsive.data.isMobile ? (
                        <Popover content={<SiderCustom path={path} popoverHide={this.popoverHide}/>} trigger="click"
                                 placement="bottomLeft" visible={this.state.visible}
                                 onVisibleChange={this.handleVisibleChange}>
                            <Icon type="bars" className="header__trigger custom-trigger"/>
                        </Popover>
                    ) : (
                        <Icon
                            className="header__trigger custom-trigger"
                            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.props.toggle}
                        />
                    )
                }
                <Menu
                    mode="horizontal"
                    style={{lineHeight: '64px', float: 'right'}}
                    onClick={this.menuClick}
                >
                    <SubMenu className="user-info" title={<span className="avatar"><img src={avater} alt="头像"/><i
                        className="on bottom b-white"/></span>}>
                        <MenuItemGroup  title="用户中心">
                            <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                        </MenuItemGroup>
                        <MenuItemGroup title="设置中心">
                            <Menu.Item key="setting:3">个人设置</Menu.Item>
                            <Menu.Item key="setting:4">系统设置</Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>
            </Header>
        )
    }
}

export default withRouter(connectAlita(['responsive'])(HeaderCustom));
