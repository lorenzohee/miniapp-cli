var utils = require('./util');
var loginLib = require('./auth');
var config = require('../config')
var noop = function noop() {};
var buildAuthHeader = function buildAuthHeader(session) {
  var header = {};
  if (session) {
    header['Authorization'] = session;
  }
  return header;
};

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
  function RequestError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }
  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;
  return RequestError;
})();

function request(options) {
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
    throw new RequestError('ERR_INVALID_PARAMS', message);
  }
  var requireLogin = options.login || true;
  var skipLogin = options.skipLogin;
  var success = options.success || noop;
  var fail = options.fail || noop;
  var complete = options.complete || noop;
  // 成功回调
  var callSuccess = function () {
    wx.hideLoading()
    success.apply(null, arguments);
    complete.apply(null, arguments);
  };
  // 失败回调
  var callFail = function (error) {
    wx.hideLoading()
    fail.call(null, error);
    complete.call(null, error);
  };
  if (skipLogin) {
    delete options.skipLogin
    requireLogin = false
  }
  if (requireLogin) {
    doRequestWithToken();
  } else {
    doRequest();
  }
  // 登录后再请求
  async function doRequestWithToken() {
    var authHeader = {}
    const auth_token = await Session.get(config.service.SESSION_KEY)
    if (auth_token) {
      const token_expires = await Session.get('token_expires')
      const token_created_at = await Session.get('token_created_at')
      const time_tmp = (new Date()).getTime() - (new Date(token_created_at)).getTime()
      if (time_tmp >= token_expires*1000){
        //token 失效重新登录
        wx.login({
          success: function (res) {
            loginLib.login({ 
              success: doRequestWithToken, 
              fail: callFail, 
              complete: callComplete,
              method: 'POST',
              postData: { code: res.code },
            })
          }
        });
        
      } else if (time_tmp > (token_expires-5*60)*1000){
        // token 面临过期需要刷新
        loginLib.refreshToken({ success: doRequestWithToken, fail: callFail, complete: callComplete })
      }else{
        authHeader = buildAuthHeader(auth_token);
        doRequest(authHeader);
      }
    }else{
      // 未登录，记录当前路径并跳转到登录界面
      getApp().globalData.backUrl = utils.getCurrentPageUrlWithArgs()
      wx.redirectTo({
        url: '/pages/auth/auth',
      })
      return false;
    }
  }
  // 实际进行请求的方法
  function doRequest(authHeader) {
    options = Object.assign(options, { header: authHeader || '' });
    Object.assign(options, {
      success: function (response) {
        var data = response.data;
        if ((data && data.code === -1) || response.statusCode === 401) {
          // 无授权，将直接导航到index/index页面，需要用户授权登录
          getApp().globalData.backUrl = utils.getCurrentPageUrlWithArgs()
          wx.redirectTo({
            url: '/pages/auth/auth',
          })
          return false;
        } else {
          callSuccess.apply(null, arguments);
        }
      },
      fail: callFail,
    })
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.request(options);
  };
};

module.exports = {
    RequestError: RequestError,
    request: request,
};