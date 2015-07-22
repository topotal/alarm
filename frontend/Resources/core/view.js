module.exports = Lib.extend('/core/observe', {

    width: Ti.Platform.displayCaps.platformWidth,
    height: Ti.Platform.displayCaps.platformHeight,

    weakData: [
        {
            text: '日',
            value: 0
        },
        {
            text: '月',
            value: 1
        },
        {
            text: '火',
            value: 2
        },
        {
            text: '水',
            value: 3
        },
        {
            text: '木',
            value: 4
        },
        {
            text: '金',
            value: 5
        },
        {
            text: '土',
            value: 6
        }
    ],


    /**
     * window生成
     */
    createWindow: function (config) {
        config = config || {};
        var $ = this;

        var win = Ti.UI.createWindow(_.extend({
            top: 0,
            translucent     : true,
            includeOpaqueBars:true,
            autoAdjustScrollViewInsets: true,
            backgroundColor : '#E1F1E3',
            barColor        : '#65D073',
            titleAttributes : {
                color: '#FFF'
            },
            extendEdges     : [Ti.UI.EXTEND_EDGE_TOP, Ti.UI.EXTEND_EDGE_BOTTOM]
        },
        Ti.Android ? {} : {
            statusBarStyle  : Ti.UI.iPhone.StatusBar.LIGHT_CONTENT
        },
        config));


        // ロードインジケーター
        var loadIndicater = $.createLoadIndicater({
            visible: false
        });
        win.add(loadIndicater)
       

        // インジケータ表示
        win.addEventListener('view:loading', function (e) {
            e.cancelBubble = true;
            loadIndicater.show();
            return;
        });


        // インジケータ表示
        win.addEventListener('view:loaded', function (e) {
            e.cancelBubble = true;
            loadIndicater.hide();
            return;
        });

        return win;
    },


    /**
     * ベースとなるviewの生成
     */
    createBaseView: function (config) {
        config = config || {};
        var $ = this,
            isScroll = config.isScroll || false;
        delete config.isScroll;

        // スクロール有りの場合はscrollViewを返却
        if(isScroll) {
            return Ti.UI.createScrollView(_.extend({
                top: 0,
                width: Ti.UI.FILL,
                height: Ti.UI.FILL
            }, config));
        }

        // 普通のViewを返却
        return Ti.UI.createView(_.extend({
            top: 0,
            width: Ti.UI.FILL,
            height: Ti.UI.FILL
        }, config));
    },


    /**
     * アラート
     */
    alert: function (text, callback) {
        var $ = this;

        var dialog = Ti.UI.createAlertDialog({
            message: text || '',
            ok: 'OK',
            title: Ti.App.getName()
        });
        dialog.addEventListener('click', function (e) {
            e.cancelBubble = true;
            if(_.isFunction(callback)) {
                callback();
            }
            return;
        });
        dialog.show();

        return;
    },

    
    /**
     * 確認ダイアログ
     */
    confirm: function (text, callback) {
        var $ = this;

        var dialog = Ti.UI.createAlertDialog({
            message: text || '',
            cancel: 0,
            buttonNames: ['キャンセル', 'OK'],
            title: Ti.App.getName()
        });
        dialog.addEventListener('click', function (e) {
            e.cancelBubble = true;
            if(e.cancel == e.index) {
                return;
            }
            callback();
            return;
        });
        dialog.show();

        return;
    },


    /**
     * 1pxの横線
     */
    createSeparator: function (config) {
        config = config || {};
        var $ = this;

        var self = Ti.UI.createView(_.extend({
            width: Ti.UI.FILL,
            height: 1,
            backgroundColor: '#BDC3C7'
        }, config));

        return self;
    },


    /**
     * テキスト入りボタン
     */
    createButton: function (config) {
        config = config || {};
        var $ = this;

        var self = Ti.UI.createView(_.extend({
            height: 60,
            borderRadius: 5,
            backgroundColor: '#e74c3c'
        }, config));
        self.add(Ti.UI.createLabel({
            text: config.text || '',
            color: config.color || '#FFF',
            touchEnabled: false,
            font: {
                fontSize: 16
            }
        }));

        // ボタンを透けさせる
        self.addEventListener('view:touchdisable', function (e) {
            e.cancelBubble = true;
            self.applyProperties({
                opacity: 0.5
            });
            return;
        });

        // ボタンを透明度をもどす 
        self.addEventListener('view:touchenable', function (e) {
            e.cancelBubble = true;
            self.applyProperties({
                opacity: 1
            });
            return;
        });

        // 初期値として押せない設定だった時に発火
        if(config.touchDisabled) {
            self.fireEvent('view:touchdisable');
        }

        return self;
    },


    /**
     * rowの基本
     */
    createBaseRow: function (config) {
        config = config || {};
        var $ = this; 

        var self = Ti.UI.createTableViewRow(_.extend({
            height: 44,
            backgroundColor: '#34495e'
        }, config));

        // タイトル
        self.add(Ti.UI.createLabel({
            left: 20,
            height: 44,
            text: config.text,
            color: '#FFF',
            font: {
                fontSize: 18,
            },
            touchEnabled: false
        }));

        // 右矢印
        if(config.child) {
            self.add(Ti.UI.createImageView({
                right: 0,
                width: 44,
                height: 44,
                image: '/images/common/icon_arrow.png',
                touchEnabled: false
            }));
        }

        // 下線
        var line = Ti.UI.createView({
            left: 14,
            right: 0,
            bottom: 0,
            opacity: 0.5,
            height: 1,
            backgroundColor: '#FFF',
            touchEnabled: false
        });
        self.add(line);

        return self;
    },


    /**
     * ロードインジケーターの生成
     */
    createLoadIndicater: function (config) {
        config = config || {};
        var $ = this;

        var self = Ti.UI.createView(_.extend({
            width: 80,
            height: 80,
            borderRadius: 5,
            zIndex: 100,
            backgroundColor: '#99000000'
        }, config));

        var style;
        if (Ti.Android){
            style = Ti.UI.ActivityIndicatorStyle.PLAIN;
        } else {
            style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
        }
        var activityIndicator = Ti.UI.createActivityIndicator({
            style:style,
            height:Ti.UI.SIZE,
            width:Ti.UI.SIZE
        });
        activityIndicator.show();
        self.add(activityIndicator);
        
        return self;
    }

});
