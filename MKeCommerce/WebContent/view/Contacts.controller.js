jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");

sap.ui.controller("mk.ecommerce.view.Contacts", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Contacts
*/
	onInit: function() {
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		partnid = oJQueryStorage.get("partnid");
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		language = oJQueryStorage.get("lang");
		console.log("partnid: " + partnid + " ,language: " + language);
		
		var oView = this.getView().byId("contactList");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
	        var i18nHU = new sap.ui.model.resource.ResourceModel({
                bundleUrl : "i18n/i18n_hu.properties"
            });
	        oView.setModel(i18nHU, "i18n");
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
	        var i18nSR = new sap.ui.model.resource.ResourceModel({
                bundleUrl : "i18n/i18n.properties"
            });
	        oView.setModel(i18nSR, "i18n");
		} 
		
		
		oView.setHeaderText(oBundle.getText("ContactsTitle"));
		oView.setNoDataText(oBundle.getText("NoDataText"));
		// Using OData model to connect against a real service
		var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_GET_CONTACT_LIST_SRV/";
		var oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
		oView.setModel(oModel); 
		
		this.getView().attachAfterRendering(function() {
			
	        var oBinding = this.byId("contactList").getBinding("items");
	        var FilterOperator = sap.ui.model.FilterOperator;
	        oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"), 
	                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid)]);
	    });

	},
	
	onNavBack: function (oEvent) {

		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("MainPage");
		
	},

	
	onListItemPress: function(oEvent) {
		
		var oSelectedItem = oEvent.getParameter("listItem");
		var mobtel = oSelectedItem.getBindingContext().getProperty("Mobtel");
		console.log(mobtel);
		
		if(sap.ui.Device.system.phone) {
			sap.m.MessageToast.show(oBundle.getText("PhoneIsCallingNumber"));   //Poziva se izabrani kontakt...
			sap.m.URLHelper.triggerTel(mobtel);
		} else {
			sap.m.MessageToast.show(oBundle.getText("YouMustBeOnPhoneToCall"));  //Morate biti na telefonu da bi koristili funkciju poziva.
		}
    
	}
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Contacts
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Contacts
*/
//	onAfterRendering: function() {	
//
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Contacts
*/
//	onExit: function() {
//
//	}

});
