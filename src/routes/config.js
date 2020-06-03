export const admin = () => {
    return {
        menus: [ // 菜单相关路由
            {key: '/app/dashboard/index', title: '后台首页', icon: 'home', component: 'Dashboard'},
            {
                key: '/app/commodity', title: '商品管理', icon: 'shopping-cart',
                subs: [
                    // {key: '/app/commodity/attractGoods', title: '招商商品', hidden: false, component: 'AttractGoods'},
                    // {
                    //     key: '/app/commodity/children/addAttractGoods',
                    //     title: '新增招商商品',
                    //     hidden: true,
                    //     paren: '/app/commodity/attractGoods',
                    //     component: 'AddAttractGoods'
                    // },
                    {key: '/app/commodity/operateGoods', title: '商品录入', hidden: false, component: 'OperateGoods'},
                    {
                        key: '/app/commodity/children/addOperateGoods',
                        title: '新增商品',
                        hidden: true,
                        component: 'AddOperateGoods'
                    },
                    {
                        key: '/app/commodity/children/settleAttractGoods',
                        title: '结算',
                        hidden: true,
                        component: 'SettleAttractGoods'
                    },
                    {key: '/app/commodity/ScalpingGoods', title: '自营商品', hidden: false, component: 'ScalpingGoods'},
                    {
                        key: '/app/commodity/children/addScalpingGoods',
                        title: '新增运自营商品',
                        hidden: true,
                        component: 'AddScalpingGoods'
                    },
                    {
                        key: '/app/commodity/ScalpingGoods4.0',
                        title: '自营商品4.0',
                        hidden: false,
                        component: 'ScalpingGoods4'
                    },
                    {
                        key: '/app/commodity/children/addScalpingGoods4.0',
                        title: '新增运自营商品4.0',
                        hidden: true,
                        component: 'AddScalpingGoods4'
                    },
                ]
            },
            {
                key: '/app/orders', title: '订单管理', icon: 'ordered-list',
                subs: [
                    {key: '/app/orders/orders', title: '订单收益列表', hidden: false, component: 'Orders'},
                    {key: '/app/orders/children/addOrder', title: '录入订单', hidden: true, component: 'AddOrder'},
                    {
                        key: '/app/orders/children/promptlyOrder',
                        title: '立即补单',
                        hidden: true,
                        component: 'PromptlyOrder'
                    },
                    {key: '/app/orders/safeguard', title: '找回订单表', hidden: false, component: 'Safeguard'},
                    {key: '/app/orders/ScalpingOrder', title: '自营商品订单', hidden: false, component: 'ScalpingOrder'},
                    {
                        key: '/app/orders/children/ViewCalpingDetail',
                        title: '自营商品订单详情',
                        hidden: true,
                        component: 'ViewCalpingDetail'
                    },
                    {
                        key: '/app/orders/ScalpingOrder4.0',
                        title: '自营商品订单4.0',
                        hidden: false,
                        component: 'ScalpingOrder4'
                    },
                    {
                        key: '/app/orders/children/ViewCalpingDetail4.0',
                        title: '自营商品订单详情4.0',
                        hidden: true,
                        component: 'ViewCalpingDetail4'
                    }
                ]
            },
            {
                key: '/app/column', title: '栏目管理', icon: 'copy',
                subs: [
                    {key: '/app/column/column', title: '首页精选', component: 'Column'}
                ]
            },
            {
                key: '/app/marketing', title: '推广管理', icon: 'edit',
                subs: [
                    {key: '/app/marketing/searchTerms', title: '搜索词管理', hidden: false, component: 'SearchTerms'},
                    {key: '/app/marketing/children/addSeeker', title: '新增搜索词', hidden: true, component: 'AddSeeker'},
                    {key: '/app/marketing/resource', title: '资源位管理', hidden: false, component: 'Resource'},
                    {key: '/app/marketing/children/advertising', title: '新增广告', hidden: true, component: 'Advertising'},
                    {key: '/app/marketing/banners', title: '横幅管理', hidden: false, component: 'Banners'},
                    {key: '/app/marketing/children/addbanner', title: '新增横幅', hidden: true, component: 'AddBanner'},
                    // {key: '/app/marketing/doufu', title: '豆腐块管理', hidden: false, component: 'Doufu'},
                    {key: '/app/marketing/children/addDoufu', title: '新增豆腐块', hidden: true, component: 'AddDoufu'},
                    {key: '/app/marketing/homePit', title: '首页活动坑位', hidden: false, component: 'HomePit'},
                    {key: '/app/marketing/children/addHomePit', title: '新增活动坑位', hidden: true, component: 'AddHomePit'},
                    {key: '/app/marketing/activityDialog', title: '活动弹窗', hidden: false, component: 'ActivityDialog'},
                    {key: '/app/marketing/bottomMsg', title: '首页底部消息条', hidden: false, component: 'BottomMsg'},
                    {key: '/app/marketing/children/addbottom', title: '新增首页底部消息条', hidden: true, component: 'AddBottom'},
                    {
                        key: '/app/marketing/children/addActivityDialog',
                        title: '新增横幅',
                        hidden: true,
                        component: 'AddActivityDialog'
                    },
                ],
            },
            {
                key: '/app/share', title: '分享管理', icon: 'share-alt', subs: [
                    {key: '/app/share/recommendGoods', title: '商品推荐', hidden: false, component: 'RecommendGoods'},
                    {
                        key: '/app/share/children/AddRecommendGoods',
                        title: '新增推荐商品',
                        hidden: true,
                        component: 'AddRecommendGoods'
                    },
                    {key: '/app/share/materialGoods', title: '必发素材', hidden: false, component: 'MaterialGoods'},
                    {key: '/app/share/children/addMaterial', title: '新增素材', hidden: true, component: 'AddMaterial'},
                ]
            },
            {
                key: '/app/activityField', title: '活动专场管理', icon: 'mobile',
                subs: [
                    {key: '/app/activityField/event', title: '活动管理', hidden: false, component: 'Event'},
                    {key: '/app/activityField/children/addEvent', title: '新增活动', hidden: true, component: 'AddEvent'},
                    {
                        key: '/app/activityField/field/SpecialManagement',
                        title: '专场管理',
                        hidden: false,
                        component: 'SpecialManagement'
                    },
                    {
                        key: '/app/activityField/field/children/AddManagement',
                        title: '新增专场',
                        hidden: true,
                        component: 'AddManagement'
                    },
                    {
                        key: '/app/activityField/field/SpecialMerchandise',
                        title: '专场商品',
                        hidden: true,
                        component: 'SpecialMerchandise'
                    },
                    {
                        key: '/app/activityField/field/children/AddGoods',
                        title: '新增专场商品',
                        hidden: true,
                        component: 'AddGoods'
                    },
                    {
                        key: '/app/activityField/field/children/EditGoods',
                        title: '编辑专场商品',
                        hidden: true,
                        component: 'EditGoods'
                    },
                    
                    {key: '/app/activityField/assemblyhall', title: '组合会场', hidden: false, component: 'AssemblyHall'},
                    {key: '/app/activityField/AssBanner', title: 'banner', hidden: false, component: 'AssBanner'},
                    {key: '/app/activityField/Imgcom', title: '图片组合区', hidden: false, component: 'Imgcom'},
                    {key: '/app/activityField/themeGoods', title: '主题商品区', hidden: false, component: 'ThemeGoods'},
                    {key: '/app/activityField/children/AddHall', title: '新增会场', hidden: true, component: 'AddHall'},
                    {key: '/app/activityField/children/AddBanner', title: '新增Banner', hidden: true, component: 'AddBannerContent'},
                    {key: '/app/activityField/children/AddImg', title: '新增图片组合去', hidden: true, component: 'AddImg'},
                    {key: '/app/activityField/children/AddTheme', title: '新增主题商品', hidden: true, component: 'AddTheme'},
           
                ]
            },
            {
                key: '/app/member', title: '会场转链管理', icon: 'link',
                subs: [
                    {key: '/app/member/linkList', title: '转链页管理', hidden: false, component: 'LinkList'},
                    {key: '/app/member/children/addLink', title: '新增会场链接', hidden: true, component: 'AddLink'},

                ]
            },
            {
                key: '/app/application', title: '应用配置', icon: 'appstore',
                subs: [
                    {key: '/app/application/footNav', title: '底部导航', hidden: false, component: 'FootNav'},
                    {key: '/app/application/children/addFootNav', title: '新增导航', hidden: true, component: 'AddFootNav'},
                    {key: '/app/application/mine', title: '我的页面', hidden: false, component: 'mine'},
                    {
                        key: '/app/application/entryManagement',
                        title: '入口管理',
                        hidden: true,
                        component: 'entryManagement'
                    },
                    {
                        key: '/app/application/children/AddManagment',
                        title: '新增入口',
                        hidden: true,
                        component: 'AddManagment'
                    },
                    {key: '/app/application/children/addMine', title: '新增模块', hidden: true, component: 'addMine'},
                    {key: '/app/application/notice', title: '通知管理', hidden: false, component: 'Notice'},
                    {key: '/app/application/children/addNotice', title: '新增通知', hidden: true, component: 'AddNotice'},
                    {key: '/app/application/poster', title: '海报推广', hidden: false, component: 'poster'},
                    {key: '/app/application/children/AddPoster', title: '新增海报', hidden: true, component: 'AddPoster'},
                    {key: '/app/application/Version', title: '版本记录', hidden: false, component: 'Version'},
                    {key: '/app/application/children/AddVersion', title: '新增版本', hidden: true, component: 'AddVersion'},
                ]
            },
            {
                key: '/app/tile', title: '首页布局配置', icon: 'layout', subs: [
                    {key: '/app/tile/tile', title: '瓷片区管理', hidden: false, component: 'Tile'},
                    {key: '/app/tile/children/addTile', title: '新增', hidden: true, component: 'AddTile'},
                    // {key: '/app/tile/tileTest', title: '拖拽测试', hidden: false, component: 'TileTest'},
                    {key: '/app/tile/message', title: '消息栏管理', hidden: false, component: 'Message'},
                    {
                        key: '/app/tile/children/addMessageStyle',
                        title: '新增消息',
                        hidden: true,
                        component: 'AddMessageStyle'
                    },
                    {key: '/app/tile/goodsSpecial', title: '商品专题管理', hidden: false, component: 'GoodsSpecial'},
                    {
                        key: '/app/tile/children/addGoodsSpecial',
                        title: '新增商品专题',
                        hidden: true,
                        component: 'AddGoodsSpecial'
                    },
                    {key: '/app/tile/video', title: '视频专题管理', hidden: false, component: 'Video'},
                    {key: '/app/tile/children/addVideo', title: '新增视频专题', hidden: true, component: 'AddVideo'},
                    {key: '/app/tile/freeCharge', title: '新人专区', component: 'FreeCharge'},
                    {
                        key: '/app/tile/children/addFreeCharge',
                        title: '新人专区商品',
                        hidden: true,
                        component: 'AddFreeCharge'
                    },
                    {key: '/app/tile/todaypush', title: '二级页广告位', component: 'Todaypush'},
                    {key: '/app/tile/children/AddTodayPush', title: '二级页广告位', hidden: true, component: 'AddTodayPush'},
                ]
            },
            {
                key: '/app/chooseLib', title: '选品库', icon: 'taobao', subs: [
                    {key: '/app/chooseLib/myChooseLib', title: '我的选品库', hidden: false, component: 'MyChooseLib'},
                    {key: '/app/chooseLib/hrzSalesList', title: '红人装销量榜', hidden: false, component: 'HrzSalesList'},
                    {key: '/app/chooseLib/haodankuList', title: '好单库榜单', hidden: false, component: 'HaodankuList'},
                    {key: '/app/chooseLib/children/chooseRuleLib', title: '选品规则', hidden: true, component: 'ChooseRuleLib'},
                    {key: '/app/chooseLib/children/chooseGoodsLib', title: '指定商品', hidden: true, component: 'ChooseGoodsLib'},
                    {key: '/app/chooseLib/children/setGoodsLib', title: '设置商品选品库', hidden: true, component: 'SetGoodsLib'},
                    {key: '/app/chooseLib/children/setRuleLib', title: '设置规则选品库', hidden: true, component: 'SetRuleLib'},
                ]
            },
            // {
            //     key: '/app/chooseLib', title: '组合会场', icon: 'edit', subs: [
            //         {key: '/app/assemblyhall/assemblyhall', title: '组合会场', hidden: false, component: 'AssemblyHall'},
            //         {key: '/app/assemblyhall/AssBanner', title: 'banner', hidden: false, component: 'AssBanner'},
            //         {key: '/app/assemblyhall/Imgcom', title: '图片组合区', hidden: false, component: 'Imgcom'},
            //         {key: '/app/assemblyhall/themeGoods', title: '主题商品区', hidden: false, component: 'ThemeGoods'},
            //         {key: '/app/assemblyhall/children/AddHall', title: '新增会场', hidden: true, component: 'AddHall'},
            //         {key: '/app/assemblyhall/children/AddBanner', title: '新增Banner', hidden: true, component: 'AddBannerContent'},
            //         {key: '/app/assemblyhall/children/AddImg', title: '新增图片组合去', hidden: true, component: 'AddImg'},
            //         {key: '/app/assemblyhall/children/AddTheme', title: '新增主题商品', hidden: true, component: 'AddTheme'},
            //     ]
            // },
            {key: '/app/proposal/proposal', title: '建议及投诉', icon: 'check', component: 'Proposal'},
            {key: '/app/messageCenter/messageCenter', title: '推送管理', icon: 'message', component: 'MessageCenter'},
            {key: '/app/users/users', title: '用户管理', icon: 'user', component: 'Users'},
            {key: '/app/earnings/earnings', title: '收益管理', icon: 'dollar', component: 'Earnings'},
            {key: '/app/withdraw/withdraw', title: '提现管理', icon: 'money-collect', component: 'Withdraw'},
            {key: '/app/logistics/logistics', title: '物流管理', icon: 'car', component: 'Logistics'},
            {
                key: '/app/safetyAndSetting/safetyAndSetting',
                title: '安全与设置',
                icon: 'property-safety',
                component: 'SafetyAndSetting'
            }
        ],
        others: [] // 非菜单相关路由
    }
}
export const visitor = () => {
    return {
        menus: [ // 菜单相关路由
            {
                key: '/app/commodity', title: '商品管理', icon: 'shopping-cart',
                subs: [
                    {key: '/app/commodity/ScalpingGoods', title: '自营商品', hidden: false, component: 'ScalpingGoods'},
                    {
                        key: '/app/commodity/children/addScalpingGoods',
                        title: '新增运自营商品',
                        hidden: true,
                        component: 'AddScalpingGoods'
                    },
                ]
            },
            {
                key: '/app/orders', title: '订单管理', icon: 'ordered-list',
                subs: [
                    {key: '/app/orders/ScalpingOrder', title: '自营商品订单', hidden: false, component: 'ScalpingOrder'},
                    {
                        key: '/app/orders/children/ViewCalpingDetail',
                        title: '自营商品订单详情',
                        hidden: true,
                        component: 'ViewCalpingDetail'
                    },
                ]
            }
        ],
        others: [] // 非菜单相关路由
    }
}
