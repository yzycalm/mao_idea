// 公共api
import {post} from "../axios/tools";
import { BASE_URL } from '../axios/config'
const host = BASE_URL

export const login = (data) => post({ url: `${host}/admin/web/login`, data: data });
