import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import WorkbenchTellerShell from "./workbench-teller-shell.svelte";
import * as lib from "../../lib/lib.js";

export default class WorkbenchTellerApp extends SvelteApplication {
  constructor(options, dialogOptions) {
    super(
      {
        id: `item-piles-workbench-${options.workbenchActor?.id}-${randomID()}`,
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
        class: WorkbenchTellerShell,
        target: document.body,
      },
      classes: ["app window-app sheet item-piles-workbench"],
      zIndex: 100,
      width: 450,
      height: "auto",
      closeOnSubmit: false,
      resizable: false,
      top: window.innerHeight / 1.75,
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
}
