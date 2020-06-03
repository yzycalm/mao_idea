import { post, get } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'
const host = BASE_URL
// 搜索词管理列表
export const findByList = (data) => post({ url: `${host}/product/heatSearch/findByList`, data: data });
// 停止
export const stopSearch = (data) => post({ url: `${host}/product/heatSearch/stop`, data: data });
// 删除
export const deleteSearch = (data) => post({ url: `${host}/product/heatSearch/delete`, data: data });
// 新建
export const saveSearch = (data) => post({ url: `${host}/product/heatSearch/save`, data: data });
// 查询
export const findInfo = (id) => get({ url: `${host}/product/heatSearch/info?id=${id}` });
