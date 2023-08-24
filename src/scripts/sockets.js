import CONSTANTS from "./constants/constants";

export default class WorkbenchSocket {
  static HANDLERS = {
    RENAME_VAULT: "renameVault",
  };

  static BINDINGS = {
    [this.HANDLERS.RENAME_VAULT]: (vaultActorUuid, newName) => {
      const vaultActor = fromUuidSync(vaultActorUuid);
      return vaultActor.update({ name: newName });
    },
  };

  static FUNCTIONS = {
    RENAME_VAULT: (vaultActor, newName) => {
      return WorkbenchSocket._socket.executeAsGM(WorkbenchSocket.HANDLERS.RENAME_VAULT, vaultActor.uuid, newName);
    },
  };

  static _socket;

  static initialize() {
    this._socket = socketlib.registerModule(CONSTANTS.MODULE_NAME);
    for (let [key, callback] of Object.entries(this.BINDINGS)) {
      this._socket.register(key, callback);
    }
  }
}
