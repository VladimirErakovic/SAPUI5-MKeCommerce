jQuery.sap.require("mk.ecommerce.util.Formatter");
jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");


sap.ui.controller("mk.ecommerce.view.Archive", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Archive
*/
	onInit: function() {
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		partnid = oJQueryStorage.get("partnid");
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		language = oJQueryStorage.get("lang");
		console.log("partnid: " + partnid + " ,language: " + language);
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 

		
		var oView = this.getView().byId("archiveList");
		oView.setHeaderText(oBundle.getText("ArchiveTitle"));
		oView.setNoDataText(oBundle.getText("NoDataText"));
		// Using OData model to connect against a real service
		var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_NOTIF_GET_LIST_SRV_02/";
		var oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
		oView.setModel(oModel);    //oView

		
		this.getView().attachAfterRendering(function() {
			
	        var oBinding = this.byId("archiveList").getBinding("items");
	        var FilterOperator = sap.ui.model.FilterOperator;
	        oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"),
	                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid),
	                         new sap.ui.model.Filter("Notar", FilterOperator.EQ, "X")]);
	    });

	},
	
	onNavBack: function(oEvent){

		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("MainPage");
		
	},
	
	
	onArchiveItemPress: function(evt) {
		
		var oSelectedItem = evt.getParameter("listItem");
		var link = oSelectedItem.getBindingContext().getProperty("Sttxt");
		var smerp = oSelectedItem.getBindingContext().getProperty("Smerp");
		console.log("Link: " + link);
		
		if(link !== "" && smerp === "I") {
			
	    	win = window.open(link, '_blank');
	    	win.focus();
	    	
		}
		
		
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Archive
*/
//	onBeforeRendering: function() {
//		
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Archive
*/
//	onAfterRendering: function() {
//		
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Archive
*/
//	onExit: function() {
//
//	}

});