jQuery.sap.declare("mk.ecommerce.Component");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
jQuery.sap.require("mk.ecommerce.MyRouter");
jQuery.sap.require("sap.ui.Device");

sap.ui.core.UIComponent.extend("mk.ecommerce.Component", {
	metadata : {
		"name" : "MK eCommerce",
		"version" : "1.0",
		"includes" : ["css/style.css"],  //dodao
		"dependencies" : {
			"libs" : ["sap.m", "sap.me", "sap.ushell", "sap.ui.layout"],  //ovde vidi sta ti ne treba jer utice na performanse
			"components" : []
		},

		"config" : {
			"resourceBundle" : ["i18n/i18n.properties", "i18n/i18n_hu.properties"],
			"titleResource" : "ShellTitle",
			
			"serviceConfig" : {
				name: "ZMKEC_NOTIF_GET_LIST_SRV_02",
				serviceUrl: "/sap/opu/odata/sap/ZMKEC_NOTIF_GET_LIST_SRV_02/",
				settings: {
						"odataVersion": "2.0",
						"localUri": "localService/metadata.xml"
					}
			}

		},

		routing: {
			config: {
				routerClass : mk.ecommerce.MyRouter,
				viewType : "XML",
				viewPath: "mk.ecommerce.view",  // common prefix
				targetAggregation: "detailPages",   //bilo pages
				transition: "show",  //dodao
				clearTarget: false
			},
			routes:
				[{
				    pattern: "",
					name : "LoginPage",
					view : "LoginPage",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				}, 
				{
				    pattern: "mainPage",
					name : "MainPage",
					view : "MainPage",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "registrationPage",
					name : "RegistrationPage",
					view : "RegistrationPage",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "notifAppWizard",
					name : "NotifAppWizard",
					view : "NotifAppWizard",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "extraRegPage",
					name : "ExtraRegPage",
					view : "ExtraRegPage",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "notificationsPage",
					name : "Notifications",
					view : "Notifications",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "customOfferPage",
					name : "CustomOffer",
					view : "CustomOffer",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "archivePage",
					name : "Archive",
					view : "Archive",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "bulletinBoardPage",
					name : "BulletinBoard",
					view : "BulletinBoard",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "weatherPage",
					name : "Weather",
					view : "Weather",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "contactsPage",
					name : "Contacts",
					view : "Contacts",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "debtStructurePage",
					name : "DebtStructure",
					view : "DebtStructure",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "lagerPage",
					name : "Lager",
					view : "Lager",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "settingsPage",
					name : "Settings",
					view : "Settings",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "aboutPage",
					name : "About",
					view : "About",
					viewPath: "mk.ecommerce.view",
					targetAggregation: "pages",
					targetControl: "mainAppContainer"

				},
				{
				    pattern: "Offers",
					name : "OffersApp",
					view : "OffersApp",
					viewPath: "mk.ecommerce.view.split",
					targetAggregation: "pages",
					targetControl: "mainAppContainer",
    				subroutes : [
    				    {
	    					pattern: "Offers",
	    					name : "Master",
	    					view : "OffersMaster",
	    					targetAggregation : "masterPages",
	    					//preservePageInSplitContainer : true,
						    viewPath: "mk.ecommerce.view.split",
	    					targetControl: "offersContainer",
		    					subroutes : [
								{
									pattern : "Offers/{offer}", // will be the url and from has to be provided in the data
									view : "OffersDetail",
									name : "Detail", // name used for listening or navigating to this route
			                        viewPath: "mk.ecommerce.view.split",
									targetAggregation: "detailPages"
								},
								{
									pattern : "Poll/{offer}", 
									view : "Poll",
									name : "Poll",
			                        viewPath: "mk.ecommerce.view.split",
									targetAggregation: "detailPages"
								},
								{
									pattern : "Info/{offer}",
									view : "Info",
									name : "Info",
			                        viewPath: "mk.ecommerce.view.split",
									targetAggregation: "detailPages"
								},
								{
									pattern : "Offers",
									view : "NotFound",
									name : "NotFound",
			                        viewPath: "mk.ecommerce.view.split",
									targetAggregation: "detailPages",
									clearTarget: true
								}
								]
    				    },
	    				{
	    					pattern: "CustomOffers",
	    					name : "CustomMaster",
	    					view : "CustomMaster",
	    					targetAggregation : "masterPages",
	    					//preservePageInSplitContainer : true,
						    viewPath: "mk.ecommerce.view.split",
	    					targetControl: "offersContainer",
	    						subroutes : [
								{
									pattern : "CustomOffers/{offer}", 
									view : "CustomDetails",
									name : "CustomDetail", 
			                        viewPath: "mk.ecommerce.view.split",
									targetAggregation: "detailPages"
								},
								{
									pattern : "CustomOffers", 
									view : "NotFound",
									name : "NotFound2", 
			                        viewPath: "mk.ecommerce.view.split",
									targetAggregation: "detailPages",
									clearTarget: true
								}
	    						]
	    				}
    				]
				},

				]
		}
	},

	init : function() {
		
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		//this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter());
		// this component should automatically initialize the router
	//	this.getRouter().initialize();
																					// nek ovo stoji za svaki slucaj..
		//var oServiceConfig = this.getMetadata().getConfig()["serviceConfig"];
		//var sServiceUrl = oServiceConfig.serviceUrl;
		
		// dodao sa gw
		var mConfig = this.getMetadata().getConfig();

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var rootPath = jQuery.sap.getModulePath("mk.ecommerce");


		// promenio sa gw
		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [rootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");
		
		// set i18n model
		var i18nModelHu = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [rootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModelHu, "i18n_hu");
		

		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		this.setModel(deviceModel, "device");
		
		this.getRouter().initialize();
	},

	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {

		var oViewData = {
				component : this
		};
		return sap.ui.view({
			viewName : "mk.ecommerce.view.App",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	}
	
	
	
	// Maybe will be needed
//	destroy: function() {
//		if(this.routeHandler) {
//			this.routeHandler.destroy();
//		}
//		sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);		
//	}
	
});