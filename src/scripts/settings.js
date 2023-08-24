import { debug, log, warn, i18n } from "./lib/lib.js";
import CONSTANTS from "./constants/constants.js";
import SETTINGS from "./constants/settings.js";

export const registerSettings = function () {
  game.settings.register(CONSTANTS.MODULE_ID, "enableForNpc", {
    name: `${CONSTANTS.MODULE_ID}.setting.enableForNpc.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.enableForNpc.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableForVehicle", {
    name: `${CONSTANTS.MODULE_ID}.setting.enableForVehicle.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.enableForVehicle.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableEvenForGM", {
    name: `${CONSTANTS.MODULE_ID}.setting.enableEvenForGM.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.enableEvenForGM.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================================

  game.settings.register(CONSTANTS.MODULE_ID, SETTINGS.debug, {
    name: `${CONSTANTS.MODULE_ID}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });
};
