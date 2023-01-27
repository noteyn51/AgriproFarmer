angular
  .module("app")

  .controller("dashboardCtrl", function(
    $ionicModal,
    $scope,
    $http,
    $ionicLoading,
    $rootScope,
    $timeout,
    $ionicScrollDelegate,
    $q
  ) {
    let vm = this;
    var myVar;

    $scope.percent = 65;
    $scope.anotherPercent = -45;
    $scope.anotherOptions = {
      animate: {
        duration: 0,
        enabled: false
      },
      barColor: "#2C3E50",
      scaleColor: false,
      lineWidth: 20,
      lineCap: "circle"
    };

    $scope.model = { area: null, sub: null };

    function onStart1() {
      $ionicLoading.show();
      let url = $rootScope.ip + "setting.php";
      let cancellerLoadpic = $q.defer();
      let req = { mode: "iotmaplist", global: $rootScope.global };
      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 10000);
      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          //console.log(response.data);
          vm.lsStatus = response.data.status;
          if (response.data.status == true) {
            vm.status = true;
            $scope.datass = response.data;
            $scope.model.sub = $scope.datass.result[0];
            vm.subChange($scope.model.sub);
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          vm.status = false;
          $ionicLoading.hide();
        }
      );
    }

    onStart1();

    vm.subChange = function(e) {
      clearint();
      $ionicLoading.show();
      let url = $rootScope.ip + "dashboard.php";
      let req = { mode: "selectdash", value: e };
      $http.post(url, req).then(
        function suscess(response) {
          if (response.data.status == true) {
            $timeout(function() {
              $scope.dataDash = response.data;
              $ionicScrollDelegate.resize();
            }, 0);

            $ionicLoading.hide();
            return (myVar = setInterval(myTimer, 10000));
          } else {
            $ionicLoading.hide();
            $scope.dataDash = response.data;
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );

      let url2 = $rootScope.ip + "dashboard.php";
      let req2 = {
        mode: "dashboardrealtime",
        global: $rootScope.global,
        value: e
      };

      $http.post(url2, req2).then(
        function suscess(response) {
          if (response.data.result) {
            $scope.data = [
              [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ],
              [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ]
            ];
            $timeout(function() {
              $scope.data = response.data.result;
              $scope.labels = response.data.label;
              $scope.series = response.data.series;
              //console.log(response.data);
            }, 0);
          } else {
          }
        },
        function err(err) {}
      );
    };

    function myTimer() {
      if ($scope.model.sub) {
        let url = $rootScope.ip + "dashboard.php";
        let req = { mode: "selectdash", value: $scope.model.sub };
        $http.post(url, req).then(
          function suscess(response) {
            //console.log(response);

            if (response.data.status == true) {
              // delete $scope.dataDash;
              $timeout(function() {
                // ////console.log('123')
                $scope.dataDash = response.data;
              }, 500);
            } else {
              $scope.dataDash = response.data;
            }
          },
          function err(err) {}
        );

        let url2 = $rootScope.ip + "dashboard.php";
        let req2 = {
          mode: "dashboardrealtime",
          global: $rootScope.global,
          value: $scope.model.sub
        };

        $http.post(url2, req2).then(
          function suscess(response) {
            if (response.data.result) {
              $scope.data = [
                [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ],
                [
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0,
                  0
                ]
              ];

              $timeout(function() {
                $scope.data = response.data.result;
                $scope.series = response.data.series;
              }, 1000);
            } else {
            }
          },
          function err(err) {}
        );
      }
    }

    function clearint() {
      return clearInterval(myVar);
    }

    $scope.$on("$ionicView.leave", function(scopes, states) {
      clearint();
    });

    $ionicModal
      .fromTemplateUrl("templates/farmer/dashboardModal.html", {
        scope: $scope
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    vm.closeModal = function() {
      $scope.modal.hide();
    };

    vm.showmodal = function() {
      $scope.modal.show();
    };

    $scope.colors = ["#fdd835", "#00e5ff", "#00bfa5"];

    $scope.labels = ["Loading"];

    //console.log($scope.labels);

    // $scope.series = ["AIR(%)", "TEMPERATURE(°C)", "SOIL(%)"];

    $scope.data = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    $scope.onClick = function(points, evt) {
      // //console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: "y-axis-1" }];
    $scope.options = {
      responsive: true,

      scales: {
        yAxes: [
          {
            id: "y-axis-1",
            type: "linear",
            display: true,
            position: "left"
          }
        ]
      },
      legend: {
        display: true,
        position: "bottom"
      },

      elements: {
        point: {
          radius: 1,
          pointStyle: "rectRounded"
        }
      }
    };

    vm.control = function() {
      vm.showmodal();
    };
  });
