/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.events.MouseMoveListener");

/**
 * Classes which implement this interface provide a method that deals with the events that are 
 * generated as the mouse pointer moves.
 * 
 * @description
 * After creating an instance of a class that implements this interface it can be added to a 
 * control using the <code>addMouseMoveListener</code> method and removed using the 
 * <code>removeMouseMoveListener</code> method. As the mouse moves, the mouseMove method will 
 * be invoked. 
 * 
 * @interface gara.events.MouseMoveListener
 * @name gara.events.MouseMoveListener
 * @class
 * 
 * TODO: Remove class in favor of interface
 */
gara.Class("gara.events.MouseMoveListener", /** @lends gara.events.MouseMoveListener# */ {

	/**
	 * Sent when the mouse moves. 
	 *
	 * @param {Event} e an event containing information about the mouse move
	 * @returns {void}
	 */
	mouseMove : function (e) {}
});