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

# Getting Started

## The Environment

These have been tested on ubuntu 14.04, 16.04, 18.04.

1. Get Python3: [official install](https://www.python.org/downloads/), `apt-get install`, or [Anaconda](https://www.anaconda.com/distribution/#download-section)
2. Install pip: [download](https://bootstrap.pypa.io/get-pip.py) and `python3 get-pip.py`
3. Install django: `pip3 install django==2.0.2`
4. Modify the config file `blogOurBlog/config.json`:
    * Change the hosts according to your domain.
    * A complicated `secret_key` is suggested to replace the original one.
    * It's suggessted to turn close the debugging mode by set `show_debug_info` to `false`.
5. Use Apache2 to deploy the site:
    * `apt-get install apache2 apache2-dev python3-dev libapache2-mod-wsgi-py3`
    * Add this to the end of `/etc/apache2/envvars`
    ```
        export LANG='en_US.UTF-8'
        export LC_ALL='en_US.UTF-8'
    ```
    * Add this to the begining of `/etc/apache2/apache2.conf`
    ```
        Alias /static/ path-to-blogOurBlog/static/
        <Directory path-to-blogOurBlog/static>
        Require all granted
        </Directory>
        WSGIScriptAlias / path-to-blogOurBlog/mysite/mysite/wsgi.py
        WSGIPythonPath path-to-blogOurBlog/mysite/
        <Directory path-to-blogOurBlog/mysite/mysite/>
        <Files wsgi.py>
        Require all granted
        </Files>
        </Directory>
    ```
    * `chmod -R 777 path-to-blogOurBlog/`
    * `service apache2 restart`
6. Or just expose the site on port 80 (or any other port):
```
    $ screen
    $ cd path-to-blogOurBlog/mysite/ 
    $ python3 manage.py runserver 80
```
7. Use the browser to test whether you launched the site.
8. The original admin account is :
    * username: creator
    * password: blogOurBlog
    * It's the only account that can access the admin panel. **Remember to change the password.**


## What Are The Files For

## User Model

## Post/File Model

## The Editor

## Else