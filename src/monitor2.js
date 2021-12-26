
window.resizeTo(800, 200);

// === ActiveX ===
var activeX = [];
function callActiveX(AXName) {
  if (typeof activeX[AXName] === 'undefined') activeX[AXName] = new ActiveXObject(AXName);
  return activeX[AXName];
}

function fso() { return callActiveX('Scripting.FileSystemObject'); }
function wsh() { return callActiveX('WScript.Shell'); }
function sha() { return callActiveX('Shell.Application'); }

function mkTemp () {
  var tn;
  do {
    tn=fso().BuildPath(fso().GetSpecialFolder(2), fso().GetTempName());
  } while (fso().FileExists(tn));

  return tn;
}

function get_mon_info() {
  var query='HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Hardware Profiles\\UnitedVideo\\CONTROL\\VIDEO';

  regfile=mkTemp();
  wsh().Run('cmd /C reg query "'+query+'" /s >'+regfile, 0, true);

  var s="";
  try {
    rm=fso().OpenTextFile(regfile, 1, true);
    s=rm.ReadAll();
    rm.close();
  } catch (err) { }
  if (fso().FileExists(regfile)) fso().DeleteFile(regfile);

  var ak=s.split("\n");
  var vdesk, vrelx, vrely, vxres, vyres;
  var mons=[];

  for (var i = 0; i < ak.length; i++) {
    var k=ak[i].trim().replace(/\s\s+/g, ' ').split(' ');

    switch (k[0]) {
      case "Attach.ToDesktop":
        vdesk=parseInt(k[2], 16);
        break;
      case "DefaultSettings.XResolution":
        vxres=parseInt(k[2], 16);
        break;
      case "DefaultSettings.YResolution":
        vyres=parseInt(k[2], 16);
        break;
      case "Attach.RelativeX":
        rx=parseInt(k[2], 16);
        if (rx > 4294963200) rx-=4294963200;
        vrelx=rx;
        break;
      case "Attach.RelativeY":
        ry=parseInt(k[2], 16);
        if (ry > 4294963200) ry-=4294963200;
        vrely=ry;
        mons.push({desk: vdesk, xres: vxres, yres: vyres, relx: vrelx, rely: vrely});
        break;
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
