angular
  .module("app")

  .controller(
    "controliotCtrl",
    function (
      $ionicModal,
      $scope,
      $http,
      $ionicLoading,
      $rootScope,
      $timeout,
      $ionicScrollDelegate,
      $q,
      $state,
      $mdDialog,
      fachttp,
      $cordovaBarcodeScanner
    ) {
      let vm = this;
      var myVar;

      let platform = ionic.Platform.platform();

      let dates = new Date("2021-10-11TO09:30:00Z");
      console.log(dates);

      document.addEventListener("deviceready", function () {
        WifiWizard2.getConnectedSSID().then(function (e) {
          console.log(e);
        });
  
      })
    
      vm.connectiot = function (e) {
        $ionicLoading.show();
        $scope.closeModalAdd();
        let req = {
          mode: "connectiot",
          // sub: e,
          iotid: e.toUpperCase(),
        };
        fachttp.model("setting.php", req).then(
          function (response) {
            $ionicLoading.hide();

            if (response.data.status == "allow") {
              document.addEventListener("deviceready", function () {
                if (platform == "android") {
                  FirebasePlugin.subscribe(
                    req.iotid,
                    function () {
                      console.log("Subscribed to topic");
                    },
                    function (error) {
                      console.error("Error subscribing to topic: " + error);
                    }
                  );
                } else if (platform == "ios") {
                  FirebasePlugin.subscribe(
                    req.iotid,
                    function () {
                      console.log("Subscribed to topic");
                    },
                    function (error) {
                      console.error("Error subscribing to topic: " + error);
                    }
                  );
                }
              });
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("เชื่อมต่ออุปกรณ์เรียบร้อยแล้ว")
                  .textContent(
                    "เชื่อมต่ออุปกรณ์เรียบร้อยแล้ว เปิดรายการดูอีกครั้ง"
                  )
                  .ariaLabel("Alert Dialog Demo")
                  .ok("Got it!")
                  .targetEvent()
              );

              onStart1();
            } else if (response.data.status == "notallow") {
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("แจ้งเตือน ไม่สามารถเชื่อมต่อได้ !")
                  .textContent(
                    "ไม่สามารถเชื่อมต่ออุปกร์นี้ได้เนื่องจาก อุปกรณ์นี้เชื่อมต่อกับพื้นที่อื่นแล้ว *หากต้องการเชื่อมต่อ ให้ยกเลิกการเชื่อมต่ออุปกรณ์กับพื้นที่เดิมก่อน*"
                  )
                  .ariaLabel("Alert Dialog Demo")
                  .ok("Got it!")
                  .targetEvent()
              );
            } else if (response.data.status == false) {
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("แจ้งเตือน . . .")
                  .textContent(
                    "ไม่พบอุปกรณ์นี้ กรุณาตรวจสอบหมายเลขอุปกรณ์อีกครั้ง หรือติดต่อผู้ให้บริการ"
                  )
                  .ariaLabel("Alert Dialog Demo")
                  .ok("Got it!")
                  .targetEvent()
              );
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };

      $scope.dataDash = [];
      vm.addIOT = function () {
        $scope.openModalAdd();
      };

      vm.key = function () {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog
          .prompt()
          .title("เพิ่มอุปกรณ์")
          .textContent("ป้อนรหัสอุปกรณ์เพื่อเพิ่มอุปกรณ์ใหม่")
          .placeholder("รหัสอุปกรณ์,IOT ID")
          .ariaLabel("รหัสอุปกรณ์,IOT ID")
          .initialValue()
          .targetEvent()
          .required(false)
          .ok("เชื่อมต่อ")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function (result) {
            if (result) {
              vm.connectiot(result);
              // $ionicLoading.show();
            }
          },
          function (e) {}
        );
      };

      vm.qr = function () {
        console.log("qr");
        document.addEventListener("deviceready", function () {
          $cordovaBarcodeScanner.scan().then(
            function (barcode) {
              if (!barcode.cancelled) {
                vm.connectiot(barcode.text);
              } else {
                $ionicLoading.hide();
              }
            },
            function (error) {
              $ionicLoading.hide();
            }
          );
        });
      };

      vm.wifi = function () {
        $scope.closeModalAdd();
        $state.go("app.controliotwifi");
      };

      vm.disconnect = function () {
        var confirm = $mdDialog
          .confirm()
          .title("ต้องการยกเลิกการเชื่อมต่อหรือไม่ ?")
          .textContent(
            "เมื่อยกเลิกการเชื่อมต่อกับอุปกรณ์ " +
              vm.iotno +
              "  คุณจะไม่สามารถดูรายละเอียดของอุปกรณ์ และการตั้งค่าอุปกรณ์ได้"
          )
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน. ยกเลิกการเชื่อมต่อ")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            $ionicLoading.show();

            let req = {
              mode: "disconnectiot",
              sub: vm.iotno,
            };
            fachttp.model("setting.php", req).then(
              function (response) {
                $scope.closeModalEdit();
                document.addEventListener("deviceready", function () {

                  if (platform == "android") {
                    FirebasePlugin.unsubscribe(
                      vm.iotno,
                      function () {
                        console.log("Unsubscribed from topic");
                      },
                      function (error) {
                        console.error(
                          "Error unsubscribing from topic: " + error
                        );
                      }
                    );
                  } else if (platform == "ios") {
                    FirebasePlugin.unsubscribe(
                      vm.iotno,
                      function () {
                        console.log("Unsubscribed from topic");
                      },
                      function (error) {
                        console.error(
                          "Error unsubscribing from topic: " + error
                        );
                      }
                    );
                  }
                });
                $ionicLoading.hide();
                onStart1();
                $mdDialog.show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("ยกเลิกการเชื่อมต่ออุปกรณ์เรียบร้อยแล้ว")
                    .textContent(
                      "ยกเลิกการเชื่อมต่ออุปกรณ์เรียบร้อยแล้ว เปิดรายการดูอีกครั้ง"
                    )
                    .ariaLabel("Alert Dialog Demo")
                    .ok("Got it!")
                    .targetEvent()
                );
                if (response.data.status == true) {
                } else {
                }
              },
              function err(err) {
                $scope.closeModalEdit();
              }
            );
          },
          function () {}
        );
      };

      $scope.confirmEdit = function () {
        $ionicLoading.show();
        let url = $rootScope.ip + "setting.php";
        let req = {
          mode: "editiot",
          iotno: vm.iotno,
          iotselect: vm.iotselect,
          global: $rootScope.global,
        };
        //console.log(req);
        $http.post(url, req).then(
          function suscess(response) {
            $scope.editmodal.hide();
            $ionicLoading.hide();
            onStart1();
            console.log(response);
            if (response.data.status == true) {
              // clocklist();
            } else {
              // clocklist();
            }
          },
          function err(err) {
            $scope.editmodal.hide();

            $ionicLoading.hide();
          }
        );

        console.log(vm.iotselect);
      };

      $ionicModal
        .fromTemplateUrl("my-modaladdiot.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.addmodal = modal;
        });

      $scope.openModalAdd = function () {
        $scope.addmodal.show();
      };
      $scope.closeModalAdd = function () {
        $scope.addmodal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.addmodal.remove();
      });

      $ionicModal
        .fromTemplateUrl("my-modaledit.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.editmodal = modal;
        });

      $scope.openModalEdit = function () {
        $scope.editmodal.show();
      };
      $scope.closeModalEdit = function () {
        $scope.editmodal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.editmodal.remove();
      });

      $ionicModal
        .fromTemplateUrl("my-shuffle.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.shuffleModal = modal;
        });

      $scope.openModalShuffle = function () {
        $scope.shuffleModal.show();
      };
      $scope.closeModalShuffle = function () {
        $scope.shuffleModal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.shuffleModal.remove();
      });

      $scope.selectIOT = function (e) {
        // console.log(e)
        vm.subChange(e);
        $scope.closeModalShuffle();
      };

      $scope.mode = {
        sw1: false,
      };

      $scope.ac = {
        ac1: false,
        ac2: false,
      };

      $scope.check = function () {
        if ($scope.mode.sw1 == true) {
          $scope.auto(1);
        } else {
          $scope.auto(2);
        }
      };

      $scope.auto = function (e) {
        $ionicLoading.show();
        let url = $rootScope.ip + "setting.php";
        let req = {
          mode: "auto",
          iotno: vm.iotno,
          detail: e,
          type: "AIRMOISTURE",
          global: $rootScope.global,
          detail: e,
        };

        $http.post(url, req).then(
          function suscess(response) {
            if (response.data.status == true) {
              clocklist();
            } else {
              clocklist();
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.ac1Change = function () {
        let e = $scope.ac.ac1 == true ? 1 : 0;
        //console.log($scope.ac);
        $ionicLoading.show();
        let url = $rootScope.ip + "setting.php";
        let req = {
          mode: "setmanual",
          iotno: vm.iotno,
          detail: e,
          type: "SOILMOISTURE",
          global: $rootScope.global,
        };
        //console.log(req);
        $http.post(url, req).then(
          function suscess(response) {
            if (response.data.status == true) {
              clocklist();
            } else {
              clocklist();
            }
          },
          function err(err) {
            clocklist();

            $ionicLoading.hide();
          }
        );
      };

      vm.ac2Change = function () {
        let e = $scope.ac.ac2 == true ? 1 : 0;
        $ionicLoading.show();

        let url = $rootScope.ip + "setting.php";
        let req = {
          mode: "setmanual",
          iotno: vm.iotno,
          detail: e,
          type: "AIRMOISTURE",
          global: $rootScope.global,
        };

        $http.post(url, req).then(
          function suscess(response) {
            if (response.data.status == true) {
              clocklist();
            } else {
              clocklist();
            }
          },
          function err(err) {
            $ionicLoading.hide();
            clocklist();
          }
        );
      };

      // $scope.colors = ["#fdd835", "#e3051e", "#00bfa5"];

      $scope.chartOption = [
        {
          unit: "percent",
          options: {
            animate: {
              duration: 1000,
              enabled: true,
            },
            barColor: "#e3051e",
            scaleColor: false,
            lineWidth: 4,
            lineCap: "round",
          },
        },
        {
          unit: "temp",
          options: {
            animate: {
              duration: 1000,
              enabled: true,
            },
            barColor: "#fdd835",
            scaleColor: false,
            lineWidth: 4,
            lineCap: "round",
          },
        },
        {
          unit: "percent",
          options: {
            animate: {
              duration: 1000,
              enabled: true,
            },
            barColor: "#00bfa5",
            scaleColor: false,
            lineWidth: 4,
            lineCap: "round",
          },
        },
        {
          unit: "percent",
          options: {
            animate: {
              duration: 1000,
              enabled: true,
            },
            barColor: "#5FE823 ",
            scaleColor: false,
            lineWidth: 4,
            lineCap: "round",
          },
        },
        {
          unit: "percent",
          options: {
            animate: {
              duration: 1000,
              enabled: true,
            },
            barColor: "#FFC300",
            scaleColor: false,
            lineWidth: 4,
            lineCap: "round",
          },
        },
      ];

      $scope.model = {
        sub: null,
      };

      function onStart1() {
        $ionicLoading.show();
        let url = $rootScope.ip + "setting.php";
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "iotmaplist",
          global: $rootScope.global,
        };
        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 10000);
        $http
          .post(url, req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function suscess(response) {
              vm.lsStatus = response.data.status;
              if (response.data.status == true) {
                vm.status = true;
                $scope.datass = response.data;
                // $scope.model.sub = $scope.datass.result[0];
                vm.subChange($scope.datass.result[0]);
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

      vm.subChange = function (e) {
        $ionicLoading.show();
        $scope.model.sub = e;
        vm.iotvolt = e.iot_volt;
        vm.iotno = e.iot_id;
        vm.iotselect = e;

        clearint();
        let url = $rootScope.ip + "dashboard.php";
        let req = {
          mode: "selectdash",
          value: e,
          global: $rootScope.global,
        };
        $http.post(url, req).then(
          function suscess(response) {
            if (response.data.status == true) {
              $scope.dataDash = response.data;

              // $scope.$apply(function () {
              //   $scope.dataDash = response.data;
              // });
              $ionicScrollDelegate.resize();
              return (myVar = setInterval(myTimer, 10000));
            } else {
              $ionicLoading.hide();
              $scope.dataDash = response.data;

              // $scope.$apply(function () {
              //   $scope.dataDash = response.data;
              // });
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
          value: e,
        };
        $http.post(url2, req2).then(
          function suscess(response) {
            if (response.data.result) {
              $scope.data = [
                [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0,
                ],
                [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0,
                ],
                [
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                  0, 0, 0,
                ],
              ];
              $timeout(function () {
                $scope.data = response.data.result;
                $scope.labels = response.data.label;
                $scope.series = response.data.series;

                $scope.chartday = response.data;
              }, 0);
            } else {
            }
          },
          function err(err) {}
        );
        $timeout(function () {
          clocklist();
        }, 1000);
      };

      vm.setting = function () {
        console.log($scope.dataDash);

        $state.go("app.controliotSetting", {
          dataDash: JSON.stringify($scope.dataDash.result),
          listClock: JSON.stringify(vm.listClock),
        });
      };

      function clocklist() {
        $ionicLoading.show();
        let cancellerLoadpic = $q.defer();
        let url = $rootScope.ip + "setting.php";
        let req = {
          mode: "clockList",
          iotno: vm.iotno,
          global: $rootScope.global,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 10000);

        $http
          .post(url, req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function suscess(response) {
              vm.statusfinal = true;
              vm.listClock = response.data;
              $ionicLoading.hide();

              console.log(response.data);

              if (response.data.soil.length > 0) {
                vm.soil = response.data.soil[0];
                switch (vm.soil.setting_status) {
                  case 1:
                    $scope.mode.sw1 = true;
                    $scope.ac.ac1 = false;

                    break;

                  case 2:
                    $scope.mode.sw1 = false;
                    $scope.ac.ac1 = false;

                    break;

                  case 3:
                    $scope.mode.sw1 = false;
                    $scope.ac.ac1 = true;

                    break;
                }
              } else {
              }
              if (response.data.air.length > 0) {
                vm.air = response.data.air[0];
                switch (vm.air.setting_status) {
                  case 1:
                    $scope.mode.sw1 = true;
                    $scope.ac.ac2 = false;

                    break;

                  case 2:
                    $scope.mode.sw1 = false;
                    $scope.ac.ac2 = false;

                    break;

                  case 3:
                    $scope.mode.sw1 = false;
                    $scope.ac.ac2 = true;

                    break;
                }
              } else {
              }
            },
            function err(err) {
              vm.statusfinal = false;
              $ionicLoading.hide();
            }
          );
      }

      function myTimer() {
        if ($scope.model.sub) {
          let url = $rootScope.ip + "dashboard.php";
          let req = {
            mode: "selectdash",
            value: $scope.model.sub,
            global: $rootScope.global,
          };
          $http.post(url, req).then(
            function suscess(response) {
              console.log(response);
              if (response.data.status == true) {
                $timeout(function () {
                  $scope.$apply(function () {
                    $scope.dataDash = response.data;
                  });
                }, 500);
              } else {
                $scope.$apply(function () {
                  $scope.dataDash = response.data;
                });
              }
            },
            function err(err) {}
          );

          let url2 = $rootScope.ip + "dashboard.php";
          let req2 = {
            mode: "dashboardrealtime",
            global: $rootScope.global,
            value: $scope.model.sub,
          };

          $http.post(url2, req2).then(
            function suscess(response) {
              if (response.data.result) {
                $scope.data = [
                  [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0,
                  ],
                  [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0,
                  ],
                  [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0,
                  ],
                ];

                $timeout(function () {
                  $scope.data = response.data.result;
                  $scope.labels = response.data.label;
                  $scope.series = response.data.series;

                  $scope.chartday = response.data;
                }, 1000);
              } else {
              }
            },
            function err(err) {}
          );
        }
      }

      $scope.testTimer = function () {
        console.log("testTimer");
        setInterval(() => {
          console.log("interval");
        }, 2000);
      };

      function clearint() {
        return clearInterval(myVar);
      }

      $scope.$on("$ionicView.leave", function (scopes, states) {
        clearint();
      });

      vm.dayChart = function () {
        if ($scope.chartday && $scope.dataDash) {
          $state.go("app.controliot2", {
            chart: JSON.stringify($scope.chartday),
            dataDash: JSON.stringify($scope.dataDash),
          });
        } else {
        }
      };
    }
  )

  .controller(
    "controliotwifiCtrl",
    function (
      $ionicModal,
      $scope,
      $http,
      $ionicLoading,
      $rootScope,
      $timeout,
      $ionicScrollDelegate,
      $q,
      $state,
      $mdDialog,
      fachttp,
      $cordovaBarcodeScanner,
      $ionicHistory
    ) {
      let vm = this;
      var myVar;

      let platform = ionic.Platform.platform();
      console.log("console wifi");

      $scope.wificonfig = { ssid: null, password: null };

      $scope.Ssid = null;

      $scope.$watch("Ssid", function (a, b) {
        console.log(a, b);
        console.log("ssid chahange");
      });

      $scope.wifiList = [];

      $scope.scan = function () {
        WifiWizard.startScan(success, fail);
        function success(s) {
          console.log("scan success");
          $scope.getWifiConnectSSid();
        }
        function fail(e) {
          console.log("scan fail");
        }
      };

      $scope.getResult = function () {
        WifiWizard.startScan(success, fails);
        function success(s) {
          console.log("scan success");
        }
        function fails(e) {
          console.log("scan fail");
        }

        WifiWizard.getScanResults(listHandler, fail);
        function listHandler(s) {
          console.log(s);

          var newArray = s.filter(function (el) {
            return el.frequency <= 3000 && el.SSID.substring(0, 7) == "AGRIPRO";
          });

          var newArrayWifi = s.filter(function (el) {
            return (
              el.frequency <= 3000 && el.SSID.substring(0, 7) !== "AGRIPRO"
            );
          });

          if (newArray.length >= 1) {
            $scope.connectAP(newArray[0].SSID);
          } else {
          }

          $scope.$apply(function () {
            $scope.wifiList = newArrayWifi;
          });
        }
        function fail(e) {
          console.log(e);
          alert("Failed" + e);
        }
      };

      $scope.getWifiConnectSSid = function () {
        WifiWizard.getScanResults(listHandler, fail);
        function listHandler(s) {
          console.log(s);

          var newArrayWifi = s.filter(function (el) {
            return (
              el.frequency <= 3000 && el.SSID.substring(0, 7) !== "AGRIPRO"
            );
          });

          $scope.$apply(function () {
            $scope.wifiList = newArrayWifi;
          });
        }
        function fail(e) {
          console.log(e);
          // alert("" + e);
        }
      };

      $scope.connectAP = function (e) {
        WifiWizard.getCurrentSSID(
          function suscess(s) {
            if (s.substring(1, 8) == e.substring(0, 7)) {
              console.log("a");
            } else {
              var wifi_network = WifiWizard.formatWifiConfig(
                e,
                "12345678",
                "WPA"
              );
              WifiWizard.addNetwork(
                wifi_network,
                function (win) {
                  WifiWizard.connectNetwork(
                    e,
                    function (win) {
                      console.log(win);
                    },
                    function (fail) {
                      console.log(fail);
                    }
                  );
                },
                function (fail) {
                  console.log(fail);
                }
              );
            }
          },
          function error(e) {}
        );
      };

      $scope.getSsid = function (e) {
        console.log(e);

        WifiWizard.getCurrentSSID(
          function suscess(s) {
            if (s.substring(1, 8) == "AGRIPRO") {
              $scope.wificonfig.ssid = e.SSID;
              $scope.openModalAdd();
            } else {
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("แจ้งเตือน ")
                  .textContent("โปรดเชื่อมต่อกับสัญญาณ wifi กล่อง*")
                  .ariaLabel("Alert Dialog Demo")
                  .ok("ok")
                  .targetEvent()
              );
            }
          },
          function error(e) {
            $mdDialog.show(
              $mdDialog
                .alert()
                .parent(
                  angular.element(document.querySelector("#popupContainer"))
                )
                .clickOutsideToClose(true)
                .title("แจ้งเตือน ")
                .textContent("โปรดเชื่อมต่อกับสัญญาณ wifi กล่อง*")
                .ariaLabel("Alert Dialog Demo")
                .ok("ok")
                .targetEvent()
            );
          }
        );
      };

      $scope.reCheck = function () {
        WifiWizard.startScan(success, fails);
        function success(s) {
          console.log("scan success");
        }
        function fails(e) {
          console.log("scan fail");
        }

        WifiWizard.getScanResults(listHandler, fail);
        function listHandler(s) {
          console.log(s);

          var newArray = s.filter(function (el) {
            return el.frequency <= 3000 && el.SSID.substring(0, 7) == "AGRIPRO";
          });

          var newArrayWifi = s.filter(function (el) {
            return (
              el.frequency <= 3000 && el.SSID.substring(0, 7) !== "AGRIPRO"
            );
          });

          if (newArray.length >= 1) {
            $scope.connectAP(newArray[0].SSID);
          } else {
            alert("ไม่พบสัญญาอุปกรณ์ของคุณกรุณาลองใหม่อีกครั้ง");
          }

          $scope.$apply(function () {
            $scope.wifiList = newArrayWifi;
          });
        }
        function fail(e) {
          console.log(e);
          alert("ไม่พบสัญญาอุปกรณ์ของคุณกรุณาลองใหม่อีกครั้ง");
        }
      };

      var checkInterval;
      let countCheck = 0;

      var recheckInterval;
      let countreCheck = 0;

      function checkConnecttion() {
        // console.log($scope.Ssid);
        let req = {
          mode: "checkConnecttion",
          iot_id: $scope.Ssid,
        };
        fachttp.model("setting.php", req).then(
          function (response) {
            console.log(response);

            if (response.data.status == true) {
              $ionicLoading.hide();

              clearInterval(checkInterval);
              $scope.closeModalAdd();
              $mdDialog
                .show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("แจ้งเตือน ")
                    .textContent("เชื่อมต่อสัญญาณ Wifi กับอุปกรณ์สำเร็จ")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("ok")
                    .targetEvent()
                )
                .then(function (answer) {
                  $ionicHistory.goBack();
                });
            }
          },
          function (err) {
            console.log("err");
          }
        );

        // console.log("check");
        if (countCheck == 5) {
          $ionicLoading.hide();
          clearInterval(checkInterval);
        }
        countCheck++;
      }

      $scope.connect = function () {
        console.log($scope.wificonfig.password);
        if (
          $scope.wificonfig.password.length >= 8 ||
          $scope.wificonfig.password == null ||
          $scope.wificonfig.password == ""
        ) {
          WifiWizard.getCurrentSSID(
            function suscess(s) {
              if (s.substring(1, 8) == "AGRIPRO") {
                $ionicLoading.show();
                let url =
                  "http://172.217.28.1/_ac/connect?SSID=" +
                  $scope.wificonfig.ssid +
                  "&Passphrase=" +
                  $scope.wificonfig.password +
                  "&dhcp=en&apply=Apply";

                $http.post(url).then(
                  function suscess(response) {
                    setTimeout(() => {
                      WifiWizard.getCurrentSSID(
                        function suscess(s) {
                          let wifiSSid = s.substring(1, s.length - 1);

                          WifiWizard.disconnectNetwork(
                            wifiSSid,
                            function win(e) {
                              console.log(e);
                            },
                            function fail(e) {
                              console.log(e);
                            }
                          );
                        },
                        function error(e) {
                          console.log("c");
                        }
                      );
                    }, 1000);
                  },
                  function err(err) {
                    setTimeout(() => {
                      WifiWizard.getCurrentSSID(
                        function suscess(s) {
                          let wifiSSid = s.substring(1, s.length - 1);

                          WifiWizard.disconnectNetwork(
                            wifiSSid,
                            function win(e) {
                              console.log(e);
                            },
                            function fail(e) {
                              console.log(e);
                            }
                          );
                        },
                        function error(e) {
                          console.log("c");
                        }
                      );
                    }, 1000);
                  }
                );

                setTimeout(() => {
                  countCheck = 0;
                  checkInterval = setInterval(checkConnecttion, 5000);
                }, 2000);
              } else {
                myTimerRecheck();
                countreCheck = 0;
                recheckInterval = setInterval(myTimerRecheck, 5000);
              }
            },
            function error(e) {
              myTimerRecheck();

              countreCheck = 0;
              recheckInterval = setInterval(myTimerRecheck, 5000);
            }
          );
        } else {
          alert("รูปแบบรหัส wifi ไม่ถูกต้องกรุณาลองใหม่อีกครั้ง");
        }
      };

      $scope.LoadApConnectStatus = false;

      function myTimerRecheck() {
        $ionicLoading.show({
          template:
            "<ion-spinner></ion-spinner> <br/> กำลังค้นหาอุปกรณ์ของคุณ <br/>โปรดตรวจสอบว่าสัญญาณไฟที่อุปกรณ์ดับอยู่",
        });
        WifiWizard.getCurrentSSID(
          function suscess(s) {
            if (s.substring(1, 8) == "AGRIPRO") {
              $scope.Ssid = s.substring(9, s.length - 1);

              clearInterval(recheckInterval);
              $scope.connect();
            } else {
              $scope.getResult();
            }
          },
          function error(e) {
            $scope.getResult();
          }
        );

        if (countreCheck >= 5) {
          notDetectApRecheck();
        }

        countreCheck++;
      }

      function notDetectApRecheck() {
        $ionicLoading.hide();

        $mdDialog
          .show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(true)
              .title("แจ้งเตือน ")
              .textContent(
                "ไม่สามารถเชื่อมต่อได้กรุณาลองใหม่อีกครั้ง ตรวจสอบ Password และ wifi ต้องเป็นรูปแบบ 2.4 เท่านั้น"
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("ok")
              .targetEvent()
          )
          .then(function (answer) {
            $ionicHistory.goBack();
          });

        clearInterval(recheckInterval);
      }

      var myInterval;
      var countWatch = 0;

      function myTimer() {
        $ionicLoading.show({
          template:
            "<ion-spinner></ion-spinner> <br/> กำลังค้นหาอุปกรณ์ของคุณ <br/>โปรดตรวจสอบว่าสัญญาณไฟที่อุปกรณ์ดับอยู่",
        });
        WifiWizard.getCurrentSSID(
          function suscess(s) {
            if (s.substring(1, 8) == "AGRIPRO") {
              $scope.Ssid = s.substring(9, s.length - 1);
              console.log("a");
              $scope.stopInterval();
            } else {
              $scope.getResult();
            }
          },
          function error(e) {
            $scope.getResult();
          }
        );

        if (countWatch >= 5) {
          notDetectAp();
        }

        countWatch++;
      }

      function notDetectAp() {
        $ionicLoading.hide();

        alert("ไม่พบอุปกรณ์กรุณาลองใหม่อีกครั้ง");
        $ionicHistory.goBack();
        console.log("clear");
        clearInterval(myInterval);
      }

      $scope.stopInterval = function () {
        $ionicLoading.hide();

        console.log("clear");
        $scope.$apply(function () {
          $scope.LoadApConnectStatus = true;
        });
        clearInterval(myInterval);
      };

      $ionicModal
        .fromTemplateUrl("my-modaladdiot.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.addmodal = modal;
        });

      $scope.openModalAdd = function () {
        $scope.addmodal.show();
      };
      $scope.closeModalAdd = function () {
        $scope.addmodal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.addmodal.remove();
      });

      document.addEventListener("deviceready", function () {
        WifiWizard.getCurrentSSID(
          function suscess(s) {
            console.log(s);
          },
          function error(e) {
            console.log("c");
          }
        );
        myInterval = setInterval(myTimer, 5000);
        myTimer();
        $scope.getWifiConnectSSid();
      });

      // $scope.isWifiEnabled = function () {
      //   WifiWizard.isWifiEnabled(win, fail);

      //   function win(e) {
      //     console.log(e);
      //   }
      //   function fail(e) {
      //     console.log(e);
      //   }
      // };

      // $scope.setWifiEnabled = function () {
      //   WifiWizard.setWifiEnabled(true, win, fail);

      //   function win(e) {
      //     console.log(e);
      //   }
      //   function fail(e) {
      //     console.log(e);
      //   }
      // };
    }
  )

  .controller(
    "controliot2Ctrl",
    function (
      $ionicModal,
      $scope,
      $http,
      $ionicLoading,
      $rootScope,
      $timeout,
      $ionicScrollDelegate,
      $q,
      $stateParams
    ) {
      let vm = this;
      vm.resParams = JSON.parse($stateParams.chart);

      console.log(vm.resParams);
      $scope.dataDash = JSON.parse($stateParams.dataDash);

      //console.log($scope.dataDash);

      $scope.data = vm.resParams.result;
      $scope.labels = vm.resParams.label;
      $scope.series = vm.resParams.series;

      $scope.colors = ["#fdd835", "#e3051e", "#00bfa5"];

      $scope.datasetOverride = [
        {
          yAxisID: "y-axis-1",
        },
      ];
      $scope.options = {
        responsive: true,

        scales: {
          yAxes: [
            {
              id: "y-axis-1",
              type: "linear",
              display: true,
              position: "left",
            },
          ],
        },
        legend: {
          display: true,
          position: "bottom",
        },

        elements: {
          point: {
            radius: 1,
            pointStyle: "rectRounded",
          },
        },
      };
    }
  )

  .controller(
    "controliotSettingCtrl",
    function (
      $ionicModal,
      $scope,
      $http,
      $ionicLoading,
      $rootScope,
      $timeout,
      $ionicScrollDelegate,
      $q,
      $stateParams,
      $state
    ) {
      let vm = this;

      $scope.clockList = JSON.parse($stateParams.listClock);
      $scope.dataDash = JSON.parse($stateParams.dataDash);

      function onStart1() {
        $ionicLoading.show();
        let url = $rootScope.ip + "setting.php";
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "selectAC",
          global: $rootScope.global,
          iotID: $scope.dataDash,
        };
        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 10000);
        $http
          .post(url, req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function suscess(response) {
              console.log(response.data);
              vm.lsStatus = response.data.status;
              if (response.data.status == true) {
                $scope.selectAC = response.data.result;
                $scope.selected = $scope.selectAC[0];
                $scope.subChange($scope.selected);
              } else {
                $scope.selectAC = response.data.result;
              }
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
      }

      onStart1();

      $scope.subChange = function (e) {
        delete $scope.repeat;

        $ionicLoading.show();
        let url = $rootScope.ip + "setting.php";
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "changeAC",
          global: $rootScope.global,
          iotID: e,
        };
        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 10000);
        $http
          .post(url, req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function suscess(response) {
              console.log(response.data);
              vm.lsStatus = response.data.status;

              $scope.repeat = response.data.result;

              $ionicLoading.hide();
            },
            function err(err) {
              $scope.repeat = [];
              $ionicLoading.hide();
            }
          );
      };

      $scope.setting3 = function () {
        let key = $scope.repeat.setting_type;
        switch (key) {
          case "SOILMOISTURE":
            $state.go("app.setting3", {
              iotno: $scope.repeat.setting_id,
              type: key,
              ac: "AC1",
            });

            break;

          case "AIRMOISTURE":
            $state.go("app.setting4", {
              iotno: $scope.repeat.setting_id,
              type: key,
              ac: "AC2",
            });

            break;
        }
      };

      vm.editSetting = function (e) {
        //console.log(e)
        let k = JSON.stringify(e);
        $state.go("app.settingedit", {
          setting: k,
        });
      };
    }
  )

  .controller(
    "settingeditCtrl",
    function (
      $rootScope,
      $ionicLoading,
      $timeout,
      $http,
      $ionicPopup,
      Service,
      $scope,
      $state,
      $ionicModal,
      $ionicScrollDelegate,
      $stateParams,
      $mdDialog,
      $log,
      $q,
      $ionicHistory
    ) {
      let vm = this;
      vm.settingClock = JSON.parse($stateParams.setting);
      vm.model = {
        soil: null,
      };
      vm.model = {
        air: null,
      };

      vm.airValueToggle = { val1: 0, val2: 0 };

      if (vm.settingClock.setting_type == "SOILMOISTURE") {
        vm.model.soil = vm.settingClock;
      } else if (vm.settingClock.setting_type == "AIRMOISTURE") {
        vm.model.air = vm.settingClock;
        if (vm.settingClock.setting_temp_value > 0) {
          vm.airValueToggle.val1 = 1;
        }
        if (vm.settingClock.setting_temp_value2 > 0) {
          vm.airValueToggle.val2 = 1;
        }
      }

      vm.days = [
        {
          day: "วันจันทร์",
          value: 0,
        },
        {
          day: "วันอังคาร",
          value: 0,
        },
        {
          day: "วันพุธ",
          value: 0,
        },
        {
          day: "วันพฤหัสบดี",
          value: 0,
        },
        {
          day: "วันศุกร์",
          value: 0,
        },
        {
          day: "วันเสาร์",
          value: 0,
        },
        {
          day: "วันอาทิตย์",
          value: 0,
        },
      ];

      $ionicModal
        .fromTemplateUrl("my-day.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modal = modal;
        });

      $scope.openModal = function () {
        $scope.modal.show();
      };
      $scope.closeModal = function () {
        $scope.modal.hide();
      };

      $scope.$on("$destroy", function () {
        $scope.modal.remove();
      });

      // //console.log(vm.model);

      vm.toggleChange = function () {
        $ionicScrollDelegate.resize();
      };

      vm.modeChange = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.temp.setting_temp_value = 0;
              vm.model.temp.setting_temp_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              //  $scope.toggle.mode2 = true;
              vm.model.temp.setting_time_value = null;
              vm.model.temp.setting_temp_status = 1;
            }, 500);

            break;
        }
      };

      vm.mode2Change = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.temp.setting_time_value = null;
              vm.model.temp.setting_time_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.temp.setting_temp_value = 0;
              vm.model.temp.setting_time_status = 1;
            }, 500);
            break;
        }
      };

      vm.soilmodeChange = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.soil.setting_temp_value = 0;
              vm.model.soil.setting_temp_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.soil.setting_time_value = null;
              vm.model.soil.setting_temp_status = 1;
            }, 500);

            break;
        }
      };

      vm.soilmode2Change = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.soil.setting_time_value = null;
              vm.model.soil.setting_time_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.soil.setting_temp_value = 0;
              vm.model.soil.setting_time_status = 1;
            }, 500);
            break;
        }
      };

      vm.airlmodeChange = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.air.setting_temp_value = 0;
              vm.model.air.setting_temp_value2 = 0;
              vm.model.air.setting_temp_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.air.setting_time_value = null;
              vm.model.air.setting_temp_status = 1;
            }, 500);

            break;
        }
      };

      vm.airmode2Change = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.air.setting_time_value = null;
              vm.model.air.setting_time_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.air.setting_temp_value = 0;
              vm.model.air.setting_temp_value = 0;
              vm.model.air.setting_time_status = 1;
            }, 500);
            break;
        }
      };

      $scope.test = function (e) {
        switch ($scope.DayBase) {
          case "temp":
            vm.model.temp.setting_mon = vm.dayvalue[0];
            vm.model.temp.setting_tue = vm.dayvalue[1];
            vm.model.temp.setting_wed = vm.dayvalue[2];
            vm.model.temp.setting_thu = vm.dayvalue[3];
            vm.model.temp.setting_fri = vm.dayvalue[4];
            vm.model.temp.setting_sat = vm.dayvalue[5];
            vm.model.temp.setting_sun = vm.dayvalue[6];
            break;
          case "air":
            vm.model.air.setting_mon = vm.dayvalue[0];
            vm.model.air.setting_tue = vm.dayvalue[1];
            vm.model.air.setting_wed = vm.dayvalue[2];
            vm.model.air.setting_thu = vm.dayvalue[3];
            vm.model.air.setting_fri = vm.dayvalue[4];
            vm.model.air.setting_sat = vm.dayvalue[5];
            vm.model.air.setting_sun = vm.dayvalue[6];
            break;
          case "soil":
            vm.model.soil.setting_mon = vm.dayvalue[0];
            vm.model.soil.setting_tue = vm.dayvalue[1];
            vm.model.soil.setting_wed = vm.dayvalue[2];
            vm.model.soil.setting_thu = vm.dayvalue[3];
            vm.model.soil.setting_fri = vm.dayvalue[4];
            vm.model.soil.setting_sat = vm.dayvalue[5];
            vm.model.soil.setting_sun = vm.dayvalue[6];
            break;
        }
      };
      vm.daysetting = function (e) {
        $scope.modal.show();
        $scope.DayBase = e;
        switch (e) {
          case "temp":
            vm.dayvalue = [
              parseInt(vm.model.temp.setting_mon),
              parseInt(vm.model.temp.setting_tue),
              parseInt(vm.model.temp.setting_wed),
              parseInt(vm.model.temp.setting_thu),
              parseInt(vm.model.temp.setting_fri),
              parseInt(vm.model.temp.setting_sat),
              parseInt(vm.model.temp.setting_sun),
            ];
            break;
          case "air":
            vm.dayvalue = [
              parseInt(vm.model.air.setting_mon),
              parseInt(vm.model.air.setting_tue),
              parseInt(vm.model.air.setting_wed),
              parseInt(vm.model.air.setting_thu),
              parseInt(vm.model.air.setting_fri),
              parseInt(vm.model.air.setting_sat),
              parseInt(vm.model.air.setting_sun),
            ];
            break;
          case "soil":
            vm.dayvalue = [
              parseInt(vm.model.soil.setting_mon),
              parseInt(vm.model.soil.setting_tue),
              parseInt(vm.model.soil.setting_wed),
              parseInt(vm.model.soil.setting_thu),
              parseInt(vm.model.soil.setting_fri),
              parseInt(vm.model.soil.setting_sat),
              parseInt(vm.model.soil.setting_sun),
            ];

            //console.log(vm.dayvalue)
            break;
        }
      };

      let platform = ionic.Platform.platform();

      vm.pickdate = function (e) {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_date_start = data;
                  break;

                case "air":
                  vm.model.air.setting_date_start = data;

                  break;
                case "soil":
                  vm.model.soil.setting_date_start = data;

                  break;
              }
            });
          });
        } else {
          $scope.data = {};

          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            switch (e) {
              case "temp":
                vm.model.temp.setting_date_start = res;
                break;

              case "air":
                vm.model.air.setting_date_start = res;

                break;
              case "soil":
                vm.model.soil.setting_date_start = res;

                break;
            }
          });
        }
      };

      vm.pickdateto = function (e) {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_date_end = data;
                  break;

                case "air":
                  vm.model.air.setting_date_end = data;

                  break;
                case "soil":
                  vm.model.soil.setting_date_end = data;

                  break;
              }
            });
          });
        } else {
          $scope.data = {};

          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            switch (e) {
              case "temp":
                vm.model.temp.setting_date_end = res;
                break;

              case "air":
                vm.model.air.setting_date_end = res;

                break;
              case "soil":
                vm.model.soil.setting_date_end = res;

                break;
            }
          });
        }
      };

      vm.check = [
        function () {
          if (vm.model.temp) {
            if (
              (!vm.model.temp.setting_temp_value &&
                !vm.model.temp.setting_time_value) ||
              !vm.model.temp.setting_active
            ) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        },
        function () {
          if (vm.model.air) {
            if (
              ((!vm.model.air.setting_temp_value ||
                !vm.model.air.setting_temp_value2) &&
                !vm.model.air.setting_time_value) ||
              !vm.model.air.setting_active
            ) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        },
        function () {
          if (vm.model.soil) {
            if (
              (!vm.model.soil.setting_temp_value &&
                !vm.model.soil.setting_time_value) ||
              (vm.model.soil.setting_temp_value == " " &&
                vm.model.soil.setting_time_value == " ") ||
              !vm.model.soil.setting_active
            ) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        },
      ];

      vm.save3 = function () {
        let item;
        if (vm.settingClock.setting_type == "SOILMOISTURE") {
          item = vm.model.soil;
        } else if (vm.settingClock.setting_type == "AIRMOISTURE") {
          item = vm.model.air;
        }

        $ionicLoading.show();
        let url = $rootScope.ip + "setting.php";
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "updateSettingSoil",
          setting: item,
          global: $rootScope.global,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 6000);
        $http
          .post(url, req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              $ionicLoading.hide();

              //console.log(response.data);

              $ionicHistory.clearCache().then(function () {
                $ionicHistory.goBack();
              });
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
      };

      vm.picktime = function (e) {
        //console.log(e);
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.picktime();
            k.then(function suss(data) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_time_value = data.substring(0, 5);
                  break;

                case "air":
                  vm.model.air.setting_time_value = data.substring(0, 5);

                  break;
                case "soil":
                  vm.model.soil.setting_time_value = data.substring(0, 5);
                  break;
              }

              // vm.time = data.substring(0, 5);
            });
          });
        } else {
          $scope.data = {};

          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 20:20",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            if (res) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_time_value = res;
                  break;

                case "air":
                  vm.model.air.setting_time_value = res;
                  break;
                case "soil":
                  vm.model.soil.setting_time_value = res;
                  break;
              }
            }
          });
        }
      };

      vm.deleteClock = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .textContent("ต้องการลบการตั้งค่านี้หรือไม่ ?")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            $ionicLoading.show();
            let url = $rootScope.ip + "setting.php";
            let req = {
              mode: "deleteClock",
              setting: vm.settingClock,
              global: $rootScope.global,
            };

            $http.post(url, req).then(
              function (response) {
                if (response.data.status == true) {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message: "ลบการตั้งค่าเรียบร้อยแล้ว",
                    callback: function () {
                      $ionicHistory.goBack();
                    },
                  });
                } else {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message: "ไม่สามารถลบการตั้งค่านี้ได้",
                    callback: function () {},
                  });
                }
                $ionicLoading.hide();
              },
              function err(err) {
                $ionicLoading.hide();
              }
            );
          },
          function () {
            //console.log("2");
          }
        );
      };

      vm.airValue1Change = function () {
        //console.log(vm.airValueToggle.val1)
        if (vm.airValueToggle.val1 == 0) {
          vm.model.air.setting_temp_value = 0;
        }
      };
      vm.airValue2Change = function () {
        //console.log(vm.airValueToggle.val1)
        if (vm.airValueToggle.val2 == 0) {
          vm.model.air.setting_temp_value2 = 0;
        }
      };
    }
  )

  .controller("dayssettingCtrl", function ($scope, $state) {
    let vm = this;
    vm.days = [
      {
        day: "วันจันทร์",
        value: true,
      },
      {
        day: "วันอังคาร",
        value: true,
      },
      {
        day: "วันพุธ",
        value: true,
      },
      {
        day: "วันพฤหัสบดี",
        value: true,
      },
      {
        day: "วันศุกร์",
        value: true,
      },
      {
        day: "วันเสาร์",
        value: false,
      },
      {
        day: "วันอาทิตย์",
        value: false,
      },
    ];
  })

  .controller(
    "setting3Ctrl",
    function (
      $rootScope,
      $ionicLoading,
      $timeout,
      $http,
      $ionicPopup,
      Service,
      $scope,
      $state,
      $ionicModal,
      $ionicScrollDelegate,
      $stateParams,
      $mdDialog,
      $log,
      $q,
      $ionicHistory
    ) {
      let vm = this;
      vm.iotno = $stateParams.iotno;
      vm.type = $stateParams.type;
      vm.ac = $stateParams.ac;

      $scope.model = {
        status: false,
      };

      vm.model = {
        temp: {
          setting_id: null,
          setting_type: "TEMPERATURE",
          setting_desc: null,
          setting_status: null,
          setting_date_start: null,
          setting_date_end: null,
          setting_time_status: 1,
          setting_time_value: null,
          setting_temp_status: 0,
          setting_temp_value: 0,
          setting_temp_value2: 0,
          setting_active: 0,
          setting_mon: 0,
          setting_tue: 0,
          setting_wed: 0,
          setting_thu: 0,
          setting_fri: 0,
          setting_sat: 0,
          setting_sun: 0,
        },
        air: {
          setting_id: null,
          setting_type: "AIRMOISTURE",
          setting_desc: null,
          setting_status: null,
          setting_date_start: null,
          setting_date_end: null,
          setting_time_status: 1,
          setting_time_value: null,
          setting_temp_status: 0,
          setting_temp_value: 0,
          setting_temp_value2: 0,
          setting_active: 0,
          setting_mon: 0,
          setting_tue: 0,
          setting_wed: 0,
          setting_thu: 0,
          setting_fri: 0,
          setting_sat: 0,
          setting_sun: 0,
        },
        soil: {
          setting_id: null,
          setting_type: "SOILMOISTURE",
          setting_desc: null,
          setting_status: null,
          setting_date_start: null,
          setting_date_end: null,
          setting_time_status: 1,
          setting_time_value: null,
          setting_temp_status: 0,
          setting_temp_value: 0,
          setting_temp_value2: 0,
          setting_active: 0,
          setting_mon: 0,
          setting_tue: 0,
          setting_wed: 0,
          setting_thu: 0,
          setting_fri: 0,
          setting_sat: 0,
          setting_sun: 0,
        },
      };

      vm.dayvalue = [0, 0, 0, 0, 0, 0, 0];
      $scope.toggle = {
        meter1: false,
      };

      vm.days = [
        {
          day: "วันจันทร์",
          value: 0,
        },
        {
          day: "วันอังคาร",
          value: 0,
        },
        {
          day: "วันพุธ",
          value: 0,
        },
        {
          day: "วันพฤหัสบดี",
          value: 0,
        },
        {
          day: "วันศุกร์",
          value: 0,
        },
        {
          day: "วันเสาร์",
          value: 0,
        },
        {
          day: "วันอาทิตย์",
          value: 0,
        },
      ];

      $ionicModal
        .fromTemplateUrl("my-day.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modal = modal;
        });

      $scope.openModal = function () {
        $scope.modal.show();
      };
      $scope.closeModal = function () {
        $scope.modal.hide();
      };

      $scope.$on("$destroy", function () {
        $scope.modal.remove();
      });

      // //console.log(vm.model);

      vm.toggleChange = function () {
        $ionicScrollDelegate.resize();
      };

      vm.modeChange = function (e) {
        //console.log(e);
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.temp.setting_temp_value = 0;
              vm.model.temp.setting_temp_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              //  $scope.toggle.mode2 = true;
              vm.model.temp.setting_time_value = null;
              vm.model.temp.setting_temp_status = 1;
            }, 500);

            break;
        }
        // $ionicScrollDelegate.resize();

        //console.log(vm.model.temp);
      };

      vm.mode2Change = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.temp.setting_time_value = null;
              vm.model.temp.setting_time_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.temp.setting_temp_value = 0;
              vm.model.temp.setting_time_status = 1;
            }, 500);
            break;
        }
        // $ionicScrollDelegate.resize();
      };

      vm.soilmodeChange = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.soil.setting_temp_value = 0;
              vm.model.soil.setting_temp_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              //  $scope.toggle.mode2 = true;
              vm.model.soil.setting_time_value = null;
              vm.model.soil.setting_temp_status = 1;
            }, 500);

            break;
        }
        // $ionicScrollDelegate.resize();

        //console.log(vm.model.soil);
      };

      vm.soilmode2Change = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.soil.setting_time_value = null;
              vm.model.soil.setting_time_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.soil.setting_temp_value = 0;
              vm.model.soil.setting_time_status = 1;
            }, 500);
            break;
        }
        // $ionicScrollDelegate.resize();
      };

      vm.airlmodeChange = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.air.setting_temp_value = 0;
              vm.model.air.setting_temp_value2 = 0;
              vm.model.air.setting_temp_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              //  $scope.toggle.mode2 = true;
              vm.model.air.setting_time_value = null;
              vm.model.air.setting_temp_status = 1;
            }, 500);

            break;
        }
        // $ionicScrollDelegate.resize();

        //console.log(vm.model.air);
      };

      vm.airmode2Change = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.air.setting_time_value = null;
              vm.model.air.setting_time_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.air.setting_temp_value = 0;
              vm.model.air.setting_temp_value = 0;
              vm.model.air.setting_time_status = 1;
            }, 500);
            break;
        }
        // $ionicScrollDelegate.resize();
      };

      $scope.test = function (e) {
        switch ($scope.DayBase) {
          case "temp":
            vm.model.temp.setting_mon = vm.dayvalue[0];
            vm.model.temp.setting_tue = vm.dayvalue[1];
            vm.model.temp.setting_wed = vm.dayvalue[2];
            vm.model.temp.setting_thu = vm.dayvalue[3];
            vm.model.temp.setting_fri = vm.dayvalue[4];
            vm.model.temp.setting_sat = vm.dayvalue[5];
            vm.model.temp.setting_sun = vm.dayvalue[6];
            break;
          case "air":
            vm.model.air.setting_mon = vm.dayvalue[0];
            vm.model.air.setting_tue = vm.dayvalue[1];
            vm.model.air.setting_wed = vm.dayvalue[2];
            vm.model.air.setting_thu = vm.dayvalue[3];
            vm.model.air.setting_fri = vm.dayvalue[4];
            vm.model.air.setting_sat = vm.dayvalue[5];
            vm.model.air.setting_sun = vm.dayvalue[6];
            break;
          case "soil":
            vm.model.soil.setting_mon = vm.dayvalue[0];
            vm.model.soil.setting_tue = vm.dayvalue[1];
            vm.model.soil.setting_wed = vm.dayvalue[2];
            vm.model.soil.setting_thu = vm.dayvalue[3];
            vm.model.soil.setting_fri = vm.dayvalue[4];
            vm.model.soil.setting_sat = vm.dayvalue[5];
            vm.model.soil.setting_sun = vm.dayvalue[6];
            break;
        }
      };

      vm.daysetting = function (e) {
        $scope.modal.show();
        $scope.DayBase = e;
        switch (e) {
          case "temp":
            vm.dayvalue = [
              vm.model.temp.setting_mon,
              vm.model.temp.setting_tue,
              vm.model.temp.setting_wed,
              vm.model.temp.setting_thu,
              vm.model.temp.setting_fri,
              vm.model.temp.setting_sat,
              vm.model.temp.setting_sun,
            ];
            break;
          case "air":
            vm.dayvalue = [
              vm.model.air.setting_mon,
              vm.model.air.setting_tue,
              vm.model.air.setting_wed,
              vm.model.air.setting_thu,
              vm.model.air.setting_fri,
              vm.model.air.setting_sat,
              vm.model.air.setting_sun,
            ];
            break;
          case "soil":
            vm.dayvalue = [
              vm.model.soil.setting_mon,
              vm.model.soil.setting_tue,
              vm.model.soil.setting_wed,
              vm.model.soil.setting_thu,
              vm.model.soil.setting_fri,
              vm.model.soil.setting_sat,
              vm.model.soil.setting_sun,
            ];
            break;
        }
      };

      let platform = ionic.Platform.platform();

      vm.pickdate = function (e) {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_date_start = data;
                  break;

                case "air":
                  vm.model.air.setting_date_start = data;

                  break;
                case "soil":
                  vm.model.soil.setting_date_start = data;

                  break;
              }
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    //console.log(1);
                    e.preventDefault();
                  } else {
                    //console.log(2);
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            switch (e) {
              case "temp":
                vm.model.temp.setting_date_start = res;
                break;

              case "air":
                vm.model.air.setting_date_start = res;

                break;
              case "soil":
                vm.model.soil.setting_date_start = res;

                break;
            }
          });
        }
      };

      vm.pickdateto = function (e) {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_date_end = data;
                  break;

                case "air":
                  vm.model.air.setting_date_end = data;

                  break;
                case "soil":
                  vm.model.soil.setting_date_end = data;

                  break;
              }
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            switch (e) {
              case "temp":
                vm.model.temp.setting_date_end = res;
                break;

              case "air":
                vm.model.air.setting_date_end = res;

                break;
              case "soil":
                vm.model.soil.setting_date_end = res;

                break;
            }
          });
        }
      };

      vm.check = [
        function () {
          if (vm.model.temp) {
            if (
              (!vm.model.temp.setting_temp_value &&
                !vm.model.temp.setting_time_value) ||
              !vm.model.temp.setting_active
            ) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        },
        function () {
          if (vm.model.air) {
            if (
              ((!vm.model.air.setting_temp_value ||
                !vm.model.air.setting_temp_value2) &&
                !vm.model.air.setting_time_value) ||
              !vm.model.air.setting_active
            ) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        },
        function () {
          if (vm.model.soil) {
            if (
              (!vm.model.soil.setting_temp_value &&
                !vm.model.soil.setting_time_value) ||
              (vm.model.soil.setting_temp_value == " " &&
                vm.model.soil.setting_time_value == " ") ||
              !vm.model.soil.setting_active ||
              !vm.model.soil.setting_date_start ||
              !vm.model.soil.setting_date_end
            ) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        },
      ];
      //console.log(vm.check);

      vm.save3 = function () {
        $ionicLoading.show();
        let url = $rootScope.ip + "setting.php";
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "tempPutsetting",
          setting: vm.model.soil,
          days: vm.days,
          iotno: vm.iotno,
          global: $rootScope.global,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 6000);
        $http
          .post(url, req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              if (response.data.status == true) {
                $ionicHistory.goBack();
              } else {
                Service.timeout();
              }

              $ionicLoading.hide();

              //console.log(response.data);
            },
            function err(err) {
              //console.log(err);
              Service.timeout();
              $ionicLoading.hide();
            }
          );
      };

      vm.picktime = function (e) {
        //console.log(e);
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.picktime();
            k.then(function suss(data) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_time_value = data.substring(0, 5);
                  break;

                case "air":
                  vm.model.air.setting_time_value = data.substring(0, 5);

                  break;
                case "soil":
                  vm.model.soil.setting_time_value = data.substring(0, 5);
                  break;
              }

              // vm.time = data.substring(0, 5);
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 20:20",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            if (res) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_time_value = res;
                  break;

                case "air":
                  vm.model.air.setting_time_value = res;
                  break;
                case "soil":
                  vm.model.soil.setting_time_value = res;
                  break;
              }
            }
          });
        }
      };
    }
  )

  .controller(
    "setting4Ctrl",
    function (
      $rootScope,
      $ionicLoading,
      $timeout,
      $http,
      $ionicPopup,
      Service,
      $scope,
      $state,
      $ionicModal,
      $ionicScrollDelegate,
      $stateParams,
      $mdDialog,
      $log,
      $q,
      $ionicHistory
    ) {
      let vm = this;
      vm.iotno = $stateParams.iotno;
      vm.type = $stateParams.type;
      vm.ac = $stateParams.ac;

      $scope.model = {
        status: false,
      };

      vm.model = {
        temp: {
          setting_id: null,
          setting_type: "TEMPERATURE",
          setting_desc: null,
          setting_status: null,
          setting_date_start: null,
          setting_date_end: null,
          setting_time_status: 1,
          setting_time_value: null,
          setting_temp_status: 0,
          setting_temp_value: 0,
          setting_temp_value2: 0,
          setting_active: 0,
          setting_mon: 0,
          setting_tue: 0,
          setting_wed: 0,
          setting_thu: 0,
          setting_fri: 0,
          setting_sat: 0,
          setting_sun: 0,
        },
        air: {
          setting_id: null,
          setting_type: "AIRMOISTURE",
          setting_desc: null,
          setting_status: null,
          setting_date_start: null,
          setting_date_end: null,
          setting_time_status: 1,
          setting_time_value: null,
          setting_temp_status: 0,
          setting_temp_value: 0,
          setting_temp_value2: 0,
          setting_active: 0,
          setting_mon: 0,
          setting_tue: 0,
          setting_wed: 0,
          setting_thu: 0,
          setting_fri: 0,
          setting_sat: 0,
          setting_sun: 0,
        },
        soil: {
          setting_id: null,
          setting_type: "SOILMOISTURE",
          setting_desc: null,
          setting_status: null,
          setting_date_start: null,
          setting_date_end: null,
          setting_time_status: 1,
          setting_time_value: null,
          setting_temp_status: 0,
          setting_temp_value: 0,
          setting_temp_value2: 0,
          setting_active: 0,
          setting_mon: 0,
          setting_tue: 0,
          setting_wed: 0,
          setting_thu: 0,
          setting_fri: 0,
          setting_sat: 0,
          setting_sun: 0,
        },
      };

      vm.dayvalue = [0, 0, 0, 0, 0, 0, 0];
      $scope.toggle = {
        meter1: false,
      };

      vm.days = [
        {
          day: "วันจันทร์",
          value: 0,
        },
        {
          day: "วันอังคาร",
          value: 0,
        },
        {
          day: "วันพุธ",
          value: 0,
        },
        {
          day: "วันพฤหัสบดี",
          value: 0,
        },
        {
          day: "วันศุกร์",
          value: 0,
        },
        {
          day: "วันเสาร์",
          value: 0,
        },
        {
          day: "วันอาทิตย์",
          value: 0,
        },
      ];

      $ionicModal
        .fromTemplateUrl("my-day.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modal = modal;
        });

      $scope.openModal = function () {
        $scope.modal.show();
      };
      $scope.closeModal = function () {
        $scope.modal.hide();
      };

      $scope.$on("$destroy", function () {
        $scope.modal.remove();
      });

      // //console.log(vm.model);

      vm.toggleChange = function () {
        $ionicScrollDelegate.resize();
      };

      vm.modeChange = function (e) {
        //console.log(e);
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.temp.setting_temp_value = 0;
              vm.model.temp.setting_temp_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              //  $scope.toggle.mode2 = true;
              vm.model.temp.setting_time_value = null;
              vm.model.temp.setting_temp_status = 1;
            }, 500);

            break;
        }
        // $ionicScrollDelegate.resize();

        //console.log(vm.model.temp);
      };

      vm.mode2Change = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.temp.setting_time_value = null;
              vm.model.temp.setting_time_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.temp.setting_temp_value = 0;
              vm.model.temp.setting_time_status = 1;
            }, 500);
            break;
        }
        // $ionicScrollDelegate.resize();
      };

      vm.soilmodeChange = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.soil.setting_temp_value = 0;
              vm.model.soil.setting_temp_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              //  $scope.toggle.mode2 = true;
              vm.model.soil.setting_time_value = null;
              vm.model.soil.setting_temp_status = 1;
            }, 500);

            break;
        }
        // $ionicScrollDelegate.resize();

        //console.log(vm.model.soil);
      };

      vm.soilmode2Change = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.soil.setting_time_value = null;
              vm.model.soil.setting_time_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.soil.setting_temp_value = 0;
              vm.model.soil.setting_time_status = 1;
            }, 500);
            break;
        }
        // $ionicScrollDelegate.resize();
      };

      vm.airlmodeChange = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.air.setting_temp_value = 0;
              vm.model.air.setting_temp_value2 = 0;
              vm.model.air.setting_temp_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              //  $scope.toggle.mode2 = true;
              vm.model.air.setting_time_value = null;
              vm.model.air.setting_temp_status = 1;
            }, 500);

            break;
        }
        // $ionicScrollDelegate.resize();

        //console.log(vm.model.air);
      };

      vm.airmode2Change = function (e) {
        switch (e) {
          case 1:
            $timeout(function () {
              vm.model.air.setting_time_value = null;
              vm.model.air.setting_time_status = 0;
            }, 500);

            break;
          case 0:
            $timeout(function () {
              vm.model.air.setting_temp_value = 0;
              vm.model.air.setting_temp_value = 0;
              vm.model.air.setting_time_status = 1;
            }, 500);
            break;
        }
        // $ionicScrollDelegate.resize();
      };

      $scope.test = function (e) {
        switch ($scope.DayBase) {
          case "temp":
            vm.model.temp.setting_mon = vm.dayvalue[0];
            vm.model.temp.setting_tue = vm.dayvalue[1];
            vm.model.temp.setting_wed = vm.dayvalue[2];
            vm.model.temp.setting_thu = vm.dayvalue[3];
            vm.model.temp.setting_fri = vm.dayvalue[4];
            vm.model.temp.setting_sat = vm.dayvalue[5];
            vm.model.temp.setting_sun = vm.dayvalue[6];
            break;
          case "air":
            vm.model.air.setting_mon = vm.dayvalue[0];
            vm.model.air.setting_tue = vm.dayvalue[1];
            vm.model.air.setting_wed = vm.dayvalue[2];
            vm.model.air.setting_thu = vm.dayvalue[3];
            vm.model.air.setting_fri = vm.dayvalue[4];
            vm.model.air.setting_sat = vm.dayvalue[5];
            vm.model.air.setting_sun = vm.dayvalue[6];
            break;
          case "soil":
            vm.model.soil.setting_mon = vm.dayvalue[0];
            vm.model.soil.setting_tue = vm.dayvalue[1];
            vm.model.soil.setting_wed = vm.dayvalue[2];
            vm.model.soil.setting_thu = vm.dayvalue[3];
            vm.model.soil.setting_fri = vm.dayvalue[4];
            vm.model.soil.setting_sat = vm.dayvalue[5];
            vm.model.soil.setting_sun = vm.dayvalue[6];
            break;
        }
      };

      vm.daysetting = function (e) {
        $scope.modal.show();
        $scope.DayBase = e;
        switch (e) {
          case "temp":
            vm.dayvalue = [
              vm.model.temp.setting_mon,
              vm.model.temp.setting_tue,
              vm.model.temp.setting_wed,
              vm.model.temp.setting_thu,
              vm.model.temp.setting_fri,
              vm.model.temp.setting_sat,
              vm.model.temp.setting_sun,
            ];
            break;
          case "air":
            vm.dayvalue = [
              vm.model.air.setting_mon,
              vm.model.air.setting_tue,
              vm.model.air.setting_wed,
              vm.model.air.setting_thu,
              vm.model.air.setting_fri,
              vm.model.air.setting_sat,
              vm.model.air.setting_sun,
            ];
            break;
          case "soil":
            vm.dayvalue = [
              vm.model.soil.setting_mon,
              vm.model.soil.setting_tue,
              vm.model.soil.setting_wed,
              vm.model.soil.setting_thu,
              vm.model.soil.setting_fri,
              vm.model.soil.setting_sat,
              vm.model.soil.setting_sun,
            ];
            break;
        }
      };

      let platform = ionic.Platform.platform();

      vm.pickdate = function (e) {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_date_start = data;
                  break;

                case "air":
                  vm.model.air.setting_date_start = data;

                  break;
                case "soil":
                  vm.model.soil.setting_date_start = data;

                  break;
              }
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    //console.log(1);
                    e.preventDefault();
                  } else {
                    //console.log(2);
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            switch (e) {
              case "temp":
                vm.model.temp.setting_date_start = res;
                break;

              case "air":
                vm.model.air.setting_date_start = res;

                break;
              case "soil":
                vm.model.soil.setting_date_start = res;

                break;
            }
          });
        }
      };

      vm.pickdateto = function (e) {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_date_end = data;
                  break;

                case "air":
                  vm.model.air.setting_date_end = data;

                  break;
                case "soil":
                  vm.model.soil.setting_date_end = data;

                  break;
              }
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            switch (e) {
              case "temp":
                vm.model.temp.setting_date_end = res;
                break;

              case "air":
                vm.model.air.setting_date_end = res;

                break;
              case "soil":
                vm.model.soil.setting_date_end = res;

                break;
            }
          });
        }
      };

      vm.check = [
        function () {
          if (vm.model.temp) {
            if (
              (!vm.model.temp.setting_temp_value &&
                !vm.model.temp.setting_time_value) ||
              !vm.model.temp.setting_active
            ) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        },
        function () {
          if (vm.model.air) {
            if (
              ((!vm.model.air.setting_temp_value ||
                !vm.model.air.setting_temp_value2) &&
                !vm.model.air.setting_time_value) ||
              !vm.model.air.setting_active ||
              !vm.model.air.setting_date_start ||
              !vm.model.air.setting_date_end
            ) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        },
        function () {
          if (vm.model.soil) {
            if (
              (!vm.model.soil.setting_temp_value &&
                !vm.model.soil.setting_time_value) ||
              (vm.model.soil.setting_temp_value == " " &&
                vm.model.soil.setting_time_value == " ") ||
              !vm.model.soil.setting_active
            ) {
              return true;
            } else {
              return false;
            }
          } else {
          }
        },
      ];

      vm.picktime = function (e) {
        //console.log(e);
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.picktime();
            k.then(function suss(data) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_time_value = data.substring(0, 5);
                  break;

                case "air":
                  vm.model.air.setting_time_value = data.substring(0, 5);

                  break;
                case "soil":
                  vm.model.soil.setting_time_value = data.substring(0, 5);
                  break;
              }

              // vm.time = data.substring(0, 5);
            });
          });
        } else {
          $scope.data = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.date">',
            title: "Enter Date Ex 20:20",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.data.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.data.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            if (res) {
              switch (e) {
                case "temp":
                  vm.model.temp.setting_time_value = res;
                  break;

                case "air":
                  vm.model.air.setting_time_value = res;
                  break;
                case "soil":
                  vm.model.soil.setting_time_value = res;
                  break;
              }
            }
          });
        }
      };

      vm.save2 = function () {
        $ionicLoading.show();
        let url = $rootScope.ip + "setting.php";
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "tempPutsetting",
          setting: vm.model.air,
          days: vm.days,
          iotno: vm.iotno,
          global: $rootScope.global,
        };
        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 6000);
        $http
          .post(url, req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              if (response.data.status == true) {
                $ionicHistory.goBack();
              } else {
                Service.timeout();
              }

              $ionicLoading.hide();

              //console.log(response.data);
            },
            function err(err) {
              Service.timeout();
              $ionicLoading.hide();
            }
          );
      };
    }
  );
