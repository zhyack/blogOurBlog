function alterPage(url){
	ob = document.getElementById("display_block");
	ob.src=url
}

// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
$(function () {
    $.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });
});
function refreshNav(){
    $(document).ready(function(){
        $.ajax({
                type: "POST",
                url: "/upnav/",
                success: function (ret) {
                    $('#index_nav').html(ret.nav);
                    return false;
            }
        })
    })
}
function refreshtagedNav(){
    $(document).ready(function(){
        $.ajax({
                type: "POST",
                url: "/uptagednav/",
                success: function (ret) {
                    $('#index_nav').html(ret.nav);
                    return false;
            }
        })
    })
}
function refreshSearchNav(){
    $(document).ready(function(){
        $.ajax({
                type: "POST",
                url: "/upsearchnav/"+$('#search_input').val(),
                success: function (ret) {
                    $('#index_nav').html(ret.nav);
                    return false;
            }
        })
    })
}
function removeit(turl){
    var r=confirm("确定删除吗?");
    if (r==true){
        $(document).ready(function(){
            $.ajax({
                    type: "POST",
                    url: turl,
                    success: function (ret) {
                        if (ret.success){
                            alert(ret.message+" 删除成功！")
                        }
                        else{
                            alert("删除失败！ "+ ret.message)
                        }
                        return false;
                }
            })
        })
    }
}

