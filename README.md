# BilibiliInteractiveVideoTree
Bilibili互动视频剧情树获取

示例用法:`getFullTree(/BV(\S+)/.exec(bvid)[1])`

老早以前写的了，不是很好，抱歉...

你也可以使用这个代码在控制台一键载入BIVT
```javascript
document.body.appendChild((a=document.createElement("script"),a.src="https://cdn.jsdelivr.net/gh/MicroCBer/BilibiliInteractiveVideoTree/bivt_fastload.js",a))
```
或者将下面的链接拉入书签（[Bookmarklet](http://s.ymb.ink/?Bookmarklet)）
[拉我进入书签！](javascript%3A%21%28function%20%28%29%7Bdocument.body.appendChild%28%28a%3Ddocument.createElement%28%22script%22%29%2Ca.src%3D%22https%3A//cdn.jsdelivr.net/gh/MicroCBer/BilibiliInteractiveVideoTree@3/bivt_fastload.js%22%2Ca%29%29%7D%29%28%29)

再或者将如下代码作为网址收藏
```
javascript:!(function (){document.body.appendChild((a=document.createElement("script"),a.src="https://cdn.jsdelivr.net/gh/MicroCBer/BilibiliInteractiveVideoTree@3/bivt_fastload.js",a))})()
```

如果要自己使用，API如下
```
getFullTree(bid,deep=20)
  bid:互动视频的BVID
  deep:最大深度
获取剧情树并输出
```
