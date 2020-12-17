// app.js
import { promisifyAll } from 'miniprogram-api-promise';
import auth from './utils/auth';
const wxp = {}
promisifyAll(wx, wxp)
App({
  onLaunch() {
    const that = this
    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        auth.login({
          method: 'POST',
          postData: {code: res.code},
          times: 'first',
          complete: ()=>{
            that.globalData.appConfirm = true
            if (that.globalData.appReady){
              that.globalData.appReady();
            }
          }
        })
      },
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: (e) => {
        this.globalData.StatusBar = e.statusBarHeight;
        const custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      },
    })
    checkForUpdate()
    function checkForUpdate() {
      if (wx.canIUse("getUpdateManager")) {
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          // console.log(res.hasUpdate);
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function() {
              wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                success(res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
              wx.showModal({
                title: "已经有新版本了哟~",
                content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
              });
            });
          }
        });
      } else {
        wx.showModal({
          title: "提示",
          content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
      }
    }
  },
  globalData: {
    userInfo: null,
    appConfirm: false,
    appReady: false,
    backUrl: '',
  },
})
