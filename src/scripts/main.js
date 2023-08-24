import { setApi } from "../module.js";
import API from "./API/api.js";
import CONSTANTS from "./constants/constants.js";
import "./styles/styles.scss";
import * as lib from "./lib/lib.js";
import BankerSocket from "./sockets.js";

export const initHooks = () => {
  // setup all the hooks
  //   Hooks.once("socketlib.ready", registerSocket);
  //   registerSocket();
};

export const setupHooks = () => {
  setApi(API);
};

export const readyHooks = async () => {
  // Add any additional hooks if necessary
};

Hooks.once('item-piles-ready', async function() {

  if(game.itempiles.hooks.PILE.PRE_RENDER_INTERFACE) {
    Hooks.on(game.itempiles.hooks.PILE.PRE_RENDER_INTERFACE, lib.bankTellerRendered);
  }else {
    Hooks.on(game.itempiles.hooks.PILE.PRE_CLICK, lib.bankTellerRendered);
    Hooks.on(game.itempiles.hooks.PILE.PRE_DIRECTORY_CLICK, lib.bankTellerRendered);
  }
  Hooks.on(game.itempiles.hooks.PILE.PRE_RIGHT_CLICK_ITEM, lib.vaultItemRightClicked);

  game.itempiles.API.registerItemPileType("banker", "Banker", {
    maxVaults: {
      title: "Max Vaults",
      label: "This is how many vaults a single user can have with this bank",
      type: Number,
      value: 1
    },
    vaultCostFormula: {
      title: "Vault Cost Formula",
      label: "This is how much each vault costs in gold - the formula can contain \"@vaults\", which is how many vaults the user has",
      type: String,
      value: "(@vaults+1)*50"
    },
    folderName: {
      title: "Bank Base Folder Name",
      label: "This controls what the root folder of new bank vaults bought by players will be called.",
      type: String,
      value: "Bank Vaults"
    },
    defaultImage: {
      title: "Default Bank Vault Image",
      label: "This controls what any new bank vault actor image will be.",
      type: String,
      value: "icons/svg/item-bag.svg"
    },
    bankerColumns: {
      title: "Number Of Columns",
      label: "This is how many columns vaults created by this bank will have",
      type: Number,
      value: CONSTANTS.VAULT_DEFAULTS.cols
    },
    bankerRows: {
      title: "Number Of Rows",
      label: "This is how many rows vaults created by this bank will have",
      type: Number,
      value: CONSTANTS.VAULT_DEFAULTS.rows
    }
  });

  BankerSocket.initialize();

});
