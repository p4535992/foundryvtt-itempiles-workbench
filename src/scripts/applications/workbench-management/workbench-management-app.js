import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import WorkbenchManagementShell from "./workbench-management-shell.svelte";
import * as lib from "../../lib/lib.js";

export default class WorkbenchManagementApp extends SvelteApplication {
  constructor(options, dialogOptions) {
    super(
      {
        id: `item-piles-management-${options.workbenchActor?.id}-${randomID()}`,
        title: options.workbenchActor.name,
        ...options,
      },
      dialogOptions
    );
  }

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      svelte: {
        class: WorkbenchManagementShell,
        target: document.body,
      },
      classes: ["app window-app sheet item-piles-workbench"],
      zIndex: 100,
      width: 800,
      height: "auto",
      closeOnSubmit: false,
      resizable: false,
    });
  }

  static getActiveApp(id = "") {
    return lib.getActiveApps(`item-piles-workbench-${id}`, true);
  }

  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp(options.workbenchActor.id);
    if (app) {
      app.render(false, { focus: true });
      return;
    }
    return new Promise((resolve) => {
      options.resolve = resolve;
      new this(options, dialogData).render(true, { focus: true });
    });
  }

  /** @override */
  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    const canConfigure = game.user.isGM;
    if (canConfigure) {
      buttons = [
        {
          label: !lib.getItemPileSetting("hideActorHeaderText") ? "ITEM-PILES.Inspect.OpenSheet" : "",
          class: "item-piles-open-actor-sheet",
          icon: "fas fa-user",
          onclick: () => {
            this.options.workbenchActor.sheet.render(true, { focus: true, bypassItemPiles: true });
          },
        },
        {
          label: !lib.getItemPileSetting("hideActorHeaderText") ? "ITEM-PILES.HUD.Configure" : "",
          class: "item-piles-configure-pile",
          icon: "fas fa-box-open",
          onclick: () => {
            game.itempiles.apps.ItemPileConfig.show(this.options.workbenchActor);
          },
        },
      ].concat(buttons);
    }
    return buttons;
  }
}
