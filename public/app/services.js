angular.module('RecipeServices', ['ngResource'])
.factory('Recipe', ['$resource', function($resource) {
  return $resource('/api/recipes/:id');
}])
.factory('Auth', ['$window', function($window){
  return {
    saveToken: function(token) {
      $window.localStorage['secretrecipes-token'] = token;
    },
    getToken: function() {
      return $window.localStorage['secretrecipes-token'];
    },
    removeToken: function() {
      $window.localStorage.removeItem('secretrecipes-token');
    },
    isLoggedIn: function() {
      var token = this.getToken();
      return token ? true : false;
    },
    currentUser: function() {
      if (this.isLoggedIn()) {
        token = this.getToken()
        try {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return payload;
        } catch (err) {
          return false;
        }
      }
    }
  } 
}])
.factory('AuthInterceptor', ['Auth', function(Auth) {
    // if querying other APIs, add URLs to this array
  var excludedEndpoints = [
    'https://swapi.co/api/films'
  ];

  return {
    request: function(config) {
      var token = Auth.getToken();
      var excludedEndpoint = excludedEndpoints.indexOf(config.url) > -1;

      if (token && !excludedEndpoint) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
}])
.factory('Alerts', [ function(){
  var alerts = [];

  return {
    clear: function() {
      alerts = [];
    },
    add: function(type, msg) {   
      alerts.push({type: type, msg: msg});
    },
    get: function() {
      return alerts;
    },
    remove: function(index) {
      alerts.splice(index, 1);
    }
  };
}])

