var mt_editor = CodeMirror.fromTextArea( $("#codemirror_editor")[0] ,{
    lineNumbers: true,
    mode: "text/markdown",
    matchBrackets: true,
    lineWrapping: true,
    foldGutter: true,
    gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
});
// keymaps...
CodeMirror.keyMap["default"]["Ctrl-G"] = "jumpToLine";
mt_editor.setOption("extraKeys", {
    Tab: function(cm) {// 缩进
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
    },
    '`': function(cm){// 行内代码
        if (cm.doc.somethingSelected()){
            var content = cm.getSelection();
            cm.replaceSelection('`'+content+'`');
            var cursor = cm.doc.getCursor();
            cm.setCursor(cursor.line, cursor.ch - 1);
        }
        else cm.replaceSelection('`');
    },
    'Shift-9': function(cm){// 括号匹配
        if (cm.doc.somethingSelected()){
            var content = cm.getSelection();
            cm.replaceSelection('('+content+')');
            var cursor = cm.doc.getCursor();
            cm.setCursor(cursor.line, cursor.ch - 1);
        }
        else cm.replaceSelection('(');
    },
    '[': function(cm){// 括号匹配
        if (cm.doc.somethingSelected()){
            var content = cm.getSelection();
            cm.replaceSelection('['+content+']');
            var cursor = cm.doc.getCursor();
            cm.setCursor(cursor.line, cursor.ch - 1);
        }
        else cm.replaceSelection('[');
    },
    'Shift-[': function(cm){// 括号匹配
        if (cm.doc.somethingSelected()){
            var content = cm.getSelection();
            cm.replaceSelection('{'+content+'}');
            var cursor = cm.doc.getCursor();
            cm.setCursor(cursor.line, cursor.ch - 1);
        }
        else cm.replaceSelection('{');
    },
    'Shift-,': function(cm){// 括号匹配
        if (cm.doc.somethingSelected()){
            var content = cm.getSelection();
            cm.replaceSelection('<'+content+'>');
            var cursor = cm.doc.getCursor();
            cm.setCursor(cursor.line, cursor.ch - 1);
        }
        else cm.replaceSelection('<');
    },
    'Shift-\'': function(cm){// 引号匹配
        if (cm.doc.somethingSelected()){
            var content = cm.getSelection();
            cm.replaceSelection('"'+content+'"');
            var cursor = cm.doc.getCursor();
            cm.setCursor(cursor.line, cursor.ch - 1);
        }
        else cm.replaceSelection('"');
    },
    '\'': function(cm){// 引号匹配
        if (cm.doc.somethingSelected()){
            var content = cm.getSelection();
            cm.replaceSelection('\''+content+'\'');
            var cursor = cm.doc.getCursor();
            cm.setCursor(cursor.line, cursor.ch - 1);
        }
        else cm.replaceSelection('\'');
    },
    'Shift-Ctrl-`': function(cm){// 删除线
        var content = cm.getSelection();
        cm.replaceSelection('~~'+content+'~~');
        var cursor = cm.doc.getCursor();
        cm.setCursor(cursor.line, cursor.ch - 2);
    },
    'Ctrl-B': function(cm){// 加粗
        var content = cm.getSelection();
        cm.replaceSelection('**'+content+'**');
        var cursor = cm.doc.getCursor();
        cm.setCursor(cursor.line, cursor.ch - 2);
    },
    'Ctrl-`': function(cm){// 代码
        var cursor    = cm.doc.getCursor();
        var selection = cm.getSelection();
        cm.replaceSelection(["```", selection, "```"].join("\n"));
        if (selection === "") {
            cm.setCursor(cursor.line, cursor.ch + 3);
        }
    },
    'Alt-C': function(cm){// colorize
        var content = cm.getSelection();
        cm.replaceSelection('#['+content+']('+last_color_format+')');
        var cursor = cm.doc.getCursor();
        cm.setCursor(cursor.line, cursor.ch-3-last_color_format.length)
    },
    'Ctrl-D': function(cm){// 复制行
        var cursor=cm.doc.getCursor();
        var content = cm.doc.getLine(cursor.line);
        var init_ch = cursor.ch;
        cursor.ch=0;
        cm.doc.replaceRange(content+'\n', cursor);
        cursor.ch=init_ch;
        cm.doc.setCursor(cursor);
    },
    'Ctrl-E': function(cm){// 表情
        $('#icon_table').modal('open');
    },
    'Shift-Ctrl-E': function(cm){// emojify
        var content = cm.getSelection();
        cm.replaceSelection(':'+content+':');
        var cursor = cm.doc.getCursor();
        cm.setCursor(cursor.line, cursor.ch)
    },
    'Ctrl-H': function(cm){// 
        
    },
    'Ctrl-I': function(cm){// 斜体
        var content = cm.getSelection();
        cm.replaceSelection('*'+content+'*');
        var cursor = cm.doc.getCursor();
        cm.setCursor(cursor.line, cursor.ch - 1);
    },
    'Ctrl-J': function(cm){// 行内公式
        var content = cm.getSelection();
        cm.replaceSelection('$'+content+'$');
        var cursor = cm.doc.getCursor();
        cm.setCursor(cursor.line, cursor.ch - 1)
    },
    'Shift-Ctrl-J': function(cm){// 独占公式
        var content = cm.getSelection();
        cm.replaceSelection('$$'+content+'$$');
        var cursor = cm.doc.getCursor();
        cm.setCursor(cursor.line, cursor.ch - 2)
    },
    'Ctrl-K': function(cm){// 删除行
        CodeMirror.commands.deleteLine(cm);
    },
    'Ctrl-L': function(cm){// 转小写
        var content = cm.getSelection();
        cm.replaceSelection(content.toLowerCase());
    },
    'Shift-Ctrl-L': function(cm){// 转大写
        var content = cm.getSelection();
        cm.replaceSelection(content.toUpperCase());
    },
    'Ctrl-M': function(cm){// 设置
    },
    'Ctrl-N': function(cm){// 系统占用
    },
    'Ctrl-O': function(cm){// 上传
    },
    'Ctrl-P': function(cm){// 分页符
        var cursor=cm.doc.getCursor();
        var init_ch = cursor.ch;
        cursor.ch=0;
        cm.doc.replaceRange('\n----------\n\n', cursor);
        cursor.line+=3;
        cursor.ch=init_ch;
        cm.doc.setCursor(cursor);
    },
    'Alt-P': function(cm){ //切换预览模式
        change_preview_icon();
    },
    'Ctrl-Q': function(cm){// 各种链接
        $('#link_setting').modal('open');
    },
    'Alt-Q': function(cm){ //切换布局
        if (layout_icon_state==1) layout_icon_state++;
        change_layout_icon();
    },
    'Ctrl-R': function(cm){// 刷新预览区
        $("#mt_viewer_live")[0].innerHTML=advMarked(cm.getValue());
        MathJax.Hub.Queue(["Typeset",MathJax.Hub, $("#mt_viewer_live")[0]], function(){
            $("#mt_viewer_live")[0].scrollTop=last_scroll_h;
        });
        emojify.run();
        M.AutoInit($('#mt_viewer_live')[0]);
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
        view_changes_cnt=0;
        observer.observe();
    },
    'Ctrl-S': function(cm){// 保存
        M.toast({html: '保存中...', displayLength: 800, classes: 'record'});
        var ret = exec_save(save_origin=true);
        if (ret['success']){
            save_changes_cnt=0;
            M.toast({html: '保存成功！', displayLength: 1000, classes: 'success'});
        }
        else{
            M.toast({html: ret['error_info'], displayLength: 2000, classes: 'record'});
        }
    },
    'Alt-S': function(cm){ //切换保存模式
        change_saving_icon();
    },
    'Ctrl-T': function(cm){// 系统占用
    },
    'Alt-T': function(cm){ //触发边角工具栏
        toggleFAB();
    },
    'Ctrl-U': function(cm){// 下划线
        var content = cm.getSelection();
        cm.replaceSelection('<u>'+content+'</u>');
        var cursor = cm.doc.getCursor();
        cm.setCursor(cursor.line, cursor.ch - 4);
    },
    'Ctrl-W': function(cm){// 系统占用
    },
    'Alt-,': function(cm){//刷新减速
        frequent_icon_state = (frequent_icon_state+4)%6;
        change_frequent_icon();
    },
    'Alt-.': function(cm){//刷新加速
        change_frequent_icon();
    },
    'Ctrl-;': function(cm){// 
    },
    'Ctrl-,': function(cm){// 
        $('#config_form').modal('open');
    },
    'Ctrl-.': function(cm){// 
        $('#upload_form').modal('open');
    },
    'Ctrl-\\': function(cm){// 创建表格
        var rows = $('#set_table_row')[0].value;
        var cols = $('#set_table_col')[0].value;
        var iscenter = ($('#set_table_center')[0].checked);
        rows = parseInt(rows)
        cols = parseInt(cols)
        if (isNaN(rows) || isNaN(cols) || rows<=0 || cols<=0){
            M.toast({html: '表格行列数必须为正整数!', displayLength: 3000, classes: 'alert'});
            return;
        }
        content = '\n|'
        for (var i = 0;i < cols; i++)
            content += ' 标题'+(i+1).toString()+' |';
        content += '\n|'
        for (var i = 0;i < cols; i++)
            if (iscenter) content += ' :--: |';
            else content += ' :-- |'
        for (var r =0; r < rows; r++){
            content+='\n|';
            for (var i = 0;i < cols; i++)
                content += '      |';
        }
        content+='\n\n';
        cm.replaceSelection(content);
    },
    'Ctrl-/': function(cm){
        if (cm.doc.somethingSelected()){
            var cursor_last = cm.doc.getCursor('to');
            cursor_last.ch+=1000000;
            cm.doc.setSelection(cm.doc.getCursor('from'), cursor_last);
            var content=cm.doc.getSelection().trim();
            if (content.startsWith('<!--') && content.endsWith('-->')){
                var cursor_st = cm.doc.getCursor('from'), cursor_en=cm.doc.getCursor('to');
                cm.replaceSelection(content.substr(4,content.length-7).trim());
                cursor_en.ch-=3;
                cm.doc.setSelection(cursor_st, cursor_en)
            }
            else{
                cm.toggleComment();
                var cursor_st = cm.doc.getCursor('from'), cursor_en=cm.doc.getCursor('to');
                cursor_st.ch-=5;
                cm.doc.setSelection(cursor_st, cursor_en)
            }
        }
        else{
            var cursor = cm.doc.getCursor();
            var content=cm.doc.getLine(cursor.line).trim();
            if (content.startsWith('<!--') && content.endsWith('-->')){
                cm.setCursor(cursor.line, 0);
                CodeMirror.commands.deleteLine(cm);
                cm.replaceRange(content.substr(4,content.length-7).trim()+'\n',cursor);
                cm.setCursor(cursor);
            }
            else cm.toggleComment();
        }
    },
    'Shift-Ctrl-/': function(cm){// Line Comment
        var cursor_st = cm.doc.getCursor('from'), cursor_en=cm.doc.getCursor('to');
        var have_comment = true;
        for(var i=cursor_st.line; i<=cursor_en.line; i++){
            var content = cm.doc.getLine(i).trim();
            if (!(content.startsWith('[//]: # (') &&  content.endsWith(')'))){
                have_comment=false;
                break;
            }
        }
        new_lines=''
        for(var i=cursor_st.line; i<=cursor_en.line; i++){
            var content = cm.doc.getLine(cursor_st.line).trim();
            cm.setCursor(cursor_st.line, 0);
            CodeMirror.commands.deleteLine(cm);
            if (have_comment){
                content = content.substr('[//]: # ('.length, content.length-'[//]: # ('.length-1);
            }
            else{
                content = '[//]: # ('+content+')';
            }
            new_lines+=content+'\n';
        }
        cursor_st.ch=0;
        cm.doc.replaceRange(new_lines, cursor_st);
        cm.doc.setCursor(cursor_st);
    },
    'Ctrl-\'': function(cm){// 
    },
    'Ctrl-[': function(cm){// 
    },
    'Ctrl-]': function(cm){// 
    },
    'Ctrl-1': function(cm){// 
        var cursor=cm.doc.getCursor();
        var init_ch = cursor.ch;
        cm.doc.replaceRange('<card>\ntitle:在这里填写标题\ncontent:在这里填写内容，可以写多行\naction:[在这里填写按钮，后面写连接，可以多个](#)\nwidth:100% 0% 100%\ncenter:true\ncolor:white\n</card>\n', cursor);
        cursor.line+=1;
        cursor.ch=0;
        cm.doc.setCursor(cursor);
    },
    'Ctrl-2': function(cm){// 
        var cursor=cm.doc.getCursor();
        var init_ch = cursor.ch;
        cm.doc.replaceRange('<card>\ntype:image\ntitle:在这里填写标题\ncontent:![在这里添加图片，后面填图片链接](https://cdn.pixabay.com/photo/2019/11/13/12/35/anise-4623554_960_720.png)\naction:[在这里填写按钮，后面写连接，可以多个](#)\nwidth:50% 0% 100%\ncenter:true\ncolor:white\n</card>\n', cursor);
        cursor.line+=1;
        cursor.ch=0;
        cm.doc.setCursor(cursor);
    },
    'Ctrl-3': function(cm){// 
        var cursor=cm.doc.getCursor();
        var init_ch = cursor.ch;
        cm.doc.replaceRange('<card>\ntype:tab\ntitle:在这里填写标题\ncontent:在这里填写主内容，可以写多行\ncontent:在这里填写第一部分内容，可以写多行\ncontent:在这里填写第二部分内容，可以写多行\ncontent:在这里填写第三部分内容，可以写多行\ntab:标签1\ntab:标签2\ntab:标签3\naction:[在这里填写按钮，后面写连接，可以多个](#)\nwidth:80% 0% 100%\ncenter:true\ncolor:white\n</card>\n', cursor);
        cursor.line+=1;
        cursor.ch=0;
        cm.doc.setCursor(cursor);
    },
    'Ctrl-4': function(cm){// 
        var cursor=cm.doc.getCursor();
        var init_ch = cursor.ch;
        cm.doc.replaceRange('<card>\ntype:fold\ntitle:在这里填写标题\ncontent:在这里填写第一部分内容，可以写多行\ncontent:在这里填写第二部分内容，可以写多行\ncontent:在这里填写第三部分内容，可以写多行\ntab:标签1\ntab:标签2\ntab:标签3\naction:[在这里填写按钮，后面写连接，可以多个](#)\nwidth:80% 0% 100%\ncenter:true\ncolor:white\n</card>\n', cursor);
        cursor.line+=1;
        cursor.ch=0;
        cm.doc.setCursor(cursor);
    },
    'Ctrl-5': function(cm){// 
        var cursor=cm.doc.getCursor();
        var init_ch = cursor.ch;
        cm.doc.replaceRange('<card>\ntype:float\ntitle:在这里填写标题\ncontent:在这里填写内容，可以写多行\naction:[在这里填写按钮，后面写连接，可以多个](#)\nid:a_unique_id\nexample:true\n</card>\n', cursor);
        cursor.line+=1;
        cursor.ch=0;
        cm.doc.setCursor(cursor);
    },
    'Ctrl-6': function(cm){// 
        var cursor=cm.doc.getCursor();
        var init_ch = cursor.ch;
        cm.doc.replaceRange('<card>\ntype:album\ncontent:![在这里添加图片1，后面填图片链接](https://cdn.pixabay.com/photo/2019/11/13/12/35/anise-4623554_960_720.png)\ncontent:也可以在这里填写内容1，可以写多行\nwidth:80% 0% 100%\ncontent:![在这里添加图片2，后面填图片链接](https://cdn.pixabay.com/photo/2019/11/13/12/35/anise-4623554_960_720.png)\ncontent:也可以在这里填写内容2，可以写多行\nwidth:80% 0% 100%\ncenter:true\n</card>\n', cursor);
        cursor.line+=1;
        cursor.ch=0;
        cm.doc.setCursor(cursor);
    },
    'Ctrl-7': function(cm){// 
        $('#emoji_table').modal('open');
    },
    'Ctrl-8': function(cm){// 
        $('#fa_table').modal('open');
    },
    'Ctrl-9': function(cm){// 
        $('#material_table').modal('open');
    },
    'Ctrl-0': function(cm){// 
        $('#icon_table').modal('open');
    },
    'Alt-Enter': function(cm){
        change_fullscreen_icon();
    },
});
// Events...

mt_editor.on("change", function(){
    view_changes_cnt++;
    save_changes_cnt++;
    cache_changes_cnt++;
    if (allow_refresh_0 && allow_refresh_1 && view_changes_cnt>=changes_refresh_f){
        mt_editor.options.extraKeys["Ctrl-R"](mt_editor);
        view_changes_cnt=0;
    }
    if (save_changes_cnt<=300 && save_changes_cnt%100==0){
        M.toast({html: save_changes_cnt.toString()+'次修改未保存！', displayLength: 2000, classes: 'warning'});
    }
    else if (save_changes_cnt<=500 &&save_changes_cnt%100==0){
        M.toast({html: save_changes_cnt.toString()+'次修改未保存！', displayLength: 3000, classes: 'warning pulse'});
    }
    else if (save_changes_cnt<=800 &&save_changes_cnt%100==0){
        M.toast({html: save_changes_cnt.toString()+'次修改未保存！', displayLength: 4000, classes: 'alert'});
    }
    else if (save_changes_cnt%100==0){
        M.toast({html: save_changes_cnt.toString()+'次修改未保存！', displayLength: 5000, classes: 'alert pulse'});
    }
}) 

$("#mt_viewer_live")[0].onmouseleave=function(){
    last_scroll_h=this.scrollTop;
};




$(window).bind('beforeunload',function(){
    if (save_changes_cnt>0){
        M.toast({html: save_changes_cnt.toString()+'次修改未保存！', displayLength: 5000, classes: 'alert pulse'});
        return '您还有改动未保存，确定离开此页面吗？';
    }
});

function connection_test(){
    var is_connect = try_handshake();
    if (connection_state==0 && is_connect){
        $('#corner_icon')[0].className='btn-floating btn-large accent-4';
        $('#corner_icon')[0].innerHTML='<i class="large material-icons">bubble_chart</i>';
        M.toast({html: '与服务器的连接已恢复', displayLength: 3000, classes: 'record'});
        connection_state=1;
    }
    else if (connection_state==1 && !is_connect){
        $('#corner_icon')[0].className='btn-floating btn-large red pulse';
        $('#corner_icon')[0].innerHTML='<i class="large material-icons">phonelink_off</i>';
        M.toast({html: '失去与服务器的连接，请做好文档备份', displayLength: 5000, classes: 'alert pulse'});
        connection_state=0
    }
}
function try_handshake(){
    return true;
}

function auto_save(){
    if (saving_icon_state==0 || save_changes_cnt==0 || (saving_icon_state==2 && cache_changes_cnt==0)) return;
    if (connection_state==1){
        if (saving_icon_state==1){
            M.toast({html: '保存中...', displayLength: 800, classes: 'record'});
            var ret = exec_save(save_origin=true);
            if (ret['success']){
                M.toast({html: '保存成功！', displayLength: 1000, classes: 'success'});
                save_changes_cnt=0;
            }
            else{
                M.toast({html: ret['error_info'], displayLength: 2000, classes: 'record'});
            }
        }
        else{
            M.toast({html: '备份中...', displayLength: 800, classes: 'record'});
            var ret = exec_save(save_origin=false);
            if (ret['success']){
                M.toast({html: '备份成功！', displayLength: 1000, classes: 'success'});
                cache_changes_cnt=0;
            }
            else{
                M.toast({html: ret['error_info'], displayLength: 2000, classes: 'record'});
            }
        }
    }
}

function exec_save(save_origin){
    return {'success':true, 'error_info':'nothing'};
}

function pauseRefresh(){
    allow_refresh_1=false;
}
function continueRefresh(){
    allow_refresh_1=true;
    if (allow_refresh_0) mt_editor.options.extraKeys["Ctrl-R"](mt_editor);
}
function banRefresh(){
    allow_refresh_0=false;
}
function permitRefresh(){
    allow_refresh_0=true;
}

function createAndDownloadFile(fileName, content) {
    var aTag = document.createElement('a');
    var blob = new Blob([content]);
    aTag.download = fileName;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
}


function act_download_html_offline(){
    var title = 'MoreThanMD下载';
    var html_content = $('#mt_viewer_live')[0].innerHTML;
    $.ajax({
        url: "/static/morethanmd/offline_template.html",
        type: "GET",
        success: function(content){
            content = content.replace('{{post_title}}', title)
            content = content.replace('{{post_content}}', html_content)
            createAndDownloadFile(title+'.html', content);
        }
    })
}

function act_download_md(){
    var title = 'MoreThanMD下载';
    var md_content = mt_editor.doc.getValue();
    var content = md_content;
    createAndDownloadFile(title+'.md', content);
}

function printPDF(filename, content, quality = 4) {

    var cvs = html2canvas(content, {
        scale: quality,
        onrendered: function(cvs){
            var pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(cvs.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
            pdf.save(filename);
        }
    });
    
}
function act_download_pdf(){
    var title = 'MoreThanMD下载';
    var html_content = $('#mt_viewer_live')[0];
    printPDF(title+'.pdf', html_content);
    // $.ajax({
    //     url: "http://zhyack.cn:9000/static/morethanmd/offline_template.html",
    //     type: "GET",
    //     success: function(content){
    //         content = content.replace('{{post_title}}', title)
    //         content = content.replace('{{post_content}}', html_content)
    //         printPDF(title+'.pdf', content);
    //     }
    // })
}


$(document).ready(function(){
    mt_editor.options.extraKeys["Ctrl-R"](mt_editor);
    refresh_handler = $.timer(function(){if (allow_refresh_0 && allow_refresh_1 && view_changes_cnt>0) mt_editor.options.extraKeys["Ctrl-R"](mt_editor)});
    M.AutoInit();
    M.FloatingActionButton.init($('.fixed-action-btn'), {
        hoverEnabled: false,
    });
    M.Modal.init($('.modal'), {
        onOpenStart: pauseRefresh,
        onCloseStart: continueRefresh,
    });
    refresh_handler.set({time:changes_refresh_t*1000, autostart:true});
    connection_handler = $.timer(function(){connection_test();});
    connection_handler.set({time:59999, autostart:true})
    autosave_handler = $.timer(function(){auto_save();});
    autosave_handler.set({time:29999, autostart:true})
    M.toast({html: '组件加载完毕', displayLength: 1000, classes: 'record'});

    $('.chips-autocomplete').chips({
        autocompleteOptions: {
          data: {
            '用户：Apple': "https://cdn.pixabay.com/photo/2019/11/13/12/35/anise-4623554_960_720.png",
            'Microsoft': "https://cdn.pixabay.com/photo/2019/11/13/12/35/anise-4623554_960_720.png",
            '组：Google': "https://cdn.pixabay.com/photo/2019/11/13/12/35/anise-4623554_960_720.png"
          },
          limit: Infinity,
          minLength: 1
        }
    });
});