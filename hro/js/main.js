require.config({
    paths: {
        "jquery": "jquery.min",
        "vue": "vue.min",
        "bootstrap": "bootstrap.min"
    },
    shim: {
        'bootstrap': ['jquery']
    }
});


require(["jquery", "vue", "bootstrap"],
    function ($, Vue, Bootstrap) {

        var hqlToSql = function (arr) {
            var result = [];
            arr.forEach(function (item) {
                if (!item || item.trim() == '') {
                    return;
                }
                result.push(reversalAlias(item));
            });
            return result.join('\n');
        };

        var toSql = function (arr) {
            var result = [];
            arr.forEach(function (item) {
                if (!item || item.trim() == '') {
                    return;
                }
                result.push(xx(item));
            });
            return result.join('\n');
        };

        var toString = function (arr) {
            var result = [];
            result.push('String sql = \"\"');
            arr.forEach(function (item) {
                if (!item || item.trim() == '') {
                    return;
                }
                result.push('+ \" ' + item + ' \"')
            });
            return result.join('\n') + ';';
        };

        var toStringBuilder = function (arr) {
            var result = [];
            result.push('StringBuilder sql = new StringBuilder();');
            arr.forEach(function (item) {
                if (!item || item.trim() == '') {
                    return;
                }
                result.push('sql.append(\" ' + item + ' \");')
            });
            return result.join('\n');
        };


        var takeAlias = function (arr) {
            var result = [];
            arr.forEach(function (item) {
                if (!item || item.trim() == '') {
                    return;
                }
                // 如果有别名或者用到了函数(使用了括号就认为是使用了)则不取别名
                if (item.indexOf(' AS ') > 1 || item.indexOf('(') >= 0) {
                    result.push(item.trim());
                } else {
                    // 如果有"."则表示有表名,则获取表名之后的名称进行转换
                    var itemArr = item.split('.');
                    result.push(trim(item) + ' AS ' + alias(itemArr.length > 1 ? itemArr[1] : item));
                }
            });
            return result.join('\n');
        };

        var pathToUrl = function (arr) {
            var result = [];
            debugger
            arr.forEach(function (item) {
                if (!item || item.trim() == '') {
                    return;
                }
                var path = item.trim();
                var start = path.indexOf('com');
                if (start == -1) {
                    return;
                }
                var end = path.lastIndexOf('.view.xml');
                if (end == -1) {
                    end = path.length - 1;
                }
                result.push(path.substring(start, end).replace(new RegExp('/', 'gm'), '.') + '.d');
            });
            return result.join('\n');
        };

        /**
         * 将数据库格式的字段名转成java格式字段
         * @param str
         * @returns {*}
         */
        var alias = function (str) {
            if (!str || str.trim() == '') {
                return '';
            }
            // 用'_'分割字段名,然后将分割后的单词首字母(除第一个单词)转成大写,其他则都转换成小写字母
            var arr = str.split('_');
            for (var i = 0; i < arr.length; i++) {
                if (i == 0) {
                    arr[i] = arr[i].toLowerCase();
                } else {
                    arr[i] = arr[i].charAt(0) + arr[i].substr(1).toLowerCase();
                }
            }
            return arr.join('');
        };

        /**
         * 将别名转成数据库风格
         * @param str
         * @returns {*}
         */
        var reversalAlias = function (str) {
            if (!str || str.trim() == '') {
                return '';
            }
            // 分割每一个字符串,将在包含大写字母(除前面为空字符的单词外)前面添加'_',并且将所有单词转成大写
            var arr = [];
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                if (/^[A-Z]+$/.test(c)) {
                    if (i == 0 || !str.charAt(i - 1).trim()) {
                        arr.push(c);
                    } else {
                        arr.push('_' + c);
                    }
                } else {
                    arr.push(c.toUpperCase());
                }
            }
            return arr.join('');
        };

        var trim = function (str) {
            str = str ? str.trim() : '';
            // 如果最后有','则需要删除
            if (str.charAt(str.length - 1) == ',') {
                str = str.substr(0, str.length - 1);
            }
            return str;
        }

        var xx = function(str){
            var s = str.indexOf('"');
            var e = str.lastIndexOf('"');
            if(s != -1){
                if(e != -1){
                    str = str.substring(s, e);
                }else{
                    str = str.substring(s);
                }
            }
            return str.split('"').join(' ').split('+').join(' ');
        };

        var vm = new Vue({
            el: 'body',
            data: {},
            methods: {
                convert: function (type) {
                    var _source = $('#source');
                    var sourceText = _source.val();
                    if (!sourceText) {
                        return;
                    }
                    var sourceArr = sourceText.split('\n');
                    var targetText = null;
                    switch (type) {
                        case 1:
                            targetText = toString(sourceArr);
                            break;
                        case 2:
                            targetText = toStringBuilder(sourceArr);
                            break;
                        case 3:
                            targetText = toSql(sourceArr);
                            break;
                        case 4:
                            targetText = hqlToSql(sourceArr);
                            break;
                        case 5:
                            targetText = takeAlias(sourceArr);
                            break;
                        case 6:
                            targetText = pathToUrl(sourceArr);
                            break;
                    }
                    $('#target').val(targetText);
                },
                clear: function () {
                    $('#source').val(null);
                    $('#target').val(null);
                }
            }
        });
    }
);