/**
 * twitter認証
 */
module.exports = Lib.extend('/core/view', {

    __construct: function (config) {
        config = config || {};
        var $ = this;

        // ヘッダーの左ボタン
        var leftNavButton = Ti.UI.createLabel({
            color: '#FFF',
            text: 'キャンセル'
        });
        leftNavButton.addEventListener('click', function (e) {
            e.cancelBubble = true;
            tabGroup.fireEvent('window:modalclose');
            return;
        });

        var win = $.createWindow({
            title: 'twitter',
            barColor        : '#55ACEE',
            titleAttributes : {
                color: '#FFF'
            },
            leftNavButton: leftNavButton
        });

        win.add($._createView(config));

        return win;    
    },

    _createView: function (config) {
        config = config || {};
        var $ = this;

        var self = Ti.UI.createWebView({
            top: 0,
            width: $.width,
            height: $.height
        });
        self.addEventListener('load', function(event) {
            if (!event.url.match(/oauth_verifier=([^&]+)/)) {
                return;
            }
            twitter.setVerifier(RegExp.$1);
            twitter.fetchAccessToken(
                function (data) {
                    if (!data.text.match(/^oauth_token=([^&]+)&oauth_token_secret=([^&]+)/)) {
                        return;
                    }
                    Ti.App.Properties.setString('tw-oauth-token', RegExp.$1);
                    Ti.App.Properties.setString('tw-oauth-token-secret', RegExp.$2);
    console.info('oauth_token: ', RegExp.$1);
    console.info('oauth_token_secret: ', RegExp.$2);
                    tabGroup.fireEvent('window:modalclose');

                    return;
                }, function (data) {
                    console.log(JSON.stringify(data));
                    return;
                }
            );
            return;
        });


        var jsOAuth = require('/core/jsOAuth');
        var twitter = jsOAuth.OAuth({
            consumerKey: Ti.App.Properties.getString('tw-consumer-key'),
            consumerSecret: Ti.App.Properties.getString('tw-consumer-secret'),
            callbackUrl: Ti.App.Properties.getString('app-siteurl'),
            requestTokenUrl: 'https://api.twitter.com/oauth/request_token',
            authorizationUrl: 'https://api.twitter.com/oauth/authorize',
            accessTokenUrl: 'https://api.twitter.com/oauth/access_token'
        });
        twitter.fetchRequestToken(
            function (url) {
                console.debug("Opening Request Token URL: " + url);
                // urlをセットしなおして
                // 画面を更新
                self.setUrl(url);
                self.reload();
                return;
            },
            function (data) {
                console.log(JSON.stringify(data));
                return;
            }
        );


        return self;
    }

});
