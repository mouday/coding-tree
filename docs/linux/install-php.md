cat install_php-7.3.27.sh

```bash
#!/bin/bash
mkdir -p /alidata/log/php73
mkdir -p /alidata/server/php73/etc
cd /alidata/server/
if [ ! -f php-7.3.27.tar.gz ];then
  echo '未找到';
  exit;
fi
tar zxvf php-7.3.27.tar.gz
cd php-7.3.27
./configure --prefix=/alidata/server/php73 \
--enable-opcache \
--with-config-file-path=/alidata/server/php73/etc \
--with-mysql=mysqlnd \
--with-mysqli=mysqlnd \
--with-pdo-mysql=mysqlnd \
--enable-fpm \
--enable-fastcgi \
--enable-static \
--enable-inline-optimization \
--enable-sockets \
--enable-wddx \
--enable-zip \
--enable-calendar \
--enable-bcmath \
--enable-soap \
--with-zlib \
--with-iconv \
--with-gd \
--with-xmlrpc \
--enable-mbstring \
--without-sqlite \
--with-curl \
--enable-ftp \
--with-mcrypt  \
--with-freetype-dir=/usr/local/freetype.2.1.10 \
--with-jpeg-dir=/usr/local/jpeg.6 \
--with-png-dir=/usr/local/libpng.1.2.50 \
--with-libzip=/usr/local/libzip-1.3.2 \
--disable-ipv6 \
--disable-debug \
--with-openssl \
--disable-maintainer-zts \
--disable-safe-mode \
--disable-fileinfo


CPU_NUM=$(cat /proc/cpuinfo | grep processor | wc -l)
if [ $CPU_NUM -gt 1 ];then
    make ZEND_EXTRA_LIBS='-liconv' -j$CPU_NUM
else
    make ZEND_EXTRA_LIBS='-liconv'
fi
make install
cd ..
cp ./php-7.3.27/php.ini-production /alidata/server/php73/etc/php.ini
#adjust php.ini
sed -i 's#;extension_dir = \"\.\/\"#extension_dir = "/alidata/server/php73/lib/php/extensions/no-debug-non-zts-20180731/"#'  /alidata/server/php73/etc/php.ini
sed -i 's/post_max_size = 8M/post_max_size = 64M/g' /alidata/server/php73/etc/php.ini
sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 64M/g' /alidata/server/php73/etc/php.ini
sed -i 's/;date.timezone =/date.timezone = PRC/g' /alidata/server/php73/etc/php.ini
sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=1/g' /alidata/server/php73/etc/php.ini
sed -i 's/max_execution_time = 30/max_execution_time = 300/g' /alidata/server/php73/etc/php.ini
#adjust php-fpm
cp /alidata/server/php73/etc/php-fpm.conf.default /alidata/server/php73/etc/php-fpm.conf
sed -i 's,user = nobody,user=www,g'   /alidata/server/php73/etc/php-fpm.conf
sed -i 's,group = nobody,group=www,g'   /alidata/server/php73/etc/php-fpm.conf
sed -i 's,^pm.min_spare_servers = 1,pm.min_spare_servers = 5,g'   /alidata/server/php73/etc/php-fpm.conf
sed -i 's,^pm.max_spare_servers = 3,pm.max_spare_servers = 35,g'   /alidata/server/php73/etc/php-fpm.conf
sed -i 's,^pm.max_children = 5,pm.max_children = 100,g'   /alidata/server/php73/etc/php-fpm.conf
sed -i 's,^pm.start_servers = 2,pm.start_servers = 20,g'   /alidata/server/php73/etc/php-fpm.conf
sed -i 's,;pid = run/php-fpm.pid,pid = run/php-fpm.pid,g'   /alidata/server/php73/etc/php-fpm.conf
sed -i 's,;error_log = log/php-fpm.log,error_log = /alidata/log/php73/php-fpm.log,g'   /alidata/server/php73/etc/php-fpm.conf
sed -i 's,;slowlog = log/$pool.log.slow,slowlog = /alidata/log/php73/\$pool.log.slow,g'   /alidata/server/php73/etc/php-fpm.conf
#self start
install -v -m755 ./php-7.3.27/sapi/fpm/init.d.php-fpm  /etc/init.d/php-fpm73
/etc/init.d/php-fpm73 start
```