jQuery.sap.require("mk.ecommerce.util.Formatter");
jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");
//jQuery.sap.declare("mk.ecommerce.view.dialog.BusyDialog");


sap.ui.controller("mk.ecommerce.view.Notifications", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Notifications
*/
	onInit: function() {
		
		firstEnter = true;
		
		that = this;
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		partnid = oJQueryStorage.get("partnid");
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		language = oJQueryStorage.get("lang");
		
		notifButton = this.getView().byId("notifButton");
		btnMarkAllRead = this.getView().byId("markAllNotifsAsRead");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		var oView = this.getView().byId("notificationsList");
		oView.setHeaderText(oBundle.getText("NotificationsTitle"));
		oView.setNoDataText(oBundle.getText("NoDataText"));
		notifButton.setText(oBundle.getText("NotificationButton"));
		btnMarkAllRead.setText(oBundle.getText("NotificationMarkAllRead"));
		
		// Using OData model to connect against a real service
		var urlTimeline = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_UI5_TIMELINE_SRV/";
		var oModelTimeline = new sap.ui.model.odata.ODataModel(urlTimeline, true, user, pass);
		oView.setModel(oModelTimeline); 

		
		this.getView().attachAfterRendering(function() {
			
	        var oBinding = this.byId("notificationsList").getBinding("items");
	        var FilterOperator = sap.ui.model.FilterOperator;
	        
		    oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"),
		                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid)]);

	    });  
		
	    this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	    this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

	},
	
	handleRouteMatched : function (evt) {
		
		if (evt.getParameter("name") == "Notifications") {
			
			if(firstEnter === false) {
				
				that = this;
			
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
				
				var oView = this.getView().byId("notificationsList");
				oView.setHeaderText(oBundle.getText("NotificationsTitle"));
				oView.setNoDataText(oBundle.getText("NoDataText"));
				
				console.log(evt.getParameter("name") + " Jezik: " + language);
				// Using OData model to connect against a real service
				var urlTimeline = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_UI5_TIMELINE_SRV/";
				var oModelTimeline = new sap.ui.model.odata.ODataModel(urlTimeline, true, user, pass);
				oView.setModel(oModelTimeline); 
	
					
		        var oBinding = this.byId("notificationsList").getBinding("items");
		        var FilterOperator = sap.ui.model.FilterOperator;
		        
			    oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"),
			                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid)]);
			}
					
		    firstEnter = false;
		}
	
	},
	
	onNavBack: function(oEvent){
		
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("MainPage");
		
	},
	
	
	onOpenPress: function(oEvent) {

		var grsid = oEvent.getSource().getTooltip();
		
		var urlNotifRead = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_GCM_NOTIF_READ_SRV/";		
		var oModel = new sap.ui.model.odata.ODataModel(urlNotifRead, true, user, pass);

		oModel.read("/Notif2Set(IAppid='1000',IGrsid='" + grsid + "',IPartnid='" + partnid + "')", null, null, false, 
			function(oResponse) { // onSuccess function called when everything is ok

			    var ntfcid = oResponse.ENtfcid;
			    console.log(ntfcid);
			    var notst = oResponse.ENotst;
			    console.log(notst);

			    sap.ui.core.UIComponent.getRouterFor(that).navTo("Master");
			    
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
	
	
	onMarkAllNotifs: function(oEvent) {
		
		
		//oCtrl = sap.ui.controller("mk.ecommerce.view.dialog.BusyDialog");
		//oDialogFragment = sap.ui.xmlfragment("mk.ecommerce.view.dialog.BusyDialog", oCtrl);  
		//oDialogFragment.open();  
		
		
		var urlAllNotifRead = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_UI5_NOTIF_READ_ALL_SRV/";		
		var oAllNotifReadModel = new sap.ui.model.odata.ODataModel(urlAllNotifRead, true, user, pass);
		

		oAllNotifReadModel.read("/NotifReadAllSet(IAppid='1000',IPartnid='" + partnid + "')", null, null, false, 
			function(oResponse) { // onSuccess function called when everything is ok

			    var error = oResponse.EErrMsg;
			    console.log(error);

			    if(error == "") {
			    	
			    	// refresh cele liste
			    	var oView = that.getView().byId("notificationsList");
					var urlTimeline = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_UI5_TIMELINE_SRV/";
					var oModelTimeline = new sap.ui.model.odata.ODataModel(urlTimeline, true, user, pass);
					oView.setModel(oModelTimeline); 
						
			        var oBinding = that.byId("notificationsList").getBinding("items");
			        var FilterOperator = sap.ui.model.FilterOperator;
			        
				    oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"),
				                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid)]);
			    	
				    //oDialogFragment.close();
				    sap.m.MessageToast.show(oBundle.getText("NotificationsMarkedAllToast")); // Sva obaveštenja su markirana kao pročitana
			    	
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

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Notifications
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Notifications
*/
//	onAfterRendering: function() {
//		  
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Notifications
*/
//	onExit: function() {
//
//	}

});