"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(e){function n(o){if(t[o])return t[o].exports;var i=t[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var t={};n.m=e,n.c=t,n.p="",n(0)}([function(e,n,t){var o=t(1),i=t(2);window.addEventListener("DOMContentLoaded",function(){o.share(),o.request(i.getResUrl()+"/zs/usr/queryBank/v2_0",{openId:o.getOpenId(),signature:"1",deviceType:"wx",edition:"1.1"},function(e){e=e.respData,$(".bank").html(e.receviceBank),$(".num").html(e.bankNo),$(".count").html(e.availableAmountNl),s=e.availableAmountNl}),$("#subbtn").click(function(){var e=$("#cash").val();if(null==e||"undefind"==e||""==e)o.tost("请填写提现金额",1e3);else if(e.match(/^[0-9]*[1-9][0-9]*$/))if(e<=s){var n=$(".num").html();n=n.substring(15),o.request(i.getResUrl()+"/zs/usr/enchashmentc/v2_0",{openId:o.getOpenId(),signature:"1",deviceType:"wx",edition:"1.1",amount:e,cardNo:n},function(e){1==e.respCode?(o.createDefaultBtn(document.getElementById("body"),"../img/2.0/3.png","您的提现申请已提交。","预计3个工作日到账，请您耐心等待。","goToBtn","完成","&#xe6df;"),$(".default-box").on("click","#goToBtn",function(){window.location.href="commissionPage.html"})):(o.createDefaultBtn(document.getElementById("body"),"../img/2.0/3.png","提现申请未能成功提交","可能由于网络问题，或者您在多个设备上操作的原因。请返回重新操作。","goToBtn","重新提交","&#xe679;"),$(".default-box").on("click","#goToBtn",function(){window.location.href=window.location.href}))})}else o.tost("输入金额超过可提现佣金余额",1e3);else o.tost("请填写大于零的整数",1e3)}),function(e){$("#"+e).keyup(function(){this.value=this.value.replace(/[^\d.]/g,""),this.value=this.value.replace(/^\./g,""),this.value=this.value.replace(/\.{2,}/g,"."),this.value=this.value.replace(".","$#$").replace(/\./g,"").replace("$#$","."),this.value=this.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,"$1$2.$3")})}("cash")});var s},function(e,n){e.exports={slt:function(e){return/^#(\w)+$/.test(e)?document.querySelector(e):document.querySelectorAll(e)},getOpenId:function(){return localStorage.getItem("openId")||!1},publicData:function(){return{signature:"1",openId:this.getOpenId()}},forLoadHref:function(e){var n="";if("string"==typeof e)return n;for(var t in e)n+=e[t]instanceof Array?t+"=["+e[t].join(",")+"]":t+"="+e[t]+"&";return n},getPathPt:function(){var e=-1!=location.href.indexOf("openId")?"":"&openId="+this.getOpenId(),n="",t="";if(-1!=(n=-1!=location.href.indexOf("?")?location.href+"&signature=1"+e:location.href+"?signature=1"+e).indexOf("?")){var o="";n.split("?")[1].split("&").forEach(function(e,n){var t=e.split("=")[0],i=e.split("=")[1];o+='"'+t+'":"'+i+'",'}),o=o.slice(0,o.length-1),o="{"+o+"}",t=JSON.parse(o)}return t.openId&&localStorage.getItem("openId")!=t.openId&&localStorage.setItem("openId",t.openId),console.log("地址栏参数:"),console.log(t),t},createDefault:function(e,n,t,o,i,s){var a;a=s?'<div class="default-msg"><i class="half"></i><div class="default-box"><i class="iconfont f-theme">'+(s||" ")+'</i><p class="f-666">'+t+'</p><p class="f-blue" id="'+(o||" ")+'">'+(i||" ")+'<i class="icon iconfont f-15">&#xe676;</i></p></div></div>':o?'<div class="default-msg"><i class="half"></i><div class="default-box"><img src="'+n+'" /><p class="f-666">'+t+'</p><p class="f-blue" id="'+(o||" ")+'">'+(i||" ")+'<i class="icon iconfont f-15">&#xe676;</i></p></div></div>':'<div class="default-msg"><i class="half"></i><div class="default-box"><img src="'+n+'" /><p class="fcA3">'+t+"</p></div></div>",e.innerHTML=a},createDefaultBtn:function(e,n,t,o,i,s,a){var l;l=a?'<div class="default-msg"><i class="half"></i><div class="default-box"><i class="iconfont f-theme">'+(a||" ")+'</i><p class="f-theme">'+t+'</p><p class="f-666 mt10">'+o+'</p><p class="f-blue-btn" id="'+(i||" ")+'">'+(s||" ")+"</p></div></div>":i?'<div class="default-msg blue-btn"><i class="half"></i><div class="default-box"><img src="'+n+'" /><p class="f-theme">'+t+'</p><p class="f-666 mt10">'+o+'</p><p class="f-blue-btn" id="'+(i||" ")+'">'+(s||" ")+"</p></div></div>":'<div class="default-msg"><i class="half"></i><div class="default-box"><img src="'+n+'" /><p class="f-666">'+t+"</p></div></div>",e.innerHTML=l},request:function(e,n,t,o,i,s){var a={type:"POST",url:e||"",async:"true",data:n||null},l=new XMLHttpRequest;i&&(l.responseType=a.dataType),l.open(a.type,a.url,a.async),l.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),l.send(function(e){if("object"===(void 0===e?"undefined":_typeof(e))){var n="";for(var t in e)n+=t+"="+e[t]+"&";return n=n.substring(0,n.length-1)}return e}(a.data)),console.log("接口需求参数:"),console.log(a.data),l.onreadystatechange=function(){4==l.readyState&&(200==l.status?(t("string"==typeof l.response?JSON.parse(l.response):l.response),console.log("接口返回参数:"),console.log(l.response)):o())}},requestFile:function(e,n,t,o,i,s){var a=new XMLHttpRequest;i&&(a.responseType=dataType),a.open("POST",e,"true"),s&&a.setRequestHeader("Content-Type",s),a.send(n),console.log("接口需求参数:"),console.log(n),a.onreadystatechange=function(){4==a.readyState&&(200==a.status?(t("string"==typeof a.response?JSON.parse(a.response):a.response),console.log("接口返回参数:"),console.log(a.response)):o())}},loadingDone:function(){document.getElementById("loader_box")&&(document.getElementById("loader_box").outerHTML=" ")},hideShow:function(e){(e=e||document.body).classList.remove("transition-hide"),e.classList.add("transition-show")},winload:function(){!function(){function e(){WeixinJSBridge.invoke("setFontSizeCallback",{fontSize:0}),WeixinJSBridge.on("menu:setfont",function(){WeixinJSBridge.invoke("setFontSizeCallback",{fontSize:0})})}"object"==("undefined"==typeof WeixinJSBridge?"undefined":_typeof(WeixinJSBridge))&&"function"==typeof WeixinJSBridge.invoke?e():document.addEventListener?document.addEventListener("WeixinJSBridgeReady",e,!1):document.attachEvent&&(document.attachEvent("WeixinJSBridgeReady",e),document.attachEvent("onWeixinJSBridgeReady",e))}(),function(){for(var e=document.getElementsByClassName("layer"),n=0,t=e.length;n<t;n++)e[n].addEventListener("touchmove",function(e){e.stopPropagation()})}()}(),is_weixin:function(){var e=navigator.userAgent.toLowerCase();return console.log(e),"micromessenger"==e.match(/MicroMessenger/i)},tost:function(e,n){var t=document.getElementById("tost_"),o=document.getElementById("tost_").firstElementChild,i=document.createElement("span");i.innerHTML=e,t.appendChild(i),o?(t.removeChild(o),t.appendChild(i),t.classList.remove("mui-hidden"),t.classList.add("mui-block"),setTimeout(function(){t.classList.add("mui-hidden"),t.classList.remove("mui-block")},n)):(t.classList.remove("mui-hidden"),t.classList.add("mui-block"),setTimeout(function(){t.classList.add("mui-hidden"),t.classList.remove("mui-block")},n))},share:function(){var e=location.href.split("#")[0],n={url:encodeURIComponent(e)};this.request("https://loan.moneytocar.com/yuedianqian-wap/getJsSdkconfig",n,function(e){wx.config({debug:!1,appId:e.respMap.appId,timestamp:e.respMap.timestamp,nonceStr:e.respMap.noncestr,signature:e.respMap.signature,jsApiList:["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","hideMenuItems"]})},function(){}),wx.ready(function(){wx.hideMenuItems({menuList:["menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:facebook","menuItem:share:QZone"],success:function(e){}}),wx.onMenuShareTimeline({title:"曰点钱——更值得信赖的车辆抵押贷款",link:location.origin+"/yuedianqian/html/borrowingDemand.html",imgUrl:location.origin+"/yuedianqian/img/logo.png",success:function(){},cancel:function(){}}),wx.onMenuShareAppMessage({title:"曰点钱——更值得信赖的车辆抵押贷款",desc:"你的车比你想象的更值钱",link:location.origin+"/yuedianqian/html/borrowingDemand.html",imgUrl:location.origin+"/yuedianqian/img/logo.png",type:"link"}),wx.error(function(e){})})}}},function(e,n){e.exports={path:"http://192.168.1.96:3000"}}]);