#coding:utf-8
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseNotFound, HttpResponse
import os
# Create your views here.
import core
from .forms import UploadForm
from .models import myFile
file_basedir = os.path.join(os.path.dirname(core.settings.BASE_DIR), 'filebase/')
import time
import mimetypes


from django.views.decorators.csrf import csrf_exempt

def getDate():
    return time.strftime("%Y%m%d")

def handle_upload(request, form, rfile):
    info=None
    if rfile==None:
        rfilename = form.cleaned_data.get('fname')
    else:
        rfilename = rfile.name
    if rfilename=='':
        return None, False
    try:
        info = myFile()
        info.fowner = request.user.username
        info.fdate = getDate()
        info.ffeature = form.cleaned_data.get('ffeature')
        info.fname = rfilename
        info.fviewers = form.cleaned_data.get('fviewers')
        info.ftags = form.cleaned_data.get('ftags')
        info.fpass = form.cleaned_data.get('fpass')
        info.frank = form.cleaned_data.get('frank')
        info.ftrace = form.cleaned_data.get('ftrace')
        info.furl = '%s/%s/%s'%(info.fowner, info.ffeature, info.fname)
    except Exception:
        return None, False
    return info, True

def savefilelcally(request, info, rfile):
    pdir1 = os.path.join(file_basedir, info.fowner)
    if not os.path.exists(pdir1):
        try:
            os.mkdir(pdir1)
        except Exception:
            return False, u'保存文件时出错，请联系管理员。'
    pdir2 = os.path.join(pdir1, info.ffeature)
    if not os.path.exists(pdir2):
        try:
            os.mkdir(pdir2)
        except Exception:
            return False, u'保存文件时出错，请联系管理员。'
    pf = os.path.join(pdir2, info.fname)
    try:
        with open(pf, 'wb+') as destination:
            for chunk in rfile.chunks():
                destination.write(chunk)
    except Exception:
        return False, u'保存文件时出错，请联系管理员。'

    if info.fpass=='':
        return True, u'上传成功，链接http://%s/files/%s'%(request.META['HTTP_HOST'], info.furl)
    else:
        return True, u'上传成功，链接http://%s/files/%s\n 免密链接http://%s/files/%s?pass=%s\n\n'%(request.META['HTTP_HOST'], info.furl, request.META['HTTP_HOST'], info.furl, info.fpass)

def uploadPage(request):
    return render(request, 'files/upload.html', context={'have_source':False})


def upload(request):
    ret = {'success':False, 'message':''}
    if not request.user.is_authenticated:
        ret['message']=u'你尚未登录，请转到主页登录后操作。'
    else:
        if request.method == 'POST':
            form = UploadForm(request.POST, request.FILES)
            if form.is_valid():
                flist =  request.FILES.getlist('ufile')
                if len(flist)==0:
                    info, ret['success'] = handle_upload(request, form, None)
                    if not ret['success']:
                        ret['message']=u'保存信息时出错，请确认选择了上传的文件或指定了修改的文件。'
                    else:
                        info.save()
                        ret['message']=u'修改成功！'
                else:
                    ret['success']=True
                    infos = []
                    for ufile in flist:
                        is_success = False
                        info, is_success = handle_upload(request, form, ufile)
                        if not is_success:
                            ret['success']=False
                            ret['message']+=u'保存文件%s信息时出错，请核对信息后联系管理员。\n'%(ufile.name)
                        infos.append(info)
                    if ret['success']:
                        if not form.cleaned_data.get('foverlap'):
                            for info, ufile in zip(infos, flist):
                                try:
                                    myFile.objects.get(furl=info.furl)
                                    ret['success']=False
                                    ret['message']+=u'文件%s已存在，如需更新请勾选overlap选项。\n'%(info.fname)
                                except Exception:
                                    pass
                        if ret['success']:
                            for info, ufile in zip(infos, flist):
                                info.save()
                                is_success, tmp_message = savefilelcally(request, info, ufile)
                                ret['success'] = ret['success'] and is_success
                                ret['message'] += tmp_message
            else:
                ret['message']=u'请确认选择了合适的文件，并填写了可见的用户(至少为private)；如果填写没有问题，请联系管理员排查错误。'
        else:
            ret = {'message', 'Stop hacking me!'}
    return JsonResponse(ret)


from django.http import StreamingHttpResponse
def file_iterator(file_name, chunk_size=512):
    with open(file_name, 'rb') as f:
        while True:
            c = f.read(chunk_size)
            if c:
                yield c
            else:
                break

def download(request, fp, force_att=True, is_resume=False):
    try:
        myfile = myFile.objects.get(furl=fp)
    except Exception:
        return HttpResponseNotFound()
    viewers = set(myfile.fviewers.split())
    owner = myfile.fowner
    if (is_resume or 'unlimited' in viewers or request.user.is_authenticated and ('public' in viewers or request.user.username in viewers or request.user.username==owner)):
        response = None
        try:
            file_path = os.path.join(file_basedir, fp)
            fsock = open(file_path,"rb")
            file_name = os.path.basename(file_path)
            file_size = os.path.getsize(file_path)
            if is_resume or request.user.is_authenticated and request.user.username==owner or myfile.fpass=="" or (request.method == 'POST' and request.POST['pass']==myfile.fpass) or (request.method == 'GET' and 'pass' in request.GET and request.GET['pass']==myfile.fpass):
                mime_type_guess = mimetypes.guess_type(file_name)
                if mime_type_guess[0] == None:
                    mime_type_guess = ('application/octet-stream')
                # response = HttpResponse(fsock, content_type=mime_type_guess[0])
                # response = StreamingHttpResponse(file_iterator(file_path))
                canseelist = ['.txt', '.js', '.py', '.c', '.cpp', '.java', '.py', '.md', '.html', '.htm', '.css', '.pdf', '.jpg', '.bmp', 'png', 'mp4', 'gif', 'svg']
                cansee = False
                for su in canseelist:
                    if fp.lower().endswith(su):
                        cansee = True
                        break
                if force_att or not cansee:
                    response = StreamingHttpResponse(file_iterator(file_path))
                    response['Content-Type'] = 'application/octet-stream'
                    response['Content-Disposition'] = 'attachment; filename=' + file_name
                else:
                    response = HttpResponse(fsock, content_type=mime_type_guess[0])
                    response['Content-Disposition'] = 'filename=' + file_name
            elif request.method == 'POST':
                response = render(request, 'files/file_passwd.html', context={'file_title':file_name, 'request_url':request.path, 'addtional_info':'验证信息有误！'})
            else:
                response = render(request, 'files/file_passwd.html', context={'file_title':file_name, 'request_url':request.path, 'addtional_info':''})
        except IOError:
            response = HttpResponseNotFound()
    else:
        response = HttpResponseNotFound()
    return response

def viewFiles(request, fp):
    return download(request, fp, force_att=False)
def downFiles(request, fp):
    return download(request, fp, force_att=True)

@csrf_exempt
def removeFile(request, fp):
    response = {'message':'', 'success':False}
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                myfile = myFile.objects.get(furl=fp)
            except Exception:
                response['message'] = u'文件已失效或不存在'
                return JsonResponse(response)

            owner = myfile.fowner
            fname = myfile.fname
            if owner==request.user.username:
                try:
                    myfile.delete()
                    file_path = os.path.join(file_basedir, fp)
                    os.remove(file_path)
                except Exception as e:
                    try:
                        myFile.objects.get(furl=fp)
                    except Exception:
                        response['message'] = fname
                        response['success'] = True
                    else:
                        response['message'] = u'删除出错，请联系管理员'
                response['message'] = fname
                response['success'] = True

        else:
            response['message'] = u'请登录后操作！'
    else:
        response['message'] = u''
    return JsonResponse(response)

def updateFile(request, fp):
    if request.user.is_authenticated:
        try:
            myfile = myFile.objects.get(furl=fp)
        except Exception:
            return HttpResponseNotFound
        owner = myfile.fowner
        if request.user.username==owner:
            file_name = myfile.fname
            feature_name = myfile.ffeature
            file_viewers = myfile.fviewers
            file_tags = myfile.ftags
            file_pass = myfile.fpass
            file_rank = myfile.frank
            file_trace = myfile.ftrace
            return render(request, 'files/upload.html', context={'have_source':True, 'source_fname':file_name, 'source_ffeature':feature_name, 'file_viewers':file_viewers, 'file_tags':file_tags, 'file_pass':file_pass, 'file_rank':file_rank, 'file_trace':file_trace})
        else:
            return HttpResponseNotFound
    else:
        return redirect("/users/login/")
