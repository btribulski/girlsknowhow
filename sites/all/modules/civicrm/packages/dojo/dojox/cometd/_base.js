/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/book/dojo-book-0-9/introduction/licensing
*/


if(!dojo._hasResource["dojox.cometd._base"]){
dojo._hasResource["dojox.cometd._base"]=true;
dojo.provide("dojox.cometd._base");
dojo.require("dojo.AdapterRegistry");
dojo.require("dojo.io.script");
dojox.cometd=new function(){
this.DISCONNECTED="DISCONNECTED";
this.CONNECTING="CONNECTING";
this.CONNECTED="CONNECTED";
this.DISCONNECTING="DISCONNECING";
this._initialized=false;
this._connected=false;
this._polling=false;
this.expectedNetworkDelay=5000;
this.connectTimeout=0;
this.connectionTypes=new dojo.AdapterRegistry(true);
this.version="1.0";
this.minimumVersion="0.9";
this.clientId=null;
this.messageId=0;
this.batch=0;
this._isXD=false;
this.handshakeReturn=null;
this.currentTransport=null;
this.url=null;
this.lastMessage=null;
this._messageQ=[];
this.handleAs="json-comment-optional";
this._advice={};
this._backoffInterval=0;
this._backoffIncrement=1000;
this._backoffMax=60000;
this._deferredSubscribes={};
this._deferredUnsubscribes={};
this._subscriptions=[];
this._extendInList=[];
this._extendOutList=[];
this.state=function(){
return this._initialized?(this._connected?"CONNECTED":"CONNECTING"):(this._connected?"DISCONNECTING":"DISCONNECTED");
};
this.init=function(_1,_2,_3){
_2=_2||{};
_2.version=this.version;
_2.minimumVersion=this.minimumVersion;
_2.channel="/meta/handshake";
_2.id=""+this.messageId++;
this.url=_1||dojo.config["cometdRoot"];
if(!this.url){
console.debug("no cometd root specified in djConfig and no root passed");
return null;
}
var _4="^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$";
var _5=(""+window.location).match(new RegExp(_4));
if(_5[4]){
var _6=_5[4].split(":");
var _7=_6[0];
var _8=_6[1]||"80";
_5=this.url.match(new RegExp(_4));
if(_5[4]){
_6=_5[4].split(":");
var _9=_6[0];
var _a=_6[1]||"80";
this._isXD=((_9!=_7)||(_a!=_8));
}
}
if(!this._isXD){
if(_2.ext){
if(_2.ext["json-comment-filtered"]!==true&&_2.ext["json-comment-filtered"]!==false){
_2.ext["json-comment-filtered"]=true;
}
}else{
_2.ext={"json-comment-filtered":true};
}
_2.supportedConnectionTypes=dojo.map(this.connectionTypes.pairs,"return item[0]");
}
_2=this._extendOut(_2);
var _b={url:this.url,handleAs:this.handleAs,content:{"message":dojo.toJson([_2])},load:dojo.hitch(this,function(_c){
this._backon();
this._finishInit(_c);
}),error:dojo.hitch(this,function(e){
console.debug("handshake error!:",e);
this._backoff();
this._finishInit([{}]);
})};
if(_3){
dojo.mixin(_b,_3);
}
this._props=_2;
for(var _e in this._subscriptions){
for(var _f in this._subscriptions[_e]){
if(this._subscriptions[_e][_f].topic){
dojo.unsubscribe(this._subscriptions[_e][_f].topic);
}
}
}
this._messageQ=[];
this._subscriptions=[];
this._initialized=true;
this.batch=0;
this.startBatch();
var r;
if(this._isXD){
_b.callbackParamName="jsonp";
r=dojo.io.script.get(_b);
}else{
r=dojo.xhrPost(_b);
}
dojo.publish("/cometd/meta",[{cometd:this,action:"handshake",successful:true,state:this.state()}]);
return r;
};
this.publish=function(_11,_12,_13){
var _14={data:_12,channel:_11};
if(_13){
dojo.mixin(_14,_13);
}
this._sendMessage(_14);
};
this.subscribe=function(_15,_16,_17,_18){
_18=_18||{};
if(_16){
var _19="/cometd"+_15;
var _1a=this._subscriptions[_19];
if(!_1a||_1a.length==0){
_1a=[];
_18.channel="/meta/subscribe";
_18.subscription=_15;
this._sendMessage(_18);
var _ds=this._deferredSubscribes;
if(_ds[_15]){
_ds[_15].cancel();
delete _ds[_15];
}
_ds[_15]=new dojo.Deferred();
}
for(var i in _1a){
if(_1a[i].objOrFunc===_16&&(!_1a[i].funcName&&!_17||_1a[i].funcName==_17)){
return null;
}
}
var _1d=dojo.subscribe(_19,_16,_17);
_1a.push({topic:_1d,objOrFunc:_16,funcName:_17});
this._subscriptions[_19]=_1a;
}
var ret=this._deferredSubscribes[_15]||{};
ret.args=dojo._toArray(arguments);
return ret;
};
this.unsubscribe=function(_1f,_20,_21,_22){
if((arguments.length==1)&&(!dojo.isString(_1f))&&(_1f.args)){
return this.unsubscribe.apply(this,_1f.args);
}
var _23="/cometd"+_1f;
var _24=this._subscriptions[_23];
if(!_24||_24.length==0){
return null;
}
var s=0;
for(var i in _24){
var sb=_24[i];
if((!_20)||(sb.objOrFunc===_20&&(!sb.funcName&&!_21||sb.funcName==_21))){
dojo.unsubscribe(_24[i].topic);
delete _24[i];
}else{
s++;
}
}
if(s==0){
_22=_22||{};
_22.channel="/meta/unsubscribe";
_22.subscription=_1f;
delete this._subscriptions[_23];
this._sendMessage(_22);
this._deferredUnsubscribes[_1f]=new dojo.Deferred();
if(this._deferredSubscribes[_1f]){
this._deferredSubscribes[_1f].cancel();
delete this._deferredSubscribes[_1f];
}
}
return this._deferredUnsubscribes[_1f];
};
this.disconnect=function(){
for(var _28 in this._subscriptions){
for(var sub in this._subscriptions[_28]){
if(this._subscriptions[_28][sub].topic){
dojo.unsubscribe(this._subscriptions[_28][sub].topic);
}
}
}
this._subscriptions=[];
this._messageQ=[];
if(this._initialized&&this.currentTransport){
this._initialized=false;
this.currentTransport.disconnect();
}
if(!this._polling){
this._connected=false;
dojo.publish("/cometd/meta",[{cometd:this,action:"connect",successful:false,state:this.state()}]);
}
this._initialized=false;
dojo.publish("/cometd/meta",[{cometd:this,action:"disconnect",successful:true,state:this.state()}]);
};
this.subscribed=function(_2a,_2b){
};
this.unsubscribed=function(_2c,_2d){
};
this.tunnelInit=function(_2e,_2f){
};
this.tunnelCollapse=function(){
};
this._backoff=function(){
if(!this._advice){
this._advice={reconnect:"retry",interval:0};
}else{
if(!this._advice.interval){
this._advice.interval=0;
}
}
if(this._backoffInterval<this._backoffMax){
this._backoffInterval+=this._backoffIncrement;
}
};
this._backon=function(){
this._backoffInterval=0;
};
this._interval=function(){
var i=this._backoffInterval+(this._advice?(this._advice.interval?this._advice.interval:0):0);
if(i>0){
console.debug("Retry in interval+backoff="+this._advice.interval+"+"+this._backoffInterval+"="+i+"ms");
}
return i;
};
this._finishInit=function(_31){
_31=_31[0];
this.handshakeReturn=_31;
if(_31["advice"]){
this._advice=_31.advice;
}
var _32=_31.successful?_31.successful:false;
if(_31.version<this.minimumVersion){
console.debug("cometd protocol version mismatch. We wanted",this.minimumVersion,"but got",_31.version);
_32=false;
this._advice.reconnect="none";
}
if(_32){
this.currentTransport=this.connectionTypes.match(_31.supportedConnectionTypes,_31.version,this._isXD);
this.currentTransport._cometd=this;
this.currentTransport.version=_31.version;
this.clientId=_31.clientId;
this.tunnelInit=dojo.hitch(this.currentTransport,"tunnelInit");
this.tunnelCollapse=dojo.hitch(this.currentTransport,"tunnelCollapse");
this.currentTransport.startup(_31);
}
dojo.publish("/cometd/meta",[{cometd:this,action:"handshook",successful:_32,state:this.state()}]);
if(!_32){
console.debug("cometd init failed");
if(this._advice&&this._advice["reconnect"]=="none"){
console.debug("cometd reconnect: none");
}else{
setTimeout(dojo.hitch(this,"init",this.url,this._props),this._interval());
}
}
};
this._extendIn=function(_33){
dojo.forEach(dojox.cometd._extendInList,function(f){
_33=f(_33)||_33;
});
return _33;
};
this._extendOut=function(_35){
dojo.forEach(dojox.cometd._extendOutList,function(f){
_35=f(_35)||_35;
});
return _35;
};
this.deliver=function(_37){
dojo.forEach(_37,this._deliver,this);
return _37;
};
this._deliver=function(_38){
_38=this._extendIn(_38);
if(!_38["channel"]){
if(_38["success"]!==true){
console.debug("cometd error: no channel for message!",_38);
return;
}
}
this.lastMessage=_38;
if(_38.advice){
this._advice=_38.advice;
}
var _39=null;
if((_38["channel"])&&(_38.channel.length>5)&&(_38.channel.substr(0,5)=="/meta")){
switch(_38.channel){
case "/meta/connect":
if(_38.successful&&!this._connected){
this._connected=this._initialized;
this.endBatch();
}else{
if(!this._initialized){
this._connected=false;
}
}
dojo.publish("/cometd/meta",[{cometd:this,action:"connect",successful:_38.successful,state:this.state()}]);
break;
case "/meta/subscribe":
_39=this._deferredSubscribes[_38.subscription];
if(!_38.successful){
if(_39){
_39.errback(new Error(_38.error));
}
this.currentTransport.cancelConnect();
return;
}
dojox.cometd.subscribed(_38.subscription,_38);
if(_39){
_39.callback(true);
}
break;
case "/meta/unsubscribe":
_39=this._deferredUnsubscribes[_38.subscription];
if(!_38.successful){
if(_39){
_39.errback(new Error(_38.error));
}
this.currentTransport.cancelConnect();
return;
}
this.unsubscribed(_38.subscription,_38);
if(_39){
_39.callback(true);
}
break;
default:
if(_38.successful&&!_38.successful){
this.currentTransport.cancelConnect();
return;
}
}
}
this.currentTransport.deliver(_38);
if(_38.data){
try{
var _3a=[_38];
var _3b="/cometd"+_38.channel;
var _3c=_38.channel.split("/");
var _3d="/cometd";
for(var i=1;i<_3c.length-1;i++){
dojo.publish(_3d+"/**",_3a);
_3d+="/"+_3c[i];
}
dojo.publish(_3d+"/**",_3a);
dojo.publish(_3d+"/*",_3a);
dojo.publish(_3b,_3a);
}
catch(e){
console.debug(e);
}
}
};
this._sendMessage=function(_3f){
if(this.currentTransport&&!this.batch){
return this.currentTransport.sendMessages([_3f]);
}else{
this._messageQ.push(_3f);
return null;
}
};
this.startBatch=function(){
this.batch++;
};
this.endBatch=function(){
if(--this.batch<=0&&this.currentTransport&&this._connected){
this.batch=0;
var _40=this._messageQ;
this._messageQ=[];
if(_40.length>0){
this.currentTransport.sendMessages(_40);
}
}
};
this._onUnload=function(){
dojo.addOnUnload(dojox.cometd,"disconnect");
};
this._connectTimeout=function(){
var _41=0;
if(this._advice&&this._advice.timeout&&this.expectedNetworkDelay>0){
_41=this._advice.timeout+this.expectedNetworkDelay;
}
if(this.connectTimeout>0&&this.connectTimeout<_41){
return this.connectTimeout;
}
return 0;
};
};
dojox.cometd.longPollTransport=new function(){
this._connectionType="long-polling";
this._cometd=null;
this.check=function(_42,_43,_44){
return ((!_44)&&(dojo.indexOf(_42,"long-polling")>=0));
};
this.tunnelInit=function(){
var _45={channel:"/meta/connect",clientId:this._cometd.clientId,connectionType:this._connectionType,id:""+this._cometd.messageId++};
_45=this._cometd._extendOut(_45);
this.openTunnelWith({message:dojo.toJson([_45])});
};
this.tunnelCollapse=function(){
if(!this._cometd._initialized){
return;
}
if(this._cometd._advice&&this._cometd._advice["reconnect"]=="none"){
console.debug("cometd reconnect: none");
return;
}
setTimeout(dojo.hitch(this,function(){
this._connect();
}),this._cometd._interval());
};
this._connect=function(){
if(!this._cometd._initialized){
return;
}
if(this._cometd._polling){
console.debug("wait for poll to complete or fail");
return;
}
if((this._cometd._advice)&&(this._cometd._advice["reconnect"]=="handshake")){
this._cometd._connected=false;
this._initialized=false;
this._cometd.init(this._cometd.url,this._cometd._props);
}else{
if(this._cometd._connected){
var _46={channel:"/meta/connect",connectionType:this._connectionType,clientId:this._cometd.clientId,id:""+this._cometd.messageId++};
if(this._cometd.connectTimeout>this._cometd.expectedNetworkDelay){
_46.advice={timeout:(this._cometd.connectTimeout-this._cometd.expectedNetworkDelay)};
}
_46=this._cometd._extendOut(_46);
this.openTunnelWith({message:dojo.toJson([_46])});
}
}
};
this.deliver=function(_47){
};
this.openTunnelWith=function(_48,url){
this._cometd._polling=true;
var _4a={url:(url||this._cometd.url),content:_48,handleAs:this._cometd.handleAs,load:dojo.hitch(this,function(_4b){
this._cometd._polling=false;
this._cometd.deliver(_4b);
this._cometd._backon();
this.tunnelCollapse();
}),error:dojo.hitch(this,function(err){
this._cometd._polling=false;
console.debug("tunnel opening failed:",err);
dojo.publish("/cometd/meta",[{cometd:this._cometd,action:"connect",successful:false,state:this._cometd.state()}]);
this._cometd._backoff();
this.tunnelCollapse();
})};
var _4d=this._cometd._connectTimeout();
if(_4d>0){
_4a.timeout=_4d;
}
this._poll=dojo.xhrPost(_4a);
};
this.sendMessages=function(_4e){
for(var i=0;i<_4e.length;i++){
_4e[i].clientId=this._cometd.clientId;
_4e[i].id=""+this._cometd.messageId++;
_4e[i]=this._cometd._extendOut(_4e[i]);
}
return dojo.xhrPost({url:this._cometd.url||dojo.config["cometdRoot"],handleAs:this._cometd.handleAs,load:dojo.hitch(this._cometd,"deliver"),error:dojo.hitch(this,function(err){
console.debug("dropped messages: ",_4e);
}),content:{message:dojo.toJson(_4e)}});
};
this.startup=function(_51){
if(this._cometd._connected){
return;
}
this.tunnelInit();
};
this.disconnect=function(){
var _52={channel:"/meta/disconnect",clientId:this._cometd.clientId,id:""+this._cometd.messageId++};
_52=this._cometd._extendOut(_52);
dojo.xhrPost({url:this._cometd.url||dojo.config["cometdRoot"],handleAs:this._cometd.handleAs,content:{message:dojo.toJson([_52])}});
};
this.cancelConnect=function(){
if(this._poll){
this._poll.cancel();
this._cometd._polling=false;
dojo.debug("tunnel opening cancelled");
dojo.event.topic.publish("/cometd/meta",{cometd:this._cometd,action:"connect",successful:false,state:this._cometd.state(),cancel:true});
this._cometd._backoff();
this.disconnect();
this.tunnelCollapse();
}
};
};
dojox.cometd.callbackPollTransport=new function(){
this._connectionType="callback-polling";
this._cometd=null;
this.check=function(_53,_54,_55){
return (dojo.indexOf(_53,"callback-polling")>=0);
};
this.tunnelInit=function(){
var _56={channel:"/meta/connect",clientId:this._cometd.clientId,connectionType:this._connectionType,id:""+this._cometd.messageId++};
_56=this._cometd._extendOut(_56);
this.openTunnelWith({message:dojo.toJson([_56])});
};
this.tunnelCollapse=dojox.cometd.longPollTransport.tunnelCollapse;
this._connect=dojox.cometd.longPollTransport._connect;
this.deliver=dojox.cometd.longPollTransport.deliver;
this.openTunnelWith=function(_57,url){
this._cometd._polling=true;
var _59={load:dojo.hitch(this,function(_5a){
this._cometd._polling=false;
this._cometd.deliver(_5a);
this._cometd._backon();
this.tunnelCollapse();
}),error:dojo.hitch(this,function(err){
this._cometd._polling=false;
console.debug("tunnel opening failed:",err);
dojo.publish("/cometd/meta",[{cometd:this._cometd,action:"connect",successful:false,state:this._cometd.state()}]);
this._cometd._backoff();
this.tunnelCollapse();
}),url:(url||this._cometd.url),content:_57,callbackParamName:"jsonp"};
var _5c=this._cometd._connectTimeout();
if(_5c>0){
_59.timeout=_5c;
}
dojo.io.script.get(_59);
};
this.sendMessages=function(_5d){
for(var i=0;i<_5d.length;i++){
_5d[i].clientId=this._cometd.clientId;
_5d[i].id=""+this._cometd.messageId++;
_5d[i]=this._cometd._extendOut(_5d[i]);
}
var _5f={url:this._cometd.url||dojo.config["cometdRoot"],load:dojo.hitch(this._cometd,"deliver"),callbackParamName:"jsonp",content:{message:dojo.toJson(_5d)}};
return dojo.io.script.get(_5f);
};
this.startup=function(_60){
if(this._cometd._connected){
return;
}
this.tunnelInit();
};
this.disconnect=dojox.cometd.longPollTransport.disconnect;
this.disconnect=function(){
var _61={channel:"/meta/disconnect",clientId:this._cometd.clientId,id:""+this._cometd.messageId++};
_61=this._cometd._extendOut(_61);
dojo.io.script.get({url:this._cometd.url||dojo.config["cometdRoot"],callbackParamName:"jsonp",content:{message:dojo.toJson([_61])}});
};
this.cancelConnect=function(){
};
};
dojox.cometd.connectionTypes.register("long-polling",dojox.cometd.longPollTransport.check,dojox.cometd.longPollTransport);
dojox.cometd.connectionTypes.register("callback-polling",dojox.cometd.callbackPollTransport.check,dojox.cometd.callbackPollTransport);
dojo.addOnUnload(dojox.cometd,"_onUnload");
}
