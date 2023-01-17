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
        Service.toast('ออกจากระบบ','danger');
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

      vm.logout = function () {
        let hideSheet = $ionicActionSheet.show({
          titleText: "Logout ",
          buttons: [
            {
              text: '<i class="icon ion-log-out"></i> Logout',
            },
            // {
            //   text: '<i class="icon ion-chatboxes"></i> Share with Sms'
            // },
            // {
            //   text: '<i class="icon ion-network"></i> Share with Social'
            // },
          ],

          buttonClicked: function (index) {
            //console.log(index);
            if (index == 0) {
              $ionicLoading.show();
              $rootScope.global = {};

              let platform = ionic.Platform.platform();
              if (platform == "android") {
                document.addEventListener("deviceready", function () {
                  window.plugins.OneSignal.getTags(function (tags) {
                    // //console.log(tags);
                    for (x in tags) {
                      // //console.log(x)
                      let key = x;
                      window.plugins.OneSignal.deleteTag(key);
                    }
                  });
                });
              }

              delete $localStorage.globalAGRI;
              $timeout(function () {
                window.location = "index.html";
                $ionicLoading.hide();
              }, 5000);
            }

            // if (index == 1) {
            // }

            // if (index == 2) {
            // }

            return true;
          },
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
          hideSheet();
        }, 7000);

        // $state.go('app.farmerlogin')
      };

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

      // vm.iot = function () {
      //   $state.go("app.newsetting");
      // };

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

      // vm.connectPrinter = function () {
      //   let printer = [];
      //   //console.log('11111')
      //   bluetoothSerial.enable(
      //     function () {
      //       //console.log("Bluetooth is enabled");
      //     },
      //     function () {
      //       //console.log("The user did *not* enable Bluetooth");
      //     }
      //   );

      //   bluetoothSerial.list(success, failure);

      //   function success(e) {
      //     //console.log(e)
      //     printer = e[3];

      //     //console.log(printer.address)
      //     bluetoothSerial.connect(
      //       printer.address,
      //       connectSuccess,
      //       connectFailure
      //     );

      //     function connectSuccess(e) {
      //       //console.log(e)
      //     }

      //     function connectFailure(e) {
      //       //console.log(e)
      //     }
      //   }

      //   function failure(e) {
      //     //console.log(e)
      //   }
      // };

      // vm.testprint = function () {
      //   // var data = new Uint8Array(4);
      //   // data[0] = 0x41;
      //   // data[1] = 0x42;
      //   // data[2] = 0x43;
      //   // data[3] = 0x44;

      //   // //console.log(data)

      //   // var data ='data:image/gif;base64,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'

      //   var data = new Uint8Array(4);
      //   data[0] = 0x41;
      //   data[1] = 0x42;
      //   data[2] = 0x43;
      //   data[3] = 0x44;
      //   bluetoothSerial.write("Text to print \n\r", success, failure);

      //   bluetoothSerial.available(
      //     function (sus) {
      //       //console.log(sus)
      //     },
      //     function (err) {
      //       //console.log(err)
      //     }
      //   );

      //   function success(e) {
      //     //console.log(e)
      //   }

      //   function failure(e) {
      //     //console.log(e)
      //   }
      // };

      // $scope.myScroll = { height: "calc(100% - 50px)", "margin-top": "-16px" };
      // vm.ppp = function() {
      //   $scope.ww = !$scope.ww;
      //   if ($scope.ww) {
      //     $scope.myScroll = {
      //       height: "calc(100% - 50px)",
      //       "margin-top": "-16px"
      //     };
      //   } else {
      //     $scope.myScroll = { height: "calc(100%)" };
      //   }
      //   $ionicScrollDelegate.resize();
      //   //console.log($rootScope.global);
      // };

      // $scope.ww = false;
      // $scope.myScroll = { height: "calc(100%)" };

      // function active() {
      //   let url = $rootScope.ip + "onesig.php"; //'http://192.168.9.172/agriprophp/login.php'
      //   //console.log(url);
      //   let req = {
      //     mode: "checkActive",
      //     value: $rootScope.global

      //   };
      //   $http.post(url, req).then(function suscess(response) {

      //     if (response.data.status == true && response.data.result.length > 0) {
      //     vm.activeMat = response.data.result;
      //       $scope.ww = true;
      //       $scope.myScroll = {
      //         height: "calc(100% - 50px)",
      //         "margin-top": "-16px"
      //       };
      //     } else {
      //       $scope.ww = false;
      //       $scope.myScroll = { height: "calc(100%)" };
      //     }

      //   });
      // }

      // active();
      // let loopActive = setInterval(active, 15000);
    }
  );
