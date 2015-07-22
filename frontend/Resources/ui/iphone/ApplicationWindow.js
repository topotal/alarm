module.exports = Lib.extend('/core/view', {

    __construct: function (config) {
        config = config || {};
        var $ = this;

        // ログアウト後の処理
        Ti.App.addEventListener('app:beforelogin', function (e) {
            e.cancelBubble = true;
            $._beforeLogin();
            return;
        });

        // ログイン後の処理
        Ti.App.addEventListener('app:afterlogin', function (e) {
            e.cancelBubble = true;
            $._afterLogin();
            return;
        });

        Ti.App.fireEvent('app:afterlogin');

        return;    
    },

    // ログアウト後の処理
    _beforeLogin: function () {
        return;
    },

    // ログイン後の処理
    _afterLogin: function () {

        // ホーム画面の生成
        var win = new (require('/ui/iphone/home/Index'))();
        win.open();

        return;
    }


});
