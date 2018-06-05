jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.ExtraRegPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.ExtraRegPage
*/
	onInit: function() {
		
		that = this;
		
		// proveri da li ovo sljaka..
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass");
		language = oJQueryStorage.get("lang");
		console.log("Language: " + language);
		
		pageTitle = this.getView().byId("extRegTitle");
		companyLabel = this.getView().byId("extRegCompanyLabel");
		otmesLabel = this.getView().byId("extRegOtmesLabel");
		pdvLabel = this.getView().byId("extRegPdvLabel");
		yesItem = this.getView().byId("yesItem");
		noItem = this.getView().byId("noItem");
		btnSend = this.getView().byId("btnExtRegSend");
		
		if(language === "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setText(oBundle.getText("ExtRegTitle"));
		companyLabel.setText(oBundle.getText("ExtRegCompanyLabel"));
		otmesLabel.setText(oBundle.getText("ExtRegOtmesLabel"));
		pdvLabel.setText(oBundle.getText("ExtRegPdvLabel"));
		yesItem.setText(oBundle.getText("CustomOYes"));
		noItem.setText(oBundle.getText("CustomONo"));
		btnSend.setText(oBundle.getText("BtnSend"));
		
		oView = this.getView();
		
		var oCompany = this.getView().byId("companySelect");
		// Using OData model to connect against a real service
		var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_UI5_GET_BUKRS_SRV/";
		var oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
		oCompany.setModel(oModel); 
		
		var oOtmes = oView.byId("pplaceSelect");
		
		// Using OData model to connect against a real service
		var url2 = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_UI5_GET_OTMES_SRV/";
		var oModel2 = new sap.ui.model.odata.ODataModel(url2, false, user, pass);
		oOtmes.setModel(oModel2);
		
		this.getView().attachAfterRendering(function() {
			
	        var oBinding = this.byId("companySelect").getBinding("items");
	        var FilterOperator = sap.ui.model.FilterOperator;
	        oBinding.filter(new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"));
	        
				
		    var oBindingPP = this.byId("pplaceSelect").getBinding("items");
		    var FilterOperator = sap.ui.model.FilterOperator;
		    oBindingPP.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"), 
		                      new sap.ui.model.Filter("Bukrs", FilterOperator.EQ, "1000")]); // ovo je pogadjanje ...
	    });

	},
	
	companySelected: function() {
		
		oView = this.getView();
		
		var bukrs = oView.byId("companySelect").getSelectedKey();  //evt.getParameters.selectedItem;
		console.log(bukrs);
		
		var oOtmes = oView.byId("pplaceSelect");
		
		// Using OData model to connect against a real service
		var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_UI5_GET_OTMES_SRV/";
		var oModel2 = new sap.ui.model.odata.ODataModel(url, false, user, pass);
		oOtmes.setModel(oModel2);
			
	    var oBindingPP = this.byId("pplaceSelect").getBinding("items");
	    var FilterOperator = sap.ui.model.FilterOperator;
	    oBindingPP.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"), 
	                      new sap.ui.model.Filter("Bukrs", FilterOperator.EQ, bukrs)]);

		
	},
	
	
	btnExtraRegister: function() {
		
		that = this;	// proveri da li ce dobro redirektovati
		
		oView = this.getView();
		
		var bukrs = oView.byId("companySelect").getSelectedKey();
		console.log(bukrs);
		var otmid = oView.byId("pplaceSelect").getSelectedKey();
		console.log(otmid);
		var pdv = oView.byId("pdvSelect").getSelectedKey();
		console.log(pdv);
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		var partnid = oJQueryStorage.get("partnid");
		console.log("partnid: " + partnid);	
		
		var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_PARTNER_SET_MDATA_SRV/";		
		var oModel3 = new sap.ui.model.odata.ODataModel(url, true, user, pass);

		
		oModel3.read("/MdataSet(IAppid='1000',IBukrs='" + bukrs + "',IOtmid='" + otmid + "',IPartnid='" + partnid + 
				"',IUspdv='" + pdv + "')", null, null, false, 
				function(oResponse) { // onSuccess function called when everything is ok

				    var error = oResponse.EErrMsg;
				    console.log(error);	    
				    
				    if(error === "") {
				    					
					/**	sap.ui.commons.MessageBox.show(
								oBundle.getText("DataSentSuccessfully"),
								sap.ui.commons.MessageBox.Icon.SUCCESS,
								oBundle.getText("Ok"),
								[sap.ui.commons.MessageBox.Action.OK],
								function(){
									sap.ui.core.UIComponent.getRouterFor(that).navTo("LoginPage" ,{});
								}
						); **/  //ovo ostavljam kao primer da moze i sa starim message box
					    sap.m.MessageBox.show(
					    		oBundle.getText("DataSentSuccessfully"), {
						          icon: sap.m.MessageBox.Icon.SUCCESS,
						          title: oBundle.getText("Ok"),
						          actions: sap.m.MessageBox.Action.OK,
						          onClose: function(oAction) { 
						        	    // redirect
						        	  if(sap.ui.Device.system.desktop || sap.ui.Device.system.combi) {
						        		  sap.ui.core.UIComponent.getRouterFor(that).navTo("NotifAppWizard" ,{});
						        	  } else {
						        		  sap.ui.core.UIComponent.getRouterFor(that).navTo("LoginPage" ,{});
						        	  }
						          }
						      }
						);
				    
				    } else {
	 
					    sap.m.MessageBox.show(
					    		error, {
						          icon: sap.m.MessageBox.Icon.ERROR,
						          title: oBundle.getText("Error"),
						          actions: sap.m.MessageBox.Action.OK
						      }
						);
				    }
				    
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
		
		
	},
	
	
	onNavBack: function (oEvent) {

		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("RegistrationPage");
		
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.ExtraRegPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.ExtraRegPage
*/
//	onAfterRendering: function() {		
//
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.ExtraRegPage
*/
//	onExit: function() {
//
//	}

});
