/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, {Component} from 'react';
import {Layout} from 'antd';
import {withRouter} from 'react-router-dom';
import {admin} from '../routes/config';
import SiderMenu from './SiderMenu';
import {resetAllValue} from '../store/actionCreators'

const {Sider} = Layout;

class SiderCustom extends Component {
    static getDerivedStateFromProps(props, state) {
        if (props.collapsed !== state.collapsed) {
            const state1 = SiderCustom.setMenuOpen(props);
            const state2 = SiderCustom.onCollapse(props.collapsed);
            return {
                ...state1,
                ...state2,
                firstHide: state.collapsed !== props.collapsed && props.collapsed, // 两个不等时赋值props属性值否则为false
                openKey: state.openKey || (!props.collapsed && state1.openKey)
            }
        }
        return null;
    }

    static setMenuOpen = props => {
        const {pathname} = props.location;
        // 获取标题名
        let newOpenKey
        let newPathname = pathname
        admin().menus.map(item => {
            if (pathname.indexOf('children') !== -1) {
                // 三级目录
                if (pathname.substr(0, pathname.indexOf('/children')) === item.key) {
                    newOpenKey = item.title
                    newPathname = pathname.substr(0, pathname.lastIndexOf('/')) // todo 需要重新调整路由嵌套
                }
            } else {
                // 二级目录
                if (pathname.substr(0, pathname.lastIndexOf('/')) === item.key) {
                    newOpenKey = item.title
                }
            }
        })
        return {
            openKey: newOpenKey,
            selectedKey: newPathname
        };
    };
    static onCollapse = (collapsed) => {
        return {
            collapsed,
            // firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        };
    };

    constructor(props) {
        super(props)
        this.state = {
            mode: 'inline',
            openKey: '',
            selectedKey: '',
            firstHide: true, // 点击收缩菜单，第一次隐藏展开子菜单，openMenu时恢复
        };
    }

    componentDidMount() {
        // this.setMenuOpen(this.props);
        const state = SiderCustom.setMenuOpen(this.props);
        this.setState(state);
    }

    menuClick = e => {
        if (e.keyPath.length > 1) {
            this.setState({
                selectedKey: e.key
            });
        } else {
            this.setState({
                selectedKey: e.key
            });
        }
        const {popoverHide} = this.props; // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
        // 重置页码
        resetAllValue()
        // this.props.handleMenu();
    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
    };

    render() {
        const {selectedKey, openKey, firstHide, collapsed} = this.state;
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={collapsed}
                style={{overflowY: 'auto'}}>
                <div className="logo" style={{textAlign: 'center', background: 'none'}}>
                    <img src="images/logo.png" alt="logo" style={
                        collapsed ? {width: '40px'} : {width: '80px'}
                    }/>
                    <span style={{
                        color: '#fff',
                        fontSize: '16px'
                    }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>
                <SiderMenu
                    menus={admin().menus}
                    onClick={this.menuClick}
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}
                />
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>

        )
    }
}

export default withRouter(SiderCustom);
