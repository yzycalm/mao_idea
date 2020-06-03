/**
 * Created by smart-yc
 */
import React, {Component} from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import AllComponents from '../components';
// import routesConfig from './config';
import {admin} from './config';
import queryString from 'query-string';
// 顶部加载条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const {auth} = this.props;
        const {permissions} = auth.data;
        // const { auth } = store.getState().httpData;
        if (!permissions || !permissions.includes(permission)) return <Redirect to={'404'} />;
        return component;
    };
    requireLogin = (component, permission) => {
        // todo 路由拦截
        NProgress.start();
        // const {auth} = this.props;
        // const {permissions, userName} = auth.data;
        if (!localStorage.getItem('user')) {
            NProgress.done();
            return <Redirect to={'/login'} />;
        } else {
            NProgress.done();
        }
        return component;
    };

    render() {
        const routes = admin()
        return (
            <Switch>
                {
                    Object.keys(routes).map(key =>
                        routes[key].map(r => {
                            const route = r => {
                                const Component = AllComponents[r.component];
                                return (
                                    <Route
                                        key={r.route || r.key}
                                        exact
                                        path={r.route || r.key}
                                        render={props => {
                                            const reg = /\?\S*/g;
                                            // 匹配?及其以后字符串
                                            const queryParams = window.location.hash.match(reg);
                                            // 去除?的参数
                                            const {params} = props.match;
                                            Object.keys(params).forEach(key => {
                                                params[key] = params[key] && params[key].replace(reg, '');
                                            });
                                            props.match.params = {...params};
                                            const merge = {
                                                ...props,
                                                query: queryParams ? queryString.parse(queryParams[0]) : {}
                                            };
                                            // 重新包装组件
                                            const wrappedComponent = (
                                                <DocumentTitle title={r.title}>
                                                    <Component {...merge} />
                                                </DocumentTitle>
                                            )
                                            return r.login
                                                ? wrappedComponent
                                                : this.requireLogin(wrappedComponent, r.auth)
                                        }}
                                    />
                                )
                            }
                            return r.component ? route(r) : r.subs.map(r => route(r));
                        })
                    )
                }

                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}
