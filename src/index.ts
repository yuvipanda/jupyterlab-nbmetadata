import { INotebookTracker } from '@jupyterlab/notebook';

import { JupyterLab, JupyterLabPlugin, ILayoutRestorer } from '@jupyterlab/application';

import { ICommandPalette, InstanceTracker } from '@jupyterlab/apputils';

import { JSONExt } from '@phosphor/coreutils';

import { Widget } from '@phosphor/widgets';
import { IEditorServices } from "@jupyterlab/codeeditor";

import MetadataEditorWidget from "./editor";
import '../style/index.css';

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer, notebookTracker: INotebookTracker, editorServices: IEditorServices) {
    let widget = new MetadataEditorWidget(notebookTracker, editorServices.factoryService);

    const command = 'nbmetadata:edit';
    app.commands.addCommand(command, {
      label: "Notebook Metadata",
      execute: () => {
        if (!tracker.has(widget)) {
          tracker.add(widget);
        }
        if (!widget.isAttached) {
          app.shell.addToRightArea(widget);
        }

        widget.update();
        app.shell.activateById(widget.id);
      },
    })

    palette.addItem({command, category: 'Notebook Operations'});

    let tracker = new InstanceTracker<Widget>({ namespace: 'nbmetadata-editor' });
    restorer.restore(tracker, {
      command,
      args: () => JSONExt.emptyObject,
      name: () => 'nbmetadata-editor'
    });

}

const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab_nbmetadata',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, INotebookTracker, IEditorServices],
  activate: activate
};

export default extension;
