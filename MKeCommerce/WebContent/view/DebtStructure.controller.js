jQuery.sap.require("mk.ecommerce.util.Formatter");
jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.DebtStructure", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.DebtStructure
*/
	onInit: function(oEvent) {
		
		that = this;
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		partnid = oJQueryStorage.get("partnid");
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		language = oJQueryStorage.get("lang");
		console.log("partnid: " + partnid + " ,language: " + language);
		
		var oView = this.getView().byId("idListDebtStructure");
		
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
		
		var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_UI5_CREDIT_LIMIT_SRV/";		
		oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
		oView.setModel(oModel); 
			
		
		this.getView().attachAfterRendering(function() {
			
	        var oBinding = this.byId("idListDebtStructure").getBinding("items");
	        
	        var FilterOperator = sap.ui.model.FilterOperator;
	        oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"), 
	                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid)]);  // treba zameniti parntid
	        
	        
			oModel.read("/CreditLimitSet(IAppid='1000',IPartnid='" + partnid + "')", null, null, false, 
					function(oResponse) { // onSuccess function called when everything is ok

					    var amount = oResponse.EIznos;
					    var val = oResponse.EVal;
					    
				        var formatter = new Intl.NumberFormat('de-DE', {
				        	minimumFractionDigits: 2
				        }); 
				        amount = formatter.format(parseFloat(amount).toFixed(2));
					    
					    
					    that.getView().byId("labelCreditLimit").setText(oBundle.getText("DebtCreditLimit") + " " + amount + " " + val);
					    
					}, 		
					function(oError) { // onError function called when there was an error

					    sap.m.MessageBox.show(
					    		oBundle.getText("ServerCommunicationError"), {
						          icon: sap.m.MessageBox.Icon.ERROR,
						          title: oBundle.getText("Error"),
						          actions: sap.m.MessageBox.Action.OK
						      }
						);

					}
			);   
	        
    
	    });
		

	},
	

	
	onNavBack: function(oEvent) {

		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("MainPage");
		
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.DebtStructure
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.DebtStructure
*/
//	onAfterRendering: function(evt) {
//		
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.DebtStructure
*/
//	onExit: function() {
//
//	}

});
