# miniapp-cli

hope partner and miscro cli

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
