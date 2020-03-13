/**
 FileDesc  :
 Author    :  g_eno_phy
 Date      :  2020-03-04 00:38
 Version   :
 */
const path    = require('path');
const resolve = dir => path.join(__dirname, dir);

module.exports = {
    // 将 examples 目录添加为新的页面
    pages       : {
        index: {
            // page 的入口
            entry   : 'examples/main.js',
            // 模板来源
            template: 'public/index.html',
            // 输出文件名
            filename: 'index.html'
        }
    },
    css         : {
        extract: false
    },
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('examples'));
    }
};
