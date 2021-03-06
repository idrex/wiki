## 证书说明

### IOS 证书

Bundle ID为应用域名反写

#### CSR 文件生成

- Mac系统生成的授权文件
- 打开钥匙串访问：证书助理 -> 从证书颁发机构请求证书
- 输入开发者电子邮件，并存储到磁盘
- 生成 `CertificateSigningRequest.certSigningRequest` 文件并保存

#### 证书 Certificates

- 依赖 CSR 文件，需要提前生成
- 针对开发者账户的权限说明
- 选择`iOS App Development`是创建开发者证书
- 选择`iOS Distribution (App Store and Ad Hoc)`是创建发布证书
- 生成`xxx.cer`文件为证书文件

#### 身份证 Identifiers

- 针对应用创建相关信息(Bundle ID)

#### 设备 Devices

#### 描述文件 Profiles

#### 备注

- `Universal Link`通过打开一个Https链接来直接启动您的客户端应用 http://wiki.mob.com/moblink-universal-link-doc/

- 删除证书和描述文件对已经上线的 app 没有影响

### Android 证书

应用包名为应用域名反写

#### 安装 JRE 环境

- 需要安装 Java 安装包

#### 生成签名证书

生成签名证书
使用 keytool -genkey 命令生成证书：

```bash
keytool -genkey -alias testalias -keyalg RSA -keysize 2048 -validity 36500 -keystore test.keystore
```

- testalias 是证书别名，可修改为自己想设置的字符，建议使用英文字母和数字
- test.keystore 是证书文件名称，可修改为自己想设置的文件名称
  回车后会提示：

```bash
Enter keystore password:  //输入证书文件密码，输入完成回车
Re-enter new password:   //再次输入证书文件密码，输入完成回车
What is your first and last name?
  [Unknown]:  //输入名字和姓氏，输入完成回车
What is the name of your organizational unit?
  [Unknown]:  //输入组织单位名称，输入完成回车
What is the name of your organization?
  [Unknown]:  //输入组织名称，输入完成回车
What is the name of your City or Locality?
  [Unknown]:  //输入城市或区域名称，输入完成回车
What is the name of your State or Province?
  [Unknown]:  //输入省/市/自治区名称，输入完成回车
What is the two-letter country code for this unit?
  [Unknown]:  //输入国家/地区代号（两个字母），中国为CN，输入完成回车
Is CN=XX, OU=XX, O=XX, L=XX, ST=XX, C=XX correct?
  [no]:  //确认上面输入的内容是否正确，输入y，回车

Enter key password for <testalias>
        (RETURN if same as keystore password):  //确认证书密码与证书文件密码一样（HBuilder|HBuilderX要求这两个密码一致），直接回车就可以
以上命令运行完成后就会生成证书，路径为“D:\test.keystore”。
```

可以使用以下命令查看证书信息：
```bash
keytool -list -v -keystore test.keystore
Enter keystore password: //输入密码，回车
```
生成的证书指纹里MD5信息为应用签名，需要进行处理（去掉冒号，转小写）


## 上架说明
注册地址： https://appstoreconnect.apple.com
参考链接： http://newdocx.appcan.cn/dev-guide/ios-dev-appStore
