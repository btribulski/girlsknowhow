/*
	Copyright (c) 2004-2008, The Dojo Foundation
	All Rights Reserved.

	Licensed under the Academic Free License version 2.1 or above OR the
	modified BSD license. For more information on Dojo licensing, see:

		http://dojotoolkit.org/book/dojo-book-0-9/introduction/licensing
*/


if(!dojo._hasResource["dojox.form.PasswordValidator"]){
dojo._hasResource["dojox.form.PasswordValidator"]=true;
dojo.provide("dojox.form.PasswordValidator");
dojo.require("dijit.form._FormWidget");
dojo.require("dijit.form.ValidationTextBox");
dojo.requireLocalization("dojox.form","PasswordValidator",null,"ROOT");
dojo.declare("dojox.form._ChildTextBox",dijit.form.ValidationTextBox,{containerWidget:null,type:"password",reset:function(){
dijit.form.ValidationTextBox.prototype.setValue.call(this,"",true);
this._hasBeenBlurred=false;
}});
dojo.declare("dojox.form._OldPWBox",dojox.form._ChildTextBox,{_isPWValid:false,setValue:function(_1,_2){
if(_1===""){
_1=dojox.form._OldPWBox.superclass.getValue.call(this);
}
if(_2!==null){
this._isPWValid=this.containerWidget.pwCheck(_1);
}
this.inherited("setValue",arguments);
},isValid:function(_3){
return this.inherited("isValid",arguments)&&this._isPWValid;
},_update:function(e){
if(this._hasBeenBlurred){
this.validate(true);
}
this._onMouse(e);
},getValue:function(){
if(this.containerWidget.isValid()){
return this.inherited("getValue",arguments);
}else{
return "";
}
}});
dojo.declare("dojox.form._NewPWBox",dojox.form._ChildTextBox,{required:true,onChange:function(){
this.containerWidget._inputWidgets[2].validate(false);
this.inherited(arguments);
}});
dojo.declare("dojox.form._VerifyPWBox",dojox.form._ChildTextBox,{isValid:function(_5){
return this.inherited("isValid",arguments)&&(this.getValue()==this.containerWidget._inputWidgets[1].getValue());
}});
dojo.declare("dojox.form.PasswordValidator",dijit.form._FormValueWidget,{required:true,_inputWidgets:null,oldName:"",templateString:"<div dojoAttachPoint=\"containerNode\">\n\t<input type=\"hidden\" name=\"${name}\" value=\"\" dojoAttachPoint=\"focusNode\" />\n</div>\n",_hasBeenBlurred:false,isValid:function(_6){
return dojo.every(this._inputWidgets,function(i){
if(i&&i._setStateClass){
i._setStateClass();
}
return (!i||i.isValid());
});
},validate:function(_8){
return dojo.every(dojo.map(this._inputWidgets,function(i){
if(i&&i.validate){
i._hasBeenBlurred=(i._hasBeenBlurred||this._hasBeenBlurred);
return i.validate();
}
return true;
},this),"return item;");
},reset:function(){
this._hasBeenBlurred=false;
dojo.forEach(this._inputWidgets,function(i){
if(i&&i.reset){
i.reset();
}
},this);
},_createSubWidgets:function(){
var _b=this._inputWidgets,_c=dojo.i18n.getLocalization("dojox.form","PasswordValidator",this.lang);
dojo.forEach(_b,function(i,_e){
if(i){
var p={containerWidget:this},c;
if(_e===0){
p.name=this.oldName;
p.invalidMessage=_c.badPasswordMessage;
c=dojox.form._OldPWBox;
}else{
if(_e===1){
p.required=this.required;
c=dojox.form._NewPWBox;
}else{
if(_e===2){
p.invalidMessage=_c.nomatchMessage;
c=dojox.form._VerifyPWBox;
}
}
}
_b[_e]=new c(p,i);
}
},this);
},pwCheck:function(_11){
return false;
},postCreate:function(){
this.inherited(arguments);
var _12=this._inputWidgets=[];
dojo.forEach(["old","new","verify"],function(i){
_12.push(dojo.query("input[pwType="+i+"]",this.containerNode)[0]);
},this);
if(!_12[1]||!_12[2]){
throw new Error("Need at least pwType=\"new\" and pwType=\"verify\"");
}
if(this.oldName&&!_12[0]){
throw new Error("Need to specify pwType=\"old\" if using oldName");
}
this._createSubWidgets();
},setAttribute:function(_14,_15){
this.inherited(arguments);
switch(_14){
case "disabled":
case "required":
dojo.forEach(this._inputWidgets,function(i){
if(i&&i.setAttribute){
i.setAttribute(_14,_15);
}
});
break;
default:
break;
}
},getValue:function(){
if(this.isValid()){
return this._inputWidgets[1].getValue();
}else{
return "";
}
},focus:function(){
var f=false;
dojo.forEach(this._inputWidgets,function(i){
if(i&&!i.isValid()&&!f){
i.focus();
f=true;
}
});
if(!f){
this._inputWidgets[1].focus();
}
}});
}
