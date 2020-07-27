


var makeCard=function(texts){
    texts=texts.replace(/\<br\>/g, '\n');
    var text_list = texts.split("\n");
    var last_attr="", last_val="";
    var cardElement = document.createElement('div');
    cardElement.setAttribute('class', 'card');
    cardElement.style["min-width"]="50%";
    cardElement.style["max-width"]="80%";
    cardElement.style["margin"]="0 auto";

    var d = {};
    d['content']=[];
    d['tab'] = [];
    d['action'] = [];

    valid_attrs={'type':true, 'width':true, 'color':true, 'center':true, 'content':true, 'tab':true, 'action':true, 'title':true, 'example':true, 'id':true};
    list_attrs = {'content':true, 'tab':true, 'action':true};
    for (var i=0; i < text_list.length;i++){
        t= text_list[i].trim();
        if (t.search(':')!=-1){
            attr = t.substr(0, t.search(':'));
            if (attr in valid_attrs){
                if (last_attr.length>0){
                    if (last_attr in list_attrs) d[last_attr].push(last_val);
                    else d[last_attr]=last_val;
                }
                last_attr=attr;
                last_val=t.substr(t.search(':')+1);
            }
            else last_val+='\n'+t;
        }
        else last_val+='\n'+t;
    }
    if (last_attr in valid_attrs) {
        if (last_attr in list_attrs) d[last_attr].push(last_val);
        else d[last_attr]=last_val;
    }
    var card_type='card';
    if ('type' in d) card_type=d['type'].trim();
    if ('color' in d) cardElement.setAttribute('class', 'card'+' '+d['color']);
    else cardElement.setAttribute('class', 'card');
    var style_width='min-width:50%;max-width:80%;';
    if ('width' in d){
        style_width='';
        width_list = d['width'].trim().split(' ');
        if (width_list.length>0) style_width+='width:'+width_list[0]+";";
        if (width_list.length>1) style_width+='min-width:'+width_list[1]+";";
        if (width_list.length>2) style_width+='max-width:'+width_list[2]+";";
    }
    var style_margin='margin:0 auto;';
    if ('center' in d && d['center'].trim()=='false') style_margin="0 0";
    cardElement.setAttribute('style', style_width+style_margin);

    if (card_type=='card'){
        if ('title' in d || d['content'].length != 0){
            var cardHeadElement = document.createElement('div');
            cardHeadElement.setAttribute('class', 'card-content');
            if ('title' in d){
                var cardHeadTitleElement=document.createElement('span');
                cardHeadTitleElement.setAttribute('class', 'card-title');
                cardHeadTitleElement.innerHTML=marked(d['title']);
                cardHeadElement.appendChild(cardHeadTitleElement);
            }
            if (d['content'].length != 0)
                cardHeadElement.innerHTML+=marked(d['content'][0]);
            cardElement.appendChild(cardHeadElement);
        }

        if (d['action'].length != 0){
            var cardActionElement = document.createElement('div');
            cardActionElement.setAttribute('class', 'card-action');
            for(var k=0; k<d['action'].length;k++){
                var c = d['action'][k];
                cardActionElement.innerHTML+=marked(c);
            }
            cardElement.appendChild(cardActionElement);
        }
    }
    else if (card_type=='image'){
        if ('title' in d || d['content'].length != 0){
            var cardHeadElement = document.createElement('div');
            cardHeadElement.setAttribute('class', 'card-image');
            if (d['content'].length != 0)
                cardHeadElement.innerHTML+=marked(d['content'][0]);
            if ('title' in d){
                var cardHeadTitleElement=document.createElement('span');
                cardHeadTitleElement.setAttribute('class', 'card-title');
                cardHeadTitleElement.innerHTML=marked(d['title']);
                cardHeadElement.appendChild(cardHeadTitleElement);
            }
            cardElement.appendChild(cardHeadElement);
        }
        if (d['content'].length > 1 ){
            var cardHeadElement2 = document.createElement('div');
            cardHeadElement2.setAttribute('class', 'card-content');
            cardHeadElement2.innerHTML+=marked(d['content'][1]);
            cardElement.appendChild(cardHeadElement2);
        }
        if (d['action'].length != 0){
            var cardActionElement = document.createElement('div');
            cardActionElement.setAttribute('class', 'card-action');
            for(var k=0; k<d['action'].length;k++){
                var c = d['action'][k];
                cardActionElement.innerHTML+=marked(c);
            }
            cardElement.appendChild(cardActionElement);
        }
    }
    else if (card_type=='tab'){
        if (d['content'].length > 0 ){
            var cardHeadElement = document.createElement('div');
            cardHeadElement.setAttribute('class', 'card-content');
            cardHeadElement.innerHTML+=marked(d['content'][0]);
            cardElement.appendChild(cardHeadElement);
        }
        while(d['content'].length < d['tab'].length+1){
            d['content'].push('Empty');
        }
        while(d['tab'].length<d['content'].length-1){
            d['tab'].push('Empty');
        }
        if (d['tab'].length>0){
            var cardTabElement = document.createElement('div');
            cardTabElement.setAttribute('class', 'card-tabs');
            var cardTabListElement = document.createElement('ul');
            cardTabListElement.setAttribute('class', 'tabs tabs-fixed-width');
            var random_id = Math.floor(Math.random() * 100000);
            for(var k=0; k<d['tab'].length;k++){
                var c = d['tab'][k];
                cardTabListElement.innerHTML+='<li class="tab"><a href="#'+random_id.toString()+(k+1).toString()+'">'+c+"</a></li>";
            }
            cardTabElement.appendChild(cardTabListElement);
            cardElement.appendChild(cardTabElement);

            var cardContentElement = document.createElement('div');
            cardContentElement.setAttribute('class', 'card-content');
            for(var k=1; k<d['content'].length;k++){
                var c = d['content'][k];
                cardContentElement.innerHTML+='<div id="'+random_id.toString()+k.toString()+'">'+c+"</div>";
            }
            cardElement.appendChild(cardContentElement);
        }
    }
    else if (card_type=='fold'){
        var cardElement=document.createElement('ul');
        cardElement.setAttribute('class', 'collapsible')
        cardElement.setAttribute('style', style_width+style_margin);
        while(d['content'].length < d['tab'].length){
            d['content'].push('Empty');
        }
        while(d['tab'].length<d['content'].length){
            d['tab'].push('Empty');
        }
        for (var k=0;k<d['tab'].length;k++){
            var cardListElement = document.createElement('li');
            var cardListTabElement = document.createElement('div');
            cardListTabElement.setAttribute('class', 'collapsible-header');
            cardListTabElement.innerHTML=marked(d['tab'][k]);
            var cardListContentElement = document.createElement('div');
            cardListContentElement.setAttribute('class', 'collapsible-body');
            cardListContentElement.innerHTML=marked(d['content'][k]);
            cardListElement.appendChild(cardListTabElement);
            cardListElement.appendChild(cardListContentElement);
            cardElement.appendChild(cardListElement);
        }
    }
    else if (card_type=='float'){
        cardElement.setAttribute('class', '');
        if ('id' in d){
            if ('example' in d){
                var cardButtonElement = document.createElement('a');
                cardButtonElement.setAttribute('class', 'waves-effect waves-light btn modal-trigger');
                cardButtonElement.setAttribute('title', 'create an <a> label and point it to #float_'+d['id']+'.');
                if (! ('title' in d)) d['title']=d['id'];
                cardButtonElement.innerHTML=d['title'];
                cardButtonElement.setAttribute('href', '#float_'+d['id']);
                cardElement.appendChild(cardButtonElement);
            }
            
            var cardModalElement = document.createElement('div');
            cardModalElement.setAttribute('class', 'modal');
            cardModalElement.setAttribute('id', 'float_'+d['id']);
            
            if (d['content'].length != 0){
                var cardContentElement = document.createElement('div');
                cardContentElement.setAttribute('class', 'modal-content');
                if (d['content'].length != 0) cardContentElement.innerHTML+=marked(d['content'][0]);
                cardModalElement.appendChild(cardContentElement);
            }
    
            if (d['action'].length != 0){
                var cardActionElement = document.createElement('div');
                cardActionElement.setAttribute('class', 'modal-footer');
                for(var k=0; k<d['action'].length;k++){
                    var c = d['action'][k];
                    var links = $.parseHTML($.parseHTML(marked(c))[0].innerHTML);
                    $.each(links, function(i, el){
                        if (el.nodeName=='A'){
                            el.setAttribute('class', 'modal-close waves-effect waves-green btn-flat');
                            el.setAttribute('target', '');
                            cardActionElement.appendChild(el);
                        }
                    })
                    
                }
                cardModalElement.appendChild(cardActionElement);
            }
            cardElement.appendChild(cardModalElement);
        }
    }
    else if(card_type=='album'){
        cardElement.setAttribute('class', 'carousel');
        for(var k=0; k<d['content'].length;k++){
            var cardContentElement = document.createElement('a');
            cardContentElement.setAttribute('class', 'carousel-item');
            var c = d['content'][k];
            cardContentElement.innerHTML=marked(c);
            cardElement.appendChild(cardContentElement);
        }
    }
    return cardElement.outerHTML;
}


var dfsParse = function(html){
    var content = "";
    $.each(html, function(i, el){
        if (el.nodeName=="CARD"){
            content+=makeCard(el.innerHTML);
        }
        else if (el.nodeName=="MD"){
            content+=marked(el.innerHTML);
        }
        else if (el.nodeName=='#text'){
            content+=el.data;
        }
        else if (el.nodeName=='PRE'){
            content+=el.outerHTML;
        }
        else if (el.nodeType==8){
            content+="";
        }
        else{
            next_html = $.parseHTML(el.innerHTML);
            el.innerHTML=dfsParse(next_html);
            content+=el.outerHTML;
        }
    })
    return content;
}

var advMarked = function(texts){
    md_texts = marked(texts);
    // to filter <card>
    // to filter <md>
    init_html = $.parseHTML(md_texts);
    // return results
    html_texts = dfsParse(init_html);
    return html_texts;
};