import { PanelLayout, Widget } from '@phosphor/widgets';
import { JSONEditor, IEditorFactoryService } from "@jupyterlab/codeeditor";


import {
  INotebookTracker
} from '@jupyterlab/notebook';
import { Message } from '@phosphor/messaging';

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

    this.notebookTracker.currentChanged.connect(() => {this.update()});
  }

  onUpdateRequest(msg: Message) {
    let curNotebookWidget = this.notebookTracker.currentWidget;
    if (curNotebookWidget != null && curNotebookWidget.isAttached) {
        let metadata = curNotebookWidget.content.model.metadata;
        this.editor.source = metadata;
        this.editor.editorTitle = 'Notebook Metadata (' + curNotebookWidget.title.label + ')';
        console.log(metadata);
    }
    return true;
  }
}

export default MetadataEditorWidget;