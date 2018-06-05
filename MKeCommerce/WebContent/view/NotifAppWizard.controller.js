jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");


sap.ui.controller("mk.ecommerce.view.NotifAppWizard", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.NotifAppWizard
*/
	onInit: function() {
		
		toggle = false;
		toggle1 = false;
		toggle2 = false;
		toggle3 = false;
		toggle4 = false;
		toggle5 = false;
		
		image1 = this.getView().byId("image1");
		img1Width = image1.getWidth();
		img1Height = image1.getHeight();
		
		image1a = this.getView().byId("image1a");
		img1aWidth = image1a.getWidth();
		img1aHeight = image1a.getHeight();
		
		image2a = this.getView().byId("image2a");
		img2aWidth = image2a.getWidth();
		img2aHeight = image2a.getHeight();
		
		image3a = this.getView().byId("image3a");
		img3aWidth = image3a.getWidth();
		img3aHeight = image3a.getHeight();
		
		image4a = this.getView().byId("image4a");
		img4aWidth = image4a.getWidth();
		img4aHeight = image4a.getHeight();
		
		image5a = this.getView().byId("image5a");
		img5aWidth = image5a.getWidth();
		img5aHeight = image5a.getHeight();
		
		
	    this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	    this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
		
	},
	
	
	handleRouteMatched : function (evt) {
		
		if (evt.getParameter("name") == "NotifAppWizard") {
			
			var wizard = sap.ui.getCore().getModel("wizBack");
			
			if (typeof wizard == "undefined") {
				this.getView().byId("btnWizardBackNav").setVisible(false);
			} else {
				var back = wizard.back;
				if(back == "X"){
					this.getView().byId("btnWizardBackNav").setVisible(true);
				}
			}

			var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			partnid = oJQueryStorage.get("partnid");
			language = oJQueryStorage.get("lang");
			
		    oView = this.getView();
					
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
				    
		    
		}
	},
	
	
	onNavBack: function() {
		
		sap.ui.core.UIComponent.getRouterFor(this).navTo("Settings" ,{});
	},
	
	goToLoginPage: function() {
		
		sap.ui.core.UIComponent.getRouterFor(this).navTo("LoginPage" ,{});
	},
	
	
	onNotifAppDownload: function() {
		
		if(sap.ui.Device.system.desktop || sap.ui.Device.system.combi) {  // skini aplikaciju za notifikaciju ako je desktop ili windows uredjaj
			// download file  
			var link=document.createElement('a');
			document.body.appendChild(link);
			link.href="http://www.mksolutions.co.rs/MKeCommerce/Notification%20Installer/Notification%20Installer.msi";
			link.click();
        }		
	},
	
	onNotifAppTest: function() {
		
        var interval = 0;
        var appty = "W";
        
		var urlNotifAppTest = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_UI5_NOTIF_GET_STAT_SRV/";
		var oModelNotifAppTest = new sap.ui.model.odata.ODataModel(urlNotifAppTest, true, user, pass); 
 
		oModelNotifAppTest.read("/NcountSet(IAppid='1000',IPartnid='" + partnid + "',IAppty='" + appty + "',IRefti=" + interval + ")", null, null, false, 
				function(oResponse) {
				
					brnep = oResponse.EBrnep; 
				    console.log(brnep);
				    aznakt = oResponse.EAznakt;
				    console.log(aznakt);
				    
				    if(aznakt == "A") {
				    	sap.m.MessageToast.show(oBundle.getText("NotifAppIsActiveTooltip"));
				    } else {
				    	sap.m.MessageToast.show(oBundle.getText("NotifAppNotActiveTooltip"));
				    }

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
		
	},

	handleImage1Press: function() {
		
		if(!toggle){
          //works on window resize
			image1.setHeight('100%');
			image1.setWidth('100%');
            toggle=true;
        } else {
        	image1.setHeight(img1Height);
        	image1.setWidth(img1Width);
        	toggle=false;
        }      
	},
	
	handleImage1aPress: function() {
		
		if(!toggle1){
	          //works on window resize
				image1a.setHeight('100%');
				image1a.setWidth('100%');
	            toggle1=true;
	        } else {
	        	image1a.setHeight(img1aHeight);
	        	image1a.setWidth(img1aWidth);
	        	toggle1=false;
	    } 	
	},
	
	handleImage2aPress: function() {
		
		if(!toggle2){
	          //works on window resize
				image2a.setHeight('100%');
				image2a.setWidth('100%');
	            toggle2=true;
	        } else {
	        	image2a.setHeight(img2aHeight);
	        	image2a.setWidth(img2aWidth);
	        	toggle2=false;
	    } 	
	},
	
	handleImage3aPress: function() {
		
		if(!toggle3){
	          //works on window resize
				image3a.setHeight('100%');
				image3a.setWidth('100%');
	            toggle3=true;
	        } else {
	        	image3a.setHeight(img3aHeight);
	        	image3a.setWidth(img3aWidth);
	        	toggle3=false;
	    } 	
	},
	
	handleImage4aPress: function() {
		
		if(!toggle4){
	          //works on window resize
				image4a.setHeight('100%');
				image4a.setWidth('100%');
	            toggle4=true;
	        } else {
	        	image4a.setHeight(img4aHeight);
	        	image4a.setWidth(img4aWidth);
	        	toggle4=false;
	    } 	
	},
	
	handleImage5aPress: function() {
		
		if(!toggle5){
	          //works on window resize
				image5a.setHeight('100%');
				image5a.setWidth('100%');
	            toggle5=true;
	        } else {
	        	image5a.setHeight(img5aHeight);
	        	image5a.setWidth(img5aWidth);
	        	toggle5=false;
	    } 	
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.NotifAppWizard
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.NotifAppWizard
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.NotifAppWizard
*/
//	onExit: function() {
//
//	}

});
