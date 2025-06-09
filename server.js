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

const path = require('path');
const fs = require('fs/promises');
const fs2 = require('fs'); // 用于同步读取测试图片

const { gif2Positions } = require("./src/positions/gif2");
const { gif3Positions } = require("./src/positions/gif3");
const { overlayAvatarOnGif } = require("./src/util/gifUtil");

// 静态资源映射（如 HTML/JS/CSS 等）
// 可访问路径: http://localhost:3000/emoji-app/xxx
app.use('/emoji-app', express.static(path.join(__dirname, 'public')));

// 配置 JSON 请求体解析，最大上传大小限制为 10MB（适用于 base64 图片）
app.use(express.json({ limit: '10mb' }));

/**
 * API 接口：上传 base64 头像，合成带头像的 GIF
 * POST /emoji-app/emoji/uploadEmoji
 * 请求参数:
 *  - base64: base64 编码头像
 *  - delay: 帧间隔
 *  - selectedSource: 使用的 GIF 文件名，例如 "2.gif"
 * 响应:
 *  - 返回 base64 编码的新 GIF（带 data:image/gif;base64, 前缀）
 */
app.post('/emoji-app/emoji/uploadEmoji', async (req, res) => {
    try {
        const { base64, delay, selectedSource,rotate} = req.body;

        // 参数校验
        if (!base64 || !delay || !selectedSource || !rotate) {
            return res.json(R.fail("操作异常"));
        }

        // 调用主逻辑处理
        const resultBuffer = await overlayAvatarOnGif(base64, delay, selectedSource,rotate);

        if (!resultBuffer || resultBuffer.length < 1) {
            return res.json(R.fail("不支持的类型"));
        }

        // 转换为 base64 字符串响应
        const resultBase64 = resultBuffer.toString('base64');
        res.json(R.data(`data:image/gif;base64,${resultBase64}`));

    } catch (error) {
        console.error('处理失败:', error);
        res.status(500).json({ success: false, message: '服务器内部错误' });
    }
});

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

        res.json({
            success: true,
            count: images.length,
            images,
            avatarPositions: gif3Positions, // 默认只返回 gif3 的位置数据
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
