var AuthorizationController = function(){
	var googleapi = {
		authorize: function(options) {
	        var deferred = $.Deferred();

	        //Build the OAuth consent page URL
	        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
	            client_id: options.client_id,
	            redirect_uri: options.redirect_uri,
	            response_type: 'code',
	            scope: options.scope
	        });

	        //Open the OAuth consent page in the InAppBrowser
	        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

	        //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
	        //which sets the authorization code in the browser's title. However, we can't
	        //access the title of the InAppBrowser.
	        //
	        //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
	        //authorization code will get set in the url. We can access the url in the
	        //loadstart and loadstop events. So if we bind the loadstart event, we can
	        //find the authorization code and close the InAppBrowser after the user
	        //has granted us access to their data.
	        $(authWindow).on('loadstart', function(e) {
	            var url = e.originalEvent.url;
	            var code = /\?code=(.+)$/.exec(url);
	            var error = /\?error=(.+)$/.exec(url);

	            if (code || error) {
	                //Always close the browser when match is found
	                authWindow.close();
	            }

	            if (code) {
	                //Exchange the authorization code for an access token
	                $.post('https://accounts.google.com/o/oauth2/token', {
	                    code: code[1],
	                    client_id: options.client_id,
	                    client_secret: options.client_secret,
	                    redirect_uri: options.redirect_uri,
	                    grant_type: 'authorization_code'
	                }).done(function(data) {
	                    deferred.resolve(data);
	                }).fail(function(response) {
	                    deferred.reject(response.responseJSON);
	                });
	            } else if (error) {
	                //The user denied access to the app
	                deferred.reject({
	                    error: error[1]
	                });
	            }
	        });

	        return deferred.promise();
   
		}
	};

	var controller = {
		self:null,
		initialize: function(){
			self = this;
			
			self.renderLoginButton();
			this.bindEvents();
			this.access_token = null;
			console.log("initlized auth controller");
			

		},
		bindEvents: function(){
			$('#loginButton').on('click', onLoginClick);
			
		},
		onLoginClick: function(){
			var $loginStatus = $('#loginStatus');
			var $loginButton = $('#loginButton');
			googleapi.authorize({
            client_id: '467223600775-r8vefalubnh6u9mu0sqbin1kjocbec12.apps.googleusercontent.com',
            client_secret: 'ingEG4Pm7hoheRG4e7nh33vp',
            redirect_uri: 'http://localhost',
            scope: 'https://mail.google.com/'
        }).done(function(data) {
            $loginStatus.html('Access Token: ' + data.access_token);
            this.access_token = data.access_token;
        }).fail(function(data) {
            $loginStatus.html(data.error);
        });
		},
		renderLoginButton: function(){
			//make functions for creating new DOM elements
			var button = '<button id=\"loginButton\">Login </button>';
			var p = '<p id=\"loginStatus\"> </p>';

			$('.app').append(button,p);
			



		}
	};
	controller.initialize();
	return controller;
};