jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.MainPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.MainPage
*/
	onInit: function(evt) {
				
	    this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	    this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
		
	},
	
	
	handleRouteMatched : function (evt) {
		
		if (evt.getParameter("name") == "MainPage") {
			
			that = this;

			var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			language = oJQueryStorage.get("lang");
			partnid = oJQueryStorage.get("partnid");
			user = oJQueryStorage.get("user");
			pass = oJQueryStorage.get("pass"); 
			//console.log("Partnid: " + partnid);
			
			var tileNotification = this.getView().byId("notifTile");
			var tileOffers = this.getView().byId("offersTile");
			var tileMyOffer = this.getView().byId("myOfferTile");
			var tileCustomList = this.getView().byId("customListTile");
			var tileArchive = this.getView().byId("archiveTile");
			var tileBoard = this.getView().byId("boardTile");
			var tileWeather = this.getView().byId("weatherTile");
			var tileContacts = this.getView().byId("contactsTile");
			var tileDebt = this.getView().byId("debtTile");
			var tileLager = this.getView().byId("lagerTile");
			
			var optionsText = this.getView().byId("userNameMenu");
			var purchasingPlace = this.getView().byId("userPlaceInfo");
			
			var btnSettings = this.getView().byId("settingsButton");
			var btnAbout = this.getView().byId("aboutButton");
			var btnLogout = this.getView().byId("logoutButton");
			var statusIcon = this.getView().byId("notifAppStatusIcon");

			
			if(language === "hu_HU") {
		        // read texts from i18n_hu model
		        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
			} else {
		        // read texts from i18n model
		        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
			}   
			
			optionsText.setText(oBundle.getText("MainMenuOptionsText"));
			
			// tile titles
	        tileNotification.setTitle(oBundle.getText("NotificationsTile"));        
	        tileOffers.setTitle(oBundle.getText("MKOffersTile"));	        
	        tileMyOffer.setTitle(oBundle.getText("MyOfferTile"));        
	        tileCustomList.setTitle(oBundle.getText("CustomListTile"));	        
	        tileArchive.setTitle(oBundle.getText("ArchiveAllTile"));	        
	        tileBoard.setTitle(oBundle.getText("BulletinBoardTile"));	        
	        tileWeather.setTitle(oBundle.getText("WeatherForecastTile"));	        
	        tileContacts.setTitle(oBundle.getText("ContactsTile"));	        
	        tileDebt.setTitle(oBundle.getText("DebtStructureTile"));	        
	        tileLager.setTitle(oBundle.getText("LagerTile"));	        
	        
	        if(!sap.ui.Device.system.phone) {	// tile infos only on desktop
	        	tileNotification.setInfo(oBundle.getText("NotificationsInfo"));
	        	tileOffers.setInfo(oBundle.getText("MKOffersInfo"));
	        	tileMyOffer.setInfo(oBundle.getText("MyOfferInfo"));
	        	tileCustomList.setInfo(oBundle.getText("CustomOListInfo"));
	        	tileArchive.setInfo(oBundle.getText("ArchiveAllInfo"));
	        	tileBoard.setInfo(oBundle.getText("BulletinBoardInfo"));
	        	tileWeather.setInfo(oBundle.getText("WeatherForecastInfo"));
	        	tileContacts.setInfo(oBundle.getText("ContactsInfo"));
	        	tileDebt.setInfo(oBundle.getText("DebtStructureInfo"));
	        	tileLager.setInfo(oBundle.getText("LagerInfo"));
	        }
	        
	        btnSettings.setText("     " + oBundle.getText("Settings"));
	        btnAbout.setText("     " + oBundle.getText("About"));
	        btnLogout.setText("     " + oBundle.getText("LogoutMenuItemText"));
	        
	        var oView = this.getView();
	        
	        var interval = 0;
	        var appty = "W";
	        
			var urlOfferNum = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_UI5_NOTIF_GET_STAT_SRV/";
			var oModelOfferNum = new sap.ui.model.odata.ODataModel(urlOfferNum, true, user, pass); 
	 
			oModelOfferNum.read("/NcountSet(IAppid='1000',IPartnid='" + partnid + "',IAppty='" + appty + "',IRefti=" + interval + ")", null, null, false, 
					function(oResponse) {
					
						brnep = oResponse.EBrnep; 
					    console.log(brnep);
					    brpon = oResponse.EBrpon;
					    console.log(brpon);
					    partnri = oResponse.EPartnri;
					    console.log(partnri);
					    otmnaz = oResponse.EOtmnaz;
					    console.log(otmnaz);
					    aznakt = oResponse.EAznakt;
					    console.log(aznakt);
					    
					    if(aznakt == "A") {
					    	statusIcon.setSrc("sap-icon://sys-enter-2");
					    	statusIcon.setColor("Green");
					    	statusIcon.setTooltip(oBundle.getText("NotifAppIsActiveTooltip"));
					    } else {
					    	statusIcon.setSrc("sap-icon://alert");
					    	statusIcon.setColor("Red");
					        statusIcon.setTooltip(oBundle.getText("NotifAppNotActiveTooltip"));
					    }
					    
					    var tileOffers = oView.byId("offersTile");
					    tileOffers.setNumber(brpon);
					    var tileNotifs = oView.byId("notifTile");
					    tileNotifs.setNumber(brnep);
					    
						//partnerName.setText(partnri);
						purchasingPlace.setText(oBundle.getText("MainPagePPlace") + " " + otmnaz);

					},
					function(oError) { 

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
	
	
	handleNotifications: function(oEvent) {
		
		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Notifications");
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}	
	},
	
	
	handleOffers: function(oEvent) {

		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Master");
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	},
	
	handleCustom: function(oEvent) {
		
		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("CustomOffer");
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	},
	
	handleCustomList: function(oEvent) {
		
		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("CustomMaster");
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	},
	
	handleArchive: function(oEvent) {
		
		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Archive",{});
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	},
	
	handleBoard: function(oEvent) {
		
		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("BulletinBoard",{});
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	},
	
	handleWeather: function(oEvent) {
		
		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Weather",{});
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	},
	
	handleContacts: function(oEvent) {
		
		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Contacts",{});
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	},
	
	handleDebtStructure: function(oEvent) {
		
		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("DebtStructure",{});
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	},
	
	handleLager: function(oEvent) {
		
		if(partnid !== null) {
			sap.ui.core.UIComponent.getRouterFor(this).navTo("Lager",{});
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	},
	
	btnLogoutPress: function(oEvent){

		sap.ui.core.UIComponent.getRouterFor(that).navTo("LoginPage",{});  

	}, 
	
	onMenuAction: function(oEvent) {
		
		var oItem = oEvent.getParameter("item");
		
		if(partnid !== null) {
			if(oItem.getKey() == "1"){
				sap.ui.core.UIComponent.getRouterFor(that).navTo("Settings",{});
			} else if(oItem.getKey() == "2"){
				sap.ui.core.UIComponent.getRouterFor(that).navTo("About",{});
			} else if(oItem.getKey() == "3"){
				sap.ui.core.UIComponent.getRouterFor(that).navTo("LoginPage",{});
			}
		} else {
			sap.m.MessageToast.show(oBundle.getText("NoPartnerId"));
		}
	}
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.MainPage
*/
//	onBeforeRendering: function() {		
//
//	},
	
//	onBeforeShow: function() {
//		
//	}

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.MainPage
*/
//	onAfterRendering: function() {
//		
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.MainPage
*/
//	onExit: function() {
//
//	}

});