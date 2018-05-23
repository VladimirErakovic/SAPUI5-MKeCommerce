jQuery.sap.require("mk.ecommerce.util.Formatter");
jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.declare("mk.ecommerce.view.dialog.Calculator");


sap.ui.controller("mk.ecommerce.view.Lager", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Lager
*/
	onInit: function() {
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		partnid = oJQueryStorage.get("partnid");
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		language = oJQueryStorage.get("lang");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		
		var oView = this.getView().byId("lagerList");
		oView.setHeaderText(oBundle.getText("LagerTitle"));
		oView.setNoDataText(oBundle.getText("NoDataText"));
		this.getView().byId("btnCalculator").setText(oBundle.getText("CalcTitle"));
		// Using OData model to connect against a real service
		var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_UI5_PARTNER_LAGER_SRV/";
		var oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
		oView.setModel(oModel); 
		
		this.getView().attachAfterRendering(function() {
			
	        var oBinding = this.byId("lagerList").getBinding("items");
	        var FilterOperator = sap.ui.model.FilterOperator;
	        oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"), 
	                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid)]);  // treba zameniti za partnid
	    });

	},
	
	
	onCalculate: function(oEvent) {
		
		oCtrl = sap.ui.controller("mk.ecommerce.view.dialog.Calculator");
		oDialogFragment = sap.ui.xmlfragment("mk.ecommerce.view.dialog.Calculator", oCtrl);  
		oDialogFragment.open();  
		if(language == "hu_HU") {
	        var i18nHU = new sap.ui.model.resource.ResourceModel({
                bundleUrl : "i18n/i18n_hu.properties"
            });
			oDialogFragment.setModel(i18nHU, "i18n");
		} else {
	        var i18nSR = new sap.ui.model.resource.ResourceModel({
                bundleUrl : "i18n/i18n.properties"
            });
			oDialogFragment.setModel(i18nSR, "i18n");
		}
		
		var priceInput = sap.ui.getCore().byId("idInpCalcPrice");
		priceInput.addEventDelegate({
            onfocusin : function() {
            	priceInput.selectText(0, 14);
              }
        });
		
		var amountInput = sap.ui.getCore().byId("idInpCalcAmount");
		amountInput.addEventDelegate({
            onfocusin : function() {
                amountInput.selectText(0, 14);
              }
        });
		
	},
	
	
	onListItemPress: function(oEvent) {

		//var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
		var oSelectedItem = oEvent.getParameter("listItem");
		var amount = oSelectedItem.getBindingContext().getProperty("Kolic");
		
		//var amountNum = Number(amount);
		amount = parseFloat(amount).toFixed(0);

		console.log(amount);
		//var amountInput = oDialogFragment.byId("idInpCalcAmount");
		//amountInput.setValue(amount);
		this.onCalculate();
		var formatter = new Intl.NumberFormat('de-DE');
		var amountInput = sap.ui.getCore().byId("idInpCalcAmount");
		amountInput.setValue(formatter.format(amount));
	},
	
	
	onNavBack: function(oEvent) {

		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("MainPage");
		
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Lager
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Lager
*/
//	onAfterRendering: function() {
//		
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Lager
*/
//	onExit: function() {
//
//	}

});