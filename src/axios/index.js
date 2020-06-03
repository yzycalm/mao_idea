import { get } from './tools';
import { BASE_URL } from './config'
const host = BASE_URL
// easy-mock数据交互
// 管理员权限获取
export const admin = () => get({ url: `${host}/login` });

