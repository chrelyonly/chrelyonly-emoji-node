/**
 * server.js
 *
 * 作者: chrelyonly
 * 创建时间: 2025年6月7日
 * 描述: 提供头像叠加 GIF 的 Web API 接口和调试预览接口。
 */
const express = require('express');
const app = express();
const PORT = 3000;

// 通用响应工具函数（定义在 ./src/util/R）
require("./src/util/R");
require("./src/config/dateConfig.js");
require("./src/util/https.js");

const path = require('path');
const fs2 = require('fs'); // 用于同步读取测试图片

const { gif2Positions } = require("./src/positions/gif2");
const { gif3Positions } = require("./src/positions/gif3");
const {gif4Positions} = require("./src/positions/gif4");
const {gif5Positions} = require("./src/positions/gif5");
const {gif6Positions} = require("./src/positions/gif6");
const {gif7Positions} = require("./src/positions/gif7");
const {gif8Positions} = require("./src/positions/gif8");
const myRouter = require("./src/web/router/myRoutes");
const fs = require("fs");
const {checkGif} = require("./src/util/gifUtil");
const {defaultPositions} = require("./src/positions/defaultPositions");
const {gif10Positions} = require("./src/positions/gif10");
const {gif11Positions} = require("./src/positions/gif11");
const {gif12Positions} = require("./src/positions/gif12");
const {gif13Positions} = require("./src/positions/gif13");

// 配置 JSON 请求体解析，最大上传大小限制为 10MB（适用于 base64 图片）
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
// 或加上 history fallback（推荐）
app.use(
    '/emoji-app',
    require('connect-history-api-fallback')({
        index: '/index.html'
    })
);
// 由于vue 单页面应用问题,刷新会路由404, 使用nginx处理了
app.use('/emoji-app', express.static(path.join(__dirname, 'public')));
app.use('/emoji-app-api', myRouter);

/**
 * API 接口：调试/预览某个 GIF 分帧图像和头像位置
 * POST /emoji-app/emoji/images
 * 请求参数:
 *  - selectedSource: GIF 文件名（对应 public/frames 目录）
 * 响应:
 *  - 所有帧图像（base64 格式）
 *  - 可用于前端调试头像位置叠加效果
 */
app.post('/emoji-app/emoji/images', async (req, res) => {
    const { selectedSource } = req.body;
    const folderPath = path.join(__dirname, 'public', 'frames', selectedSource);

    try {
        const files = fs2.readdirSync(folderPath);
        const images = [];

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext)) {
                const filePath = path.join(folderPath, file);
                const fileData = fs2.readFileSync(filePath);
                const base64Image = `data:image/${ext.slice(1)};base64,${fileData.toString('base64')}`;
                images.push({
                    filename: file,
                    data: base64Image
                });
            }
        }
        // 获取对应 GIF 的头像位置数组
        let positions = "";
        if (selectedSource === "gif2") {
            positions = gif2Positions;
        } else if (selectedSource === "gif3") {
            positions = gif3Positions;
        } else if (selectedSource === "gif4") {
            positions = gif4Positions;
        } else if (selectedSource === "gif5") {
            positions = gif5Positions;
        } else if (selectedSource === "gif6") {
            positions = gif6Positions;
        } else if (selectedSource === "gif7") {
            positions = gif7Positions;
        } else if (selectedSource === "gif8") {
            positions = gif8Positions;
        } else if (selectedSource === "gif10") {
            positions = gif10Positions;
        } else if (selectedSource === "gif11") {
            positions = gif11Positions;
        } else if (selectedSource === "gif12") {
            positions = gif12Positions;
        } else if (selectedSource === "gif13") {
            positions = gif13Positions;
        } else {
            return Buffer.alloc(0); // 不支持的 GIF
        }
        res.json({
            success: true,
            count: images.length,
            images,
            avatarPositions: positions,
        });
    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({ success: false, message: 'Failed to load images.' });
    }
});
/**
 * API调试接口
 * 上传一张gif返回
 * 响应:
 *  - 所有帧图像（base64 格式）
 *  - 可用于前端调试头像位置叠加效果
 */
app.post('/emoji-app/emoji/gif', async (req, res) => {
    const { base64 } = req.body;
    try {
        let images = await checkGif(base64)
        // 获取对应 GIF 的头像位置数组
        res.json({
            success: true,
            count: images?.length,
            images,
            avatarPositions: defaultPositions,
        });
    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({ success: false, message: 'Failed to load images.' });
    }
});

/**
 * 启动服务器
 * 默认监听端口: 3000
 * 访问地址: http://localhost:3000
 */
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
