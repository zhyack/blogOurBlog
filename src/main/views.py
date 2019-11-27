#coding: UTF-8
from django.shortcuts import render
import json
import codecs
import core
import os
import copy
from django.utils.encoding import smart_text
from django.http import JsonResponse, HttpResponseNotFound, HttpResponse
from posts.models import myPost
from files.models import myFile
from users.models import User
from posts.views import viewPosts


from django.views.decorators.csrf import csrf_exempt
# Create your views here.

def index(request):
    avafile = None
    suf = ''
    if request.user.is_authenticated:
        for suf in ['', '.jpg','.png','.ico','.bmp','.svg', '.gif', '.JPG', '.PNG', '.ICO', '.BMP', '.SVG', '.GIF']:
            try:
                avafile = myFile.objects.get(furl='%s/profile/profile%s'%(request.user.username,suf))
                break
            except Exception:
                avafile = None
                pass
    if avafile:
        user_profile = '/files/%s/profile/profile%s'%(request.user.username,suf)
    else:
        user_profile = '/static/main/images/anony.png'
    nav_content = getNav(request)[0]
    return render(request, 'index.html', context={"index_nav":nav_content, "user_profile":user_profile, "index_title":core.settings.myconfig['index_title']})

def home(request):
    if request.user.is_authenticated:
        response = viewPosts(request, '%s/indexes/index'%(request.user.username), False)
        if response.status_code!=404:
            return response
    downer_id=core.settings.myconfig['owner_id']
    return viewPosts(request, '%s/indexes/public_index'%(downer_id), False)


def getNav(request, order='date', content=None, show_hide=False):
    templates = {'caption':r'<p class="caption"><span class="caption-text">$$caption$$</span></p>', 'ul': r'<ul>$$ul$$</ul>', 'multili':r'<li class="toctree-l%d"><a class="reference internal" title="$$title$$"><span class="toctree-expand"></span>$$shorttitle$$ $$action$$ </a>$$li$$</li>', 'singleli':r'<li class="toctree-l%d"><a class="reference internal" title="$$title$$"><span onclick=$$action0$$>$$shorttitle$$</span><i class="$$fa_icon1$$" onclick=$$action1$$ style="position:absolute;right:50px;top:7.5px;width:14px;"></i><i class="$$fa_icon2$$" onclick=$$action2$$ style="position:absolute;right:30px;top:7.5px;width:14px;"></i><i class="$$fa_icon3$$" onclick=$$action3$$ style="position:absolute;right:6px;top:7.5px;width:14px;"></i></a></li>', 'singlelishare':r'<li class="toctree-l%d"><a class="reference internal" title="$$title$$"><span onclick=$$action0$$>$$shorttitle$$</span><i class="$$fa_icon1$$" onclick=$$action1$$ style="position:absolute;right:50px;top:7.5px;width:14px;"></i></a></li>'}
    ret = ''
    ret_note_d = {}
    ret_file_d = {}

    mstack = []
    def makeNav(d, depth, ctype=None):
        def makeList(d, depth, ctype):
            ret = templates['ul']
            ul = ''
            item_cnt = 0
            for item in d['sub']:
                mstack.append(str(item_cnt))
                if 'sub' in item:
                    folder_action = ''
                    if ctype:
                        folder_action = "<i class=\"fa fa-book\" onclick=alterPage(\"/preview/%s/%s/%s\") style=\"position:absolute;right:50px;top:7.5px;width:14px;\"></i>"%(order,ctype,'/'.join(mstack))
                        if request.user.is_authenticated and item['title']==request.user.username:
                            folder_action+="<i class=\"fa fa-folder-open\" onclick=alterPage(\"/preview_table/%s/%s/%s\") style=\"position:absolute;right:30px;top:7.5px;width:14px;\"></i>"%(order,ctype,'/'.join(mstack))

                    tmp = templates['multili'].replace('$$title$$', item['title']).replace('$$shorttitle$$', item['shorttitle']).replace('$$action$$', folder_action)%(depth)
                    tmp = tmp.replace('$$li$$', makeList(item, depth+1, ctype))
                    ul += tmp
                else:
                    tmp = ''
                    if 'own' in item and item['own']:
                        tmp = templates['singleli'].replace('$$title$$', item['title']).replace('$$action0$$', item['action0']).replace('$$action1$$', item['action1']).replace('$$action2$$', item['action2']).replace('$$action3$$', item['action3']).replace('$$fa_icon1$$', item['fa_icon1']).replace('$$fa_icon2$$', item['fa_icon2']).replace('$$fa_icon3$$', item['fa_icon3']).replace('$$shorttitle$$', item['shorttitle'])%(depth)
                    else:
                        if 'fa_icon1' not in item:
                            item['fa_icon1'] = 'fa fa-arrows-alt'
                            item['action0'] = item['action']
                            item['action1'] = r"window.open('%s','_blank'); "%(item['action'][item['action'].find('\"')+1:item['action'].find('\"', item['action'].find('\"')+1)])
                        tmp = templates['singlelishare'].replace('$$title$$', item['title']).replace('$$action0$$', item['action0']).replace('$$action1$$', item['action1']).replace('$$fa_icon1$$', item['fa_icon1']).replace('$$shorttitle$$', item['shorttitle'])%(depth)
                    ul += tmp
                del(mstack[-1])
                item_cnt+=1

            ret = ret.replace('$$ul$$', ul)
            return ret

        ret = templates['caption'].replace('$$caption$$',d['caption'])
        if 'sub' in d:
            ret += makeList(d, depth+1, ctype)
        ret = ret[:ret.find('<li class=\"')+11]+"current "+ret[ret.find('<li class=\"')+11:]
        return ret

    # for public
    f = codecs.open(os.path.join(os.path.dirname(core.settings.BASE_DIR), 'static/main/sidebar_public.json'), 'r', 'UTF-8')
    ds = ''.join(f.readlines())
    f.close()
    d = json.loads(ds)
    ret += makeNav(d, 1, None)


    def getValidPosts(request, show_hide=False):
        ret = []
        ps=myPost.objects.all().order_by('powner', '-prank', '-pdate')
        for p in ps:
            if 'unlimited' in p.pviewers or request.user.is_authenticated and ('public' in p.pviewers or request.user.username in p.pviewers or request.user.username==p.powner):
                if content and p.powner.find(content)==-1 and p.pname.find(content)==-1 and p.ptags.find(content)==-1:
                    continue
                if p.ptrace<0 and (not request.user.is_authenticated or request.user.username!=p.powner or show_hide!=True) or p.ptrace==0 and (not request.user.is_authenticated or p.powner!=request.user.username):
                    continue
                ret.append(p)
        return ret
    def getValidFiles(request, show_hide=False):
        ret = []
        fs=myFile.objects.all().order_by('fowner', '-frank', '-fdate')
        for f in fs:
            if 'unlimited' in f.fviewers or request.user.is_authenticated and ('public' in f.fviewers or request.user.username in f.fviewers or request.user.username==f.fowner):
                if content and f.fowner.find(content)==-1 and f.fname.find(content)==-1 and f.ftags.find(content)==-1:
                    continue
                if f.ftrace<0 and (not request.user.is_authenticated or request.user.username!=f.fowner or show_hide!=True) or f.ftrace==0 and (not request.user.is_authenticated or f.fowner!=request.user.username):
                    continue
                ret.append(f)
        return ret

    d = {}
    d['caption']=u"笔记入口"
    ps = getValidPosts(request, show_hide=show_hide)
    if len(ps)>0:
        d['sub']=[]
        userindex = {}
        if order=='date':
            if request.user.is_authenticated:
                d['sub']=[{'title':request.user.username, 'shorttitle':request.user.username, 'sub':[]}]
                userindex = {request.user.username:0}
            for p in ps:
                if p.powner not in userindex:
                    d['sub'].append({})
                    d['sub'][-1]['title'] = p.powner
                    d['sub'][-1]['shorttitle'] = p.powner
                    d['sub'][-1]['sub'] = []
                    userindex[p.powner]=len(userindex)
                uid = userindex[p.powner]
                d['sub'][uid]['sub'].append({})
                d['sub'][uid]['sub'][-1]['title'] = p.pname
                d['sub'][uid]['sub'][-1]['shorttitle'] = p.pname
                d['sub'][uid]['sub'][-1]['fa_icon1'] = 'fa fa-arrows-alt'
                d['sub'][uid]['sub'][-1]['fa_icon2'] = 'fa fa-cogs'
                d['sub'][uid]['sub'][-1]['fa_icon3'] = 'fa fa-trash'
                if len(p.pname)>18:
                    d['sub'][uid]['sub'][-1]['shorttitle'] = p.pname[:18]+'...'
                d['sub'][uid]['sub'][-1]['action0'] = "alterPage(\"/posts/%s/\")"%(p.purl.replace(' ', '%%20'))
                d['sub'][uid]['sub'][-1]['action1'] = "window.open(\'posts/%s\',\'_blank\');"%(p.purl.replace(' ', '%%20'))
                d['sub'][uid]['sub'][-1]['action2'] = "alterPage(\"/updatepost/%s/\")"%(p.purl.replace(' ', '%%20'))
                d['sub'][uid]['sub'][-1]['action3'] = "removeit(\"/removepost/%s/\")"%(p.purl.replace(' ', '%%20'))
                editors = set(p.peditors.split())
                d['sub'][uid]['sub'][-1]['own'] = ('unlimited' in editors or request.user.is_authenticated and ('public' in editors or request.user.username in editors or request.user.username==p.powner))

                d['sub'][uid]['sub'][-1]['viewers'] = list(set(p.peditors.split()).union(set(p.pviewers.split())).union(set([p.powner])))
                d['sub'][uid]['sub'][-1]['pass_protect'] = p.ppass!=''
                d['sub'][uid]['sub'][-1]['create_date'] = p.pdate
                d['sub'][uid]['sub'][-1]['tags'] = p.ptags.split('|')
                d['sub'][uid]['sub'][-1]['rank'] = p.prank
                d['sub'][uid]['sub'][-1]['trace'] = p.ptrace
                d['sub'][uid]['sub'][-1]['url'] = p.purl

        elif order=='tag':
            tagset = dict()
            for p in ps:
                tl = p.ptags.split('|')
                for t in tl:
                    tagset[t]=-1
            tags = list(tagset)
            tags = sorted(tags)
            for i in range(len(tags)):
                tagset[tags[i]]=i
                d['sub'].append({})
                d['sub'][-1]['title'] = tags[i]
                d['sub'][-1]['shorttitle'] = tags[i]
                d['sub'][-1]['sub'] = []
            for p in ps:
                tl = p.ptags.split('|')
                for t in tl:
                    tid = tagset[t]
                    d['sub'][tid]['sub'].append({})
                    d['sub'][tid]['sub'][-1]['title'] = p.pname
                    d['sub'][tid]['sub'][-1]['shorttitle'] = p.pname
                    d['sub'][tid]['sub'][-1]['fa_icon1'] = 'fa fa-arrows-alt'
                    d['sub'][tid]['sub'][-1]['fa_icon2'] = 'fa fa-cogs'
                    d['sub'][tid]['sub'][-1]['fa_icon3'] = 'fa fa-trash'
                    if len(p.pname)>14:
                        d['sub'][tid]['sub'][-1]['shorttitle'] = p.pname[:14]+'...'
                    d['sub'][tid]['sub'][-1]['action0'] = "alterPage(\"/posts/%s/\")"%(p.purl.replace(' ', '%%20'))
                    d['sub'][tid]['sub'][-1]['action1'] = "window.open(\'posts/%s\',\'_blank\');"%(p.purl.replace(' ', '%%20'))
                    d['sub'][tid]['sub'][-1]['action2'] = "alterPage(\"/updatepost/%s/\")"%(p.purl.replace(' ', '%%20'))
                    d['sub'][tid]['sub'][-1]['action3'] = "removeit(\"/removepost/%s/\")"%(p.purl.replace(' ', '%%20'))
                    editors = set(p.peditors.split())
                    d['sub'][tid]['sub'][-1]['own'] = ('unlimited' in editors or request.user.is_authenticated and ('public' in editors or request.user.username in editors or request.user.username==p.powner))

                    d['sub'][tid]['sub'][-1]['viewers'] = list(set(p.peditors.split()).union(set(p.pviewers.split())).union(set([p.powner])))
                    d['sub'][tid]['sub'][-1]['pass_protect'] = p.ppass!=''
                    d['sub'][tid]['sub'][-1]['create_date'] = p.pdate
                    d['sub'][tid]['sub'][-1]['tags'] = p.ptags.split('|')
                    d['sub'][tid]['sub'][-1]['rank'] = p.prank
                    d['sub'][tid]['sub'][-1]['trace'] = p.ptrace
                    d['sub'][tid]['sub'][-1]['url'] = p.purl



    ret += makeNav(d, 1, 'posts')
    ret_note_d = copy.deepcopy(d)

    d = {}
    d['caption']=u"文件列表"
    fs = getValidFiles(request, show_hide=show_hide)
    if len(fs)>0:
        d['sub']=[]
        userindex = {}
        if order=="date":
            if request.user.is_authenticated:
                d['sub']=[{'title':request.user.username, 'shorttitle':request.user.username, 'sub':[]}]
                userindex = {request.user.username:0}
            for f in fs:
                if f.fowner not in userindex:
                    d['sub'].append({})
                    d['sub'][-1]['title'] = f.fowner
                    d['sub'][-1]['shorttitle'] = f.fowner
                    d['sub'][-1]['sub'] = []
                    userindex[f.fowner]=len(userindex)
                uid = userindex[f.fowner]
                d['sub'][uid]['sub'].append({})
                d['sub'][uid]['sub'][-1]['title'] = f.fname
                d['sub'][uid]['sub'][-1]['shorttitle'] = f.fname
                if len(f.fname)>14:
                    d['sub'][uid]['sub'][-1]['shorttitle'] = f.fname[:14]+'...'
                d['sub'][uid]['sub'][-1]['fa_icon1'] = 'fa fa-cloud-download'
                d['sub'][uid]['sub'][-1]['fa_icon2'] = 'fa fa-cogs'
                d['sub'][uid]['sub'][-1]['fa_icon3'] = 'fa fa-trash'
                d['sub'][uid]['sub'][-1]['action0'] = "alterPage(\"/files/%s/\")"%(f.furl.replace(' ', '%%20'))
                d['sub'][uid]['sub'][-1]['action1'] = "alterPage(\"/download/%s\")"%(f.furl.replace(' ', '%%20'))
                d['sub'][uid]['sub'][-1]['action2'] = "alterPage(\"/updatefile/%s/\")"%(f.furl.replace(' ', '%%20'))
                d['sub'][uid]['sub'][-1]['action3'] = "removeit(\"/removefile/%s/\")"%(f.furl.replace(' ', '%%20'))
                d['sub'][uid]['sub'][-1]['own'] = (request.user.is_authenticated and f.fowner==request.user.username)

                d['sub'][uid]['sub'][-1]['viewers'] = list(set(f.fviewers.split()).union(set([f.fowner])))
                d['sub'][uid]['sub'][-1]['pass_protect'] = f.fpass!=''
                d['sub'][uid]['sub'][-1]['create_date'] = f.fdate
                d['sub'][uid]['sub'][-1]['tags'] = f.ftags.split('|')
                d['sub'][uid]['sub'][-1]['rank'] = f.frank
                d['sub'][uid]['sub'][-1]['trace'] = f.ftrace
                d['sub'][uid]['sub'][-1]['url'] = f.furl

        elif order=='tag':
            tagset = dict()
            for f in fs:
                tl = f.ftags.split('|')
                for t in tl:
                    tagset[t]=-1
            tags = list(tagset)
            tags = sorted(tags)
            for i in range(len(tags)):
                tagset[tags[i]]=i
                d['sub'].append({})
                d['sub'][-1]['title'] = tags[i]
                d['sub'][-1]['shorttitle'] = tags[i]
                d['sub'][-1]['sub'] = []
            for f in fs:
                tl = f.ftags.split('|')
                for t in tl:
                    tid = tagset[t]
                    d['sub'][tid]['sub'].append({})
                    d['sub'][tid]['sub'][-1]['title'] = f.fname
                    d['sub'][tid]['sub'][-1]['shorttitle'] = f.fname
                    if len(f.fname)>18:
                        d['sub'][tid]['sub'][-1]['shorttitle'] = f.fname[:18]+'...'
                    d['sub'][tid]['sub'][-1]['fa_icon1'] = 'fa fa-cloud-download'
                    d['sub'][tid]['sub'][-1]['fa_icon2'] = 'fa fa-cogs'
                    d['sub'][tid]['sub'][-1]['fa_icon3'] = 'fa fa-trash'
                    d['sub'][tid]['sub'][-1]['action0'] = "alterPage(\"/files/%s/\")"%(f.furl.replace(' ', '%%20'))
                    d['sub'][tid]['sub'][-1]['action1'] = "alterPage(\"/download/%s\")"%(f.furl.replace(' ', '%%20'))
                    d['sub'][tid]['sub'][-1]['action2'] = "alterPage(\"/updatefile/%s/\")"%(f.furl.replace(' ', '%%20'))
                    d['sub'][tid]['sub'][-1]['action3'] = "removeit(\"/removefile/%s/\")"%(f.furl.replace(' ', '%%20'))
                    d['sub'][tid]['sub'][-1]['own'] = (request.user.is_authenticated and f.fowner==request.user.username)

                    
                    d['sub'][tid]['sub'][-1]['viewers'] = list(set(f.fviewers.split()).union(set([f.fowner])))
                    d['sub'][tid]['sub'][-1]['pass_protect'] = f.fpass!=''
                    d['sub'][tid]['sub'][-1]['create_date'] = f.fdate
                    d['sub'][tid]['sub'][-1]['tags'] = f.ftags.split('|')
                    d['sub'][tid]['sub'][-1]['rank'] = f.frank
                    d['sub'][tid]['sub'][-1]['trace'] = f.ftrace
                    d['sub'][tid]['sub'][-1]['url'] = f.furl

    ret += makeNav(d, 1, 'files')
    ret_file_d = copy.deepcopy(d)
    ret = r'<li class="toctree-l1 current">$$content$$</li>'.replace('$$content$$', ret)
    return (smart_text(ret), ret_note_d, ret_file_d)


@csrf_exempt
def refreshNav(request):
    if request.method == 'POST':
        return JsonResponse({'nav':getNav(request)[0]})
    else:
        return JsonResponse({})

@csrf_exempt
def refreshtagedNav(request):
    if request.method == 'POST':
        return JsonResponse({'nav':getNav(request, 'tag')[0]})
    else:
        return JsonResponse({})

@csrf_exempt
def refreshsearchNav(request, cont):
    if request.method == 'POST':
        return JsonResponse({'nav':getNav(request, content=cont)[0]})
    else:
        return JsonResponse({})


def preview(request, route):
    route = route.strip().rstrip()
    while route.startswith('/'):
        route = route[1:]
    while route.endswith('/'):
        route = route[:-1]
    l = route.split('/')
    try:
        text, dp, df = getNav(request, l[0])
    except Exception:
        return HttpResponseNotFound
    d = None
    if l[1]=='files':
        d = df
    elif l[1]=='posts':
        d = dp
    else:
        return HttpResponseNotFound
    try:
        for i in range(2, len(l)):
            d = d['sub'][int(l[i])]
        if 'caption' in d:
            d['title'] = d['caption']
        _ = d['sub']
    except Exception:
        return HttpResponseNotFound



    templates = {'li':r"<span>$$title$$</span><i class='$$fa_icon2$$' onclick=$$action2$$ style='position:absolute;right:50px;top:7.5px;width:14px;'></i><i class='$$fa_icon3$$' onclick=$$action3$$ style='position:absolute;right:20px;top:7.5px;width:14px;'></i>", 'base': r'<div class="Image_Wrapper" data-caption="$$desc$$" style="max-width:30%;max-height:300px"><a onclick="$$action$$" title="$$title$$"><img src="$$imgurl$$" style="max-width:100%;max-height:100%"></a></div>'}
    img_links = {'folder':'/static/main/images/.svg', 'unknown':'/static/main/images/file.svg', 'video':'/static/main/images/file-video.svg', 'text':'/static/main/images/file-alt.svg'}
    d['content'] = ''
    for item in d['sub']:
        tmp = templates['base']
        if 'sub' in item:
            tmp = tmp.replace('$$title$$', item['title'])
            tmp = tmp.replace('$$action$$', '/preview/%s/%s'%('/'.join(l),item['title']))
            tmp = tmp.replace('$$imgurl$$', img_links['folder'])
            tt = []
            for ii in item['sub']:
                tt.append(ii['title'])
            tmp = tmp.replace('$$desc$$', '||'.join(tt))
        else:
            t = item['title']
            tmp = tmp.replace('$$title$$', t)
            tmp = tmp.replace('$$action$$', 'self'+item['action0'].replace('\"','\''))
            if t.endswith('.ico') or t.endswith('.jpg') or t.endswith('.bmp') or t.endswith('.png') or t.endswith('.gif'):
                tmp = tmp.replace('$$imgurl$$', '/'+item['action0'][12:-3])
            elif  t.endswith('.mp4') or t.endswith('.mp3') or t.endswith('.mkv') or t.endswith('.rm') or t.endswith('.rmvb') or t.endswith('.flv'):
                tmp = tmp.replace('$$imgurl$$', img_links['video'])
            elif t.endswith('.pdf') or t.endswith('.txt') or t.endswith('.c') or t.endswith('.java') or t.endswith('.py') or t.endswith('.html') or t.endswith('.css') or t.endswith('.js'):
                tmp = tmp.replace('$$imgurl$$', img_links['text'])
            else:
                tmp = tmp.replace('$$imgurl$$', img_links['unknown'])
            if 'own' in item and item['own']:
                tmp = tmp.replace('$$desc$$', templates['li'].replace('$$fa_icon2$$', item['fa_icon2']).replace('$$fa_icon3$$', item['fa_icon3']).replace('$$action2$$', 'self'+item['action2'].replace('\"','\'')).replace('$$action3$$', 'self'+item['action3'].replace('\"','\''))).replace('$$title$$', item['shorttitle'])
            else:
                tmp = tmp.replace('$$desc$$', item['shorttitle'])

        d['content']+=smart_text(tmp+'\n')
        d['content'] = d['content'].replace('%%20',r'%20')

    return render(request, 'folder_preview.html', context=d)

def preview_table(request, route):
    if not request.user.is_authenticated:
        return HttpResponseNotFound
    route = route.strip().rstrip()
    while route.startswith('/'):
        route = route[1:]
    while route.endswith('/'):
        route = route[:-1]
    l = route.split('/')
    try:
        text, dp, df = getNav(request, l[0], show_hide=True)
    except Exception:
        return HttpResponseNotFound
    d = None
    if l[1]=='files':
        d = df
        templates_tr = '|**$$title$$**|$$date$$|$$viewers$$|$$tags$$|**$$rank$$**|$$trace$$|$$pass$$|$$op_check$$|$$op_manage$$|$$op_delete$$|\n'
    elif l[1]=='posts':
        d = dp
        templates_tr = '|**$$title$$**|$$date$$|$$viewers$$|$$tags$$|**$$rank$$**|$$trace$$|$$pass$$|$$op_check$$|$$op_edit$$|$$op_manage$$|$$op_delete$$|\n'
    else:
        return HttpResponseNotFound
    try:
        td = d['sub'][0]
        for i in range(1, len(d['sub'])):
            td['sub'].extend(d['sub'][i]['sub'])
        if 'caption' in d:
            d['title'] = d['caption']
        _ = d['sub']
        d = td
    except Exception:
        return HttpResponseNotFound


    if l[1]=='files':
        content = '|**文档标题**|**修改时间**|**可见性**|**标签**|**排序**|**索引**|**加密**|**查看**|**设置**|**删除**|\n|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|\n'
    elif l[1]=='posts':
        content = '|**文档标题**|**修改时间**|**可见性**|**标签**|**排序**|**索引**|**加密**|**查看**|**编辑**|**设置**|**删除**|\n|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|\n'
    
    can_see_cnt = 0
    for item in d['sub']:
        if not item['own']:
            continue
        can_see_cnt += 1
        item['url'] = item['url'].replace('(',r'%28').replace(')',r'%29')
        tmp = templates_tr
        tmp = tmp.replace('$$title$$', item['title'])
        tmp = tmp.replace('$$date$$', item['create_date'])

        tmp_viewers = ''
        viewers = set(item['viewers'])
        viewers.discard('private')
        viewers.discard(request.user.username)
        for v in list(viewers):
            tmp_viewers+='`%s` '%(v)
            viewers.discard(v)
            if len(tmp_viewers)>20:
                if len(viewers):
                    tmp_viewers+='<span title="%s"><code>...</code></span> '%(' '.join(list(viewers)))
                break
        if tmp_viewers=='':
            tmp_viewers='`~`'
        tmp = tmp.replace('$$viewers$$', tmp_viewers)

        tmp_tags = ''
        tags = set(item['tags'])
        tags.discard('null')
        for v in list(tags):
            tmp_tags+='`%s` '%(v)
            tags.discard(v)
            if len(tmp_tags)>20:
                if len(tags):
                    tmp_tags+='<span title="%s"><code>...</code></span> '%(' '.join(list(tags)))
                break
        if tmp_tags=='':
            tmp_tags='`~`'
        tmp = tmp.replace('$$tags$$', tmp_tags)

        tmp = tmp.replace('$$rank$$', str(item['rank']))

        if item['trace']>0:
            tmp = tmp.replace('$$trace$$', '<span title="索引对所有人开放"><i class=\'fa fa-check-circle\' style=\"color:#33aa99\"</i></span> ')
        elif item['trace']==0:
            tmp = tmp.replace('$$trace$$', '<span title="索引仅对自己开放"><i class=\'fa fa-info-circle\' style=\"color:#bbbb00\"</i></span> ')
        else:
            tmp = tmp.replace('$$trace$$', '<span title="索引关闭"><i class=\'fa fa-times-circle\' style=\"color:#888888\"</i></span> ')
        
        if item['pass_protect']:
            tmp = tmp.replace('$$pass$$', '<i class=\'fa fa-lock\' style=\"color:#ff66ff\"</i>')
        else:
            tmp = tmp.replace('$$pass$$', '<i class=\'fa fa-unlock-alt\' style=\"color:#33aa33\"</i>')
        

        tmp = tmp.replace('$$op_check$$', '<a href="/%s/%s/"><i class=\'fa fa-eye\' style=\"color:#000000\"</i></a>'%(l[1], item['url']))
        tmp = tmp.replace('$$op_manage$$', '<a href="/update%s/%s/"><i class=\'fa fa-cogs\' style=\"color:#000000\"</i></a>'%(l[1][:-1], item['url']))
        tmp = tmp.replace('$$op_delete$$', '<i class=\'fa fa-trash\' style=\"color:#aa00ff\" onclick=\"selfremoveit(\'/remove%s/%s/\')\"</i>'%(l[1][:-1], item['url']))
        tmp = tmp.replace('$$op_edit$$', '<a href="/edit/%s/"><i class=\'fa fa-pencil-square-o\' style=\"color:#000000\"</i></a>'%(item['url']))

        content+=tmp

    if can_see_cnt==0:
        content += ''
    

    return render(request, 'posts/posts.html', {'post_title':'My Assets', 'extra_styles':r'<style>.editormd-html-preview {width: 90%;margin: 0 auto;}</style> <script>function selfremoveit(turl){removeit(turl)}</script>'+'<script src=\"/static/main/js/pre.js\"></script>', 'use_md':True, 'post_content':content, 'additional_scripts':'<script src=\"/static/main/js/post.js\"></script>', 'discuss_allowed':False})