// pages/auth/auth.js
const util = require('../../utils/util')
const auth = require('../../utils/auth')
const Session = require('../../utils/session')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    js_code: '',
    agreed: false,
    subscribe: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const that = this;
    wx.login({
      success(loginResult) {
        that.setData({
          js_code: loginResult.code,
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  checkboxChange() {
    this.setData({
      agreed: !this.data.agreed,
    })
  },
  subscribeChange() {
    this.setData({
      subscribe: !this.data.subscribe,
    })
  },
  getUserInfo(e) {
    if (!this.data.agreed) {
      wx.showToast({
        icon: 'none',
        title: '请先阅读并同意我们的服务协议',
      })
      return false;
    }
    const that = this
    util.showBusy('正在登录')
    let backUrl = '/pages/index/index'
    const wxUserInfo = e.detail.userInfo
    wxUserInfo.subscribe = this.data.subscribe
    Session.set('user_info', wxUserInfo)
    // 首次登录
    auth.login({
      method: 'POST',
      userInfo: wxUserInfo,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      js_code: that.data.js_code,
      success: (resp) => {
        util.showSuccess('登录成功')
        if (app.globalData.backUrl != '') {
          backUrl = `/${app.globalData.backUrl}`
          app.globalData.backUrl = ''
        }
        if (util.isTabUrl(backUrl)) {
          wx.switchTab({
            url: backUrl,
          })
        } else {
          wx.redirectTo({
            url: backUrl,
          })
        }
      },
      fail: (err) => {
        console.error(err)
        util.showModel('登录错误', err.message)
      },
    })
  },
})
