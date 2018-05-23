jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.split.Info", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.split.Info
*/
	onInit: function() {
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		partnid = oJQueryStorage.get("partnid");
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		language = oJQueryStorage.get("lang");
		
		pageTitle = this.getView().byId("infoDetailsPage");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setTitle(oBundle.getText("InfoPageTitle"));
		
		
		var view = this.getView();

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
			// when detail navigation occurs, update the binding context
			if (oEvent.getParameter("name") === "Info") {

				var bindingContext = this.getView().getBindingContext();
				ntfcid = oEvent.getParameter("arguments").offer;
			
				var offer = sap.ui.getCore().getModel("singleOffer");
				var notxt = offer.notxt;

				view.byId("infoDetailHeader").setTitle(notxt);
				
				
				if(ntfcid !== null) {
					var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_BILBOARD_GET_LIST_SRV/";		
					var oModel = new sap.ui.model.odata.ODataModel(url, true, user, pass);
	
					oModel.read("/BoardSet(IAppid='1000',INtfcid='" + ntfcid + "',IPartnid='" + partnid + "')", null, null, false, 
						function(oResponse) { // onSuccess function called when everything is ok
	
						    var url = oResponse.EOturl;
						    console.log(url);
						    console.log("Ntfcif: " + ntfcid);
						    var error = oResponse.EErrMsg;
						    console.log(error);
						    
						    if(error == ""){
						        var iframeWeb = "<iframe src='" + url + "' height='100%' width='100%'></iframe>";
						        var htmlWeb = view.byId("htmlWeb");
						        htmlWeb.setContent(iframeWeb);
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
				
				}   
			}
		}, this);
				
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.split.Info
*/
//	onBeforeRendering: function() {
//		
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.split.Info
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.split.Info
*/
//	onExit: function() {
//
//	}

});