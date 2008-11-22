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
 * @summary
 * gara List Widget
 * 
 * @description
 * long description for the List Widget...
 * 
 * @class List
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Control
 */
$class("List", {
	$extends : gara.jswt.Control,

	/**
	 * @constructor
	 * Constructor
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the list
	 * @return {gara.jswt.List} list widget
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);

		// List default style
		if (this._style == JSWT.DEFAULT) {
			this._style = JSWT.SINGLE;
		}

		this._event = null;
		this._items = [];
		this._selection = [];
		this._selectionListener = [];
		this._activeItem = null;
		this._shiftItem = null;
		this._className = this._baseClass = "jsWTList";
		this._className += " jsWTListInactive";
	},

	/**
	 * @method
	 * Activates an item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	_activateItem : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item is not type of gara.jswt.ListItem");
		}
		// set a previous active item inactive
		if (this._activeItem != null && !this._activeItem.isDisposed()) {
			this._activeItem.setActive(false);
			this._activeItem.update();
		}

		this._activeItem = item;
		this._activeItem.setActive(true);
		this.update();
	},

	/**
	 * @method
	 * Adds an item to the list (invoked by the constructor of ListItem)
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should added to the List
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	_addItem : function(item, index) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item is not type of gara.jswt.ListItem");
		}
		
		if (typeof(index) != "undefined") {
			this._items.insertAt(index, item);
		} else {
			this._items.push(item);
		}
	},

	/**
	 * @method
	 * Adds a selection listener on the list
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the desired listener to be added to this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		this.checkWidget();
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		this._selectionListener.push(listener);
	},
	
	_create : function() {
		this.domref = document.createElement("ul");
		this.domref.obj = this;
		this.domref.control = this;
		base2.DOM.EventTarget(this.domref);

		/* buffer unregistered user-defined listeners */
		var unregisteredListener = {};			
		for (var eventType in this._listener) {
			unregisteredListener[eventType] = this._listener[eventType].concat([]);
		}

		/* List event listener */
		this.addListener("mousedown", this);

		/* register user-defined listeners */
		for (var eventType in unregisteredListener) {
			unregisteredListener[eventType].forEach(function(elem, index, arr) {
				this._registerListener(eventType, elem);
			}, this);
		}

		if (!$class.instanceOf(this._parent, gara.jswt.Composite)) {
			this._parentNode = this._parent;
		}

		if (this._parentNode != null) {
			this._parentNode.appendChild(this.domref);
		}
	},

	/**
	 * @method
	 * Deselects an item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should be deselected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	deselect : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.ListItem");
		}

		if (this._selection.contains(item)) {
			item._setSelected(false);
			this._selection.remove(item);
			this._shiftItem = item;
			this._activateItem(item);
			this.notifySelectionListener();
		}
	},

	/**
	 * @method
	 * Deselects all items
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	deselectAll : function() {
		this.checkWidget();
		for (var i = 0, len = this._items.length; i < len; ++i) {
			this.deselect(this._items[i]);
		}
		this.update();
	},

	dispose : function() {
		this.deselectAll();
		this.$base();

		this._items.forEach(function(item, index, arr) {
			item.dispose();
		}, this);

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}
		delete this.domref;
	},

	/**
	 * @method
	 * Gets a specified item with a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the zero-related index
	 * @throws {gara.OutOfBoundsException} if the index does not live within this list
	 * @return {gara.jswt.ListItem} the item
	 */
	getItem : function(index) {
		this.checkWidget();
		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("Your item lives outside of this list");
		}
	
		return this._items[index];
	},

	/**
	 * @method
	 * Returns the amount of the items in the list
	 * 
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getItemCount : function() {
		return this._items.length;
	},

	/**
	 * @method
	 * Returns an array with all the items in the list
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.ListItem[]} the array with the items
	 */
	getItems : function() {
		return this._items;
	},

	/**
	 * @method
	 * Returns an array with the items which are currently selected in the list
	 * 
	 * @author Thomas Gossmann
	 * @return {gara.jswt.ListItem[]} an array with items
	 */
	getSelection : function() {
		this.checkWidget();
		return this._selection;
	},

	/**
	 * @method
	 * Returns the amount of the selected items in the tree
	 * 
	 * @author Thomas Gossmann
	 * @return {int} the amount
	 */
	getSelectionCount : function() {
		this.checkWidget();
		return this._selection.length;
	},

	/**
	 * @method
	 * Handles events on the list. Implements DOMEvent Interface by the W3c.
	 * 
	 * @author Thomas Gossmann
	 * @param {Event} e event the users triggers
	 * @return {void}
	 */
	handleEvent : function(e) {
		this.checkWidget();
		// special events for the list
		var obj = e.target.obj || null;
		
		if (obj && $class.instanceOf(obj, gara.jswt.ListItem)) {
			e.item = obj;
		}
		e.widget = this;
		this._event = e;

		switch (e.type) {
			case "mousedown":
				if (!this._hasFocus) {
					this.forceFocus();
				}

				if ($class.instanceOf(obj, gara.jswt.ListItem)) {
					var item = obj;

					if (!e.ctrlKey && !e.shiftKey) {
						this.select(item, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(item, true);
					} else if (e.shiftKey) {
						this.selectRange(item, false);
					} else if (e.ctrlKey) {
						if (this._selection.contains(item)) {
							this.deselect(item);
						} else {
							this.select(item, true);
						}
					} else {
						this.select(item);
					}
				}
				break;

			case "keyup":
			case "keydown":
			case "keypress":
				if (this._activeItem != null) {
					this._activeItem.handleEvent(e);
				}

				this._notifyExternalKeyboardListener(e, this, this);
				
				if (e.type == "keydown") {
					this._handleKeyEvent(e);					
				}
				break;
		}

		this.handleContextMenu(e);
		e.stopPropagation();
		
		/* in case of ie6, it is necessary to return false while the type of
		 * the event is "contextmenu" and the menu isn't hidden in ie6
		 */
		return false;
	},

	/**
	 * @method
	 * handling key events on the List
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {Event} e event the users triggers
	 * @return {void}
	 */
	_handleKeyEvent : function(e) {
	
	//	window.status = "keycode: " + e.keyCode;
		if (this._activeItem == null) {
			return;
		}

		switch (e.keyCode) {
			case 37: // left
			case 38: // up
				// determine previous item
				var prev = false;
				var activeIndex = this.indexOf(this._activeItem);
				
				if (activeIndex != 0) {
					prev = this._items[activeIndex - 1];
				}

				if (prev) {
					if (!e.ctrlKey && !e.shiftKey) {
						//this.deselect(this._activeItem);
						this.select(prev, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(prev, true);
					} else if (e.shiftKey) {
						this.selectRange(prev, false);
					} else if (e.ctrlKey) {
						this._activateItem(prev);
					}
				}
				break;

			case 39: // right
			case 40: // down
				// determine next item
				var next = false;
				var activeIndex = this.indexOf(this._activeItem);
				
				// item is last;
				if (activeIndex != this._items.length - 1) {
					next = this._items[activeIndex + 1];
				}

				if (next) {
					if (!e.ctrlKey && !e.shiftKey) {
						//this.deselect(this.activeItem);
						this.select(next, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(next, true);
					} else if (e.shiftKey) {
						this.selectRange(next, false);
					} else if (e.ctrlKey) {
						this._activateItem(next);
					}
				}
				break;

			case 32: // space
				if (this._selection.contains(this._activeItem) && e.ctrlKey) {
					this.deselect(this._activeItem);
				} else {
					this.select(this._activeItem, true);
				}
				break;
				
			case 36: // home
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[0], false);
				} else if (e.shiftKey) {
					this.selectRange(this._items[0], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[0]);
				}
				break;
				
			case 35: // end
				var lastOffset = this._items.length - 1;
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[lastOffset], false);
				} else if (e.shiftKey) {
					this.selectRange(this._items[lastOffset], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[lastOffset]);
				}
				break;
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this list
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {int} the index of the specified item
	 */
	indexOf : function(item) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.ListItem");
		}
	
		if (!this._items.contains(item)) {
			// TODO: ItemNotExistsException
			throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
			return;
		}

		return this._items.indexOf(item);
	},

	/**
	 * @method
	 * Notifies selection listener about the changed selection within the List
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	notifySelectionListener : function() {
		for (var i = 0, len = this._selectionListener.length; i < len; ++i) {
			this._selectionListener[i].widgetSelected(this._event);
		}
	},
	
	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.Widget
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		if (this.domref != null) {
			gara.EventManager.addListener(this.domref, eventType, listener);
		}
	},

	/**
	 * @method
	 * Removes an item from the list
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the index of the item
	 * @return {void}
	 */
	remove : function(index) {
		this.checkWidget();
		var item = this._items.removeAt(index)[0];
		item.dispose();
		delete item;
	},

	/**
	 * @method
	 * Removes items within an indices range
	 * 
	 * @author Thomas Gossmann
	 * @param {int} start start index
	 * @param {int} end end index
	 * @return {void}
	 */
	removeRange : function(start, end) {
		this.checkWidget();
		for (var i = start; i <= end; ++i) {
			this.remove(i);
		}
	},

	/**
	 * @method
	 * Removes items which indices are passed by an array
	 * 
	 * @author Thomas Gossmann
	 * @param {Array} inidices the array with the indices
	 * @return {void}
	 */
	removeFromArray : function(indices) {
		this.checkWidget();
		indices.forEach(function(item, index, arr) {
			this.remove(index);
		}, this);
	},

	/**
	 * @method
	 * Removes all items from the list
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	removeAll : function() {
		this.checkWidget();
		while (this._items.length) {
			/*var item = this._items.pop();
			this.domref.removeChild(item.domref);
			delete item;*/
			this.remove(0);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this list
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the listener to remove from this list
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		this.checkWidget();
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		if (this._selectionListener.contains(listener)) {
			this._selectionListener.remove(listener);
		}
	},

	/**
	 * @method
	 * Selects an item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	select : function(item, _add) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.ListItem");
		}

		if (!_add || (this._style & JSWT.MULTI) != JSWT.MULTI) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
				i.update();
			}
		}

		if (!this._selection.contains(item)) {
			item._setSelected(true);
			this._selection.push(item);
			this._shiftItem = item;
			this._activateItem(item);
			this.notifySelectionListener();
		}
	},

	/**
	 * @method
	 * Select all items in the list
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	selectAll : function() {
		this.checkWidget();
		if ((this._style & JSWT.SINGLE) != JSWT.SINGLE) {
			for (var i = 0, len = this._items.length; i < len; ++i) {
				this.select(this._items[i], true);
			}
		}
	},

	/**
	 * @method
	 * Selects a range. From the item with shift-lock to the passed item.
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.ListItem} item the item that should be selected
	 * @throws {TypeError} if the item is not a ListItem
	 * @return {void}
	 */
	selectRange : function(item, _add) {
		this.checkWidget();
		if (!$class.instanceOf(item, gara.jswt.ListItem)) {
			throw new TypeError("item not instance of gara.jswt.ListItem");
		}

		// only, when selection mode is MULTI
		if (!_add) {
			while (this._selection.length) {
				var i = this._selection.pop();
				i._setSelected(false);
				i.update();
			}
		}

		if ((this._style & JSWT.MULTI) == JSWT.MULTI) {
			var indexShift = this.indexOf(this._shiftItem);
			var indexItem = this.indexOf(item);
			var from = indexShift > indexItem ? indexItem : indexShift;
			var to = indexShift < indexItem ? indexItem : indexShift;

			for (var i = from; i <= to; ++i) {
				this._selection.push(this._items[i]);
				this._items[i]._setSelected(true);
				this._items[i].update();
			}

			this._activateItem(item);
			this.notifySelectionListener();
		} else {
			this.select(item);
		}
	},

	/**
	 * @method
	 * Sets the text of an item at a zero-related index
	 * 
	 * @author Thomas Gossmann
	 * @param {int} index the index for the item
	 * @param {String} string the new text for the item
	 * @throws {TypeError} if the text is not a string
	 * @throws {gara.OutOfBoundsException} if the index does not live within the List
	 * @return {void}
	 */	
	setItem : function(index, string) {
		this.checkWidget();
		if (typeof(string) != "string") {
			throw new TypeError("string is not type of a String");
		}

		if (index >= this._items.length) {
			throw new gara.OutOfBoundsException("item is not in List");
		}

		item[index].setText(string);
		
		this.update();
	},

	/**
	 * @method
	 * Sets the List's items to be the given Array of items
	 * 
	 * @author Thomas Gossmann
	 * @param {Array} strings the array with item texts
	 * @throws {TypeError} if the strings are not an Array
	 * @return {void}
	 */
	setItems : function(strings) {
		this.checkWidget();
		if (!$class.instanceOf(strings, Array)) {
			throw new TypeError("strings are not an Array");
		}

		for (var i = 0; i < strings.length; ++i) {
			if (this._items[i]) {
				this._items[i].setText(strings[i]);
			} else {
				var item = new gara.jswt.ListItem(this);
				item.setText(strings[i]);
			}
		}
		
		this.update();
	},
	
	/**
	 * @method
	 * Sets the selection of the list
	 * 
	 * @author Thomas Gossmann
	 * @param {Array} items the array with the <code>TreeItem</code> items
	 * @throws {TypeError} if the passed items are not an array
	 * @return {void}
	 */	
	setSelection : function(items) {
		this.checkWidget();
		if ($class.instanceOf(items, Array)) {
			items.forEach(function(item, index, arr) {
				if ($class.instanceOf(item, gara.jswt.ListItem)) {
					this.select(item, true);
				} else if ($class.instanceOf(item, Number)) {
					this.select(this._items[item], true);
				}
			}, this);
		} else if ($class.instanceOf(items, Number)) {
			this.select(this._items[items]);
		}
	},

	toString : function() {
		return "[gara.jswt.List]";
	},
	
	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.Widget
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {
		if (this.domref != null) {
			gara.EventManager.removeListener(this.domref, eventType, listener);
		}
	},

	/**
	 * @method
	 * Updates the list!
	 * 
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	update : function() {
		this.checkWidget();
		// create widget if domref equals null
		if (this.domref == null) {
			this._create();
		}

		this.removeClassName("jsWTListFullSelection");

		if ((this._style & JSWT.FULL_SELECTION) == JSWT.FULL_SELECTION) {
			this.addClassName("jsWTListFullSelection");
		}

		this.domref.className = this._className;

		// update items
		this._items.forEach(function(item, index, arr) {
			item._setParentNode(this.domref);
			item.update();
		}, this);
	}
});