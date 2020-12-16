/**
 * 缓存实现
 */
let wsCache;
try {
    wsCache = new WebStorageCache()
} catch (e) {
    console.error("WebStorageCache 初始化失败");
}
/**
 * 定义字典枚举
 */
let DICT_TYPE = {
    //个人证件类型
    "certification_type": "certification_type",
    //职位
    "position": "position",
    //中国省份字典
    "chinese_province": "chinese_province",
    //机构
    "unit_nature": "unit_nature",
    //国家字典
    "country": "country",

};
/**
 *字典工具类
 */
let DictHelper = function (settings) {
    /**
     *
     * cacheMin 缓存时间 单位分钟
     * fetchFunction 字典获取函数
     * dictFetchUrl 字典接口地址 fetchFunction为空生效
     * cacheSet 缓存设置函数
     * cacheGet 缓存读取函数
     */
    this.settings = {
        cacheMin: 10,
        fetchFunction: _fetchFunction,
        dictFetchUrl: '/dict',
        cacheSet: _setDictCache,
        cacheGet: _getDictCache
    };
    $.extend(this.settings, settings)

    //获取字典值,优先从缓存中获取,缓存不存在,请求接口
    this.getDictList = function (dictType, forceFetch, extData) {
        _fetchDictList(this, dictType, forceFetch, extData);
        return this.settings.cacheGet(dictType);
    }
    //过滤字典值
    this.filterDictValue = function (dictList, filter) {
        if (dictList != undefined && dictList.length > 0) {
            for (let index = 0; index < dictList.length; index++) {
                let dict = dictList[index]
                if (filter(dict)) {
                    return dict;
                }
            }
        }
    }

    function _fetchDictList(_this, dictType, forceFetch, extData) {
        if (forceFetch == undefined || forceFetch == null) {
            forceFetch = false;
        }
        let dictCache = _getDictCache(dictType);
        if (forceFetch || dictCache == undefined || dictCache == '') {
            dictCache = _this.settings.fetchFunction(settings, dictType, extData);
            _this.settings.cacheSet(settings, dictType, dictCache);
        }
    }

    function _fetchFunction(settings, dictType, extData) {
        let params = {dictType: dictType};
        //扩展数据不为空,则添加到参数,extData 为json字符,前后端约定好
        if (extData != null && extData != undefined && extData != '') {
            params.extData = JSON.stringify(extData);
        }
        let dictData;
        $.ajax({
            method: "post",
            url: settings.dictFetchUrl,
            async: false,
            data: params,
            dataType: 'json',
            success: function (result) {
                let response = result;
                if (response.success == 1) {
                    dictData = response.data
                }
            }
        })
        return dictData;
    }


    function _getDictCache(dictType) {
        let dictCacheKey = "dict_" + dictType;
        let dictCache = wsCache.get(dictCacheKey);
        if (dictCache) {
            return JSON.parse(dictCache);
        }
    }

    function _setDictCache(settings, dictType, dictList) {
        if (dictList) {
            let dictCacheKey = "dict_" + dictType;
            //字典缓存,生产环境时间可适当加大
            wsCache.set(dictCacheKey, JSON.stringify(dictList), {exp: settings.cacheMin * 60})
        }
    }

}




