# 安装domain-admin

## pip安装

```bash
# 创建名为 venv 的虚拟环境并激活
$ python3 -m venv venv && source venv/bin/activate

# 安装 domain-admin
$ pip install gunicorn domain-admin gevent

# 启动运行
$ gunicorn --bind '127.0.0.1:5001' 'domain_admin.main:app'
```

## supervisor 管理进程

占用5001端口

```bash
# domain-admin.ini
[program: domain-admin]
directory=/data/wwwroot/domain-admin
command=bash -c "source ./venv/bin/activate && gunicorn --worker-class gevent --bind '127.0.0.1:5001' 'domain_admin.main:app'"
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/data/wwwroot/domain-admin/logs/supervisord.log
stopasgroup=true
killasgroup=true
environment=LD_LIBRARY_PATH="/usr/local/openssl/v1.1.1/lib:$LD_LIBRARY_PATH"
```

## Nginx转发

占用8001端口

```bash
# domain-admin.conf
server {
    listen 8001;

    server_name localhost;


    # 代理服务器
    location / {
        proxy_pass http://127.0.0.1:5001/;
        proxy_redirect     off;
        proxy_set_header Host              $http_host;
        proxy_set_header X-Real-Ip         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;

       # fix http code = 206
       proxy_buffer_size 128k;
       proxy_buffers 32 128k;
       proxy_busy_buffers_size 128k;
  }

  location ~ .*\.(html)$ {
   add_header Cache-Control no-cache;
   add_header Pragma no-cache;
  }

   location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico)$ {
    expires 30d;
    access_log off;
  }

  location ~ .*\.(js|css)?$ {
    expires 7d;
    access_log off;
  }

  location ~ /\.ht {
    deny all;
  }
}
```