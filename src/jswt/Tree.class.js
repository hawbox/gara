/*	$Id: $

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
 * @class Tree
 * @namespace gara.jswt
 */
$class("Tree", {
	$extends : Control,

	$constructor : function(parentNode) {
		this.$base();
		this._showLines = true;
		this._shiftItem = null;
		this._activeItem = null;
		this._parentNode = parentNode;
		this._className = this._baseClass = "jsWTTree";
		
		this._selection = [];
		this._items = [];
		this._firstLevelItems = [];
	},

	_activateItem : function(item) {
		// set a previous active item inactive
		if (this._activeItem != null) {
			this._activeItem.setActive(false);
		}

		this._activeItem = item;
		this._activeItem.setActive(true);
		this.update();
	},

	/**
	 * Adds an item on the top level to this tree. Is automatically done by instantiating a new item.
	 * 
	 * @author thomas Gossmann
	 * @param {TreeItem} item new item for the top level
	 * @type void
	 */
	_addFirstLevelItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}

		this._firstLevelItems.push(item);
	},
	
	/**
	 * Adds an item to the tree. This is automatically done by instantiating a new item.
	 * 
	 * @author Thomas Gossmann
	 * @private
	 * @param {TreeItem} item the new item to be added
	 * @type void
	 * @throws WrongObjectException
	 */
	_addItem : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}
	
		var parentItem = item.getParent()
		if (parentItem == this) {
			this._items.push(item);
		} else {
			var index = this._items.indexOf(parentItem)
				+ getDescendents(parentItem)
				+ 1;

			
			this._items.splice(index, 0, item);
		}
	
		function getDescendents(item) {
			var childs = 0;
			if (item.hasChilds()) {
				item.getItems().forEach(function(child, index, arr) {
					if (child.hasChilds()) {
						childs += getDescendents(child);
					}
					childs++;
				}, this);
			}
			return childs;
		}
	},
	
	/**
	 * Deselects a specific item
	 * 
	 * @author Thomas Gossmann
	 * @type void
	 * @param {TreeItem} the item to deselect
	 * @private
	 */
	deselect : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}
	
		if (this._selection.contains(item)
				&& item.getTree() == this) {
			this._selection.remove(item);
			this.notifySelectionListener();
			item.setUnselected();
			this._shiftItem = item;
			this._activateItem(item);
		}
	},

	/**
	 * Deselect all items in the tree
	 * 
	 * @author Thomas Gossmann
	 * @type void
	 */
	deselectAll : function() {
		for (var i = this._selection.length; i >= 0; --i) {
			this.deselect(this._selection[i]);
		}
		this.update();
	},
	
	handleEvent : function(e) {
		// special events for the list
		var obj = e.target.obj || null;
		
		switch (e.type) {
			case "mousedown":
				if (!this._hasFocus) {
					this.forceFocus();
				}

				if ($class.instanceOf(obj, gara.jswt.TreeItem)) {
					var item = obj;

					if (e.ctrlKey && !e.shiftKey) {
						if (this._selection.contains(item)) {
							this.deselect(item);
						} else {
							this.select(item, true);
						}
					} else if (!e.ctrlKey && e.shiftKey) {
						this.selectRange(item, false);
					} else if (e.ctrlKey && e.shiftKey) {
						this.selectRange(item, true);
					} else {
						this.select(item, false);
					}

				}
				break;

			case "dblclick":
				if ($class.instanceOf(obj, gara.jswt.TreeItem)) {
					var item = obj;
					
					item.toggleChilds();
				}
				break;
		}

		e.stopPropagation();
	},
	
	_handleKeyEvent : function(e) {
		if (this._activeItem == null) {
			return;
		}
	
		switch (e.keyCode) {
			case 38 : // up
				// determine previous item
				var prev;
				var siblings;
	
				if (this._activeItem == this._items[0]) {
					// item is root;
					prev = false;
				} else {
					var parentWidget = this._activeItem.getParent();
					if (parentWidget == this) {
						siblings = this._firstLevelItems;
					} else {
						siblings = parentWidget.getItems();
					}
					var sibOffset = siblings.indexOf(this._activeItem);
		
					// prev item is parent
					if (sibOffset == 0) {
						prev = parentWidget;
					} else {
						var prevSibling = siblings[sibOffset - 1];
						prev = getLastItem(prevSibling);
					}
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
	
			case 40 : // down
				// determine next item
				var next;
				var siblings;
				
				// item is last;
				if (this._activeItem == this._items[this._items.length - 1]) {
					next = false;
				} else {
					var parentWidget = this._activeItem.getParent();
					if (parentWidget == this) {
						siblings = this._firstLevelItems;
					} else {
						siblings = parentWidget.getItems();
					}
					var sibOffset = siblings.indexOf(this._activeItem);
		
					if (this._activeItem.hasChilds() && this._activeItem.isExpanded()) {
						next = this._activeItem.getItems()[0];
					} else if (this._activeItem.hasChilds() && !this._activeItem.isExpanded()) {
						next = this._items[this._items.indexOf(this._activeItem) + countItems(this._activeItem) + 1];
					} else {
						next = this._items[this._items.indexOf(this._activeItem) + 1];
					}
				}

				if (next) {
					if (!e.ctrlKey && !e.shiftKey) {
						//this.deselect(this._activeItem);
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
			
			case 37: // left
				// collapse tree
				var buffer = this._activeItem;
				this._activeItem.collapse();
				this._activateItem(buffer);
				this.update();
				break;
	
			case 39: // right
				// expand tree
				this._activeItem.expand();
				this.update();
				break;
				
			case 32 : // space
				if (this._selection.contains(this._activeItem) && e.ctrlKey) {
					this.deselect(this._activeItem);
				} else {
					this.select(this._activeItem, true);
				}
				break;
				
			case 36 : // home
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[0], false);
				} else if (e.shiftKey) {
					this.selectRange(this._items[0], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[0]);
				}
				break;
				
			case 35 : // end
				if (!e.ctrlKey && !e.shiftKey) {
					this.select(this._items[this._items.length-1], false);
				} else if (e.shiftKey) {
					this.selectRange(this._items[this._items.length-1], false);
				} else if (e.ctrlKey) {
					this._activateItem(this._items[this._items.length-1]);
				}
				break;
		}
	
		function getLastItem(item) {
			if (item.isExpanded() && item.hasChilds()) {
				return getLastItem(item.getItems()[item.getItems().length - 1]);
			} else {
				return item;
			}
		}
		
		function countItems(item) {
			var items = 0;
			var childs = item.getItems();
			
			for (var i = 0; i < childs.length; ++i) {
				items++;
				if (childs[i].hasChilds()) {
					items += countItems(childs[i]);
				}
			}
			
			return items;
		}
	},

	/**
	 * @method
	 * Looks for the index of a specified item
	 * 
	 * @author Thomas Gossmann
	 * @param {gara.jswt.TreeItem} item the item for the index
	 * @throws {gara.jswt.ItemNotExistsException} if the item does not exist in this tree
	 * @throws {TypeError} if the item is not a ListItem
	 * @returns {int} the index of the specified item
	 */
	indexOf : function(item) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item not instance of gara.jswt.TreeItem");
		}

		if (!this._items.contains(item)) {
			//throw new gara.jswt.ItemNotExistsException("item [" + item + "] does not exists in this list");
			console.log("des item gibts hier ned: " + item.getText());
			return;
		}

		return this._items.indexOf(item);
	},
	
	notifySelectionListener : function() {
		
	},
	
	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.Widget
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	registerListener : function(eventType, listener) {
		if (this.domref != null) {
			gara.eventManager.addListener(this.domref, eventType, listener);
		}
	},
	
	/**
	 * Selects a specific item
	 * 
	 * @author Thomas Gossmann
	 * @type void
	 * @param {TreeItem} the item to select
	 * @param {boolean} true for adding to the current selection, false will select only this item
	 * @private
	 */
	select : function(item, _add) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}
	
		if (!_add) {
			while (this._selection.length) {
				this._selection.pop().setUnselected();
			}
		}
		
		if (!this._selection.contains(item)
				&& item.getTree() == this) {
			this._selection.push(item);
			item.setSelected();
			this._shiftItem = item;
			this._activateItem(item);
			this.notifySelectionListener();
		}
	},
	
	/**
	 * Select all items in the list
	 * 
	 * @author Thomas Gossmann
	 * @type void
	 */
	selectAll : function() {
		this._items.forEach(function(item, index, arr) {
			this.select(item, true);
		}, this);
		this.update();
	},
	
	selectRange : function(item, _add) {
		if (!$class.instanceOf(item, gara.jswt.TreeItem)) {
			throw new TypeError("item is not type of gara.jswt.TreeItem");
		}

		if (!_add) {
			while (this._selection.length) {
				this._selection.pop().setUnselected();
			}
		}

		var indexShift = this.indexOf(this._shiftItem);
		var indexItem = this.indexOf(item);
		var from = indexShift > indexItem ? indexItem : indexShift;
		var to = indexShift < indexItem ? indexItem : indexShift;

		for (var i = from; i <= to; ++i) {
			this._selection.push(this._items[i]);
			this._items[i].setSelected();
		}

		this._activateItem(item);
		this.notifySelectionListener();
	},

	toString : function() {
		return "[gara.jswt.Tree]";
	},
	
	update : function() {
		if (this.domref == null) {
			this.domref = document.createElement("ul");
			this.domref.obj = this;
			this.domref.control = this;

			/* buffer unregistered user-defined listeners */
			var unregisteredListener = {};			
			for (var eventType in this._listener) {
				unregisteredListener[eventType] = this._listener[eventType].concat([]);
			}

			/* List event listener */
			this.addListener("mousedown", this);
			this.addListener("dblclick", this);

			/* register user-defined listeners */
			for (var eventType in unregisteredListener) {
				unregisteredListener[eventType].forEach(function(elem, index, arr) {
					this.registerListener(eventType, elem);
				}, this);
			}

			this._parentNode.appendChild(this.domref);
		}
	
		this.removeClassName("jsWTTreeNoLines");
		this.removeClassName("jsWTTreeLines");	
	
		if (this._showLines) {
			this.addClassName("jsWTTreeLines");
		} else {
			this.addClassName("jsWTTreeNoLines");
		}

		this.domref.className = this._className;
		this._updateItems(this._firstLevelItems, this.domref);
	},
	
	_updateItems : function(items, parentNode) {
		var itemCount = items.length;
		items.forEach(function(item, index, arr) {
			var bottom = (index + 1) == itemCount;

			// create item ...
			if (!item.isCreated()) {
				item.create(bottom);
				parentNode.appendChild(item.domref);
			}

			// ... or update it
			if (item.hasChanged()) {
				item.update();
				item.releaseChange();
			}

	
			if (item.hasChilds()) {
				var childContainer = item._getChildContainer();
				this._updateItems(item.getItems(), childContainer);			
			}
	
			if (bottom && item.getClassName().indexOf("bottom") == -1) {
				item.addClassName("bottom");
				if (item.hasChilds()) {
					var cc = item.getChildContainer();
					cc.className = "bottom";
				}
			} else if (!bottom && item.getClassName().indexOf("bottom") != -1) {
				item.removeClassName("bottom");
				if (item.hasChilds()) {
					var cc = item.getChildContainer();
					cc.className = null;
				}
			}
		}, this);
	}
});