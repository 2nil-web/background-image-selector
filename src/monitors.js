
window.resizeTo(800, 200);

// === ActiveX ===
var activeX=[];
function callActiveX(AXName) {
  if (typeof activeX[AXName] === 'undefined') activeX[AXName]=new ActiveXObject(AXName);
  return activeX[AXName];
}

function fso() { return callActiveX('Scripting.FileSystemObject'); }
function wsh() { return callActiveX('WScript.Shell'); }
function sha() { return callActiveX('Shell.Application'); }
function loc() { return callActiveX("WbemScripting.SWbemLocator"); }

var objReg=null;
var objEnumKey=null;
function regEnumKey (key, subKey) {
  if (objReg === null) {
    //var svc=GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\default");
    objReg=loc().ConnectServer(".", "root\\default").Get("StdRegProv");
    // Prepare the EnumKey method...
    objEnumKey=objReg.Methods_.Item("EnumKey"); 
  }

  var objParamsIn=objEnumKey.InParameters.SpawnInstance_(); 
  objParamsIn.hDefKey=key; 
  objParamsIn.sSubKeyName=subKey;
  // Execute the method and collect the output...
  var objParamsOut=objReg.ExecMethod_(objEnumKey.Name, objParamsIn); 

  if (objParamsOut.ReturnValue === 0 && objParamsOut.sNames != null)
    return objParamsOut.sNames.toArray();

  return [];
}

function get_mon_info() {
  var HKLM=0x080000002;
  var monitorCount=0;
  var path='SYSTEM\\CurrentControlSet\\Hardware Profiles\\UnitedVideo\\CONTROL\\VIDEO';
  var videos=regEnumKey(HKLM, path);
  var mons=[];

  for (var i=0; i < videos.length; ++i) {
    var subKeyVideo=path+'\\'+videos[i];
    var arrSubVideo=regEnumKey(HKLM, subKeyVideo);
    var msg='';

    for (var j=0; j < arrSubVideo.length; ++j) {
      var newKey='HKLM\\'+subKeyVideo+'\\'+arrSubVideo[j];
      var vdesk=wsh().RegRead(newKey+'\\Attach.ToDesktop');
      var vxres=wsh().RegRead(newKey+'\\DefaultSettings.XResolution');
      var vyres=wsh().RegRead(newKey+'\\DefaultSettings.YResolution');
      var vrelx=wsh().RegRead(newKey+'\\Attach.RelativeX');
      var vrely=wsh().RegRead(newKey+'\\Attach.RelativeY');
      mons.push({desk: vdesk, xres: vxres, yres: vyres, relx: vrelx, rely: vrely});
    }
  }

  return mons;
}

function disp_mon_info (eol) {
  if (typeof eol === 'undefined') eol='<br>';

  var mons=get_mon_info();
  var s="";

  if (mons.length > 1) s+="There are "+mons.length+" monitors";
  else s+="There is one monitor";
  s+=eol;

  mons.forEach(function(m, i) {
    s+="Monitor "+(i+1)+ " has a resolution of "+m.xres+"x"+m.yres+" pixels with relative X and Y attachment ("+m.relx+", "+m.rely+") and is ";
    if (m.desk === 0) s+="NOT ";
    s+="active."+eol;
  });

  return s;
}

mdiv.innerHTML=disp_mon_info();


