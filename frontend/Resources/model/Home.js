/**
 * ホームAPI
 */
module.exports = Lib.extend('/core/model', {

    __construct: function (config) {
        config = config || {};
        var $ = this;
        return;
    },


    stop: function (config) {
        config = config || {};
        var $ = this;

        var url = Ti.App.Properties.getString('api-url');

        _.extend(config, {
            method: 'POST',
            url: 'http://' + url + '/stop/',
            data: config.data
        });

        $.request(config);
        
        return;
    }

});
