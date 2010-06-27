gara.provide("gara.jsface.viewers.TableViewer");gara.require("gara.jsface.viewers.AbstractTableViewer");gara.require("gara.jsface.viewers.TableViewerRow");gara.require("gara.jswt.widgets.Table");$package("gara.jsface.viewers");$class("TableViewer",{$extends:gara.jsface.viewers.AbstractTableViewer,$constructor:function(a,b){if($class.instanceOf(a,gara.jswt.widgets.Table)){this._table=a}else{this._table=new gara.jswt.widgets.Table(a,b)}this._hookControl(this._table)},_doClear:function(a){this._table.clear(a)},_doGetColumn:function(a){return this._table.getColumn(a)},_doGetColumnCount:function(){return this._table.getColumnCount()},_doGetItems:function(){return this._table.getItems()},_doGetSelection:function(){return this._table.getSelection()},_doRemoveRange:function(a,b){this._table.removeRange(a,b)},getControl:function(){return this._table},getTable:function(){return this._table},_getViewerRowFromItem:function(a){if(this._cachedRow==null){this._cachedRow=new gara.jsface.viewers.TableViewerRow(a)}else{this._cachedRow.setItem(a)}return this._cachedRow},_internalCreateNewRowPart:function(a,b){var c;if(b>=0){c=new gara.jswt.widgets.TableItem(this._table,a,b)}else{c=new gara.jswt.widgets.TableItem(this._table,a)}return this._getViewerRowFromItem(c)},refresh:function(a,b){this._internalRefresh(a||null,b||true)},_tableRemoveAll:function(){this._table.removeAll()}});$package("");