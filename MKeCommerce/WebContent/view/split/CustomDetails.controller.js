jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.split.CustomDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.split.CustomDetails
*/
	onInit: function() {

		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		partnid = oJQueryStorage.get("partnid");
		language = oJQueryStorage.get("lang");
		
		var view = this.getView();
		
		pageTitle = view.byId("customOfferDetailsPage");
		amountLabel = view.byId("customOfferAmountLabel");
		priceLabel = view.byId("customOfferPriceLabel");
		dateLabel = view.byId("customOfferDateLabel");
		statusLabel = view.byId("customOfferStatusLabel");
		
		agrPriceLabel = view.byId("customAgreedPriceLabel");
		agrAmountLabel = view.byId("customAgreedAmountLabel");
		agrDateLabel = view.byId("customAgreedDateLabel");
		agrNacplLabel = view.byId("customAgreedNacplLabel");
		agrUslplLabel = view.byId("customAgreedUslplLabel");
		agrRobslLabel = view.byId("customAgreedRobslLabel");
		agrCommentLabel = view.byId("customAgreedCommentLabel");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setTitle(oBundle.getText("OffersDetailTitle"));
		amountLabel.setText(oBundle.getText("CustomOAmountLabel"));
		priceLabel.setText(oBundle.getText("CustomOPriceLabel"));
		dateLabel.setText(oBundle.getText("CustomODateLabel"));
		statusLabel.setText(oBundle.getText("CustomOStatusLabel"));
		
		agrPriceLabel.setText(oBundle.getText("CustomAgreedPriceLabel"));
		agrAmountLabel.setText(oBundle.getText("CustomAgreedAmountLabel"));
		agrDateLabel.setText(oBundle.getText("CustomAgreedDateLabel"));
		agrNacplLabel.setText(oBundle.getText("CustomAgreedNacplLabel"));
		agrUslplLabel.setText(oBundle.getText("CustomAgreedUslplLabel"));
		agrRobslLabel.setText(oBundle.getText("CustomAgreedRobslLabel"));
		agrCommentLabel.setText(oBundle.getText("CustomAgreedCommentLabel"));
		
		amountText = view.byId("customOfferAmount");
		meinsText = view.byId("customOfferMeins");
		priceText = view.byId("customOfferPrice");
		waersText = view.byId("customOfferWaers");
		dateText = view.byId("customOfferDate");
		timeText = view.byId("customOfferTime");
		statusText = view.byId("customOfferStatus");

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
			// when detail navigation occurs, update the binding context
			if (oEvent.getParameter("name") === "CustomDetail") {
				//var context = new sap.ui.model.Context(view.getModel(), '/' + oEvent.getParameter("arguments").contextPath);
				//view.setBindingContext(context);
				var bindingContext = this.getView().getBindingContext();
				ntfcid = oEvent.getParameter("arguments").offer;
							
				var offer = sap.ui.getCore().getModel("customOffer");
				var maktx = offer.maktx;
				var menge = offer.menge;
				var meins = offer.meins;
				var preis2 = offer.preis2;
				var waers = offer.waers;
				var kdate = offer.kdate;
				var ktime = offer.ktime;
				var notxt = offer.notxt;

				view.byId("customOfferDetailHeader").setTitle(maktx).setIntro(notxt);

				meinsText.setText(meins);
				
		        var number = Number(preis2);
		        var floatValue = parseFloat(number).toFixed(2); 
		        var formatter = new Intl.NumberFormat('de-DE', {
		        	minimumFractionDigits: 2
		        }); 
				
				amountText.setText(formatter.format(menge));
				priceText.setText(formatter.format(floatValue));
				waersText.setText(waers + "/" + meins);
				
				// date
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.yyyy"});
				var dateStr = oDateFormat.format(new Date(kdate));

			    var timeStr = ktime.replace("PT", "").replace("H",":").replace("M",":").replace("S","");   

				
				dateText.setText(dateStr);
				timeText.setText(timeStr);			
				
				
				if(ntfcid !== null) {
					
					var url = "proxy/https/***/sap/opu/odata/SAP/ZMKEC_PONUDA_GET_DETAIL_2_SRV/";		
					var oModel = new sap.ui.model.odata.ODataModel(url, true, user, pass);
	
					oModel.read("/OfferSet(IAppid='1000',INtfcid='" + ntfcid + "',IPartnid='" + partnid + "')", null, null, false, 
						function(oResponse) { // onSuccess function called when everything is ok
	
						    var agrPrice1 = oResponse.EDogovCen;
						    console.log(agrPrice1);
						    var agrPrice2 = oResponse.EDogovCen2;
						    console.log(agrPrice2);
						    var agrWaers = oResponse.EWaers;
						    var agrAmount = oResponse.EDogovKol;
						    console.log(agrAmount);
						    var agrMeins = oResponse.EMeins;
						    var agrRobsl = oResponse.EDogovRobsl;
						    console.log(agrRobsl);
						    var agrNacpl = oResponse.EDogovNacpl;
						    console.log(agrNacpl);
						    var agrUslpl = oResponse.EDogovUslpl;
						    console.log(agrUslpl);
						    var agrDatpp = oResponse.EDogovDatpp;
						    console.log(agrDatpp);
						    var agrStatus = oResponse.EDogovStat;
						    console.log(agrStatus);
						    var agrText = oResponse.EDogovText;
						    console.log(agrText);
						    var error = oResponse.EErrMsg;
						    console.log(error);
						    
						    if(error === ""){
						    	
						    	// status dogovora
								if(agrStatus === "" || agrStatus == null) {
									statusText.setText(oBundle.getText("NoAnswerForOffer"));   // Na ponudu još nema odgovora.
								} else if(agrStatus == "1") {
									statusText.setText(oBundle.getText("CustomStatusOne"));
								} else if(agrStatus == "2") {
									statusText.setText(oBundle.getText("CustomStatusTwo"));
								} else if(agrStatus == "3") {
									statusText.setText(oBundle.getText("CustomStatusThree"));
								}
						    					    
							    agrPrice2 = agrPrice2.replace(',','.');
						        var number = Number(agrPrice2);
						        var floatValue = parseFloat(number).toFixed(2);
						        console.log(floatValue); 
						        var formatter = new Intl.NumberFormat('de-DE', {
						        	minimumFractionDigits: 2
						        });   
							    view.byId("customAgreedPrice").setText(formatter.format(floatValue));
							    view.byId("customAgreedWaers").setText(agrWaers + "/" + agrMeins);
	
							    view.byId("customAgreedAmount").setText(agrAmount);
							    view.byId("customAgreedMeins").setText(agrMeins);
							    
							    if(agrStatus == "3") {
			                      view.byId("customAgreedNacpl").setText(oBundle.getText(""));
			                    } else {
								    if(agrNacpl === "" || agrNacpl == null) {
								    	view.byId("customAgreedNacpl").setText(oBundle.getText("CustomAgreedNotYet"));	//Dogovor još uvek nije postignut.
								    } else if(agrNacpl == "1") {
								    	view.byId("customAgreedNacpl").setText(oBundle.getText("CustomAgreedNacplOne"));  //Avans
								    } else if(agrNacpl == "2") {
								    	view.byId("customAgreedNacpl").setText(oBundle.getText("CustomAgreedNacplTwo"));	//Odloženo
								    } else if(agrNacpl == "3") {
								    	view.byId("customAgreedNacpl").setText(oBundle.getText("CustomAgreedNacplThree"));	//Priznanica
								    } else if(agrNacpl == "4") {
								    	view.byId("customAgreedNacpl").setText(oBundle.getText("CustomAgreedNacplFour"));	//Kooperacija
								    }
			                    }
							    	
							    if(agrStatus == "3") {
			                      view.byId("customAgreedUslpl").setText(oBundle.getText(""));
			                    } else {
								    if(agrUslpl === "" || agrUslpl == null) {
								    	view.byId("customAgreedUslpl").setText(oBundle.getText("CustomAgreedNotYet"));	//Dogovor još uvek nije postignut.
								    } else if(agrUslpl == "1") {
								    	view.byId("customAgreedUslpl").setText(oBundle.getText("CustomAgreedUslplOne"));	//Virmanski
								    } else if(agrUslpl == "2") {
								    	view.byId("customAgreedUslpl").setText(oBundle.getText("CustomAgreedUslplTwo"));	//Gotovniski
								    } else if(agrUslpl == "3") {
								    	view.byId("customAgreedUslpl").setText(oBundle.getText("CustomAgreedUslplThree"));	//Kompenzacija
								    }
			                    }
							    
							    if(agrStatus == "3") {
			                      view.byId("customAgreedRobsl").setText(oBundle.getText(""));
			                    } else {
								    if(agrRobsl === "" || agrRobsl == null) {
								    	view.byId("customAgreedRobsl").setText(oBundle.getText("CustomAgreedNotYet"));	//Dogovor još uvek nije postignut.
								    } else if(agrRobsl == "1") {
								    	view.byId("customAgreedRobsl").setText(oBundle.getText("CustomOYes"));	//Da
								    } else if(agrRobsl == "2") {
								    	view.byId("customAgreedRobsl").setText(oBundle.getText("CustomONo"));	//Ne
								    } else if(agrRobsl == "3") {
								    	view.byId("customAgreedRobsl").setText(oBundle.getText("CustomOCombine"));	//Kombinovano
								    }
			                    }
							    
							    view.byId("customAgreedComment").setText(agrText);
							    
								//var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.yyyy"});
				                // date
				                if(agrDatpp !== "00000000") {
				                  var agrDatppString = agrDatpp.substring(6, 8) + "." + agrDatpp.substring(4, 6) + "."  +  agrDatpp.substring(0, 4);
				                  view.byId("customAgreedDate").setText(agrDatppString);
				                } else {
				                  view.byId("customAgreedDate").setText("");
				                }

							    
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

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.split.CustomDetails
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.split.CustomDetails
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.split.CustomDetails
*/
//	onExit: function() {
//
//	}

});
