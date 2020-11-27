# BilibiliInteractiveVideoTree
Bilibili互动视频剧情树获取

示例用法:`getFullTree(/BV(\S+)/.exec(bvid)[1])`

老早以前写的了，不是很好，抱歉...

提供函数:
```
getFullTree(bid,deep=20)
  bid:互动视频的BVID
  deep:最大深度
获取剧情树并输出
```
```
getTree(bid,edgeid)
  bid:互动视频的bvid
  edgeid:指定的分片ID（不指定即为初始树）
获取指定分片的选项
```
```
getInitalState(bid)
  bid:视频的bvid
获取指定视频的InitalState，内包含标题 作者 CID等信息
```
```
getGraphInfo(cid,aid,bvid)
aid与cid在getInitalState获取到的videoData路径下
获取graphinfo
```
```
parseJsonToTree(json)
将GET .../edgeinfo获取到的json转化为程序读取用的json
```
