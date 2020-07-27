$('#toolbar-button-grammar').toolbar({content: '#toolbar-button-grammar-options', position: 'bottom', hideOnClick: true});
$('#toolbar-button-richtext').toolbar({content: '#toolbar-button-richtext-options', position: 'bottom', hideOnClick: true});
$('#toolbar-button-expression').toolbar({content: '#toolbar-button-expression-options', position: 'bottom', hideOnClick: true});
$('#toolbar-button-advanced').toolbar({content: '#toolbar-button-advanced-options', position: 'bottom', hideOnClick: true});
$('#toolbar-button-viewcss').toolbar({content: '#toolbar-button-viewcss-options', position: 'bottom', hideOnClick: true});
$('#toolbar-button-download').toolbar({content: '#toolbar-button-download-options', position: 'bottom', hideOnClick: true});


function change_saving_icon(){
    saving_icon_state = (saving_icon_state+1)%3;
    if (saving_icon_state==1){
        $('#saving_icon')[0].innerHTML="<i class='material-icons'>save</i>";
        $('#saving_icon')[0].className="btn-floating green";
        M.toast({html: '已变更为 自动保存 模式!', displayLength: 1000, classes: 'record'});
    }
    else if (saving_icon_state==2){
        $('#saving_icon')[0].innerHTML="<i class='material-icons'>content_copy</i>";
        $('#saving_icon')[0].className="btn-floating lime";
        M.toast({html: '已变更为 自动备份 模式!', displayLength: 1000, classes: 'record'});
    }
    else{
        $('#saving_icon')[0].innerHTML="<i class='material-icons'>cloud_off</i>";
        $('#saving_icon')[0].className="btn-floating red";
        M.toast({html: '已停止保存和备份!', displayLength: 2000, classes: 'alert'});
    }
}
function change_preview_icon(){
    preview_icon_state = (preview_icon_state + 1)%2;
    block_width="50%"
    if (layout_icon_state==2) block_width="70%";
    if (preview_icon_state==0){
        $('#preview_icon')[0].innerHTML="<i class='material-icons'>live_tv</i>";
        $('#preview_icon')[0].className="btn-floating blue";

        $('#mt_viewer_live').css('width', block_width);
        $('#mt_viewer_live').css('display', $('#mt_viewer_real').css('display'));
        $('#mt_viewer_real').css('display', 'none');
    }
    else{
        $('#preview_icon')[0].innerHTML="<i class='material-icons'>vpn_lock</i>";
        $('#preview_icon')[0].className="btn-floating teal";

        $('#mt_viewer_real').css('width', block_width);
        $('#mt_viewer_real').css('display', $('#mt_viewer_live').css('display'));
        $('#mt_viewer_live').css('display', 'none');
    }
}
function change_frequent_icon(){
    frequent_icon_state = (frequent_icon_state+1)%6;
    if (frequent_icon_state==0){
        $('#frequent_icon')[0].innerHTML="<i class='material-icons'>timer_off</i>";
        $('#frequent_icon')[0].className="btn-floating indigo lighten-3";
        banRefresh();
        refresh_handler.set({time:changes_refresh_t*1000});
    }
    else if (frequent_icon_state==1){
        $('#frequent_icon')[0].innerHTML="<i class='material-icons'>looks_one</i>";
        $('#frequent_icon')[0].className="btn-floating indigo darken-2";
        changes_refresh_f=1;
        changes_refresh_t=1;
        permitRefresh();
        continueRefresh();
        refresh_handler.set({time:changes_refresh_t*1000});
    }
    else if (frequent_icon_state==2){
        $('#frequent_icon')[0].innerHTML="<i class='material-icons'>looks_two</i>";
        $('#frequent_icon')[0].className="btn-floating indigo darken-1";
        changes_refresh_f=3;
        changes_refresh_t=2;
        permitRefresh();
        continueRefresh();
        refresh_handler.set({time:changes_refresh_t*1000});
    }
    else if (frequent_icon_state==3){
        $('#frequent_icon')[0].innerHTML="<i class='material-icons'>looks_3</i>";
        $('#frequent_icon')[0].className="btn-floating indigo";
        changes_refresh_f=9;
        changes_refresh_t=3;
        continueRefresh();
        refresh_handler.set({time:changes_refresh_t*1000});
    }
    else if (frequent_icon_state==4){
        $('#frequent_icon')[0].innerHTML="<i class='material-icons'>looks_4</i>";
        $('#frequent_icon')[0].className="btn-floating indigo lighten-1";
        changes_refresh_f=27;
        changes_refresh_t=5;
        permitRefresh();
        continueRefresh();
        refresh_handler.set({time:changes_refresh_t*1000});
    }
    else if (frequent_icon_state==5){
        $('#frequent_icon')[0].innerHTML="<i class='material-icons'>looks_5</i>";
        $('#frequent_icon')[0].className="btn-floating indigo lighten-2";
        changes_refresh_f=81;
        changes_refresh_t=9;
        permitRefresh();
        continueRefresh();
        refresh_handler.set({time:changes_refresh_t*1000});
    }        
}
function change_fullscreen_icon(){
    fullscreen_icon_state = (fullscreen_icon_state + 1)%2;
    if (fullscreen_icon_state==0){
        $('#fullscreen_icon')[0].innerHTML="<i class='material-icons'>fullscreen_exit</i>";
        $('#fullscreen_icon')[0].className="btn-floating purple lighten-2";
        $('#mt').css('width', '90%');
        $('#mt').css('padding-left', '5%');
        $('#mt').css('padding-right', '5%');
    }
    else{
        $('#fullscreen_icon')[0].innerHTML="<i class='material-icons'>fullscreen</i>";
        $('#fullscreen_icon')[0].className="btn-floating purple";
        $('#mt').css('width', '100%');
        $('#mt').css('padding-left', '0');
        $('#mt').css('padding-right', '0');
    }
}
function change_layout_icon(){
    layout_icon_state = (layout_icon_state + 1)%3;
    if (layout_icon_state==0){
        $('#layout_icon')[0].innerHTML="<i class='material-icons'>view_carousel</i>";
        $('#layout_icon')[0].className="btn-floating yellow darken-2";

        $('#mt_toolbar').css('display','flex');
        $('#mt_editor').css('display', 'block');
        $('#mt_editor').css('width', '50%');
        $("#bundel_divider").show();
        var viewer_open = null, viewer_close = null;
        if (preview_icon_state==0){
            viewer_open = $('#mt_viewer_live');
            viewer_close = $('#mt_viewer_real');
        }
        else{
            viewer_open = $('#mt_viewer_real');
            viewer_close = $('#mt_viewer_live');
        }
        viewer_open.css('display', 'block');
        viewer_open.css('width', '50%');
        viewer_close.css('display', 'none');
    }
    else if (layout_icon_state==1){
        $('#layout_icon')[0].innerHTML="<i class='material-icons'>receipt</i>";
        $('#layout_icon')[0].className="btn-floating yellow";

        $('#mt_toolbar').css('display','flex');
        $('#mt_editor').css('display', 'block');
        $('#mt_editor').css('width', '100%');
        $("#bundel_divider").hide();
        $('#mt_viewer_live').css('display', 'none');
        $('#mt_viewer_real').css('display', 'none');
    }
    else if (layout_icon_state==2){
        $('#layout_icon')[0].innerHTML="<i class='material-icons'>remove_red_eye</i>";
        $('#layout_icon')[0].className="btn-floating yellow";

        $('#mt_toolbar').css('display', 'none');
        $('#mt_editor').css('display', 'none');
        $("#bundel_divider").hide();
        var viewer_open = null, viewer_close = null;
        if (preview_icon_state==0){
            viewer_open = $('#mt_viewer_live');
            viewer_close = $('#mt_viewer_real');
        }
        else{
            viewer_open = $('#mt_viewer_real');
            viewer_close = $('#mt_viewer_live');
        }
        viewer_open.css('display', 'block');
        viewer_open.css('width', '70%');
        viewer_close.css('display', 'none');
    }
}

function toggleFAB(){
    fab_state++;
    fab_state%=2;
    if (fab_state==0)
        M.FloatingActionButton.getInstance($(".fixed-action-btn")[0]).close();
    else M.FloatingActionButton.getInstance($(".fixed-action-btn")[0]).open();
}

function overFAB(){
    if (fab_state==0)
        M.FloatingActionButton.getInstance($(".fixed-action-btn")[0]).open();
}

function leaveFAB(){
    if (fab_state==0)
        M.FloatingActionButton.getInstance($(".fixed-action-btn")[0]).close();
}

function insertExpr(k){
    var cm = mt_editor;
    cm.replaceSelection(':'+k+':');
}

function changeColor(c=null){
    if (c!=null) last_color_format=c;
    var cm = mt_editor;
    mt_editor.options.extraKeys["Alt-C"](mt_editor);
}

function displayColor(c){
    $("#color_display").css('color', c);
}
function displaySize(s){
    $("#color_display").css('font-size', s+'px');
}

function createLink(){
    var text = $('#set_link_text')[0].value;
    var link = $('#set_link_link')[0].value;
    var title = $('#set_link_title')[0].value;
    var nwin = $('#set_link_open')[0].checked;
    if (link.length==0) return;
    if (nwin) nwin = 'target="__blank__"';
    else nwin="";
    var content = '<a href="'+link+'" title="'+title+'" '+nwin+'>'+text+'</a>'
    var cm = mt_editor;
    cm.replaceSelection(content);
}

function createImg(){
    var alt = $('#set_img_alt')[0].value;
    var link = $('#set_img_link')[0].value;
    var title = $('#set_img_title')[0].value;
    var width = $('#set_img_width')[0].value;
    var height = $('#set_img_height')[0].value;
    if (link.length==0) return;
    var swh="";
    if (width.length>0) swh+=" width="+width;
    if (height.length>0) swh+=" height="+height;
    var iscircle = $('#set_img_circle')[0].checked;
    var isshow = $('#set_img_show')[0].checked;
    var isshowtitle = $('#set_img_show_title')[0].checked;
    var sclass='class="';
    if (iscircle) sclass+=" circle";
    if (isshow) sclass+=" materialboxed";
    sclass+='"';
    if (isshowtitle) sclass+=' data-caption="'+title+'"';
    var content = '<img src="'+link+'" title="'+title+'" alt="'+alt+'" '+swh+' '+ sclass+'>'+'</img>'
    var cm = mt_editor;
    cm.replaceSelection(content);
}

function createVideo(){
    var link = $('#set_video_link')[0].value;
    // var width = $('#set_video_width')[0].value;
    // var height = $('#set_video_height')[0].value;
    // var swh="";
    // if (width.length>0) swh+=" width="+width;
    // if (height.length>0) swh+=" height="+height;
    if (link.length==0) return;
    var isembed = $('#set_video_emb')[0].checked;
    var content = ''
    if (isembed)
        content = '<div class="video-container"> <iframe frameborder="0" allowfullscreen src="'+link+'"'+'>'+'</iframe></div>'
    else 
        content = '<video class="responsive-video" controls><source src="'+link+'"'+'>'+'</video>'
    var cm = mt_editor;
    cm.replaceSelection(content);
}