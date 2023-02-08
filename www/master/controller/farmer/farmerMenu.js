angular
  .module("app")

  .controller(
    "farmerMenuCtrl",
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
      deviceService,
      $ionicActionSheet,
      $ionicScrollDelegate,
      fachttp,
      $q,
      $ionicModal
    ) {
      let vm = this;
      vm.detail = function () {
        $ionicLoading.show();
        let req = {
          mode: "route_menu_detail",
        };

        fachttp.model("route.php", req).then(
          function (response) {
            $ionicLoading.hide();
            console.log(response.data);

            $state.go(response.data.route);
          },
          function err(err) {
            $ionicLoading.hide();

            alert("ไม่สามารถเชื่อมต่อกับ server ได้ลองใหม่อีกครั้ง");
          }
        );

        // console.log($rootScope.global);
        // if (
        //   $rootScope.global.mob_config == "agriprodemo" ||
        //   $rootScope.global.mob_config == "AGRIPRODEMO" ||
        //   $rootScope.global.mob_config == "INET028" ||
        //   $rootScope.global.mob_config == "inet028"
        // ) {
        //   $state.go("app.farming");
        // } else {
        //   $state.go("app.detail");
        // }
      };

      function checkUserlogin() {
        let req = {
          mode: "checkLogin",
        };

        fachttp.model("checkLogin.php", req).then(
          function (response) {
            if (response.data.status == true) {
              $rootScope.global = response.data.result;
              $localStorage.globalAGRI = $rootScope.global;
            } else {
              logout();
            }
          },
          function err(err) {}
        );
      }

      checkUserlogin();

      function logout() {
        document.addEventListener("deviceready", function () {
          FirebasePlugin.getToken(
            function (fcmToken) {
              console.log(fcmToken);
              let serverkey =
                "AAAAZPwkVrk:APA91bHAHIk-v7uZbw3imZwf1QLa53Aapw_vlIxH7cmOeRzinA6bCCB9SKuJa1KfWyEG_BIeWIIM0Ah5ycNtkjY4Gqn8WtDsV-gY17W3Fb-XL1-9tdYoH1NN4PRShexXxpIidx1NcqpE";
              $http({
                method: "GET",
                url:
                  "https://iid.googleapis.com/iid/info/" +
                  fcmToken +
                  "?details=true",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + serverkey,
                },
              }).then(function (response) {
                console.log(response.data.rel);
                if (response.data.rel) {
                  for (const [key, value] of Object.entries(
                    response.data.rel.topics
                  )) {
                    console.log(key);

                    FirebasePlugin.unsubscribe(
                      key,
                      function () {
                        console.log("Unsubscribed from topic", key);
                      },
                      function (error) {
                        console.error(
                          "Error unsubscribing from topic: " + error
                        );
                      }
                    );
                  }
                }
              });
            },
            function (error) {
              console.error(error);
            }
          );
        });

        $rootScope.global = {};
        Service.toast("ออกจากระบบ", "danger");
        delete $localStorage.globalAGRI;
        $state.go("farmerlogin", null, {
          location: "replace",
        });
      }

      $ionicModal
        .fromTemplateUrl("my-wo-id.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modaleMyId = modal;
        });

      $scope.openModalMyId = function () {
        $scope.modaleMyId.show();
      };
      $scope.closeModalMyId = function () {
        $scope.modaleMyId.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modaleMyId.remove();
      });

      $scope.selectID = function (e) {
        delete vm.route;
        $scope.idSelected = e;
        //console.log($scope.idSelected)
        $scope.modaleMyId.hide();

        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "wr_route",
          id: e.wo_lot,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 8000);

        fachttp
          .model("detail.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              //console.log(response);
              if (response.data.status == true) {
                vm.route = response.data;
              } else {
                vm.route = response.data;
              }
              //console.log(vm.route);
            },
            function err(err) {
              vm.route = [];
            }
          );

        Service.toast("เลือกรายการเพาะปลูก ID " + e.wo_lot, "info", "bottom");
      };

      vm.detail2 = function (e) {
        //console.log(e)
        let wo = JSON.stringify($scope.idSelected);
        let route = JSON.stringify(e);

        $state.go("app.detail2", { wo: wo, route: route });
      };

      //////////

      vm.test1 = function () {
        let platform = ionic.Platform.platform();

        function checkGPS() {
          return new Promise(function (resolve, reject) {
            deviceService.checkGPS(function (e) {
              resolve(e);
            });
          });
        }

        async function main() {
          let statusgps = await checkGPS();
          // //console.log(platform);
          // //console.log(statusgps);

          if (statusgps == "GPS_OFF") {
            if (platform == "android") {
              deviceService.opengpsAndroid(function (e) {
                //console.log(e);
              });
            } else if (platform == "ios") {
              //console.log("ios");
            }
          } else {
          }
        }

        main();
      };

      vm.test1();

      vm.area = function () {
        $state.go("app.area");
      };

      vm.environment = function () {
        $state.go("app.env");
      };

      vm.cropPlant = function () {
        $state.go("app.startPlant01");
      };

      vm.dashboard = function () {
        $state.go("app.dashboard");
      };

      vm.blackup = function () {
        $state.go("app.hist");
      };

      vm.weather = function () {
        $state.go("app.weather");
      };

      vm.farming = function () {
        $state.go("app.farming");
      };

      vm.accounting = function () {
        // alert('เมนูนี้ยังไม่พร้อมใช้งาน')
        $state.go("account.sale");
      };

      vm.news = function () {
        $state.go("new.news");
      };

      vm.growth = function () {
        $state.go("app.growth");
      };

      vm.controliot = function () {
        $state.go("app.controliot");
      };

      vm.buysale = function () {
        $state.go("app.buysale");
      };

      vm.withdraw = function () {
        $state.go("app.withdrawList");
      };

      vm.martDash = function () {
        // $state.go("mart.dash");
        $state.go("app.martCheck");
      };

      vm.meeting = function () {
        $state.go("meeting.meetingViewNow");
      };
      vm.predict = function () {
        $state.go("app.predict");
      };

      vm.receive = function () {
        $state.go("app.receive");
      };
      document.addEventListener("deviceready", function () {
        FirebasePlugin.setCrashlyticsUserId($rootScope.global.mob_id);
        FirebasePlugin.setCrashlyticsCustomKey(
          "config",
          $rootScope.global.mob_config
        );

      });
    }
  );
