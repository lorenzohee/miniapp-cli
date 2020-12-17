/**
 * 小程序配置文件
 */
const SESSION_KEY = 'xxx';
let config = {
  service: {
    service_add: 'https://xxx/',
    auth_add: 'https://xxx',
    SESSION_KEY,
  },
}
const ve = __wxConfig.envVersion;
switch (ve) {
  case 'develop':
    config = {
      service: {
        service_add: 'https://xxx/',
        auth_add: 'https://xxx',
        SESSION_KEY,
      },
    }
    break;
  case 'trial':
    // ti yan ban
    config = {
      service: {
        service_add: 'https://xxx/',
        auth_add: 'https://xxx',
        SESSION_KEY,
      },
    }
    break;
  case 'release':
    // zheng shi ban
    break;
  default:
}

module.exports = config;
