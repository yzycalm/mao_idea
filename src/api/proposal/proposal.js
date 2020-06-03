import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'

const host = BASE_URL

// 获取活动列表
export const getProposalList = (data) => post({ url: `${host}/admin/sys/setting/suggestion/and/complaint/list`, data: data });

// 导出
export const exportPro = (data) => post({ url: `${host}/admin/sys/setting/suggestion/and/complaint/export`, data: data });



