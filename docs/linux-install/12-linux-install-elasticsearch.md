# 安装ElasticSearch

1、添加用户组和用户

```bash
$ groupadd elsearch

$ useradd elsearch -g elsearch -s /sbin/nologin

$ id elsearch
```

2、auth授权验证

```bash
# 安装工具包
yum install httpd-tools -y

# 生成密码，用户名 admin, ！如果再次执行会被覆盖
htpasswd -c /usr/local/nginx/.htpasswd admin

# 提示输入2遍密码
```

## ElasticSearch

目录授权

```bash
mkdir data

chown -R elsearch:elsearch config
chown -R elsearch:elsearch logs
chown -R elsearch:elsearch data
```

开机自启

elasticsearch.service

```bash
# /usr/lib/systemd/system/elasticsearch.service
[Unit]
Description=Elastic Search

[Service]
User=elsearch
ExecStart=/usr/local/elasticsearch/v5.6.16/bin/elasticsearch
Restart=always

[Install]
WantedBy=multi-user.target
```


```bash
systemctl start elasticsearch

journalctl -u elasticsearch -f
```

elasticsearch.conf

```bash
server {
    listen 8002;
    server_name localhost;

    location / {

       add_header Access-Control-Allow-Origin * always;
       add_header 'Access-Control-Allow-Credentials' 'true';
       add_header Access-Control-Allow-Methods '*';
       add_header Access-Control-Allow-Headers '*';

       if ($request_method = 'OPTIONS') {
           return 204;
       }

        auth_basic "elastic login auth";
        auth_basic_user_file /usr/local/nginx/.htpasswd;

        proxy_pass http://127.0.0.1:9200;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
```

## Kibana

```bash
# /usr/lib/systemd/system/kibana.service
[Unit]
Description=Elastic Search

[Service]
User=elsearch
ExecStart=/usr/local/kibana/v5.6.16/bin/kibana
Restart=always

[Install]
WantedBy=multi-user.target
```

```
systemctl enable kibana
systemctl is-enabled kibana
systemctl start kibana
journalctl -u kibana -f
```

kibana.conf

```bash
server {
    listen 8001;
    server_name localhost;

    location / {
        auth_basic "kibana login auth";
        auth_basic_user_file /usr/local/nginx/.htpasswd;

        proxy_pass http://127.0.0.1:5601;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

