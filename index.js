// commonjs
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const viteConfig = require('./vite.config.js');
const aliasResolver = require('./aliasResolver.js');
// 当我们安装了node以后node文件路径 fs是原生模块
// document.querySelector --》 浏览器环境注入给js的特殊能力
// 不同的宿主环境会给js赋予一些不同的能力
const app = new Koa();
// node最频繁的的事情就在的处理请求和操作文件
// 读取vite.config.js的前置操作
console.log('viteConfig', viteConfig);
app.use(async (ctx) => {
  // 上下文
  // request 请求信息  response 响应信息
  if (ctx.request.url === '/') {
    // 找根路径
    const indexContext = await fs.promises.readFile(
      path.resolve(__dirname, './index.html')
    ); // 在服务端一般不会用 更多使用文件流的形式
    console.log('indexContext', indexContext);
    // 对方拿到你的东西的时候以什么方式去解析
    ctx.response.body = indexContext;
    ctx.response.set('Content-Type', 'text/html');
  }
  console.log('ctx.request.url', ctx.request.url);
  // /main.js
  if (ctx.request.url.endsWith('.js')) {
    // 找根路径
    const indexMainContext = await fs.promises.readFile(
      path.resolve(__dirname, '.' + ctx.request.url)
    );

    // 处理路径 alias替换
    const replaceContext = aliasResolver(
      viteConfig.resolve.alias,
      indexMainContext.toString()
    );
    ctx.response.body = replaceContext;
    ctx.response.set('Content-Type', 'text/javascript');
  }

  // if (ctx.request.url === '/app.vue') {
  //   // 找根路径
  //   const indexAppContext = await fs.promises.readFile(
  //     path.resolve(__dirname, './app.vue')
  //   );
  //   // 读取vue文件内容，做文本替换和Ast语法解析来生成js文件。
  //   // 例如template中的内容变成vue.createElement变成虚拟node-在转化为真实的dom
  //   ctx.response.body = indexAppContext;
  //   ctx.response.set('Content-Type', 'text/javascript');
  // }
});

app.listen(5173, () => {
  console.log('vite dev server listening on   5173');
});
