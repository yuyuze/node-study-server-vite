const path = require('path');
/**
 *
 * @param {object} alias 别名配置文件
 * @param {string} fileContent  文件内容字符串
 */
module.exports = function (alias, fileContent) {
  const entires = Object.entries(alias);
  entires.forEach(([aliasPath, realPath]) => {
    realPath = realPath.replace('\\\\', '/');
    // vite会对相对路径做处理
    // 如果我用官方的方式去找相对路径的话
    const srcIndex = realPath.indexOf('\\src');
    console.log('srcIndex', srcIndex, realPath);
    fileContent = fileContent.replace(
      new RegExp(`${aliasPath}\/`),
      function () {
        return `${realPath}\/`.slice(srcIndex).replace('\\', '/');
      }
    );
  });
  console.log('fileContent', fileContent);
  return fileContent;
};
