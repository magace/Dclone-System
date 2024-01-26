/**
*  @filename    DcloneKiller.js
*  @author      kolton, magace
*  @desc        Go to Palace Cellar level 3 and kill Diablo Clone.
*  @credits     theBguy, kolton for refrences and stolen work. :)
*/

function DcloneKiller () {
  let anniWait = true;
  let dropAnni = holderConfig.killerSettings.dropAnni;
  const holderConfig = require('../../systems/dclone/profileConfig');
  let dropMsg = holderConfig.killerSettings.dropAnniMsg;
  let stopHolderProfile = holderConfig.killerSettings.stopHolderProfile;
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
  delay(2000); // Probably not needed
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
        say(dropMsg);
        let configString = JSON.stringify(blankConfig, null, 2);
        FileAction.write("logs/dclone/" + me.profile + ".json", configString);
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
        FileAction.write("logs/dclone/" + me.profile + ".json", configString);
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
      FileAction.write("logs/dclone/" + me.profile + ".json", configString);
      quit();    
    }
  }
  return true;
}
