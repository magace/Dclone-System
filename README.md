# DClone-System
**What does it do?**

This system is to be used with Kolbot to automatically load an additional "holder" into whatever games the "IPHunter" finds.

It can also automatically load in a Dclone Killer to kill and mule the anni for you.


**How to setup:**

Copy my files into your Kolbot folder.

Go to kolbot/libs/systems/iphunter/ and edit profileconfig.js  

- You will need to add your HOLDER, SOJSELLERS and KILLER profile names just like they appear on the d2bot manager to profileconfig.js  
- You must also select D2BotIPHolder.dbj or D2botIPKiller.dbj as the entry point on said profiles.
- If you set killClone to true the killerProfiles will automatically be loaded.
- If you set dropAnni to true after killing clone it will drop the anni in a1 by stash if set to false it should mule it.
- Start up the holder and smiter profiles (They should sit idle at this point until a hunter sends them a game)
- Go to kolbot/libs/scripts/ and edit IPHunter.js Here you will set the IP you want to search for under let searchip = []  Or you can set profileoverrides for specific realms, game modes, ips, and so on.

**Start up a profile running IPHunter and wait for it to find a game!  Once a game is found the hunter should find a hunter that has not been used and send it the gamename, password, and override settings from the iphunter game.**

**How to use SOJ sellers:**

- First, make sure you set them up in profileconfig.js
- Make sure you have sojs stocked up on the seller accounts.
- Set your admin charname in profileconfig.js
- Join any of the holder games with your admin char
- Type "bringsojs" with your main char.  The holder should load the SOJ sellers into game.
- Type "Charname sellsojs" to start selling.  If the character runs out of sojs and the walk does not happen type "othercharname sellsojs" and it will pick up where the other character left off.

Once DCLONE walks it should detect the walk msg and stop selling sojs.  It will also save a template with the details of the walk start soj count, total sojs sold, final soj count as well as log the walk to d2soj.com
  
**Notes:**

For soloplay and base kol config you will need to make sure you turn dclonewait and killdclone off on the holder's profiles.  It will use it's gameevent to avoid making edits to toolsthread.

I have a lot of cleanup to do, but this is at least in a "working" state loading additional char into the game and killing dclone.

I have not yet tested this on a live hunt but I will soon!

Should I rename IPHunter.js to something else and leave that script as is?

If you decide to log games to d2soj make sure to use the SAME account name you use on d2soj.com so you can view your games!
![image](https://github.com/magace/IPHunter-System/assets/7795098/ce119d13-aa8a-40aa-b35f-8cc4ae1abff6)









