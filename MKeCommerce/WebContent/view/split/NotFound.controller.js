jQuery.sap.require("jquery.sap.resources");
jQuery.sap.require("jquery.sap.storage");

sap.ui.controller("mk.ecommerce.view.split.NotFound", {

	onInit : function() {
		
		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		language = oJQueryStorage.get("lang");
		
		pageTitle = this.getView().byId("notFoundPage");
		messagePageTitle = this.getView().byId("messagePage");
		
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		
		pageTitle.setTitle(oBundle.getText("OffersDetailTitle"));
		messagePageTitle.setText(oBundle.getText("NotFoundText"));	
		messagePageTitle.setDescription(oBundle.getText("NotFoundDescription"));
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
	}
		

});
