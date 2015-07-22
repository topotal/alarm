/**
 * ipアドレス設定画面
 */
module.exports = Lib.extend('/core/view', {


    __construct: function (config) {
        config = config || {};
        var $ = this;

        console.info('========== ipaddress ==========', config);

        $.mainWin = $.createWindow({
            backgroundColor: '#2c3e50'
        });

        var v = $._createView(config);
        $.mainWin.add(v);

        return $.mainWin;    
    },


    _createView: function (config) {
        config = config || {};
        var $ = this;

        var self = Ti.UI.createView({
            width: Ti.UI.FILL,
            height: Ti.UI.FILL,
            layout: 'vertical'
        });


        // ヘッダー
        var header = Ti.UI.createView({
            width: Ti.UI.FILL,
            height: Ti.Android ? 44 : 64,
            backgroundColor: '#34495e' 
        });
        self.add(header);


        // タイトル
        var title = Ti.UI.createLabel({
            bottom: 0,
            height: 44,
            text: 'ipアドレス',
            color: '#FFF',
            font: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        });
        header.add(title);


        // 戻るボタン
        var backButton = Ti.UI.createLabel({
            left: 10,
            bottom: 0,
            height: 44,
            text: '戻る',
            color: '#FFF',
            font: {
                fontSize: 18
            }
        });
        header.add(backButton);

        // 戻るボタンでwindowを閉じる
        backButton.addEventListener('click', _.debounce(function (e) {
            e.cancelBubble = true;
            $.mainWin.close();
            $.mainWin.fireEvent('view:close', {
                value: textField.getValue()
            });
            return;
        }, 300, true));


        // 説明文
        self.add(Ti.UI.createLabel({
            top: 20,
            text: 'よしかわあらーむの向き先を設定してください',
            color: '#DDD',
            font: {
                fontSize: 14
            }
        }));


        // ipaddress入力フィールド
        var textField = Ti.UI.createTextField({
            top: 20,
            left: 20,
            right: 20,
            height: 50,
            color: '#FFF',
            paddingLeft: 10,
            paddingRight: 10,
            keyboardType: Ti.UI.KEYBOARD_EMAIL,
            backgroundColor: '#34495e',
            value: config.value || ''
        });
        self.add(textField);


        // 保存ボタン    
        var sendButton = $.createButton({
            top: 30,
            left: 20,
            right: 20,
            text: '決定'
        });
        self.add(sendButton);

        // 設定を送信
        sendButton.addEventListener('click', function (e) {
            e.cancelBubble = true;

            $.mainWin.close();
            $.mainWin.fireEvent('view:close', {
                value: textField.getValue()
            });

            return;
        });


        return self;
    }

});
