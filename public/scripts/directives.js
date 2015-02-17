angular.module('dashboard').directive('donutChart', function(Data){
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: 'views/donut-chart.html',
    link: function(scope, el, attrs){
      var color = d3.scale.category10();
      var width = 200;
      var height = 200;
      var min = Math.min(width, height);
      var svg = d3.select(el[0]).select('.chart').append('svg');
      var pie = d3.layout.pie().sort(null);
      var arc = d3.svg.arc()
        .outerRadius(min / 2 * 0.9)
        .innerRadius(min / 2 * 0.5);

      pie.value(function(d){
        return d.value;
      });

      svg.attr({width: width, height: height});
      var g = svg.append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      var arcs = g.selectAll('path');

      function updateChart(data) {
        if (!data) {
          return;
        }

        arcs = arcs.data(pie(data));
        arcs.enter().append('path')
          .style('stroke', 'white')
          .attr('fill', function(d, i){
            return color(i);
          });
        arcs.exit().remove();
        arcs.attr('d', arc);
      }

      var socket = io();

      // 차트 데이터 업데이트 watch
      scope.$watch('data', function(data){
        var chartId = attrs.chartId,
          chartData = data;

        socket.emit('chartData update', {chartId: chartId, data: chartData});

        updateChart(chartData);

        /*
        // client 에서 데이터가 변경되면 서버에 있는 json 파일 업데이트
        if (chartData) {
          Data.getChartData().then(function(data) {
            var changed = false;
            console.log('changed');
            if (data[chartId].length != chartData.length) {
              changed = true;
            } else {
              _.each(data[chartId], function(obj, i) {
                if (data[chartId][i].value != chartData[i].value) {
                  changed = true;
                }
              })
            }

            if (changed) {
              data[chartId] = chartData;
              var jsonData = JSON.stringify(data);
              Data.storeChartData(jsonData).then(function(data) {

              });
            }
          }, function() {
            console.log('fail');
          });
        }
        */
      }, true);

      // 차트 데이터가 다른 클라이언트에서 업데이트 되면 차트 업데이트
      socket.on('chartData update', function(data) {
        var chartId = data.chartId,
            data = data.data;

        if (chartId == attrs.chartId) {
          updateChart(data);
        }
      });
    },
    controller: function($scope) {
      $scope.addSlice = function(item) {
        $scope.data.push(item);
      };

      $scope.removeSlice = function() {
        $scope.data.pop();
      };
    }
  };
});