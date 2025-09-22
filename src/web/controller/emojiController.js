const { overlayAvatarOnGif, textOnGif } = require('../../util/gifUtil');

/**
 * 上传头像制作gif
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const uploadEmojiApi = async (req, res) => {
    try {
        let { base64, delay, selectedSource, rotate } = req.body;
        // 保证下这两个值为int
        rotate = +rotate;
        delay = +delay;
        // 参数校验
        if (!base64 || !delay || !selectedSource || !rotate) {
            return res.json(R.fail("操作异常"));
        }
        if (rotate < 0 || rotate > 360) {
            return res.json(R.fail("旋转角度错误"));
        }
        log.info(
            `[参数日志] base64长度="${base64.length}", ` +
            `delay=${delay}, selectedSource="${selectedSource}", rotate=${rotate}`
        );
        // log.info(base64)
        // 调用主逻辑处理
        const resultBuffer = await overlayAvatarOnGif(base64, delay, selectedSource, rotate);

        if (!resultBuffer || resultBuffer.length < 1) {
            return res.json(R.fail("传入的图片数量不对或不支持的类型或参数不对"));
        }

        // 转换为 base64 字符串响应
        const resultBase64 = resultBuffer.toString('base64');
        res.json(R.data(`data:image/gif;base64,${resultBase64}`));

    } catch (error) {
        console.error('处理失败:', error);
        res.status(500).json({ success: false, message: '服务器内部错误' });
    }
};

/**
 * 上传文字生成gif
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
const textOnGifApi = async (req, res) => {
    try {
        let { textList, delay, selectedSource, rotate, gifPositions,fontSize,scaling } = req.body;
        // selectedSource = "https://nginx-3.frp.chrelyonly.cn/minio-api/emoji/upload/20250619/e55357cd5c384e891dd003e546e5d0ee.gif"
        // 参数校验
        if (!textList || !delay || !selectedSource || (!rotate && rotate !== 0) || !gifPositions || !fontSize || !scaling) {
            return res.json(R.fail("操作异常,参数传入不对"));
        }
        if (rotate < 0 || rotate > 360) {
            return res.json(R.fail("旋转角度错误"));
        }

        gifPositions = JSON.parse(gifPositions);

        // 调用主逻辑处理
        const resultBuffer = await textOnGif(textList, delay,
            selectedSource, rotate,
            gifPositions,fontSize,scaling);

        if (!resultBuffer || resultBuffer.length < 1) {
            return res.json(R.fail("不支持的类型"));
        }

        // res.setHeader("Content-Type", "image/gif");
        // res.setHeader("Content-Disposition", "inline; filename=output.gif");
        // res.send(resultBuffer);
        // 转换为 base64 字符串响应
        const resultBase64 = resultBuffer.toString('base64');
        res.json(R.data(`data:image/gif;base64,${resultBase64}`));

    } catch (error) {
        console.error('处理失败:', error);
        res.status(500).json({ success: false, message: '服务器内部错误' });
    }
};

module.exports = {
    uploadEmojiApi,
    textOnGifApi
};
