# 安装ElasticSearch


添加用户组和用户

```bash
$ groupadd elsearch

$ useradd elsearch -g elsearch -s /sbin/nologin

$ id elsearch
```

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
