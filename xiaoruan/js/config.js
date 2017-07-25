require.config({
    paths: {
        'jquery': 'jquery.min',
        'bootstrap': 'bootstrap.min',
        'bootstrap-select': 'bootstrap-select.min',
        'bootstrap-datetimepicker': 'bootstrap-datetimepicker.min',
        'bootstrap-datetimepicker.zh-CN': 'bootstrap-datetimepicker.zh-CN',
        'echarts': 'echarts.min',
        'vue': 'vue.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-select': {
            deps: ['jquery']
        },
        'bootstrap-datetimepicker': {
            deps: ['jquery']
        },
        'bootstrap-datetimepicker.zh-CN': {
            deps: ['jquery', 'bootstrap-datetimepicker']
        }
    }
});