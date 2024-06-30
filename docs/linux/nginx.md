# Nginx

常用配置

```bash
server {
  listen 80;
  listen 443 ssl http2;

  server_name www.demo.com;

  ssl_certificate /usr/local/nginx/ssl/www.demo.com.pem;
  ssl_certificate_key /usr/local/nginx/ssl/www.demo.com.key;


   if ($ssl_protocol = "") { return 301 https://$host$request_uri; }
 
   location / {
      alias /data/www/www.demo.com/
      try_files $uri $uri/ /index.html;
    }

    location ~ .*\.(html)$ {
        add_header Cache-Control no-cache;
        add_header Pragma no-cache;
    }

    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp4|ico|apk)$ {
    expires 30d;
    access_log off;
    }

    location ~ .*\.(js|css)?$ {
    expires 7d;
    access_log off;
    }

    location ~ /(\.user\.ini|\.ht|\.git|\.svn|\.project|LICENSE|README\.md) {
    deny all;
    }

    location /.well-known/acme-challenge/ {
        alias /var/www/challenges/;
        try_files $uri =404;
    }
}
```