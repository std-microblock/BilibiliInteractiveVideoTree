
!(async function () {

  function translate (str) {
    let meanings = { "\\&\\&": "且", "\\|\\|": "或" }
    for (let i of hiddenVar)
      str = str.replace(new RegExp(i.id_v2.split("$").pop(), "g"), i.name).replace(/\$/g, "")

    for (let i in meanings)
      str = str.replace(new RegExp(i, "g"), meanings[i])
    return str
  }

  async function getInitalTree (bid) {
    let response = await fetch("https://api.bilibili.com/x/stein/edgeinfo_v2?bvid=BV" + bid + "&graph_version=" + graphinfo + "&platform=pc&portal=0&screen=0&choices=");
    let json = await response.json();
    return { raw: json, parsed: parseJsonToTree(json) };
  }

  async function getGraphInfo (cid, aid, bid) {
    let response = await fetch("https://api.bilibili.com/x/player.so?id=cid%3A" + cid + "&aid=" + aid + "&bvid=BV" + bid + "&buvid=EFBAAAA5-EDF4-480B-ADB9-FCAF2CF1546653916infoc");
    return JSON.parse((await response.text()).split("<interaction>")[1].split("</interaction>")[0]).graph_version;
  }

  async function getInitalState (bid) {
    let response = await fetch("https://www.bilibili.com/video/BV" + bid);
    let htmlTxt = await response.text();
    return JSON.parse(htmlTxt.split('window.__INITIAL_STATE__=')[1].split(';(function(){var s;(s=document.currentScript||document.scripts[document')[0]);
  }


  async function getTree (bid, edgeid = -1) {
    if (edgeid == -1)
      return (await getInitalTree(bid));
    else {
      let response = await(await fetch("https://api.bilibili.com/x/stein/edgeinfo_v2?bvid=BV" + bid + "&edge_id=" + edgeid + "&graph_version=" + graphinfo + "&platform=pc&portal=0&screen=0&choices=")).json();
      return {parsed:parseJsonToTree(response),raw:response};
    }
  }



  async function getFullTree (bid, deep = 20) {
    let initaltree = await getInitalState(bid);
    graphinfo = await getGraphInfo(initaltree.videoData.cid, initaltree.videoData.aid, initaltree.videoData.bvid.replace("BV", ""));
    console.log(initaltree.videoData.title);
    hiddenVar = (await getInitalTree(bid)).raw.data.hidden_vars;
    console.log(hiddenVar)
    async function getTreeDG (bid, edgeid, deepNow, eList = []) {
      if (deepNow <= 0) return;
      if (eList.includes(edgeid)) return 0;
      let raw = await getTree(bid, edgeid),a=raw.parsed;
      if(a.length==0)return true
      for (var y = 0; y < a.length; y++) {
        let item = a[y];
        for (var x = 0; x < item.length; x++) {
          let itemF = item[x];
          eList.push(edgeid);
          console.log("    ".repeat(deep - deepNow) + "-" + itemF.description);//,itemF.action,itemF.condition,itemF.raw
          if (itemF.action != "") console.log("    ".repeat(deep - deepNow) + " | 选择后：" + translate(itemF.action))
          if (itemF.condition != "") console.log("    ".repeat(deep - deepNow) + " | 出现条件：" + translate(itemF.condition))
          if((await getTreeDG(bid, itemF.pid, deepNow - 1, eList))){
            //if is end
            console.log("    ".repeat(deep - deepNow) + " | [预览] "+await getViewUrl("BV"+bid,itemF.cid),itemF.cid)
          }
          eList.pop();
        }
      }
    }
    getTreeDG(bid, -1, deep);
  }
  async function getViewUrl (bid, cid) {
try{
let a="https:"+((await (await fetch("https://api.bilibili.com/x/player/videoshot?cid=" + cid + "&bvid=" + bid, {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "zh-CN,zh;q=0.9,zh-TW;q=0.8,en-US;q=0.7,en;q=0.6",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
      },
      "referrer": "https://www.bilibili.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    })).json()).data.image.pop())
    return a
}catch{
return "暂无"
}
  }
  function parseJsonToTree (json) {
    try {
      var treeJson = [];
      json.data.edges.questions.forEach((item, index) => {
        var aTree = [];
        item.choices.forEach((choice, choiceIndex) => {
          aTree.push({ id: choiceIndex, cid: choice.cid, pid: choice.id, description: choice.option, raw: choice, action: choice.native_action, condition: choice.condition });
        })
        treeJson.push(aTree);
      })
      return treeJson;
    } catch {
      return [];
    }
  }
  getFullTree(/BV(\S+)/.exec(bvid)[1]);
})()
