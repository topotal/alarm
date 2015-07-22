/**
 * ホーム
 */
module.exports = Lib.extend('/core/view', {


    __construct: function (config) {
        config = config || {};
        var $ = this;

        $.mainWin = $.createWindow({
            title : 'ホーム',
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
            text: 'よしかわあらーむ',
            color: '#FFF',
            font: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        });
        header.add(title);

        // 設定
        var settingButton = Ti.UI.createImageView({
            right: 0,
            bottom: 0,
            width: 44,
            height: 44,
            image: '/images/common/icon_settings.png'
        });
        header.add(settingButton);

        settingButton.addEventListener('click', _.debounce(function (e) {
            e.cancelBubble = true;
            console.info('click!');
            // ホーム画面の生成
            var win = new (require('/ui/iphone/setting/Index'))();
            win.open(Ti.Android ? {} : {
                modal:true,
                modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_CROSS_DISSOLVE
                //modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FULLSCREEN
            });
            return;
        }, 300, true));


        // 4桁の数字を入れるフィールド
        var numberField = $._createNumberField({
            top: 16
        });
        self.add(numberField);


        // 説明文
        var label = Ti.UI.createLabel({
            top: 10,
            left: 20,
            right: 20,
            text: '表示されている4桁の数字を\n入力してください',
            textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
            color: '#FFF',
            font: {
                fontSize: 12
            }
        });
        self.add(label);


        // 決定ボタン    
        var sendButton = $.createButton({
            top: 10,
            left: 20,
            right: 20,
            text: '決定'
        });
        self.add(sendButton);

        // 送信ボタンを押したらblurさせる
        sendButton.addEventListener('click', function (e) {
            e.cancelBubble = true;
            numberField.fireEvent('view:blur');
            // 向き先が設定されていなければアラートを表示
            if(!Ti.App.Properties.getString('api-url')) {
                $.alert('ipアドレスを設定してください');
                return;
            }


            // 数字が設定されていない場合
            if(numberField.getValue().length < 4) {
                $.alert('数字4桁は必須です');
                return;
            }


            $.mainWin.fireEvent('view:loading');
            var model = new (require('/model/Home'))();       
            model.stop({
                data: {
                    alarm_key: numberField.getValue()
                },
                success: function (res) {
                    return;
                },
                error: function (res) {
                    $.alert(res[0].message);
                    return;
                },
                complete: function (res) {
                    $.mainWin.fireEvent('view:loaded');
                    return;
                }
            });
            return;
        });


        // コピーライト
        self.add(Ti.UI.createLabel({
            top: 20,
            text: 'Copyright © 2015 topotal.com All Rights Reserved.',
            textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
            color: '#DDD',
            font: {
                fontSize: 10
            }
        }));


        // 画面が開きしだいfieldにfocusを当てる
        $.mainWin.addEventListener('open', function (e) {
            e.cancelBubble = true;
            numberField.fireEvent('view:focus');
            return;
        });

        return self;
    },



    /**
     * 4桁の数字入力用フィールド
     */
    _createNumberField: function (config) {
        config = config || {};
        var $ = this;
        var numbers = [];

        var self = Ti.UI.createView(_.extend({
            width: 280,
            height: 90
        }, config));


        if(!Ti.Android) {
            var flexSpace = Ti.UI.createButton({
                systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
            });
            var doneButton = Ti.UI.createButton({
                systemButton:Ti.UI.iPhone.SystemButton.DONE
            });
            doneButton.addEventListener('click',function(){
                textField.blur();
            });
        }

        // ４桁の数字を入れるフィールド
        var textField = Ti.UI.createTextField(_.extend({
            left: -1000,
            maxLength: 4,
            enableReturnKey: true,
            keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD
        }, Ti.Android ? {
            softKeyboardOnFocus: Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
        } : {
            keyboardType: Titanium.UI.KEYBOARD_NUMBER_PAD,
            keyboardToolbar: [flexSpace,flexSpace,doneButton],
            keyboardToolbarHeight: 30,
        }));
        self.add(textField);


        // textFieldに値をいれたらlabelに反映させる
        textField.addEventListener('change', function (e) {
            e.cancelBubble = true;
            _.each(numbers, function (_num, _index) {
                _num.setText(e.value[_index]);
                return;
            });
            self.fireEvent('view:change', {
                value: e.value
            });
            return;
        });


        for(var i=0; i<4; i++) {
            numbers.push(Ti.UI.createLabel({
                left: i*70,
                width: 65,
                height: Ti.UI.FILL,
                text: '',
                color: '#FFF',
                backgroundColor: '#34495e',
                textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
                font: {
                    fontSize: 50
                }
            }));
            self.add(numbers[i]);
        }


        // focusイベント
        self.addEventListener('view:focus', function (e) {
            e.cancelBubble = true;
            if(Ti.Android) {
                textField.fireEvent('click');
            } else {
                textField.focus();
            }
            return;
        });

        // blurイベント
        self.addEventListener('view:blur', function (e) {
            e.cancelBubble = true;
            textField.blur();
            return;
        });

        // clickされたらフォーカスを当てる
        self.addEventListener('click', function (e) {
            e.cancelBubble = true;
            textField.focus();
            self.fireEvent('view:focus');
            return;
        });

        // getValueメソッド
        self.getValue = function () {
            return textField.getValue(); 
        }

        return self;
    }

});
