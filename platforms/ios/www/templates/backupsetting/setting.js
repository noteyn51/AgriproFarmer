angular
  .module("app")

  .controller("setting0Ctrl", function(
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
    $mdDialog,
    $log,
    $q,
    $ionicPlatform,
     $ionicHistory
  ) {
    let vm = this;

    vm.back = function(){
      $ionicHistory.nextViewOptions({
    disableBack: true
  });
      $state.go('app.farmerMenu')
    }

    vm.colorBat = function(e) {
      let color;
      $scope.batteryLevel = e;
      if ($scope.batteryLevel > 30) {
        color = "#33cd5f";
      } else if ($scope.batteryLevel > 10) {
        color = "yellow";
      } else if ($scope.batteryLevel >= 0) {
        color = "red";
      }

      $scope.mybattery = {
        width: $scope.batteryLevel + "%",
        margin: "4px",
        "background-color": color,
        "border-radius": "8px",
        color: "black",
        "font-weight": "bold"
      };
    };

    vm.colorBat(100);

    //  $rootScope.$on("$cordovaBatteryStatus:status", function (event, args) {
    //     console.log(args);
    //     $scope.batteryLevel = args.level;
    //     console.log($scope.batteryLevel);
    //     $scope.isPluggedIn = args.isPlugged;
    //     console.log($scope.isPluggedIn);
    // });
    // $rootScope.$on('$cordovaBatteryStatus:critical', function (event, args) {
    //     $scope.batteryLevel = args.level;       // (0 - 100)
    //     $scope.isPluggedIn  = args.isPlugged;   // bool
    // });

    // $rootScope.$on('$cordovaBatteryStatus:low', function (event, args) {
    //     $scope.batteryLevel = args.level;       // (0 - 100)
    //     $scope.isPluggedIn  = args.isPlugged;   // bool
    // });

    var alert;
    $scope.showDialog = function($event) {
      mobiscroll.alert({
        title: "Would",
        message: "",
        callback: function() {
          mobiscroll.toast({
            message: "Alert closed"
          });
        }
      });
    };

    $scope.edit = { farm: null };

    function onStart() {
      $ionicLoading.show();
      let url = $rootScope.ip + "setting.php";
      let cancellerLoadpic = $q.defer();
      let req = { mode: "iotmaplist", global: $rootScope.global };
      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 10000);
      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          console.log(response.data);
          if (response.data.status == true) {
            vm.status = true;
            $scope.data = response.data;

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

    onStart();

    vm.refresh = function() {
      onStart();
    };

    $ionicModal
      .fromTemplateUrl("templates/modal/my-dayss.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modalSS = modal;
      });

    $scope.openModal = function() {
      $scope.modalSS.show();
    };
    $scope.closeModal = function() {
      $scope.modalSS.hide();
    };

    $scope.openModalAc = function(x) {
      $scope.modalSS.show();
      vm.edit = x;

      console.log(x);
      // $ionicLoading.show();
      // let url = $rootScope.ip + "setting.php";
      // let req = { mode: "mapiot", global: $rootScope.global, detail: x };
      // $http.post(url, req).then(
      //   function suscess(response) {
      //     console.log(response.data);
      //     $scope.modal.show();
      //     if (response.data.status == true) {
      //       vm.edit = x;
      //       vm.select = response.data;
      //       $scope.edit.farm = response.data.selectted;

      //       $ionicLoading.hide();
      //     } else {
      //       $ionicLoading.hide();
      //     }
      //   },
      //   function err(err) {
      //     $ionicLoading.hide();
      //   }
      // );
    };

    $scope.farmChange = function() {
      console.log($scope.edit);
    };

    $scope.save = function() {
      let url = $rootScope.ip + "setting.php";
      let req = { mode: "mapdata", iot: vm.edit, farm: $scope.edit };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response.data);
          if (response.data.status == true) {
            delete $scope.data;
            $timeout(function() {
              $scope.modal.hide();
              onStart();
            }, 500);
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    };

    vm.iot = function(e) {
      console.log(e);
      $state.go("app.setting", { iotno: e.iot_id });
    };
  })

  .controller("settingCtrl", function(
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
    $q
  ) {
    let vm = this;
    vm.iotno = $stateParams.iotno;
    // console.log($stateParams)
    $scope.model = { status: false };

    $scope.manualSoil = function(e) {
      $ionicLoading.show();
      let url = $rootScope.ip + "setting.php";
      let req = {
        mode: "setmanual",
        iotno: vm.iotno,
        detail: e,
        type: "SOILMOISTURE",
        global: $rootScope.global
      };
      console.log(req);
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response.data);
          if (response.data.status == true) {
            onStart();
            // $ionicLoading.hide();
          } else {
            onStart();

            // $ionicLoading.hide();
          }
        },
        function err(err) {
          onStart();

          $ionicLoading.hide();
        }
      );
    };

    $scope.manualAir = function(e) {
      $ionicLoading.show();
      let url = $rootScope.ip + "setting.php";
      let req = {
        mode: "setmanual",
        iotno: vm.iotno,
        detail: e,
        type: "AIRMOISTURE",
        global: $rootScope.global
      };
      console.log(req);

      $http.post(url, req).then(
        function suscess(response) {
          console.log(response.data);
          if (response.data.status == true) {
            $ionicLoading.hide();

            onStart();
            // $ionicLoading.hide();
          } else {
            $ionicLoading.hide();

            onStart();

            // $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
          onStart();
        }
      );
    };

    $scope.auto = function(e) {
      $ionicLoading.show();
      let url = $rootScope.ip + "setting.php";
      let req = {
        mode: "auto",
        iotno: vm.iotno,
        detail: e,
        type: "AIRMOISTURE",
        global: $rootScope.global,
        detail: e
      };
      console.log(req);

      $http.post(url, req).then(
        function suscess(response) {
          console.log(response.data);
          if (response.data.status == true) {
            onStart();
            // $ionicLoading.hide();
          } else {
            // $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
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
        setting_sun: 0
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
        setting_sun: 0
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
        setting_sun: 0
      }
    };

    vm.dayvalue = [0, 0, 0, 0, 0, 0, 0];
    $scope.toggle = { meter1: false };

    // let cancellerLoadpic = $q.defer();
    // { timeout: cancellerLoadpic.promise;}

    // $timeout(function() {
    //   cancellerLoadpic.resolve("user cancelled");
    // }, 10000);

    function onStart() {
      $ionicLoading.show();
      let cancellerLoadpic = $q.defer();
      let url = $rootScope.ip + "setting.php";
      let req = {
        mode: "getSetting",
        iotno: vm.iotno,
        global: $rootScope.global
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 10000);

      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          console.log(response.data);
          vm.statusfinal = response.data.statusfinal;

          if (response.data.statusfinal != false) {
            if (response.data.result.temp) {
              vm.model.temp = response.data.result.temp;
            } else {
              angular.merge(vm.model.temp, { sss: false });
            }
            if (response.data.result.soil) {
              vm.model.soil = response.data.result.soil;
            } else {
              angular.merge(vm.model.soil, { sss: false });
            }
            if (response.data.result.air) {
              vm.model.air = response.data.result.air;
            } else {
              angular.merge(vm.model.air, { sss: false });
            }

            console.log(vm.model);

            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
            mobiscroll.snackbar({
              message: "เกิดข้อผิดพลาด หมดเวลาในการเชื่อมต่อลองใหม่อีกครั้ง",
              duration: 8000,
              button: {
                text: "ลองอีกครั้ง",
                action: function() {
                  onStart();
                }
              }
            });
          }
        },
        function err(err) {
          vm.statusfinal = false;
          $ionicLoading.hide();
          console.log(err);

          mobiscroll.snackbar({
            message: "เกิดข้อผิดพลาด หมดเวลาในการเชื่อมต่อลองใหม่อีกครั้ง",
            duration: 8000,
            button: {
              text: "ลองอีกครั้ง",
              action: function() {
                onStart();
              }
            }
          });
        }
      );
    }

    onStart();
    vm.refresh = function() {
      onStart();
    };

    vm.days = [
      { day: "วันจันทร์", value: 0 },
      { day: "วันอังคาร", value: 0 },
      { day: "วันพุธ", value: 0 },
      { day: "วันพฤหัสบดี", value: 0 },
      { day: "วันศุกร์", value: 0 },
      { day: "วันเสาร์", value: 0 },
      { day: "วันอาทิตย์", value: 0 }
    ];

    $ionicModal
      .fromTemplateUrl("my-day.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on("$destroy", function() {
      $scope.modal.remove();
    });

    // console.log(vm.model);

    vm.toggleChange = function() {
      $ionicScrollDelegate.resize();
    };

    vm.modeChange = function(e) {
      console.log(e);
      switch (e) {
        case 1:
          $timeout(function() {
            vm.model.temp.setting_temp_value = 0;
            vm.model.temp.setting_temp_status = 0;
          }, 500);

          break;
        case 0:
          $timeout(function() {
            //  $scope.toggle.mode2 = true;
            vm.model.temp.setting_time_value = null;
            vm.model.temp.setting_temp_status = 1;
          }, 500);

          break;
      }
      // $ionicScrollDelegate.resize();

      console.log(vm.model.temp);
    };

    vm.mode2Change = function(e) {
      switch (e) {
        case 1:
          $timeout(function() {
            vm.model.temp.setting_time_value = null;
            vm.model.temp.setting_time_status = 0;
          }, 500);

          break;
        case 0:
          $timeout(function() {
            vm.model.temp.setting_temp_value = 0;
            vm.model.temp.setting_time_status = 1;
          }, 500);
          break;
      }
      // $ionicScrollDelegate.resize();
    };

    vm.soilmodeChange = function(e) {
      switch (e) {
        case 1:
          $timeout(function() {
            vm.model.soil.setting_temp_value = 0;
            vm.model.soil.setting_temp_status = 0;
          }, 500);

          break;
        case 0:
          $timeout(function() {
            //  $scope.toggle.mode2 = true;
            vm.model.soil.setting_time_value = null;
            vm.model.soil.setting_temp_status = 1;
          }, 500);

          break;
      }
      // $ionicScrollDelegate.resize();

      console.log(vm.model.soil);
    };

    vm.soilmode2Change = function(e) {
      switch (e) {
        case 1:
          $timeout(function() {
            vm.model.soil.setting_time_value = null;
            vm.model.soil.setting_time_status = 0;
          }, 500);

          break;
        case 0:
          $timeout(function() {
            vm.model.soil.setting_temp_value = 0;
            vm.model.soil.setting_time_status = 1;
          }, 500);
          break;
      }
      // $ionicScrollDelegate.resize();
    };

    vm.airlmodeChange = function(e) {
      switch (e) {
        case 1:
          $timeout(function() {
            vm.model.air.setting_temp_value = 0;
            vm.model.air.setting_temp_value2 = 0;
            vm.model.air.setting_temp_status = 0;
          }, 500);

          break;
        case 0:
          $timeout(function() {
            //  $scope.toggle.mode2 = true;
            vm.model.air.setting_time_value = null;
            vm.model.air.setting_temp_status = 1;
          }, 500);

          break;
      }
      // $ionicScrollDelegate.resize();

      console.log(vm.model.air);
    };

    vm.airmode2Change = function(e) {
      switch (e) {
        case 1:
          $timeout(function() {
            vm.model.air.setting_time_value = null;
            vm.model.air.setting_time_status = 0;
          }, 500);

          break;
        case 0:
          $timeout(function() {
            vm.model.air.setting_temp_value = 0;
            vm.model.air.setting_temp_value = 0;
            vm.model.air.setting_time_status = 1;
          }, 500);
          break;
      }
      // $ionicScrollDelegate.resize();
    };

    $scope.test = function(e) {
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
    vm.daysetting = function(e) {
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
            vm.model.temp.setting_sun
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
            vm.model.air.setting_sun
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
            vm.model.soil.setting_sun
          ];
          break;
      }
    };

    let platform = ionic.Platform.platform();

    vm.pickdate = function(e) {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
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
            { text: "Cancel" },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function(e) {
                if (!$scope.data.date) {
                  //don't allow the user to close unless he enters wifi password
                  console.log(1);
                  e.preventDefault();
                } else {
                  console.log(2);
                  return $scope.data.date;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
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

    vm.pickdateto = function(e) {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
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
            { text: "Cancel" },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function(e) {
                if (!$scope.data.date) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.data.date;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
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
      function() {
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
      function() {
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
      function() {
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
      }
    ];
    console.log(vm.check);

    // vm.save1 = function() {
    //   $ionicLoading.show();
    //   let url = $rootScope.ip + "setting.php";
    //   let req = {
    //     mode: "tempPutsetting",
    //     setting: vm.model.temp,
    //     days: vm.days,
    //     iotno: vm.iotno,
    //     global: $rootScope.global
    //   };
    //   $http.post(url, req).then(
    //     function(response) {
    //       if (response.data.status == true) {
    //         onStart();
    //         $ionicScrollDelegate.resize();
    //         $scope.toggle.meter1 = false;

    //         // mobiscroll.alert({
    //         //   title: "แจ้งเตือน",
    //         //   message: "บันทึกข้อมูลเรียบร้อยแล้ว",
    //         //   callback: function() {}
    //         // });

    //         var confirm = $mdDialog
    //           .confirm()
    //           .title("แจ้งเตือน บันทึกข้อมูลเรียบร้อยแล้ว")
    //           .textContent("บันทึกการตั้งค่าอุณภูมิ & ความชื้นเรียบร้อยแล้ว !!")
    //           .ariaLabel("Lucky day")
    //           .targetEvent()
    //           .ok("ยืนยัน");
    //         // .cancel('Sounds like a scam');

    //         $mdDialog.show(confirm).then(
    //           function() {
    //             console.log("1");
    //           },
    //           function() {
    //             console.log("2");
    //           }
    //         );
    //       } else {
    //       }
    //       $ionicLoading.hide();

    //       console.log(response.data);
    //     },
    //     function err() {
    //       $ionicLoading.hide();
    //     }
    //   );
    // };

    vm.save2 = function() {
      $ionicLoading.show();
      let url = $rootScope.ip + "setting.php";
      let cancellerLoadpic = $q.defer();
      let req = {
        mode: "tempPutsetting",
        setting: vm.model.air,
        days: vm.days,
        iotno: vm.iotno,
        global: $rootScope.global
      };
      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 6000);
      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function(response) {
          if (response.data.status == true) {
            $ionicLoading.hide();
            $timeout(function() {
              onStart();
            }, 1000);
            $ionicScrollDelegate.resize();
            $scope.toggle.meter2 = false;

            var confirm = $mdDialog
              .confirm()
              .title("แจ้งเตือน บันทึกข้อมูลเรียบร้อยแล้ว")
              .textContent("บันทึกการตั้งค่าอุณภูมิ & ความชื้นเรียบร้อยแล้ว !!")
              .ariaLabel("Lucky day")
              .targetEvent()
              .ok("ยืนยัน");
            // .cancel('Sounds like a scam');

            $mdDialog.show(confirm).then(
              function() {
                console.log("1");
              },
              function() {
                console.log("2");
              }
            );
          } else {
            Service.timeout();
            $ionicLoading.hide();
          }
        },
        function err(err) {
          Service.timeout();
          $ionicLoading.hide();
        }
      );
    };

    vm.save3 = function() {
      $ionicLoading.show();
      let url = $rootScope.ip + "setting.php";
      let cancellerLoadpic = $q.defer();
      let req = {
        mode: "tempPutsetting",
        setting: vm.model.soil,
        days: vm.days,
        iotno: vm.iotno,
        global: $rootScope.global
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 6000);
      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function(response) {
          if (response.data.status == true) {
            $ionicScrollDelegate.resize();
            $scope.toggle.meter3 = false;
            $ionicLoading.hide();
            $timeout(function() {
              onStart();
            }, 1000);

            console.log("บันทึกแล้ว");
            var confirm = $mdDialog
              .confirm()
              .title("แจ้งเตือน บันทึกข้อมูลเรียบร้อยแล้ว")
              .textContent("บันทึกการตั้งค่าความชื้นในดินเรียบร้อยแล้ว !!")
              .ariaLabel("Lucky day")
              .targetEvent()
              .ok("ยืนยัน");

            $mdDialog.show(confirm).then(
              function() {
                console.log("1");
              },
              function() {}
            );
          } else {
            Service.timeout();
            $ionicLoading.hide();
          }

          console.log(response.data);
        },
        function err(err) {
          console.log(err);
          Service.timeout();
          $ionicLoading.hide();
        }
      );
    };

    vm.picktime = function(e) {
      console.log(e);
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
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
            { text: "Cancel" },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function(e) {
                if (!$scope.data.date) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.data.date;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
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
  })

  .controller("dayssettingCtrl", function($scope, $state) {
    let vm = this;
    vm.days = [
      { day: "วันจันทร์", value: true },
      { day: "วันอังคาร", value: true },
      { day: "วันพุธ", value: true },
      { day: "วันพฤหัสบดี", value: true },
      { day: "วันศุกร์", value: true },
      { day: "วันเสาร์", value: false },
      { day: "วันอาทิตย์", value: false }
    ];
  });
