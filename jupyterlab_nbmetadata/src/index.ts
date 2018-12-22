import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import {
  JSONExt
} from '@phosphor/coreutils';

import {
  Widget
} from '@phosphor/widgets';

import {
  Message
} from '@phosphor/messaging';

import '../style/index.css';

class MetadataEditorWidget extends Widget {
  readonly div: HTMLDivElement

  constructor() {
    super();

    this.id = 'notebook-metadata-editor';
    this.title.label = 'Notebook Metadata Editor';
    this.title.closable = true;

    this.addClass('jp-MetadataEditorWidget')

    this.div = document.createElement('div');
    this.node.appendChild(this.div);

  }

  onUpdateRequest(msg: Message): void {
    this.div.innerText = 'he' + Date.now();
  }
}

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
    let widget: MetadataEditorWidget;

    const command = 'nbmetadata:edit';
    app.commands.addCommand(command, {
      label: "Edit Notebook Metadata",
      execute: () => {
        if (!widget) {
          widget = new MetadataEditorWidget();
          widget.update();
        }
        if (!tracker.has(widget)) {
          tracker.add(widget);
        }
        if (!widget.isAttached) {
          app.shell.addToRightArea(widget);
        }

        widget.update();
        app.shell.activateById(widget.id);
      }
    })

    palette.addItem({command, category: 'Notebook'});

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
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
