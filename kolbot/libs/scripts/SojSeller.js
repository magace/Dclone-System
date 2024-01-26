/**
*  @filename    SojSeller.js
*  @author      magace
*  @desc        Keeps track and sells sojs..
*  @credits     theBguy, kolton for refrences and stolen work. :)
*/

function SojSeller() {
  let ip = Number(me.gameserverip.split(".")[3]);
  const holderConfig = require('../../systems/dclone/profileConfig');
  let logname = holderConfig.generalSettings.D2sojLogName;
  let logD2soj = holderConfig.generalSettings.logToD2soj;
  let sellSojCommand = holderConfig.sojsellerSettings.sellSojCommand;
  let startCount = 0;
  let endCount = 0;
  let totalSold = 0;
  let firstsale = false;
  let diabloWalked = false;
  let sellingSojs = false;
  let finishedConfig = {
    gamename: "",
    gamepass: "",
    ip: ip,
    startCount: startCount,
    endCount: endCount,
    totalSold: totalSold,
    requestSell: false,
    outOfSojs: true,
  };

    /**
   * Interact and open the menu of an NPC unit
   * @param {NPCUnit} npc 
   * @returns {boolean}
   */
    const openMenu = function (npc) {
      if (!npc || npc.type !== sdk.unittype.NPC) throw new Error("Unit.openMenu: Must be used on NPCs.");
      let interactedNPC = getInteractedNPC();
      if (interactedNPC && interactedNPC.name !== npc.name) {
        Packet.cancelNPC(interactedNPC);
        me.cancel();
      }
      if (getUIFlag(sdk.uiflags.NPCMenu)) return true;
      for (let i = 0; i < 10; i += 1) {
        npc.distance > 5 && Pather.walkTo(npc.x, npc.y);
        if (!getUIFlag(sdk.uiflags.NPCMenu)) {
          Packet.entityInteract(npc);
          sendPacket(1, sdk.packets.send.NPCInit, 4, 1, 4, npc.gid);
        }
        let tick = getTickCount();
        while (getTickCount() - tick < Math.max(Math.round((i + 1) * 250 / (i / 3 + 1)), me.ping + 1)) {
          if (getUIFlag(sdk.uiflags.NPCMenu)) {
            return true;
          }
          delay(10);
        }
      }
  
      me.cancel();
  
      return false;
    };
  this.moveSojs = function () {
    let counts = this.getSojCounts();
    let inventoryCount = counts.inventoryCount;
    let storageCount = counts.storageCount;
    let cubeCount = counts.cubeCount;
  
    // Check if inventoryCount is less than 40
    if (inventoryCount < 40) {
      // Calculate how many more SoJs you need to reach 40
      let neededSojs = 40 - inventoryCount;
      let toMoveFromStorage = 0;
      let toMoveFromCube = 0;
  
      // Decide from where to move SoJs based on their availability in storage and cube
      if (storageCount >= cubeCount && storageCount > 0) {
        toMoveFromStorage = Math.min(neededSojs, storageCount);
      } else if (cubeCount > storageCount && cubeCount > 0) {
        toMoveFromCube = Math.min(neededSojs, cubeCount);
      }
  
      // Print the information
      if (toMoveFromStorage > 0 || toMoveFromCube > 0) {
        say("!We need " + neededSojs + " more SoJs in inventory.");
        if (toMoveFromStorage > 0) {
          say("!We can move " + toMoveFromStorage + " SoJs from storage to inventory.");
          Town.openStash();
          for (let i = 0; i < toMoveFromStorage; i++) {
            let Soj = me.findItem(sdk.items.Ring, -1, sdk.storage.Storage);
            if (Soj) {
                Storage.Inventory.MoveTo(Soj);
            }
          }
          me.cancel();
        }
        delay(2000);
        if (toMoveFromCube > 0) {
          say("!We can move " + toMoveFromCube + " SoJs from cube to inventory.");
          Town.openStash();
          for (let i = 0; i < toMoveFromCube; i++) {
            let Soj = me.findItem(sdk.items.Ring, -1, sdk.storage.Cube);
            if (Soj) {
                Storage.Inventory.MoveTo(Soj);
            }
          }
          me.cancel();
        }
      } else {
        say("!No SoJs found in storage or cube.");
      }
    } else {
      say("!Inventory already has 40 SoJs.");
    }
  };
  
  this.sellSojs = function (sellCount) {
    Town.goToTown(1);
    Town.move(NPC.Charsi);
    let menuId = "Repair"
    let npc = Game.getNPC(NPC.Charsi);
    
    openMenu(npc);
    if(npc.startTrade(menuId)) {
      say("!NPC OPEN");
      sellingSojs = true;
      while (sellingSojs) {
        let unit = me.findItem(sdk.items.Ring, -1, sdk.storage.Inventory)
        if (unit.isInInventory && unit.sellable) {
          try {
            unit.sell();
            totalSold++;
            say("!Selling Soj #" + totalSold);
          } catch (e) {
            console.error(e);
          }
          delay(500);
        } else {
          let sojCheck = this.getSojCounts();
          let remainingSojs = sojCheck.totalCount;
          if (remainingSojs >= 1 ) {
            say("!We should have " + remainingSojs + " left.");
            this.moveSojs();
            this.sellSojs();
          } else {
            say("!out of Sojs");
            break;
          }
          
        }
      }
      if (diabloWalked) {
        endCount = startCount + totalSold;
        say("Dclone Walked @" + endCount + " I sold a total of " + totalSold + " Sojs.");
        delay(3000);
        if (logD2soj) {
          say("/w *D2SOJ .logwalk " + me.gameserverip.split(".")[3] + ":" + me.ladder + ":" + endCount + ":" + logname + ":" + "walk");
          delay(3000);
        }
      } else {
        say("sojsold " + totalSold);
        delay(3000);
      }
     
    } else {
      say("!FAILED TO OPEN NPC WINDOW");
    }
    
  };
  this.chatEvent = function (nick, msg) {
    if (nick) {
      var lowerMsg = msg.toLowerCase();
      if (lowerMsg.startsWith(me.name + " " + sellSojCommand)) {
        if (nick === holderConfig.sojsellerSettings.sellerAdmin || nick === me.name) {
          let counts = this.getSojCounts();
          if (counts.totalCount >= 1 || !diabloWalked) {
            this.moveSojs();
            this.sellSojs();
          } else {
            say("!I am out of SOJS...");
          }
        } else {
          say("!" + nick + " are you a admin???");
        }
      }
      if (lowerMsg.startsWith("sojsold")) {
        let alreadySold = lowerMsg.split(" ").slice(1).join(" ");
        totalSold = alreadySold;
        say("!Already Sold: " + alreadySold + " - Total sold: " + totalSold);
      }
      switch (msg) {
        case "testwalk":
          diabloWalked = true;
          sellingSojs = false;
          break;        
      }
    }
  };
  this.getSojCounts = function () {
    let inventoryCount = me.findItems(sdk.items.Ring, -1, sdk.storage.Inventory).length || 0;
    let storageCount = me.findItems(sdk.items.Ring, -1, sdk.storage.Stash).length || 0;
    let cubeCount = me.findItems(sdk.items.Ring, -1, sdk.storage.Cube).length || 0;
    let totalCount = inventoryCount + storageCount + cubeCount;
    let countsObject = {
      inventoryCount: inventoryCount,
      storageCount: storageCount,
      cubeCount: cubeCount,
      totalCount: totalCount
    };
    return countsObject;
  }
  this.gameEvent = function (mode, param1, param2, name1, name2) {
    switch (mode) {
      
    case 0x02:  //join
      say("Welcome if you need help type helpme and I will bring a smiter in to kill.");
      break;      
    case 0x11: // "%Param1 Stones of Jordan Sold to Merchants"
      if (!firstsale) {
        startCount = param1;
      } else {

      }
      
      break;
    case 0x12: // "Diablo Walks the Earth"
      diabloWalked = true;
      sellingSojs = false;
      break;
    }
  };

  addEventListener("chatmsg", this.chatEvent);
  addEventListener("gameevent", this.gameEvent);
  me.overhead("Loaded");
  while (true) {

    delay(1000);
  }
}

