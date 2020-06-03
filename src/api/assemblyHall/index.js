import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'
const host = BASE_URL
// 获取活动列表
export const getActList = (data) => post({ url: `${host}/activity/gp/monographic/get`, data: data });

// 新增/编辑组合会场
export const addOrUpdate = (data) => post({ url: `${host}/activity/gp/scene/addOrUpdate`, data: data });

// 组合会场列表
export const list = (data) => post({ url: `${host}/activity/gp/scene/search/list`, data: data });

// 获取组合会场详情信息
export const get = (data) => post({ url: `${host}/activity/gp/scene/get`, data: data });

// 操作组合会场
export const actionScene = (data) => post({ url: `${host}/activity/gp/scene/action`, data: data });

// Banner列表
export const listBanner = (data) => post({ url: `${host}/activity/gp/scene/banner/search/list`, data: data });

// 获取活动-专场列表
export const getList = (data) => post({ url: `${host}/activity/gp/featured/get`, data: data });

// 新增/编辑组合会场banner
export const addOrUpdateBanner = (data) => post({ url: `${host}/activity/gp/scene/banner/addOrUpdate`, data: data });

// 操作组合会场banner
export const actionBanner = (data) => post({ url: `${host}/activity/gp/scene/banner/action`, data: data });

// 操作图片组合区
export const ActionImg = (data) => post({ url: `${host}/activity/gp/scene/block/action`, data: data });

// 获取组合会场列表
export const AssList = () => post({ url: `${host}/activity/gp/scene/select/list` });  

// 获取组合会场banner详情信息
export const AssDetails = (data) => post({ url: `${host}/activity/gp/scene/banner/get`,  data: data }); 

// 获取主题商品区详情信息
export const ThemeDetails = (data) => post({ url: `${host}/activity/gp/scene/theme/get`,  data: data }); 

// 新增/编辑-主题商品
export const AddTheme = (data) => post({ url: `${host}/activity/gp/scene/theme/addOrUpdate`,  data: data }); 

// 新增/编辑-图片组合区
export const AddImg = (data) => post({ url: `${host}/activity/gp/scene/block/addOrUpdate`,  data: data }); 

// 主题商品列表
export const themeList = (data) => post({ url: `${host}/activity/gp/scene/theme/search/list`,  data: data }); 

// 操作组合会场主题商品
export const actionTheme = (data) => post({ url: `${host}/activity/gp/scene/theme/action`,  data: data }); 

// 搜索图片组合区列表
export const ImgList = (data) => post({ url: `${host}/activity/gp/scene/block/search/list`,  data: data }); 

// 获取图片组合区详情信息
export const ImgDetails = (data) => post({ url: `${host}/activity/gp/scene/block/get`,  data: data }); 



