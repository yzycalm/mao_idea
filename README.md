# 4.0运营支撑系统

![travis-ci](https://travis-ci.org/yezihaohao/react-admin.svg?branch=master)

### 前言
> 启动和打包的时间都稍长，请耐心等待两分钟

- [阿里云地址](https://code.aliyun.com/)

### 功能模块
<span style="color: rgb(184,49,47);">备注：项目只引入了ant-design的部分组件，其他的组件antd官网有源码，可以直接复制到项目中使用。</span>

<span style="color: rgb(184,49,47);">项目使用了antd的自定义主题功能-->黑色，若想替换其他颜色，具体操作请查看antd官网</span>
<!--more-->

- 首页
    - 完整布局
    - 换肤(全局功能，暂时只实现了顶部导航的换肤)
- 导航菜单
    - 顶部导航(菜单伸缩)
    - 左边菜单(增加滚动条以及适配路由的active操作)
- 页面
    - 登录页面
    - 404页面

### 代码目录
```js
+-- build/                                  ---打包的文件目录
+-- config/                                 ---npm run eject 后的配置文件目录
+-- node_modules/                           ---npm下载文件目录
+-- public/
|   --- index.html							---首页入口html文件
|   --- npm.json							---echarts测试数据
|   --- weibo.json							---echarts测试数据
+-- src/                                    ---核心代码目录
|   +-- axios                               ---http请求存放目录
|   |    --- index.js
|   +-- components                          ---各式各样的组件存放目录
|   |    +-- dashboard                      ---首页组件
|   |    |    --- ...
|   |    +-- commodity                      ---商品管理
|   |    |    --- ...
|   |    +-- orders                         ---订单管理
|   |    |    --- ...
|   |    +-- column                         ---栏目管理
|   |    |    --- ...
|   |    +-- marketing                      ---推广管理
|   |    |    --- ...
|   |    +-- messageCenter                  ---消息中心
|   |    |    --- ...
|   |    +-- users                          ---用户管理
|   |    |    --- ...
|   |    +-- earning                        ---收益管理
|   |    |    --- ...
|   |    +-- withdraw                       ---提现管理
|   |    |    --- ...
|   |    +-- logistics                      ---物流管理
|   |    |    --- ...
|   |    +-- safetyAndSetting               ---安全与设置
|   |    |    --- ...
|   |    +-- pages                          ---页面组件
|   |    |    --- ...
|   |    --- BreadcrumbCustom.jsx           ---面包屑组件
|   |    --- HeaderCustom.jsx               ---顶部导航组件
|   |    --- Page.jsx                       ---页面容器
|   |    --- SiderCustom.jsx                ---左边菜单组件
|   +-- style                               ---项目的样式存放目录，主要采用less编写
|   +-- utils                               ---工具文件存放目录
|   --- App.js                              ---组件入口文件
|   --- index.js                            ---项目的整体js入口文件，包括路由配置等
--- .env                                    ---启动项目自定义端口配置文件
--- .eslintrc                               ---自定义eslint配置文件，包括增加的react jsx语法限制
--- package.json                            ---所有依赖
```
### 安装运行
##### 1.下载或克隆项目源码
##### 2.yarn 或者 npm安装相关包文件(首先推荐使用yarn，国内建议增加淘宝镜像源，不然很慢，你懂的😁)
> 有些老铁遇到运行时报错，首先确定下是不是最新稳定版的nodejs和npm或者yarn(推荐用yarn)，切记不要用cnpn

```js
// 首推荐使用yarn装包
yarn or npm i
```
##### 3.启动项目
```js
yarn start or npm start
```
##### 4.打包项目
```js
yarn build or npm run build
```

### 结尾
希望大家能够学到更多东西，后续根据项目逐渐完善代码目录
