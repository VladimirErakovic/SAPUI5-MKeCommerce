
sap.ui.controller("mk.ecommerce.view.dialog.Calculator", {
	
	closeDialog: function(evt) {
		sap.ui.getCore().byId("calculatorFragment").destroy();
	},
	
	onExit: function() {
		sap.ui.getCore().byId("calculatorFragment").destroy();
	},
	
	calculateValue: function() {
		
		var price = sap.ui.getCore().byId("idInpCalcPrice").getValue();
		var amount = sap.ui.getCore().byId("idInpCalcAmount").getValue();
		amount = amount.replace('.','');
		
		var result = Number(price) * Number(amount);
		
		var resultLabel = sap.ui.getCore().byId("txtCalculated");
        var formatter = new Intl.NumberFormat('de-DE', {
        	minimumFractionDigits: 2
        }); 
		resultLabel.setText(formatter.format(result));
	}
	
});