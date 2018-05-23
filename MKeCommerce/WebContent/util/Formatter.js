jQuery.sap.declare("mk.ecommerce.util.Formatter");
jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");

jQuery.sap.require("sap.ui.core.format.DateFormat");

mk.ecommerce.util.Formatter = { 
		
		
		status :  function (sStatus) {
			
	        // read texts from i18n model
			var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var language = oJQueryStorage.get("lang");
			if(language == "hu_HU") {
		        var oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
			} else {
				var oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
			}

			if (sStatus === "N") {
				return oBundle.getText("Purchase");
			} else if (sStatus === "P") {
				return oBundle.getText("Selling");
			} else if (sStatus === "I"){
				return oBundle.getText("Info");
			} else if (sStatus === "D"){
				return oBundle.getText("VendorOffer");
			} else if (sStatus === "K"){
				return oBundle.getText("BuyerOffer");
			} else if (sStatus === "A"){
				return oBundle.getText("Poll");
			} else {
				return oBundle.getText("None");
			}
		},
		
		getIconSmerp: function(sSmerp) {
			
			if (sSmerp === "N") {
				return "sap-icon://cart";
			} else if (sSmerp === "P") {
				return "sap-icon://blank-tag-2";
			} else if (sSmerp === "I"){
				return "sap-icon://message-information";
			} else if (sSmerp === "D"){
				return "sap-icon://supplier";
			} else if (sSmerp === "K"){
				return "sap-icon://customer-and-supplier";
			} else if (sSmerp === "A"){
				return "sap-icon://survey";
			} else {
				return "sap-icon://blank-tag";
			}
			
		},
		
		
		archiveTitle: function(sMaktx, sSmerp, sSttxt) {
			
	        // read texts from i18n model
			var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var language = oJQueryStorage.get("lang");
			if(language == "hu_HU") {
		        var oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
			} else {
				var oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
			}
			
			if (sSmerp === "N") {
				return sMaktx;
			} else if (sSmerp === "P") {
				return sMaktx;
			} else if (sSmerp === "I"){
				if(sSttxt !== "") {
					return oBundle.getText("Info") + " - " + oBundle.getText("ArchiveClickToOpen");
				} else {
					return oBundle.getText("Info");
				}
			} else if (sSmerp === "D"){
				return sMaktx;
			} else if (sSmerp === "K"){
				return sMaktx;
			} else if (sSmerp === "A"){
				return oBundle.getText("Poll");
			} else {
				return oBundle.getText("None");
			}
		},
		
		archiveText: function(sNotxt, sSmerp, sSttxt){	// nije gotovo
			
			if(sSmerp === "I") {
				return sNotxt + " " + sSttxt;
			} else {
				return sNotxt;
			}	
		},
		
		
		date : function (value) { 
			if (value) { 
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.yyyy"});    //yyyy-MM-dd
				return oDateFormat.format(new Date(value)); 
			} else { 
				return value; 
			} 
		},
		
		
		isArchived : function (sNotar, sNotst) {
			if(sNotar === "X") {
				return false;
			} else {
				if(sNotst === "1" || sNotst === "2") {
					return true;
				} else {
					return false;
				}
			}	
		},
		
		
		typeColors : function (sNotty) {
			if(sNotty === "2") {
				return "High";
			} else if(sNotty === "3" || sNotty === "9") {
				return "None";
			} else if(sNotty === "6" || sNotty === "1") {	//opet 2??? // ovo treba proveriti
				return "Medium";
			} else if(sNotty === "7") {
				return "Low";
			} else {
				return "None";
			}		
		},
		
		
		time : function (sTime) {
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({pattern: "KK:mm:ss a"});  
		    // format date and time to strings offsetting to GMT 
		    return timeFormat.format(new Date(sTime));
		},
		
		
		notifBtnVisibility: function(sNotty, sNotar) {	// ovo treba proveriti
			
			if((sNotty === "2" || sNotty === "3" || sNotty === "9") && sNotar !== "X") {
				return true;
			} else {
				return false;
			}
		},
		
	/**	isNew: function(sNotst) {	// ovo treba proveriti
			
			if(sNotst === "1" || sNotst === "2") {
				return "NEPROČITANA";
			} else {
				return "";
			}
		},  **/
		
		getIconFlag : function (sType, sStatus, sDogovStat) {
			//jQuery.sap.require("sap.ui.core.IconPool");
			//var aNames = sap.ui.core.IconPool.getIconNames();
			if (sType === "3") {
				return "sap-icon://message-information";
			} else if(sType === "9") {
				if(sStatus === "1" || sStatus === "2") {
					return "sap-icon://email";
				} else if(sStatus === "3") {
					return "sap-icon://email-read";
				} else {
					return "sap-icon://response";
				}
			} else {
				if(sStatus === "1") {
					return "sap-icon://email";
				} else if(sStatus === "2") {
					return "sap-icon://email";
				} else if(sStatus === "3") {
					return "sap-icon://email-read";
				} else if(sStatus === "4" || sStatus === "5" || sStatus === "6") {
					if(sDogovStat === "2") {
						return "sap-icon://outgoing-call";
					} else {
						return "sap-icon://response";
					}
				} else if(sStatus === "8" || sStatus === "9") {
					return "sap-icon://sys-cancel-2";		
				} else {
					return "sap-icon://sys-enter";
				}
			}
		},
		
		
		notificationType: function(sType, sNotar) {
			
	        // read texts from i18n model
			var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var language = oJQueryStorage.get("lang");
			if(language == "hu_HU") {
		        var oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
			} else {
				var oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
			}
			
			if(sNotar === "X") {
				if(sType === "1") {
					return oBundle.getText("NoTest") + " - " + oBundle.getText("Archived");
				} else if(sType === "2") {
					return oBundle.getText("NoMKOffer") + " - " + oBundle.getText("Archived");
				} else if(sType === "3") {
					return oBundle.getText("NoInfo") + " - " + oBundle.getText("Archived");
				} else if(sType === "6") {
					return oBundle.getText("NoClosing") + " - " + oBundle.getText("Archived");
				} else if(sType === "7") {
					return oBundle.getText("NoAgreed") + " - " + oBundle.getText("Archived");
				} else if(sType === "9") {
					return oBundle.getText("NoPoll") + " - " + oBundle.getText("Archived");
				} else {
					return oBundle.getText("None") + " - " + oBundle.getText("Archived");
				}	
			} else {
				if(sType === "1") {
					return oBundle.getText("NoTest");
				} else if(sType === "2") {
					return oBundle.getText("NoMKOffer");
				} else if(sType === "3") {
					return oBundle.getText("NoInfo");
				} else if(sType === "6") {
					return oBundle.getText("NoClosing");
				} else if(sType === "7") {
					return oBundle.getText("NoAgreed");
				} else if(sType === "9") {
					return oBundle.getText("NoPoll");
				} else {
					return oBundle.getText("None");
				}	
			}
		},
		
		
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue : function (sValue) {
			if (!sValue) {
				return "";
			}
			
	        var formatter = new Intl.NumberFormat('de-DE', {
	        	minimumFractionDigits: 2
	        }); 

			return formatter.format(parseFloat(sValue).toFixed(2));
		},
		
		
		quantity : function (value) { 
	        var formatter = new Intl.NumberFormat('de-DE'); 
			try { 
				return (value) ? formatter.format(parseFloat(value).toFixed(0)) : value; 
			} catch (err) { 
				return "Not-A-Number"; 
			} 
		}
		
};