/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/book/dojo-book-0-9/introduction/licensing
*/


if(!dojo._hasResource["dojo.data.ItemFileReadStore"]){
dojo._hasResource["dojo.data.ItemFileReadStore"]=true;
dojo.provide("dojo.data.ItemFileReadStore");
dojo.require("dojo.data.util.filter");
dojo.require("dojo.data.util.simpleFetch");
dojo.require("dojo.date.stamp");
dojo.declare("dojo.data.ItemFileReadStore",null,{constructor:function(_1){
this._arrayOfAllItems=[];
this._arrayOfTopLevelItems=[];
this._loadFinished=false;
this._jsonFileUrl=_1.url;
this._jsonData=_1.data;
this._datatypeMap=_1.typeMap||{};
if(!this._datatypeMap["Date"]){
this._datatypeMap["Date"]={type:Date,deserialize:function(_2){
return dojo.date.stamp.fromISOString(_2);
}};
}
this._features={"dojo.data.api.Read":true,"dojo.data.api.Identity":true};
this._itemsByIdentity=null;
this._storeRefPropName="_S";
this._itemNumPropName="_0";
this._rootItemPropName="_RI";
this._reverseRefMap="_RRM";
this._loadInProgress=false;
this._queuedFetches=[];
},url:"",_assertIsItem:function(_3){
if(!this.isItem(_3)){
throw new Error("dojo.data.ItemFileReadStore: Invalid item argument.");
}
},_assertIsAttribute:function(_4){
if(typeof _4!=="string"){
throw new Error("dojo.data.ItemFileReadStore: Invalid attribute argument.");
}
},getValue:function(_5,_6,_7){
var _8=this.getValues(_5,_6);
return (_8.length>0)?_8[0]:_7;
},getValues:function(_9,_a){
this._assertIsItem(_9);
this._assertIsAttribute(_a);
return _9[_a]||[];
},getAttributes:function(_b){
this._assertIsItem(_b);
var _c=[];
for(var _d in _b){
if((_d!==this._storeRefPropName)&&(_d!==this._itemNumPropName)&&(_d!==this._rootItemPropName)&&(_d!==this._reverseRefMap)){
_c.push(_d);
}
}
return _c;
},hasAttribute:function(_e,_f){
return this.getValues(_e,_f).length>0;
},containsValue:function(_10,_11,_12){
var _13=undefined;
if(typeof _12==="string"){
_13=dojo.data.util.filter.patternToRegExp(_12,false);
}
return this._containsValue(_10,_11,_12,_13);
},_containsValue:function(_14,_15,_16,_17){
return dojo.some(this.getValues(_14,_15),function(_18){
if(_18!==null&&!dojo.isObject(_18)&&_17){
if(_18.toString().match(_17)){
return true;
}
}else{
if(_16===_18){
return true;
}
}
});
},isItem:function(_19){
if(_19&&_19[this._storeRefPropName]===this){
if(this._arrayOfAllItems[_19[this._itemNumPropName]]===_19){
return true;
}
}
return false;
},isItemLoaded:function(_1a){
return this.isItem(_1a);
},loadItem:function(_1b){
this._assertIsItem(_1b.item);
},getFeatures:function(){
return this._features;
},getLabel:function(_1c){
if(this._labelAttr&&this.isItem(_1c)){
return this.getValue(_1c,this._labelAttr);
}
return undefined;
},getLabelAttributes:function(_1d){
if(this._labelAttr){
return [this._labelAttr];
}
return null;
},_fetchItems:function(_1e,_1f,_20){
var _21=this;
var _22=function(_23,_24){
var _25=[];
if(_23.query){
var _26=_23.queryOptions?_23.queryOptions.ignoreCase:false;
var _27={};
for(var key in _23.query){
var _29=_23.query[key];
if(typeof _29==="string"){
_27[key]=dojo.data.util.filter.patternToRegExp(_29,_26);
}
}
for(var i=0;i<_24.length;++i){
var _2b=true;
var _2c=_24[i];
if(_2c===null){
_2b=false;
}else{
for(var key in _23.query){
var _29=_23.query[key];
if(!_21._containsValue(_2c,key,_29,_27[key])){
_2b=false;
}
}
}
if(_2b){
_25.push(_2c);
}
}
_1f(_25,_23);
}else{
for(var i=0;i<_24.length;++i){
var _2d=_24[i];
if(_2d!==null){
_25.push(_2d);
}
}
_1f(_25,_23);
}
};
if(this._loadFinished){
_22(_1e,this._getItemsArray(_1e.queryOptions));
}else{
if(this._jsonFileUrl){
if(this._loadInProgress){
this._queuedFetches.push({args:_1e,filter:_22});
}else{
this._loadInProgress=true;
var _2e={url:_21._jsonFileUrl,handleAs:"json-comment-optional"};
var _2f=dojo.xhrGet(_2e);
_2f.addCallback(function(_30){
try{
_21._getItemsFromLoadedData(_30);
_21._loadFinished=true;
_21._loadInProgress=false;
_22(_1e,_21._getItemsArray(_1e.queryOptions));
_21._handleQueuedFetches();
}
catch(e){
_21._loadFinished=true;
_21._loadInProgress=false;
_20(e,_1e);
}
});
_2f.addErrback(function(_31){
_21._loadInProgress=false;
_20(_31,_1e);
});
}
}else{
if(this._jsonData){
try{
this._loadFinished=true;
this._getItemsFromLoadedData(this._jsonData);
this._jsonData=null;
_22(_1e,this._getItemsArray(_1e.queryOptions));
}
catch(e){
_20(e,_1e);
}
}else{
_20(new Error("dojo.data.ItemFileReadStore: No JSON source data was provided as either URL or a nested Javascript object."),_1e);
}
}
}
},_handleQueuedFetches:function(){
if(this._queuedFetches.length>0){
for(var i=0;i<this._queuedFetches.length;i++){
var _33=this._queuedFetches[i];
var _34=_33.args;
var _35=_33.filter;
if(_35){
_35(_34,this._getItemsArray(_34.queryOptions));
}else{
this.fetchItemByIdentity(_34);
}
}
this._queuedFetches=[];
}
},_getItemsArray:function(_36){
if(_36&&_36.deep){
return this._arrayOfAllItems;
}
return this._arrayOfTopLevelItems;
},close:function(_37){
},_getItemsFromLoadedData:function(_38){
function valueIsAnItem(_39){
var _3a=((_39!=null)&&(typeof _39=="object")&&(!dojo.isArray(_39))&&(!dojo.isFunction(_39))&&(_39.constructor==Object)&&(typeof _39._reference=="undefined")&&(typeof _39._type=="undefined")&&(typeof _39._value=="undefined"));
return _3a;
};
var _3b=this;
function addItemAndSubItemsToArrayOfAllItems(_3c){
_3b._arrayOfAllItems.push(_3c);
for(var _3d in _3c){
var _3e=_3c[_3d];
if(_3e){
if(dojo.isArray(_3e)){
var _3f=_3e;
for(var k=0;k<_3f.length;++k){
var _41=_3f[k];
if(valueIsAnItem(_41)){
addItemAndSubItemsToArrayOfAllItems(_41);
}
}
}else{
if(valueIsAnItem(_3e)){
addItemAndSubItemsToArrayOfAllItems(_3e);
}
}
}
}
};
this._labelAttr=_38.label;
var i;
var _43;
this._arrayOfAllItems=[];
this._arrayOfTopLevelItems=_38.items;
for(i=0;i<this._arrayOfTopLevelItems.length;++i){
_43=this._arrayOfTopLevelItems[i];
addItemAndSubItemsToArrayOfAllItems(_43);
_43[this._rootItemPropName]=true;
}
var _44={};
var key;
for(i=0;i<this._arrayOfAllItems.length;++i){
_43=this._arrayOfAllItems[i];
for(key in _43){
if(key!==this._rootItemPropName){
var _46=_43[key];
if(_46!==null){
if(!dojo.isArray(_46)){
_43[key]=[_46];
}
}else{
_43[key]=[null];
}
}
_44[key]=key;
}
}
while(_44[this._storeRefPropName]){
this._storeRefPropName+="_";
}
while(_44[this._itemNumPropName]){
this._itemNumPropName+="_";
}
while(_44[this._reverseRefMap]){
this._reverseRefMap+="_";
}
var _47;
var _48=_38.identifier;
if(_48){
this._itemsByIdentity={};
this._features["dojo.data.api.Identity"]=_48;
for(i=0;i<this._arrayOfAllItems.length;++i){
_43=this._arrayOfAllItems[i];
_47=_43[_48];
var _49=_47[0];
if(!this._itemsByIdentity[_49]){
this._itemsByIdentity[_49]=_43;
}else{
if(this._jsonFileUrl){
throw new Error("dojo.data.ItemFileReadStore:  The json data as specified by: ["+this._jsonFileUrl+"] is malformed.  Items within the list have identifier: ["+_48+"].  Value collided: ["+_49+"]");
}else{
if(this._jsonData){
throw new Error("dojo.data.ItemFileReadStore:  The json data provided by the creation arguments is malformed.  Items within the list have identifier: ["+_48+"].  Value collided: ["+_49+"]");
}
}
}
}
}else{
this._features["dojo.data.api.Identity"]=Number;
}
for(i=0;i<this._arrayOfAllItems.length;++i){
_43=this._arrayOfAllItems[i];
_43[this._storeRefPropName]=this;
_43[this._itemNumPropName]=i;
}
for(i=0;i<this._arrayOfAllItems.length;++i){
_43=this._arrayOfAllItems[i];
for(key in _43){
_47=_43[key];
for(var j=0;j<_47.length;++j){
_46=_47[j];
if(_46!==null&&typeof _46=="object"){
if(_46._type&&_46._value){
var _4b=_46._type;
var _4c=this._datatypeMap[_4b];
if(!_4c){
throw new Error("dojo.data.ItemFileReadStore: in the typeMap constructor arg, no object class was specified for the datatype '"+_4b+"'");
}else{
if(dojo.isFunction(_4c)){
_47[j]=new _4c(_46._value);
}else{
if(dojo.isFunction(_4c.deserialize)){
_47[j]=_4c.deserialize(_46._value);
}else{
throw new Error("dojo.data.ItemFileReadStore: Value provided in typeMap was neither a constructor, nor a an object with a deserialize function");
}
}
}
}
if(_46._reference){
var _4d=_46._reference;
if(!dojo.isObject(_4d)){
_47[j]=this._itemsByIdentity[_4d];
}else{
for(var k=0;k<this._arrayOfAllItems.length;++k){
var _4f=this._arrayOfAllItems[k];
var _50=true;
for(var _51 in _4d){
if(_4f[_51]!=_4d[_51]){
_50=false;
}
}
if(_50){
_47[j]=_4f;
}
}
}
if(this.referenceIntegrity){
var _52=_47[j];
if(this.isItem(_52)){
this._addReferenceToMap(_52,_43,key);
}
}
}else{
if(this.isItem(_46)){
if(this.referenceIntegrity){
this._addReferenceToMap(_46,_43,key);
}
}
}
}
}
}
}
},_addReferenceToMap:function(_53,_54,_55){
},getIdentity:function(_56){
var _57=this._features["dojo.data.api.Identity"];
if(_57===Number){
return _56[this._itemNumPropName];
}else{
var _58=_56[_57];
if(_58){
return _58[0];
}
}
return null;
},fetchItemByIdentity:function(_59){
if(!this._loadFinished){
var _5a=this;
if(this._jsonFileUrl){
if(this._loadInProgress){
this._queuedFetches.push({args:_59});
}else{
this._loadInProgress=true;
var _5b={url:_5a._jsonFileUrl,handleAs:"json-comment-optional"};
var _5c=dojo.xhrGet(_5b);
_5c.addCallback(function(_5d){
var _5e=_59.scope?_59.scope:dojo.global;
try{
_5a._getItemsFromLoadedData(_5d);
_5a._loadFinished=true;
_5a._loadInProgress=false;
var _5f=_5a._getItemByIdentity(_59.identity);
if(_59.onItem){
_59.onItem.call(_5e,_5f);
}
_5a._handleQueuedFetches();
}
catch(error){
_5a._loadInProgress=false;
if(_59.onError){
_59.onError.call(_5e,error);
}
}
});
_5c.addErrback(function(_60){
_5a._loadInProgress=false;
if(_59.onError){
var _61=_59.scope?_59.scope:dojo.global;
_59.onError.call(_61,_60);
}
});
}
}else{
if(this._jsonData){
_5a._getItemsFromLoadedData(_5a._jsonData);
_5a._jsonData=null;
_5a._loadFinished=true;
var _62=_5a._getItemByIdentity(_59.identity);
if(_59.onItem){
var _63=_59.scope?_59.scope:dojo.global;
_59.onItem.call(_63,_62);
}
}
}
}else{
var _62=this._getItemByIdentity(_59.identity);
if(_59.onItem){
var _63=_59.scope?_59.scope:dojo.global;
_59.onItem.call(_63,_62);
}
}
},_getItemByIdentity:function(_64){
var _65=null;
if(this._itemsByIdentity){
_65=this._itemsByIdentity[_64];
}else{
_65=this._arrayOfAllItems[_64];
}
if(_65===undefined){
_65=null;
}
return _65;
},getIdentityAttributes:function(_66){
var _67=this._features["dojo.data.api.Identity"];
if(_67===Number){
return null;
}else{
return [_67];
}
},_forceLoad:function(){
var _68=this;
if(this._jsonFileUrl){
var _69={url:_68._jsonFileUrl,handleAs:"json-comment-optional",sync:true};
var _6a=dojo.xhrGet(_69);
_6a.addCallback(function(_6b){
try{
if(_68._loadInProgress!==true&&!_68._loadFinished){
_68._getItemsFromLoadedData(_6b);
_68._loadFinished=true;
}
}
catch(e){
console.log(e);
throw e;
}
});
_6a.addErrback(function(_6c){
throw _6c;
});
}else{
if(this._jsonData){
_68._getItemsFromLoadedData(_68._jsonData);
_68._jsonData=null;
_68._loadFinished=true;
}
}
}});
dojo.extend(dojo.data.ItemFileReadStore,dojo.data.util.simpleFetch);
}
