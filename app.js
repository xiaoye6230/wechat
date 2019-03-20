const express = require('express');
const sha1 = require('sha1');
const { parseString } = require('xml2js');

const app = express();
app.use(async (req, res) => {
    //获取到微信服务器发送的请求参数
    const { signature, echostr, timestamp, nonce } = req.query;

    //设置好的token值
    const token = 'todayis190319';

    //将三者字典排序
    const arr = [token, timestamp, nonce].sort();

    //将数据拼接成一个字符串并sha1加密
    const sha1Str = sha1(arr.join(''));

    if (req.method === 'GET') {
        // 判断数据是否来自于微信服务器
        if (sha1Str === signature) {
            res.end(echostr);
        } else {
            res.end('error');
        }
    } else if (req.method === 'POST') {
        if (sha1Str !== signature) {
            res.end('error');
            return;
        }
        const xmlData = await new Promise((resolve, reject) => {
            let xmlData = '';
            req
                .on('data', (data) => {
                    xmlData += data.toString();
                })
                .on('end', () => {
                    //数据接收完成
                    resolve(xmlData);
                })
        })

        let jsData = null;
        parseString(xmlData, { trim: true }, (err, result) => {
            if (!err) {
                jsData = result;
            } else {
                jsData = {};
            }
        })
        const { xml } = jsData;
        let userData = {};
        for (let key in xml) {
            const value = xml[key];
            userData[key] = value[0];
        }

        console.log(userData);
        let content = "你在说什么？我听不明白";

        if (userData.Content === '1') {
            content = '好好学习，天天向上';
        } else if (userData.Content.indexOf('2') !== -1) {
            content = '你叫什么？ \n我叫小度';
        }

        let replyMessage = `<xml>
        <ToUserName><![CDATA[${userData.FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
        <CreateTime>${Date.now()}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${content}]]></Content>
      </xml>`

        res.send(replyMessage);
    } else {
        res.end('error');
    }
})
app.listen(3000, (err) => {
    if (!err) console.log('服务器启动成功');
    else console.log(err);
})