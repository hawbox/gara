gara.provide("gara.viewers.TableColumnViewerLabelProvider","gara.viewers.WrappedViewerLabelProvider");gara.use("gara.viewers.ViewerCell");gara.Class("gara.viewers.TableColumnViewerLabelProvider",function(){return{$extends:gara.viewers.WrappedViewerLabelProvider,$constructor:function(a){this.$super(a);if(a.getColumnText||a.getColumnImage){this.tableLabelProvider=a}},update:function(a){var b=a.getElement(),c=a.getColumnIndex();if(!(a instanceof gara.viewers.ViewerCell)){throw new TypeError("cell is not instance of gara.viewers.ViewerCell");}if(this.tableLabelProvider===null){if(this.getLabelProvider().getText){a.setText(this.getLabelProvider().getText(b))}if(this.getLabelProvider().getImage){a.setImage(this.getLabelProvider().getImage(b))}}else{if(this.tableLabelProvider.getColumnText){a.setText(this.tableLabelProvider.getColumnText(b,c))}if(this.tableLabelProvider.getColumnImage){a.setImage(this.tableLabelProvider.getColumnImage(b,c))}}}}});