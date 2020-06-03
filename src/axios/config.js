/**
 * 接口地址配置文件
 */

console.log('%c' + process.env.NODE_ENV, 'background: #008000; color: #fff;')

export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://web.hongrz.com' : 'https://webtest.hongrz.com'
export const ORDER_URL = process.env.NODE_ENV === 'production' ? 'https://appv1.hongrenzhuang.com' : 'http://appv1t.tlgn365.com'

// localhost
export const BASE_LOCALHOST = 'http://localhost:3006'

