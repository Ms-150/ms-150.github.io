# Keytool

JDK (Java Development Kit) 自带的工具，可以用来管理密钥库。这种方法适用于你已经知道签名文件 (`.jks` 或 `.keystore` 文件) 的路径和密码的情况。


## command

```bash
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android


```