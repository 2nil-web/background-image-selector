// === ActiveX ===
var activeX = [];
function callActiveX(AXName) {
  if (typeof activeX[AXName] === 'undefined') activeX[AXName] = new ActiveXObject(AXName);
  return activeX[AXName];
}

function fso() { return callActiveX('Scripting.FileSystemObject'); }
function wsh() { return callActiveX('WScript.Shell'); }
function sha() { return callActiveX('Shell.Application'); }

var query='HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Hardware Profiles\\UnitedVideo\\CONTROL\\VIDEO';
var re=new RegExp('.*{.*}');

var objExec = wsh().Exec('reg query "'+query+'" /s');
var s=objExec.StdOut.ReadAll();
var ak=s.split("\n");
var msg="";
var k=[], idx=[], desk=[], relx=[], rely=[], xres=[], yres=[];
for (var i = 0; i < ak.length; ++i) {
  kl=ak[i].trim();

  if (kl.substring(0, query.length) === query) {
    id=kl.substring(query.length).replace(/.*{.*}/, '');
//    mondisp.innerHTML+='[['+id+']]<br>';

    if (id !== "") idx.push(1+parseInt(id.slice(-4), 10));
  } else {
  k=kl.replace(/\s\s+/g, ' ').split(' ');

  switch (k[0]) {
    case "Attach.ToDesktop":
      desk.push(parseInt(k[2], 16));
      break;
    case "Attach.RelativeX":
      rx=parseInt(k[2], 16);
      if (rx > 4294963200) rx-=4294963200;
      relx.push(rx);
      break;
    case "Attach.RelativeY":
      ry=parseInt(k[2], 16);
      if (ry > 4294963200) ry-=4294963200;
      rely.push(ry);
      break;
    case "DefaultSettings.XResolution":
      xres.push(parseInt(k[2], 16));
      break;
    case "DefaultSettings.YResolution":
      yres.push(parseInt(k[2], 16));
      break;
  }
  }
}

if (desk.length > 1) mondisp.innerHTML+="There are "+desk.length+" monitors<br>";
else mondisp.innerHTML+="There is one monitor<br>";

for (i=0; i < desk.length; i++) {
  mondisp.innerHTML+="Monitor "+idx[i]+ " has a resolution of "+xres[i]+"X"+yres[i]+" pixels with relative X and Y attachment ("+relx[i]+", "+rely[i]+")";

  if (desk[i] === 0) mondisp.innerHTML+=" but is not active";
  mondisp.innerHTML+=".<br>";
}

