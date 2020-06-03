/*
 * @Author: songyingchun
 * @Date: 2020-04-23 10:30:48
 * @Description: 集成友盟消息推送API
 */
import { post } from '../../axios/tools';
import { BASE_URL } from '../../axios/config'

const host = BASE_URL

// 发送消息
export const sendMessage = (data) => post({ url: `${host}/push/umeng/msg/save`, data: data });
