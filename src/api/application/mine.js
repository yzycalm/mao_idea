import { post, get } from '../../axios/tools';
import {BASE_URL, ORDER_URL} from '../../axios/config'
const host = BASE_URL
// 获取类型列表
export const findSysContentTypeList = (data) => post({ url: `${host}/syssetting/content/findSysContentTypeList`, data: data });

// 添加更新列表
export const addOrUpdateSysContentType = (data) => post({ url: `${host}/syssetting/content/addOrUpdateSysContentType`, data: data });

// 删除类型
export const deleteSysContentTypeById = (data) => post({ url: `${host}/syssetting/content/deleteSysContentTypeById`, data: data });

// 获取我的菜单列表
export const findSysContentList = (data) => post({ url: `${host}/syssetting/content/findSysContentList`, data: data });

//添加/更新我的菜单
export const addOrUpdateSysContent = (data) => post({ url: `${host}/syssetting/content/addOrUpdateSysContent`, data: data });

//获取我的菜单详情
export const findSysContentById = (data) => post({ url: `${host}/syssetting/content/findSysContentById`, data: data });


//删除我的菜单
export const deleteSysContentById = (data) => post({ url: `${host}/syssetting/content/deleteSysContentById`, data: data });
