/**
*  @filename    IPHolder.js
*  @author      kolton, Mercoory, thebguy, magace
*  @desc        IP Holder script used to ensure you stay in the game you want to hold
*  @credits     theBguy, kolton for refrences and stolen work. :)
*/

function IPHolder() {
  let ip = Number(me.gameserverip.split(".")[3]);
  const holderConfig = require('../../systems/dclone/profileConfig');
  let logname = holderConfig.generalSettings.D2sojLogName;
  let logD2soj = holderConfig.generalSettings.logToD2soj;
  let ladderOnly = holderConfig.holderSettings.ladderOnly;
  let hellOnly = holderConfig.holderSettings.hellOnly;
  let useBeep = holderConfig.holderSettings.useBeep;
  let closeHunter = holderConfig.holderSettings.closeHunter;
  let loopDelay = holderConfig.holderSettings.loopDelay;
  let useRealm = holderConfig.holderSettings.useRealm;
  let bringSojCommand = holderConfig.sojsellerSettings.bringSojCommand;
  let requestHelpCommand = holderConfig.killerSettings.requestHelpCommand
  let helperLoaded = false;
  let autoKillOverride = false;
  if (holderConfig.killerSettings.killClone) {
    autoKillOverride = true;
  }
  let blankConfig = {
    gamename: "",
    gamepass: "",
    profileovveride: "",
    isused: false,
    requestkill: false
  };
  let jsonContent = FileAction.read("logs/dclone/" + me.profile + ".json");
  let jsonInfo = JSON.parse(jsonContent);
  let loadAutoKiller = jsonInfo.requestkill;
  let diabloWalked = false;
  let searchip = [];
  Config.Silence = false;
  Config.StopOnDClone = false; // Go to town and idle as soon as Diablo walks the Earth
  Config.SoJWaitTime = 0; // Time in minutes to wait for another SoJ sale before leaving game. 0 = disabled
  Config.KillDclone = false; // Go to Palace Cellar 3 and try to kill Diablo Clone. Pointless if you already have Annihilus.
  Config.DCloneQuit = false; 
  me.maxgametime = 0;
  D2Bot.printToConsole(jsonInfo.profileovveride);
  let profileOverrides = [];
  try {
    let profileOverrideObj = JSON.parse(jsonInfo.profileovveride);
    profileOverrides.push(profileOverrideObj);
  } catch (err) {
    print("Error parsing profileovveride: " + err);
  }
  let myProfile = me.profile;
  let curRealm = me.realm.toLowerCase()
  this.chatEvent = function (nick, msg) {
    if (nick) {
      var lowerMsg = msg.toLowerCase();
      if (lowerMsg.startsWith(requestHelpCommand)) {
        if (diabloWalked) {
          this.checkAndLoadKiller();
        } else {
          say("Diablo has not walked yet...");
        }
      }
      switch (msg) {
        case "Anni Done":
          let configString = JSON.stringify(blankConfig, null, 2);
          FileAction.write("logs/dclone/" + me.profile + ".json", configString);
          D2Bot.restart();
        case bringSojCommand:
          if (nick === holderConfig.sojsellerSettings.sellerAdmin) {
            say("!Time to sell some sojs");
            this.checkAndLoadSeller();
          } else {
            say("!" + nick + " are you a admin???");
          }
          
          break;        
      }
    }
  };
  this.gameEvent = function (mode, param1, param2, name1, name2) {
    switch (mode) {
      
    case 0x02:  //join
      say("Welcome if you need help type " + requestHelpCommand +" and I will bring a smiter in to kill. Once you are finished you may type: Anni Done");
      delay("3000")
      break;      
    case 0x11: // "%Param1 Stones of Jordan Sold to Merchants"
      if (logD2soj) {
        say("/w *D2SOJ " + ".logsale " + me.gameserverip.split(".")[3] + ":" + me.ladder + ":" + param1 + ":" + logname);
        delay(3000);
      }
      break;
    case 0x12: // "Diablo Walks the Earth"
      diabloWalked = true;
      if (logD2soj) {
        say("/w *D2SOJ .logwalk " + me.gameserverip.split(".")[3] + ":" + me.ladder + ":" + "unknown" + ":" + logname + ":" + "Walk");
        delay(3000);
      }
      break;
    }
  };
  addEventListener("chatmsg", this.chatEvent);
  addEventListener("gameevent", this.gameEvent);
  this.checkAndLoadKiller = function() {
    if (holderConfig.killerProfiles.length <= 0) {
      say("No killers setup...")
      return;
    }
    for (let i = 0; i < holderConfig.killerProfiles.length; i++) {
      if (helperLoaded) {
        return;
      }
      let potentialKiller = holderConfig.killerProfiles[i];
      let logPath = "logs/dclone/" + potentialKiller + ".json";
      print("CHECKING FOR AVALIABLE KILLERS " + potentialKiller);
      if (FileTools.exists(logPath)) {
        print(logPath + " Found");
        let fileContent = FileAction.read(logPath);
        try {
          let jsonData = JSON.parse(fileContent);
          if (!jsonData.requestkill) {
            print("Found available holder:" + potentialKiller);
            jsonData.gamename = me.gamename;
            jsonData.gamepass = me.gamepassword;
            jsonData.requestkill = true;
            let updatedJsonString = JSON.stringify(jsonData);
            FileAction.write(logPath, updatedJsonString);
            helperLoaded = true;
            return;
          }
        } catch (err) {
          D2Bot.printToConsole("Error parsing JSON from file" +  logPath + " " + err);
        }
      } else {
        D2Bot.printToConsole("NO FILE FOUND IN: logs/dclone/" + potentialKiller + ".json");
      }
    }
    say("!No free clone killers please try again in a few minutes.");
    delay(10000);
    return;
  };
  this.checkAndLoadSeller = function() {
    if (holderConfig.sojSellers.length <= 0) {
      say("No Sellers setup...")
      return;
    }
    for (let i = 0; i < holderConfig.sojSellers.length; i++) {
      if (diabloWalked) {
        return;
      }
      let potentialSeller = holderConfig.sojSellers[i];
      let logPath = "logs/dclone/" + potentialSeller + ".json";
      print("CHECKING FOR AVALIABLE KILLERS " + potentialSeller);
      if (FileTools.exists(logPath)) {
        print(logPath + " Found");
        let fileContent = FileAction.read(logPath);
        try {
          let jsonData = JSON.parse(fileContent);
          if (!jsonData.requestSell) {
            print("Found available holder:" + potentialSeller);
            jsonData.gamename = me.gamename;
            jsonData.gamepass = me.gamepassword;
            jsonData.requestSell = true;
            let updatedJsonString = JSON.stringify(jsonData);
            FileAction.write(logPath, updatedJsonString);
            say("!SOJ SELLERS ARE ON THE WAY!!");
          }
        } catch (err) {
          D2Bot.printToConsole("Error parsing JSON from file" +  logPath + " " + err);
        }
      } else {
        D2Bot.printToConsole("NO FILE FOUND IN: logs/dclone/" + potentialSeller + ".json");
      }
    }
    say("!No free soj sellers found?");
    delay(10000);
    return;
  };
  this.checkIp = function() {
    D2Bot.printToConsole("IPHunter: IP found! - [" + ip + "] Game is : " + me.gamename + "//" + me.gamepassword, 7);
    print("IP found! - [" + ip + "] Game is : " + me.gamename + "//" + me.gamepassword);
    me.overhead(":D IP found! - [" + ip + "]");
    
    if (logD2soj) {
      say("/w *D2SOJ " + ".loggame " + Number(me.gameserverip.split(".")[3]) + ":" + me.profile + ":" + me.ladder + ":" + me.gamename + ":" + me.gamepassword + ":" + logname);
    }
    for (let i = 12; i > 0; i -= 1) {
      me.overhead(":D IP found! - [" + ip + "]" + (i - 1) + " beep left");
      if (useBeep) {
        beep();
      }
      delay(250);
    }
    while (true) {
      me.overhead(":D IP found! - [" + ip + "]");
      try {
        if (logD2soj) {
          say("/w *D2SOJ " + ".loggame " + Number(me.gameserverip.split(".")[3]) + ":" + me.profile + ":" + me.ladder + ":" + me.gamename + ":" + me.gamepassword + ":" + logname);
        }
        Town.move("waypoint");
        delay(250);
        Town.move("stash");
        delay(250);
        sendPacket(1, 0x40);
        delay(250);
      } catch (e) {
        // ensure it doesnt leave game by failing to walk due to desyncing.
      }
      for (let i = (12 * 9); i > 0; i -= 1) {
        me.overhead(":D IP found! - [" + ip + "] Next movement in: " + i + " sec.");
        delay(loopDelay);
        jsonContent = FileAction.read("logs/dclone/" + me.profile + ".json");
        jsonInfo = JSON.parse(jsonContent);
        loadAutoKiller = jsonInfo.requestkill;
        if (loadAutoKiller || autoKillOverride) {
          this.checkAndLoadKiller();
        }
      }
    }
  }; 
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
    me.overhead("Profile Override Found - Profile: " + myProfile + ", IP: " + profileOverride.ip + ", Ladder: " + profileOverride.ladder + ", Realm: " + profileOverride.realm + loadAutoKiller);
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
    if (closeHunter) {
      say("release IP");
      delay(3000);
    }
    this.checkIp();
  }
  let configString = JSON.stringify(blankConfig, null, 2);
  FileAction.write("logs/dclone/" + me.profile + ".json", configString);
  return true;
}