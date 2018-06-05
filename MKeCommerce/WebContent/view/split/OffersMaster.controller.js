jQuery.sap.require("mk.ecommerce.util.Formatter");
jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");

sap.ui.controller("mk.ecommerce.view.split.OffersMaster", {
	

	/**
	* Called when a controller is instantiated and its View controls (if available) are already created.
	* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	* @memberOf view.OffersMaster
	*/
	onInit: function() {
		
		//firstEnter = true;
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		partnid = oJQueryStorage.get("partnid");
		language = oJQueryStorage.get("lang");
		
		pageTitle = this.getView().byId("pageOffersMaster");
		oView = this.getView().byId("list");
		
		btnRefresh = this.getView().byId("btnRefresh");
		btnIconLegend = this.getView().byId("btnIconLegend");
		selectSmerp = this.getView().byId("selectBySmerp");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setTitle(oBundle.getText("OffersMasterTitle"));
		oView.setNoDataText(oBundle.getText("MasterListNoDataText"));
		
		btnRefresh.setText(oBundle.getText("BtnRefresh"));	//Osveži
		btnRefresh.setTooltip(oBundle.getText("BtnRefresh"));	//Osveži
		btnIconLegend.setTooltip(oBundle.getText("BtnLegend"));	//Legenda ikonica
		selectSmerp.setTooltip(oBundle.getText("BtnFilterSmerp"));	//Filter po tipu ponude
		
		// Using OData model to connect against a real service
		var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_UI5_NOTIF_GET_LIST_SRV_01/";
		oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
		oView.setModel(oModel);    

		
		this.getView().attachAfterRendering(function() {
			
	        var oBinding = this.byId("list").getBinding("items");
	        var FilterOperator = sap.ui.model.FilterOperator;
	        oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"), 
	                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid),
	                         new sap.ui.model.Filter("Smerp", FilterOperator.EQ, "*")]);
	        
	    });  
		
	   // this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	   // this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

	},
	
	
	/**	handleRouteMatched : function (evt) {
		
		if (evt.getParameter("name") == "Master") {
			
			if(firstEnter === false) {
				
				console.log(evt.getParameter("name"));
				
				var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
				user = oJQueryStorage.get("user");
				pass = oJQueryStorage.get("pass"); 
				partnid = oJQueryStorage.get("partnid");
				language = oJQueryStorage.get("lang");
				
				pageTitle = this.getView().byId("pageOffersMaster");
				oView = this.getView().byId("list");
				
				if(language == "hu_HU") {
			        // read texts from i18n_hu model
			        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
				} else {
			        // read texts from i18n model
			        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
				} 
				
				pageTitle.setTitle(oBundle.getText("OffersMasterTitle"));
				oView.setNoDataText(oBundle.getText("MasterListNoDataText"));

				// Using OData model to connect against a real service
				var url = "proxy/https/$$$/sap/opu/odata/SAP/ZMKEC_UI5_NOTIF_GET_LIST_SRV_01/";
				oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
				oView.setModel(oModel);    
					
		        var oBinding = this.byId("list").getBinding("items");
		        var FilterOperator = sap.ui.model.FilterOperator;
		        oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"), 
		                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid),
		                         new sap.ui.model.Filter("Smerp", FilterOperator.EQ, "*")]);

			}
			
		    firstEnter = false;
		}
		
	},	**/
	
	handleSelect: function(oEvent) {
		var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
		
		var oSelectedItem = oEvent.getParameter("listItem");
		var ntfcid = oSelectedItem.getBindingContext().getProperty("Ntfcid");
		var path = oListItem.getBindingContextPath();
		var model = this.getView().byId('list').getModel();
		
		var smerp = oSelectedItem.getBindingContext().getProperty("Smerp");
		
		// make model that is forwarded to details page
		var offer = {};
		offer.notxt  = oSelectedItem.getBindingContext().getProperty("Notxt");
		offer.maktx = oSelectedItem.getBindingContext().getProperty("Maktx");
		offer.notst = oSelectedItem.getBindingContext().getProperty("Notst");
		offer.sttxt = oSelectedItem.getBindingContext().getProperty("Sttxt");
		offer.smerp = smerp;
		sap.ui.getCore().setModel(offer, "singleOffer");
		
		var context = oListItem.getBindingContext();
		
		oSelectedItem.setSelected(false);
		
		if(smerp == "A") {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Poll",{from: "Master", offer: ntfcid});
		} else if(smerp == "I") {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Info",{from: "Master", offer: ntfcid});
		} else {
		// trigger routing to BindingPath of this ListItem - this will update the data on the detail page
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Detail",{from: "Master", offer: ntfcid});
		}
		//sap.ui.core.UIComponent.getRouterFor(this).navTo("Detail", context);
		//console.log(model.getProperty(path).Ntfcid);
		//console.log(ntfcid);
	},
	
	handleSmerpFilter: function(evt) {
		
		var filters = [];
		var item = evt.getParameter("selectedItem");
		var key = (item) ? item.getKey() : null;
		console.log(key);
		
		filters = [new sap.ui.model.Filter("Appid", sap.ui.model.FilterOperator.EQ, "1000"), 
                   new sap.ui.model.Filter("Partnid", sap.ui.model.FilterOperator.EQ, partnid),
                   new sap.ui.model.Filter("Smerp", sap.ui.model.FilterOperator.EQ, key)];
		
		// update list binding
		var list = this.getView().byId("list");
		var binding = list.getBinding("items");
		binding.filter(filters);
	},
	
	onNavBack: function(oEvent){
		
		sap.ui.core.UIComponent.getRouterFor(this).navTo("MainPage");
		oView.getModel().refresh();
		
	},
	
	
	onIconLegend: function(){
		
		var iconLegendDialog = new sap.m.SelectDialog("SelectDialog",{
			title: oBundle.getText("IconLegendDialog"),
			growing: false,
			items: [
					new sap.m.StandardListItem({ icon: 'sap-icon://message-information', title: oBundle.getText("IconInfoLabel") }), 
					new sap.m.StandardListItem({ icon: 'sap-icon://email', title: oBundle.getText("IconNewLabel") }),
					new sap.m.StandardListItem({ icon: 'sap-icon://email-read', title: oBundle.getText("IconOpenLabel") }),
					new sap.m.StandardListItem({ icon: 'sap-icon://response', title: oBundle.getText("IconAnsweredLabel") }),
					new sap.m.StandardListItem({ icon: 'sap-icon://outgoing-call', title: oBundle.getText("IconGoLabel") }),
					new sap.m.StandardListItem({ icon: 'sap-icon://sys-cancel-2', title: oBundle.getText("IconCanceledLabel") }),
					new sap.m.StandardListItem({ icon: 'sap-icon://sys-enter', title: oBundle.getText("IconLockedLabel") })
			        ],
			cancel: function() {
				iconLegendDialog.destroy();
			},
			confirm: function() {
				iconLegendDialog.destroy();
			}
		}).open();
		
	},
	
	onRefresh: function(){
		
		var filtersRefresh = [];
		filtersRefresh = [new sap.ui.model.Filter("Appid", sap.ui.model.FilterOperator.EQ, "1000"), 
		                  new sap.ui.model.Filter("Partnid", sap.ui.model.FilterOperator.EQ, partnid),
		                  new sap.ui.model.Filter("Smerp", sap.ui.model.FilterOperator.EQ, "*")];
		
		// update list binding
		var list = this.getView().byId("list");
		var binding = list.getBinding("items");
		binding.filter(filtersRefresh);
		
	}


/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.OffersMaster
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.OffersMaster
*/
//	onAfterRendering: function() {		
//
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.OffersMaster
*/
//	onExit: function() {
//
//	}

});
