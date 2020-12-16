# EventListener 基于事件监听的跨页面通信库

## 原理简介

- 跨页面通信:    
  基于事件监听,通过监听 storage事件监听回调机制,实现跨页面通信,让每个只操作自身页面的操作
- 同页面事件监听:   
  发送事件时,查找回调函数,触发回调

## 使用示例

参见 index.html,index2.html

```js
// 注册事件
eventListener.addEventListener('showMessage', function (message) {
    console.debug("接收到的消息")
})
// 发送事件
eventListener.sendEvent('showMessage', 111)
```