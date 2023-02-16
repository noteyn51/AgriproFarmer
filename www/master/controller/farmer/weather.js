angular
  .module("app")
  .controller(
    "weatherCtrl",
    function (
      deviceService,
      $http,
      $ionicLoading,
      $timeout,
      $scope,
      $state,
      $rootScope,
      $localStorage,
      $ionicHistory,
      Service,
      deviceService,
      $ionicSlideBoxDelegate,
      $timeout,
      $cordovaGeolocation,
      fachttp,
      $ionicModal
    ) {
      let vm = this;
      $scope.farmSelected = {};

      $scope.selectFarm = function (e) {
        $scope.farmSelected = e;
        console.log(e.lat);
        console.log(e.lng);

        callPosition(e.lat, e.lng);
        $scope.closeModal();
      };

      $scope.selectCurrentPosition = function () {
        onStart();
        $scope.closeModal();
      };

      function getFarm() {
        let req = {
          mode: "selectFarm",
          config: { frm_code: $rootScope.global.mob_farm_code },
        };

        fachttp.model("area.php", req).then(
          function (response) {
            $scope.status = true;
            response.data.status = false;
            if (response.data.status == true) {
              response.data.result.forEach((element) => {
                let k = {
                  lat: element.farm_lat.split(","),
                  lng: element.farm_lng.split(","),
                };

                element.lat = k.lat[0];
                element.lng = k.lng[0];
              });

              $scope.data = response.data;
              $scope.selectFarm($scope.data.result[0]);
            } else {
              $scope.selectFarm({ farm_name: "ตำแหน่งปัจจุบัน" });
            }
          },
          function err(err) {
            
            $scope.data = [];
            $scope.status = false;
          }
        );
      }

      getFarm();

      $scope.goBack = function () {
        $ionicHistory.goBack();
      };

      var now = new Date();
      var weekday = new Array(7);
      weekday[0] = "วันอาทิตย์";
      weekday[1] = "วันจันทร์";
      weekday[2] = "วันอังคาร";
      weekday[3] = "วันพุธ";
      weekday[4] = "วันพฤหัสบดี";
      weekday[5] = "วันศุกร์";
      weekday[6] = "วันเสาร์";
      vm.day = weekday[now.getDay()];

      // var geocoder = new google.maps.Geocoder();

      // function geocodeLatLng(position) {
      //   var input = position;
      //   var latlngStr = input.split(",", 2);
      //   // //console.log(latlngStr)
      //   var latlng = {
      //     lat: parseFloat(latlngStr[0]),
      //     lng: parseFloat(latlngStr[1]),
      //   };
      //   geocoder.geocode({ location: latlng }, function (results, status) {
      //     if (status === "OK") {
      //       let k = results[0].formatted_address;
      //       vm.landmark = k;
      //     } else {
      //       vm.landmark = "ไม่สามารถค้นหาพื้นที่ได้";
      //     }
      //   });
      // }

      function daliy() {
        //console.log('daliy')
        let req = { value: 1 };
        $http.post($rootScope.ip + "warn.php", req).then(function (e) {
          vm.Warning = e.data;
        });

        req = { value: 3 };
        $http.post($rootScope.ip + "warn.php", req).then(function (e) {
          vm.DailyForecast = e.data;
        });
      }

      daliy();

      async function callPosition(lati, lngti) {
        $ionicLoading.show();
        let lat;
        let lng;
        if (!lati || lati == "") {
          var posOptions = { timeout: 6000, enableHighAccuracy: true };
          let position = await $cordovaGeolocation.getCurrentPosition(
            posOptions
          );
          console.log(position);
          lat = position.coords.latitude;
          lng = position.coords.longitude;
        } else {
          lat = lati;
          lng = lngti;
        }

        // geocodeLatLng(latlng);
        let req = {
          lat: lat,
          lng: lng,
          nextday: vm.nextdatedetail,
        };

        $http.post($rootScope.ip + "weathertest.php", req).then(function (e) {
          vm.temp = e.data.current;
          vm.forcase = e.data.days;
          $ionicLoading.hide();
        });
      }

      function onStart() {
        let platform = ionic.Platform.platform();
        // //console.log(platform);
        function checkGPS() {
          //Call status GPS from Service and return value to statusgps
          return new Promise(function (resolve, reject) {
            deviceService.checkGPS(function (e) {
              resolve(e);
            });
          });
        }

        async function main() {
          let statusgps = await checkGPS();
          if (statusgps == "GPS_OFF") {
            if (platform == "android") {
              deviceService.opengpsAndroid(function (e) {
                if (e == "force_gps") {
                  callPosition();
                } else {
                  // //console.log("not");
                }
              });
            } else if (platform == "ios") {
            }
          } else {
            vm.alert = "on";
            callPosition();
          }
        }

        //console.log(platform)
        if (
          platform == "win32" ||
          platform == "ios" ||
          platform == "macintel"
        ) {
          callPosition();
        } else if (platform == "android") {
          // Android check gps ใน function
          main();
        }
      }

      vm.DailyForecastgo = function (e, b) {
        // //console.log(e)
        $state.go("app.weatherDetail", { action: e, desc: b });
      };

      $ionicModal
        .fromTemplateUrl("my-farm.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalFarm = modal;
        });

      $scope.modalShow = function () {
        $scope.modalFarm.show();
      };

      $scope.closeModal = function () {
        $scope.modalFarm.hide();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalFarm) {
          $scope.modalFarm.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });
    }
  )

  .controller(
    "weatherDetailCtrl",
    function (
      $http,
      $ionicLoading,
      $timeout,
      $scope,
      $state,
      $rootScope,
      $localStorage,
      $ionicHistory,
      Service,
      $ionicSlideBoxDelegate,
      $stateParams
    ) {
      let vm = this;
      vm.action = JSON.parse($stateParams.action);
      //console.log($stateParams)
      vm.header = $stateParams.desc;

      function warning() {
        req = { value: 1 };
        $http.post($rootScope.ip + "warn.php", req).then(function (e) {
          vm.Warning = e.data;
          // //console.log(vm.Warning);
          // //console.log(vm.Warning);
        });
      }

      function daliy() {
        req = { value: 3 };
        $http.post($rootScope.ip + "warn.php", req).then(function (e) {
          vm.DailyForecast = e.data;
          // //console.log(vm.DailyForecast);
        });
      }

      switch (vm.action) {
        case 1:
          warning();
          break;
        case 2:
          break;

        case 3:
          daliy();
          break;
      }
    }
  );
