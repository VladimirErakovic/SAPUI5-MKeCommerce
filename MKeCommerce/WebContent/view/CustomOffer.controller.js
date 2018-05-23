jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("mk.ecommerce.view.CustomOffer", {
	
	//that:null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.CustomOffer
*/
	onInit: function() {
		
		//that = this;
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		partnid = oJQueryStorage.get("partnid");
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		
		priceInput = this.getView().byId("idCustomOfferPrice");
		amountInput = this.getView().byId("idCustomOfferAmount");
		totalInput = this.getView().byId("idCustomOfferTotalPrice");
		dateInput = this.getView().byId("idCustomValidDate");

		// set tomorrow date
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.yyyy"});  
		var date = new Date();
		date.setDate(date.getDate() + 1);

		dateInput.setValue(oDateFormat.format(date));
		
		
		var oView = this.getView().byId("materialSelect");
		// Using OData model to connect against a real service
		var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_UI5_GET_MATER_SRV/";
		var oModel = new sap.ui.model.odata.ODataModel(url, false, user, pass);
		oView.setModel(oModel); 
		
		this.getView().attachAfterRendering(function() {
			
	        var oBinding = this.byId("materialSelect").getBinding("items");
	        var FilterOperator = sap.ui.model.FilterOperator;
	        oBinding.filter([new sap.ui.model.Filter("Appid", FilterOperator.EQ, "1000"), 
	                         new sap.ui.model.Filter("Partnid", FilterOperator.EQ, partnid)]);
	    });
		
	    this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
	    this._oRouter.attachRouteMatched(this.handleRouteMatched, this);

	},
	
	
	handleRouteMatched : function (evt) {
		
		if (evt.getParameter("name") == "CustomOffer") {

			var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			language = oJQueryStorage.get("lang");
			console.log("Language: " + language);
			
			var pageTitle = this.getView().byId("customOfferTitle");
			var materialLabel = this.getView().byId("customMatLabel");
			var priceLabel = this.getView().byId("customPriceLabel");
			var amountLabel = this.getView().byId("customAmountLabel");
			var totalLabel = this.getView().byId("totalPriceLabel");
			var radioLabel = this.getView().byId("customRadioLabel");
			var radioBtn1 = this.getView().byId("rb1");
			var radioBtn2 = this.getView().byId("rb2");
			var radioBtn3 = this.getView().byId("rb3");
			var dateLabel = this.getView().byId("customDateLabel");
			var commentLabel = this.getView().byId("customCommentLabel");
			
			var btnOfferSend = this.getView().byId("btnCustomOfferSend");
			var btnOfferCancel = this.getView().byId("btnCustomOfferCancel");
			var btnMinus = this.getView().byId("btnMinusCustom");
			var btnPlus = this.getView().byId("btnPlusCustom");
			var btnJump = this.getView().byId("btnJumpToAllCustomOffers");
			
			if(language == "hu_HU") {
		        // read texts from i18n_hu model
		        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
			} else {
		        // read texts from i18n model
		        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
			}   
			
			pageTitle.setText(oBundle.getText("CustomOTitle"));
			materialLabel.setText(oBundle.getText("CustomOMatLabel"));
			priceLabel.setText(oBundle.getText("CustomOPriceLabel"));
			amountLabel.setText(oBundle.getText("CustomOAmountLabel"));
			totalLabel.setText(oBundle.getText("CustomOfferTotal"));
			radioLabel.setText(oBundle.getText("CustomORadioLabel"));
			radioBtn1.setText(oBundle.getText("CustomOYes"));
			radioBtn2.setText(oBundle.getText("CustomONo"));
			radioBtn3.setText(oBundle.getText("CustomOCombine"));
			dateLabel.setText(oBundle.getText("CustomODateLabel"));
			commentLabel.setText(oBundle.getText("CustomOCommentLabel"));
			btnOfferSend.setText(oBundle.getText("BtnSend"));
			btnOfferCancel.setText(oBundle.getText("BtnCancel"));
			btnMinus.setTooltip(oBundle.getText("BtnMinus"));
			btnPlus.setTooltip(oBundle.getText("BtnPlus"));
			btnJump.setText(oBundle.getText("CustomBtnJump"));
			
			priceInput.addEventDelegate({
	            onfocusin : function() {
	            	priceInput.selectText(0, 14);
	              }
	        });
			
			//var amountInput = this.getView().byId("idCustomOfferAmount");
			amountInput.addEventDelegate({
	            onfocusin : function() {
	                amountInput.selectText(0, 14);
	              }
	        });
        
		}
	},
	
	
	btnMinusAction: function(evt) {
		
		//var amountInput = this.getView().byId("idCustomOfferAmount");
		var amount = parseInt(amountInput.valueOf().getValue());
		amountInput.setValue(amount - 1000);
		if(amount - 1000 <= 0) {
			amountInput.setValue(0);
		}
		
		this.calculateTotalValue();
	},
	
	btnPlusAction: function(evt) {
		
		//var amountInput = this.getView().byId("idCustomOfferAmount");
		var amount = parseInt(amountInput.valueOf().getValue());
		if(amount == undefined || amount == null || amountInput.valueOf().getValue() == ""){
			amount = 0;
		}
		amountInput.setValue(amount + 1000);
		
		this.calculateTotalValue();	
	},
	
	
	calculateTotalValue: function() {
		
		var price = priceInput.getValue();
		if(price === "")  {
			// Unesite cenu.
			sap.m.MessageToast.show(oBundle.getText("CustomONoPriceError"));
			return;
		}
		var amount = amountInput.getValue();
		price = price.replace('.','');
		price = price.replace(',','.');
        var number = Number(price);  
        var offerPrice = parseFloat(number).toFixed(2);
		
		var totalPrice = Number(offerPrice) * Number(amount);
		
        var formatter = new Intl.NumberFormat('de-DE', {
        	minimumFractionDigits: 2
        }); 
        
        totalInput.setValue(formatter.format(totalPrice));
	},
	
	
	onNavBack: function (oEvent) {

		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("MainPage");
		
	},
	
	
	onConfirmDialog: function () {
		
		var oView = this.getView();
				
		// from lager
		var index = oView.byId("radioGroup").getSelectedIndex();
		var robslTxt;
		if(index == 0) {
			robslTxt = oBundle.getText("CustomOYes");
		} else if(index == 1) {
			robslTxt = oBundle.getText("CustomONo");
		} else {
			robslTxt = oBundle.getText("CustomOCombine");
		}
		
		// date
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.yyyy"});
		var dateVal = new Date(this.getView().byId("idCustomValidDate").getValue());
		//var dateStr = oDateFormat.format(dateVal);
		
		var dateStr = this.getView().byId("idCustomValidDate").getValue();
		if(dateStr == "")  {
			// Unesite datum važenja ponude
			sap.m.MessageToast.show(oBundle.getText("CustomONoDateError"));
			return;
		}
		
		var offerPriceStr = oView.byId("idCustomOfferPrice").valueOf().getValue();
		if(offerPriceStr == "" || offerPriceStr == "0" || offerPriceStr == "0,00")  {
			// Unesite cenu.
			sap.m.MessageToast.show(oBundle.getText("CustomONoPriceError"));
			return;
		}
		offerPriceStr = offerPriceStr.replace('.','');
		offerPriceStr = offerPriceStr.replace(',','.');
        var number = Number(offerPriceStr);  
        var offerPrice = parseFloat(number).toFixed(2);
				
		var offerAmount = oView.byId("idCustomOfferAmount").valueOf().getValue();
		if(offerAmount == "" || offerAmount == "0")  {
			// Unesite količinu.
			sap.m.MessageToast.show(oBundle.getText("CustomONoAmountError"));
			return;
		}
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
			    	content: [
						new sap.ui.layout.HorizontalLayout({
							content: [
								new sap.ui.layout.VerticalLayout({
									width: '130px',
									content: [
										new sap.m.Text({ text: oBundle.getText("OfferDMaterial") }),
										new sap.m.Text({ text: oBundle.getText("OfferDPrice") }),
										new sap.m.Text({ text: oBundle.getText("OfferDAmount") }),
										new sap.m.Label({ text: oBundle.getText("OfferDTotal"), design: "Bold" }),
										new sap.m.Text({ text: oBundle.getText("OfferDLager") }),
										new sap.m.Text({ text: oBundle.getText("OfferDValidDate") }),
										new sap.m.Text({ text: oBundle.getText("OfferDComment") })
									]
								}),
								new sap.ui.layout.VerticalLayout({
									width: '220px',
									content: [
										new sap.m.Text({ text: oView.byId("materialSelect").getSelectedItem().getText() }),
										new sap.m.Text({ text: oView.byId("idCustomOfferPrice").valueOf().getValue() + " " + "RSD/kg" }),
										new sap.m.Text({ text: oView.byId("idCustomOfferAmount").valueOf().getValue() + " " + "kg" }),
										new sap.m.Label({ text: formatter.format(total) + " " + "RSD", design: "Bold" }),
										new sap.m.Text({ text: robslTxt }),
										new sap.m.Text({ text: dateStr }),
										new sap.m.Text({ text: oView.byId("txtCustomComment").valueOf().getValue() })
									]
								})
							]
						}),
						new sap.ui.layout.VerticalLayout({
							width: '350px',
							content: [
							    new sap.m.Text({ text: " " }),
							    new sap.m.Text({ text: oBundle.getText("OfferDSend") })
							]
						}),
					]
			    }),
			//	new TextArea('confirmDialogTextarea', {
			//		width: '100%',
			//		placeholder: 'Add note (optional)'
			//	})
			],
			beginButton: new sap.m.Button({
				text: oBundle.getText("BtnSend"),
				icon: 'sap-icon://action',  
				type: 'Emphasized',
				tap: [ this.onSendOffer, this ]
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
	
	
	onSendOffer: function() {
		
		var url = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_PARTNER_PONUDA_SRV/";		
		var oModel = new sap.ui.model.odata.ODataModel(url, true, user, pass); 
					
		var oView = this.getView();
		
		// material id
		var matid = oView.byId("materialSelect").getSelectedKey();  //getSelectedItem()
		
		var pdvst = "";
		pdvst = oView.byId("materialSelect").getSelectedItem().getTooltip();
		console.log("PDV: " + pdvst);

		// price with pdv
		var priceStr = oView.byId("idCustomOfferPrice").valueOf().getValue();
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
		var amount = oView.byId("idCustomOfferAmount").valueOf().getValue();
		var amount = amount  + "d";
		
		// from lager
		var index = oView.byId("radioGroup").getSelectedIndex();
		var robsl;
		if(index == 0) {
			robsl = "1";
		} else if(index == 1) {
			robsl = "2";
		} else {
			robsl = "3";
		}
		
		// date
		var dateVal = this.getView().byId("idCustomValidDate").getValue();
		var date = dateVal.substring(6,10) + dateVal.substring(3,5) + dateVal.substring(0,2);
		console.log("Vazi do datuma: " + date);
		
		// comment
		var comment = oView.byId("txtCustomComment").valueOf().getValue();
		comment = comment.replace(/š/g,'s').replace(/Š/g,'S').replace(/ć/g,'c').replace(/Ć/g,'C').replace(/č/g,'c')
		   				 .replace(/Č/g,'C').replace(/ž/g,'z').replace(/Ž/g,'Z').replace(/đ/g,'dj').replace(/Đ/g,'Dj');	
		var commentEncoded = encodeURIComponent(comment);
		console.log(commentEncoded);
		
		// constants
		var smerp = "D";
		var waers = "RSD";
		var meins = "KG";

		
		oModel.read("/PartnerOfferSet(IAppid='1000',IPartnid='" + partnid + "',IMatid='" + matid 
				+ "',IMenge=" + amount + ",IPreis=" + priceD + ",IPreis2=" + price + ",IPdvst=" + pdvst 
				+ ",IMeins='" + meins + "',IWaers='" + waers + "',ISmerp='" + smerp + "',ITextp='" + commentEncoded 
				+ "',IValidToDate='" + date + "',IRobsl='" + robsl + "')", null, null, false, 
			function(oResponse) { // onSuccess function called when everything is ok


			    var error = oResponse.EErrMsg;
			    console.log(error);
			    
			    if(error == '') {
					  
				    sap.m.MessageBox.show(
				    		oBundle.getText("OfferSentSuccessfully"), {
					          icon: sap.m.MessageBox.Icon.SUCCESS,
					          title: oBundle.getText("Ok"),
					          actions: sap.m.MessageBox.Action.OK,
					          onClose: function(oAction) { 
					        	  sap.m.MessageToast.show(oBundle.getText("CustomOfferSentToast"), {duration: 5000, width: "17em"}); // Status Vaše ponude možete pratiti preko dugmeta na glavnom meniju "MOJE AKTUELNE PONUDE". 
					        	  }
					      }
					);
					
					//reset polja
					oView.byId("materialSelect").setSelectedKey("0");
					oView.byId("idCustomOfferPrice").setValue("");
					oView.byId("idCustomOfferAmount").setValue("0");
					oView.byId("radioGroup").setSelectedIndex(0);
					oView.byId("idCustomValidDate").setValue("");
					oView.byId("txtCustomComment").setValue("");
					
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
		
		dialog.close();
	},
	
	onChangePrice: function(oEvent) {
		
        var value = oEvent.getSource().getValue();  
        value = value.replace('.','');
        value = value.replace(',','.');
        var number = Number(value);

        var floatValue = parseFloat(number).toFixed(2);
 
        var formatter = new Intl.NumberFormat('de-DE', {
        	minimumFractionDigits: 2
        });  
        var priceInput = this.getView().byId("idCustomOfferPrice");
        priceInput.setValue(formatter.format(floatValue));  

        this.calculateTotalValue();
	},
	
	
	onCancelCustomOffer: function() {
		
		var oView = this.getView();
		
		//reset polja
		oView.byId("materialSelect").setSelectedKey("0");
		oView.byId("idCustomOfferPrice").setValue("");
		oView.byId("idCustomOfferAmount").setValue("0");
		oView.byId("radioGroup").setSelectedIndex(0);
		oView.byId("txtCustomComment").setValue("");
		
		// set tomorrow date
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.yyyy"});  
		var date = new Date();
		date.setDate(date.getDate() + 1);

		dateInput.setValue(oDateFormat.format(date));
		
	},
	
	
	onJumpToAllCustomOffers: function() {
		
		sap.ui.core.UIComponent.getRouterFor(this).navTo("CustomMaster");
		sap.m.MessageToast.show(oBundle.getText("CustomOPressRefresh"), {duration: 5000, width: "17em", closeOnBrowserNavigation: false}); //Pritisnite dugme 'Osveži' da bi se lista ažurirala.
		
	}

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.CustomOffer
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.CustomOffer
*/
//	onAfterRendering: function() {
//		
//	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.CustomOffer
*/
//	onExit: function() {
//
//	}

});