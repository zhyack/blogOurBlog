#coding:utf-8
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseNotFound, HttpResponse
import os
# Create your views here.
import core
from .forms import PostInfoForm
from .models import myPost
post_basedir = os.path.join(os.path.dirname(core.settings.BASE_DIR), 'postbase/')
cache_basedir = os.path.join(os.path.dirname(core.settings.BASE_DIR), 'cache/')
import time
import codecs
from django.utils.encoding import smart_text

from django.views.decorators.csrf import csrf_exempt

def getDate():
    return time.strftime("%Y%m%d")

def handle_upload(request, form, basedir=post_basedir):
    info=None
    try:
        info = myPost()
        info.powner = form.cleaned_data.get('powner')
        info.pdate = getDate()
        info.pfeature = form.cleaned_data.get('pfeature')
        info.pname = form.cleaned_data.get('pname')
        info.pviewers = form.cleaned_data.get('pviewers')
        info.peditors = form.cleaned_data.get('peditors')
        info.ptags = form.cleaned_data.get('ptags')
        info.purl = '%s/%s/%s'%(info.powner, info.pfeature, info.pname)
        info.ppass = form.cleaned_data.get('ppass')
        info.prank = form.cleaned_data.get('prank')
        info.ptrace = form.cleaned_data.get('ptrace')
    except Exception:
        return None, False
    pdir1 = os.path.join(basedir, info.powner)
    if not os.path.exists(pdir1):
        try:
            os.mkdir(pdir1)
        except Exception:
            return None, False
    pdir2 = os.path.join(pdir1, info.pfeature)
    if not os.path.exists(pdir2):
        try:
            os.mkdir(pdir2)
        except Exception:
            return None, False
    pf = os.path.join(pdir2, info.pname)
    if not os.path.exists(pf):
        try:
            f = codecs.open(pf, 'w', 'UTF-8')
            f.close()
        except Exception:
            return None, False
    elif len(form.cleaned_data.get('pcontent'))>0:
        try:
            f = codecs.open(pf, 'w', 'UTF-8')
            f.write(form.cleaned_data.get('pcontent'))
            f.close()
        except Exception:
            return None, False
    return info, True


def setPost(request):
    return render(request, 'posts/postinfo.html', context={'have_source':False})

def updatePost(request, fp):
    if request.user.is_authenticated:
        try:
            mypost = myPost.objects.get(purl=fp)
        except Exception:
            return HttpResponseNotFound
        owner = mypost.powner
        editors = set(mypost.peditors.split())
        if ('unlimited' in editors or request.user.is_authenticated and ('public' in editors or request.user.username in editors or request.user.username==owner)):
            source_ponwer = mypost.powner
            file_name = mypost.pname
            feature_name = mypost.pfeature
            post_viewers = mypost.pviewers
            post_editors = mypost.peditors
            post_tags = mypost.ptags
            post_pass = mypost.ppass
            post_rank = mypost.prank
            post_trace = mypost.ptrace
            return render(request, 'posts/postinfo.html', context={'have_source':True, 'source_powner':source_ponwer, 'source_pname':file_name, 'source_pfeature':feature_name, 'post_viewers':post_viewers, 'post_editors':post_editors, 'post_tags':post_tags, 'post_pass':post_pass, 'post_rank':post_rank, 'post_trace':post_trace})
        else:
            return HttpResponseNotFound
    else:
        return redirect("/users/login/")



def validPost(request):
    ret = {'success':False, 'message':'', 'url':'/'}
    if not request.user.is_authenticated:
        ret['message']=u'你尚未登录，请转到主页登录后操作。'
    else:
        if request.method == 'POST':
            form = PostInfoForm(request.POST)
            if form.is_valid():
                info, is_success= handle_upload(request, form)
                viewers = set(info.pviewers.split())
                viewers.discard('private')
                viewers.discard(info.powner)
                editors = set(info.peditors.split())
                editors.discard('private')
                editors.discard(info.powner)
                if editors.issubset(viewers)==False:
                    ret['message']=u'拥有编辑权限的用户必须拥有浏览权限！'
                else:
                    if is_success==False:
                        ret['message']=u'初始化出错，请联系管理员。'
                    else:
                        try:
                            myPost.objects.get(purl=info.purl)
                        except Exception:
                            info.save()
                            ret['success'] = True
                            ret['url']='/edit/%s'%(info.purl)
                            ret['message'] = u'创建/更新成功'
                        else:
                            if form.cleaned_data.get('poverlap'):
                                info.save()
                                ret['success'] = True
                                ret['url']='/edit/%s'%(info.purl)
                            else:
                                ret['message']=u'这篇文章已经存在，如要更新请勾选overlap选项。'
            else:
                ret['message']=u'请确认输入了合适的标题，并填写了可见的用户；如果填写没有问题，请联系管理员排查错误。'
        else:
            ret = {'message', 'Stop hacking me!'}
    return JsonResponse(ret)
def saveCache(request):
    ret = {'success':False, 'message':'', 'url':'/'}
    if not request.user.is_authenticated:
        ret['message']=u'你尚未登录，请转到主页登录后操作。'
    else:
        if request.method == 'POST':
            form = PostInfoForm(request.POST)
            if form.is_valid():
                info, is_success= handle_upload(request, form, basedir=cache_basedir)
                if is_success==False:
                    ret['message']=u'初始化出错，请联系管理员。'
                else:
                    ret['success'] = True
            else:
                ret['message']=u'请确认输入了合适的标题，并填写了可见的用户；如果填写没有问题，请联系管理员排查错误。'
        else:
            ret = {'message', 'Stop hacking me!'}
    return JsonResponse(ret)

def extract_head_tail(content):
    head = ''
    end_pos = 0
    h_start = '<!-- HEAD DEFINATION, EDIT AFTER THIS LINE.'
    h_end = '-->'
    if content.startswith(h_start):
        end_pos = content.find(h_end)
        if end_pos!=-1:
            head = content[len(h_start):end_pos]
            end_pos += len(h_end)
        else:
            end_pos = len(h_start)
    while(end_pos<len(content) and (content[end_pos]=='\n' or content[end_pos]=='\r')):
        end_pos+=1
    content = h_start + '\n' + head.strip().rstrip() + '\n' + h_end + '\n' + content[end_pos:]
    
    tail = ''
    t_start = '<!--'
    t_end = 'TAIL DEFINATION, EDIT ABOVE THIS LINE. -->'
    while(content.endswith('\n') or content.endswith('\r')):
        content = content[:-1]
    st_pos = -1
    if content.endswith(t_end):
        st_pos = content.rfind(t_start)
        if st_pos!=-1:
            tail = content[st_pos+len(t_start):-len(t_end)]
            content = content[:st_pos]
    while(content.endswith('\n') or content.endswith('\r')):
        content = content[:-1]
    content = content + '\n\n' + t_start + '\n' + tail.strip().rstrip() + '\n' + t_end + '\n'
    return content, head, tail



def getPosts(request, fp):
    ret = {'success':0, 'message':''}
    if request.user.is_authenticated:
        try:
            mypost = myPost.objects.get(purl=fp)
        except Exception:
            ret['success'] = 1
            ret['message'] = u'不存在此文章！'
        viewers = set(mypost.pviewers.split())
        editors = set(mypost.peditors.split())
        owner = mypost.powner
        if ('unlimited' in editors or request.user.is_authenticated and ('public' in editors or request.user.username in editors or request.user.username==owner)):
            try:
                post_path = os.path.join(post_basedir, fp)
                f = codecs.open(post_path, 'r', 'UTF-8')
                content = ''.join(f.readlines())
                f.close()
                file_name = os.path.basename(post_path)
                content = smart_text(content)
                content, content_head, content_tail = extract_head_tail(content)
                ret['success']=2
                ret['post_owner']=owner
                ret['post_title']=file_name
                ret['post_viewers']=mypost.pviewers
                ret['post_editors']=mypost.peditors
                ret['post_content']=content
                ret['post_tags']=mypost.ptags
                ret['post_date']=mypost.pdate
                ret['post_feature']=mypost.pfeature
                ret['post_pass']=mypost.ppass
                ret['post_rank']=mypost.prank
                ret['post_trace']=mypost.ptrace
            except IOError:
                ret['success'] = 1
                ret['message'] = u'不存在此文章！'
        else:
            ret['success'] = 0
            ret['message'] = u'不存在此文章！'
    else:
        ret['success'] = 0
        ret['message'] = u'你尚未登录，请转到主页登录后操作。'
    return ret
def getCachedPosts(request, fp):
    ret = ''
    if request.user.is_authenticated:
        try:
            mypost = myPost.objects.get(purl=fp)
        except Exception:
            pass
        viewers = set(mypost.pviewers.split())
        editors = set(mypost.peditors.split())
        owner = mypost.powner
        if ('unlimited' in editors or request.user.is_authenticated and ('public' in editors or request.user.username in editors or request.user.username==owner)):
            try:
                post_path = os.path.join(cache_basedir, fp)
                f = codecs.open(post_path, 'r', 'UTF-8')
                content = ''.join(f.readlines())
                content, content_head, content_tail = extract_head_tail(content)
                f.close()
                file_name = os.path.basename(post_path)
                content = smart_text(content)
                ret=content
            except IOError:
                content, content_head, content_tail = extract_head_tail("")
                ret = content
        else:
            pass
    else:
        pass
    return ret

def viewPosts(request, fp, allow_discuss=True):
    try:
        mypost = myPost.objects.get(purl=fp)
    except Exception:
        return HttpResponseNotFound()
    viewers = set(mypost.pviewers.split())
    owner = mypost.powner
    if ('unlimited' in viewers or request.user.is_authenticated and ('public' in viewers or request.user.username in viewers or request.user.username==owner)):
        response = None
        try:
            post_path = os.path.join(post_basedir, fp)
            f = codecs.open(post_path, 'r', 'UTF-8')
            content = ''.join(f.readlines())
            f.close()
            file_name = os.path.basename(post_path)
            content = smart_text(content)
            content, content_head, content_tail = extract_head_tail(content)
            discuss_allowed = False
            if (file_name=='public_index' and mypost.pfeature=='indexes'):
                file_name='Welcome to %s\'s Site~'%(owner[0:1].upper()+owner[1:])
            if (file_name=='blog_index' and mypost.pfeature=='indexes'):
                file_name='Welcome to %s\'s Blog~'%(owner[0:1].upper()+owner[1:])
            if request.user.is_authenticated and request.user.username==owner or mypost.ppass=="" or (request.method == 'POST' and request.POST['pass']==mypost.ppass):
                response = render(request, 'posts/posts.html', context={'post_content':content, 'post_title':file_name, 'discuss_allowed':(discuss_allowed and content_tail.find('<div style=\"display:none\">use_disqus:false</div>')==-1), 'extra_styles':content_head, 'additional_scripts':content_tail, 'use_md':content_tail.find('<div style=\"display:none\">use_md:false</div>')==-1})
            elif request.method == 'POST':
                response = render(request, 'posts/post_passwd.html', context={'post_title':file_name, 'request_url':request.path, 'addtional_info':'验证信息有误！'})
            else:
                response = render(request, 'posts/post_passwd.html', context={'post_title':file_name, 'request_url':request.path, 'addtional_info':''})
        except IOError:
            response = HttpResponseNotFound()
            

    else:
        response = HttpResponseNotFound()
    return response


@csrf_exempt
def removePost(request, fp):
    response = {'message':'', 'success':False}
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                mypost = myPost.objects.get(purl=fp)
            except Exception:
                response['message'] = u'页面已失效或不存在'
            owner = mypost.powner
            pname = mypost.pname
            if owner==request.user.username:
                try:
                    mypost.delete()
                    post_path = os.path.join(post_basedir, fp)
                    os.remove(post_path)
                except Exception:
                    try:
                        myPost.objects.get(purl=fp)
                    except Exception:
                        response['message'] = pname
                        response['success'] = True
                    else:
                        response['message'] = u'删除出错，请确认你是本文档所有者或联系管理员'
                response['message'] = pname
                response['success'] = True

        else:
            response['message'] = u'请登录后操作！'
    else:
        response['message'] = u''
    return JsonResponse(response)
