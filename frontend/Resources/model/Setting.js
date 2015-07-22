/**
 * 設定画面API
 */
module.exports = Lib.extend('/core/model', {

    __construct: function (config) {
        config = config || {};
        var $ = this;
        return;
    },


    show: function (config) {
        config = config || {};
        config.data = config.data || {};
        var url = Ti.App.Properties.getString('api-url');
        var $ = this;

        _.extend(config, {
            method: 'GET',
            url: 'http://' + url + '/schedule/',
            data: config.data
        });

        $.request(config);
        return;
    },


    update: function (config) {
        config = config || {};
        config.data = config.data || {};
        var url = config.data.url;
        var $ = this;
        delete config.data.url;

        _.extend(config, {
            method: 'POST',
            url: 'http://' + url + '/set/',
            data: config.data
        });

        $.request(config);
        
        return;
    }

});
