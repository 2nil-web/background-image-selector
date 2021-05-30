
// === ActiveX ===
var activeX = [];
function callActiveX(AXName) {
  if (typeof activeX[AXName] === 'undefined') activeX[AXName] = new ActiveXObject(AXName);
  return activeX[AXName];
}

function fso() { return callActiveX('Scripting.FileSystemObject'); }
function wsh() { return callActiveX('WScript.Shell'); }
function sha() { return callActiveX('Shell.Application'); }

function regEnumKey (key, subKey) {
  var objService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\default");
  var objReg = objService.Get("StdRegProv");

  // Prepare the EnumKey method...
  var objMethod = objReg.Methods_.Item("EnumKey"); 
  var objParamsIn = objMethod.InParameters.SpawnInstance_(); 
  objParamsIn.hDefKey = key; 
  objParamsIn.sSubKeyName = subKey;
  // Execute the method and collect the output...
  var objParamsOut = objReg.ExecMethod_(objMethod.Name, objParamsIn); 

  if (objParamsOut.ReturnValue === 0 && objParamsOut.sNames != null)
    return objParamsOut.sNames.toArray();

  return [];
}

var HKLM=0x080000002;
var monitorCount=0;
var path='SYSTEM\\CurrentControlSet\\Hardware Profiles\\UnitedVideo\\CONTROL\\VIDEO';
var videos=regEnumKey(HKLM, path);

for (var i = 0; i < videos.length; ++i) {
  var subKeyVideo=path+'\\'+videos[i];
  var arrSubVideo=regEnumKey(HKLM, subKeyVideo);
  var msg='';

  for (var j = 0; j < arrSubVideo.length; ++j) {
    var newKey='HKLM\\'+subKeyVideo+'\\'+arrSubVideo[j];
    var AttachToDesktop=wsh().RegRead(newKey+'\\Attach.ToDesktop');
    var AttachRelativeX=wsh().RegRead(newKey+'\\Attach.RelativeX');
    var AttachRelativeY=wsh().RegRead(newKey+'\\Attach.RelativeY');
    msg+='Monitor '+arrSubVideo[j]+', AttachRelativeX '+AttachRelativeX+', AttachRelativeY '+AttachRelativeY;

    if (AttachRelativeX+AttachRelativeY === 0) msg +=', is the main monitor';
    if (AttachToDesktop === 0) msg += ', is not active';
    else monitorCount++;
    msg+='.\n';
  }
}
WScript.Echo(msg+monitorCount + ' active monitor(s) found.');

