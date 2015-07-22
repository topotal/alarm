var _ = require('/core/lodash')._;
var moment = require('/core/moment');
moment.lang('ja');
var Lib = require('/core/lib');
var tabGroup = null;

/**
 * アプリケーションエントリポイント
 */
(function() {
   
    new (require('/ui/iphone/ApplicationWindow'))();

    return;
})();
