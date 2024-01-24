/**
*  @filename    IPHolder.js
*  @author      kolton, Mercoory, thebguy, magace
*  @desc        IP Holder script used to ensure you stay in the game you want to hold
*/

function IPHolder() {
  let logname = "Magace"; //  DONT FORGET TO SET THIS TO YOUR USERNAME ON d2soj.com
  let logD2soj = true;
  let ladderOnly = true;
  let hellOnly = true;
  let useBeep = false;
  let autoKillOverride = false; // This will force autokiller to come if set to true.
  let closeHunter = true;  // Make the hunter leave game once the IP is held?
  let loopDelay = 1000; // Origional script was causing some users CPU to spike.
  let useRealm = "useast"; // useast uswest europe
  // END OF USER CONFIG
  const holderConfig = require('../../systems/iphunter/profileConfig');
  if (holderConfig.generalSettings.killClone) {
    autoKillOverride = true;
  } else {
    autoKillOverride = false;
  }
  let blankConfig = {
    gamename: "",
    gamepass: "",
    profileovveride: "",
    isused: false,
    requestkill: false
  };
  let jsonContent = FileAction.read("logs/ipholder/" + me.profile + ".json");
  let jsonInfo = JSON.parse(jsonContent);
  let loadAutoKiller = jsonInfo.requestkill;
  let diabloWalked = true;
  let searchip = []
  Config.Silence = false;
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
  let ip = Number(me.gameserverip.split(".")[3]);

  this.chatEvent = function (nick, msg) {
    if (nick) {
      var lowerMsg = msg.toLowerCase();
      if (lowerMsg.startsWith("helpme")) {
        if (diabloWalked) {
          this.checkAndLoadKiller();
        } else {
          say("Diablo has not walked yet...");
        }
      }
      switch (msg) {
        case "Anni Done":
          let configString = JSON.stringify(blankConfig, null, 2);
          FileAction.write("logs/ipholder/" + me.profile + ".json", configString);
          D2Bot.restart();
      }
    }
  };
  this.gameEvent = function (mode, param1, param2, name1, name2) {
    switch (mode) {
      
    case 0x02:  //join
      say("Welcome if you need help type helpme and I will bring a smiter in to kill.");
      break;      
    case 0x11: // "%Param1 Stones of Jordan Sold to Merchants"

      break;
    case 0x12: // "Diablo Walks the Earth"
      diabloWalked = true;
      break;
    }
  };

  addEventListener("chatmsg", this.chatEvent);
  addEventListener("gameevent", this.gameEvent);
  this.checkAndLoadKiller = function() {
    if (holderConfig.killerProfiles.length <= 0) {
      say("No killers found...")
      return;
    }
    for (let i = 0; i < holderConfig.killerProfiles.length; i++) {
      let potentialKiller = holderConfig.killerProfiles[i];
      let logPath = "logs/ipholder/" + potentialKiller + ".json";
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
            D2Bot.start(requestedPlayer);
            return;
          }
        } catch (err) {
          D2Bot.printToConsole("Error parsing JSON from file" +  logPath + " " + err);
        }
      } else {
        D2Bot.printToConsole("NO FILE FOUND IN: logs/ipholder/" + potentialKiller + ".json");
      }
    }
    say("No free clone killers please try again in a few minutes.");
    return;
  }
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
        jsonContent = FileAction.read("logs/ipholder/" + me.profile + ".json");
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
  FileAction.write("logs/ipholder/" + me.profile + ".json", configString);
  return true;
}