const config = require('../config')
var Session = {
  get: function (key) {
  	key = key || config.service.SESSION_KEY
    return wx.getStorageSync(key) || null;
  },

  set: function (key, val) {
    wx.setStorageSync(key, val);
  },

  remove: function (key) {
  	wx.removeStorageSync(key)
  },

  clear: function () {
    wx.clearStorage();
  },
};

module.exports = Session;