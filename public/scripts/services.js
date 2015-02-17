angular.module('dashboard').factory('mySocket', function(socketFactory) {
  return socketFactory();
});

angular.module('dashboard').service('Data', function($q, $http) {
  this.getChartData = function() {
    var d = $q.defer();

    $http.get('/retrieveData')
      .success(function(response) {
        d.resolve(response);
      })
      .error(function(error) {
        d.reject(error);
      });

    return d.promise;
  };

  this.storeChartData = function(jsonData) {
    var d = $q.defer();

    $http.post('/updateData', jsonData)
      .success(function(response) {
        d.resolve(response);
      })
      .error(function(error) {
        d.reject(error);
      });

    return d.promise;
  };
});
