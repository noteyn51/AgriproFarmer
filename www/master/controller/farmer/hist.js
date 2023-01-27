angular
  .module("app")

  .controller("histCtrl", function(
    $scope,
    $state,
    $ionicLoading,
    $timeout,
    $rootScope,
    $http,
    $ionicModal,
    $ionicPopup,
    Service,
    $q,
    $ionicScrollDelegate
  ) {
    let vm = this;

    function aa() {
      $ionicModal
        .fromTemplateUrl("my-modaledit.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modaledit = modal;
        });

      $scope.openModalEdit = function() {
        $scope.modaledit.show();
      };
      $scope.closeModalEdit = function() {
        $scope.modaledit.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modaledit.remove();
      });
      $scope.editdata = { date_start: null, date_end: null };
      let platform = ionic.Platform.platform();

      vm.updatepickdate = function() {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function() {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.editdata.date_start = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function(e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.editdata.date_start = $scope.datamodal.date;
                  }
                }
              }
            ]
          });
        }
      };
      vm.updatepickdateto = function() {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function() {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.editdata.date_end = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function(e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.editdata.date_end = $scope.datamodal.date;
                  }
                }
              }
            ]
          });
        }
      };

      var myVar;

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
        vm.day(e);
      };

      vm.day = function(e) {
        //console.log("day");
        $ionicLoading.show();
        let url2 = $rootScope.ip + "dashboard.php";
        let req2 = {
          mode: "dashboardrealtimeHistory",
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
                $scope.header = response.data.header;
                $scope.series = response.data.series;
              }, 0);
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.month = function(e) {
        //console.log(e);
        $ionicLoading.show();
        let url2 = $rootScope.ip + "dashboard.php";
        let req2 = {
          mode: "dashboardrealtimeHistory6",
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
                $scope.header = response.data.header;
              }, 0);
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.year = function(e) {
        $ionicLoading.show();
        let url2 = $rootScope.ip + "dashboard.php";
        let req2 = {
          mode: "dashboardrealtimeHistory12",
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
                $scope.header = response.data.header;
              }, 0);
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.findManual = function(e) {
        //console.log($scope.editdata);
        //console.log($scope.editdata.date_start);
        //console.log($scope.editdata.date_end);

        //console.log($scope.editdata.date_start < $scope.editdata.date_end);
        let start;
        let end;
        if ($scope.editdata.date_start > $scope.editdata.date_end) {
          start = $scope.editdata.date_end;
          end = $scope.editdata.date_start;
        } else {
          start = $scope.editdata.date_start;
          end = $scope.editdata.date_end;
        }
        $ionicLoading.show();
        let url2 = $rootScope.ip + "dashboard.php";
        let req2 = {
          mode: "dashboardrealtimeHistoryM",
          global: $rootScope.global,
          value: e,
          date_start: start,
          date_end: end
        };

        $http.post(url2, req2).then(
          function suscess(response) {
            //console.log(response.data);
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
                $scope.header = response.data.header;
              }, 0);
            } else {
            }
            $scope.modaledit.hide();
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.manual = function(e) {
        $scope.modaledit.show();
      };
      $scope.colors = ["#fdd835", "#e3051e", "#00bfa5"];
      // $scope.colors = ["#fdd835", "#00e5ff", "#00bfa5"];

      $scope.labels = ["Loading"];

      // $scope.series = ["AIR(%)", "TEMPERATURE(°C)", "SOIL(%)"];

      $scope.data = [0];

      $scope.onClick = function(points, evt) {
        //console.log(points, evt);
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
            radius: 4,
            pointStyle: "rectRounded"
          }
        }
      };
    }

    vm.refresh = function() {
      aa();
    };

    aa();
  });
