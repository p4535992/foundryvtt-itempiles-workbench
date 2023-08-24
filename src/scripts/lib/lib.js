import CONSTANTS from "./constants.js";
import BankTellerApp from "./applications/bank-teller/bank-teller-app.js";
import BankManagementApp from "./applications/bank-management/bank-management-app.js";

// ================================
// Logger utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = "") {
  if (game.settings.get(CONSTANTS.MODULE_ID, "debug")) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, args);
  }
  return msg;
}

export function log(message) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  console.log(message.replace("<br>", "\n"));
  return message;
}

export function notify(message) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace("<br>", "\n"));
  return message;
}

export function info(info, notify = false) {
  info = `${CONSTANTS.MODULE_ID} | ${info}`;
  if (notify) ui.notifications?.info(info);
  console.log(info.replace("<br>", "\n"));
  return info;
}

export function warn(warning, notify = false) {
  warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace("<br>", "\n"));
  return warning;
}

export function error(error, notify = true) {
  error = `${CONSTANTS.MODULE_ID} | ${error}`;
  if (notify) ui.notifications?.error(error);
  return new Error(error.replace("<br>", "\n"));
}

export function timelog(message) {
  warn(Date.now(), message);
}

export const i18n = (key) => {
  return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key, data = {}) => {
  return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
  return `<p class="${CONSTANTS.MODULE_ID}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_ID}</strong>
        <br><br>${message}
    </p>`;
}

// =========================================================================================


export function bankTellerRendered(itemPile){

  const bankerActor = itemPile?.actor ?? itemPile;

  const flags = bankerActor.getFlag("item-piles", 'data');

  if(flags?.type !== "banker") return;

  if(!game.user.character){

    if(game.user.isGM){
      BankManagementApp.show({ bankerActor });
      return false;
    }

    ui.notifications.error("You must assign a character to your account, please go to the player configuration and select a character.")
    setTimeout(() => {
      new UserConfig(game.user).render(true)
    }, 100)
    return false;
  }

  const maxVaults = flags?.maxVaults ?? 1;

  const vaults = getVaults({ userId: game.user.id, bankerActor });
  if(maxVaults === 1 && vaults.length === 1){
    game.itempiles.API.renderItemPileInterface(vaults[0], { inspectingTarget: game.user.character });
  }else{
    BankTellerApp.show({ bankerActor });
  }

  return false;

}

export function evaluateFormula(formula, data, warn = true) {
  const rollFormula = Roll.replaceFormulaData(formula, data, { warn });
  return new Roll(rollFormula).evaluate({ async: false });
}

export function getVaults({ userId = false, bankerActor = false }={}){
  let bankVaults = false;
  if(userId){
    bankVaults = (bankVaults || game.actors).filter(actor => actor.getFlag(CONSTANTS.MODULE_NAME, 'vaultUserId') === userId);
  }
  if(bankerActor){
    bankVaults = (bankVaults || game.actors).filter(actor => actor.getFlag(CONSTANTS.MODULE_NAME, 'bankerActorId') === bankerActor.id)
  }
  return bankVaults;
}

export function getCostOfVault(bankerActor) {

  const totalVaults = getVaults({ userId: game.user.id });
  const currentVaults = getVaults({ bankerActor, userId: game.user.id });
  const flags = bankerActor.getFlag("item-piles", 'data');
  const baseVaultCost = flags.vaultCostFormula;

  const vaultTotal = evaluateFormula(baseVaultCost, {
    vaults: currentVaults.length,
    totalVaults: totalVaults.length
  }).total;

  if(vaultTotal === 0){
    return { vaultPrice: false, canBuy: true };
  }

  const vaultPrice = vaultTotal + "GP";

  const canBuy = game.user.character ? game.itempiles.API.getPaymentDataFromString(vaultPrice, {
    target: game.user.character
  })?.canBuy : false

  return { vaultPrice, canBuy };

}

export async function createNewVault(bankerActor, vaultName){

  const { vaultPrice, canBuy } = getCostOfVault(bankerActor);

  const flags = bankerActor.getFlag("item-piles", 'data');

  const folderStructure = [bankerActor.name, `${game.user.name}`];

  if(flags?.folderName){
    folderStructure.unshift(flags?.folderName);
  }else{
    folderStructure.unshift("Bank Vaults");
  }

  if(!canBuy) return;

  const result = await game.itempiles.API.createItemPile({
    actor: vaultName,
    createActor: true,
    folders: folderStructure,
    itemPileFlags: CONSTANTS.GET_VAULT_DEFAULTS(bankerActor),
    actorOverrides: {
      img: flags.defaultImage || "icons/svg/item-bag.svg",
      [CONSTANTS.FLAG]: {
        vaultUserId: game.user.id,
        bankerActorId: bankerActor.id,
      }
    }
  });

  if (!result.actorUuid) return false;

  const bankVault = fromUuidSync(result.actorUuid);

  if(!bankVault) return false;

  if(vaultPrice) {
    await game.itempiles.API.removeCurrencies(game.user.character, vaultPrice);
  }

  return bankVault;

}


export function getActiveApps(id, single = false) {
  const apps = Object.values(ui.windows).filter(app => app.id.startsWith(id) && app._state > Application.RENDER_STATES.CLOSED);
  if (single) {
    return apps?.[0] ?? false;
  }
  return apps;
}


export function getSetting(key, localize = false) {
  const value = game.settings.get(CONSTANTS.MODULE_NAME, key);
  if (localize) return game.i18n.localize(value);
  return value;
}


export function getItemPileSetting(key, localize = false) {
  const value = game.settings.get("item-piles", key);
  if (localize) return game.i18n.localize(value);
  return value;
}


export function setSetting(key, value) {
  return game.settings.set(CONSTANTS.MODULE_NAME, key, value);
}


export function vaultItemRightClicked(item, contextMenu, vault) {
  if(!game.user.isGM) return;

  const bankerActorId = vault.getFlag(CONSTANTS.MODULE_NAME, 'bankerActorId');
  if(!bankerActorId) return;

  const bankerActor = game.actors.get(bankerActorId);
  if(!bankerActor) return;

  const userId = vault.getFlag(CONSTANTS.MODULE_NAME, 'vaultUserId');
  if(!userId) return;

  const user = game.users.get(userId);
  if(!user) return;

  contextMenu.push({
    icon: 'fas fa-handcuffs', label: "Confiscate", onPress: async () => {
      await game.itempiles.API.transferItems(vault, bankerActor, [item], { vaultLogData: { action: "confiscated" }});
      bankerActor.sheet.render(true, { focus: true, bypassItemPiles: true });
      ui.notifications.warn(`\"${item.name}\" was confiscated from ${user.name}'s \"${vault.name}\" vault and put in ${bankerActor.name}'s inventory`, { permanent: true });
    }
  });
}


