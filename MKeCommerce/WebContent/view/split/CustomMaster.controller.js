jQuery.sap.require("mk.ecommerce.util.Formatter");
jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");

sap.ui.controller("mk.ecommerce.view.split.CustomMaster", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.split.CustomMaster
*/
	onInit: function() {
		
		firstEnter = true;
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		partnid = oJQueryStorage.get("partnid");
		language = oJQueryStorage.get("lang");
		
		pageTitle = this.getView().byId("pageCustomMaster");
		listCustom = this.getView().byId("listCustoms");
		
		btnRefresh = this.getView().byId("btnRefreshCustomOffers");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setTitle(oBundle.getText("CustomMasterTitle"));
		listCustom.setNoDataText(oBundle.getText("MasterListNoDataText"));
		
		btnRefresh.setText(oBundle.getText("BtnRefresh"));
		btnRefresh.setTooltip(oBundle.getText("BtnRefresh"));
		
		oView = this.getView().byId("listCustoms");
		// Using OData model to connect against a real service
		var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_UI5_NOTIF_GET_LIST_SRV_01/";
		oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
		oView.setModel(oModel);   
		
		
		this.getView().attachAfterRendering(function() {

	        var oBinding = this.byId("listCustoms").getBinding("items");
	        var FilterOperator = sap.ui.model.FilterOperator;
	        oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"), 
	                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid),
	                         new sap.ui.model.Filter("Smerp", FilterOperator.EQ, "X")]);
	        
	    });  
		
	},
	
	
	handleSelect: function(oEvent) {
		var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
		
		var oSelectedItem = oEvent.getParameter("listItem");
		var ntfcid = oSelectedItem.getBindingContext().getProperty("Ntfcid");
		var path = oListItem.getBindingContextPath();
		var model = this.getView().byId('listCustoms').getModel();
		
		var smerp = oSelectedItem.getBindingContext().getProperty("Smerp");
		
		// make model that is forwarded to details page
		var customOffer = {};
		customOffer.notxt  = oSelectedItem.getBindingContext().getProperty("Notxt");
		customOffer.maktx = oSelectedItem.getBindingContext().getProperty("Maktx");
		customOffer.menge = oSelectedItem.getBindingContext().getProperty("Menge");
		customOffer.meins = oSelectedItem.getBindingContext().getProperty("Meins");
		customOffer.preis2 = oSelectedItem.getBindingContext().getProperty("Preis2");
		customOffer.waers = oSelectedItem.getBindingContext().getProperty("Waers");
		customOffer.kdate = oSelectedItem.getBindingContext().getProperty("Kdate");
		customOffer.ktime = oSelectedItem.getBindingContext().getProperty("Ktime");
		customOffer.dogovstat = oSelectedItem.getBindingContext().getProperty("DogovStat");
		sap.ui.getCore().setModel(customOffer, "customOffer");
		
		var context = oListItem.getBindingContext();
		
		oSelectedItem.setSelected(false);
		
		if(smerp == "D") {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("CustomDetail",{from: "CustomMaster", offer: ntfcid});
		} else {
		// trigger routing to BindingPath of this ListItem - this will update the data on the detail page
			sap.ui.core.UIComponent.getRouterFor(this).navTo("NotFound2",{from: "CustomMaster", offer: ntfcid});
		}

	},
	
	
	onNavBack: function(oEvent){
	
		sap.ui.core.UIComponent.getRouterFor(this).navTo("MainPage");
		oView.getModel().refresh();
		
	},
	
	
	onRefresh: function(){
		
		var filtersRefresh = [];
		filtersRefresh = [new sap.ui.model.Filter("Appid", sap.ui.model.FilterOperator.EQ, "1000"), 
		                  new sap.ui.model.Filter("Partnid", sap.ui.model.FilterOperator.EQ, partnid),
		                  new sap.ui.model.Filter("Smerp", sap.ui.model.FilterOperator.EQ, "X")];
		
		// update list binding
		var list = this.getView().byId("listCustoms");
		var binding = list.getBinding("items");
		binding.filter(filtersRefresh);
		
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.split.CustomMaster
*/
//	onBeforeRendering: function() {
//
//	}

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.split.CustomMaster
*/
//	onAfterRendering: function() {
//		
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.split.CustomMaster
*/
//	onExit: function() {
//
//	}

});
