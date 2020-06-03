import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'
const host = BASE_URL
// 豆腐块管理列表
export const findBeanCurdList = (data) => post({ url: `${host}/activity/beanCurd/findBeanCurdList`, data: data });
// 删除
export const deleteByFlag = (data) => post({ url: `${host}/activity/beanCurd/deleteByFlag`, data: data });
// 新建 and 编辑
export const saveOrUpdateBeanCurd = (data) => post({ url: `${host}/activity/beanCurd/saveOrUpdateBeanCurd`, data: data });
// 停止
export const stopByFlag = (data) => post({ url: `${host}/activity/beanCurd/stopByFlag`, data: data });
// 查询
export const findActivityBlockByFlag = (data) => post({ url: `${host}/activity/beanCurd/findActivityBlockByFlag`, data: data });
