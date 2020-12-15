/**
 * js 事件监听
 *
 *
 * useage:
 * 1. 注册事件监听
 * EventListener.addEventListener('xxx-success',function(xxvalue){
 *    refreshList();
 * });
 * 发送事件
 * 2.EventListener.sendEvent('xxx-success','xxvalue')
 */
var EventListener = {
    /**
     * 回调队列
     * 结构:{
     *     eventKey:'xxx',
     *     callback:[]
     * }
     */
    callback: [],
    //发送事件
    sendEvent: function (eventKey, eventValue) {
        /**
         * 同一页面,localStorage.setItem 不触发 storage ,发送时 自动触发
         */
        this.triggerCallback(eventKey, eventValue);
        var newEventKey = 'evt_' + eventKey;
        var uuid = this.uuid(8, 16);
        var newEventValue = uuid + '_' + (eventValue == undefined ? '' : eventValue);
        localStorage.setItem(newEventKey, newEventValue);

    },
    //添加事件监听
    addEventListener: function (eventKey, callback) {
        var callbackObject = this.findCallbackObject(eventKey);
        if (callbackObject == undefined) {
            callbackObject = {eventKey: eventKey, callback: [callback]};
            this.callback.push(callbackObject);
        } else {
            callbackObject.callback.push(callback);
        }
    },
    //查找到事件key对应的监听对象
    findCallbackObject(eventKey) {
        if (this.callback.length > 0) {
            if (this.isEventKey(eventKey)) {
                eventKey = this.resolveEventKey(eventKey);
            }
            for (var index in this.callback) {
                var callbackObject = this.callback[index];
                if (callbackObject.eventKey == eventKey) {
                    return callbackObject;
                }
            }
        }
    },
    resolveEventKey: function (eventKey) {
        return eventKey.split('_')[1];

    },
    isEventKey: function (eventKey) {
        if (eventKey.indexOf('evt_') < 0) {
            return false;
        }
        return true;
    },

    resolveEventValue: function (eventValue) {
        var start = eventValue.indexOf('_') + 1;
        var end = eventValue.length;
        return eventValue.substring(start, end);
    },
    /**
     * 触发事件对应的回调
     */
    triggerCallback: function (eventKey, eventValue) {
        var callbackObject = this.findCallbackObject(eventKey);
        if (callbackObject != undefined) {
            var callbackQueue = callbackObject.callback;
            if (callbackQueue.length > 0) {
                eventValue = this.resolveEventValue(eventValue);
                for (var index in callbackQueue) {
                    var callback = callbackQueue[index];
                    try {
                        callback(eventValue);
                    } catch (e) {
                        console.error("执行事件" + callbackObject.eventKey + "函数失败", e)
                    }
                }
            }
        }

    },
    uuid: function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }
};
//注册监听,不同页面也可触发监听事件
window.addEventListener('storage', function (event) {
    EventListener.triggerCallback(event.key, event.newValue);
})
