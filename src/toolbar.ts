import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

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

    panel.toolbar.addItem('edit-metadata', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

export default EditMetadataButton;