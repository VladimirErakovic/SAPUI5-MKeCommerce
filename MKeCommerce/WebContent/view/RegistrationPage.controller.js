jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.RegistrationPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.RegistrationPage
*/
	onInit: function() {
		
		var oModel = new sap.ui.model.json.JSONModel("model/language.json");
		this.getView().setModel(oModel);
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		language = oJQueryStorage.get("lang");
		console.log("Language: " + language);
		
		pageTitle = this.getView().byId("registrationTitle");
		jmbgLabel = this.getView().byId("regJMBGLabel");
		jmbgPlaceholder = this.getView().byId("jmbgID");
		phoneLabel = this.getView().byId("regPhoneLabel");
		phonePlaceholder = this.getView().byId("phoneID"); 
		nameLabel = this.getView().byId("regNameLabel"); 
		namePlaceholder = this.getView().byId("nameID");
		languageLabel = this.getView().byId("reglanguageLabel");
		emailLabel = this.getView().byId("regEmailLabel");
		emailPlaceholder = this.getView().byId("userRegID");
		passwordLabel = this.getView().byId("regPasswordLabel");
		passwordPlaceholder = this.getView().byId("passRegID");
		passAgainLabel = this.getView().byId("regPassAgainLabel");
		passAgainPlaceholder = this.getView().byId("passRegID2");
		btnRegister = this.getView().byId("btnRegister");
		appDownloadLabel = this.getView().byId("regAppDownloadLabel");
		
		if(language === "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setText(oBundle.getText("RegTitle"));
		jmbgLabel.setText(oBundle.getText("RegJmbgLabel"));
		jmbgPlaceholder.setPlaceholder(oBundle.getText("RegJmbgPlaceholder"));
		phoneLabel.setText(oBundle.getText("RegPhoneLabel"));
		phonePlaceholder.setPlaceholder(oBundle.getText("RegPhonePlaceholder"));
		nameLabel.setText(oBundle.getText("RegNameLabel"));
		namePlaceholder.setPlaceholder(oBundle.getText("RegNamePlaceholder"));
		languageLabel.setText(oBundle.getText("RegLanguageLabel"));
		emailLabel.setText(oBundle.getText("RegEmailLabel"));
		emailPlaceholder.setPlaceholder(oBundle.getText("RegEmailPlaceholder"));
		passwordLabel.setText(oBundle.getText("RegPasswordLabel"));
		passwordPlaceholder.setPlaceholder(oBundle.getText("RegPasswordPlaceholder"));
		passAgainLabel.setText(oBundle.getText("RegPassAgainLabel"));
		passAgainPlaceholder.setPlaceholder(oBundle.getText("RegPassAgainPlaceholder"));
		btnRegister.setText(oBundle.getText("BtnRegister"));
		appDownloadLabel.setText(oBundle.getText("RegAppDownloadLabel"));
	},
	
	languageChanged: function(oEvent) {
		
		var languageGet = this.getView().byId("languageSelect").getSelectedKey();
		
		if(languageGet === "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setText(oBundle.getText("RegTitle"));
		jmbgLabel.setText(oBundle.getText("RegJmbgLabel"));
		jmbgPlaceholder.setPlaceholder(oBundle.getText("RegJmbgPlaceholder"));
		phoneLabel.setText(oBundle.getText("RegPhoneLabel"));
		phonePlaceholder.setPlaceholder(oBundle.getText("RegPhonePlaceholder"));
		nameLabel.setText(oBundle.getText("RegNameLabel"));
		namePlaceholder.setPlaceholder(oBundle.getText("RegNamePlaceholder"));
		languageLabel.setText(oBundle.getText("RegLanguageLabel"));
		emailLabel.setText(oBundle.getText("RegEmailLabel"));
		emailPlaceholder.setPlaceholder(oBundle.getText("RegEmailPlaceholder"));
		passwordLabel.setText(oBundle.getText("RegPasswordLabel"));
		passwordPlaceholder.setPlaceholder(oBundle.getText("RegPasswordPlaceholder"));
		passAgainLabel.setText(oBundle.getText("RegPassAgainLabel"));
		passAgainPlaceholder.setPlaceholder(oBundle.getText("RegPassAgainPlaceholder"));
		btnRegister.setText(oBundle.getText("BtnRegister"));
	},
	
	
	btnRegister: function(evt) {
		
		that = this;
		
		oView = this.getView();
		
		//provera validnosti jmbg broja
		var jmbg = oView.byId("jmbgID").valueOf().getValue();
		var ctrNumber = 0;
		
		var a = Number.parseInt(jmbg.substring(0,1));
		var b = Number.parseInt(jmbg.substring(1,2));
		var v = Number.parseInt(jmbg.substring(2,3));
		var g = Number.parseInt(jmbg.substring(3,4));
		var d = Number.parseInt(jmbg.substring(4,5));
		var w = Number.parseInt(jmbg.substring(5,6));
		var e = Number.parseInt(jmbg.substring(6,7));
		var x = Number.parseInt(jmbg.substring(7,8));
		var z = Number.parseInt(jmbg.substring(8,9));
		var i = Number.parseInt(jmbg.substring(9,10));
		var j = Number.parseInt(jmbg.substring(10,11));
		var k = Number.parseInt(jmbg.substring(11,12));
		
		var l = 11 - (7*(a + e) + 6*(b + x) + 5*(v + z) + 4*(g + i) + 3*(d + j) + 2*(w + k))%11;

		if (l > 9) {
			ctrNumber = 0;
		} else if ((l >= 1) && (l <= 9)) {
			ctrNumber = l;
		}

		if(ctrNumber == Number.parseInt(jmbg.substring(12,13))) {
			//sap.m.MessageToast.show(oBundle.getText("JMBGControlNumberValid"));
		} else {
			sap.m.MessageToast.show(oBundle.getText("JMBGControlNumberInvalid"));
			return;
		}
		
		var phone = oView.byId("phoneID").valueOf().getValue();
		if (phone == "") {
			//Molimo unesite Vaš broj telefona.
			sap.m.MessageToast.show(oBundle.getText("RegMsgNoPhone"));
			return;
		}		
		var name = oView.byId("nameID").valueOf().getValue();
		if (name == "") {
			//Molimo unesite Vaše ime i prezime.
			sap.m.MessageToast.show(oBundle.getText("RegMsgNoName"));
			return;
		}
		var username = oView.byId("userRegID").valueOf().getValue();
		if (username == "") {
			//Molimo unesite Vaše korisničko ime.
			sap.m.MessageToast.show(oBundle.getText("RegMsgNoUsername"));
			return;
		}
		
		var password1 = oView.byId("passRegID").valueOf().getValue();
		var password2 = oView.byId("passRegID2").valueOf().getValue();
		if(password1 == "") {
			sap.m.MessageToast.show(oBundle.getText("RegMsgNoPassword"));  //Molimo unesite lozinku.
			return;
		} else if (password2 == "") {
			sap.m.MessageToast.show(oBundle.getText("RegMsgNoPassword2"));  //Molimo ponovite lozinku u drugom polju.
			return;
		}
		if(password1 !== password2) {
			sap.m.MessageToast.show(oBundle.getText("RegMsgDifferentPasswords"));  //Ponovljena lozinka je različita od prve.
			return;
		}
		
        var oBtnAccept = new sap.m.Button("Accept", {
            text: oBundle.getText("RegAccept"),
            tap: [ this.Accept, this ]
        });

        var oBtnQuit = new sap.m.Button("Quit", {
            text: oBundle.getText("RegCancel"),
            tap: [ this.Quit, this ]
        });
        
        var oDialog = new sap.m.Dialog("AgreementDialog",{
          	 
            title: oBundle.getText("RulesBtn"),
            modal: true,
            contentHeight: "400px",
            contentWidth: "400px",
            buttons: [ oBtnAccept, oBtnQuit ],
		    content:[
		             new sap.ui.core.HTML("html1", { content : oBundle.getText("UserAgreement")  }),
		            ]
         }).open();
		
	},
	
	
	Accept: function() {

		var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_UI5_DTA_REGISTRATION_SRV/";		
		var oModel = new sap.ui.model.odata.ODataModel(url, true, user, pass);
			
		var oView = this.getView();
		var jmbg = oView.byId("jmbgID").valueOf().getValue();
		var phone = oView.byId("phoneID").valueOf().getValue();
		var name = oView.byId("nameID").valueOf().getValue();
		var language = oView.byId("languageSelect").getSelectedKey();
		var username = oView.byId("userRegID").valueOf().getValue();
		var password = oView.byId("passRegID").valueOf().getValue();
		console.log(jmbg + ", " + phone + ", " + name  + ", " + language  + ", " + username  + ", " + password);
		
		username = username.toUpperCase(); //ovo ne treba ali neka stoji za svaki slucaj
		console.log("Username velikim slovima: " + username);
		
		name = name.replace(/š/g,'s').replace(/Š/g,'S').replace(/ć/g,'c').replace(/Ć/g,'C').replace(/č/g,'c')
			       .replace(/Č/g,'C').replace(/ž/g,'z').replace(/Ž/g,'Z').replace(/đ/g,'dj').replace(/Đ/g,'Dj'); 
		//username = username.replace(/š/g,'s').replace(/Š/g,'S').replace(/ć/g,'c').replace(/Ć/g,'C').replace(/č/g,'c')
		//	               .replace(/Č/g,'C').replace(/ž/g,'z').replace(/Ž/g,'Z').replace(/đ/g,'dj').replace(/Đ/g,'Dj');
		
	    // save language id in global storage
	    oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);   // bilo session
	    oJQueryStorage.put("lang", language);		

		oModel.read("/RegSet(IAppid='1000',IEmail='" + username + "',IPassw='" + password + "',IStcd1='" + jmbg + 
				"',IPartnri='" + name + "',IMobtel='" + phone + "',ILangu='" + language + "')", null, null, false, 
			function(oResponse) { // onSuccess function called when everything is ok

				var registered = oResponse.EDtaod;   //al moze i samo ovako!
			    var partnid = oResponse.EPartnid;
			    var error = oResponse.EErrMsg;
			    console.log(error);
			    
			    // save partner id in session storage
			    var oJQueryStorageLocal = jQuery.sap.storage(jQuery.sap.storage.Type.local);   // bilo session
			    oJQueryStorageLocal.put("partnid", partnid);
			    
			    if(sap.ui.Device.system.desktop || sap.ui.Device.system.combi) {  // skini fajl ako je desktop ili desktop/touch/windows
			    	if(error === "" || error === "N") {	 // ovo sam zaboravio pa je skidao i na error..
			    
					    var inputUsername = username;
					    var inputPassword = password;
					    
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
		
					    console.log(encryptedUsername + ":" + encryptedPassword);
					    
						jQuery.sap.require("sap.ui.core.util.File");
						var file = new sap.ui.core.util.File.save([encryptedUsername + ":" + encryptedPassword], "partnerData", "bin", null, "utf-8");
						
						sap.m.MessageToast.show(oBundle.getText("RegistrationDownloadFile"));
			    	}
			    }
			    
			    if(error === "") {

				    sap.m.MessageBox.show(
				    		oBundle.getText("DataSentSuccessfully"), {	//Podaci su uspešno prosleđeni.
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
			
			    } else if(error === "N") {

				    sap.m.MessageBox.show(
				    		oBundle.getText("FillExtraRegData"), {	//Molimo popunite dodatne podatke registracije.
					          icon: sap.m.MessageBox.Icon.SUCCESS,
					          title: oBundle.getText("GoOn"),
					          actions: sap.m.MessageBox.Action.OK,
					          onClose: function(oAction) { 
									// redirect
					        	  sap.ui.core.UIComponent.getRouterFor(that).navTo("ExtraRegPage" ,{});
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
				
		sap.ui.getCore().byId("Accept").destroy();
		sap.ui.getCore().byId("Quit").destroy();
        sap.ui.getCore().byId("AgreementDialog").destroy();
		
	},
	
	
	Quit: function() {
		
		sap.ui.getCore().byId("Accept").destroy();
		sap.ui.getCore().byId("Quit").destroy();
        sap.ui.getCore().byId("AgreementDialog").destroy();
        
	},
	
	
	onNavBack: function () {

		sap.ui.core.UIComponent.getRouterFor(this).navTo("LoginPage" ,{});
	},
	
	
	onUsernameChange: function() {
		
		var username = this.getView().byId("userRegID").valueOf().getValue();		
		username = username.toUpperCase();
		if(username.includes('Š') || username.includes('Ć') || username.includes('Č') || username.includes('Ž') || username.includes('Đ')) {
			username = username.replace(/Š/g,'S').replace(/Ć/g,'C').replace(/Č/g,'C').replace(/Ž/g,'Z').replace(/Đ/g,'Dj');
			sap.m.MessageToast.show(oBundle.getText("RegMsgUseAlphabetOnly"));  //Molimo koristite samo slova alfabeta (bez Š,Č,Ć,Ž,Đ).
		}	
		this.getView().byId("userRegID").setValue(username);
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.RegistrationPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.RegistrationPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.RegistrationPage
*/
//	onExit: function() {
//
//	}

});