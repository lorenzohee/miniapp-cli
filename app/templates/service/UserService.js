import request from '../utils/request'

class UserService {
  constructor() {
    'user name'
  }

  getCurrentUser(callback) {
    // 获取当前用户信息 请自己实现业务逻辑，
    this.callback()
    request({
      url: '',
      method: 'GET',
      success: callback(),
    })
  }
}

module.exports = UserService
