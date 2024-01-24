/**
*  @filename    IPHolder.js
*  @author      kolton, Mercoory, thebguy, magace
*  @desc        IP Holder script used to ensure you stay in the game you want to hold
*/

function IPHolder() {
  let logname = ""; //  DONT FORGET TO SET THIS TO YOUR USERNAME ON d2soj.com
  let logD2soj = false;
  let ladderOnly = true;
  let hellOnly = true;
  let useBeep = false;
  let closeHunter = true;  // Make the hunter leave game once the IP is held?
  let loadAutoKiller = false; // Loads a smiter from systems/iphunter/profileconfig.js (not added)
  let loopDelay = 1000;
  let useRealm = "useast"; // useast uswest europe
  // END OF USER CONFIG


  let searchip = []
  Config.Silence = false;
  me.maxgametime = 0;
  let jsonContent = FileAction.read("logs/ipholder/" + me.profile + ".json");
  let jsonInfo = JSON.parse(jsonContent);
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
    if (closeHunter) {
      say("release IP");
      delay(3000);
    }
    this.checkIp();
  }
  return true;
}