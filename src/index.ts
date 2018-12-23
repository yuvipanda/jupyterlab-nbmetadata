import { INotebookTracker } from '@jupyterlab/notebook';

import { JupyterLab, JupyterLabPlugin, ILayoutRestorer } from '@jupyterlab/application';

import { Dialog, ICommandPalette, InstanceTracker } from '@jupyterlab/apputils';

import { IEditorServices } from "@jupyterlab/codeeditor";

import { JSONExt } from '@phosphor/coreutils';

import { Widget } from '@phosphor/widgets';

import MetadataEditorWidget from "./editor";
import EditMetadataButton from "./toolbar";
import '../style/index.css';

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer, notebookTracker: INotebookTracker, editorServices: IEditorServices) {

  app.docRegistry.addWidgetExtension('Notebook', new EditMetadataButton(editorServices.factoryService));
  return
    let widget = new MetadataEditorWidget(notebookTracker, editorServices.factoryService);

    const command = 'nbmetadata:edit';
    app.commands.addCommand(command, {
      label: "Notebook Metadata",
      execute: () => {
        let dialog = new Dialog({
          title: 'Notebook Metadata',
          body: widget,
        });
        dialog.launch();
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
