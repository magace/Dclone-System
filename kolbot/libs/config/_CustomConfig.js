const CustomConfig = {
  /* Format:
		"Config_Filename_Without_Extension": ["array", "of", "profiles"]

		Multiple entries are separated by commas
	*/
  // Below are how I use the custom configs.
  "ipholder": generateCustomConfigs("SCL-SORC-", 60, 90),
  "barbholder": generateCustomConfigs("SCL-BARB-", 0, 35),
  "smiters": ["SMITE1", "SMITE2", "SMITE3","SMITE4"]
};

function generateCustomConfigs(enabledBase, startIndex, endIndex) {
  const enabledProfiles = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const paddedIndex = i.toString().padStart(2, "0");
    const profile = enabledBase + paddedIndex;
    enabledProfiles.push(profile);
  }
  return enabledProfiles;
}