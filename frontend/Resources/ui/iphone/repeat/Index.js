/**
 * 繰り返し画面
 */
module.exports = Lib.extend('/core/view', {


    __construct: function (config) {
        config = config || {};
        var $ = this;

        console.info(config);

        $.mainWin = $.createWindow({
            backgroundColor: '#2c3e50'
        });

        var v = $._createView(config);
        $.mainWin.add(v);

        return $.mainWin;    
    },


    _createView: function (config) {
        config = config || {};
        config.data = config.data || [];
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
            text: '繰り返し',
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
                value: table.getValue()
            });
            return;
        }, 300, true));


        // 設定項目
        var table = Ti.UI.createTableView(_.extend({
            top: 35,
            width: Ti.UI.FILL,
            height: Ti.UI.SIZE
        }, Ti.Android ? {
            separatorColor: '#34495e',
        } : {
            scrollable: false,
            separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE
        }));
        self.add(table);


        // 一週間分rowを生成
        var rows = [];
        _.each($.weakData, function (_data, _index) {
            var row = $._createRow({
                value: _data.value,
                text: String.format('毎%s曜日', _data.text)
            }); 
            rows.push(row);
            row.fireEvent('view:changeactive', {
                active: config.value[_index] === 1 ? true : false
            });
            return;
        });
        // テーブルにrowをセット
        table.setData(rows);


        // テーブルのクリックイベント
        table.addEventListener('click', _.debounce(function (e) {
            e.cancelBubble = true;
            e.source.fireEvent('view:changeactive', {
                active: !e.source.isActive
            });
            return;
        }, 300, true));


        // テーブルの値取得メソッド
        table.getValue = function () {
            var values = [0, 0, 0, 0, 0, 0, 0];
            _.each(table.getData()[0].getRows(), function (_row, _index) {
                if(_row.isActive) {
                    values[_index] = 1;
                } else {
                    values[_index] = 0;
                }
                return;
            });
            return values;
        }

        return self;
    },

   
    /**
     * 曜日のrow
     */
    _createRow: function (config) {
        config = config || {};
        var $ = this;

        var self = $.createBaseRow(_.extend({
            height: 44,
            isActive: false
        }, config));

        // チェックマーク
        var check = Ti.UI.createImageView({
            right: 0,
            width: 44,
            height: 44,
            image: '/images/common/icon_check.png',
            touchEnabled: false
        });

        // チェックマークの切り替え処理
        self.addEventListener('view:changeactive', function (e) {
            e.cancelBubble = true;
            console.info('changeactive', e.active);
            if(e.active) {
                self.add(check);
                self.isActive = true;
            } else {
                self.remove(check);
                self.isActive = false;
            }
            return;
        })

        return self;
    }

});
