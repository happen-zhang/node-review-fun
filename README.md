# node-review #

## 启动服务 ##

```
node server.js
```

## 静态文件服务器 ##

放在`/assets`目录下的文件都可以直接访问到，如 `/assets/images/1.png`：

```
localhost:8005/images/1.png
```

## 简易MVC框架 ##

```
localhost:8006/index/index
```

映射到 `/controllers/index.js` 下的 `get`

# 其它 #

出处：[ping](https://github.com/JacksonTian/ping)
