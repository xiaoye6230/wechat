const express=require('express');
const sha1=require('sha1');
const app=express();
app.use((req,res)=>{
    //获取到微信服务器发送的请求参数
    const {signature,echostr,timestamp,nonce}=req.query;
    
    //设置好的token值
    const token='todayis190319';

    //将三者字典排序
    const arr=[token,timestamp,nonce].sort();

    //将数据拼接成一个字符串并sha1加密
    const sha1Str=sha1(arr.join(''));

    判断数据是否来自于微信服务器
    if(sha1Str===signature){        
        res.end(echostr);
    }else{
        res.end('error');
    }
})
app.listen(3000,(err)=>{
    if(!err) console.log('服务器启动成功');
    else console.log(err);
})