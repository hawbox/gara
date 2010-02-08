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

gara.provide("gara.jsface.viewers.SelectionChangedEvent");

$package("gara.jsface.viewers");

/**
 * @class SelectionChangedEvent
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("SelectionChangedEvent", {
	$constructor : function(source, selection) {
		this._source = source;
		this._selection = selection;
	},

	getSelection : function() {
		return this._selection;
	},

	getSource : function() {
		return this._source;
	}
});
$package("");