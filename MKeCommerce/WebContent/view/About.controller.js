jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.About", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.About
*/
	onInit: function() {
		
		//servis sa osnovnim podacima prebacen u sledecu funkciju da bi se svaki put ponovo ucitao
		
	    this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	    this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

	},
	
	
	handleRouteMatched : function (evt) {
		
		if (evt.getParameter("name") == "About") {

			var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			partnid = oJQueryStorage.get("partnid");
			user = oJQueryStorage.get("user");
			pass = oJQueryStorage.get("pass"); 
			language = oJQueryStorage.get("lang");
			
		    oView = this.getView();
			
		    var appRegistered = oView.byId("appRegistered");
		    var partnId = oView.byId("partnerId");
		    var purchasePlace = oView.byId("purchasePlace");
		    var devTeam = oView.byId("developmentTeam");
		    var teamNames = oView.byId("teamNames");
		    var mkItBs = oView.byId("MKBS");
		    var allRightsReserved = oView.byId("allRightsReserved");
		    var aboutTitle = oView.byId("aboutTitle");
		    var btnRules = oView.byId("btnUserAgreement");
		    var leaveOpinion = oView.byId("leaveOpinion");
		    var btnOpinion = oView.byId("btnSendUserOpinion");
			
			if(language == "hu_HU") {
		        // read texts from i18n_hu model
		        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
			} else {
		        // read texts from i18n model
		        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
			}   
			
		    appRegistered.setText(oBundle.getText("ApplicationRegistered"));
		    partnId.setText(oBundle.getText("PartnerID"));
		    purchasePlace.setText(oBundle.getText("PurchasePlace"));
		    devTeam.setText(oBundle.getText("DevTeam"));
		    teamNames.setText(oBundle.getText("TeamNames"));
		    mkItBs.setText(oBundle.getText("MKBS"));
		    allRightsReserved.setText(oBundle.getText("AllRightsMKC"));	    
		    aboutTitle.setText(oBundle.getText("AboutTitle"));	
		    btnRules.setText(oBundle.getText("RulesBtn"));
		    leaveOpinion.setText(oBundle.getText("AboutCommentsAndSuggestions"));
		    btnOpinion.setText(oBundle.getText("BtnSend"));
		    
		    var txtPartnerName = oView.byId("txtPartnerName");
		    var txtPartnerId = oView.byId("txtPartnerID");
		    var txtPurchasePlace = oView.byId("txtPurchasePlace");
		    
			// Using OData model to connect against a real service
			var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_PARTNER_GET_DETAILS_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
			oView.setModel(oModel); 
			
			oModel.read("/UserSet(IAppid='1000',IPartnid='" + partnid + "')", null, null, false, 
					function(oResponse) { // onSuccess function called when everything is ok

					    var partnName = oResponse.EPartnri;
					    var purchPlace = oResponse.EOtmnaz;
					    
					    txtPartnerName.setText(partnName);
					    txtPartnerId.setText(partnid);
					    txtPurchasePlace.setText(purchPlace);
					    
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
	},
	
	
	onUserAgreement: function(oEvent) {
		
        var oBtnOK = new sap.m.Button("Ok", {
            text: oBundle.getText("Ok"),
            tap: [ this.Ok, this ]
        });
        
        var oDialog = new sap.m.Dialog("RulesDialog",{
       	 
            title: oBundle.getText("RulesBtn"),
            modal: true,
            contentWidth:"400px",
            buttons: [ oBtnOK ],
		    content:[
		             new sap.ui.core.HTML("html1", { content : oBundle.getText("UserAgreement")  }),
		            ]
         }).open();
		
	},
	
	
	Ok: function() {

		sap.ui.getCore().byId("Ok").destroy();
        sap.ui.getCore().byId("RulesDialog").destroy();
		
	},
	
	
	onNavBack: function(oEvent) {

		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("MainPage");
		
	},
	
	
	onSendOpinion: function() {
		
		sap.m.MessageToast.show(oBundle.getText("ResetPasswordToast"));
		
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.About
*/
//	onBeforeRendering: function() {		
//
//	}

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.About
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.About
*/
//	onExit: function() {
//
//	}

});