jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.split.Poll", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.split.Poll
*/
	onInit: function() {
		
		that = this;
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		partnid = oJQueryStorage.get("partnid");
		language = oJQueryStorage.get("lang");
		
		pageTitle = this.getView().byId("pollDetailsPage");
		answerLabel = this.getView().byId("pollAnswerLabel");
		btnSend = this.getView().byId("btnPollSend");
		btnCancel = this.getView().byId("btnPollCancel");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setTitle(oBundle.getText("PollPageTitle"));
		answerLabel.setText(oBundle.getText("PollAnswerLabel") + " ");
		btnSend.setText(oBundle.getText("BtnSend"));
		btnCancel.setText(oBundle.getText("BtnCancel"));
		
		var view = this.getView();

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
			// when detail navigation occurs, update the binding context
			if (oEvent.getParameter("name") === "Poll") {
				var bindingContext = this.getView().getBindingContext();
				ntfcid = oEvent.getParameter("arguments").offer;
				
				var offer = sap.ui.getCore().getModel("singleOffer");
				var notxt = offer.notxt;
				notst = offer.notst;
				
				view.byId("pollDetailHeader").setTitle(notxt);
				
				if(notst === "7" || notst === "9") {	// disable buttons if dogovoreno ili otkazano
					view.byId("btnOfferSend").setEnabled(false);
					view.byId("btnOfferCancel").setEnabled(false);
				}
				
				
				if(ntfcid !== null) {
					var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_PONUDA_GET_DETAIL_2_SRV/";		
					var oModel = new sap.ui.model.odata.ODataModel(url, true, user, pass);
	
					oModel.read("/OfferSet(IAppid='1000',INtfcid='" + ntfcid + "',IPartnid='" + partnid + "')", null, null, false, 
						function(oResponse) { // onSuccess function called when everything is ok
	
						    var partnerAnswer = oResponse.EDogovText;
						    var error = oResponse.EErrMsg;
						    console.log(error);
						    
						    if(error == ""){
						    	
							    view.byId("txtPollAnswer").setValue(partnerAnswer);
							    
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
	},
	
	openActionSheet: function() {

		if (!this._oActionSheet) {
			this._oActionSheet = new sap.m.ActionSheet({
				buttons: new sap.ushell.ui.footerbar.AddBookmarkButton()
			});
			this._oActionSheet.setShowCancelButton(true);
			this._oActionSheet.setPlacement(sap.m.PlacementType.Top);
		}
		
		this._oActionSheet.openBy(this.getView().byId("actionButton"));
	},
	
	onExit: function() {
		if (this._oActionSheet) {
			this._oActionSheet.destroy();
			this._oActionSheet = null;
		}
	},
	
	
	onSendPollAnswer: function () {
		
		var oView = this.getView();
		
		dialog = new sap.m.Dialog({
			title: oBundle.getText("CustomOConfirm"),
			icon: 'sap-icon://accept',
			type: 'Message',
			content: [
				new sap.ui.layout.VerticalLayout({
					width: '350px',
					content: [
							new sap.m.Text({ text: oBundle.getText("PollAnswerLabel") + " :" }),
							new sap.m.Text({ text: oView.byId("txtPollAnswer").valueOf().getValue() })
							]
						}),
			],
			beginButton: new sap.m.Button({
				text: oBundle.getText("BtnSend"),
				icon: 'sap-icon://action',  
				type: 'Emphasized',
				tap: [ this.onSendRespond, this ]
			}),
			endButton: new sap.m.Button({
				text: oBundle.getText("BtnCancel"),
				icon: 'sap-icon://decline', 
				press: function () {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});

		dialog.open();
	},
	
	
	onSendRespond: function() {
		
		dialog.close();
		
		var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_ANKETA_RESPOND_SRV/";		
		var oModel = new sap.ui.model.odata.ODataModel(url, true, user, pass); 
					
		var oView = this.getView();
		
		// comment
		var answer = oView.byId("txtPollAnswer").valueOf().getValue();
		answer = answer.replace(/š/g,'s').replace(/Š/g,'S').replace(/ć/g,'c').replace(/Ć/g,'C').replace(/č/g,'c')
			           .replace(/Č/g,'C').replace(/ž/g,'z').replace(/Ž/g,'Z').replace(/đ/g,'dj').replace(/Đ/g,'Dj');	
		var answerEncoded = encodeURIComponent(answer);
		console.log(answerEncoded);
		

		oModel.read("/AnketaSet(IAppid='1000',INtfcid='" + ntfcid + "',IOdgovText='" + answerEncoded + "')", null, null, false, 
			function(oResponse) { // onSuccess function called when everything is ok

			    var error = oResponse.EReturnCode;
			    console.log(error);
		    
			    if(error == "") {
 
				    sap.m.MessageBox.show(
				    		oBundle.getText("YourAnswerSentSuccessfully"), {	// Vaš odgovor je uspešno prosleđen.
					          icon: sap.m.MessageBox.Icon.SUCCESS,
					          title: oBundle.getText("Ok"),
					          actions: sap.m.MessageBox.Action.OK,
					          onClose: function(oAction) { 
					        	  sap.ui.core.UIComponent.getRouterFor(that).navTo("MainPage" ,{}); 
					        	  }
					      }
					);
			    } else if(error == "9") {
	
				    sap.m.MessageBox.show(
				    		oBundle.getText("TwoMinutesBlockade"), {	//Isteklo je vreme izmene odgovora od 2 minuta.
					          icon: sap.m.MessageBox.Icon.ERROR,
					          title: oBundle.getText("Error"),
					          actions: sap.m.MessageBox.Action.OK
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

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.split.Poll
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.split.Poll
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.split.Poll
*/
//	onExit: function() {
//
//	}

});
