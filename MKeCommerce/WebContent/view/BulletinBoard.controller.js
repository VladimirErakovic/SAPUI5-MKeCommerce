jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");


sap.ui.controller("mk.ecommerce.view.BulletinBoard", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.BulletinBoard
*/
	onInit: function() {

		var oJQueryStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
		user = oJQueryStorage.get("user");
		pass = oJQueryStorage.get("pass"); 
		partnid = oJQueryStorage.get("partnid");
		language = oJQueryStorage.get("lang");
		
		view = this.getView();
		
		var btnBannerLink = view.byId("btnBannerLink");
		if(language == "hu_HU") {
	        // read texts from i18n_hu model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n_hu.properties"});
		} else {
	        // read texts from i18n model
	        oBundle = jQuery.sap.resources({url: "i18n/i18n.properties"});
		} 
		btnBannerLink.setText(oBundle.getText("BulletinBoardBannerLink"));
		btnBannerLink.focus(false);
		
		var urlMain = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_BILBOARD_GET_LIST_SRV/";		
		var oModelMain = new sap.ui.model.odata.ODataModel(urlMain, true, user, pass);
		
		var ntfcid = "0";


		oModelMain.read("/BoardSet(IAppid='1000',INtfcid='" + ntfcid + "',IPartnid='" + partnid + "')", null, null, false, 
			function(oResponse) { // onSuccess function called when everything is ok

			    var error = oResponse.EErrMsg;
			    var url = oResponse.EOturl;
			    
			    if(error == ""){
			    	
			    	view.byId("iframeMain").setContent("<iframe src= '" + url + "index_light.html'" + " height='80%' width='100%'" + "></iframe>");
			    
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
		
		
		var urlBanner = "proxy/https/sapgw.mk-group.org:42080/sap/opu/odata/SAP/ZMKEC_BANNER_GET_SRV/";		
		var oModelBanner = new sap.ui.model.odata.ODataModel(urlBanner, true, user, pass);
		
		var ntfcid = "0";

		oModelBanner.read("/BannerSet(IAppid='1000',IPartnid='" + partnid + "')", null, null, false, 
			function(oResponse) { // onSuccess function called when everything is ok

			    var banurl = oResponse.EBanurl;
			    console.log(banurl);
			    linkurl = oResponse.ELinkurl;
			    console.log(linkurl);
		    	
			    view.byId("iframeBanner").setContent("<iframe id='bannerFrame' src= '" + banurl + "'" + " height='20%' width='100%' ></iframe>");
			  // view.byId("iframeBanner").setContent("<iframe id='bannerFrame' frameborder='0' height='20%' width='100%' src='data:text/html;charset=utf-8, <body><a target='_parent' href='" + linkurl + "'><img  src= '" + banurl + "'" + " > </a></body>'></iframe>");

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
	
	
	openBannerLink: function() {
		
    	var newTab = window.open(linkurl, '_blank');
    	newTab.focus();
		
	},


	
	/**	iframeClick: function(e) {
		
		// a) add dynamic behavior
		if ( !e.getParameters()["isPreservedDOM"] ) {
			var $=e.getSource().$();
			$.click(function(e) {
				console.log("KLik radi");
		    	win = window.open(linkurl, '_blank');
		    	win.focus();
			});
		}
		
	},
	
	bannerClicked: function() {
		
    	win = window.open(linkurl, '_blank');
    	win.focus();
		
	},   **/
	
	onNavBack: function(evt) {
		
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("MainPage");
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.BulletinBoard
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.BulletinBoard
*/
	onAfterRendering: function() {

   /**     var clickOnBanner = function () {
            //var text = this.getCustomData()[0].getValue();
            //sap.m.MessageToast.show(text);
        	var win = window.open(linkurl, '_blank');
        	win.focus();
            event.preventDefault();
            event.stopPropagation();
            return false;
        };

        this.byId("iframeBanner").attachBrowserEvent("click", clickOnBanner);  **/
		
	}

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.BulletinBoard
*/
//	onExit: function() {
//
//	}

});