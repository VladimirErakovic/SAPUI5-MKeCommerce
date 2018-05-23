jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.LoginPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf login.LoginPage
*/
	onInit: function() {
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		language = oJQueryStorage.get("lang");
		
		if(language === "hu_HU") {
	        // read texts from i18n_hu model
	        fBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        fBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
	        if(language == null) {
	        	language = "sr_RS";
	        }
		}
		
		var urlCred = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_TEST_CONNECTION_SRV/";
		var oModelCred = new sap.ui.model.odata.ODataModel(urlCred, true); 
		
		var sid = "DEV";   // izbor servera
		
		oModelCred.read("/TestSet(IAppid='1000',IId='" + sid + "')", null, null, false, 
			function(oResponse) {
			
				param1 = oResponse.EParam1; 
			    console.log(param1);
			    param2 = oResponse.EParam2;
			    console.log(param2);
			    var error = oResponse.EErrMsg;
			    console.log(error);
			    
			    if(error !== "") {

				    sap.m.MessageBox.show(
				    		fBundle.getText("JustSomeError") + " " + error, {
					          icon: sap.m.MessageBox.Icon.ERROR,
					          title: fBundle.getText("Error"),
					          actions: sap.m.MessageBox.Action.OK
					      }
					);
			    	
			    } else {
			    	
				    var oJQueryStorageLocal = jQuery.sap.storage(jQuery.sap.storage.Type.local);   // bilo session
				    oJQueryStorageLocal.put("user", param1);
				    oJQueryStorageLocal.put("pass", param2);
			    }
	
			},
			function(oError) { // onError function called when there was an error

			    sap.m.MessageBox.show(
			    		fBundle.getText("ServerCommunicationError"), {
				          icon: sap.m.MessageBox.Icon.ERROR,
				          title: fBundle.getText("Error"),
				          actions: sap.m.MessageBox.Action.OK
				      }
				);
			}
		);
		
	    this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	    this._oRouter.attachRouteMatched(this.handleRouteMatched, this);
		
	},
	
	onUsernameSubmit : function(oEvent) {
		  this.getView().byId("loginButton").firePress();
	},
	
	onUsernameChange: function() {
		
		var username = this.getView().byId("userID").valueOf().getValue();		
		username = username.toUpperCase();
		if(username.includes('Š') || username.includes('Ć') || username.includes('Č') || username.includes('Ž') || username.includes('Đ')) {
			username = username.replace(/Š/g,'S').replace(/Ć/g,'C').replace(/Č/g,'C').replace(/Ž/g,'Z').replace(/Đ/g,'Dj');
			sap.m.MessageToast.show(oBundle.getText("RegMsgUseAlphabetOnly"));  //Molimo koristite samo slova alfabeta (bez Š,Č,Ć,Ž,Đ).
		}	
		this.getView().byId("userID").setValue(username);
	},
	
	
	onPasswordSubmit : function(oEvent) {
		  this.getView().byId("loginButton").firePress();
	},
	
	
	handleRouteMatched : function (evt) {
		
		if (evt.getParameter("name") == "LoginPage") {
		
			var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			language = oJQueryStorage.get("lang");
			console.log("Language: " + language);
			
			var txtTitleWelcome = this.getView().byId("welcomeText");
			var txtUsername = this.getView().byId("usernameText");
			var inpUsername = this.getView().byId("userID");
			var txtPassword = this.getView().byId("passwordText");
			var inpPassword = this.getView().byId("passID");
			var btnLogin = this.getView().byId("loginButton");
			var txtNoAccount = this.getView().byId("noAccountText");
			var lnkRegistration = this.getView().byId("registrationLink");
			var txtLostPassword = this.getView().byId("lostPassText");
			var lnkPasswordReset = this.getView().byId("passResetLink");
			var txtMKIT = this.getView().byId("txtCompanyName");
			
			msgNoUsername = "";
			msgNoPassword = "";
			msgAdminApproval = "";
			titleWait = "";
			titleError = "";
			msgNotApproved = "";
			
			if(language === "hu_HU") {
		        // read texts from i18n_hu model
		        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
			} else {
		        // read texts from i18n model
		        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
			}
			
	        txtTitleWelcome.setText(oBundle.getText("WelcomeLogin"));
	        txtUsername.setText(oBundle.getText("UserName"));
	        inpUsername.setPlaceholder(oBundle.getText("EnterEmail"));
	        txtPassword.setText(oBundle.getText("Password"));
	        inpPassword.setPlaceholder(oBundle.getText("EnterPassword"));
	        btnLogin.setText(oBundle.getText("BtnLogin"));
	        txtNoAccount.setText(oBundle.getText("NoAccount"));
	        lnkRegistration.setText(oBundle.getText("Registration"));
			txtLostPassword.setText(oBundle.getText("LostPassword"));
			lnkPasswordReset.setText(oBundle.getText("PasswordReset"));
			txtMKIT.setText(oBundle.getText("MKIT"));
			msgNoUsername = oBundle.getText("MsgNoUserName");
			msgNoPassword = oBundle.getText("MsgNoPassword");
			msgAdminApproval = oBundle.getText("MsgAdminApproval");
			titleWait = oBundle.getText("PleaseWait");
			titleError = oBundle.getText("Error");
			msgNotApproved = oBundle.getText("MsgNotApproved");
			
		}
	},
	
	
	btnLogin: function(evt) {
		
		that = this;
		
		var urlLogin = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_UI5_DTA_LOGIN_SRV/";
		var oModel = new sap.ui.model.odata.ODataModel(urlLogin, true, param1, param2); 
		
		var oView = this.getView();
		var username = oView.byId("userID").valueOf().getValue();
		var password = oView.byId("passID").valueOf().getValue();	
		
		//username = username.toUpperCase();
		//console.log("Username velikim slovima: " + username);
		
		if(username == "") {
			// Niste uneli korisničko ime - e-mail.
			sap.m.MessageToast.show(msgNoUsername); // default disappear in 3 sec
			return;
		}
		if(password == "") {
			//Niste uneli lozinku.
			sap.m.MessageToast.show(msgNoPassword);
			return;
		}

		var appty = "W";	// W - web, za logovanje preko sapui5

		oModel.read("/CredSet(IAppid='1000',IEmail='" + username + "',IAppty='" + appty + "',IPassw='" + password + "')", null, null, false, 
			function(oResponse) { // onSuccess function called when everything is ok

				var registered = oResponse.EDtaod; 
			    console.log(registered);
			    var partnid = oResponse.EPartnid;
			    console.log(partnid);
			    var status = oResponse.EStatus;
			    console.log(status);
			    var error = oResponse.EErrMsg;
			    console.log(error);
			    
			    // save partner id in session storage
			    var oJQueryStorageLocal = jQuery.sap.storage(jQuery.sap.storage.Type.local);   // bilo session
			    oJQueryStorageLocal.put("partnid", partnid);

			    
			    if(status === "A") {		// aktivan ??
			    
				    if(registered === "D") {	   // registrovan - odobren
	
						sap.ui.core.UIComponent.getRouterFor(that).navTo("MainPage" ,{});  
						
				    } else if(registered === "W") {	 // čeka odobrenje

					    sap.m.MessageBox.show(
					    		msgAdminApproval, {	// Vaša prijava čeka odobrenje administatora.
						          icon: sap.m.MessageBox.Icon.SUCCESS,
						          title: titleWait,
						          actions: sap.m.MessageBox.Action.OK
						      }
						);
				    } else if(registered === "N") {	 // odbijen

					    sap.m.MessageBox.show(
					    		msgNotApproved, {	// Vaša prijava nažalost nije odobrena.
						          icon: sap.m.MessageBox.Icon.ERROR,
						          title: titleError,
						          actions: sap.m.MessageBox.Action.OK
						      }
						);
				    }
				    
			    } else if(status === "N"){	 // neaktivan ??
			    	
				    sap.m.MessageBox.show(
				    		msgAdminApproval, {	// Vaša prijava čeka odobrenje administatora. ????????
					          icon: sap.m.MessageBox.Icon.ERROR,
					          title: titleWait,
					          actions: sap.m.MessageBox.Action.OK
					      }
					);
			    
			    } else if(status === "O"){	// odbijen

				    sap.m.MessageBox.show(
				    		oBundle.getText("YourAccountIsDeleted"), {	// Vaš nalog je obrisan. Obratite se call centru.
					          icon: sap.m.MessageBox.Icon.ERROR,
					          title: titleError,
					          actions: sap.m.MessageBox.Action.OK
					      }
					);
					
			    } else if(status === "B"){	 // blokiran

				    sap.m.MessageBox.show(
				    		oBundle.getText("YourAccountIsBlocked"), {	// Vaš nalog je blokiran. Obratite se call centru.
					          icon: sap.m.MessageBox.Icon.ERROR,
					          title: titleError,
					          actions: sap.m.MessageBox.Action.OK
					      }
					);
					
			    } else {

				    sap.m.MessageBox.show(
				    		oBundle.getText("JustSomeError") + " " + error, {
					          icon: sap.m.MessageBox.Icon.ERROR,
					          title: titleError,
					          actions: sap.m.MessageBox.Action.OK
					      }
					);			
			    }

			}, 		
			function(oError) { // onError function called when there was an error

			    sap.m.MessageBox.show(
			    		oBundle.getText("ServerCommunicationError"), {
				          icon: sap.m.MessageBox.Icon.ERROR,
				          title: titleError,
				          actions: sap.m.MessageBox.Action.OK
				      }
				);
	
			}
		);
		
		
	},

	handleRegistrationLink: function(evt) {
		
		sap.ui.core.UIComponent.getRouterFor(this).navTo("RegistrationPage");
	},
	
	
	handlePasswordResetLink: function(evt) {
		
         var oButton1 = new sap.m.Button("Save", {
	            text: oBundle.getText("BtnSend"),
	           tap: [ this.Save, this ]
	     });
	
	     var oButton2 = new sap.m.Button("Cancel", {
	
	            text: oBundle.getText("BtnCancel"),
	            tap: [ this.Cancel, this ]
	
	     });
		
         var oDialog = new sap.m.Dialog("ResetDialog",{
        	 
            title: oBundle.getText("EnterYourEmailAddress"),
            modal: true,
            contentWidth:"1em",
            buttons: [ oButton1, oButton2 ],
		    content:[
		             new sap.m.Label({text:"E-mail"}),
		             new sap.m.Input({
		
		            	  maxLength: 20,
		            	  id: "email"
		
		              }),
		
		             ]
         }).open();

	},
	
	Save: function() {
		
		// prvo pozovi neki servis ili nesto smisli
		sap.m.MessageToast.show(oBundle.getText("ResetPasswordToast"));
		
		sap.ui.getCore().byId("Save").destroy();
		sap.ui.getCore().byId("Cancel").destroy();
        sap.ui.getCore().byId("ResetDialog").destroy();
		
	},
	
	Cancel: function() {
		
		sap.ui.getCore().byId("Save").destroy();
		sap.ui.getCore().byId("Cancel").destroy();
        sap.ui.getCore().byId("ResetDialog").destroy();
        
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf login.LoginPage
*/
//	onBeforeRendering: function() {
//		
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf login.LoginPage
*/
//	onAfterRendering: function() {		
//
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf login.LoginPage
*/
//	onExit: function() {
//
//	}

});