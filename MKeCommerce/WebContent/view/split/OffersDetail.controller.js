jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.split.OffersDetail", {
	
	// pri ucitavanju treba videti da li je vec odgovoreno i ako jeste onda button.setEnabled(false)
	
	onInit: function() {
		
		that = this;
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		partnid = oJQueryStorage.get("partnid");
		language = oJQueryStorage.get("lang");
		
		pageTitle = this.getView().byId("offerDetailsPage");
		priceLabel = this.getView().byId("offersDPriceLabel");
		amountLabel = this.getView().byId("offersDAmountLabel");
		validFromLabel = this.getView().byId("offersDValidFromLabel");
		validUntilLabel = this.getView().byId("offersDValidUntilLabel");
		filledLabel = this.getView().byId("offersDFillLabel");
		btnSend = this.getView().byId("btnOfferSend");
		btnCancel = this.getView().byId("btnOfferCancel");
		btnExit = this.getView().byId("detailExitButton");
		btnMinus = this.getView().byId("btnMinus");
		btnPlus = this.getView().byId("btnPlus");
		txtSendAction = this.getView().byId("sendClickActionText");
		txtCancelAction = this.getView().byId("cancelClickActionText");
		createAnswerLabel = this.getView().byId("createAnswerLabel");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setTitle(oBundle.getText("OffersDetailTitle"));
		priceLabel.setText(oBundle.getText("CustomOPriceLabel"));
		amountLabel.setText(oBundle.getText("CustomOAmountLabel"));
		validFromLabel.setText(oBundle.getText("OfferValidFrom"));
		validUntilLabel.setText(oBundle.getText("OfferValidUntil"));
		filledLabel.setText(oBundle.getText("OfferFilled"));
		btnSend.setText(oBundle.getText("BtnSend"));
		btnCancel.setText(oBundle.getText("BtnCancel"));
		btnExit.setTooltip(oBundle.getText("OfferDetailExitBtnTooltip"));
		btnMinus.setTooltip(oBundle.getText("BtnMinus"));
		btnPlus.setTooltip(oBundle.getText("BtnPlus"));
		txtSendAction.setText(oBundle.getText("OffersDSendActionText"));
		txtCancelAction.setText(oBundle.getText("OffersDCancelActionText"));
		createAnswerLabel.setText(oBundle.getText("OffersDCreateAnswerLabel"));
		
		var view = this.getView();

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
			// when detail navigation occurs, update the binding context
			if (oEvent.getParameter("name") === "Detail") {

				var bindingContext = view.getBindingContext();
				ntfcid = oEvent.getParameter("arguments").offer;
				// Make sure the master is here
				console.log(ntfcid);
				
				
				var offer = sap.ui.getCore().getModel("singleOffer");
				var notxt = offer.notxt;
				var smerpOrg = offer.smerp;
				maktx = offer.maktx;
				notst = offer.notst;
				sttxt = offer.sttxt;
				
				if(smerpOrg === "P") {
					view.byId("idOfferPrice").setEnabled(false);
				} else {
					view.byId("idOfferPrice").setEnabled(true);
				}
				
				view.byId("offerDetailHeader").setTitle(maktx).setIntro(notxt);
				view.byId("offersDStatus").setText(sttxt);
				
				if(notst === "7" || notst === "9") {	// disable buttons if dogovoreno ili otkazano
					view.byId("btnOfferSend").setEnabled(false);
					view.byId("btnOfferCancel").setEnabled(false);
					view.byId("idOfferPrice").setEnabled(false);
					view.byId("idOfferAmount").setEnabled(false);
				}
				
				var amountInput = view.byId("idOfferAmount");
				amountInput.setValue(0);
				
				if(ntfcid !== null) {
					var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_PONUDA_GET_DETAIL_2_SRV/";		
					var oModel = new sap.ui.model.odata.ODataModel(url, true, user, pass);
	
					oModel.read("/OfferSet(IAppid='1000',INtfcid='" + ntfcid + "',IPartnid='" + partnid + "')", null, null, false, 
						function(oResponse) { // onSuccess function called when everything is ok
	
						    var preis = oResponse.EPreis2;
						    console.log(preis);
						    smerp = oResponse.ESmerp;
						    console.log(smerp);
						    pdvst = oResponse.EPdvst;
						    console.log(pdvst);
						    var validFromDate = oResponse.EValidFromDate;
						    var validFromTime = oResponse.EValidFromTime;
						    var validToDate = oResponse.EValidToDate;
						    var validToTime = oResponse.EValidToTime;
						    var error = oResponse.EErrMsg;
						    console.log(error);
						    
						    prtnKol = oResponse.EPrtnKol;
						    prtnCen2 = oResponse.EPrtnCen2;
						    
						    if(error == ""){
					    
						    	if(notst === "4" || notst === "5" || notst === "6") {
						    		prtnCen2 = prtnCen2.replace(',','.');
							        var number = Number(prtnCen2);
							        var floatValue = parseFloat(number).toFixed(2);
							        var formatter = new Intl.NumberFormat('de-DE', {
							        	minimumFractionDigits: 2
							        });   
								    view.byId("idOfferPrice").setValue(formatter.format(floatValue));
								    view.byId("idOfferAmount").setValue(parseInt(prtnKol));
						    	} else {
								    preis = preis.replace(',','.');
							        var number = Number(preis);
							        var floatValue = parseFloat(number).toFixed(2);
							        var formatter = new Intl.NumberFormat('de-DE', {
							        	minimumFractionDigits: 2
							        });   
								    view.byId("idOfferPrice").setValue(formatter.format(floatValue));
						    	}
	
							    // SAPUI5 formatters  
							    var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd.MM.yyyy" });
							    var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm:ss a" });
							    // timezoneOffset is in hours convert to milliseconds  
							    var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;  
							    // format date and time to strings offsetting to GMT 
							    var timeStrFrom = timeFormat.format(new Date(validFromTime.ms + TZOffsetMs));   
							    var timeStrTo = timeFormat.format(new Date(validToTime.ms + TZOffsetMs));  
							    
							    view.byId("validFromDate").setText(dateFormat.format(validFromDate));
							    console.log(timeStrFrom);
							    view.byId("validFromTime").setText(timeStrFrom);
							    view.byId("validToDate").setText(dateFormat.format(validToDate));
							    console.log(timeStrTo);
							    view.byId("validToTime").setText(timeStrTo);
							    
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
	
 /**	openActionSheet: function() {

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
	},  **/
	
	onCancelDetails: function() {
		
		sap.ui.core.UIComponent.getRouterFor(that).navTo("NotFound" ,{});
		
	},
	
	
	handleNavButtonPress: function(oEvent) {
        var history = sap.ui.core.routing.History.getInstance();
		var url = sap.ui.core.UIComponent.getRouterFor(this).getURL("Master", {});
		var direction = history.getDirection(url);
		if ("Backwards" === direction) {
			window.history.go(-1);
		} else {
			var replace = true; // otherwise we go backwards with a forward history
			this.navTo(route, data, replace);
		}
	},
	
	
	btnMinusAction: function(evt) {
		
		var amountInput = this.getView().byId("idOfferAmount");
		var amount = parseInt(amountInput.valueOf().getValue());
		amountInput.setValue(amount - 1000);
		if(amount - 1000 <= 0) {
			amountInput.setValue(0);
		}
		
	},
	
	btnPlusAction: function(evt) {
		
		var amountInput = this.getView().byId("idOfferAmount");
		var amount = parseInt(amountInput.valueOf().getValue());
		amountInput.setValue(amount + 1000);
		
	},
	
	
	onConfirmDialog: function () {
		
		var oView = this.getView();
		
		var prtnAmount = parseInt(oView.byId("idOfferAmount").valueOf().getValue());
		if(prtnAmount == 0 || oView.byId("idOfferAmount").valueOf().getValue().length == 0) {
			sap.m.MessageToast.show(oBundle.getText("OfferDetailAmountToast"));  //Morate uneti količinu koju želite da ponudite.
			return;
		}
		
		
		var offerPriceStr = oView.byId("idOfferPrice").valueOf().getValue();
		offerPriceStr = offerPriceStr.replace('.','');
		offerPriceStr = offerPriceStr.replace(',','.');
        var number = Number(offerPriceStr);  
        var offerPrice = parseFloat(number).toFixed(2);
				
		var offerAmount = oView.byId("idOfferAmount").valueOf().getValue();
		var total = offerPrice * parseFloat(offerAmount).toFixed(2);
		
        var floatTotal = parseFloat(total).toFixed(2);     
        var formatter = new Intl.NumberFormat('de-DE', {
        	minimumFractionDigits: 2
        });  
		console.log("Total: " + formatter.format(total));
		
		
		dialog = new sap.m.Dialog({
			title: oBundle.getText("CustomOConfirm"),
			icon: 'sap-icon://accept',
			type: 'Message',
			content: [
			    new sap.ui.layout.VerticalLayout({
			    	width: '350px',
			    	content: [
						new sap.ui.layout.HorizontalLayout({
							content: [   
								new sap.ui.layout.VerticalLayout({
									width: '130px',
									content: [
										new sap.m.Text({ text: oBundle.getText("OfferDMaterial") })
										]
								}),
								new sap.ui.layout.VerticalLayout({
									width: '220px',
									content: [
										new sap.m.Text({ text: maktx })
										]
								})
							]
						}),
						new sap.ui.layout.HorizontalLayout({
							content: [   
								new sap.ui.layout.VerticalLayout({
									width: '130px',
									content: [
										new sap.m.Text({ text: oBundle.getText("OfferDPrice") }),
										new sap.m.Text({ text: oBundle.getText("OfferDAmount") }),
										new sap.m.Label({ text: oBundle.getText("OfferDTotal"), design: "Bold" }),
										new sap.m.Text({ text: oBundle.getText("OfferDSend") })
									]
								}),
								new sap.ui.layout.VerticalLayout({
									width: '220px',
									content: [
										new sap.m.Text({ text: oView.byId("idOfferPrice").valueOf().getValue() + " " + "RSD/kg" }),
										new sap.m.Text({ text: oView.byId("idOfferAmount").valueOf().getValue() + " " + "kg" }),
										new sap.m.Label({ text: formatter.format(total) + " " + "RSD", design: "Bold" })
									]
								})
							]
						}),
					]
			    })
			],
			beginButton: new sap.m.Button({
				text: oBundle.getText("BtnSend"),
				icon: 'sap-icon://action',  
				type: 'Emphasized',
				tap: [ this.onSendRespond, this ]
			/**	press: function () {
					//var sText = sap.ui.getCore().byId('confirmDialogTextarea').getValue();
					MessageToast.show('Ponuda poslata.');
					dialog.close();
				}  **/
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
		
		var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_PONUDA_RESPOND_SRV/";		
		var oModel = new sap.ui.model.odata.ODataModel(url, true, user, pass); 
					
		var oView = this.getView();
		
		that = this;

		// price
		var priceStr = oView.byId("idOfferPrice").valueOf().getValue();
		priceStr = priceStr.replace('.','');
		priceStr = priceStr.replace(',','.');
        var number = Number(priceStr);
        //var formatter = new Intl.NumberFormat('en-IN');  
        var floatValue = parseFloat(number).toFixed(2);
		price = floatValue + "d";
		console.log(price);
		
		//price without pdv
		if(pdvst !== "" || pdvst !== "0") {
			var priceD = floatValue / ((pdvst/100) + 1);
			var priceD = priceD + "d";
		}
		console.log("PriceD: " + priceD);
		pdvst = pdvst + "d";

		// amount
		var amount = oView.byId("idOfferAmount").valueOf().getValue();
		var amount = amount  + "d";
		console.log(amount);
		

		oModel.read("/OfferSet(IAppid='1000',INtfcid='" + ntfcid 
				+ "',IMenge=" + amount + ",IPreis=" + priceD + ",IPreis2=" + price + ")", null, null, false, 
			function(oResponse) { // onSuccess function called when everything is ok


			    var error = oResponse.EReturnCode;
			    console.log(error);

			    
			    if(error == "") {
					
				    sap.m.MessageBox.show(
				    		oBundle.getText("OfferSentSuccessfully"), {
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
				    		oBundle.getText("TwoMinutesBlockade"), {
					          icon: sap.m.MessageBox.Icon.ERROR,
					          title: oBundle.getText("Error"),
					          actions: sap.m.MessageBox.Action.OK,
					          onClose: function(oAction) { 
					        	  sap.ui.core.UIComponent.getRouterFor(that).navTo("MainPage" ,{}); 
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
		

	onCancelDialog: function() {
		
		if(smerp === "P") {
			noGoods = oBundle.getText("OfferDDontTell");
		} else {
			noGoods = oBundle.getText("OfferDNoGoods");
		}
		
		negativeDialog = new sap.m.SelectDialog("NegativeDialog",{
			title: oBundle.getText("OfferDNegTitle"),
			contentHeight: '290px',
			items: [
					new sap.m.StandardListItem({ info: '1', title: noGoods }), // Nemam robe ili Ne želim da navedem
					new sap.m.StandardListItem({ info: '2', title: oBundle.getText("OfferDPriceDontFit") }),
					new sap.m.StandardListItem({ info: '3', title: oBundle.getText("OfferDNotInterested") }),
					new sap.m.StandardListItem({ info: '4', title: oBundle.getText("OfferDOtherReason") }),
					new sap.m.StandardListItem({ info: '5', title: oBundle.getText("OfferDConcPrice") })
			        ],
			cancel: function(oEvent) {
				negativeDialog.destroy();
			},
			confirm: function(oEvent) {
				var selected = oEvent.getParameter("selectedItem").getInfo();
				//var aContexts = oEvent.getParameter("selectedContexts");
				if(selected == "1"){
					if(smerp === "P"){
						partNeg = "0";
					} else {
						partNeg = "2";
					} 
				} else if(selected == "2"){
					partNeg = "3";
				} else if(selected == "3"){
					partNeg = "4";
				} else  if(selected == "4"){
					partNeg = "1";
				} else if(selected == "5"){
					partNeg = "5";
					that.onCompetitionDialog();
					return;
				} 

				
				var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_PONUDA_NEGATIVE_SRV/";		
				var oModel = new sap.ui.model.odata.ODataModel(url, true, user, pass); 
				
				var konkCena = 0 + "d";
				var konkIme = "";
				
				oModel.read("/NegativSet(IAppid='1000',INtfcid='" + ntfcid 
						+ "',IKonkCena=" + konkCena + ",IKonkIme='" + konkIme + "',IPrtnNeg='" + partNeg + "')", null, null, false, 
					function(oResponse) { // onSuccess function called when everything is ok


					    var error = oResponse.EReturnCode;
					    console.log(error);

					    
					    if(error == "") {
							 
						    sap.m.MessageBox.show(
						    		oBundle.getText("OfferSentThankYou"), {	// Vaš odgovor je prosleđen. Hvala na saradnji!
							          icon: sap.m.MessageBox.Icon.SUCCESS,
							          title: oBundle.getText("Ok"),
							          actions: sap.m.MessageBox.Action.OK
							      }
							);
					    } else if(error == "9") {
							
						    sap.m.MessageBox.show(
						    		oBundle.getText("TwoMinutesBlockade"), {
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
				
				negativeDialog.destroy();
			}
		}); 
		
		negativeDialog.open();
	},
	
	
 	onCompetitionDialog: function() {
		
		competitionDialog = new sap.m.Dialog({
			title: oBundle.getText("OfferDConcPrice"),
			icon: 'sap-icon://monitor-payments',
			contentWidth: '400px',
			content: [
						new sap.m.VBox({
							//width: '300px',
							height: '180px',
							alignItems: 'Center',
							justifyContent: 'Center',
						    items:[
						             new sap.m.Label({text: oBundle.getText("OfferDNegCompetName")}),
						             new sap.m.Input({
						
						            	  maxLength: 20,
						            	  id: "competName"
						
						              }),
							          new sap.m.Label({text: oBundle.getText("OfferDNegCompetPrice")}),
							          new sap.m.Input({
							
							        	  maxLength: 20,
							        	  id: "competPrice"
							
							          })
						             ]
						}),
						],
			beginButton: new sap.m.Button({
				text: oBundle.getText("BtnSend"),
				icon: 'sap-icon://action',  
				type: 'Emphasized',
				press: function () {
					
					
					var urlComp = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_PONUDA_NEGATIVE_SRV/";		
					var oModelComp = new sap.ui.model.odata.ODataModel(urlComp, true, user, pass); 

					var partAnswer = "5";
					
					var priceStr = sap.ui.getCore().byId('competPrice').valueOf().getValue();
					//priceStr = priceStr.replace('.','');  ne treba jer ce skinuti decimale ako unosi sa tackom..
					priceStr = priceStr.replace(',','.');
			        var number = Number(priceStr);  
			        var floatValue = parseFloat(number).toFixed(2);
					var konkCena = floatValue + "d";
					console.log(konkCena);
					var konkIme = sap.ui.getCore().byId('competName').valueOf().getValue();
					konkIme = konkIme.replace(/š/g,'s').replace(/Š/g,'S').replace(/ć/g,'c').replace(/Ć/g,'C').replace(/č/g,'c')
		 				             .replace(/Č/g,'C').replace(/ž/g,'z').replace(/Ž/g,'Z').replace(/đ/g,'dj').replace(/Đ/g,'Dj');
					var konkImeEncoded = encodeURIComponent(konkIme);
					console.log(konkImeEncoded);
					
					oModelComp.read("/NegativSet(IAppid='1000',INtfcid='" + ntfcid 
							+ "',IKonkCena=" + konkCena + ",IKonkIme='" + konkImeEncoded + "',IPrtnNeg='" + partAnswer + "')", null, null, false, 
						function(oResponse) { // onSuccess function called when everything is ok


						    var error = oResponse.EReturnCode;
						    console.log(error);

						    
						    if(error == "") {
  
							    sap.m.MessageBox.show(
							    		oBundle.getText("OfferSentThankYou"), {	// Vaš odgovor je prosleđen. Hvala na saradnji!
								          icon: sap.m.MessageBox.Icon.SUCCESS,
								          title: oBundle.getText("Ok"),
								          actions: sap.m.MessageBox.Action.OK
								      }
								);
						    } else if(error == "9") {
	
							    sap.m.MessageBox.show(
							    		oBundle.getText("TwoMinutesBlockade"), {
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
					
					competitionDialog.close();
				}  
			}),
			endButton: new sap.m.Button({
				text: oBundle.getText("BtnCancel"),
				icon: 'sap-icon://decline', 
				press: function () {
					competitionDialog.close();
				}
			}),
			afterClose: function() {
				negativeDialog.destroy();
				competitionDialog.destroy();
			}
		});

		competitionDialog.open();
		
	}   

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.OffersDetail
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.OffersDetail
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.OffersDetail
*/
//	onExit: function() {
//
//	}

});