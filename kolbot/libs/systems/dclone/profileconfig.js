// config.js
/**
*  @filename    profileconfig.js
*  @author      Magace
*  @desc        Configuration file for IPHunter System
*
*/

(function (module) {
  module.exports = {
    holderProfiles: generateHolderProfiles("SCL-SORC-", 60, 90),  // example profile for SCL-SORC-60 threw 90. you could also just use ["whateverprofile","moreprofiles"],
    killerProfiles: [
      "SMITE1"
    ],
    sojSellers: [
      "SOJSELLER1",
      "SOJSELLER2"
    ],
    "generalSettings": {
      "killClone": false, // This will automatically try to load one of the killerProfiles when dclone walks
      "dropAnni": false,  // When set to false the killer will mule the anni when set to true it will drop in a1 by stash.  Public walks?
      "sellerAdmin": "FU" // CHARNAME of admin that can request sojholders to join game and sell sojs. If he says "sellsojs" in game it will try to load a profile.  IDK best way to do this yet.
    }
  };
})(module);
function generateHolderProfiles(enabledBase, startIndex, endIndex) {
  const enabledProfiles = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const paddedIndex = i.toString().padStart(2, "0");
    const profile = enabledBase + paddedIndex;
    enabledProfiles.push(profile);
  }
  return enabledProfiles;
}