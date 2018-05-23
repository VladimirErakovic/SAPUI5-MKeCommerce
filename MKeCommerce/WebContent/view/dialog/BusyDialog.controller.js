
sap.ui.controller("mk.ecommerce.view.dialog.BusyDialog", {
	
	onDialogClosed: function(evt) {
		sap.ui.getCore().byId("busyDialogFragment").destroy();
	},
	
	onExit: function() {
		sap.ui.getCore().byId("busyDialogFragment").destroy();
	}	

});