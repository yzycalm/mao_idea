import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'

const host = BASE_URL

// 转链页列表
export const getVenueLinkList = (data) => post({ url: `${host}/activity/scene/getSceneList`, data: data });
// 新增/修改转链页
export const addOrEditVenueLink = (data) => post({ url: `${host}/activity/scene/saveOrUpdateScene`, data: data });
// 删除
export const deleteVenueLink = (data) => post({ url: `${host}/activity/scene/removeScene`, data: data });
// 查看详情
export const viewVenueLink = (data) => post({ url: `${host}/activity/scene/getDouble11Scene`, data: data });
// 判断会场链接是否重复
export const isExistScene = (data) => post({ url: `${host}/activity/scene/noExistScene`, data: data });
// 一键更新
export const updateScene = () => post({ url: `${host}/activity/scene/update/scenes/cache` });
// 导出数据
export const exportScene = (data) => post({ url: `${host}/activity/scene/excel/export`, data: data });
