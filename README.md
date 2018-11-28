# Fake Mail

- PHP 5.5 or later

## Deploy in Tomcat example

- Download php-servlet.jar and JavaBridge.jar and move to <TOMCAT_HOME>/lib

- Edit web.xml in <TOMCAT_HOME>/conf with the following

```
    <listener>
        <listener-class>php.java.servlet.ContextLoaderListener</listener-class>
    </listener>
    <servlet>
        <servlet-name>PhpJavaServlet</servlet-name>
        <servlet-class>php.java.servlet.PhpJavaServlet</servlet-class>
    </servlet>
    <servlet>
        <servlet-name>PhpCGIServlet</servlet-name>
        <servlet-class>php.java.servlet.fastcgi.FastCGIServlet</servlet-class>
        <init-param><param-name>prefer_system_php_exec</param-name><param-value>On</param-value></init-param>
        <init-param><param-name>php_include_java</param-name><param-value>Off</param-value></init-param>
    </servlet>
    <servlet-mapping>
        <servlet-name>PhpJavaServlet</servlet-name><url-pattern>*.phpjavabridge</url-pattern>
    </servlet-mapping>
    <servlet-mapping>
        <servlet-name>PhpCGIServlet</servlet-name><url-pattern>*.php</url-pattern>
    </servlet-mapping>
```

- Drop FakeMail folder into <TOMCAT_HOME>/webapps