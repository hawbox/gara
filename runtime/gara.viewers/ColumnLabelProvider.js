gara.provide("gara.viewers.ColumnLabelProvider","gara.viewers.CellLabelProvider");gara.use("gara.viewers.ViewerCell");gara.Class("gara.viewers.ColumnLabelProvider",function(){return{$extends:gara.viewers.CellLabelProvider,$constructor:function(){this.$super()},getText:function(a){return a===null?"":a.toString()},update:function(a){if(!(a instanceof gara.viewers.ViewerCell)){throw new TypeError("cell is not instance of gara.viewers.ViewerCell");}var b=a.getElement();a.setText(this.getText(b));a.setImage(this.getImage(b))}}});