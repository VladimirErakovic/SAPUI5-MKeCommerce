jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");


sap.ui.controller("mk.ecommerce.view.Settings", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Settings
*/
	onInit: function() {
		
		var oModel = new sap.ui.model.json.JSONModel("model/language.json");
		this.getView().setModel(oModel);
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		language = oJQueryStorage.get("lang");
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		
		pageTitle = this.getView().byId("settingsTitle");
		languageLabel = this.getView().byId("settingsLangLabel");
		applicationLabel = this.getView().byId("settingsFilesLabel");
		warningText = this.getView().byId("downloadWarning");
		btnDownloadApp = this.getView().byId("btnSettingsDownload");
		btnSaveSettings = this.getView().byId("btnSettingsSave");
		secondFileLabel = this.getView().byId("settingsFilesLabel2");
		btnDownloadSecondFile = this.getView().byId("btnSettingsDownload2"); 
		lnkNotifAppUserManual = this.getView().byId("lnkNotifAppUserManual");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
	        this.getView().byId("languageSelectSettings").setSelectedKey("hu_HU");
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
	        this.getView().byId("languageSelectSettings").setSelectedKey("sr_RS");
		} 
		
		pageTitle.setText(oBundle.getText("SettingsTitle"));
		languageLabel.setText(oBundle.getText("RegLanguageLabel"));
		applicationLabel.setText(oBundle.getText("SettingsDownloadAppLabel"));
		warningText.setText(oBundle.getText("AppDownloadWarningText")); 
		btnDownloadApp.setText(oBundle.getText("BtnDownloadApp"));
		btnSaveSettings.setText(oBundle.getText("BtnSwitchLanguage"));
		secondFileLabel.setText(oBundle.getText("SettingsDownloadFile"));
		btnDownloadSecondFile.setText(oBundle.getText("BtnDownloadFile"));
		lnkNotifAppUserManual.setText(oBundle.getText("NotifAppUserManualLink")); //Uputstvo za instalaciju aplikacije za notifikacije/obaveštenja
	},
	
	onNavBackSettings: function() {

		sap.ui.core.UIComponent.getRouterFor(this).navTo("MainPage");
		
	},
	
	btnSavePress: function(oEvent) {
		
		var language = this.getView().byId("languageSelectSettings").getSelectedKey();
		
	    // save language id in global storage
	    oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);   
	    oJQueryStorage.put("lang", language);
	    
	    sap.m.MessageToast.show(oBundle.getText("SettingsSaved"));
		
	},
	
	btnDownloadPress: function(oEvent) {
		
		if(sap.ui.Device.system.phone) {
			sap.m.MessageToast.show(oBundle.getText("PhoneNoAppDownload"));
		} else {
			// download file 
			var link=document.createElement('a');
			document.body.appendChild(link);
			link.href="http://www.mksolutions.co.rs/MKeCommerce/Notification%20Installer/Notification%20Installer.msi";
			link.click();
		}
	},
	
	btnDownloadPress2: function(oEvent) {
		
		if(sap.ui.Device.system.phone) {
			sap.m.MessageToast.show(oBundle.getText("PhoneNoFileDownload"));
		} else {
		
		    var inputUsername = user;
		    var inputPassword = pass;
		    
		    var encryptedUsername = "";
		    var encryptedPassword = "";
	
		    var encryptKey = "1000";
	
		    for (var i = 0; i < inputUsername.length; i++) {
		    	var charCode = inputUsername.charCodeAt(i);
		    	var combinedCode = charCode ^ encryptKey;
		    	encryptedUsername = encryptedUsername + String.fromCharCode(combinedCode);
		    }
	
		    for (var i = 0; i < inputPassword.length; i++) {
		    	var charCode = inputPassword.charCodeAt(i);
		    	var combinedCode = charCode ^ encryptKey;
		    	encryptedPassword = encryptedPassword + String.fromCharCode(combinedCode);
		    }
	
			jQuery.sap.require("sap.ui.core.util.File");
			var file = new sap.ui.core.util.File.save([encryptedUsername + ":" + encryptedPassword], "partnerData", "bin", null, "utf-8");
			
		}
		
	},
	
	showWizard: function() {
		
		var wizard = {};
		wizard.back = "X";
		sap.ui.getCore().setModel(wizard, "wizBack");
		
		sap.ui.core.UIComponent.getRouterFor(this).navTo("NotifAppWizard",{});
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Settings
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Settings
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Settings
*/
//	onExit: function() {
//
//	}

});