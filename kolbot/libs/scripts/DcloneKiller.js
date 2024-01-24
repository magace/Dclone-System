/**
*  @filename    DcloneKiller.js
*  @author      kolton, magace
*  @desc        Go to Palace Cellar level 3 and kill Diablo Clone.
*
*/

function DcloneKiller () {
  let anniWait = true;
  let dropAnni = false;
  const holderConfig = require('../../systems/iphunter/profileConfig');
  if (holderConfig.generalSettings.dropAnni) {
    dropAnni = true;
  } else {
    dropAnni = false;
  }
  let stopHolderProfile = true;
  let blankConfig = {
    gamename: "",
    gamepass: "",
    requestkill: false
  };
  Pather.useWaypoint(sdk.areas.ArcaneSanctuary);
  Precast.doPrecast(true);
  if (!Pather.usePortal(null)) {
    throw new Error("Failed to move to Palace Cellar");
  }
  Attack.kill(sdk.monsters.DiabloClone);
  while (anniWait) {
    me.overhead("Looking for ANNI");
    let Anni = getUnits(sdk.unittype.Item, sdk.items.SmallCharm)
      .find(item => item.unique && item.onGroundOrDropping);
    if (Anni && Pickit.pickItem(Anni)) {
      me.overhead("Picked up ANNI");
      if (dropInA1) {
        Town.goToTown(1);
        Town.move("stash");
        Anni.drop();
        say("!Thanks for using D2Soj.com!")
        let configString = JSON.stringify(blankConfig, null, 2);
        FileAction.write("logs/ipholder/" + me.profile + ".json", configString);
        if (stopHolderProfile) {
          say("Anni Done");
          delay(2000);
          quit();
        }
      } else {
        if (stopHolderProfile) {
          say("Anni Done");
          delay(2000);
        }
        let configString = JSON.stringify(blankConfig, null, 2);
        FileAction.write("logs/ipholder/" + me.profile + ".json", configString);
        if (AutoMule.getInfo() && AutoMule.getInfo().hasOwnProperty("torchMuleInfo")) {
          scriptBroadcast("muleAnni");
        } 
      }
    } else {
      me.overhead("Anni Not Found...");
      if (stopHolderProfile) {
        say("Anni Done");
        delay(2000);
      }
      let configString = JSON.stringify(blankConfig, null, 2);
      FileAction.write("logs/ipholder/" + me.profile + ".json", configString);
      quit();    
    }
  }
  return true;
}
