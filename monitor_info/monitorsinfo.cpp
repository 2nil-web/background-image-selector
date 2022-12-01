
# include <iostream>
# include <vector>

#include <windows.h>




int i;
BOOL CALLBACK MonitorEnumProc(HMONITOR monitor, HDC /*hdc*/, LPRECT /*rect*/, LPARAM /*data*/) {
  MONITORINFO mi;
  
  mi.cbSize=sizeof(MONITORINFO);
  GetMonitorInfo(monitor, &mi);
  std::cout << "Monitor " << i++;
  std::cout << " area ("<< mi.rcMonitor.left   << ", " << mi.rcMonitor.top    << ", " << mi.rcMonitor.right  << ", " << mi.rcMonitor.bottom << ")";
  std::cout << ", working area ("<< mi.rcWork.left   << ", " << mi.rcWork.top    << ", " << mi.rcWork.right  << ", " << mi.rcWork.bottom << ")";
  std::cout << ", flag " << mi.dwFlags;
  if (mi.dwFlags == MONITORINFOF_PRIMARY) std::cout << ", is primary monitor.";
  std::cout << std::endl;
  return TRUE;
}

void DisplayMonitors() {
  i=0;
  EnumDisplayMonitors(nullptr, nullptr, MonitorEnumProc, (LPARAM)nullptr);
}


std::string stateflag_tostring(DWORD st) {
  std::string s="";

  if (st&DISPLAY_DEVICE_ACTIVE) s += "is active";
  if (st&DISPLAY_DEVICE_MIRRORING_DRIVER) {
    if (s != "") s +=" and ";
    s += "has mirroring driver";
  }
  if (st&DISPLAY_DEVICE_MODESPRUNED) {
    if (s != "") s +=" and ";
    s += "has more display modes than its output devices support";
  }

  if (st&DISPLAY_DEVICE_PRIMARY_DEVICE) {
    if (s != "") s +=" and ";
    s += "is primary device for desktop";
  }

  if (st&DISPLAY_DEVICE_REMOVABLE) {
    if (s != "") s +=" and ";
    s += "is removable so cannot be primary display";
  }

  if (st&DISPLAY_DEVICE_VGA_COMPATIBLE) {
    if (s != "") s +=" and ";
    s += "is vga compatible";
  }

  if (s != "") s="it "+s;
  return s;
}

// DevType
//  0 => Adapter
//  1 => Monitor
void DumpDevice(const DWORD num, int DevType, const DISPLAY_DEVICE& dd) {
  if (dd.StateFlags != 0) {
    if (DevType == 0) std::cout << "Adapter";
    else std::cout << "  Monitor";
    std::cout << " number: " <<  num << ", name: " <<  dd.DeviceName << ", string: " <<  dd.DeviceString << ", state flags: (" << dd.StateFlags << ") " <<  stateflag_tostring(dd.StateFlags) << ", ID: " <<  dd.DeviceID << ", key: ..." <<  dd.DeviceKey+42 << std::endl;
  }
}

void DisplayDevices() {
  DISPLAY_DEVICE ad;
  ad.cb=sizeof(DISPLAY_DEVICE);

  DISPLAY_DEVICE mn;
  mn.cb=sizeof(DISPLAY_DEVICE);
  DWORD monitorNum;

  DWORD deviceNum=0;
  while (EnumDisplayDevices(NULL, deviceNum, &ad, 0)) {
    DumpDevice(deviceNum, 0, ad);
    monitorNum=0;

    while (EnumDisplayDevices(ad.DeviceName, monitorNum, &mn, 0)) DumpDevice(monitorNum++, 1, mn);
    deviceNum++;
    std::cout << std::endl;
  }

}

int WINAPI WinMain (HINSTANCE /*hInstance*/, HINSTANCE /*hPrevInstance*/, LPSTR /*lpCmdLine*/, int /*nShowCmd*/) {
  DisplayMonitors();
  std::cout << std::endl;
  DisplayDevices();
  return 0;
}

