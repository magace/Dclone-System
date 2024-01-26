/**
*  @filename    IPHunter.js
*  @author      kolton, Mercoory, magace
*  @desc        search for a "hot" IP and stop if the correct server is found
*  @changes     2020.01 - more beeps and movements (anti drop measure) when IP is found; overhead messages with countdown timer; logs to D2Bot console
*  @changes     Magace: Removed use of setting IP in charconfigs, added some more options, logs games to d2soj.com
*
*/

function IPHunter() {

  let ip = Number(me.gameserverip.split(".")[3]);
  const holderConfig = require('../../systems/dclone/profileConfig');
  let searchip = holderConfig.hunterSettings.searchIP;
  let logname = holderConfig.generalSettings.D2sojLogName;
  let logD2soj = holderConfig.generalSettings.logToD2soj;
  let ladderOnly = holderConfig.holderSettings.ladderOnly;
  let hellOnly = holderConfig.holderSettings.hellOnly;
  let useBeep = holderConfig.holderSettings.useBeep;
  let loopDelay = holderConfig.holderSettings.loopDelay;
  let useRealm = holderConfig.holderSettings.useRealm;
  Config.Silence = false;
  let profileOverrides = holderConfig.profileOvverrides;
  let myProfile = me.profile;
  let curRealm = me.realm.toLowerCase()
  let holderLoaded = false;

  this.checkAndCreateOverride = function() {
    if (holderLoaded) {
      return true;
    }
    for (let i = 0; i < holderConfig.holderProfiles.length; i++) {
      let potentialHolder = holderConfig.holderProfiles[i];
      let logPath = "logs/dclone/" + potentialHolder + ".json";
  
      if (FileTools.exists(logPath)) {
        print(logPath + " Found");
        let fileContent = FileAction.read(logPath);
        try {
          let jsonData = JSON.parse(fileContent);
          if (!jsonData.isused) {
            print("Found available holder:" + potentialHolder);
            jsonData.gamename = me.gamename;
            jsonData.gamepass = me.gamepassword;
            jsonData.isused = true;
            let profileOverrideObj = {
              profile: potentialHolder,
              ip: ip,
              ladder: "ladder",
              realm: "useast",
              hellOnly: true
            };
            let profileOverrideString = JSON.stringify(profileOverrideObj);
            jsonData.profileovveride = profileOverrideString;
            let updatedJsonString = JSON.stringify(jsonData);
            FileAction.write(logPath, updatedJsonString);
            print("Updated and waiting on holder:" + potentialHolder);
            holderLoaded = true;
            return true;
          }
        } catch (err) {
          print("Error parsing JSON from file" +  logPath + " " + err);
        }
      } else {
        D2Bot.printToConsole("NO FILE FOUND IN: logs/dclone/" + potentialHolder + ".json");
        return false;
      }
    }
    return true;
  };

  this.chatEvent = function (nick, msg) {
    if (nick) {
      switch (msg) {
        case "release IP":
          quit();
      }
    }
  };

  this.checkIp = function() {
    D2Bot.printToConsole("IPHunter: IP found! - [" + ip + "] Game is : " + me.gamename + "//" + me.gamepassword, 7);
    print("IP found! - [" + ip + "] Game is : " + me.gamename + "//" + me.gamepassword);
    me.overhead(":D IP found! - [" + ip + "]");
    me.maxgametime = 999999990; // Added to override SoloPlay Chars.
    if (logD2soj) {
      say("/w *D2SOJ " + ".loggame " + Number(me.gameserverip.split(".")[3]) + ":" + me.profile + ":" + me.ladder + ":" + me.gamename + ":" + me.gamepassword + ":" + logname);
    }
    for (let i = 12; i > 0; i -= 1) {
      me.overhead(":D IP found! - [" + ip + "]" + (i - 1) + " beep left");
      if (useBeep) {
        beep();
      }
      delay(loopDelay);
    }
    while (true) {
      me.overhead(":D IP found! - [" + ip + "]");
      try {
        if (logD2soj) {
          say("/w *D2SOJ " + ".loggame " + Number(me.gameserverip.split(".")[3]) + ":" + me.profile + ":" + me.ladder + ":" + me.gamename + ":" + me.gamepassword + ":" + logname);
        }
        Town.move("waypoint");
        delay(loopDelay);
        Town.move("stash");
        delay(loopDelay);
        sendPacket(1, 0x40);
        delay(loopDelay);
      } catch (e) {
        // ensure it doesnt leave game by failing to walk due to desyncing.
      }
      for (let i = (12 * 9); i > 0; i -= 1) {
        me.overhead(":D IP found! - [" + ip + "] Next movement in: " + i + " sec.");
        delay(loopDelay);
      }
    }
  };
  if (logD2soj) {
    say("/w *D2SOJ " + ".logip " + Number(me.gameserverip.split(".")[3]) + ":" + me.ladder);
    delay(1000);
  }
  let profileOverride = profileOverrides.find(override => override.profile === myProfile);
  if (profileOverride) {
    if (profileOverride.ladder === "nonladder") {
      ladderOnly = false;
    }
    if (profileOverride.ladder === "ladder") {
      ladderOnly = true;
    }    
    hellOnly = profileOverride.hellOnly === true;
    useRealm = profileOverride.realm.toLowerCase();
    searchip = [Number(profileOverride.ip)];
    me.overhead("Profile Override Found - Profile: " + myProfile + ", IP: " + profileOverride.ip + ", Ladder: " + profileOverride.ladder + ", Realm: " + profileOverride.realm);
  } else {
    me.overhead("IP SCRIPT RUNNING - Current IP:" + ip + " Current Realm:" + curRealm);
  }
  if (searchip.indexOf(ip) > -1) {
    if (useRealm) {
      if (curRealm != useRealm) {
        me.overhead("Wrong Realm Skipping....");
        return true;
      }
    }
    if (ladderOnly) {
      if (me.ladder === 0) {
        me.overhead("Ladder Only Skipping...");
        return true;
      }
    }
    if (hellOnly) {
      if (me.diff != 2) {
        me.overhead("Hell Only Skipping...");
        return true;
      }
    }
    this.checkAndCreateOverride();
    addEventListener("chatmsg", this.chatEvent);
    this.checkIp();
  }
  return true;
}