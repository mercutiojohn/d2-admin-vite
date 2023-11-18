// import { Message } from 'element-ui'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import axios from 'axios'
import Adapter from 'axios-mock-adapter'
import { get, isEmpty, merge } from 'lodash'
import qs from 'qs'
import util from '@/libs/util'
import store from '@/store'

import { getToken } from '@/libs/util.auth' // TODO
import errorCode from '@/libs/util.errorCode'
import { tansParams, blobValidate } from "@/libs/util.ruoyi"
import cache from '@/plugin/cache-ruoyi'
import { saveAs } from 'file-saver'


let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };

/**
 * @description 记录和显示错误
 * @param {Error} error 错误对象
 */
function handleError (error) {
  // 添加到日志
  store.dispatch('d2admin/log/push', {
    message: '数据请求异常',
    type: 'danger',
    meta: {
      error
    }
  })
  // 打印到控制台
  if (import.meta.env.MODE === 'development') {
    util.log.danger('>>>>>> Error >>>>>>')
    console.log(error)
  }
  // 显示提示
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
}

/**
 * @description 创建请求实例
 */
function createService () {
  // 创建一个 axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    config => {
      // 是否需要设置 token
      // const isToken = (config.headers || {}).isToken === false
      // 是否需要防止数据重复提交
      const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
      // if (getToken() && !isToken) {
      //   config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改 // TODO
      // }
      // get请求映射params参数
      if (config.method === 'get' && config.params) {
        let url = config.url + '?' + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
      }
      if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
        const requestObj = {
          url: config.url,
          data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
          time: new Date().getTime()
        }
        const requestSize = Object.keys(JSON.stringify(requestObj)).length; // 请求数据大小
        const limitSize = 5 * 1024 * 1024; // 限制存放数据5M
        if (requestSize >= limitSize) {
          console.warn(`[${config.url}]: ` + '请求数据大小超出允许的5M限制，无法进行防重复提交验证。')
          return config;
        }
        const sessionObj = cache.session.getJSON('sessionObj')
        if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
          cache.session.setJSON('sessionObj', requestObj)
        } else {
          const s_url = sessionObj.url;                  // 请求地址
          const s_data = sessionObj.data;                // 请求数据
          const s_time = sessionObj.time;                // 请求时间
          const interval = 1000;                         // 间隔时间(ms)，小于此时间视为重复提交
          if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
            const message = '数据正在处理，请勿重复提交';
            console.warn(`[${s_url}]: ` + message)
            return Promise.reject(new Error(message))
          } else {
            cache.session.setJSON('sessionObj', requestObj)
          }
        }
      }
      return config
    },
    error => {
      // 发送失败
      console.log(error)
      return Promise.reject(error)
    }
  )
  // 响应拦截
  service.interceptors.response.use(
    response => {
      // http 状态码 200 情况
      // 根据 前后端约定的 response.data.code 判断接口是否请求成功
      // 例如 接口返回数据为
      // {
      //   code: 0,
      //   msg: 'success',
      //   data: {
      //     list: [],
      //     count: 0
      //   }
      // }
      // 此时
      // response.data.code :
      // 0
      // response.data.msg :
      // 'success'
      // response.data.data : (在调用接口)
      // {
      //   list: [],
      //   count: 0
      // }
      // 默认约定 code 为 0 时代表成功
      // 你也可以不使用这种方法，改为在下面的 http 错误拦截器里做处理

      // 未设置状态码则默认成功状态
      const code = response.data.code || 200;
      // 获取错误信息
      const msg = errorCode[code] || response.data.msg || errorCode['default']
      // 二进制数据则直接返回
      if (response.request.responseType ===  'blob' || response.request.responseType ===  'arraybuffer') {
        return response.data
      }

      // 有 code 判断为项目接口请求
      switch (code) {
        // 在 code 401 情况下退回到登录页面
        case 401: 
          if (!isRelogin.show) {
            isRelogin.show = true;
            MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
              isRelogin.show = false;
              store.dispatch('LogOut').then(() => {
                location.href = '/index';
              })
            }).catch(() => {
              isRelogin.show = false;
            });
          }
          return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
        case 500: 
          Message({ message: msg, type: 'error' })
          return Promise.reject(new Error(msg))
        case 601:
          Message({ message: msg, type: 'warning' })
          return Promise.reject('error')
        default: 
          if (code !== 200) {
            // Notification.error({ title: msg })
            // throw new Error(`${response.data.msg}: ${response.config.url}`)
            return Promise.reject('error')
          } else {
            return response.data
          }
      }
    },
    error => {
      const status = get(error, 'response.status')
      switch (status) {
        case 400: error.message = '请求错误'; break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
      handleError(error)
      throw error
    }
  )
  return service
}

function stringify (data) {
  return qs.stringify(data, { allowDots: true, encode: false })
}

/**
 * @description 创建请求方法
 * @param {Object} service axios 实例
 */
function createRequest (service) {
  return function (config) {
    // const token = util.cookies.get('token') // TODO
    let token = {}
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
      token['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改 // TODO
    }
    const configDefault = {
      headers: {
        // Authorization: token,  // TODO
        'Content-Type': get(config, 'headers.Content-Type', 'application/json;charset=utf-8'),
        ...token
      },
      timeout: 10000,
      baseURL: import.meta.env.VITE_APP_BASE_API,
      data: {}
    }
    const option = merge(configDefault, config)
    // 处理 get 请求的参数
    // 请根据实际需要修改
    if (!isEmpty(option.params)) {
      option.url = option.url + '?' + stringify(option.params)
      option.params = {}
    }
    // 当需要以 form 形式发送时 处理发送的数据
    // 请根据实际需要修改
    if (!isEmpty(option.data) && option.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      option.data = stringify(option.data)
    }
    return service(option)
  }
}

// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config
  }).then(async (data) => {
    const isBlob = blobValidate(data);
    if (isBlob) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}

// 用于真实网络请求的实例和请求方法
export const service = createService()
export const request = createRequest(service)

// 用于模拟网络请求的实例和请求方法
export const serviceForMock = createService()
export const requestForMock = createRequest(serviceForMock)

// 网络请求数据模拟工具
export const mock = new Adapter(serviceForMock)
