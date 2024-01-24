# IPHunter-System
 IPHunter System for Kolbot

What does it do?

This system is to be used with Kolbot to automatically load an additional "holder" into whatever games the "IPHunter" finds.

Then it can release the hunter to keep hunting or keep it there to double-hold the IP.

If your net drops or for some reason you drop from the game the holder profile will attempt to rejoin the game.

**How to setup:**

Copy my files into your Kolbot folder.

Go to kolbot/libs/systems/iphunter/ and edit profileconfig.js  You will need to add your HOLDER profile names just like they appear on the d2bot manager to holderProfiles.  You must also select D2BotIPHolder.dbj as the entry point on said profiles.

Start up the holder profiles (They should sit idle at this point until iphunter sends them a game)

Go to kolbot/libs/scripts/ and edit IPHunter.js Here you will set the IP you want to search for under let searchip = []  Or you can set profileoverrides for specific realms, game modes, ips, and so on.

Start up a profile running IPHunter and wait for it to find a game!  Once a game is found the hunter should find a hunter that has not been used and send it the gamename, password, and override settings from the iphunter game.

**Note:**

I have a lot of cleanup to do, but this is at least in a "working" state loading additional char into the game.

Dclone killers are not set up yet.

Should I rename IPHunter.js to something else and leave that script as is?

If you decide to log games to d2soj make sure to use the SAME account name you use on d2soj.com so you can view your games!
![image](https://github.com/magace/IPHunter-System/assets/7795098/ce119d13-aa8a-40aa-b35f-8cc4ae1abff6)









