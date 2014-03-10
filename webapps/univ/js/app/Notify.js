define(['../app/Router', 'cookie', '../app/service/DataService'], function(router, cookie, service) {"use strict";

	var Notify = ( function() {

			/**
			 * Constructor
			 */
			var STATUS;
			var MESSAGE;
			var PAGE;
			var ERROR = '<i style="padding:0px 10px" class="icon-exclamation icon-1x "></i>';
			var OK = '<i style="padding:0px 10px" class="icon-check icon-1x "></i>';
			
			function Notify() {
				
				function showNotification(status,message,toroute,duration) {
					jQuery('div.edit-notify').remove();
					if (!duration){
						duration = 5000; ///defaulting to 5 seconds
					}
					if (jQuery.find('.modal-body'))
					{
						var CLASS = "edit-notify " + status;
						var notification = '<div class="'+CLASS+'">'+OK+'<span class="notify-message">'+message+'</span></div>';
						if (status === 'ERROR')
						{
							var notification = '<div class="'+CLASS+'">'+ERROR+'<span class="notify-message">'+message+'</span></div>';
						}
						jQuery('.modal-container').append(notification);
						jQuery('.edit-notify').slideDown(1000);
						setTimeout(function(){
							jQuery('.edit-notify').slideUp(1000);
							if (toroute){
								router.go('/'+toroute,"/home");
							}
						},duration); //5 Seconds is enough to catch attention
					}
				}
				
				

				
				this.pause = function() {

				};

				this.resume = function() {
					
				};
				
				this.showNotification = function(status,message,toroute,duration){
						showNotification(status,message,toroute,duration);
				}

				this.init = function(args) {
					//Get the context from DOM
					//getElement();
				};
			}

			return Notify;
		}());

	return new Notify();
});
