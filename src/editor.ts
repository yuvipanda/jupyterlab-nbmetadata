// Don't try to find typescript definitions for jsoneditor
// @types/jsoneditor exists but is too old, and won't let us
// use some properties we *do* want to use. Meh.
//@ts-ignore
import JSONEditor from "jsoneditor/dist/jsoneditor.js";
import 'jsoneditor/dist/jsoneditor.css';
import 'jsoneditor/dist/img/jsoneditor-icons.svg';

import {
  JSONObject
} from '@phosphor/coreutils';

import { Widget } from '@phosphor/widgets';

import {
  INotebookTracker
} from '@jupyterlab/notebook';

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
      mainMenuBar: false,
      navigationBar: false,
      enableSort: false,
      enableTransform: false,
      onChangeJSON: (json: JSONObject) => {
        this.setCurrentNotebookMetadata(json);
      }
    }, {});

    this.notebookTracker.currentChanged.connect(() => {
      let curNotebookWidget = this.notebookTracker.currentWidget;
      if (curNotebookWidget.isAttached) {
        let metadata = curNotebookWidget.content.model.metadata;
        metadata.changed.connect(() => {
          console.log(metadata.toJSON());
          if (metadata.toJSON() != this.editor.get()) {
            this.editor.setText(JSON.stringify(metadata.toJSON()))
          }
        })

        // Uh, we can't pass the object
        this.editor.setText(JSON.stringify(metadata));
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