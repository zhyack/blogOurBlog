# blogOurBlog

## How It Starts & What You Can Expect

* I want to write easily and read anywhere.
* I want to change the styles of my pages anytime.
* I want to re-construct my pages freely.
* I want to get complete access control of my posts, and dynamic views with respect to the audiences.
* I want to get rid of ads.
* I want to ...

I want to have so many features, so I build my own website. And I also want to share it with anyone interested and improve it. Try the [current version](http://zhyack.cn). A [demo](http://zhyack.cn:9000) whose codes are completely the same as this repo. 

If you do like static pages, my [previous blog](https://zhyack.github.io/posts/2015_11_23_How-To-Build-Your-Blog-On-Github-Pages.html) solution may be a good option.

## The Reality

* Current Backend: Django 2.0.2 (Python 3.5)
* Current Frontend: hodgepodge =_=
* Current Editor: [Editor.md](https://github.com/pandao/editor.md)
* Current Features:
    * User register and private space. 
    * Edit and view of posts and files.
    * Enhanced markdown editor to write posts.
    * Authority control (user access control, password control) of posts and files.
    * Post list in the side bar.

## TODO:
* A tutorial and summary of the previous works.
* New Blog model to host blogs.
    * Alternative styles.
    * Self-organized page lists.
* Better editor.
* New Comment model.
* Faster, faster, faster.
* Interactive games between users.

Let's just do it.

# Getting Start

## The Environment

1. Get Python3: [official install](https://www.python.org/downloads/), `apt-get install`, or [Anaconda](https://www.anaconda.com/distribution/#download-section)
2. Install pip: [download](https://bootstrap.pypa.io/get-pip.py) and `python3 get-pip.py`
3. Install django: `pip3 install django==2.0.2`
4. Use Apache2 to deploy the site:
    * `apt-get install apache2 apache2-dev python3-dev libapache2-mod-wsgi-py3`
    * Add this to the end of `/etc/apache2/envvars`
    ```
        export LANG='en_US.UTF-8'
        export LC_ALL='en_US.UTF-8'
    ```
    * Add this to the begining of `/etc/apache2/apache2.conf`
    ```
        Alias /static/ path-to-your-site/static/
        <Directory path-to-your-site/static>
        Require all granted
        </Directory>
        WSGIScriptAlias / path-to-your-site/mysite/mysite/wsgi.py
        WSGIPythonPath path-to-your-site/mysite/
        <Directory path-to-your-site/mysite/mysite/>
        <Files wsgi.py>
        Require all granted
        </Files>
        </Directory>
    ```
    * `chmod -R 777 path-to-your-site/`
    * `service apache2 restart`
5. Or just expose the site on port 80 (or any other port):
```
    $ screen
    $ cd path-to-your-site/mysite/ 
    $ python3 manage.py runserver 80
```

6. Use the browser to test whether you launched the site.

## What Are The Files For

## User Model

## Post/File Model

## The Editor

## Else