/*	$Id $

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://gara.creative2.net

		This library is free software;  you  can  redistribute  it  and/or
		modify  it  under  the  terms  of  the   GNU Lesser General Public
		License  as  published  by  the  Free Software Foundation;  either
		version 2.1 of the License, or (at your option) any later version.

		This library is distributed in  the hope  that it  will be useful,
		but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
		Lesser General Public License for more details.

	===========================================================================
*/

gara.provide("gara.viewers.TableColumnViewerLabelProvider", "gara.viewers.WrappedViewerLabelProvider");

//gara.use("gara.viewers.ITableLabelProvider");
gara.use("gara.viewers.ViewerCell");

/**
 * @class TableColumnViewerLabelProvider
 * @extends gara.viewers.WrappedViewerLabelProvider
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.TableColumnViewerLabelProvider", function () { return {
	$extends : gara.viewers.WrappedViewerLabelProvider,

	$constructor : function (labelProvider) {
		this.$super(labelProvider);

		if (labelProvider.getColumnText || labelProvider.getColumnImage) {
			this.tableLabelProvider = labelProvider;
		}
	},

	update : function (cell) {
		var element = cell.getElement(), index = cell.getColumnIndex();
		if (!(cell instanceof gara.viewers.ViewerCell)) {
			throw new TypeError("cell is not instance of gara.viewers.ViewerCell");
		}

		if (this.tableLabelProvider === null) {
			if (this.getLabelProvider().getText) {
				cell.setText(this.getLabelProvider().getText(element));
			}

			if (this.getLabelProvider().getImage) {
				cell.setImage(this.getLabelProvider().getImage(element));
			}
		} else {
			if (this.tableLabelProvider.getColumnText) {
				cell.setText(this.tableLabelProvider.getColumnText(element, index));
			}
			if (this.tableLabelProvider.getColumnImage) {
				cell.setImage(this.tableLabelProvider.getColumnImage(element, index));
			}
		}
	}
};});