import { JSONObject } from '@phosphor/coreutils';
import { PanelLayout, Widget } from '@phosphor/widgets';
import { INotebookTracker } from '@jupyterlab/notebook';

//import { Dialog } from '@jupyterlab/apputils';
import { JSONEditor, IEditorFactoryService } from "@jupyterlab/codeeditor";

class MetadataEditorWidget extends Widget {
  readonly containerDiv: HTMLDivElement
  readonly editorDiv: HTMLDivElement;
  readonly notebookTracker: INotebookTracker;

  readonly editor: JSONEditor;
  constructor(notebookTracker: INotebookTracker, editorFactoryService: IEditorFactoryService) {
    super();

    this.notebookTracker = notebookTracker;

    this.id = 'notebook-metadata-editor';
    this.title.label = 'Notebook Metadata';
    this.title.closable = true;

    this.addClass('jp-MetadataEditorWidget')

    this.containerDiv = document.createElement('div');
    this.node.appendChild(this.containerDiv);
    this.editorDiv = document.createElement('div');
    this.containerDiv.appendChild(this.editorDiv);

    this.editor = new JSONEditor({
        editorFactory: editorFactoryService.newDocumentEditor,
        title: "Notebook Metadata"
    });

    // FIXME: JSON serialization seems to use 4space indent, so this doesn't actually work
    this.editor.editor.setOption('tabSize', 2);
    this.editor.editor.setOption('lineWrap', 'off');

    let layout = new PanelLayout()
    layout.insertWidget(0, this.editor);
    this.layout = layout;

    this.notebookTracker.currentChanged.connect(() => {
      let curNotebookWidget = this.notebookTracker.currentWidget;
      if (curNotebookWidget.isAttached) {
        let metadata = curNotebookWidget.content.model.metadata;
        this.editor.source = metadata;
        this.editor.editorTitle = 'Notebook Metadata (' + curNotebookWidget.title.label + ')';
      }
      return true;
    });
  }

  setCurrentNotebookMetadata(metadata: JSONObject) {
      let curNotebookWidget = this.notebookTracker.currentWidget;
      if (curNotebookWidget != null && curNotebookWidget.isAttached) {
        let notebookModel = curNotebookWidget.content.model;
        // No way to atomically set metadata?
        notebookModel.metadata.clear();
        for (let key in metadata) {
          notebookModel.metadata.set(key, metadata[key]);
        }
        notebookModel.dirty = true;
      }

  }
}

export default MetadataEditorWidget;