# miniapp-cli

微信小程序脚手架

生成基于 colorUI 的微信小程序。colorUI 项目参考： [ColorUI](https://www.color-ui.com/)

#### 下载 git

    git clone https://github.com/lorenzohee/miniapp-cli.git

#### 设置为全局运行命令

在项目目录下运行： `npm install . -g` 或 `npm link`

这样就可以使用 enzomi 命令了。

到此，一个本地的 npm 命令行工具就已经成功完成

## 项目改为基于 yo 的 generator

#### 添加全局依赖

    npm i yo -g

#### 添加本地依赖

    npm i yeoman-generator

#### 重新设置为全局命令

    npm link --force

**_ 注：index.js 暂时无法使用 _**

## 开始小程序项目应用

#### enzomi 命令安装新的微信小程序

    yo enzomi [projectname]

#### 根据命令提示创建新的微信小程序

#### 开启 npm 支持

进入项目目录执行 `npm i`

修改 project.config.json 中的 appid，然后在微信开发者工具中打开

微信开发者工具中开启'使用 npm 模块'

## 小程序开发说明
