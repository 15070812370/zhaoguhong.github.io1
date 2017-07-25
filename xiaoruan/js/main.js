var init = function($, bootstrap, Vue){

    var analysisData = function(temp, data_list){
        if(!temp || !data_list){
            return new Error('模版或数据为空');
        }
        var result = [];
        for(key in data_list){
            var data = data_list[key];
            for(var i = 0 ; i < data.length; i++ ){
                var str = result[i] || temp;
                result[i] = str.replace(new RegExp(':' + key, 'gm'), data[i]);
            }
        }
        return result;
    };

    var vm = new Vue({
        el: 'body',
        data: {
        },
        methods: {
            generate: function (type) {
                var temp = $('#temp_text').val();
                var data_list = window.localStorage.getItem("data_list");
                data_list = data_list && JSON.parse(data_list);
                var result = analysisData(temp, data_list);
                $('#result_text').val(result.join('\n'));
                $('#resultModal').modal('show');
            },
            save: function () {
                var temp = $('#temp_text').val();
                window.localStorage.setItem("temp", temp);
            },
            add: function(){
                var data_key = $('#data_key').val();
                var data_value = $('#data_value').val();
                if(!data_key || !data_key.trim()){
                    return;
                }
                // 保存数据
                data_value = data_value.trim().split('\n');
                var data_list = window.localStorage.getItem("data_list");
                data_list = data_list ? JSON.parse(data_list) : {};
                data_list[data_key] = data_value;
                data_list = JSON.stringify(data_list);
                window.localStorage.setItem("data_list", data_list);
                $('#data_key').val('');
                $('#data_value').val('');
                $('#data_list_text').val(data_list);
                $('#dataModal').modal('hide');
            },
            clearTemp: function(){
                window.localStorage.setItem("temp", '');
                $('#temp_text').val('');
            },
            clearData: function(){
                window.localStorage.setItem("data_list", '');
                $('#data_list_text').val('');
            }
        },
        ready: function () {
            this.$nextTick(function(){
                if(!window.localStorage){
                    alert("浏览器不支持本地缓存！");
                    $('.btn').hide();
                    return;
                }
                var temp = window.localStorage.getItem("temp");
                var data_list = window.localStorage.getItem("data_list");
                $('#temp_text').val(temp);
                $('#data_list_text').val(data_list);
            });
        }
    });
};

require(['config'],
    function (config) {
        require(['jquery', 'bootstrap', 'vue'], init);
    }
);