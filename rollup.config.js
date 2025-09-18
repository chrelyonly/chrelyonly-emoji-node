
const commonjs  = require('@rollup/plugin-commonjs'); // commonjs支持，使用es模块可不使用此插件，安装：npm install @rollup/plugin-commonjs -D
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json'); // 将静态json文件作为模块导入，按需安装，安装：npm install @rollup/plugin-json -D
const { string } = require('rollup-plugin-string'); // 将静态文件文本作为模块导入，按需安装，安装：npm install @rollup/plugin-json -D
const terser = require('@rollup/plugin-terser');// 压缩打包后的文件大小，按需安装，安装：npm install @rollup/plugin-json -D

module.exports = {
    input: 'server.js', // 项目入口文件
    output: {
        dir: 'output', // 输出文件目录
        format: 'cjs' // 输出文件格式
    },
    external: ["sharp"], // ⬅️ sharp 不要打包
    plugins: [terser({
        format: {
            comments: false
        }
    }), nodeResolve({
        preferBuiltins: true,
        exportConditions: ['node']
    }),
        commonjs(),
        json(),
        string({
            include: ['**/*.html', '**/*.yml']
        })]
};
