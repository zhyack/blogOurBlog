from django.shortcuts import render
from posts.views import getPosts, getCachedPosts
from django.http import JsonResponse, HttpResponseNotFound, HttpResponseForbidden, HttpResponse
# Create your views here.

def mainpage(request, fp):
    # judge whether the user and file are right.
    answer = getPosts(request, fp)
    pcache = getCachedPosts(request, fp)
    answer['post_cache']=pcache
    if answer['success'] == 0:
        return HttpResponseForbidden()
    elif answer['success'] == 1:
        return HttpResponseNotFound()
    else:
        return render(request, 'editor/editor.html', context=answer)
