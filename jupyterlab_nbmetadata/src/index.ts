import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  IEditorServices
} from "@jupyterlab/codeeditor"

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookPanel, INotebookModel, INotebookTracker
} from '@jupyterlab/notebook';

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

// Don't try to find typescript definitions for jsoneditor
// @types/jsoneditor exists but is too old, and won't let us
// use some properties we *do* want to use. Meh.
//@ts-ignore
import JSONEditor from "jsoneditor/dist/jsoneditor.js";

import '../style/index.css';
import 'jsoneditor/dist/jsoneditor.css';
import 'jsoneditor/dist/img/jsoneditor-icons.svg';

class MetadataEditorWidget extends Widget {
  readonly containerDiv: HTMLDivElement
  readonly editorDiv: HTMLDivElement;
  readonly notebookTracker: INotebookTracker;

  readonly editor: JSONEditor;
  constructor(notebookTracker: INotebookTracker) {
    super();

    this.notebookTracker = notebookTracker;

    this.id = 'notebook-metadata-editor';
    this.title.label = 'Notebook Metadata Editor';
    this.title.closable = true;

    this.addClass('jp-MetadataEditorWidget')

    this.containerDiv = document.createElement('div');
    this.node.appendChild(this.containerDiv);
    this.editorDiv = document.createElement('div');
    this.containerDiv.appendChild(this.editorDiv);

    this.editor = new JSONEditor(this.editorDiv, {
      name: 'Notebook Metadata',
      mainMenuBar: false
    }, {});

    this.notebookTracker.currentChanged.connect(() => {
      let curNotebookWidget = this.notebookTracker.currentWidget;
      if (curNotebookWidget.isAttached) {
        let metadata = curNotebookWidget.content.model.metadata.toJSON();
        console.log('Notebook is', curNotebookWidget.content.model.toJSON());
        console.log('Metadata is ', metadata);
        this.editor.setText(JSON.stringify(metadata));
      }
      return true;
    });
  }

  onUpdateRequest(msg: Message): void {
  }
}

class EditMetadataButton implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let callback = () => {
      console.log('hi')
    };
    let button = new ToolbarButton({
      className: 'jp-nbmetadata-edit-metadata',
      iconClassName: 'fa fa-fast-forward',
      onClick: callback,
      tooltip: 'Edit Notebook Metadata'
    });

    panel.toolbar.insertItem(panel.toolbar.children.length, 'edit-metadata', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer, notebookTracker: INotebookTracker) {
    let widget: MetadataEditorWidget;

    const command = 'nbmetadata:edit';
    app.commands.addCommand(command, {
      label: "Edit Notebook Metadata",
      execute: () => {
        if (!widget) {
          widget = new MetadataEditorWidget(notebookTracker);
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
    app.docRegistry.addWidgetExtension('Notebook', new EditMetadataButton());

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
  requires: [ICommandPalette, ILayoutRestorer, INotebookTracker],
  activate: activate
};

export default extension;
