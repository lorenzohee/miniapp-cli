const config = require('../config')
const Session = require('./session')

const noop = function noop () { }
const defaultOptions = {
  method: 'GET',
  success: noop,
  fail: noop,
  loginUrl: config.service.service_add + 'authen',
  refreshUrl: config.service.service_add + 'users/refresh_token'
}
/**
 * @method
 * 进行服务器登录，以获得登录会话
 * 受限于微信的限制，本函数需要在 <button open-type="getUserInfo" bindgetuserinfo="bindGetUserInfo"></button> 的回调函数中调用
 * 需要先使用 <button> 弹窗，让用户接受授权，然后再安全调用 wx.getUserInfo 获取用户信息
 *
 * @param {Object}   opts           登录配置
 * @param {string}   opts.loginUrl  登录使用的 URL，服务器应该在这个 URL 上处理登录请求，建议配合服务端 SDK 使用
 * @param {string}   [opts.method]  可选。请求使用的 HTTP 方法，默认为 GET
 * @param {Function} [opts.success] 可选。登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} [opts.fail]    可选。登录失败后的回调函数，参数 error 错误信息
 */
function login (opts) {
  opts = Object.assign({}, defaultOptions, opts)
  // 请求服务器登录地址，获得会话信息
  wx.request({
    url: opts.loginUrl,
    method: opts.method,
    data: opts.postData,
    success (result) {
      const data = result.data;
      if (result.statusCode == 401) {
        return opts.fail(new Error(`用户未登录过，请先使用 login() 登录`))
      }
      if (result.statusCode == 500) {
        return opts.fail(new Error(`服务器错误`))
      }
      if (!data) {
        return opts.fail(new Error(`用户未登录过，请先使用 login() 登录`))
      }
      const res = data
      if (!res || !res.token) {
        return opts.fail(new Error(`登录失败(${data.error})：${data.message}`))
      }
      // 成功地响应会话信息
      Session.set(config.service.SESSION_KEY, res.token)
      Session.set('token_expires', res.expires)
      Session.set('token_created_at', res.created_at)
      opts.success(res.token)
    },
    fail (err) {
      console.error('登录失败，可能是网络错误或者服务器发生异常')
      opts.fail(err)
    },
    complete(){
      if(opts.complete){
        opts.complete()
      }
    }
  });
}

async function refreshToken(opts) {
  opts = Object.assign({}, defaultOptions, opts)
  const auth_token = await Session.get(config.service.SESSION_KEY)
  var header = { Authorization: auth_token }
  // 请求服务器登录地址，获得会话信息
  wx.request({
    url: opts.refreshUrl,
    method: opts.method,
    header: header,
    success(result) {
      const data = result.data;
      if (result.statusCode == 401) {
        return opts.fail(new Error(`用户未登录过，请先使用 login() 登录`))
      }
      if (result.statusCode == 500) {
        return opts.fail(new Error(`服务器错误`))
      }
      if (!data) {
        return opts.fail(new Error(`用户未登录过，请先使用 login() 登录`))
      }
      const res = data
      if (!res || !res.token) {
        return opts.fail(new Error(`登录失败(${data.error})：${data.message}`))
      }
      // 成功地响应会话信息
      Session.set(config.service.SESSION_KEY, res.token)
      Session.set('token_expires', res.expires)
      Session.set('token_created_at', res.created_at)
      opts.success(res.token)
    },
    fail(err) {
      console.error('登录失败，可能是网络错误或者服务器发生异常')
      opts.fail(err)
    }
  });
}
module.exports = { login, refreshToken }
