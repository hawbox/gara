/*	$Id$

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

/**
 * gara TreeItem
 * 
 * @class TabItem
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends Item
 */
$class("TabItem", {
	$extends : Item,

	$constructor : function(parentWidget) {
		this.$base();

		if (!$class.instanceOf(parentWidget, gara.jswt.TabFolder)) {
			throw new TypeError("parentWidget is neither a gara.jswt.TabFolder");
		}

		this._parent = parentWidget;
		this._active = false;
		this._content = null;
		this._control = null;

		this._toolTipText = null;
		this._span = null;
		this._img = null;

		this._parent._addItem(this);
	},

	/**
	 * @method
	 * Contstructs the dom for this tabitem
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {HTMLElement} the created node
	 */
	_create : function() {
		this.domref = document.createElement("li");
		this.domref.className = this._className;
		this.domref.obj = this;
		this.domref.control = this._parent;
		this.domref.title = this._toolTipText;

		// set image
		if (this.image != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._parent;
			this._img.src = this.image.src;
			this._img.alt = this._text;

			// put the image into the dom
			this.domref.appendChild(this._img);
		}

		this._spanText = document.createTextNode(this._text);

		this._span = document.createElement("span");
		this._span.obj = this;
		this._span.control = this._parent;
		this._span.appendChild(this._spanText);
		this.domref.appendChild(this._span);

		base2.DOM.bind(this.domref);

		// register listener
		for (var eventType in this._listener) {
			this._listener[eventType].forEach(function(elem, index, arr) {
				this.registerListener(eventType, elem);
			}, this);
		}
		this._changed = false;
		return this.domref;
	},

	/**
	 * @method
	 * Returns the content for this item
	 * 
	 * @author Thomas Gossmann
	 * @returns {string} the content;
	 */
	getContent : function() {
		return this._content;
	},

	/**
	 * @method
	 * Returns the content control for this item
	 * 
	 * @author Thomas Gossmann
	 * @returns {gara.jswt.Control} the control
	 */
	getControl : function() {
		return this._control;
	},

	/**
	 * @method
	 * Returns the tooltip text for this item
	 * 
	 * @author Thomas Gossmann
	 * @returns {string} the tooltip text 
	 */
	getToolTipText : function() {
		return this._toolTipText;
	},

	/**
	 * @method
	 * Widget implementation to register listener
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	registerListener : function() {
		if (this.domref != null) {
			gara.EventManager.getInstance().addListener(this.domref, eventType, listener);
		}
	},

	/**
	 * @method
	 * Set a new active state for this item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {boolean} the new active state
	 * @returns {void}
	 */
	_setActive : function(active) {
		this._active = active;

		if (active) {
			this._className += " active";
		} else {
			this._className = this._className.replace(/ *active/, "");
		}

		this._changed = true;
	},

	/**
	 * @method
	 * Sets content for this item that appears in the client area of the TabFolder when 
	 * this item is activated. Use EITHER setContent OR setControl!
	 * 
	 * @author Thomas Gossmann
	 * @param {string} content the content
	 * @returns {void}
	 */
	setContent : function(content) {
		this._content = content;
		this._changed = true;
	},

	/**
	 * @method
	 * Sets a control for that appears in the client area of the TabFolder when this item is activated
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.Control} control the control
	 * @throws {TypeError} when that is not a gara.jswt.Control
	 * @returns {void} 
	 */
	setControl : function(control) {
		if (!$class.instanceOf(control, gara.jswt.Control)) {
			throw new TypeError("control is not instance of gara.jswt.Control");
		}

		this._control = control;
		this.setContent(control.domref);
	},

	/**
	 * @method
	 * Sets the ToolTip text for this item
	 * 
	 * @author Thomas Gossmann
	 * @param {string} text the tooltip text
	 * @returns {void}
	 */
	setToolTipText : function(text) {
		this._toolTipText = text;
		this._changed = true;
	},

	/**
	 * @method
	 * Update this item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	update : function() {
		// create image
		if (this._image != null && this._img == null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._parent;
			this._img.alt = this._text;
			this._img.src = this._image.src;
			this.domref.insertBefore(this._img, this._span);
			
			// event listener
			for (var eventType in this._listener) {
				this._listener[eventType].forEach(function(elem, index, arr) {
					this.registerListener(this._img, eventType, elem);
				}, this);
			}
		}

		// simply update image information
		else if (this._image != null) {
			this._img.src = this._image.src;
			this._img.alt = this._text;
		}

		// delete image
		else if (this._img != null && this._image == null) {
			this.domref.removeChild(this._img);
			this._img = null;

			// event listener
			for (var eventType in this._listener) {
				this._listener[eventType].forEach(function(elem, index, arr) {
					gara.EventManager.getInstance().removeListener({
						domNode : this._img,
						type: eventType, 
						listener : elem
					});
				}, this);
			}
		}

		this._spanText.nodeValue = this._text;
		this.domref.className = this._className;
	}
});