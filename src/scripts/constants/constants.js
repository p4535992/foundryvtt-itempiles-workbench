const CONSTANTS = {
  MODULE_ID: "item-piles-workbench",
  PATH: `modules/item-piles-workbench/`,
  MODULE_NAME: "item-piles-workbench",
  FLAG: `flags.item-piles-workbench`,

  GET_VAULT_DEFAULTS: (workbenchActor) => {
    const defaults = foundry.utils.duplicate(CONSTANTS.VAULT_DEFAULTS);
    defaults.vaultAccess[0].uuid = game.user.uuid;
    const flags = workbenchActor.getFlag("item-piles", "data");
    defaults.cols = Math.max(1, flags?.workbenchColumns ?? 12);
    defaults.rows = Math.max(1, flags?.workbenchRows ?? 8);
    return defaults;
  },

  VAULT_DEFAULTS: {
    type: "vault",
    cols: 12,
    rows: 8,
    vaultExpansion: true,
    baseExpansionCols: 2,
    baseExpansionRows: 8,
    preventVaultAccess: true,
    vaultAccess: [
      {
        uuid: "",
        organize: true,
        items: {
          withdraw: true,
          deposit: true,
        },
        currencies: {
          withdraw: true,
          deposit: true,
        },
      },
    ],
    logVaultActions: true,
    vaultLogType: "user",
  },
};

CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_ID}/`;

export default CONSTANTS;
