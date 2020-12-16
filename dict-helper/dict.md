# dict 简单的统一字典并缓存工具

## 原理简介

- 前后端约定,所有字典的枚举,并提供统一接口
- 前端缓存 ,缓存中没有
  **注意:**    
  字典获取,尽量使用同步函数,方便业务端直接处理
## 使用示例
参见 index.html

```js
 /**
 *
 * cacheMin 缓存时间 单位分钟
 * fetchFunction 字典获取函数
 * dictFetchUrl 字典接口地址 fetchFunction为空生效
 * cacheSet 缓存设置函数
 * cacheGet 缓存读取函数

 settings = {
    cacheMin: 10,
    fetchFunction: _fetchFunction,
    dictFetchUrl: '/dict',
    cacheSet: _setDictCache,
    cacheGet: _getDictCache
}
 */

// new 字典工具对象
let dictUtil = new DictHelper(
        {
            cacheMin: 30,
            dictFetchUrl: 'http://xxx:8080/dict'
        });
// 获取字典
let dictValue = dictUtil.getDictList(dictType);
//带扩展参数
let dictValue = dictUtil.getDictList(dictType, null, extData);


// 强制从服务端获取
let dictValue = dictUtil.getDictList(dictType, true);
//带扩展参数
let dictValue = dictUtil.getDictList(dictType, true, extData);

```

