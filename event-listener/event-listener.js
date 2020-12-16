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
/**
 * 回调队列
 * 结构:{
 *     eventKey:'xxx',
 *     callback:[]
 * }
 */
let EventListener = function () {
    this.callback = [];
    this.sendEvent = function (eventKey, eventValue) {
        /**
         * 同一页面,localStorage.setItem 不触发 storage ,发送时 自动触发
         * uuid 保证变更,都能触发 storage事件
         */
        let newEventKey = 'evt_' + eventKey;
        let uuid = _uuid(8, 16);
        let newEventValue = uuid + '_' + (eventValue == undefined ? '' : eventValue);
        //手动触发本页面事件
        this.triggerCallback(newEventKey, newEventValue);
        localStorage.setItem(newEventKey, newEventValue);

    }
    this.addEventListener = function (eventKey, callback) {
        let callbackObject = _findCallbackObject(this, eventKey);
        if (callbackObject == undefined) {
            callbackObject = {eventKey: eventKey, callback: [callback]};
            this.callback.push(callbackObject);
        } else {
            callbackObject.callback.push(callback);
        }
    }
    /**
     * 触发事件对应的回调
     * removeItem setItem 都会触发
     * removeItem eventValue==null 不触发
     */
    this.triggerCallback = function (eventKey, eventValue) {
        if (_isEventKey(eventKey) && _isNotNull(eventValue)) {
            let originalEventKey = _resolveEventKey(eventKey);
            let callbackObject = _findCallbackObject(this, originalEventKey);
            if (callbackObject != undefined) {
                let callbackQueue = callbackObject.callback;
                if (callbackQueue.length > 0) {
                    eventValue = _resolveEventValue(eventValue);
                    for (let index in callbackQueue) {
                        let callback = callbackQueue[index];
                        try {
                            callback(eventValue);
                        } catch (e) {
                            console.error("执行事件" + callbackObject.eventKey + "的函数失败", e)
                        }
                    }
                }
                //触发后删除
                localStorage.removeItem(eventKey);
            }
        }
    }

    /**
     * 查找到事件key对应的监听对象
     */
    function _findCallbackObject(_this, eventKey) {
        if (_this.callback.length > 0) {
            for (let index in _this.callback) {
                let callbackObject = _this.callback[index];
                if (callbackObject.eventKey == eventKey) {
                    return callbackObject;
                }
            }
        }
    }

    function _resolveEventKey(eventKey) {
        return eventKey.split('_')[1];

    }

    function _isEventKey(eventKey) {
        if (eventKey.indexOf('evt_') < 0) {
            return false;
        }
        return true;
    }


    function _resolveEventValue(eventValue) {
        let start = eventValue.indexOf('_') + 1;
        let end = eventValue.length;
        return eventValue.substring(start, end);
    }

    function _isNotNull(value) {
        if (value == undefined || value == null) {
            return false;
        }
        return true;
    }


    function _uuid(len, radix) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            let r;
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
    };
}
let eventListener = new EventListener();
//注册监听,不同页面也可触发监听事件
window.addEventListener('storage', function (event) {
    eventListener.triggerCallback(event.key, event.newValue);
})
