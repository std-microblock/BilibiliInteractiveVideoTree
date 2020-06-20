let graphinfo=1000000,edgeidList=[]

async function getInitalTree(bid) {
    let response=await fetch("https://api.bilibili.com/x/stein/edgeinfo_v2?bvid=BV" + bid + "&graph_version="+graphinfo+"&platform=pc&portal=0&screen=0&choices=")
    let json=await response.json() 
    return parseJsonToTree(json)

}

async function getGraphInfo(cid,aid,bid){
    let response=await fetch("https://api.bilibili.com/x/player.so?id=cid%3A"+cid+"&aid="+aid+"&bvid=BV"+bid+"&buvid=EFBAAAA5-EDF4-480B-ADB9-FCAF2CF1546653916infoc");
    return JSON.parse((await response.text()).split("<interaction>")[1].split("</interaction>")[0]).graph_version
}

async function getInitalState(bid){
    let response=await fetch("https://www.bilibili.com/video/BV"+bid);
    let htmlTxt=await response.text()
    return JSON.parse(htmlTxt.split('window.__INITIAL_STATE__=')[1].split(';(function(){var s;(s=document.currentScript||document.scripts[document')[0])
}


async function getTree(bid, edgeid = -1) {
    if (edgeid == -1)
        return getInitalTree(bid)
    else {
        let response=await fetch("https://api.bilibili.com/x/stein/edgeinfo_v2?bvid=BV" + bid + "&edge_id=" + edgeid + "&graph_version="+graphinfo+"&platform=pc&portal=0&screen=0&choices=")
        return parseJsonToTree(await response.json())
    }
}



async function getFullTree(bid,deep=20){
    let initaltree=await getInitalState(bid)
    console.log(initaltree.videoData.title)
    graphinfo=await getGraphInfo(initaltree.videoData.cid,initaltree.videoData.aid,initaltree.videoData.bvid.replace("BV",""))
    
    async function getTreeDG(bid,edgeid,deepNow){
        if(deepNow<=0)return ;
        if(edgeidList.includes(edgeid))return 0;
        edgeidList.push(edgeid)
        let a=await getTree(bid,edgeid)
        for(var y=0;y<a.length;y++){
            let item=a[y]
            for(var x=0;x<item.length;x++){
                let itemF=item[x]
                console.log("    ".repeat(deep-deepNow)+"-"+itemF.description)
                await getTreeDG(bid,itemF.pid,deepNow-1)
            }
               
         
        }
        
    }
    
    getTreeDG(bid,-1,deep)
}

function parseJsonToTree(json) {
    try{
    var treeJson=[];
    json.data.edges.questions.forEach((item,index)=>{
        var aTree=[];
        item.choices.forEach((choice,choiceIndex)=>{
            aTree.push({id:choiceIndex,cid:choice.cid,pid:choice.id,description:choice.option});
        })
        treeJson.push(aTree)
    })
    return treeJson;}catch{
        return [];
    }
}