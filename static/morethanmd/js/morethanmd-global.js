var connection_handler = $.timer(function(){}, {time:60000, autostart:false});
var connection_state=1;
var fab_state=0;
var saving_icon_state=0;
var autosave_handler = $.timer(function(){}, {time:30000, autostart:false});
var preview_icon_state=0;
var frequent_icon_state=3, changes_refresh_f=9, changes_refresh_t=5; 
var allow_refresh_0=true, allow_refresh_1=true;
var refresh_handler = $.timer(function(){}, {time:changes_refresh_t*1000, autostart:false});
var fullscreen_icon_state=1;
var layout_icon_state=0;

var view_changes_cnt=0, save_changes_cnt=0, cache_changes_cnt=0;
var last_scroll_h=0;
var last_color_format="red"

const observer = lozad();