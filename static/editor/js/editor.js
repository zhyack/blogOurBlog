var testEditor;

var global_title = 'noname';

function createAndDownloadFile(fileName, content) {
    var aTag = document.createElement('a');
    var blob = new Blob([content]);
    aTag.download = fileName;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
}

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getTitle(){
    var s = decodeURI(document.URL);
    s = s.substr(s.indexOf("edit/")+5);
    s = s.replace('/','-');
    s = s.replace('/','-');
    return s;
}

global_title = getTitle();

function act_download_html(md_content){
    var title = global_title;
    var content = httpGet('/static/posts/posts_download.html');
    content = content.replace('{{post_title}}', title)
    content = content.replace('{{post_content}}', md_content)
    createAndDownloadFile(title+'.html', content);
}

function act_download_html_offline(html_content){
    var title = global_title;
    var content = httpGet('/static/posts/posts_download_offline.html');
    content = content.replace('{{post_title}}', title)
    content = content.replace('{{post_content}}', html_content)
    createAndDownloadFile(title+'.html', content);
}

function act_download_md(md_content){
    var title = global_title;
    var content = md_content;
    createAndDownloadFile(title+'.md', content);
}

var as_state=0
function act_save(){
    $(document).ready(function(){
        $('#id_pcontent').val(testEditor.getMarkdown());
        var formData = new FormData($('#up_form')[0]);
        $.ajax({
                type: "POST",
                url: "/validpost/",
                data: formData,
                contentType: false,
                processData: false,
                success: function (ret) {
                    if (ret.success){
                        var myDate = new Date();
                        $('#editor_warning').html(myDate.toLocaleString()+" : 保存完成");
                        as_state= 1
                        act_savecache()
                    }
                    else{
                        var myDate = new Date();
                        $('#editor_warning').html(myDate.toLocaleString()+" : 保存失败，建议本地备份");
                    }
                    return false;
            }
        })
    });
}


function act_savecache(){
    $(document).ready(function(){
        $('#id_pcontent').val(testEditor.getMarkdown());
        var formData = new FormData($('#up_form')[0]);
        $.ajax({
                type: "POST",
                url: "/savecache/",
                data: formData,
                contentType: false,
                processData: false,
                success: function (ret) {
                    if (ret.success){
                        // var myDate = new Date();
                        // $('#editor_warning').html(myDate.toLocaleString()+" : 缓存完成");
                    }
                    else{
                        var myDate = new Date();
                        $('#editor_warning').html(myDate.toLocaleString()+" : 缓存失败，联系管理员！");
                    }
                    return false;
            }
        })
    });
}
function auto_save(){
    if (as_state==1){
        act_savecache();
    }
}
window.setInterval(auto_save, 20000);
testEditor = editormd("editormd", {
    width   : "95%",
    height  : 880,
    syncScrolling : false,
    htmlDecode: true,
    path    : "/static/editor/lib/",
    emoji   : true,
    tex     : true,
    flowChart : true,
    sequenceDiagram : true,
    saveHTMLToTextarea : true,
    searchReplace : true,
    codeFold : true,
    pageBreak : true,
    tocm    : true,
    tocContainer : "",
    tocDropdown   : false,
    atLink    : false,
    emailLink : false, 
    toolbarIcons : function() {
        return ["undo", "redo", "|", "bold", "del", "italic", "quote", "hr", "pagebreak", "|", "uppercase", "lowercase", "|", "upload_file", "formula", "fix_formula", "link", "image", "preformatted-text", "code-block", "table", "|", "datetime", "html-entities", "emoji", "|", "preview", "fullscreen", "|", "save", "|", "down_html_off", "down_html", "down_md" ,"|", "all_state"]
    },
    toolbarIconsClass : {
        save : "fa-save",
        upload_file: "fa-upload",
        down_html_off: "fa-unlink",
        down_html: "fa-header",
        down_md: "fa-medium",
        formula: "fa-superscript",
        fix_formula: "fa-check-square-o"
    },
    toolbarCustomIcons : {
        all_state : "<div id = \"editor_warning\" style=\" display:inline-block\" >服务器无响应...</div>"
    },
    toolbarHandlers : {
        save: function(cm, icon, cursor, selection){
            act_save();
            as_state=1;
        },
        upload_file: function(cm, icon, cursor, selection){
            window.open("/upfile/");
        },
        down_html_off: function(cm, icon, cursor, selection){
            act_download_html_offline(testEditor.getHTML());
        },
        down_html: function(cm, icon, cursor, selection){
            act_download_html(testEditor.getMarkdown());
        },
        down_md: function(cm, icon, cursor, selection){
            act_download_md(testEditor.getMarkdown());
        },
        formula: function(cm, icon, cursor, selection){
            cm.replaceSelection("<span class=\"editormd-tex\">" + selection + "</span>");

            if(selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 27);
            }
        },
        fix_formula: function(cm, icon, cursor, selection){
            var selection = cm.getSelection().split("").reverse().join("");
            cm.replaceSelection(selection.replace(/_(?!\\)/g,"_\\").replace(/\*(?!\\)/g,"*\\").split("").reverse().join(""));
        }

    },
    lang : {
        toolbar : {
            save : "保存文件 (Alt+S)",
            upload_file : "上传文件，最大20MB (Alt+U)",
            bold : "粗体 (Ctrl+B)",
            del : "删除线 (Ctrl+Shift+S)",
            italic : "斜体 (Ctrl+I)",
            quote : "引用",
            hr : "横线 (Ctrl+H)",
            pagebreak : "分页符 (Alt+Shift+P)",
            uppercase : "大写转换 (Ctrl+Shift+U)",
            lowercase : "小写转换 (Alt+Shift+L)",
            formula : "添加公式 (Alt+X)",
            fix_formula : "处理公式 (Ctrl+Alt+X)",
            link : "添加链接 (Ctrl+Shift+L)",
            image : "添加图片 (Ctrl+Alt+Shift+I)",
            "preformatted-text" : "添加预格式文本 (Ctrl+Shift+P)",
            "code-block" : "添加代码块 (Ctrl+Shift+Alt+C)",
            table : "添加表格",
            datetime : "日期时间 (Ctrl+D)",
            "html-entities" : "HTML实体字符 (Shift+Ctrl+H)",
            emoji : "emoji表情 (Ctrl+Shift+E)",
            preview : "预览 (F10)",
            fullscreen : "全屏 (F11)",
            down_html_off : "下载离线HTML (Alt+N)",
            down_html : "下载HTML (Alt+H)",
            down_md : "下载Markdown (Alt+M)"
        }
    },
    disabledKeyMaps : [
        "F5", "Alt-S", "Alt-U", "Alt-1", "Alt-2", "Alt-3", "Alt-4", "Alt-5", "Alt-6", "Alt-7", "Alt-8", "Alt-9", "Alt-0", "Alt-M", "Alt-S", "Alt-N", "Alt-X", "Ctrl-Alt-X"  // disable some default keyboard shortcuts handle
    ],
    onload : function() {
        var keyMap = {
            "Ctrl-Alt-X": function(cm) {
                var selection = cm.getSelection().split("").reverse().join("");
                cm.replaceSelection(selection.replace(/_(?!\\)/g,"_\\").replace(/\*(?!\\)/g,"*\\").split("").reverse().join(""));
            },
            "Alt-X": function(cm) {
                var cursor    = cm.getCursor();
                var selection = cm.getSelection();
                cm.replaceSelection("<span class=\"editormd-tex\">" + selection + "</span>");

                if(selection === "") {
                    cm.setCursor(cursor.line, cursor.ch + 27);
                }
            },
            "Alt-S": function(cm) {
                act_save();
                as_state=1;
                last_rem_title=document.getElementById('fn').value;
            },
            "Alt-U": function(cm){
                window.open("upload.html");
            },
            "Alt-N": function(cm){
                act_download_html_offline(testEditor.getHTML());
            },
            "Alt-M": function(cm){
                act_download_md(testEditor.getMarkdown());
            },
            "Alt-H": function(cm){
                act_download_html(testEditor.getMarkdown());
            },
            "Alt-0": function(cm) {
                testEditor.setTheme("default");
                testEditor.setEditorTheme("default");
                testEditor.setPreviewTheme("default");
            },
            "Alt-1": function(cm) {
                testEditor.setTheme("dark");
            },
            "Alt-2": function(cm) {
                testEditor.setPreviewTheme("dark");
            },
            "Alt-3": function(cm) {
                testEditor.setEditorTheme("eclipse");
            },
            "Alt-4": function(cm) {
                testEditor.setEditorTheme("mdn-like");
            },
            "Alt-5": function(cm) {
                testEditor.setEditorTheme("neat");
            },
            "Alt-6": function(cm) {
                testEditor.setEditorTheme("xq-light");
            },
            "Alt-7": function(cm) {
                testEditor.setEditorTheme("seti");
            },
            "Alt-8": function(cm) {
                testEditor.setEditorTheme("night");
            },
            "Alt-9": function(cm) {
                testEditor.setEditorTheme("blackboard");
            }
        };

        this.addKeyMap(keyMap);
    }


});

window.onload=function(){
    var r = confirm('是否加载上次自动保存的文档？')
    if (r==true){
        testEditor.setMarkdown(document.getElementById('id_pcache').innerHTML);
    }
    else{
        testEditor.setMarkdown(document.getElementById('id_pcontent').innerHTML);
    }
    var myDate = new Date();
    document.getElementById('editor_warning').innerHTML=myDate.toLocaleString()+" : 文档加载完成";
}
