// 公共api
import {post} from "../axios/tools";
import { BASE_URL } from '../axios/config'
const host = BASE_URL
// 图片上传
export const uploadImg = (data) => post({ url: `${host}/third/upload/img`, data: data });
// 图片更新
export const uploadUpdateImg = (data) => post({ url: `${host}/activity/bannerEntrance/updateBannerEntranceImg`, data: data });
// 视频上传
export const uploadVideo = (data) => post({ url: `${host}/third/upload/webSign`, data: data });
