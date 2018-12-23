[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/yuvipanda/jupyterlab-nbmetadata/master)

# JupyterLab Notebook Metadata Editor Plugin

A JupyterLab plugin to edit Notebook Metadata

![Right pane metadata editor](right-sidebar-screenshot.png)

# Usage

Selecting 'Notebook Metadata Editor' from the Command Palette
should open up the Notebook Metadata Editor in the right
pane. This is updated with current notebook's metadata.
You can edit this as required. Notebooks must be saved
explicitly after edigint their metadata.

## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install jupyterlab_nbmetadata
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```
