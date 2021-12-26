getAllNodes();
//  <abbr title="Click me to access the configuration dialog">

function setRejFolder () {
  if (rejFld.value === '') rejFld.value=rejFolder;
  var folder=sha().BrowseForFolder(0, "Select a Folder", 0, 0);
  if (folder !== null) rejFld.value=folder.Self.Path;
}

var zoom_factor=0.4;

function zoom (factor) {
  if (factor === 0) {
    img_width=228;
    img_height=128;
//    writeLog("reset zoom w"+img_width+', '+img_height);
  } else {
    //img_width=Number(img_width); img_height=Number(img_height);
    img_width=parseInt(img_width*(1+factor));
    img_height=parseInt(img_height*(1+factor));
  }

  location.reload();
}

function onKeyupDiv(evt) {
  evt=evt || window.event;
//  writeLog("kc "+evt.keyCode);

  switch (evt.keyCode) {
    case 13:
      okCnfDiv();
      break;
    case 27:
      setTimeout(closeCnfDiv, 100);
      break;
  }
}

var noResizeW, noResizeH;
function cnfDivNoResize () {
  if (isHTA()) window.resizeTo(noResizeW, noResizeH);
}

function closeCnfDiv() {
  cnfDiv.style.display='none';
  window.onresize=null;
  window.removeEventListener("resize", cnfDivNoResize);
  document.onkeyup=document.body.onkeyup=onKeyUp;
  setWindowPos();
}

function okCnfDiv() {
  if (rejFld.value !== '') rejFolder=rejFld.value;

  isButsOnOver=butsOnOver.checked;
  setButsOnOver(isButsOnOver);

  if (thW.value !== '' && thH.value !== '' && (thW.value !== img_width || thH.value !== img_height || thumbBorder !== thuBord.checked || isDarkMode !== darkMode.checked)) {
    img_width=thW.value;
    img_height=thH.value;
    thumbBorder=thuBord.checked;
    isDarkMode=darkMode.checked;
    setDarkMode(isDarkMode);
    saveConfig();
    location.reload();
  }

  closeCnfDiv();
}

function showConfig () {
  cnfDivStyle = getComputedStyle(cnfDiv);
  noResizeW=Number(cnfDivStyle.width.replace('px', ''))+26;
  noResizeH=Number(cnfDivStyle.height.replace('px', ''))+48;
  if (isHTA()) window.resizeTo(noResizeW, noResizeH);
  rejFld.value=rejFolder;
  thW.value=img_width;
  thH.value=img_height;
  thuBord.checked=thumbBorder;
  darkMode.checked=isDarkMode;
  butsOnOver.checked=isButsOnOver;
  butsOnClck.checked=!isButsOnOver;
  document.onkeyup=document.body.onkeyup=onKeyupDiv;
  window.addEventListener("resize", cnfDivNoResize);
  cnfDiv.style.display='block';
}


window.onload=function () {
  setDarkMode(isDarkMode);
  setButsOnOver(isButsOnOver);
  document.onkeyup=document.body.onkeyup=onKeyUp;
  // Rafraichissement des images au dizième de seconde
  setInterval(BgThumbList, 100);
  setTimeout(getAllNodes, 200);
};

function saveConfig () {
  writeIni(INI_FILE, 'POSITION', "X", winX);
  writeIni(INI_FILE, 'POSITION', "Y", winY);
  writeIni(INI_FILE, 'THUMBNAIL', "Number", nThumb);
  writeIni(INI_FILE, 'THUMBNAIL', "Width", img_width);
  writeIni(INI_FILE, 'THUMBNAIL', "Height", img_height);
  writeIni(INI_FILE, 'THUMBNAIL', "RejectFolder", rejFolder);
  writeIniBool(INI_FILE, 'THUMBNAIL', "Border", thumbBorder);
  writeIniBool(INI_FILE, 'APP', "DarkMode", isDarkMode);
  writeIniBool(INI_FILE, 'APP', "ButtonsOnOver", isButsOnOver);
}  

window.onbeforeunload = function (e) {
  winX=getWindowX(); 
  if (winX < 0) winX=50;
  winY=getWindowY();
  if (winY < 0) winY=50;
  saveConfig();
};

