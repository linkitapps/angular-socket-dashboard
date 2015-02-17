angular.module('dashboard').controller('DashboardController', function($scope, Data) {
  $scope.chartData = {};

  Data.getChartData().then(function(data) {
    $scope.chartData = data;
  });
});