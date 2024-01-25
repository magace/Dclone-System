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
    "generalSettings": {
      "killClone": false,
      "dropAnni": false
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