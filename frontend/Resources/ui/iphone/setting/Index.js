/**
 * 設定画面
 */
module.exports = Lib.extend('/core/view', {


    __construct: function (config) {
        config = config || {};
        var $ = this;

        $.mainWin = $.createWindow({
            backgroundColor: '#2c3e50'
        });

        //if(!Ti.App.Properties.getString('api-url')) {
            var v = $._createView(config);
            $.mainWin.add(v);
        //} else {
        //    $.mainWin.fireEvent('view:loading');
        //    var model = new (require('/model/Setting'))();       
        //    model.show({
        //        success: function (res) {
        //            $.mainWin.fireEvent('view:loaded');
        //            var v = $._createView(_.extend(config, {
        //                data: res[0].fields
        //            }));
        //            $.mainWin.add(v);
        //            return;
        //        },
        //        error: function (res) {
        //            $.alert(res);
        //            return;
        //        },
        //        complete: function (res) {
        //            $.mainWin.fireEvent('view:loaded');
        //            return;
        //        }
        //    });
        //}

        return $.mainWin;    
    },


    _createView: function (config) {
        config = config || {};
        var $ = this;


        var self = Ti.UI.createView({
            width: Ti.UI.FILL,
            height: Ti.UI.FILL,
            isScroll: true,
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
            text: '設定',
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
                fontSize: 18,
            }
        });
        header.add(backButton);

        // 戻るボタンでwindowを閉じる
        backButton.addEventListener('click', _.debounce(function (e) {
            e.cancelBubble = true;
            $.mainWin.close();
            return;
        }, 300, true));


        var value = new Date();

        if(config.data) {
            value.setMinutes(parseInt(config.data.minute));
            value.setHours(parseInt(config.data.hour));
        }
        // タイムピッカー
        var picker = Ti.UI.createPicker({
            type: Ti.UI.PICKER_TYPE_TIME,
            value: value
        });
        self.add(picker);


        // 設定項目
        var table = Ti.UI.createTableView(_.extend({
            top: 20,
            width: Ti.UI.FILL,
            height: Ti.UI.SIZE
        }, Ti.Android ? {
            separatorColor: '#34495e',
        } : {
            scrollable: false,
            separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
        }));
        self.add(table);

        // 繰り返し
        var repeat = $.createRepeatRow({
            text: '繰り返し'
        });
        // rowのタップイベント
        repeat.addEventListener('click', _.debounce(function (e) {
            e.cancelBubble = true;

            // 繰り返し設定画面を開く
            var win = new (require('/ui/iphone/repeat/Index'))({
                value: repeat.value || []
            });
            win.open(Ti.Android ? {} : {
                modal:true,
                modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_CROSS_DISSOLVE
            });

            // 閉じた時のイベント
            win.addEventListener('view:close', function (e) {
                e.cancelBubble = true;
                win.removeEventListener('view:close', arguments.callee);
                repeat.fireEvent('view:setvalue', {
                    value: e.value
                });
                return;
            });

            return;
        }, 300, true));


        // 向き先
        var ipaddress = $.createIpaddressRow();
        // rowのタップイベント
        ipaddress.addEventListener('click', _.debounce(function (e) {
            e.cancelBubble = true;

            // 繰り返し設定画面を開く
            var win = new (require('/ui/iphone/ipaddress/Index'))({
                value: ipaddress.value || ''
            });
            win.open(Ti.Android ? {} : {
                modal:true,
                modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_CROSS_DISSOLVE
            });

            // 閉じた時のイベント
            win.addEventListener('view:close', function (e) {
                e.cancelBubble = true;
                win.removeEventListener('view:close', arguments.callee);
                ipaddress.fireEvent('view:setvalue', {
                    value: e.value
                });
                return;
            });

            return;
        }, 300, true));


        // テーブルにrowをセット
        table.setData([
            ipaddress,
            repeat
        ]);


        // 保存ボタン    
        var sendButton = $.createButton({
            top: 30,
            left: 20,
            right: 20,
            text: '保存'
        });
        self.add(sendButton);


        // 設定を送信
        sendButton.addEventListener('click', function (e) {
            e.cancelBubble = true;


            if(!ipaddress.getValue()) {
                $.alert('ipアドレスは必須です');
                return;
            }

            if(!repeat.getValue()) {
                repeat.value = [0, 0, 0, 0, 0, 0, 0];
            }

            $.mainWin.fireEvent('view:loading');
            var model = new (require('/model/Setting'))();       
            model.update({
                data: {
                    url: ipaddress.getValue(),
                    hour: parseInt(moment(picker.getValue()).format('H')),
                    minute: parseInt(moment(picker.getValue()).format('m')),
                    repeat_sunday   : repeat.getValue()[0],
                    repeat_monday   : repeat.getValue()[1],
                    repeat_tuesday  : repeat.getValue()[2],
                    repeat_wednesday: repeat.getValue()[3],
                    repeat_thursday : repeat.getValue()[4],
                    repeat_friday   : repeat.getValue()[5],
                    repeat_saturday : repeat.getValue()[6]
                },
                success: function (res) {
                    $.alert('保存しました', function () {
                        Ti.App.Properties.setString('api-url', ipaddress.getValue());
                        $.mainWin.close();
                        return;
                    });
                    return;
                },
                error: function (res) {
                    $.alert(res);
                    return;
                },
                complete: function (res) {
                    $.mainWin.fireEvent('view:loaded');
                    return;
                }
            });

            return;
        });


        // バージョン表記
        var version = Ti.UI.createLabel({
            top: 20,
            text: 'ver.' + Ti.App.getVersion(),
            color: '#DDD',
            font: {
                fontSize: 14
            }
        });
        self.add(version);

        _.delay(function () {
            ipaddress.fireEvent('view:setvalue', {
                value: Ti.App.Properties.getString('api-url', '')
            });

            if(config.data) {
                repeat.fireEvent('view:setvalue', {
                    value: [
                        config.data.repeat_sunday ? 1 : 0 ,
                        config.data.repeat_monday ? 1 : 0 ,
                        config.data.repeat_tuesday ? 1 : 0 ,
                        config.data.repeat_wednesday ? 1 : 0 ,
                        config.data.repeat_thursday ? 1 : 0 ,
                        config.data.repeat_friday ? 1 : 0 ,
                        config.data.repeat_saturday ? 1 : 0 
                    ]
                });
            }
        }, 300);

        return self;
    },


    /**
     * 向き先
     */
    createIpaddressRow: function (config) {
        config = config || {};
        var $ = this;

        // 向き先
        var self = $.createBaseRow({
            text: 'ipアドレス',
            child: true
        });

        // 値
        var value = Ti.UI.createLabel({
            right: 40,
            height: 44,
            text: '',
            color: '#FFF',
            font: {
                fontSize: 18
            }
        });
        self.add(value);

        // 値のセットイベント
        self.addEventListener('view:setvalue', function (e) {
            e.cancelBubble = true;


            // fieldに値をセット
            self.value = e.value;
            self.remove(value);
            value.setText(e.value);
            self.add(value);
            return;
        });

        self.getValue = function () {
            return self.value;
        }

        return self;
    },


    /**
     * 繰り返しのrow
     */
    createRepeatRow: function (config) {
        config = config || {};
        var $ = this;

        var self = $.createBaseRow({
            text: '繰り返し',
            child: true
        });

        // 曜日
        var weak = Ti.UI.createLabel({
            right: 40,
            height: 44,
            text: '',
            color: '#FFF',
            font: {
                fontSize: 18,
            }
        });
        self.add(weak);


        // 値のセットイベント
        self.addEventListener('view:setvalue', function (e) {
            e.cancelBubble = true;


            // fieldに値をセット
            self.value = e.value;

            // 一度Textをリセットして再度曜日テキストを設置
            self.remove(weak);
            weak.setText('');
            _.each(e.value, function (_value, _index) {
                if(_value) {
                    weak.setText(weak.getText() + ' ' + $.weakData[_index].text);
                }
                return;
            });
            self.add(weak);
            return;
        });

        self.getValue = function () {
            return self.value;
        }

        return self;
    }

});
