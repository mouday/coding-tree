# email

区别：
- STMP发送邮件
- POP接收邮件，客户端的操作【不会同步】到服务器
- IMAP接收邮件，客户端的操作【会同步】到服务器

## STMP


## POP



## IMAP

IMAP，即Internet Message Access Protocol（互联网邮件访问协议）

删除邮件示例

```python
import imaplib
import email

def main():
    host = 'imap.exmail.qq.com'
    user = 'xxx'
    password = 'xxx'

    # 连接到IMAP服务器
    with imaplib.IMAP4_SSL(host) as mail:
        mail.login(user, password)
        print('login')

        # 查看目录结构
        _, data = mail.list()
        print(data)

        # 选择收件箱
        mail.select('INBOX')
        print('select')

        for i in range(90):
            # 查找邮件
            status, messages = mail.uid('SEARCH', None, 'ALL')
            print(len(messages[0].split()))

            if status != "OK":
                raise Exception('status: {status}'.format(status=status))

            # 检索邮件ID并删除
            count = 0
            for uid in messages[0].split():
                count += 1
                if count > 100:
                    break

                print(f"count: {count}, mail_id: {uid}")
                status, data = mail.uid('FETCH', uid, '(RFC822)')
                if status != "OK":
                    raise Exception('status: {status}'.format(status=status))

                msg = email.message_from_bytes(data[0][1])
                msg_charset = email.header.decode_header(msg.get('Subject'))[0][1]
                subject = email.header.decode_header(msg.get('Subject'))[0][0].decode(msg_charset)
                print("delete: ", subject)

                mail.uid('STORE', uid, '+FLAGS', '\\Deleted')
                print(f"Successfully marked email with ID: {uid} for deletion")

            # 永久删除邮件
            mail.expunge()
            print("Selected emails deleted successfully.")


if __name__ == '__main__':
    main()
```

参考

阿里邮箱IMAP场景示例：彻底删除指定文件夹内的邮件
https://help.aliyun.com/document_detail/2709934.html