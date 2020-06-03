import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'
const host = BASE_URL
// 资源位管理列表
export const findBannerEntranceList = (data) => post({ url: `${host}/activity/bannerEntrance/findBannerEntranceList`, data: data });
// 停止
export const stopBannerEntranceById = (data) => post({ url: `${host}/activity/bannerEntrance/stopBannerEntranceById`, data: data });
// 删除
export const deleteBannerEntranceById = (data) => post({ url: `${host}/activity/bannerEntrance/deleteBannerEntranceById`, data: data });
// 新建
export const saveBannerEntrance = (data) => post({ url: `${host}/activity/bannerEntrance/saveOrUpdateBannerEntrance`, data: data });
// 编辑
export const updateBannerEntrance = (data) => post({ url: `${host}/activity/bannerEntrance/updateBannerEntranceImg`, data: data });
// 查询
export const findBannerEntrance = (data) => post({ url: `${host}/activity/bannerEntrance/findByBannerEntranceId`, data: data });
