"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){function t(s){if(n[s])return n[s].exports;var i=n[s]={exports:{},id:s,loaded:!1};return e[s].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){var s=n(1),i=n(2);s.share(),window.onload=function(){var e=s.getPathPt(),t=e.openId||s.getOpenId();if(t){var n={tid:e.tid,openId:t,signature:e.signature};s.request(i.getResUrl()+"/zs/customer/queryCustLoanDetail/V2_0",n,function(e){if(1==e.respCode){s.slt("#user_info").innerHTML='<div class="list-head">推荐信息</div><li>申请时间<span class="fr">'+(e.respData.createDateStr||"")+'</span></li><li>姓名<span class="fr">'+(e.respData.name||"")+'</span></li><li>手机号<span class="fr">'+(e.respData.cellphone||"")+'</span></li><li>车辆名称<span class="fr">'+(e.respData.vmodel||"")+"</span></li>";var t="";t="-"!=e.respData.prePkgAmountStr?"-"!=e.respData.actPkgAmountStr?'推荐佣金(元)<span class="fr">'+(e.respData.actPkgAmountStr||"")+'</span><p class="text-right hidden">预计可获得 '+(e.respData.prePkgAmountStr||"")+"元，请等待业务完成后确认</p>":'推荐佣金(元)<span class="fr">还没计算出来哦</span><p class="text-right f-grey mt10">预计可获得 '+(e.respData.prePkgAmountStr||"")+"元，请等待业务完成后确认</p>":'推荐佣金(元)<span class="fr f-grey">还没计算出来哦</span><p class="text-right f-grey mt10">预计可获得 '+(e.respData.prePkgAmountStr||"")+"元，请等待业务完成后确认</p>",s.slt("#commission").innerHTML=t,e.respData.ydqCustRecords instanceof Array&&e.respData.ydqCustRecords.length>0?e.respData.ydqCustRecords.forEach(function(e,t){var n=document.createElement("li");n.innerHTML='<i class="point"></i>'+(e.orderState||"")+'<span class="fr f-grey">'+(e.recordDate||"")+"</span>",s.slt("#business_info").appendChild(n)}):s.slt("#business_info").innerHTML='<div class="list-head">业务进展</div><li><i class="point"></i>目前尚无业务进度信息<span class="fr f-grey"></span></li>'}else s.tost("数据请求错误,请稍后再试")})}}},function(e,t){e.exports={slt:function(e){return/^#(\w)+$/.test(e)?document.querySelector(e):document.querySelectorAll(e)},getOpenId:function(){return localStorage.getItem("openId")||!1},publicData:function(){return{signature:"1",openId:this.getOpenId()}},forLoadHref:function(e){var t="";if("string"==typeof e)return t;for(var n in e)t+=e[n]instanceof Array?n+"=["+e[n].join(",")+"]":n+"="+e[n]+"&";return t},getPathPt:function(){var e=-1!=location.href.indexOf("openId")?"":"&openId="+this.getOpenId(),t="",n="";if(-1!=(t=-1!=location.href.indexOf("?")?location.href+"&signature=1"+e:location.href+"?signature=1"+e).indexOf("?")){var s="";t.split("?")[1].split("&").forEach(function(e,t){var n=e.split("=")[0],i=e.split("=")[1];s+='"'+n+'":"'+i+'",'}),s=s.slice(0,s.length-1),s="{"+s+"}",n=JSON.parse(s)}return n.openId&&localStorage.getItem("openId")!=n.openId&&localStorage.setItem("openId",n.openId),console.log("地址栏参数:"),console.log(n),n},createDefault:function(e,t,n,s,i,o){var a;a=o?'<div class="default-msg"><i class="half"></i><div class="default-box"><i class="iconfont f-theme">'+(o||" ")+'</i><p class="f-666">'+n+'</p><p class="f-blue" id="'+(s||" ")+'">'+(i||" ")+'<i class="icon iconfont f-15">&#xe676;</i></p></div></div>':s?'<div class="default-msg"><i class="half"></i><div class="default-box"><img src="'+t+'" /><p class="f-666">'+n+'</p><p class="f-blue" id="'+(s||" ")+'">'+(i||" ")+'<i class="icon iconfont f-15">&#xe676;</i></p></div></div>':'<div class="default-msg"><i class="half"></i><div class="default-box"><img src="'+t+'" /><p class="fcA3">'+n+"</p></div></div>",e.innerHTML=a},createDefaultBtn:function(e,t,n,s,i,o,a){var r;r=a?'<div class="default-msg"><i class="half"></i><div class="default-box"><i class="iconfont f-theme">'+(a||" ")+'</i><p class="f-theme">'+n+'</p><p class="f-666 mt10">'+s+'</p><p class="f-blue-btn" id="'+(i||" ")+'">'+(o||" ")+"</p></div></div>":i?'<div class="default-msg blue-btn"><i class="half"></i><div class="default-box"><img src="'+t+'" /><p class="f-theme">'+n+'</p><p class="f-666 mt10">'+s+'</p><p class="f-blue-btn" id="'+(i||" ")+'">'+(o||" ")+"</p></div></div>":'<div class="default-msg"><i class="half"></i><div class="default-box"><img src="'+t+'" /><p class="f-666">'+n+"</p></div></div>",e.innerHTML=r},request:function(e,t,n,s,i,o){var a={type:"POST",url:e||"",async:"true",data:t||null},r=new XMLHttpRequest;i&&(r.responseType=a.dataType),r.open(a.type,a.url,a.async),r.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),r.send(function(e){if("object"===(void 0===e?"undefined":_typeof(e))){var t="";for(var n in e)t+=n+"="+e[n]+"&";return t=t.substring(0,t.length-1)}return e}(a.data)),console.log("接口需求参数:"),console.log(a.data),r.onreadystatechange=function(){4==r.readyState&&(200==r.status?(n("string"==typeof r.response?JSON.parse(r.response):r.response),console.log("接口返回参数:"),console.log(r.response)):s())}},requestFile:function(e,t,n,s,i,o){var a=new XMLHttpRequest;i&&(a.responseType=dataType),a.open("POST",e,"true"),o&&a.setRequestHeader("Content-Type",o),a.send(t),console.log("接口需求参数:"),console.log(t),a.onreadystatechange=function(){4==a.readyState&&(200==a.status?(n("string"==typeof a.response?JSON.parse(a.response):a.response),console.log("接口返回参数:"),console.log(a.response)):s())}},loadingDone:function(){document.getElementById("loader_box")&&(document.getElementById("loader_box").outerHTML=" ")},hideShow:function(e){(e=e||document.body).classList.remove("transition-hide"),e.classList.add("transition-show")},winload:function(){!function(){function e(){WeixinJSBridge.invoke("setFontSizeCallback",{fontSize:0}),WeixinJSBridge.on("menu:setfont",function(){WeixinJSBridge.invoke("setFontSizeCallback",{fontSize:0})})}"object"==("undefined"==typeof WeixinJSBridge?"undefined":_typeof(WeixinJSBridge))&&"function"==typeof WeixinJSBridge.invoke?e():document.addEventListener?document.addEventListener("WeixinJSBridgeReady",e,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",e),document.attachEvent("onWeixinJSBridgeReady",e))}(),function(){for(var e=document.getElementsByClassName("layer"),t=0,n=e.length;t<n;t++)e[t].addEventListener("touchmove",function(e){e.stopPropagation()})}()}(),is_weixin:function(){var e=navigator.userAgent.toLowerCase();return console.log(e),"micromessenger"==e.match(/MicroMessenger/i)},tost:function(e,t){var n=document.getElementById("tost_"),s=document.getElementById("tost_").firstElementChild,i=document.createElement("span");i.innerHTML=e,n.appendChild(i),s?(n.removeChild(s),n.appendChild(i),n.classList.remove("mui-hidden"),n.classList.add("mui-block"),setTimeout(function(){n.classList.add("mui-hidden"),n.classList.remove("mui-block")},t)):(n.classList.remove("mui-hidden"),n.classList.add("mui-block"),setTimeout(function(){n.classList.add("mui-hidden"),n.classList.remove("mui-block")},t))},share:function(){var e=location.href.split("#")[0],t={url:encodeURIComponent(e)};this.request("https://loan.moneytocar.com/yuedianqian-wap/getJsSdkconfig",t,function(e){wx.config({debug:!1,appId:e.respMap.appId,timestamp:e.respMap.timestamp,nonceStr:e.respMap.noncestr,signature:e.respMap.signature,jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","hideMenuItems"]})},function(){}),wx.ready(function(){wx.hideMenuItems({menuList:["menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"],success:function(e){}}),wx.onMenuShareTimeline({title:"曰点钱——更值得信赖的车辆抵押贷款",link:location.origin+"/yuedianqian/html/borrowingDemand.html",imgUrl:location.origin+"/yuedianqian/img/logo.png",success:function(){},cancel:function(){}}),wx.onMenuShareAppMessage({title:"曰点钱——更值得信赖的车辆抵押贷款",desc:"你的车比你想象的更值钱",link:location.origin+"/yuedianqian/html/borrowingDemand.html",imgUrl:location.origin+"/yuedianqian/img/logo.png",type:"link"}),wx.error(function(e){})})}}},function(e,t){e.exports={path:"http://192.168.1.96:3000"}}]);