// Variables
var activeWindows = new Array();
var lastDesktop = workspace.currentDesktop;
var lastClientId = -1;

var rememberActiveClient = function(client) {
  if (client == null) {
    return;
  }
  print("ACTIVATED: {current: " + workspace.currentDesktop + ", last: " + lastDesktop + "}");
  if (lastDesktop == workspace.currentDesktop) {
    activeWindows[workspace.currentDesktop] = {
      "windowId": client.windowId,
      "fullscreen": client.fullScreen,
      "caption": client.caption
    };
    lastClientId = client.windowId;
    print("SAVED '" + client.caption + "'");
  }
};

var restoreActiveClient = function(desktopId, dummy) {
  desktopData = activeWindows[workspace.currentDesktop];
  print("DESKTOP CHANGED: {to: " + workspace.currentDesktop + ", from: " + desktopId + "}");
  if (desktopData) {
    windowId = desktopData["windowId"];
    fullScreen = desktopData["fullscreen"];
    client = workspace.getClient(windowId);
    if (client && client.desktop == workspace.currentDesktop) {
      lastClient = workspace.getClient(lastClientId);
      if (lastClient && lastClient.desktop == workspace.currentDesktop) {
        // This should be moving a Window to another desktop.
        // No need to focus the current window; it already has the focus.
      } else {
        workspace.activeClient = client;
        client.fullScreen = fullScreen;
        print("RESTORED '" + desktopData["caption"] + "'");
      }
    }
  }
  lastDesktop = workspace.currentDesktop;
};

var dummyFunc = function(dummy) {
  //noSuchFunc();
};

workspace.clientActivated.connect(rememberActiveClient);
workspace.currentDesktopChanged.connect(restoreActiveClient);
workspace.clientRemoved.connect(dummyFunc);