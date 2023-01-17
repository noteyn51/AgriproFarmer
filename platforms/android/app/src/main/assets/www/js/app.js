//@prepros-append app.js
//@prepros-append service.js
//@prepros-append ds.js


//@prepros-append controller/navbarCtrl.js
//@prepros-append controller/farmerloginCtrl.js
//@prepros-append controller/farmer/farmerMenu.js
//@prepros-append controller/farmer/area.js
//@prepros-append controller/farmer/add.js
//@prepros-append controller/farmer/createArea.js
//@prepros-append controller/farmer/weather.js
//@prepros-append controller/farmer/news.js
//@prepros-append controller/farmer/dashboard.js
//@prepros-append controller/farmer/detail.js
//@prepros-append controller/farmer/hist.js
//@prepros-append controller/farmer/setting.js
//@prepros-append controller/farmer/newsetting.js
//@prepros-append controller/farmer/out.js
//@prepros-append controller/farmer/farming.js

//@prepros-append controller/farmer/plant/startPlant.js
//@prepros-append controller/farmer/plant/recordPlant.js
//@prepros-append controller/farmer/plant/predictPlant.js
//@prepros-append controller/farmer/plant/recordResult.js




// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular
  .module("app", [
    "ionic",
    "ngCordova",
    "moment-picker",
    "datatables",
    "chart.js",
    "mobiscroll-form",
    "ngStorage",
    "ngAnimate",
    "ngMaterial"
  ])

  .run(function(
    $ionicPlatform,
    $rootScope,
    $localStorage,
    $location,
    $ionicPlatform,
    $ionicLoading,
    $state,
    $ionicPopup,
    $ionicHistory,
    $timeout,
    $ionicBackdrop,
    $mdDialog
  ) {
    $ionicPlatform.ready(function() {
      // $ionicLoading.show({duration:8000})
      // cordova.plugins.autoStart.enable();
      // $rootScope.ipregister =
      //   "https://digimove.365supplychain.com/agripro/version2/";
      // $rootScope.iplogin =
      //   "https://digimove.365supplychain.com/agripro/version2/"; //365

      $rootScope.ipregister = "http://192.168.9.172/agriprophpNew/version2/";
      $rootScope.iplogin = "http://192.168.9.172/agriprophpNew/version2/";

      let platform = ionic.Platform.platform();
      if (platform == "android") {
        document.addEventListener(
          "deviceready",
          function() {
            let connection;
            // listen for Online event
            $rootScope.$on("$cordovaNetwork:online", function(
              event,
              networkState
            ) {
              if (platform == "android") {
                document.addEventListener("deviceready", function() {
                  var notificationOpenedCallback = function(jsonData) {
                    // console.log(JSON.stringify(jsonData));
                    // console.log(jsonData);
                  };
                  window.plugins.OneSignal.startInit(
                    "29a8343b-a2c6-483d-b083-2ff2cd7cae72"
                  )
                    .inFocusDisplaying(
                      window.plugins.OneSignal.OSInFocusDisplayOption
                        .Notification
                    )
                    .handleNotificationOpened(notificationOpenedCallback)
                    .endInit();

                  window.plugins.OneSignal.setSubscription(true);
                });
              }
              connection = true;
            });

            // listen for Offline event
            $rootScope.$on("$cordovaNetwork:offline", function(
              event,
              networkState
            ) {
              connection = false;
            });

            $rootScope.$watch(
              function() {
                return connection;
              },
              function(newData, oldData) {
                if (newData == false) {
                  $ionicBackdrop.retain();
                  mobiscroll.snackbar({
                    message: "Connection offline Please check your Internet.",
                    display: "top",
                    duration: false
                  });
                }
                if (newData == true) {
                  $ionicBackdrop.release();
                  mobiscroll.snackbar({
                    message: "Connection Online",
                    display: "top",
                    color: "success",
                    duration: 3000
                  });
                }
              }
            );
          },
          false
        );

        document.addEventListener("deviceready", function() {
          $ionicPlatform.registerBackButtonAction(function(event) {
            if (
              $state.current.name == "app.farmerMenu" ||
              $state.current.name == "app.out"
            ) {
              var confirmPopup = $ionicPopup.confirm({
                title: "<b>Exit !!</b>",
                subTitle: "<center>ต้องการจากระบบ หรือไม่ ?</center>"
              });

              confirmPopup.then(function(res) {
                if (res) {
                  $ionicLoading.show();
                  $rootScope.global = {};
                  delete $localStorage.globalAGRI;
                  // $ionicHistory.clearCache();

                  $timeout(function() {
                    window.location = "index.html";
                    $ionicLoading.hide();
                  }, 1000);
                } else {
                }
              });
            } else if ($state.current.name == "app.farmerlogin") {
              var Popup = $ionicPopup.confirm({
                title: "<b>แจ้งเตือน !!</b>",

                subTitle:
                  "<center>ต้องการออกจากแอปพลิเคชั่น<br>" +
                  " หรือไม่ ?</center>"
              });

              Popup.then(function(res) {
                if (res) {
                  ionic.Platform.exitApp();
                } else {
                }
              });
            } else {
              $ionicHistory.goBack();
            }

            return false;
          }, 101);
        });
      }

      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    $rootScope.$on("$stateChangeStart", function() {
      $mdDialog.cancel();
      if ($localStorage.globalAGRI) {
        $rootScope.global = $localStorage.globalAGRI;
        // $location.path("/app/farmerMenu");

          // $rootScope.ip =
          // "https://digimove.365supplychain.com/agripro/version2/" +
          // $rootScope.global.server_userdb +
          // "/"; //365

          $rootScope.ip =
            "http://192.168.9.172/agriprophpNew/version2/" +
            $rootScope.global.server_userdb +
            "/"; //local

        console.log($rootScope.ip);

        // Service.loopService();
      } else {
        $location.path("/app/farmerlogin");
      }
    });
  })



  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // $ionicConfigProvider.views.forwardCache(false);

    $urlRouterProvider.otherwise("/app/farmerMenu");

    $stateProvider
      .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/navbar.html",
        controller: "nevCtrl as vm"
      })

      .state("app.farmerlogin", {
        url: "/farmerlogin",
        views: {
          menuContent: {
            templateUrl: "templates/farmerlogin.html",
            controller: "farmerloginCtrl as vm"
          }
        }
      })

      .state("app.farmerCheck", {
        url: "/farmerCheck",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/farmerCheck.html",
            controller: "farmerCheckCtrl as vm"
          }
        }
      })

      .state("app.farmerResult", {
        url: "/farmerResult",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/farmerResult.html",
            controller: "farmerResultCtrl as vm"
          }
        }
      })

      .state("app.setting0", {
        url: "/setting0",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/setting0.html",
            controller: "setting0Ctrl as vm"
          }
        }
      })

      .state("app.setting", {
        url: "/setting/:iotno/:iotdetail",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/setting.html",
            controller: "settingCtrl as vm"
          }
        }
      })

      .state("app.setting3", {
        url: "/setting3/:iotno:type:ac",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/setting3.html",
            controller: "setting3Ctrl as vm"
          }
        }
      })

      .state("app.setting4", {
        url: "/setting4/:iotno:type:ac",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/setting4.html",
            controller: "setting4Ctrl as vm"
          }
        }
      })

      .state("app.settingedit", {
        url: "/settingedit/:setting",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/settingedit.html",
            controller: "settingeditCtrl as vm"
          }
        }
      })

      .state("app.dayssetting", {
        url: "/dayssetting",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/dayssetting.html",
            controller: "dayssettingCtrl as vm"
          }
        }
      })

      .state("app.out", {
        url: "/out/:mess",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/out.html",
            controller: "outCtrl as vm"
          }
        }
      })

      .state("app.weather", {
        url: "/weather",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/weather.html",
            controller: "weatherCtrl as vm"
          }
        }
      })

      .state("app.weatherDetail", {
        url: "/weather/Detail/:action:desc",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/weatherDetail.html",
            controller: "weatherDetailCtrl as vm"
          }
        }
      })

      .state("app.news", {
        url: "/news",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/news.html",
            controller: "newsCtrl as vm"
          }
        }
      })

      .state("app.newsDetail", {
        url: "/news/detail",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/newsDetail.html",
            controller: "newsDetailCtrl as vm"
          }
        }
      })

      .state("app.area", {
        url: "/area",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/area.html",
            controller: "areaCtrl as vm"
          }
        }
      })

      .state("app.area2", {
        url: "/area2/:crop:sub",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/area2.html",
            controller: "area2Ctrl as vm"
          }
        }
      })

      .state("app.add6", {
        url: "/add6/:cropMstr:areaMstr",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/add6.html",
            controller: "add6Ctrl as vm"
          }
        }
      })

      .state("app.createArea", {
        url: "/createArea",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/createArea.html",
            controller: "createAreaCtrl as vm"
          }
        }
      })

      .state("app.farming", {
        url: "/farming",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/farming.html",
            controller: "farmingCtrl as vm"
          }
        }
      })

      .state("app.regisapp", {
        url: "/regisapp",
        views: {
          menuContent: {
            templateUrl: "templates/regisapp.html",
            controller: "regisAppCtrl as vm"
          }
        }
      })

      //farmer

      .state("app.farmerMenu", {
        url: "/farmerMenu",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/farmerMenu.html",
            controller: "farmerMenuCtrl as vm"
          }
        }
      })

      // .state("app.dashboard", {
      //   url: "/dashboard",
      //   views: {
      //     menuContent: {
      //       templateUrl: "templates/farmer/dashboard.html",
      //       controller: "dashboardCtrl as vm"
      //     }
      //   }
      // })

      .state("app.detail", {
        url: "/detail",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/detail.html",
            controller: "detailCtrl as vm"
          }
        }
      })

      .state("app.detail2", {
        url: "/detail2/:crop:sub",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/detail2.html",
            controller: "detail2Ctrl as vm"
          }
        }
      })

      .state("app.detail2-2", {
        url: "/detail2-2/:crop:sub:detail",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/detail2-2.html",
            controller: "detail2-2Ctrl as vm"
          }
        }
      })

      .state("app.hist", {
        url: "/hist",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/hist.html",
            controller: "histCtrl as vm"
          }
        }
      })

      .state("app.newsetting", {
        url: "/newsetting",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/newsetting.html",
            controller: "newsettingCtrl as vm"
          }
        }
      })

       .state("app.startPlant", {
        url: "/startPlant",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/plant/startPlant.html",
            controller: "startPlantCtrl as vm"
          }
        }
      })

      .state("app.startPlant2", {
        url: "/startPlant2/:list",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/plant/startPlant2.html",
            controller: "startPlant2Ctrl as vm"
          }
        }
      })

      .state("app.startPlant3", {
        url: "/startPlant3/:list/:sub/:crop",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/plant/startPlant3.html",
            controller: "startPlant3Ctrl as vm"
          }
        }
      })

      .state("app.recordPlant", {
        url: "/recordPlant",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/plant/recordPlant.html",
            controller: "recordPlantCtrl as vm"
          }
        }
      })

      .state("app.recordPlant2", {
        url: "/recordPlant2/:list",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/plant/recordPlant2.html",
            controller: "recordPlant2Ctrl as vm"
          }
        }
      })

      .state("app.predictPlant", {
        url: "/predictPlant",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/plant/predictPlant.html",
            controller: "predictPlantCtrl as vm"
          }
        }
      })

      
      .state("app.predictPlant2", {
        url: "/predictPlant2/:list",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/plant/predictPlant2.html",
            controller: "predictPlant2Ctrl as vm"
          }
        }
      })


      .state("app.recordResult", {
        url: "/recordResult/:list",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/plant/recordResult.html",
            controller: "recordResultCtrl as vm"
          }
        }
      })

        .state("app.recordResult2", {
        url: "/recordResult2/:list",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/plant/recordResult2.html",
            controller: "recordResult2Ctrl as vm"
          }
        }
      });



  })

 
  .config(function($mdGestureProvider) {
    // For mobile devices without jQuery loaded, do not
    // intercept click events during the capture phase.
    $mdGestureProvider.skipClickHijack();
  });

angular
  .module("app")

  .service("Service", function(
    $cordovaDatePicker,
    $ionicLoading,
    $q,
    $http,
    $rootScope,
    $state,
    $timeout
  ) {
    this.toast = function(mes, col, dis) {
      mobiscroll.toast({
        message: mes,
        color: col,
        display: dis
      });
    };

    this.timeout = function() {
      mobiscroll.snackbar({
        message: "เกิดข้อผิดพลาดหมดเวลาในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง"
      });
    };

    // console.log($rootScope.global)

    this.loopService = function(callback) {
      // $ionicLoading.show();
      function checkuser() {
        //  console.log('looppppp')
        return new Promise(function(resolve, reject) {
          let user = {
            username: $rootScope.global.mob_username,
            password: $rootScope.global.mob_password
          };
          let url = $rootScope.iplogin + "login.php"; //'http://192.168.9.172/agriprophp/login.php'
          let req = {
            mode: "checkuser",
            value: user
          };
          $http.post(url, req).then(function suscess(response) {
            // console.log(response.data)
            this.usercheck = response.data;
            // console.log(this.usercheck)
            if (
              this.usercheck.status == "reject" ||
              this.usercheck.status == "pending" ||
              this.usercheck.status == "stop"
            ) {
              $state.go("app.out", { mess: usercheck.mess });
              clearInterval(loopcheckuser);
            }

            // $ionicLoading.hide();
          });
        });
      }

      checkuser();
      let loopcheckuser = setInterval(checkuser, 15000);
    };

    function convertdate(date, month, year) {
      let resmonth;
      switch (month) {
        case "Jan":
          resmonth = "01";
          break;
        case "Feb":
          resmonth = "02";

          break;
        case "Mar":
          resmonth = "03";
          break;
        case "Apr":
          resmonth = "04";
          break;
        case "May":
          resmonth = "05";
          break;
        case "Jun":
          resmonth = "06";
          break;
        case "Jul":
          resmonth = "07";
          break;
        case "Aug":
          resmonth = "08";
          break;
        case "Sep":
          resmonth = "09";
          break;
        case "Oct":
          resmonth = "10";
          break;
        case "Nov":
          resmonth = "11";
          break;
        case "Dec":
          resmonth = "12";
          break;
      }
      let y = parseInt(year) + 543;
      let fulldate = year + "-" + resmonth + "-" + date; // ปี ค.ศ. ใช้ year พ.ศ ใช้ y
      return fulldate;
    }

    this.pickdate = function() {
      let platform = ionic.Platform.platform();
      if (platform == "android") {
        var options = {
          androidTheme: 5,
          todayText: "วันนี้",
          is24Hour: true,
          date: new Date(),
          mode: "date", // or 'time'
          // minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: false,
          doneButtonLabel: "DONE",
          doneButtonColor: "#F2F3F4",
          cancelButtonLabel: "CANCEL",
          cancelButtonColor: "#000000",
          locale: "th_th"
        };
      } else {
        // ios;
        var options = {
          mode: "date", // or 'time'
          date: new Date(),
          todayText: "วันนี้",
          is24Hour: true, // or 'time'
          // minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: "ยืนยัน",
          doneButtonColor: "#000000",
          cancelButtonLabel: "CANCEL",
          cancelButtonColor: "#000000",
          popoverArrowDirection: "up",
          locale: "th_th"
        };
      }

      return (resdate = $cordovaDatePicker.show(options).then(function(date) {
        let r = date.toString();
        let res = r.split(" ");
        return (resdate = convertdate(res[2], res[1], res[3]));
      }));
    };

    this.picktime = function() {
      let platform = ionic.Platform.platform();

      if (platform == "android") {
        var options = {
          androidTheme: 5,
          todayText: "วันนี้",
          is24Hour: true,
          date: new Date(),
          mode: "time", // or 'time'
          // minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: false,
          doneButtonLabel: "DONE",
          doneButtonColor: "#F2F3F4",
          cancelButtonLabel: "CANCEL",
          cancelButtonColor: "#000000",
          locale: "th_th"
        };
      } else {
        var options = {
          mode: "time", // or 'time'
          date: new Date(),
          // todayText: "วันนี้",
          // is24Hour: true, // or 'time'
          // minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: "ยืนยัน",
          doneButtonColor: "#000000",
          cancelButtonLabel: "CANCEL",
          cancelButtonColor: "#000000",
          popoverArrowDirection: "up",
          locale: "th_th"
        };
      }

      return (resdate = $cordovaDatePicker.show(options).then(function(date) {
        let r = date.toString();
        let res = r.split(" ");
        // return (resdate = convertdate(res[2], res[1], res[3]));
        return res[4];
      }));

      //ios
      //   var options = {
      //   mode: 'date', // or 'time'
      //   date: new Date(),
      //   todayText :'วันนี้',
      //   is24Hour:true, // or 'time'
      //   minDate: new Date() - 10000,
      //   allowOdasdsadldDates: true,
      //   allowFutureDates: true,
      //   doneButtonLabel: 'ยืนยัน',
      //   doneButtonColor: '#000000',
      //   cancelButtonLabel: 'CANCEL',
      //   cancelButtonColor: '#000000',
      //   popoverArrowDirection :'up',
      //   locale :'en_th'
      // };
    };

    // sadsa

    this.loopOnesig = function(e) {
      function checkuser(e) {
        let url = $rootScope.ip + "onesig.php"; //'http://192.168.9.172/agriprophp/login.php'
        console.log(url);
        let req = {
          mode: "onesigGettag",
          value: e
        };
        $http.post(url, req).then(function suscess(response) {
          console.log(response.data);
          for (let i = 0; i < response.data.result.length; i++) {
            document.addEventListener("deviceready", function() {
              window.plugins.OneSignal.sendTag(
                response.data.result[i].iot_id,
                response.data.result[i].iot_id
                // ส่ง Tag
              );
                console.log(response.data.result[i].iot_id)

            });
          }
        });
      }
      checkuser(e);
    };
  })
  .service("deviceService", function(
    $http,
    $ionicPopup,
    $rootScope,
    $cordovaGeolocation,
    $ionicLoading
  ) {
    this.checkGPS = function(callback) {
      document.addEventListener("deviceready", function() {
        cordova.plugins.diagnostic.isLocationEnabled(
          function(enabled) {
            if (enabled) {
              callback("GPS_ON");
            } else {
              callback("GPS_OFF");
            }
          },
          function(error) {
            console.log("The following error occurred: " + error);
          }
        );
      });
    };

    this.opengpsAndroid = function(callback) {
      cordova.plugins.locationAccuracy.request(
        function(success) {
          console.log("Successfully requested accuracy: " + success.message);
          // Return callback()
          callback("force_gps");
        },
        function(error) {
          console.log(
            "Accuracy request failed: error code=" +
              error.code +
              "; error message=" +
              error.message
          );
          callback("notforce_gps");
          if (
            error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED
          ) {
            // Return callback()
            callback("setting_gps");
          }
        },
        cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
      );
    };
  });

angular.module('app')
.directive('uppercased', function() {
  return {
      require: 'ngModel',        
      link: function(scope, element, attrs, modelCtrl) {
          modelCtrl.$parsers.push(function(input) {
              return input ? input.toUpperCase() : "";
          });
          element.css("text-transform","uppercase");
      }
  };
})
angular
  .module("app")

  .controller("nevCtrl", function(
    $scope,
    $ionicModal,
    $timeout,
    $http,
    $rootScope,
    $timeout,
    $state,
    $stateParams,
    $ionicHistory
  ) {
    let vm = this;

    $scope.ww = false;
    $scope.myScroll = { height: "calc(100%)" };

    function active() {
 
      let url = $rootScope.ip + "onesig.php"; //'http://192.168.9.172/agriprophp/login.php'

      let req = {
        mode: "checkActive",
        value: $rootScope.global
      };
      if ($rootScope.ip) {
  

        $http.post(url, req).then(function suscess(response) {
          if (response.data.status == true && response.data.result.length > 0) {
            vm.activeMat = response.data.result;
            $scope.ww = true;
            $scope.myScroll = {
              height: "calc(100% - 50px)",
              "margin-top": "-16px"
            };
          } else {
            $scope.ww = false;
            $scope.myScroll = { height: "calc(100%)" };
          }
        });
      }
    }

    active();
    let loopActive = setInterval(active, 15000);

    vm.activePage = function() {
      $state.go("app.setting0");
    };
  });

angular
  .module("app")

  .controller("farmerloginCtrl", function(
    $localStorage,
    $rootScope,
    $scope,
    $state,
    $ionicHistory,
    $http,
    Service,
    $ionicLoading,
    $timeout
  ) {
    (function($) {
      "use strict";

      /*==================================================================
        [ Focus input ]*/
      $(".input100").each(function() {
        $(this).on("blur", function() {
          if (
            $(this)
              .val()
              .trim() != ""
          ) {
            $(this).addClass("has-val");
          } else {
            $(this).removeClass("has-val");
          }
        });
      });

      /*==================================================================
        [ Show pass ]*/
      var showPass = 0;
      $(".btn-show-pass").on("click", function() {
        if (showPass == 0) {
          $(this)
            .next("input")
            .attr("type", "text");
          $(this)
            .find("i")
            .removeClass("zmdi-eye");
          $(this)
            .find("i")
            .addClass("zmdi-eye-off");
          showPass = 1;
        } else {
          $(this)
            .next("input")
            .attr("type", "password");
          $(this)
            .find("i")
            .addClass("zmdi-eye");
          $(this)
            .find("i")
            .removeClass("zmdi-eye-off");
          showPass = 0;
        }
      });
    })(jQuery);
    let vm = this;

    $scope.model = { username: "", password: "" };

    vm.goback = function() {
      $ionicHistory.goBack();
    };

    vm.login = function() {
      $ionicLoading.show({
        template:
          '<ion-spinner  class="spinner-calm"></ion-spinner><br>กรุณารอสักครู่'
      });
      let url = $rootScope.iplogin + "login.php"; //"http://192.168.9.172/agriprophp/login.php";
      let req = { mode: "logincenter", value: $scope.model };

      $http.post(url, req).then(
        function(response) {
          console.log(response);
          if (response.data.status == true) {

            $state.go("app.farmerMenu");
            $rootScope.global = response.data.result;
            $localStorage.globalAGRI = $rootScope.global;

            $rootScope.ip ="https://digimove.365supplychain.com/agripro/" + $rootScope.global.server_userdb + "/"; //365
            // $rootScope.ip = "http://192.168.9.172/agriprophpNew/" + $rootScope.global.server_userdb + "/"; //local


            console.log(response.data.result)
            $timeout(function() {
              Service.loopOnesig(response.data.result);
            }, 2000);

            if (response.data.mess) {
              mobiscroll.alert({
                title: "แจ้งเตือน !!",
                message: response.data.mess
              });
            }
          }

          if (response.data.status == "stop") {
            mobiscroll.alert({
              title: "แจ้งเตือน !!",
              message: response.data.mess
            });
          }

          if (response.data.status == "not") {
            mobiscroll.alert({
              title: "แจ้งเตือน",
              message: "Username หรือ Password ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
              callback: function() {}
            });
          }

          if (response.data.status == false) {
            Service.timeout();
            $ionicLoading.hide();
          }

          $ionicLoading.hide();
        },
        function err(errors) {
          Service.timeout();
          $ionicLoading.hide();
        }
      );
    };

    vm.regis = function() {
      $state.go("app.regisapp");
    };
  })
  .controller("regisAppCtrl", function(
    $localStorage,
    $rootScope,
    $scope,
    $state,
    $ionicHistory,
    $http,
    Service,
    $ionicLoading,
    $ionicPopup,
    $mdDialog,
    $q,
    $timeout,
    $ionicScrollDelegate
  ) {
    let vm = this;
    vm.goback = function() {
      $ionicHistory.goBack();
    };
    $scope.model = {};

    function province() {
      $ionicLoading.show();
      let url = $rootScope.ipregister + "register.php";
      let req = { mode: "province" };

      $http.post(url, req).then(
        function(response) {
          console.log(response.data);
          if (response.data.status == true) {
            vm.province = response.data.result;
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err() {
          $ionicLoading.hide();
        }
      );
    }

    console.log("123");

    province();

    vm.provinceChange = function(e) {
      console.log(e);
      $ionicLoading.show();
      let url = $rootScope.ipregister + "register.php";
      let req = { mode: "AUMPHUR", data: e };

      $http.post(url, req).then(
        function(response) {
          console.log(response.data);
          if (response.data.status == true) {
            vm.aumphur = response.data.result;
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err() {
          $ionicLoading.hide();
        }
      );
    };

    vm.aumphurChange = function(e) {
      $ionicLoading.show();
      let url = $rootScope.ipregister + "register.php";
      let req = { mode: "tumbol", data: e };

      $http.post(url, req).then(
        function(response) {
          console.log(response.data);
          if (response.data.status == true) {
            vm.tumbol = response.data.result;
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err() {
          $ionicLoading.hide();
        }
      );
    };

    vm.confirm = function() {
      console.log($scope.model)
      let passchech = $scope.checkPass();
      let citizenid = $scope.citizenId();

      if (!passchech) {
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.querySelector("#popupContainer")))
            .clickOutsideToClose(true)
            .title("แจ้งเตือน")
            .textContent(
              "ไม่สามารถสร้างผู้ใช้งานได้เนื่องจาก Password ไม่ตรงกันกรุณาลองใหม่อีกครั้ง"
            )
            .ariaLabel("Alert Dialog Demo")
            .ok("OK")
            .targetEvent()
        );
      } else {
        $ionicLoading.show();
        console.log(passchech);
        console.log($scope.model);
        let canceller = $q.defer();

        $timeout(function() {
          canceller.resolve("user cancelled");
        }, 30000);

        let pro = {
          province: vm.provinceSelect,
          aumphur: vm.aumphurSelect,
          tumbol: vm.tumbolSelect
        };
        let url = $rootScope.ipregister + "register.php";
        let req = { mode: "regis", value: $scope.model, pro: pro ,img:vm.img };

        $http.post(url, req, { timeout: canceller.promise }).then(
          function(response) {
            console.log(response.data);
            if (response.data.status == true) {
              mobiscroll.alert({
                title: "แจ้งเตือน",
                message: "บันทึกข้อมูลเกษตรกรเรียนร้อยแล้ว",
                callback: function() {
                  $ionicHistory.nextViewOptions({
                    disableBack: true
                  });
                  $state.go("app.farmerlogin");
                }
              });
              $ionicLoading.hide();
            } else {
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("แจ้งเตือน")
                  .textContent(response.data.check)
                  .ariaLabel("Alert Dialog Demo")
                  .ok("OK")
                  .targetEvent()
              );
              $ionicLoading.hide();
            }
          },
          function err(err) {
            console.log(err);
            $ionicLoading.hide();
          }
        );
      }
    };

    let platform = ionic.Platform.platform();

    vm.pickdate = function() {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.model.user_lastck = data;
          });
        });
      } else {
        $scope.datamodal = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="datamodal.date">',
          title: "Enter Date Ex 2019-01-31",
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
                  $scope.model.user_lastck = $scope.datamodal.date;
                }
              }
            }
          ]
        });
      }
    };

    vm.pickbirth = function() {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.model.user_birth = data;
          });
        });
      } else {
        $scope.datamodal = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="datamodal.date">',
          title: "Enter Date Ex 2019-01-31",
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
                  $scope.model.user_birth = $scope.datamodal.date;
                }
              }
            }
          ]
        });
      }
    };

    $scope.check = function() {
      if (
        !$scope.model.user_username ||
        !$scope.model.user_pass ||
        !$scope.model.user_repass ||
        !$scope.model.user_title ||
        !$scope.model.user_fname ||
        !$scope.model.user_lname ||
        !$scope.model.user_birth ||
        !$scope.model.user_citizen_id ||
        !$scope.model.user_email ||
        !$scope.model.user_tel ||
        !$scope.model.user_address ||
        !$scope.model.user_moo ||
        !vm.provinceSelect ||
        !vm.aumphurSelect ||
        !vm.tumbolSelect ||
        !$scope.model.user_zip ||
        $scope.citizenId() == false
      ) {
        return true;
      } else {
        return false;
      }
    };

    $scope.checkPass = function() {
      if (
        $scope.model.user_pass != $scope.model.user_repass ||
        (!$scope.model.user_pass || !$scope.model.user_repass)
      ) {
        return false;
      } else {
        return true;
      }
    };

    $scope.citizenId = function() {
      if ($scope.model.user_citizen_id) {
        let str = $scope.model.user_citizen_id;

        for (i = 0, sum = 0; i < 12; i++) {
          sum += parseFloat(str.charAt(i)) * (13 - i);
        }
        if ((11 - (sum % 11)) % 10 != parseFloat(str.charAt(12))) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    };

    vm.img = [];
    vm.remove = function(index) {
      console.log(index);
      vm.img.splice(index, 1);
    };

    vm.add = function(ev) {
      if (vm.img.length < 6) {
        let platform = ionic.Platform.platform();
        // $scope.openModalPic();

        if (platform == "android" || platform == "ios") {
          $mdDialog
            .show({
              controller: DialogController,
              templateUrl: "templates/dialog1.html",
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: true,
              fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(
              function(answer) {
                switch (answer) {
                  case "camera":
                    camera();
                    break;
                  case "image":
                    image();
                    break;
                }
                //////console.log('You said the information was "' + answer + '".');
              },
              function() {}
            );
        } else {
          vm.img.push('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg==');
          $ionicScrollDelegate.resize();
        }
      } else {
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.querySelector("#popupContainer")))
            .clickOutsideToClose(true)
            .title("แจ้งเตือน")
            .textContent("ไม่สามารถเพิ่มรูปภาพมากกว่า 6 รูปได้")
            .ariaLabel("Alert Dialog Demo")
            .ok("OK")
            .targetEvent()
        );
      }
    };

    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }

    function camera() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 40,
        sourceType: Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.DATA_URL
      });

      function onSuccess(imageData) {
        var image = document.getElementById("myImage");
        $scope.image = "data:image/jpeg;base64," + imageData;
        vm.img.push($scope.image);
        $ionicScrollDelegate.resize();
      }

      function onFail(message) {
        alert("Failed because: " + message);
      }
    }
    function image() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 40,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1920,
        targetHeight: 1080
      });



      function onSuccess(imageData) {
        var image = document.getElementById("myImage");
        $scope.image = "data:image/jpeg;base64," + imageData;
        vm.img.push($scope.image);
        $ionicScrollDelegate.resize();
      }

      function onFail(message) {
        alert("Failed because: " + message);
      }
    }
  });

angular
  .module("app")

  .controller("farmerMenuCtrl", function(
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
    $ionicScrollDelegate
  ) {
    let vm = this;

    vm.test1 = function() {
      let platform = ionic.Platform.platform();

      function checkGPS() {
        return new Promise(function(resolve, reject) {
          deviceService.checkGPS(function(e) {
            resolve(e);
          });
        });
      }

      async function main() {
        let statusgps = await checkGPS();
        // console.log(platform);
        // console.log(statusgps);

        if (statusgps == "GPS_OFF") {
          if (platform == "android") {
            deviceService.opengpsAndroid(function(e) {
              console.log(e);
            });
          } else if (platform == "ios") {
            console.log("ios");
          }
        } else {
        }
      }

      main();
    };

    vm.test1();

    vm.logout = function() {
      let hideSheet = $ionicActionSheet.show({
        titleText: "Logout ",
        buttons: [
          {
            text: '<i class="icon ion-log-out"></i> Logout'
          }
          // {
          //   text: '<i class="icon ion-chatboxes"></i> Share with Sms'
          // },
          // {
          //   text: '<i class="icon ion-network"></i> Share with Social'
          // },
        ],

        buttonClicked: function(index) {
          console.log(index);
          if (index == 0) {
            $ionicLoading.show();
            $rootScope.global = {};

            document.addEventListener("deviceready", function() {
              window.plugins.OneSignal.getTags(function(tags) {
                // console.log(tags);
                for (x in tags) {
                  // console.log(x)
                  let key = x;
                  window.plugins.OneSignal.deleteTag(key);
                }
              });
            });

            delete $localStorage.globalAGRI;
            $timeout(function() {
              window.location = "index.html";
              $ionicLoading.hide();
            }, 5000);
          }

          // if (index == 1) {
          // }

          // if (index == 2) {
          // }

          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function() {
        hideSheet();
      }, 7000);

      // $state.go('app.farmerlogin')
    };

    function daliy() {
      let req = { value: 1 };
      $http
        .post("http://192.168.9.172/agriprophp/test.php", req)
        .then(function(e) {
          vm.Warning = e.data;
          console.log(vm.Warning);
        });

      req = { value: 2 };
      $http
        .post("http://192.168.9.172/agriprophp/test.php", req)
        .then(function(e) {
          vm.WeatherToday = e.data;
          console.log(vm.WeatherToday);
        });

      req = { value: 3 };
      $http
        .post("http://192.168.9.172/agriprophp/test.php", req)
        .then(function(e) {
          vm.DailyForecast = e.data;
          console.log(vm.DailyForecast);
        });
    }

    vm.slide = function() {
      $ionicSlideBoxDelegate.slide(1);
      $ionicSlideBoxDelegate.update();
    };

    vm.area = function() {
      $state.go("app.area");
      // $state.go("app.add4");
    };

    vm.dashboard = function() {
      $state.go("app.dashboard");
    };

    vm.farmer = function() {
      $state.go("app.detail");
    };

    vm.blackup = function() {
      $state.go("app.hist");
    };

    vm.iot = function() {
      $state.go("app.newsetting");
    };

    vm.weather = function() {
      $state.go("app.weather");
    };

    vm.farming = function() {
      $state.go("app.farming");
    };

    vm.news = function() {
      $state.go("app.news");
    };

    vm.growth = function() {
      $state.go("app.growth");
    };

    console.log("11");

    $timeout(function() {
      Service.loopService();

      Service.loopOnesig($rootScope.global);
    }, 1000);

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
    //   console.log($rootScope.global);
    // };

    // $scope.ww = false;
    // $scope.myScroll = { height: "calc(100%)" };

    // function active() {
    //   let url = $rootScope.ip + "onesig.php"; //'http://192.168.9.172/agriprophp/login.php'
    //   console.log(url);
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
  });

angular
  .module("app")

  .controller("areaCtrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $ionicSlideBoxDelegate,
    $q
  ) {
    let vm = this;

    // console.log($rootScope.global);
    // $scope.crop = JSON.parse($stateParams.crop);
    $scope.crop = { frm_code: $rootScope.global.mob_farm_code };
    // console.log($scope.crop);

    $rootScope.cropSet = $scope.crop;

    vm.addcrop = function() {
      $state.go("app.add3");
    };

    vm.edit = function(e) {
      $scope.modaledit.show();
      $scope.editdata = angular.copy(e);
      console.log($scope.editdata);
      $scope.positionEdit = {
        lat: $scope.editdata.farm_lat.split(","),
        lng: $scope.editdata.farm_lng.split(",")
      };
    };

    vm.deleteCrop = function() {
      mobiscroll.confirm({
        title: "แจ้งเตือน",
        message: "คุณต้องการลบพื้นที่นี้ใช่หรือไม่ ?",
        okText: "ยืนยัน",
        cancelText: "ยกเลิก",
        callback: function(res) {
          if (res) {
            $ionicLoading.show();
            let url = $rootScope.ip + "createArea.php";
            let req = { mode: "deleteCrops", data: $scope.editdata };
            $http.post(url, req).then(
              function(response) {
                if (response.data.status == true) {
                  $ionicLoading.hide();
                  $timeout(function() {
                    delete $scope.data;
                    $scope.modaledit.hide();
                    mobiscroll.toast({
                      message: "ลบ Crop เรียบร้อย",
                      color: "success"
                    });
                    onStart();
                  }, 200);
                } else {
                  $ionicLoading.hide();
                  Service.timeout();
                }
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          }
        }
      });
    };

    vm.editMap = function() {
      console.log($scope.positionEdit);
      $scope.modaledit.hide();
      $timeout(function() {
        $scope.modalmap.show();

        var all_overlays = [];
        var selectedShape;
        $scope.PolygonPatch = [];

        $scope.data;

        function CenterControl(controlDiv, map) {
          // Set CSS for the control border.
          var controlUI = document.createElement("div");
          controlUI.style.backgroundColor = "#fff";
          controlUI.style.border = "2px solid #fff";
          controlUI.style.borderRadius = "3px";
          controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
          controlUI.style.cursor = "pointer";
          controlUI.style.marginBottom = "22px";
          controlUI.style.marginTop = "10px";
          controlUI.style.marginRight = "10px";
          controlUI.style.textAlign = "center";
          controlDiv.appendChild(controlUI);

          // Set CSS for the control interior.
          var controlText = document.createElement("div");
          controlText.style.color = "rgb(25,25,25)";
          controlText.style.fontFamily = "Roboto,Arial,sans-serif";
          controlText.style.fontSize = "16px";
          controlText.style.lineHeight = "38px";
          controlText.style.paddingLeft = "5px";
          controlText.style.paddingRight = "5px";

          controlText.innerHTML = "Remove";
          controlUI.appendChild(controlText);

          // Setup the click event listeners: simply set the map to Chicago.
          controlUI.addEventListener("click", function() {
            deleteSelectedShape();
          });
        }

        function clearSelection() {
          if (selectedShape) {
            selectedShape.setEditable(false);
            selectedShape = null;
          }
        }

        function setSelection(shape) {
          infowindow.open(map);
          // console.log(shape)
          clearSelection();
          selectedShape = shape;
          shape.setEditable(true);
        }

        function deleteSelectedShape() {
          if (selectedShape) {
            infowindow.close();
            $scope.PolygonPatch = [];
            selectedShape.setMap(null);
            // To show:
            drawingManager.setOptions({
              drawingControl: true
            });
          }
        }

        function showoutput() {
          alert($scope.data);
        }

        //Set map
        var map = new google.maps.Map(document.getElementById("maps"), {
          center: {
            lat: 13.713462,
            lng: 100.478819
          },
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ["satellite", "roadmap", "hybrid"]
          },
          mapTypeId: "satellite",
          zoom: 19
        });

        var infowindow = new google.maps.InfoWindow();
        var centerControlDiv = document.createElement("div");
        var centerControl = new CenterControl(centerControlDiv, map);
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          centerControlDiv
        );

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
            drawingModes: ["polygon"]
          },
          polygonOptions: {
            clickable: true,
            editable: true,
            draggable: false,
            fillColor: "red",
            strokeColor: "green",
            strokeWeight: 3
          },
          drawingMode: null
        });
        // infowindow.open(map);
        google.maps.event.addListener(
          drawingManager,
          "polygoncomplete",
          function(polygon) {
            /// Disable Controller//
            drawingManager.setOptions({
              drawingControl: false
            });

            all_overlays.push(polygon);
            console.log(all_overlays);
            drawingManager.setDrawingMode(null);

            var newShape = polygon;
            // newShape.type = polygon;

            //Edit point
            google.maps.event.addListener(
              newShape.getPath(),
              "set_at",
              function() {
                console.log("set_at");
                cal(newShape.getPath());
              }
            );

            //Insert point
            google.maps.event.addListener(
              newShape.getPath(),
              "insert_at",
              function() {
                console.log("insert_at");
                console.log(newShape.getPath());
                cal(newShape.getPath());
              }
            );

            //click shape
            google.maps.event.addListener(newShape, "click", function(e) {
              setSelection(newShape);
            });
            setSelection(newShape);

            // คำนวนและแสดง
            function cal(patch) {
              $scope.PolygonPatch = [];
              for (var i = 0; i < patch.length; i++) {
                $scope.PolygonPatch.push({
                  lat: patch
                    .getAt(i)
                    .lat()
                    .toFixed(5),
                  lng: patch
                    .getAt(i)
                    .lng()
                    .toFixed(5)
                });
              }
              console.log($scope.PolygonPatch);

              // ตารางเมตร
              var areaM2 = google.maps.geometry.spherical.computeArea(patch);
              // เอเคอร์
              var acreFormula = 0.00024711,
                // ไร่
                farmFormula = 0.000625,
                //ตารางวา
                wahFormula = 0.25,
                //งาน
                workFormula = 0.0025;

              var areaAC = (areaM2 * acreFormula).toFixed(3);
              var areaFarm = (areaM2 * farmFormula).toFixed(3);
              var areaWah = (areaM2 * wahFormula).toFixed(3);
              var areaWork = (areaM2 * workFormula).toFixed(3);

              var rai, ngan, wah;
              var modRai, modNgan, modWah;

              rai = parseInt(areaM2 / 1600);
              modRai = areaM2 % 1600;

              ngan = parseInt(modRai / 400);
              modNgan = modRai % 400;

              wah = parseInt(modNgan / 4);

              vm.area = {
                m2: areaM2.toFixed(3),
                ac: areaAC,
                // farm: areaFarm,
                // work: areaWork,
                // wah: areaWah,
                farm: rai,
                work: ngan,
                wah: wah
              };

              console.log(vm.area);

              infowindow.setContent(
                '<div id="contentmap">' +
                  '<div id="bodyContent" >' +
                  "<p>" +
                  "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
                  "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
                  vm.area.m2 +
                  " ตารางเมตร<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.farm +
                  " &nbspไร่<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.work +
                  " งาน<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.wah +
                  " ตารางวา<br> " +
                  "</div>"
              );

              infowindow.setPosition(polygon.getPath().getAt(0));
            }

            infowindow.open(map);
            cal(polygon.getPath());
          }
        );

        drawingManager.setMap(map);

        vm.save = function() {
          if ($scope.PolygonPatch.length) {
            $scope.modalmap.hide();
            $timeout(function() {
              $scope.modaledit.show();
              let area = {
                area: vm.area,
                position: $scope.PolygonPatch
              };

              let lat = "";
              let lng = "";
              for (let i = 0; i < area.position.length; i++) {
                lat += area.position[i].lat + ",";
                lng += area.position[i].lng + ",";
              }
              // let reslat = lat

              let sublat = lat.substring(0, lat.length - 1);
              let sublng = lng.substring(0, lng.length - 1);

              let resposition = {
                lat: lat.substring(0, lat.length - 1),
                lng: lng.substring(0, lng.length - 1)
              };
              let z = {
                lat: resposition.lat.split(","),
                lng: resposition.lng.split(",")
              };
              console.log(area.area);
              console.log(resposition);

              $scope.editdata.farm_area_acre = area.area.ac;
              $scope.editdata.farm_area_farm = area.area.farm;
              $scope.editdata.farm_area_m2 = area.area.m2;
              $scope.editdata.farm_area_wah = area.area.wah;
              $scope.editdata.farm_area_work = area.area.work;
              $scope.editdata.farm_lat = resposition.lat;
              $scope.editdata.farm_lng = resposition.lng;

              $scope.positionEdit = z;
            }, 500);
          } else {
          }
        };

        var triangleCoords = [];
        for (let i = 0; i < $scope.positionEdit.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.positionEdit.lat[i]),
            lng: parseFloat($scope.positionEdit.lng[i])
          };
          triangleCoords.push(k);
        }

        // Construct the polygon.
        var bermudaTriangle = new google.maps.Polygon({
          editable: true,
          paths: triangleCoords,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35
        });

        drawingManager.setOptions({
          drawingControl: false
        });

        all_overlays.push(bermudaTriangle);

        google.maps.event.addListener(bermudaTriangle, "click", function(e) {
          setSelection(bermudaTriangle);
        });

        setSelection(bermudaTriangle);

        function cal(patch) {
          vm.area = {};
          $scope.PolygonPatch = [];
          for (var i = 0; i < patch.length; i++) {
            $scope.PolygonPatch.push({
              lat: patch
                .getAt(i)
                .lat()
                .toFixed(5),
              lng: patch
                .getAt(i)
                .lng()
                .toFixed(5)
            });
          }
          // console.log($scope.PolygonPatch);

          // ตารางเมตร
          let areaM2 = google.maps.geometry.spherical.computeArea(patch);
          // เอเคอร์
          let acreFormula = 0.00024711,
            // ไร่
            farmFormula = 0.000625,
            //ตารางวา
            wahFormula = 0.25,
            //งาน
            workFormula = 0.0025;

          let areaAC = (areaM2 * acreFormula).toFixed(3);
          let areaFarm = (areaM2 * farmFormula).toFixed(3);
          let areaWah = (areaM2 * wahFormula).toFixed(3);
          let areaWork = (areaM2 * workFormula).toFixed(3);

          var rai, ngan, wah;
          var modRai, modNgan, modWah;

          rai = parseInt(areaM2 / 1600);
          modRai = areaM2 % 1600;

          ngan = parseInt(modRai / 400);
          modNgan = modRai % 400;

          wah = parseInt(modNgan / 4);

          vm.area = {
            m2: areaM2.toFixed(3),
            ac: areaAC,
            // farm: areaFarm,
            // work: areaWork,
            // wah: areaWah,
            farm: rai,
            work: ngan,
            wah: wah
          };

          infowindow.setContent(
            '<div id="contentmap">' +
              '<div id="bodyContent" >' +
              "<p>" +
              "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
              "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
              vm.area.m2 +
              " ตารางเมตร<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.farm +
              " &nbspไร่<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.work +
              " งาน<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.wah +
              " ตารางวา<br> " +
              "</div>"
          );

          infowindow.setPosition(bermudaTriangle.getPath().getAt(0));
        }

        infowindow.open(map);
        cal(bermudaTriangle.getPath());

        google.maps.event.addListener(
          bermudaTriangle.getPath(),
          "set_at",
          function() {
            console.log("set_at");
            cal(bermudaTriangle.getPath());
          }
        );

        google.maps.event.addListener(
          bermudaTriangle.getPath(),
          "insert_at",
          function() {
            cal(bermudaTriangle.getPath());
          }
        );

        bermudaTriangle.setMap(map);
      }, 500);
    };

    vm.updatepickdate = function() {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.editdata.farm_startt = data;
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
                  $scope.editdata.farm_startt = $scope.datamodal.date;
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
            $scope.editdata.farm_endt = data;
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
                  $scope.editdata.farm_endt = $scope.datamodal.date;
                }
              }
            }
          ]
        });
      }
    };

    vm.updateCrop = function() {
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "editCrop", data: $scope.editdata };
      console.log(req);
      $http.post(url, req).then(
        function(response) {
          console.log(response);
          if (response.data.status == true) {
            $ionicLoading.hide();
            $timeout(function() {
              delete $scope.data;
              $scope.modaledit.hide();
              mobiscroll.toast({
                message: "แก้ไขข้อมูลเรียบร้อย",
                color: "success"
              });
              onStart();
            }, 200);
          } else {
            $ionicLoading.hide();
            Service.timeout();
          }
        },
        function err(err) {
          $ionicLoading.hide();

          Service.timeout();
        }
      );
    };

    $scope.doRefresh = function() {
      // here refresh data code
      $scope.$broadcast("scroll.refreshComplete");
      $scope.$apply();
      onStart();
    };

    function onStart() {
      let cancellerLoadpic = $q.defer();
      let url = $rootScope.ip + "area.php";
      let req = {
        mode: "selectFarm",
        config: $rootScope.cropSet,
        global: $rootScope.global
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          $scope.status = true;

          console.log(response);
          if (response.data.status == true) {
            $scope.data = response.data;
          } else {
            $scope.data = response.data;
          }
          console.log(response);
        },
        function err(err) {
          console.log(err);
          $scope.data = [];
          $scope.status = false;
        }
      );
    }

    vm.refresh = function() {
      delete $scope.data;
      delete $scope.status;
      onStart();
    };

    onStart();

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

    $ionicModal
      .fromTemplateUrl("my-map.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modalmap = modal;
      });

    $scope.openModalMap = function() {
      $scope.modalmap.show();
    };
    $scope.closeModalMap = function() {
      $scope.modalmap.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function() {
      $scope.modalmap.remove();
    });

    $ionicModal
      .fromTemplateUrl("my-crop.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modalcrop = modal;
      });

    $scope.openModalCrop = function() {
      $scope.modalcrop.show();
    };
    $scope.closeModalCrop = function() {
      $scope.modalcrop.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function() {
      $scope.modalcrop.remove();
    });

    let platform = ionic.Platform.platform();

    vm.add5 = function(e) {
      $ionicLoading.show();
      console.log(e);
      let myJSON = JSON.stringify(e);
      let url = $rootScope.ip + "area.php";
      let req = { mode: "selectsubfarm", value: e };
      $http.post(url, req).then(
        function suscess(response) {
          if (response.data.status == true) {
            $ionicLoading.hide();

            let res = JSON.stringify(response.data.result);

            $state.go("app.area2", { crop: myJSON, sub: res });
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    };

    vm.cropMstr = function(x) {
      $ionicLoading.show();
      $scope.areaMstr = x;
      let url = $rootScope.ip + "createArea.php";
      let req = {
        mode: "cropMstr",
        config: $rootScope.cropSet,
        global: $rootScope.global
      };
      $http.post(url, req).then(
        function suscess(response) {
          // console.log(response);
          if (response.data.status == true) {
            delete $scope.mstrCrop;
            $ionicSlideBoxDelegate.slide(0);
            $scope.mstrCrop = response.data.result;

            $timeout(function() {
              $scope.modalcrop.show();
              $ionicLoading.hide();
            }, 1000);
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    };

    $scope.lockSlide = function() {
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    vm.mstrCropSelect = function(e) {
      let myJSON = JSON.stringify(e);
      let myJsonarea = JSON.stringify($scope.areaMstr);
      $state.go("app.add6", { cropMstr: myJSON, areaMstr: myJsonarea });
    };
  })

  .controller("area2Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog
  ) {
    let vm = this;
    //modal
    {
      $ionicModal
        .fromTemplateUrl("my-map.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalmap = modal;
        });

      $scope.openModalMap = function() {
        $scope.modalmap.show();
      };
      $scope.closeModalMap = function() {
        $scope.modalmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalmap.remove();
      });

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
        $scope.drawCheck = false;
        $scope.modaledit.hide();
      };

      $scope.$on("$destroy", function() {
        $scope.modaledit.remove();
      });

      $ionicModal
        .fromTemplateUrl("my-detail.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modaldetail = modal;
        });

      $scope.openModalDetail = function() {
        $scope.modaldetail.show();
      };
      $scope.closeModalDetail = function() {
        $scope.modaldetail.hide();
      };

      $scope.$on("$destroy", function() {
        $scope.modaldetail.remove();
      });
    }

    $scope.model = { farm_desc: null, farm_startt: null, farm_endt: null };
    $scope.count = [1, 2, 3, 4, 5];

    $scope.crop = JSON.parse($stateParams.crop);
    $scope.subfarm = JSON.parse($stateParams.sub);
    console.log($scope.crop);
    console.log($scope.subfarm);

    vm.here = function() {
      map.setZoom(17);
      map.panTo(bounds.getCenter());
    };

    var triangleCoords = [];
    var all_overlays = [];

    var polygonCoords = [];
    var polygonCoordsFarm = [];

    var bounds = new google.maps.LatLngBounds();
    var areaFarm = new google.maps.LatLngBounds();

    var color = [
      "#ff0000",
      "#8cff00",
      "#0048ff",
      "#f6ff00",
      "#9604f7",
      "#f77104",
      "#02fcf4",
      "#eb01fc",
      "#ff0000",
      "#8cff00",
      "#0048ff",
      "#f6ff00",
      "#9604f7",
      "#f77104",
      "#02fcf4",
      "#eb01fc",
      "#ff0000",
      "#8cff00",
      "#0048ff",
      "#f6ff00",
      "#9604f7",
      "#f77104",
      "#02fcf4",
      "#eb01fc"
    ];

    var map = new google.maps.Map(document.getElementById("mapsdetail"), {
      zoom: 5,
      // center: bounds.getCenter(),
      center: new google.maps.LatLng(13.760412, 100.485357),
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeId: "satellite",
      mapTypeControl: false,
      zoomControl: false
    });

    vm.allPolygon = function() {
      if ($scope.subfarm.length > 0) {
        for (i = 0; i < all_overlays.length; i++) {
          all_overlays[i].setMap(null); //or line[i].setVisible(false);
        }
        triangleCoords = [];
        all_overlays = [];
        polygonCoords = [];
        bounds = new google.maps.LatLngBounds();
        for (let e = 0; e < $scope.subfarm.length; e++) {
          triangleCoords.push([]);
          $scope.positionPolygon = {
            lat: $scope.subfarm[e].sub_lat.split(","),
            lng: $scope.subfarm[e].sub_lng.split(",")
          };

          for (let i = 0; i < $scope.positionPolygon.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.positionPolygon.lat[i]),
              lng: parseFloat($scope.positionPolygon.lng[i])
            };
            polygonCoords.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
            triangleCoords[e].push(k); // เอาไปวาดเส้น
          }
          // console.log(polygonCoords);
          // console.log(triangleCoords[e]);

          for (let i = 0; i < polygonCoords.length; i++) {
            bounds.extend(polygonCoords[i]);
          }

          var bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoords[e],
            strokeColor: color[e],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color[e],
            fillOpacity: 0.35
          });

          all_overlays.push(bermudaTriangle);
          all_overlays[e].setMap(map);
        }

        // map.setCenter(bounds.getCenter());
        // map.setZoom(16);
        // map.panTo(bounds.getCenter());

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }
    };
    //ทำตอนเริ่ม
    vm.allPolygon();

    vm.selectSub = function(e, index) {
      $scope.subDetail = e;
      $scope.modaldetail.show();

      for (i = 0; i < all_overlays.length; i++) {
        all_overlays[i].setMap(null); //or line[i].setVisible(false);
      }

      triangleCoords = [];
      all_overlays = [];
      polygonCoords = [];
      bounds = new google.maps.LatLngBounds();
      $scope.abc = {
        lat: e.sub_lat.split(","),
        lng: e.sub_lng.split(",")
      };

      // console.log($scope.abc);

      $timeout(function() {
        // console.log("666666");

        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i])
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // console.log(triangleCoords);

        for (i = 0; i < polygonCoords.length; i++) {
          bounds.extend(polygonCoords[i]);
        }

        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: color[index],
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: color[index],
          fillOpacity: 0.35
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        // map.setZoom(17);
        // map.panTo(bounds.getCenter());

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
        // $ionicLoading.hide();
      }, 100);
    };

    vm.editmap = function() {
      $scope.modaledit.hide();
      $timeout(function() {
        $scope.modalmap.show();
      }, 500);
    };

    vm.save = function() {
      console.log($scope.outOf);
      if ($scope.outOf) {
        $scope.modalmap.hide();
        $timeout(function() {
          $scope.modaledit.show();
          if ($scope.PolygonPatch) {
            // console.log($scope.PolygonPatch);
          }
        }, 1000);
      } else {
        mobiscroll.alert({
          title: "แจ้งเตือน",
          message: "ไม่สามารถเพิ่มพื้นที่นี้ได้ กรุณาตรวจสอบพื้นที่อีกครั้ง",
          callback: function() {}
        });
      }
    };

    $scope.areaFarm = {
      lat: $scope.crop.farm_lat.split(","),
      lng: $scope.crop.farm_lng.split(",")
    };

    vm.createSubmap = function() {
      $scope.modalmap.show();

      let triangleCoords = [];
      for (let i = 0; i < $scope.areaFarm.lat.length; i++) {
        let k = {
          lat: parseFloat($scope.areaFarm.lat[i]),
          lng: parseFloat($scope.areaFarm.lng[i])
        };
        polygonCoordsFarm.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
        triangleCoords.push(k); // เอาไปวาดเส้น
      }

      for (let i = 0; i < polygonCoordsFarm.length; i++) {
        areaFarm.extend(polygonCoordsFarm[i]);
      }

      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      function clearMarkers() {
        setMapOnAll(null);
      }

      var all_overlays = [];
      var selectedShape;
      $scope.PolygonPatch = [];
      let all_overlaysbase = [];

      $scope.data;

      function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#fff";
        controlUI.style.border = "2px solid #fff";
        controlUI.style.borderRadius = "10px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginBottom = "22px";
        controlUI.style.marginTop = "10px";
        controlUI.style.marginRight = "10px";
        controlUI.style.textAlign = "center";
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement("div");
        controlText.style.color = "rgb(25,25,25)";
        controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "38px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";

        controlText.innerHTML = "<i class='icon ion-trash-a'> ลบเส้น";
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener("click", function() {
          deleteSelectedShape();
        });
      }

      function clearSelection() {
        if (selectedShape) {
          selectedShape.setEditable(false);
          selectedShape = null;
        }
      }

      function setSelection(shape) {
        infowindow.open(map);
        clearSelection();
        selectedShape = shape;
        shape.setEditable(true);
      }

      function deleteSelectedShape() {
        if (selectedShape) {
          infowindow.close();
          $scope.PolygonPatch = [];
          selectedShape.setMap(null);
          // To show:
          drawingManager.setOptions({
            drawingControl: false
          });

          vm.newShape = null;
        }
      }

      function showoutput() {
        alert($scope.data);
      }

      vm.drawstatus = false;
      vm.newShape = null;

      vm.delete = function() {
        deleteSelectedShape();
        vm.drawstatus = !vm.drawstatus;
      };

      vm.draw = function() {
        vm.drawstatus = !vm.drawstatus;
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      };

      //Set map
      var map = new google.maps.Map(document.getElementById("maps"), {
        center: areaFarm.getCenter(),
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: ["satellite", "roadmap", "hybrid"]
        },
        mapTypeId: "satellite",
        zoom: 18
      });

      var infowindow = new google.maps.InfoWindow();
      var centerControlDiv = document.createElement("div");
      // var centerControl = new CenterControl(centerControlDiv, map);
      // centerControlDiv.index = 1;
      // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
      //   centerControlDiv
      // );

      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
          drawingModes: ["polygon"]
        },
        polygonOptions: {
          clickable: true,
          editable: true,
          draggable: false,
          fillColor: "green",
          strokeColor: "green",
          strokeWeight: 4,
          strokeOpacity: 0.9,
          fillOpacity: 0.3
        },
        drawingMode: null
      });
      infowindow.open(map);
      google.maps.event.addListener(drawingManager, "polygoncomplete", function(
        polygon
      ) {
        $scope.checkOutOfArea = function(polygon) {
          let checkOutArea = [];
          let patch = polygon.getPath();
          for (var i = 0; i < polygon.getPath().length; i++) {
            let test = new google.maps.LatLng(
              patch
                .getAt(i)
                .lat()
                .toFixed(5),
              patch
                .getAt(i)
                .lng()
                .toFixed(5)
            );
            let resultArea = google.maps.geometry.poly.containsLocation(
              test,
              bermudaTriangle
            )
              ? true
              : false;

            checkOutArea.push(resultArea);
          }

          if (checkOutArea.includes(false)) {
            return false;
          } else {
            return true;
          }
        };

        /// Disable Controller//
        drawingManager.setOptions({
          drawingControl: false
        });

       $scope.$apply(function() {
        vm.newShape = polygon;
        vm.newShape.type = polygon;
      });

        all_overlays.push(polygon);
        drawingManager.setDrawingMode(null);

        vm.newShape = polygon;
        vm.newShape.type = polygon;

        //Edit point
        google.maps.event.addListener(
          vm.newShape.getPath(),
          "set_at",
          function() {
            // console.log(newShape.getPath())
            cal(vm.newShape.getPath());
            $scope.outOf = $scope.checkOutOfArea(polygon);
          }
        );

        //Insert point
        google.maps.event.addListener(
          vm.newShape.getPath(),
          "insert_at",
          function() {
            cal(vm.newShape.getPath());
            $scope.outOf = $scope.checkOutOfArea(polygon);
          }
        );

        //click shape
        google.maps.event.addListener(vm.newShape, "click", function(e) {
          console.log(vm.newShape.getPath());
          setSelection(vm.newShape);
        });
        setSelection(vm.newShape);

        // คำนวนและแสดง
        function cal(patch) {
          $scope.PolygonPatch = [];
          for (var i = 0; i < patch.length; i++) {
            $scope.PolygonPatch.push({
              lat: patch
                .getAt(i)
                .lat()
                .toFixed(5),
              lng: patch
                .getAt(i)
                .lng()
                .toFixed(5)
            });
          }
          console.log($scope.PolygonPatch);

          // $scope.PolygonPatch = coordinates;

          // $scope.PolygonPatch.push(coordinates)
          // console.log($scope.PolygonPatch)
          // ตารางเมตร
          var areaM2 = google.maps.geometry.spherical.computeArea(patch);
          // เอเคอร์
          var acreFormula = 0.00024711,
            // ไร่
            farmFormula = 0.000625,
            //ตารางวา
            wahFormula = 0.25,
            //งาน
            workFormula = 0.0025;

          var rai, ngan, wah;
          var modRai, modNgan, modWah;

          rai = parseInt(areaM2 / 1600);
          modRai = areaM2 % 1600;

          ngan = parseInt(modRai / 400);
          modNgan = modRai % 400;

          wah = parseInt(modNgan / 4);

          var areaAC = (areaM2 * acreFormula).toFixed(3);
          var areaFarm = (areaM2 * farmFormula).toFixed(3);
          var areaWah = (areaM2 * wahFormula).toFixed(3);
          var areaWork = (areaM2 * workFormula).toFixed(3);

          vm.area = {
            m2: areaM2.toFixed(3),
            ac: areaAC,
            // farm: areaFarm,
            // work: areaWork,
            // wah: areaWah,
            farm: rai,
            work: ngan,
            wah: wah
          };
          console.log(vm.area);

          // console.log("ตารางเมตร", areaM2.toFixed(3))
          // console.log("ไร่ , =", areaFarm.toFixed(3))
          // console.log("เอเคอร์, =", areaAC.toFixed(3))
          // console.log("ตารางวา =", areaWah.toFixed(3))
          // console.log("งาน =", areaWork.toFixed(3))

          // infowindow.setContent("Area/ตารางเมตร =" + vm.area.m2 + " sq meters<br>" +
          //   "Area/เอเคอร์ =" + vm.area.ac + " Acre<br>");

          let message = $scope.checkOutOfArea(vm.newShape)
            ? ""
            : "แปลงที่สร้างต้องอยู่ในพื้นที่ ที่กำหนดไว้เท่านั้น";

          console.log(message);

          infowindow.setContent(
            '<div id="contentmap">' +
              // '   <img src="img/maxresdefault.jpg" style="height:100px;">' +
              '<div id="bodyContent" >' +
              // "<br><b>Description</b><br><br> " +
              // "<p>พันธุ์ : - <br> " +
              // "<p>อายุ : - <br> " +
              // "<p>อื่นๆ : - <br> " +
              "<p> " +
              "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
              "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
              vm.area.m2 +
              " ตารางเมตร<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.farm +
              " &nbspไร่<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.work +
              " งาน<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.wah +
              " ตารางวา<br> " +
              "<b style='color:red'>" +
              message +
              "</div>" +
              "</div>"
            // '<div style="margin-top:10px"><button type="button" class="button button-small button-assertive icon ion-trash-a" ></button>' +
            // '<button type="button" class="button button-small  button-positive icon ion-edit" style="margin-left:3px"></button>' +
            // "</div>"
          );

          infowindow.setPosition(polygon.getPath().getAt(0));
        }

        infowindow.open(map);
        cal(polygon.getPath());
        $scope.outOf = $scope.checkOutOfArea(polygon);
      });

      let triangleCoordsSub = [];
      let all_overlaysSub = [];
      let polygonCoordsSub = [];
      let boundsSub = new google.maps.LatLngBounds();

      for (let e = 0; e < $scope.subfarm.length; e++) {
        triangleCoordsSub.push([]);
        let positionPolygon = {
          lat: $scope.subfarm[e].sub_lat.split(","),
          lng: $scope.subfarm[e].sub_lng.split(",")
        };

        for (let i = 0; i < positionPolygon.lat.length; i++) {
          let k = {
            lat: parseFloat(positionPolygon.lat[i]),
            lng: parseFloat(positionPolygon.lng[i])
          };

          polygonCoordsSub.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
          triangleCoordsSub[e].push(k); // เอาไปวาดเส้น
        }

        // for (let i = 0; i < polygonCoordsSub.length; i++) {
        //   boundsSub.extend(polygonCoordsSub[i]);

        // }

        var bermudaTriangles = new google.maps.Polygon({
          editable: false,
          paths: triangleCoordsSub[e],
          strokeColor: "yellow",
          strokeOpacity: 0.9,
          strokeWeight: 4,
          fillColor: "green",
          fillOpacity: 0.3
        });

        all_overlaysSub.push(bermudaTriangles);
        all_overlaysSub[e].setMap(map);
      }

      /// พื้นที่ใหญ่ทั้งหมด
      var bermudaTriangle = new google.maps.Polygon({
        editable: false,
        paths: triangleCoords,
        strokeColor: "red",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        fillColor: "none",
        fillOpacity: 0.0
      });
      bermudaTriangle.setMap(map);
      drawingManager.setMap(map);

      map.fitBounds(areaFarm);
      map.panTo(areaFarm.getCenter());
    };

    vm.createSub = function() {
      $ionicLoading.show();
      let lat = "";
      let lng = "";
      for (let i = 0; i < $scope.PolygonPatch.length; i++) {
        lat += $scope.PolygonPatch[i].lat + ",";
        lng += $scope.PolygonPatch[i].lng + ",";
      }
      // let reslat = lat

      let sublat = lat.substring(0, lat.length - 1);
      let sublng = lng.substring(0, lng.length - 1);

      let resposition = {
        lat: sublat,
        lng: sublng
      };
      let url = $rootScope.ip + "createArea.php";
      let req = {
        mode: "createSubFarm",
        area: vm.area,
        position: resposition,
        name: $scope.model,
        farm: $scope.crop
      };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response);
          if (response.data.status == true) {
            mobiscroll.toast({
              message: "สร้างพื้นที่เกษตรกรเรียบร้อยแล้ว",
              color: "success"
            });

            // $state.go("app.collectormenu");
            $timeout(function() {
              $ionicLoading.hide();
              $ionicHistory.goBack();
              console.log("clear");
            }, 1000);
          } else {
            $ionicLoading.hide();
            Service.timeout();
          }
        },
        function err(err) {
          $ionicLoading.hide();
          Service.timeout();
        }
      );
    };

    vm.connect = function(e) {
      console.log(e);
      $scope.modaldetail.hide();

      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog
        .prompt()
        .title("เชื่อมต่ออุปกรณ์")
        .textContent(
          "ป้อนรหัสอุปกรณ์เพื่อเชื่อมต่อกับโรงเรือนที่ " + e.sup_sub_id
        )
        .placeholder("รหัสอุปกรณ์,IOT ID")
        .ariaLabel("รหัสอุปกรณ์,IOT ID")
        .initialValue()
        .targetEvent()
        .required(false)
        .ok("เชื่อมต่อ")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function(result) {
          if (result) {
            $ionicLoading.show();
            let url = $rootScope.ip + "area.php";
            let req = {
              mode: "syncIOT",
              sub: e,
              iotid: result.toUpperCase(),
              global: $rootScope.global
            };
            $http.post(url, req).then(
              function suscess(response) {
                $ionicLoading.hide();

                if (response.data.status == "allow") {
                  $mdDialog.show(
                    $mdDialog
                      .alert()
                      .parent(
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
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

                  $ionicHistory.goBack();
                } else if (response.data.status == "notallow") {
                  $mdDialog.show(
                    $mdDialog
                      .alert()
                      .parent(
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
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
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
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
          }
        },
        function(e) {}
      );
    };

    vm.disconnect = function(e) {
      $scope.modaldetail.hide();
      var confirm = $mdDialog
        .confirm()
        .title("ต้องการยกเลิกการเชื่อมต่อหรือไม่ ?")
        .textContent(
          "เมื่อยกเลิกการเชื่อมต่อกับอุปกรณ์ " +
            e.iot_id +
            "  คุณจะไม่สามารถดูรายละเอียดของอุปกรณ์ และการตั้งค่าอุปกรณ์ได้"
        )
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน. ยกเลิกการเชื่อมต่อ")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function() {
          $ionicLoading.show();
          let url = $rootScope.ip + "area.php";
          let req = {
            mode: "dissyncIOT",
            sub: e,
            global: $rootScope.global
          };
          $http.post(url, req).then(
            function suscess(response) {
              $ionicLoading.hide();
              $ionicHistory.goBack();
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
            function err(err) {}
          );
        },
        function() {
          console.log("2");
        }
      );

      console.log(e);
    };

    vm.deleteSub = function(e) {
      $scope.modaldetail.hide();
      var confirm = $mdDialog
        .confirm()
        .title("ต้องการลบแปลงนี้ใช่หรือไม่ ?")
        .textContent(
          "เมื่อลบแปลงนี้" +
            "หากคุณเชื่อมต่ออุปกรณ์อยู่ จะยกเลิกการเชื่อมต่ออัตโนมัติ ต้องการลบแปลงนี้หรือไม่ ?"
        )
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน.")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function() {
          $ionicLoading.show();
          let url = $rootScope.ip + "area.php";
          let req = {
            mode: "deleteSub",
            sub: e,
            global: $rootScope.global
          };
          $http.post(url, req).then(
            function suscess(response) {
              console.log(response.data);
              $ionicHistory.goBack();
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("ลบแปลงนี้เรียบร้อยแล้ว")
                  .textContent("ลบแปลงนี้เรียบร้อยแล้ว เปิดรายการดูอีกครั้ง")
                  .ariaLabel("Alert Dialog Demo")
                  .ok("Got it!")
                  .targetEvent()
              );
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
        },
        function() {}
      );

      console.log(e);
    };
  });

angular
  .module("app")
  .controller("addCtrl", function(
    $http,
    $rootScope,
    $ionicHistory,
    $state,
    $scope
  ) {
    let vm = this;
    // $scope.data = [];
    function onStart() {
      let url = $rootScope.ip + "login.php";
      let req = { mode: "user", config: $rootScope.global };
      $http.post(url, req).then(
        function suscess(response) {
          if (response.data.status == true) {
            $scope.data = response.data;
          } else {
          }
        },
        function err(err) {}
      );
    }

    onStart();

    $scope.dtOptions = {
      searching: false,
      paging: true,
      ordering: false,
      info: false, // Showing 1 to 6 of 6 entries
      lengthChange: false
    };

    vm.farmerdetail = function(e) {
      let myJSON = JSON.stringify(e);
      $state.go("app.add2", { farmer: myJSON });
    };
  })

  .controller("add2Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog
  ) {
    let vm = this;
    $scope.aaa = function() {
      console.log("10");
    };
    $scope.doRefresh = function() {
      // here refresh data code
      $scope.$broadcast("scroll.refreshComplete");
      $scope.$apply();
      onStart();
    };
    function onStart() {
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "selectCrop", config: $rootScope.farmerdetail };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response);
          if (response.data.status == true) {
            $scope.data = response.data;
            console.log($scope.data);
          } else {
            $scope.data = response.data;
          }
        },
        function err(err) {}
      );
    }

    onStart();

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

    $ionicModal
      .fromTemplateUrl("my-map.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modalmap = modal;
      });

    $scope.openModalMap = function() {
      $scope.modalmap.show();
    };
    $scope.closeModalMap = function() {
      $scope.modalmap.hide();
    };

    $scope.$on("$destroy", function() {
      $scope.modalmap.remove();
    });

    //Set $scope.map to null
    $scope.$on("modalmap.hidden", function() {
      $scope.$on("$destroy", function() {});
    });

    let platform = ionic.Platform.platform();

    vm.updatepickdate = function() {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.editdata.crop_startt = data;
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
                  $scope.editdata.crop_startt = $scope.datamodal.date;
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
            $scope.editdata.crop_endt = data;
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
                  $scope.editdata.crop_endt = $scope.datamodal.date;
                }
              }
            }
          ]
        });
      }
    };

    vm.edit = function(e) {
      $scope.modaledit.show();
      $scope.editdata = angular.copy(e);
      console.log($scope.editdata);
      $scope.positionEdit = {
        lat: $scope.editdata.crop_lat.split(","),
        lng: $scope.editdata.crop_lng.split(",")
      };
    };

    vm.deleteCrop = function() {
      mobiscroll.confirm({
        title: "Use location service?",
        message:
          "Help apps determine location. This means sending anonymous location data, even when no apps are running.",
        okText: "Agree",
        cancelText: "Disagree",
        callback: function(res) {
          if (res) {
            $ionicLoading.show();
            let url = $rootScope.ip + "createArea.php";
            let req = { mode: "deleteCrops", data: $scope.editdata };
            $http.post(url, req).then(
              function(response) {
                if (response.data.status == true) {
                  $ionicLoading.hide();
                  $timeout(function() {
                    delete $scope.data;
                    $scope.modaledit.hide();
                    mobiscroll.toast({
                      message: "ลบ Crop เรียบร้อย",
                      color: "success"
                    });
                    onStart();
                  }, 200);
                } else {
                  Service.timeout();
                }
              },
              function err(err) {
                Service.timeout();
              }
            );
          }
        }
      });
    };

    vm.addcrop = function() {
      $state.go("app.add3");
    };

    vm.cropdetail = function(e) {
      let myJSON = JSON.stringify(e);
      $state.go("app.add4", { crop: myJSON });
    };

    $scope.checkUpdate = function() {
      if ($scope.editdata) {
        if (
          !$scope.editdata.crop_name ||
          !$scope.editdata.crop_desc ||
          !$scope.editdata.crop_startt ||
          !$scope.editdata.crop_endt
        ) {
          return true;
        } else {
          return false;
        }
      }
    };

    vm.editMap = function(e) {
      console.log(e);
      $scope.maptitle = e;
      var locations = [];
      var farmname = [];
      // $scope.modalmap.show();
      $ionicLoading.show();

      function initMap() {
        var map = new google.maps.Map(document.getElementById("map"), {
          zoom: 6,
          center: { lat: 10.778042, lng: 100.565925 },
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeId: "satellite",
          mapTypeControl: false
        });

        //         var icon = {
        //     url: "htpngtps://i.ya-webdesign.com/images/map-marker-icons-png.", // url
        //     scaledSize: new google.maps.Size(50, 50), // scaled size
        //     origin: new google.maps.Point(0,0), // origin
        //     anchor: new google.maps.Point(0, 0) // anchor
        // };

        var markers = locations.map(function(location, i) {
          return new google.maps.Marker({
            position: location,

            label: {
              text: farmname[i],
              color: "white",
              fontSize: "18px"
            }
          });
        });

        var infowindow = new google.maps.InfoWindow({
          content: "",
          maxWidth: 200
        });

        for (let i = 0; i < locations.length; i++) {
          google.maps.event.addListener(markers[i], "click", function(marker) {
            $scope.displayDetailCluster = $scope.detailcluster[i];

            let contentString =
              '<ion-content overflow-scroll="true"><ion-scroll>' +
              '<h1 class="firstHeading"> ' +
              $scope.displayDetailCluster.farm_name +
              "</h1>" +
              "<br><b>Crop</b><br>" +
              $scope.displayDetailCluster.crop_id +
              "<br> " +
              "<br><b>รายละเอียด</b><br>" +
              $scope.displayDetailCluster.farm_desc +
              "<br> " +
              // "<p>พันธุ์ : - <br> " +
              // "<p>อายุ : - <br> " +
              // "<p>อื่นๆ : - <br> " +
              "<br><p>พื้นที่ : " +
              $scope.displayDetailCluster.farm_area_farm +
              " &nbspไร่<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              $scope.displayDetailCluster.farm_area_wah +
              " ตารางวา<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              +$scope.displayDetailCluster.farm_area_work +
              " งาน<br> " +
              "<br><b>วันที่สร้าง</b><br>" +
              $scope.displayDetailCluster.farm_startt +
              "<br> " +
              "<br><b>วันที่สิ้นสุด</b><br>" +
              $scope.displayDetailCluster.farm_endt +
              "<br> " +
              "</ion-scroll></ion-content>";

            mobiscroll.alert({
              title: $scope.displayDetailCluster.crop_id,
              message:
                "<div>" +
                "<br><b>ชื่อฟาร์ม</b> : " +
                $scope.displayDetailCluster.farm_name +
                "<br><br><b>รายละเอียด</b> : " +
                $scope.displayDetailCluster.farm_desc +
                "<br><br><b>ผู้ดูแล</b> : " +
                $scope.displayDetailCluster.createname.mob_fname +
                " " +
                $scope.displayDetailCluster.createname.mob_lname +
                "<br><br><b>พื้นที่</b>  " +
                "<br>" +
                $scope.displayDetailCluster.farm_area_farm +
                " <b>ไร่</b>" +
                "<br>" +
                $scope.displayDetailCluster.farm_area_wah +
                " <b>ตารางวา</b>" +
                "<br>" +
                $scope.displayDetailCluster.farm_area_work +
                " <b>งาน</b>" +
                "<br><br><b>วันที่สร้าง</b>  " +
                "<br>" +
                $scope.displayDetailCluster.farm_startt +
                "<br><br><b>วันที่สิ้นสุด</b>  " +
                "<br>" +
                $scope.displayDetailCluster.farm_endt +
                "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p/>" +
                "</div>",
              callback: function() {}
            });

            // infowindow.close();
            // infowindow.setContent(contentString);
            // infowindow.open(map, markers[i]);
          });
        }

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers, {
          imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
        });
      }

      let url = $rootScope.ip + "createArea.php";
      let req = {
        mode: "selectCluster",
        config: e.crop_code,
        global: $rootScope.global
      };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response.data);
          if (response.data.status == true) {
            $scope.modalmap.show();
            $ionicLoading.hide();

            $scope.detailcluster = response.data.result;

            for (let i = 0; i < response.data.result.length; i++) {
              let k = {
                lat: response.data.result[i].farm_lat.split(","),
                lng: response.data.result[i].farm_lng.split(",")
              };

              let j = {
                lat: parseFloat(k.lat[0]),
                lng: parseFloat(k.lng[0])
              };

              locations.push(j);
              farmname.push(response.data.result[i].farm_name);
            }

            console.log(locations);
            console.log(farmname);

            initMap();
          } else {
            mobiscroll.alert({
              title: "แจ้งเตือน",
              message: "ไม่มีรายการเพาะปลูกใน Crop นี้",
              callback: function() {
                // mobiscroll.toast({
                //     message: 'Alert closed'
                // });
              }
            });
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    };

    vm.updateCrop = function() {
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "editCrop", data: $scope.editdata };
      console.log(req);
      $http.post(url, req).then(
        function(response) {
          console.log(response);
          if (response.data.status == true) {
            $ionicLoading.hide();
            $timeout(function() {
              delete $scope.data;
              $scope.modaledit.hide();
              mobiscroll.toast({
                message: "แก้ไข Crop เรียบร้อย",
                color: "success"
              });
              onStart();
            }, 200);
          } else {
            Service.timeout();
          }
        },
        function err(err) {
          Service.timeout();
        }
      );
    };

    vm.search = function() {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog
        .prompt()
        .title("ค้นหา")
        .textContent(
          "ป้อนข้อมูล รหัสเกษตรกร หรือ ชื่อ,นามสกุล *หากต้องการค้นหาทั้งหมดไม่ต้องใส่ข้อมูล* "
        )
        .placeholder("รหัสเกษตรกร,ชือ,นามสกุล")
        .ariaLabel("รหัสเกษตรกร,ชือ,นามสกุล")
        .initialValue()
        .targetEvent()
        .required(false)
        .ok("ค้นหา")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function(result) {
          console.log(result);
          $scope.searchuser = result;
        },
        function(e) {}
      );
    };
  })

  .controller("add3Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $ionicHistory,
    $rootScope,
    Service,
    $cordovaGeolocation,
    deviceService,
    $ionicLoading
  ) {
    let vm = this;

    function callPosition() {
      var posOptions = { timeout: 10000, enableHighAccuracy: true };
      return $cordovaGeolocation.getCurrentPosition(posOptions).then(
        function(position) {
          vm.position = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          let latlng =
            "" +
            position.coords.latitude +
            "," +
            position.coords.longitude +
            "";

          return position;
        },
        function(err) {
          // error
        }
      );
    }
    let platform = ionic.Platform.platform();
    console.log(platform);
    function onStart() {
      function checkGPS() {
        //Call status GPS from Service and return value to statusgps
        return new Promise(function(resolve, reject) {
          deviceService.checkGPS(function(e) {
            resolve(e);
          });
        });
      }

      async function main() {
        let statusgps = await checkGPS();
        if (statusgps == "GPS_OFF") {
          if (platform == "android") {
            deviceService.opengpsAndroid(function(e) {
              if (e == "force_gps") {
                return callPosition();
              } else {
                return callPosition();
              }

              return callPosition();
            });
          } else if (platform == "ios") {
          }
        } else {
          $ionicLoading.show();
          console.log("1324");
          vm.alert = "on";
          return callPosition();
        }
      }

      if (platform == "win32" || platform == "ios" || platform == "macintel") {
        return callPosition();
      } else if (platform == "android") {
        // Android check gps ใน function
        return main();
      }
    }
    let abc = onStart();

    var markers = [];

    abc.then(function(response) {
      map.setCenter({
        lat: response.coords.latitude,
        lng: response.coords.longitude
      });
      var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.BOUNCE,
        position: {
          lat: response.coords.latitude,
          lng: response.coords.longitude
        }
      });

      markers.push(marker);
      marker.setMap(map);
      $ionicLoading.hide();
    });

    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    function clearMarkers() {
      setMapOnAll(null);
    }
    vm.here = function() {
      let ab = onStart();
      clearMarkers();
      markers = [];
      ab.then(function(response) {
        map.setCenter({
          lat: response.coords.latitude,
          lng: response.coords.longitude
        });

        var marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.BOUNCE,
          position: {
            lat: response.coords.latitude,
            lng: response.coords.longitude
          }
        });

        markers.push(marker);
        marker.setMap(map);
        console.log(markers);
        $ionicLoading.hide();
      });
    };

    var all_overlays = [];
    var selectedShape;
    $scope.PolygonPatch = [];
    $scope.data;

    vm.drawstatus = false;
    vm.newShape = null;

    function CenterControl(controlDiv, map) {
      // Set CSS for the control border.
      var controlUI = document.createElement("div");
      controlUI.style.backgroundColor = "#fff";
      controlUI.style.border = "2px solid #fff";
      controlUI.style.borderRadius = "10px";
      controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
      controlUI.style.cursor = "pointer";
      controlUI.style.marginBottom = "22px";
      controlUI.style.marginTop = "10px";
      controlUI.style.marginRight = "10px";
      controlUI.style.textAlign = "center";
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement("div");
      controlText.style.color = "rgb(25,25,25)";
      controlText.style.fontFamily = "Roboto,Arial,sans-serif";
      controlText.style.fontSize = "16px";
      controlText.style.lineHeight = "38px";
      controlText.style.paddingLeft = "5px";
      controlText.style.paddingRight = "5px";

      controlText.innerHTML = "<i class='icon ion-trash-a'> ลบเส้น";
      controlUI.appendChild(controlText);

      // Setup the click event listeners: simply set the map to Chicago.
      controlUI.addEventListener("click", function() {
        deleteSelectedShape();
      });
    }

    function clearSelection() {
      if (selectedShape) {
        selectedShape.setEditable(false);
        selectedShape = null;
      }
    }

    function setSelection(shape) {
      infowindow.open(map);
      clearSelection();
      selectedShape = shape;
      shape.setEditable(true);
    }

    function deleteSelectedShape() {
      if (selectedShape) {
        infowindow.close();
        $scope.PolygonPatch = [];
        selectedShape.setMap(null);
        // To show:
        drawingManager.setOptions({
          drawingControl: false
        });

        vm.newShape = null;
      }
    }

    function showoutput() {
      alert($scope.data);
    }

    vm.delete = function() {
      deleteSelectedShape();
      vm.drawstatus = !vm.drawstatus;
    };

    vm.draw = function() {
      vm.drawstatus = !vm.drawstatus;
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    };

    //Set map
    var map = new google.maps.Map(document.getElementById("maps"), {
      center: {
        lat: 13.713462,
        lng: 100.478819
      },
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: ["satellite", "roadmap", "hybrid"]
      },
      mapTypeId: "satellite",
      zoom: 18
    });

    var infowindow = new google.maps.InfoWindow();


    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
        drawingModes: ["polygon"]
      },
      polygonOptions: {
        clickable: true,
        editable: true,
        draggable: false,
        fillColor: "red",
        strokeColor: "green",
        strokeWeight: 3,
      },
      drawingMode: null
    });
    infowindow.open(map);
    google.maps.event.addListener(drawingManager, "polygoncomplete", function(
      polygon
    ) {
      /// Disable Controller//
      drawingManager.setOptions({
        drawingControl: false
      });

      $scope.$apply(function() {
        vm.newShape = polygon;
        vm.newShape.type = polygon;
      });

      drawingManager.setDrawingMode(null);

      //Edit point
      google.maps.event.addListener(
        vm.newShape.getPath(),
        "set_at",
        function() {
          // console.log(newShape.getPath())
          cal(vm.newShape.getPath());
        }
      );

      //Insert point
      google.maps.event.addListener(
        vm.newShape.getPath(),
        "insert_at",
        function() {
          console.log(vm.newShape.getPath());
          cal(vm.newShape.getPath());
        }
      );

      //click shape
      google.maps.event.addListener(vm.newShape, "click", function(e) {
        console.log(vm.newShape.getPath());
        setSelection(vm.newShape);
      });
      setSelection(vm.newShape);

      // คำนวนและแสดง
      function cal(patch) {
        $scope.PolygonPatch = [];
        for (var i = 0; i < patch.length; i++) {
          $scope.PolygonPatch.push({
            lat: patch
              .getAt(i)
              .lat()
              .toFixed(5),
            lng: patch
              .getAt(i)
              .lng()
              .toFixed(5)
          });
        }
        console.log($scope.PolygonPatch);

        // $scope.PolygonPatch = coordinates;

        // $scope.PolygonPatch.push(coordinates)
        // console.log($scope.PolygonPatch)
        // ตารางเมตร
        var areaM2 = google.maps.geometry.spherical.computeArea(patch);
        // เอเคอร์
        var acreFormula = 0.00024711,
          // ไร่
          farmFormula = 0.000625,
          //ตารางวา
          wahFormula = 0.25,
          //งาน
          workFormula = 0.0025;

        var rai, ngan, wah;
        var modRai, modNgan, modWah;

        rai = parseInt(areaM2 / 1600);
        modRai = areaM2 % 1600;

        ngan = parseInt(modRai / 400);
        modNgan = modRai % 400;

        wah = parseInt(modNgan / 4);

        var areaAC = (areaM2 * acreFormula).toFixed(3);
        var areaFarm = (areaM2 * farmFormula).toFixed(3);
        var areaWah = (areaM2 * wahFormula).toFixed(3);
        var areaWork = (areaM2 * workFormula).toFixed(3);

        vm.area = {
          m2: areaM2.toFixed(3),
          ac: areaAC,
          // farm: areaFarm,
          // work: areaWork,
          // wah: areaWah,
          farm: rai,
          work: ngan,
          wah: wah
        };
        console.log(vm.area);

        // console.log("ตารางเมตร", areaM2.toFixed(3))
        // console.log("ไร่ , =", areaFarm.toFixed(3))
        // console.log("เอเคอร์, =", areaAC.toFixed(3))
        // console.log("ตารางวา =", areaWah.toFixed(3))
        // console.log("งาน =", areaWork.toFixed(3))

        // infowindow.setContent("Area/ตารางเมตร =" + vm.area.m2 + " sq meters<br>" +
        //   "Area/เอเคอร์ =" + vm.area.ac + " Acre<br>");
        infowindow.setContent(
          '<div id="contentmap">' +
            '<div id="bodyContent" >' +
            "<p>" +
            "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
            "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
            vm.area.m2 +
            " ตารางเมตร<br> " +
            "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
            vm.area.farm +
            " &nbspไร่<br> " +
            "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
            vm.area.work +
            " งาน<br> " +
            "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
            vm.area.wah +
            " ตารางวา<br> " +
            "</div>"
        );

        infowindow.setPosition(polygon.getPath().getAt(0));
      }

      infowindow.open(map);
      cal(polygon.getPath());
    });

    // google.maps.event.addDomListener(document.getElementById('bt1'), 'click', deleteSelectedShape);
    // google.maps.event.addDomListener(document.getElementById('bt2'), 'click', showoutput);

    drawingManager.setMap(map);

    vm.save = function() {
      if ($scope.PolygonPatch.length) {
        // $ionicHistory.nextViewOptions({
        //   disableBack: true
        // });
        $rootScope.area = {
          area: vm.area,
          position: $scope.PolygonPatch
        };
        console.log($rootScope.area);
        console.log($rootScope.farmerdetail);

        $state.go("app.createArea");
      } else {
      }
    };

    // google.maps.event.addDomListener(window, "load", initMap);
  })

  .controller("add4Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;

    $scope.crop = { frm_code: $rootScope.global.mob_farm_code };
    console.log($scope.crop);

    $rootScope.cropSet = $scope.crop;

    $scope.doRefresh = function() {
      // here refresh data code
      $scope.$broadcast("scroll.refreshComplete");
      $scope.$apply();
      onStart();
    };

    function onStart() {
      let url = $rootScope.ip + "createArea.php";
      let req = {
        mode: "selectFarm",
        config: $rootScope.cropSet,
        global: $rootScope.global
      };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response);
          if (response.data.status == true) {
            $scope.data = response.data;
          } else {
            $scope.data = response.data;
          }
        },
        function err(err) {
          $scope.data = [];
        }
      );
    }

    onStart();

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

    $ionicModal
      .fromTemplateUrl("my-map.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modalmap = modal;
      });

    $scope.openModalMap = function() {
      $scope.modalmap.show();
    };
    $scope.closeModalMap = function() {
      $scope.modalmap.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function() {
      $scope.modalmap.remove();
    });

    $ionicModal
      .fromTemplateUrl("my-crop.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modalcrop = modal;
      });

    $scope.openModalCrop = function() {
      $scope.modalcrop.show();
    };
    $scope.closeModalCrop = function() {
      $scope.modalcrop.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function() {
      $scope.modalcrop.remove();
    });

    let platform = ionic.Platform.platform();

    vm.updatepickdate = function() {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.editdata.farm_startt = data;
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
                  $scope.editdata.farm_startt = $scope.datamodal.date;
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
            $scope.editdata.farm_endt = data;
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
                  $scope.editdata.farm_endt = $scope.datamodal.date;
                }
              }
            }
          ]
        });
      }
    };

    vm.edit = function(e) {
      $scope.modaledit.show();
      $scope.editdata = angular.copy(e);
      console.log($scope.editdata);
      $scope.positionEdit = {
        lat: $scope.editdata.farm_lat.split(","),
        lng: $scope.editdata.farm_lng.split(",")
      };
    };

    vm.deleteCrop = function() {
      mobiscroll.confirm({
        title: "Use location service?",
        message:
          "Help apps determine location. This means sending anonymous location data, even when no apps are running.",
        okText: "Agree",
        cancelText: "Disagree",
        callback: function(res) {
          if (res) {
            $ionicLoading.show();
            let url = $rootScope.ip + "createArea.php";
            let req = { mode: "deleteCrops", data: $scope.editdata };
            $http.post(url, req).then(
              function(response) {
                if (response.data.status == true) {
                  $ionicLoading.hide();
                  $timeout(function() {
                    delete $scope.data;
                    $scope.modaledit.hide();
                    mobiscroll.toast({
                      message: "ลบ Crop เรียบร้อย",
                      color: "success"
                    });
                    onStart();
                  }, 200);
                } else {
                  $ionicLoading.hide();
                  Service.timeout();
                }
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          }
        }
      });
    };

    vm.addcrop = function() {
      $state.go("app.add3");
    };

    vm.add5 = function(e) {
      $ionicLoading.show();
      console.log(e);
      let myJSON = JSON.stringify(e);
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "selectsubfarm", value: e };
      $http.post(url, req).then(
        function suscess(response) {
          if (response.data.status == true) {
            $ionicLoading.hide();

            let res = JSON.stringify(response.data.result);

            $state.go("app.add5", { crop: myJSON, sub: res });
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    };

    $scope.checkUpdate = function() {
      if ($scope.editdata) {
        if (
          !$scope.editdata.farm_name ||
          !$scope.editdata.farm_user1 ||
          !$scope.editdata.farm_desc ||
          !$scope.editdata.farm_startt ||
          !$scope.editdata.farm_endt
        ) {
          return true;
        } else {
          return false;
        }
      }
    };

    vm.editMap = function() {
      console.log($scope.positionEdit);
      $scope.modaledit.hide();
      $timeout(function() {
        $scope.modalmap.show();

        var all_overlays = [];
        var selectedShape;
        $scope.PolygonPatch = [];

        $scope.data;

        function CenterControl(controlDiv, map) {
          // Set CSS for the control border.
          var controlUI = document.createElement("div");
          controlUI.style.backgroundColor = "#fff";
          controlUI.style.border = "2px solid #fff";
          controlUI.style.borderRadius = "3px";
          controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
          controlUI.style.cursor = "pointer";
          controlUI.style.marginBottom = "22px";
          controlUI.style.marginTop = "10px";
          controlUI.style.marginRight = "10px";
          controlUI.style.textAlign = "center";
          controlDiv.appendChild(controlUI);

          // Set CSS for the control interior.
          var controlText = document.createElement("div");
          controlText.style.color = "rgb(25,25,25)";
          controlText.style.fontFamily = "Roboto,Arial,sans-serif";
          controlText.style.fontSize = "16px";
          controlText.style.lineHeight = "38px";
          controlText.style.paddingLeft = "5px";
          controlText.style.paddingRight = "5px";

          controlText.innerHTML = "Remove";
          controlUI.appendChild(controlText);

          // Setup the click event listeners: simply set the map to Chicago.
          controlUI.addEventListener("click", function() {
            deleteSelectedShape();
          });
        }

        function clearSelection() {
          if (selectedShape) {
            selectedShape.setEditable(false);
            selectedShape = null;
          }
        }

        function setSelection(shape) {
          infowindow.open(map);
          // console.log(shape)
          clearSelection();
          selectedShape = shape;
          shape.setEditable(true);
        }

        function deleteSelectedShape() {
          if (selectedShape) {
            infowindow.close();
            $scope.PolygonPatch = [];
            selectedShape.setMap(null);
            // To show:
            drawingManager.setOptions({
              drawingControl: true
            });
          }
        }

        function showoutput() {
          alert($scope.data);
        }

        //Set map
        var map = new google.maps.Map(document.getElementById("maps"), {
          center: {
            lat: 13.713462,
            lng: 100.478819
          },
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ["satellite", "roadmap", "hybrid"]
          },
          mapTypeId: "satellite",
          zoom: 19
        });

        var infowindow = new google.maps.InfoWindow();
        var centerControlDiv = document.createElement("div");
        var centerControl = new CenterControl(centerControlDiv, map);
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          centerControlDiv
        );

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
            drawingModes: ["polygon"]
          },
          polygonOptions: {
            clickable: true,
            editable: true,
            draggable: false,
            fillColor: "red",
            strokeColor: "green",
            strokeWeight: 3
          },
          drawingMode: null
        });
        // infowindow.open(map);
        google.maps.event.addListener(
          drawingManager,
          "polygoncomplete",
          function(polygon) {
            /// Disable Controller//
            drawingManager.setOptions({
              drawingControl: false
            });

            all_overlays.push(polygon);
            console.log(all_overlays);
            drawingManager.setDrawingMode(null);

            var newShape = polygon;
            // newShape.type = polygon;

            //Edit point
            google.maps.event.addListener(
              newShape.getPath(),
              "set_at",
              function() {
                console.log("set_at");
                cal(newShape.getPath());
              }
            );

            //Insert point
            google.maps.event.addListener(
              newShape.getPath(),
              "insert_at",
              function() {
                console.log("insert_at");
                console.log(newShape.getPath());
                cal(newShape.getPath());
              }
            );

            //click shape
            google.maps.event.addListener(newShape, "click", function(e) {
              setSelection(newShape);
            });
            setSelection(newShape);

            // คำนวนและแสดง
            function cal(patch) {
              $scope.PolygonPatch = [];
              for (var i = 0; i < patch.length; i++) {
                $scope.PolygonPatch.push({
                  lat: patch
                    .getAt(i)
                    .lat()
                    .toFixed(5),
                  lng: patch
                    .getAt(i)
                    .lng()
                    .toFixed(5)
                });
              }
              console.log($scope.PolygonPatch);

              // ตารางเมตร
              var areaM2 = google.maps.geometry.spherical.computeArea(patch);
              // เอเคอร์
              var acreFormula = 0.00024711,
                // ไร่
                farmFormula = 0.000625,
                //ตารางวา
                wahFormula = 0.25,
                //งาน
                workFormula = 0.0025;

              var areaAC = (areaM2 * acreFormula).toFixed(3);
              var areaFarm = (areaM2 * farmFormula).toFixed(3);
              var areaWah = (areaM2 * wahFormula).toFixed(3);
              var areaWork = (areaM2 * workFormula).toFixed(3);

              var rai, ngan, wah;
              var modRai, modNgan, modWah;

              rai = parseInt(areaM2 / 1600);
              modRai = areaM2 % 1600;

              ngan = parseInt(modRai / 400);
              modNgan = modRai % 400;

              wah = parseInt(modNgan / 4);

              vm.area = {
                m2: areaM2.toFixed(3),
                ac: areaAC,
                // farm: areaFarm,
                // work: areaWork,
                // wah: areaWah,
                farm: rai,
                work: ngan,
                wah: wah
              };

              console.log(vm.area);

              infowindow.setContent(
                '<div id="contentmap">' +
                  '<div id="bodyContent" >' +
                  "<p>" +
                  "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
                  "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
                  vm.area.m2 +
                  " ตารางเมตร<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.farm +
                  " &nbspไร่<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.work +
                  " งาน<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.wah +
                  " ตารางวา<br> " +
                  "</div>"
              );

              infowindow.setPosition(polygon.getPath().getAt(0));
            }

            infowindow.open(map);
            cal(polygon.getPath());
          }
        );

        drawingManager.setMap(map);

        vm.save = function() {
          if ($scope.PolygonPatch.length) {
            $scope.modalmap.hide();
            $timeout(function() {
              $scope.modaledit.show();
              let area = {
                area: vm.area,
                position: $scope.PolygonPatch
              };

              let lat = "";
              let lng = "";
              for (let i = 0; i < area.position.length; i++) {
                lat += area.position[i].lat + ",";
                lng += area.position[i].lng + ",";
              }
              // let reslat = lat

              let sublat = lat.substring(0, lat.length - 1);
              let sublng = lng.substring(0, lng.length - 1);

              let resposition = {
                lat: lat.substring(0, lat.length - 1),
                lng: lng.substring(0, lng.length - 1)
              };
              let z = {
                lat: resposition.lat.split(","),
                lng: resposition.lng.split(",")
              };
              console.log(area.area);
              console.log(resposition);

              $scope.editdata.farm_area_acre = area.area.ac;
              $scope.editdata.farm_area_farm = area.area.farm;
              $scope.editdata.farm_area_m2 = area.area.m2;
              $scope.editdata.farm_area_wah = area.area.wah;
              $scope.editdata.farm_area_work = area.area.work;
              $scope.editdata.farm_lat = resposition.lat;
              $scope.editdata.farm_lng = resposition.lng;

              $scope.positionEdit = z;
            }, 500);
          } else {
          }
        };

        var triangleCoords = [];
        for (let i = 0; i < $scope.positionEdit.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.positionEdit.lat[i]),
            lng: parseFloat($scope.positionEdit.lng[i])
          };
          triangleCoords.push(k);
        }

        // Construct the polygon.
        var bermudaTriangle = new google.maps.Polygon({
          editable: true,
          paths: triangleCoords,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35
        });

        drawingManager.setOptions({
          drawingControl: false
        });

        all_overlays.push(bermudaTriangle);

        google.maps.event.addListener(bermudaTriangle, "click", function(e) {
          setSelection(bermudaTriangle);
        });

        setSelection(bermudaTriangle);

        function cal(patch) {
          vm.area = {};
          $scope.PolygonPatch = [];
          for (var i = 0; i < patch.length; i++) {
            $scope.PolygonPatch.push({
              lat: patch
                .getAt(i)
                .lat()
                .toFixed(5),
              lng: patch
                .getAt(i)
                .lng()
                .toFixed(5)
            });
          }
          // console.log($scope.PolygonPatch);

          // ตารางเมตร
          let areaM2 = google.maps.geometry.spherical.computeArea(patch);
          // เอเคอร์
          let acreFormula = 0.00024711,
            // ไร่
            farmFormula = 0.000625,
            //ตารางวา
            wahFormula = 0.25,
            //งาน
            workFormula = 0.0025;

          let areaAC = (areaM2 * acreFormula).toFixed(3);
          let areaFarm = (areaM2 * farmFormula).toFixed(3);
          let areaWah = (areaM2 * wahFormula).toFixed(3);
          let areaWork = (areaM2 * workFormula).toFixed(3);

          var rai, ngan, wah;
          var modRai, modNgan, modWah;

          rai = parseInt(areaM2 / 1600);
          modRai = areaM2 % 1600;

          ngan = parseInt(modRai / 400);
          modNgan = modRai % 400;

          wah = parseInt(modNgan / 4);

          vm.area = {
            m2: areaM2.toFixed(3),
            ac: areaAC,
            // farm: areaFarm,
            // work: areaWork,
            // wah: areaWah,
            farm: rai,
            work: ngan,
            wah: wah
          };

          infowindow.setContent(
            '<div id="contentmap">' +
              '<div id="bodyContent" >' +
              "<p>" +
              "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
              "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
              vm.area.m2 +
              " ตารางเมตร<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.farm +
              " &nbspไร่<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.work +
              " งาน<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.wah +
              " ตารางวา<br> " +
              "</div>"
          );

          infowindow.setPosition(bermudaTriangle.getPath().getAt(0));
        }

        infowindow.open(map);
        cal(bermudaTriangle.getPath());

        google.maps.event.addListener(
          bermudaTriangle.getPath(),
          "set_at",
          function() {
            console.log("set_at");
            cal(bermudaTriangle.getPath());
          }
        );

        google.maps.event.addListener(
          bermudaTriangle.getPath(),
          "insert_at",
          function() {
            cal(bermudaTriangle.getPath());
          }
        );

        bermudaTriangle.setMap(map);
      }, 500);
    };

    vm.updateCrop = function() {
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "editCrop", data: $scope.editdata };
      console.log(req);
      $http.post(url, req).then(
        function(response) {
          console.log(response);
          if (response.data.status == true) {
            $ionicLoading.hide();
            $timeout(function() {
              delete $scope.data;
              $scope.modaledit.hide();
              mobiscroll.toast({
                message: "แก้ไขข้อมูลเรียบร้อย",
                color: "success"
              });
              onStart();
            }, 200);
          } else {
            $ionicLoading.hide();
            Service.timeout();
          }
        },
        function err(err) {
          $ionicLoading.hide();

          Service.timeout();
        }
      );
    };

    vm.cropMstr = function(x) {
      $ionicLoading.show();
      $scope.areaMstr = x;
      let url = $rootScope.ip + "createArea.php";
      let req = {
        mode: "cropMstr",
        config: $rootScope.cropSet,
        global: $rootScope.global
      };
      $http.post(url, req).then(
        function suscess(response) {
          // console.log(response);
          if (response.data.status == true) {
            delete $scope.mstrCrop;
            $ionicSlideBoxDelegate.slide(0);
            $scope.mstrCrop = response.data.result;

            $timeout(function() {
              $scope.modalcrop.show();
              $ionicLoading.hide();
            }, 1000);
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    };

    $scope.lockSlide = function() {
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    vm.mstrCropSelect = function(e) {
      let myJSON = JSON.stringify(e);
      let myJsonarea = JSON.stringify($scope.areaMstr);
      $state.go("app.add6", { cropMstr: myJSON, areaMstr: myJsonarea });
    };
  })

  .controller("add5Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service
  ) {
    let vm = this;
    //modal
    {
      $ionicModal
        .fromTemplateUrl("my-map.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalmap = modal;
        });

      $scope.openModalMap = function() {
        $scope.modalmap.show();
      };
      $scope.closeModalMap = function() {
        $scope.modalmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalmap.remove();
      });

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
        $scope.drawCheck = false;
        $scope.modaledit.hide();
      };

      $scope.$on("$destroy", function() {
        $scope.modaledit.remove();
      });

      $ionicModal
        .fromTemplateUrl("my-detail.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modaldetail = modal;
        });

      $scope.openModalDetail = function() {
        $scope.modaldetail.show();
      };
      $scope.closeModalDetail = function() {
        $scope.modaldetail.hide();
      };

      $scope.$on("$destroy", function() {
        $scope.modaldetail.remove();
      });
    }

    $scope.model = { farm_desc: null, farm_startt: null, farm_endt: null };
    $scope.count = [1, 2, 3, 4, 5];

    $scope.crop = JSON.parse($stateParams.crop);
    $scope.subfarm = JSON.parse($stateParams.sub);
    // console.log($scope.subfarm);
    // console.log($scope.crop);

    vm.here = function() {
      map.setZoom(17);
      map.panTo(bounds.getCenter());
    };

    var triangleCoords = [];
    var all_overlays = [];

    var polygonCoords = [];
    var polygonCoordsFarm = [];

    var bounds = new google.maps.LatLngBounds();
    var areaFarm = new google.maps.LatLngBounds();

    var color = [
      "#ff0000",
      "#8cff00",
      "#0048ff",
      "#f6ff00",
      "#9604f7",
      "#f77104",
      "#02fcf4",
      "#eb01fc",
      "#ff0000",
      "#8cff00",
      "#0048ff",
      "#f6ff00",
      "#9604f7",
      "#f77104",
      "#02fcf4",
      "#eb01fc",
      "#ff0000",
      "#8cff00",
      "#0048ff",
      "#f6ff00",
      "#9604f7",
      "#f77104",
      "#02fcf4",
      "#eb01fc"
    ];

    var map = new google.maps.Map(document.getElementById("mapsdetail"), {
      zoom: 5,
      // center: bounds.getCenter(),
      center: new google.maps.LatLng(13.760412, 100.485357),
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeId: "satellite",
      mapTypeControl: false,
      zoomControl: false
    });

    vm.allPolygon = function() {
      if ($scope.subfarm.length > 0) {
        for (i = 0; i < all_overlays.length; i++) {
          all_overlays[i].setMap(null); //or line[i].setVisible(false);
        }
        triangleCoords = [];
        all_overlays = [];
        polygonCoords = [];
        bounds = new google.maps.LatLngBounds();
        for (let e = 0; e < $scope.subfarm.length; e++) {
          triangleCoords.push([]);
          $scope.positionPolygon = {
            lat: $scope.subfarm[e].sub_lat.split(","),
            lng: $scope.subfarm[e].sub_lng.split(",")
          };

          for (let i = 0; i < $scope.positionPolygon.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.positionPolygon.lat[i]),
              lng: parseFloat($scope.positionPolygon.lng[i])
            };
            polygonCoords.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
            triangleCoords[e].push(k); // เอาไปวาดเส้น
          }
          // console.log(polygonCoords);
          // console.log(triangleCoords[e]);

          for (let i = 0; i < polygonCoords.length; i++) {
            bounds.extend(polygonCoords[i]);
          }

          var bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoords[e],
            strokeColor: color[e],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color[e],
            fillOpacity: 0.35
          });

          all_overlays.push(bermudaTriangle);
          all_overlays[e].setMap(map);
        }
        map.setCenter(bounds.getCenter());
        map.setZoom(16);
        map.panTo(bounds.getCenter());
      }
    };
    //ทำตอนเริ่ม
    vm.allPolygon();

    vm.selectSub = function(e, index) {
      $scope.subDetail = e;
      $scope.modaldetail.show();

      console.log($scope.subDetail);

      for (i = 0; i < all_overlays.length; i++) {
        all_overlays[i].setMap(null); //or line[i].setVisible(false);
      }

      triangleCoords = [];
      all_overlays = [];
      polygonCoords = [];
      bounds = new google.maps.LatLngBounds();
      $scope.abc = {
        lat: e.sub_lat.split(","),
        lng: e.sub_lng.split(",")
      };

      // console.log($scope.abc);

      $timeout(function() {
        // console.log("666666");

        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i])
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // console.log(triangleCoords);

        for (i = 0; i < polygonCoords.length; i++) {
          bounds.extend(polygonCoords[i]);
        }

        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: color[index],
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: color[index],
          fillOpacity: 0.35
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        map.setZoom(17);
        map.panTo(bounds.getCenter());
        // $ionicLoading.hide();
      }, 100);
    };

    vm.editmap = function() {
      $scope.modaledit.hide();
      $timeout(function() {
        $scope.modalmap.show();
      }, 500);
    };

    vm.save = function() {
      $scope.modalmap.hide();
      $timeout(function() {
        $scope.modaledit.show();
        if ($scope.PolygonPatch) {
          // console.log($scope.PolygonPatch);
        }
      }, 1000);
    };

    $scope.areaFarm = {
      lat: $scope.crop.farm_lat.split(","),
      lng: $scope.crop.farm_lng.split(",")
    };

    vm.createSubmap = function() {
      let triangleCoords = [];
      for (let i = 0; i < $scope.areaFarm.lat.length; i++) {
        let k = {
          lat: parseFloat($scope.areaFarm.lat[i]),
          lng: parseFloat($scope.areaFarm.lng[i])
        };
        polygonCoordsFarm.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
        triangleCoords.push(k); // เอาไปวาดเส้น
      }

      for (let i = 0; i < polygonCoordsFarm.length; i++) {
        areaFarm.extend(polygonCoordsFarm[i]);
      }

      $scope.modalmap.show();

      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      function clearMarkers() {
        setMapOnAll(null);
      }

      var all_overlays = [];
      var selectedShape;
      $scope.PolygonPatch = [];
      let all_overlaysbase = [];

      $scope.data;

      function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#fff";
        controlUI.style.border = "2px solid #fff";
        controlUI.style.borderRadius = "10px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginBottom = "22px";
        controlUI.style.marginTop = "10px";
        controlUI.style.marginRight = "10px";
        controlUI.style.textAlign = "center";
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement("div");
        controlText.style.color = "rgb(25,25,25)";
        controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "38px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";

        controlText.innerHTML = "<i class='icon ion-trash-a'> ลบเส้น";
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener("click", function() {
          deleteSelectedShape();
        });
      }

      function clearSelection() {
        if (selectedShape) {
          selectedShape.setEditable(false);
          selectedShape = null;
        }
      }

      function setSelection(shape) {
        infowindow.open(map);
        clearSelection();
        selectedShape = shape;
        shape.setEditable(true);
      }

      function deleteSelectedShape() {
        if (selectedShape) {
          infowindow.close();
          $scope.PolygonPatch = [];
          selectedShape.setMap(null);
          // To show:
          drawingManager.setOptions({
            drawingControl: false
          });

          $scope.$apply(function() {
            $scope.drawCheck = false;
          });
        }
      }

      function showoutput() {
        alert($scope.data);
      }

      vm.draw = function() {
        console.log("123456789");
        $scope.drawCheck = true;
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      };

      //Set map
      var map = new google.maps.Map(document.getElementById("maps"), {
        center: areaFarm.getCenter(),
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: ["satellite", "roadmap", "hybrid"]
        },
        mapTypeId: "satellite",
        zoom: 18
      });

      var infowindow = new google.maps.InfoWindow();
      var centerControlDiv = document.createElement("div");
      var centerControl = new CenterControl(centerControlDiv, map);
      centerControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
        centerControlDiv
      );

      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
          drawingModes: ["polygon"]
        },
        polygonOptions: {
          clickable: true,
          editable: true,
          draggable: false,
          fillColor: "green",
          strokeColor: "green",
          strokeWeight: 4,
          strokeOpacity: 0.9,
          fillOpacity: 0.3
        },
        drawingMode: null
      });
      infowindow.open(map);
      google.maps.event.addListener(drawingManager, "polygoncomplete", function(
        polygon
      ) {
        /// Disable Controller//
        drawingManager.setOptions({
          drawingControl: false
        });

        $scope.$apply(function() {
          $scope.drawCheck = true;
        });

        all_overlays.push(polygon);
        drawingManager.setDrawingMode(null);

        var newShape = polygon;
        newShape.type = polygon;

        //Edit point
        google.maps.event.addListener(newShape.getPath(), "set_at", function() {
          // console.log(newShape.getPath())
          cal(newShape.getPath());
        });

        //Insert point
        google.maps.event.addListener(
          newShape.getPath(),
          "insert_at",
          function() {
            console.log(newShape.getPath());
            cal(newShape.getPath());
          }
        );

        //click shape
        google.maps.event.addListener(newShape, "click", function(e) {
          console.log(newShape.getPath());
          setSelection(newShape);
        });
        setSelection(newShape);

        // คำนวนและแสดง
        function cal(patch) {
          $scope.PolygonPatch = [];
          for (var i = 0; i < patch.length; i++) {
            $scope.PolygonPatch.push({
              lat: patch
                .getAt(i)
                .lat()
                .toFixed(5),
              lng: patch
                .getAt(i)
                .lng()
                .toFixed(5)
            });
          }
          console.log($scope.PolygonPatch);

          // $scope.PolygonPatch = coordinates;

          // $scope.PolygonPatch.push(coordinates)
          // console.log($scope.PolygonPatch)
          // ตารางเมตร
          var areaM2 = google.maps.geometry.spherical.computeArea(patch);
          // เอเคอร์
          var acreFormula = 0.00024711,
            // ไร่
            farmFormula = 0.000625,
            //ตารางวา
            wahFormula = 0.25,
            //งาน
            workFormula = 0.0025;

          var rai, ngan, wah;
          var modRai, modNgan, modWah;

          rai = parseInt(areaM2 / 1600);
          modRai = areaM2 % 1600;

          ngan = parseInt(modRai / 400);
          modNgan = modRai % 400;

          wah = parseInt(modNgan / 4);

          var areaAC = (areaM2 * acreFormula).toFixed(3);
          var areaFarm = (areaM2 * farmFormula).toFixed(3);
          var areaWah = (areaM2 * wahFormula).toFixed(3);
          var areaWork = (areaM2 * workFormula).toFixed(3);

          vm.area = {
            m2: areaM2.toFixed(3),
            ac: areaAC,
            // farm: areaFarm,
            // work: areaWork,
            // wah: areaWah,
            farm: rai,
            work: ngan,
            wah: wah
          };
          console.log(vm.area);

          // console.log("ตารางเมตร", areaM2.toFixed(3))
          // console.log("ไร่ , =", areaFarm.toFixed(3))
          // console.log("เอเคอร์, =", areaAC.toFixed(3))
          // console.log("ตารางวา =", areaWah.toFixed(3))
          // console.log("งาน =", areaWork.toFixed(3))

          // infowindow.setContent("Area/ตารางเมตร =" + vm.area.m2 + " sq meters<br>" +
          //   "Area/เอเคอร์ =" + vm.area.ac + " Acre<br>");
          infowindow.setContent(
            '<div id="contentmap">' +
              // '   <img src="img/maxresdefault.jpg" style="height:100px;">' +
              '<div id="bodyContent" >' +
              // "<br><b>Description</b><br><br> " +
              // "<p>พันธุ์ : - <br> " +
              // "<p>อายุ : - <br> " +
              // "<p>อื่นๆ : - <br> " +
              "<p> " +
              "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
              "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
              vm.area.m2 +
              " ตารางเมตร<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.farm +
              " &nbspไร่<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.work +
              " งาน<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.wah +
              " ตารางวา<br> " +
              "</div>"
            // '<div style="margin-top:10px"><button type="button" class="button button-small button-assertive icon ion-trash-a" ></button>' +
            // '<button type="button" class="button button-small  button-positive icon ion-edit" style="margin-left:3px"></button>' +
            // "</div>"
          );

          infowindow.setPosition(polygon.getPath().getAt(0));
        }

        infowindow.open(map);
        cal(polygon.getPath());
      });

      let triangleCoordsSub = [];
      let all_overlaysSub = [];
      let polygonCoordsSub = [];
      let boundsSub = new google.maps.LatLngBounds();

      for (let e = 0; e < $scope.subfarm.length; e++) {
        triangleCoordsSub.push([]);
        let positionPolygon = {
          lat: $scope.subfarm[e].sub_lat.split(","),
          lng: $scope.subfarm[e].sub_lng.split(",")
        };

        for (let i = 0; i < positionPolygon.lat.length; i++) {
          let k = {
            lat: parseFloat(positionPolygon.lat[i]),
            lng: parseFloat(positionPolygon.lng[i])
          };

          polygonCoordsSub.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
          triangleCoordsSub[e].push(k); // เอาไปวาดเส้น
        }

        // for (let i = 0; i < polygonCoordsSub.length; i++) {
        //   boundsSub.extend(polygonCoordsSub[i]);

        // }

        var bermudaTriangles = new google.maps.Polygon({
          editable: false,
          paths: triangleCoordsSub[e],
          strokeColor: "yellow",
          strokeOpacity: 0.9,
          strokeWeight: 4,
          fillColor: "green",
          fillOpacity: 0.3
        });

        all_overlaysSub.push(bermudaTriangles);
        all_overlaysSub[e].setMap(map);
      }

      /// พื้นที่ใหญ่ทั้งหมด
      var bermudaTriangle = new google.maps.Polygon({
        editable: false,
        paths: triangleCoords,
        strokeColor: "red",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        fillColor: "none",
        fillOpacity: 0.0
      });
      bermudaTriangle.setMap(map);

      // google.maps.event.addDomListener(document.getElementById('bt1'), 'click', deleteSelectedShape);
      // google.maps.event.addDomListener(document.getElementById('bt2'), 'click', showoutput);

      drawingManager.setMap(map);
    };

    vm.createSub = function() {
      $ionicLoading.show();
      let lat = "";
      let lng = "";
      for (let i = 0; i < $scope.PolygonPatch.length; i++) {
        lat += $scope.PolygonPatch[i].lat + ",";
        lng += $scope.PolygonPatch[i].lng + ",";
      }
      // let reslat = lat

      let sublat = lat.substring(0, lat.length - 1);
      let sublng = lng.substring(0, lng.length - 1);

      let resposition = {
        lat: sublat,
        lng: sublng
      };
      let url = $rootScope.ip + "createArea.php";
      let req = {
        mode: "createSubFarm",
        area: vm.area,
        position: resposition,
        name: $scope.model,
        farm: $scope.crop
      };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response);
          if (response.data.status == true) {
            mobiscroll.toast({
              message: "สร้างพื้นที่เกษตรกรเรียบร้อยแล้ว",
              color: "success"
            });

            // $state.go("app.collectormenu");
            $timeout(function() {
              $ionicLoading.hide();

              $ionicHistory.goBack();

              // $ionicHistory.clearCache(["app.createArea"]);
              // $ionicHistory.clearCache(["app.add3"]);
              // $ionicHistory.clearCache(["app.add2"]);
              // $ionicHistory.clearCache(["app.add1"]);

              console.log("clear");
            }, 1000);
          } else {
            $ionicLoading.hide();
            Service.timeout();
          }
        },
        function err(err) {
          $ionicLoading.hide();
          Service.timeout();
        }
      );
    };
  })

  .controller("add6Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $ionicSlideBoxDelegate,
    $mdDialog
  ) {
    let vm = this;
    $scope.cropMstr = JSON.parse($stateParams.cropMstr);
    $scope.areaMstr = JSON.parse($stateParams.areaMstr);

    console.log($scope.cropMstr);
    console.log($scope.areaMstr);

    function onStart() {
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = {
        mode: "selectsubfarms",
        value: $scope.areaMstr,
        crop: $scope.cropMstr
      };
      $http.post(url, req).then(
        function suscess(response) {
          if (response.data.status == true) {
            $scope.data = response.data;

            for (let i = 0; i < $scope.data.result.length; i++) {
              $scope.data.result[i] = angular.merge($scope.data.result[i], {
                func: function() {
                  if (
                    !$scope.data.result[i].type ||
                    !$scope.data.result[i].enddate ||
                    !$scope.data.result[i].startdate ||
                    !$scope.data.result[i].result
                  ) {
                    return false;
                  } else {
                    return true;
                  }
                }
              });
              console.log($scope.data.result[i].func());
            }
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();

            $scope.data = response.data;
          }

          console.log($scope.data.result);
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    }

    function onRefresh() {
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = {
        mode: "selectsubfarms",
        value: $scope.areaMstr,
        crop: $scope.cropMstr
      };
      $http.post(url, req).then(
        function suscess(response) {
          if (response.data.status == true) {
            $scope.data = response.data;
            for (let i = 0; i < $scope.data.result.length; i++) {
              $scope.data.result[i] = angular.merge($scope.data.result[i], {
                func: function() {
                  if (
                    !$scope.data.result[i].type ||
                    !$scope.data.result[i].enddate ||
                    !$scope.data.result[i].startdate ||
                    !$scope.data.result[i].result
                  ) {
                    return false;
                  } else {
                    return true;
                  }
                }
              });
              console.log($scope.data.result[i].func());
            }

            $mdDialog.show(
              $mdDialog
                .alert()
                .parent(
                  angular.element(document.querySelector("#popupContainer"))
                )
                .clickOutsideToClose(true)
                .title("แจ้งเตือน !")
                .textContent("บันทึกข้อมูลเรียบร้อยแล้ว..")
                .ariaLabel("Alert Dialog Demo")
                .ok("ยืนยัน")
                .targetEvent()
            );

            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();

            $scope.data = response.data;
          }

          console.log($scope.data);
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    $scope.loadUsers = function() {
      return $timeout(function() {
        return ($scope.croptype = $scope.croptype || $scope.croptypes);
      }, 1000);
    };

    $scope.loadUsersss = function() {
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "cropType", value: $scope.cropMstr };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response);
          if (response.data.status == true) {
            $scope.croptype = response.data.result;
          } else {
            $scope.croptype = response.data.result;
          }
        },
        function err(err) {}
      );
    };

    $scope.loadUsersss();

    let platform = ionic.Platform.platform();

    vm.pickdate = function(index) {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.data.result[index].startdate = data;
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
                  $scope.data.result[index].startdate = $scope.datamodal.date;
                }
              }
            }
          ]
        });
      }
    };
    vm.pickdateto = function(index) {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.data.result[index].enddate = data;
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
                  $scope.data.result[index].enddate = $scope.datamodal.date;
                }
              }
            }
          ]
        });
      }
    };

    vm.um = [];
    vm.typeChange = function(e, index) {
      console.log(e, index);
      vm.um[index] = $scope.croptype.filter(p => p.pt_part == e)[0];
      console.log(vm.um);
    };

    vm.wogen = function(ev) {
      let check = [];
      for (let i = 0; i < $scope.data.result.length; i++) {
        check.push($scope.data.result[i].func());
      }
      let k = check.includes(false);
      if (!k) {
        var confirm = $mdDialog
          .confirm()
          .title("ต้องการบันทึกข้อมูลใช่หรือไม่ ?")
          .textContent(
            "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยันการบันทึก ต้องการบันทึกข้อมูลหรือไม่ ?"
          )
          .ariaLabel("Lucky day")
          .targetEvent(ev)
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function() {
            $ionicLoading.show();
            let url = $rootScope.ip + "createArea.php";
            let req = {
              mode: "woGen",
              value: $scope.data.result,
              areamstr: $scope.areaMstr,
              cropmstr: $scope.cropMstr
            };
            $http.post(url, req).then(
              function suscess(response) {
                console.log(response);
                if (response.data.status == true) {
                  $ionicLoading.hide();

                  onRefresh();
                } else {
                  $ionicLoading.hide();
                }
              },
              function err(err) {
                $ionicLoading.hide();
              }
            );
          },
          function() {}
        );
      } else {
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.querySelector("#popupContainer")))
            .clickOutsideToClose(false)
            .title("แจ้งเตือน !")
            .textContent("กรอกข้อมูลให้ครบถ้วนก่อนบันทึกข้อมูล..")
            .ariaLabel("Alert Dialog Demo")
            .ok("ยืนยัน")
            .targetEvent()
        );
      }
    };
  });

angular
  .module("app")

  .controller("createAreaCtrl", function(
    $ionicHistory,
    $state,
    $stateParams,
    $rootScope,
    $timeout,
    $scope,
    $http,
    Service,
    $ionicPopup,
    $ionicLoading
  ) {
    let vm = this;

    function province() {
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "province" };

      $http.post(url, req).then(
        function(response) {
          console.log(response.data);
          if (response.data.status == true) {
            vm.province = response.data.result;
            vm.vd = response.data.vd;
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err() {
          $ionicLoading.hide();
        }
      );
    }

    province();

    vm.provinceChange = function(e) {
      console.log(e);
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "AUMPHUR", data: e };

      $http.post(url, req).then(
        function(response) {
          console.log(response.data);
          if (response.data.status == true) {
            vm.aumphur = response.data.result;
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err() {
          $ionicLoading.hide();
        }
      );
    };

    vm.aumphurChange = function(e) {
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "tumbol", data: e };

      $http.post(url, req).then(
        function(response) {
          console.log(response.data);
          if (response.data.status == true) {
            vm.tumbol = response.data.result;
            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err() {
          $ionicLoading.hide();
        }
      );
    };

    $scope.model = {
      createname: null,
      name: null,
      desc: null,
      date: null,
      dateto: null,
      vd: null
    };

    let platform = ionic.Platform.platform();

    vm.pickdate = function() {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.model.date = data;
          });
        });
      } else {
        $scope.datas = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="datas.date">',
          title: "Enter Date Ex 25-04-2562",
          subTitle: "ป้อนข้อูลตามรูปแบบ",
          scope: $scope,
          buttons: [
            { text: "Cancel" },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function(e) {
                if (!$scope.datas.date) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.datas.date;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
          $scope.model.date = res;
        });
      }
    };
    vm.pickdateto = function() {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.model.dateto = data;
          });
        });
      } else {
        $scope.datas = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="datas.date">',
          title: "Enter Date Ex 25-04-2562",
          subTitle: "ป้อนข้อูลตามรูปแบบ",
          scope: $scope,
          buttons: [
            { text: "Cancel" },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function(e) {
                if (!$scope.datas.date) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                } else {
                  return $scope.datas.date;
                }
              }
            }
          ]
        });

        myPopup.then(function(res) {
          $scope.model.dateto = res;
        });
      }
    };

    vm.mapview = function() {
      // console.log("surveyors");
      // $state.go("app.add3");
      $ionicHistory.goBack();
    };

    vm.createNameChange = function(e) {
      $scope.model.createname = JSON.parse(e);
    };

    vm.confirm = function() {
      console.log($scope.model);
      if ($scope.model.name ) {
        mobiscroll.confirm({
          title: "ยืนยันการสร้างพื้นที่เกษตรกร",
          message: "คุณต้องการสร้างพื้นที่ใช่หรือไม่ ?",
          okText: "Ok",
          cancelText: "Cancel",
          callback: function(res) {
            if (res) {
              $ionicLoading.show();

              let lat = "";
              let lng = "";
              for (let i = 0; i < $rootScope.area.position.length; i++) {
                lat += $rootScope.area.position[i].lat + ",";
                lng += $rootScope.area.position[i].lng + ",";
              }
              // let reslat = lat

              let sublat = lat.substring(0, lat.length - 1);
              let sublng = lng.substring(0, lng.length - 1);

              let resposition = {
                lat: lat.substring(0, lat.length - 1),
                lng: lng.substring(0, lng.length - 1)
              };

              //ตอนเอาค่ากลับ
              // let resposition = {
              //   lat: sublat.split(","),
              //   lng: sublng.split(",")
              // };
              let pro = {
                province: vm.provinceSelect,
                aumphur: vm.aumphurSelect,
                tumbol: vm.tumbolSelect
              };
              let url = $rootScope.ip + "createArea.php";
              let req = {
                mode: "createFarm",
                area: $rootScope.area.area,
                position: resposition,
                name: $scope.model,
                crop: $rootScope.cropSet,
                pro: pro
              };
              console.log(pro);
              $http.post(url, req).then(
                function suscess(response) {
                  console.log(response);
                  if (response.data.status == true) {
                    $ionicLoading.hide();
                    $ionicHistory.nextViewOptions({
                      disableBack: true
                    });
                    mobiscroll.toast({
                      message: "สร้างพื้นที่เกษตรกรเรียบร้อยแล้ว",
                      color: "success"
                    });
                    $state.go("app.farmerMenu");
                    $timeout(function() {
                      $ionicHistory.clearCache(["app.createArea"]);
                      $ionicHistory.clearCache(["app.add3"]);
                      $ionicHistory.clearCache(["app.add2"]);
                      $ionicHistory.clearCache(["app.add1"]);

                      console.log("clear");
                    }, 1000);
                  } else {
                    $ionicLoading.hide();
                    Service.timeout();
                  }
                },
                function err(err) {
                  $ionicLoading.hide();
                  Service.timeout();
                }
              );
              console.log(req);
            }
          }
        });
      } else {
        mobiscroll.alert({
          title: "แจ้งเตือน",
          message: "กรอกชื่้อมูลให้ครบถ้วนก่อนบันทึก",
          callback: function() {}
        });
      }
    };

    vm.cancel = function() {
      mobiscroll.confirm({
        title: "ยกเลิก ?",
        message: "คุณต้องยกเลิกการสร้างพื้นที่ใช่หรือไม่ ?",
        okText: "Ok",
        cancelText: "Cancel",
        callback: function(res) {
          if (res) {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });

            $state.go("app.farmerMenu");

            $ionicHistory.nextViewOptions({
              historyRoot: true
            });

            $timeout(function() {
              $ionicHistory.clearCache();
              $ionicHistory.clearHistory();
              $ionicLoading.hide();
            }, 800);
          }
        }
      });
    };
  });

angular
  .module("app")
  .controller("weatherCtrl", function(
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
    $cordovaGeolocation
  ) {
    let vm = this;
    //  vm.bg = 'img/clear.jpg'
    
    vm.days = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์"
    ];
    var today = new Date();
    vm.nextdate = [];
    vm.nextdatedetail = [];

    for (let i = 0; i < 4; i++) {
      let e = i + 1;
      vm.nextdate[i] = new Date();
      vm.nextdate[i].setDate(today.getDate() + e);

      year = vm.nextdate[i].getFullYear();
      month = "" + (vm.nextdate[i].getMonth() + 1);
      day = "" + vm.nextdate[i].getDate();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      let yymmdd = [year, month, day].join("-");

      vm.nextdatedetail[i] = {
        date: yymmdd,
        dayName: vm.days[vm.nextdate[i].getDay()],
        temp: "?"
      };
    }

    console.log(vm.nextdatedetail);

    var dayName = vm.days[today.getDay()];

    function startTime() {
      today = new Date();
      dayName = vm.days[today.getDay()];
      var h = today.getHours();
      var m = today.getMinutes();
      var s = today.getSeconds();
      m = checkTime(m);
      s = checkTime(s);
      document.getElementById("txt").innerHTML =
        dayName + " " + h + ":" + m ;
      var t = setTimeout(startTime, 500);
    }

    function checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      } // add zero in front of numbers < 10
      return i;
    }

    startTime();

    $scope.position = "540000";

    var geocoder = new google.maps.Geocoder();

    function geocodeLatLng(position) {
      var input = position;
      var latlngStr = input.split(",", 2);
      // console.log(latlngStr)
      var latlng = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1])
      };
      geocoder.geocode({ location: latlng }, function(results, status) {
        if (status === "OK") {
          let k = results[0].formatted_address;
          vm.landmark = k;
        } else {
          vm.landmark = "ไม่สามารถค้นหาพื้นที่ได้";
        }
      });
    }

    function daliy() {
      let req = { value: 1 };
      $http.post($rootScope.ip + "warn.php", req).then(function(e) {
        vm.Warning = e.data;
        // console.log(vm.Warning);
      });

      req = { value: 2 };
      $http.post($rootScope.ip + "warn.php", req).then(function(e) {
        vm.WeatherToday = e.data;
        // console.log(vm.WeatherToday);
      });

      req = { value: 3 };
      $http.post($rootScope.ip + "warn.php", req).then(function(e) {
        vm.DailyForecast = e.data;
        // console.log(vm.DailyForecast);
      });
    }

    daliy();

    function callPosition() {
      var posOptions = { timeout: 10000, enableHighAccuracy: true };
      $cordovaGeolocation.getCurrentPosition(posOptions).then(
        function(position) {
          vm.position = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          let latlng =
            "" +
            position.coords.latitude +
            "," +
            position.coords.longitude +
            "";

          geocodeLatLng(latlng);

          let req = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            nextday: vm.nextdatedetail
          };
          console.log(req);

          $http.post($rootScope.ip + "weather.php", req).then(function(e) {
            console.log(e);
            vm.temp = e.data.today;

            // vm.temp.data.condD = 'ฝนตกเล็กน้อย'

            let ct = vm.temp.data.condD;


            if(ct == 'ท้องฟ้าแจ่มใส' || ct == 'เมฆบางส่วน' || ct == 'เมฆเป็นส่วนมาก' || ct == 'มีเมฆมาก'){
             vm.bg = 'img/qqq.jpg'

            }else if(ct == 'ฝนตกเล็กน้อย' || ct == 'ฝนปานกลาง' || ct == 'ฝนตกหนัก' || ct == 'ฝนฟ้าคะนอง'){
             vm.bg = 'img/rain.jpg'

            }else if(ct == 'อากาศหนาวจัด' || ct == 'อากาศหนาว' || ct == 'อากาศเย็น' ){
               vm.bg = 'img/clear.jpg'

            }else if ( ct == 'อากาศร้อนจัด'){
              vm.bg = 'img/hot.jpg'
            }

            vm.nextdatedetail = e.data.nextday;

            // console.log(vm.temp);
          });
          // console.log(position);
        },
        function(err) {
          // error
        }
      );
    }

    function onStart() {
      let platform = ionic.Platform.platform();
      // console.log(platform);
      function checkGPS() {
        //Call status GPS from Service and return value to statusgps
        return new Promise(function(resolve, reject) {
          deviceService.checkGPS(function(e) {
            resolve(e);
          });
        });
      }

      async function main() {
        let statusgps = await checkGPS();
        if (statusgps == "GPS_OFF") {
          if (platform == "android") {
            deviceService.opengpsAndroid(function(e) {
              if (e == "force_gps") {
                callPosition();
              } else {
                // console.log("not");
              }
            });
          } else if (platform == "ios") {
          }
        } else {
          vm.alert = "on";

          callPosition();
        }
      }

      if (platform == "win32" || platform == "ios") {
        callPosition();
      } else if (platform == "android") {
        // Android check gps ใน function
        main();
      }
    }

    onStart();

    vm.DailyForecastgo = function(e, b) {
      // console.log(e)
      $state.go("app.weatherDetail", { action: e, desc: b });
    };

  })

  .controller("weatherDetailCtrl", function(
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
    vm.header = $stateParams.desc;

    function warning() {
      req = { value: 1 };
      $http.post($rootScope.ip + "warn.php", req).then(function(e) {
        vm.Warning = e.data;
        // console.log(vm.Warning);
        // console.log(vm.Warning);
      });
    }

    function daliy() {
      req = { value: 3 };
      $http.post($rootScope.ip + "warn.php", req).then(function(e) {
        vm.DailyForecast = e.data;
        // console.log(vm.DailyForecast);
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
  });

angular
  .module("app")
  .controller("newsCtrl", function(
    $http,
    $ionicLoading,
    $timeout,
    $scope,
    $state,
    $rootScope,
    $localStorage,
    $ionicHistory,
    Service,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;

  console.log('123')

    var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 11,
          center: {lat: 14.385197, lng: 100.477074}
        });

       var kmzLayer = new google.maps.KmlLayer($rootScope.ip+'aa.kmz');

    console.log(kmzLayer)

     var drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: false,
      drawingControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
        drawingModes: ["polygon"]
      },
      polygonOptions: {
        clickable: true,
        editable: true,
        draggable: false,
        fillColor: "red",
        strokeColor: "green",
        strokeWeight: 3
      },
      drawingMode: null
    });

    kmzLayer.setMap(map);
    drawingManager.setMap(map)




      









    vm.detail = function() {
      $state.go("app.newsDetail");
    };
  })

    .controller("newsDetailCtrl", function(
    $http,
    $ionicLoading,
    $timeout,
    $scope,
    $state,
    $rootScope,
    $localStorage,
    $ionicHistory,
    Service,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;
    vm.detail = function() {
      $state.go("app.newsdetail");
    };
  });

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
          console.log(response.data);
          vm.lsStatus = response.data.status;
          if (response.data.status == true) {
            vm.status = true;
            $scope.datass = response.data;
            $scope.selected = $scope.datass.result[0];
            vm.subChange($scope.selected)
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
              console.log(response.data);
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
            console.log(response);

            if (response.data.status == true) {
              // delete $scope.dataDash;
              $timeout(function() {
                // //console.log('123')
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

    console.log($scope.labels);

    // $scope.series = ["AIR(%)", "TEMPERATURE(°C)", "SOIL(%)"];

    $scope.data = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    $scope.onClick = function(points, evt) {
      // console.log(points, evt);
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

angular
  .module("app")

  .controller("detailCtrl", function(
    $scope,
    $ionicHistory,
    $state,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $ionicSlideBoxDelegate,
    $q
  ) {
    let vm = this;
    console.log($rootScope.global);
    // $scope.crop = JSON.parse($stateParams.crop);
    $scope.crop = { frm_code: $rootScope.global.mob_farm_code };
    console.log($scope.crop);

    $rootScope.cropSet = $scope.crop;

    vm.addcrop = function() {
      $state.go("app.add3");
    };

    vm.edit = function(e) {
      $scope.modaledit.show();
      $scope.editdata = angular.copy(e);
      console.log($scope.editdata);
      $scope.positionEdit = {
        lat: $scope.editdata.farm_lat.split(","),
        lng: $scope.editdata.farm_lng.split(",")
      };
    };

    vm.deleteCrop = function() {
      mobiscroll.confirm({
        title: "แจ้งเตือน",
        message: "คุณต้องการลบพื้นที่นี้ใช่หรือไม่ ?",
        okText: "ยืนยัน",
        cancelText: "ยกเลิก",
        callback: function(res) {
          if (res) {
            $ionicLoading.show();
            let url = $rootScope.ip + "createArea.php";
            let req = { mode: "deleteCrops", data: $scope.editdata };
            $http.post(url, req).then(
              function(response) {
                if (response.data.status == true) {
                  $ionicLoading.hide();
                  $timeout(function() {
                    delete $scope.data;
                    $scope.modaledit.hide();
                    mobiscroll.toast({
                      message: "ลบ Crop เรียบร้อย",
                      color: "success"
                    });
                    onStart();
                  }, 200);
                } else {
                  $ionicLoading.hide();
                  Service.timeout();
                }
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
          }
        }
      });
    };

    vm.editMap = function() {
      console.log($scope.positionEdit);
      $scope.modaledit.hide();
      $timeout(function() {
        $scope.modalmap.show();

        var all_overlays = [];
        var selectedShape;
        $scope.PolygonPatch = [];

        $scope.data;

        function CenterControl(controlDiv, map) {
          // Set CSS for the control border.
          var controlUI = document.createElement("div");
          controlUI.style.backgroundColor = "#fff";
          controlUI.style.border = "2px solid #fff";
          controlUI.style.borderRadius = "3px";
          controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
          controlUI.style.cursor = "pointer";
          controlUI.style.marginBottom = "22px";
          controlUI.style.marginTop = "10px";
          controlUI.style.marginRight = "10px";
          controlUI.style.textAlign = "center";
          controlDiv.appendChild(controlUI);

          // Set CSS for the control interior.
          var controlText = document.createElement("div");
          controlText.style.color = "rgb(25,25,25)";
          controlText.style.fontFamily = "Roboto,Arial,sans-serif";
          controlText.style.fontSize = "16px";
          controlText.style.lineHeight = "38px";
          controlText.style.paddingLeft = "5px";
          controlText.style.paddingRight = "5px";

          controlText.innerHTML = "Remove";
          controlUI.appendChild(controlText);

          // Setup the click event listeners: simply set the map to Chicago.
          controlUI.addEventListener("click", function() {
            deleteSelectedShape();
          });
        }

        function clearSelection() {
          if (selectedShape) {
            selectedShape.setEditable(false);
            selectedShape = null;
          }
        }

        function setSelection(shape) {
          infowindow.open(map);
          // console.log(shape)
          clearSelection();
          selectedShape = shape;
          shape.setEditable(true);
        }

        function deleteSelectedShape() {
          if (selectedShape) {
            infowindow.close();
            $scope.PolygonPatch = [];
            selectedShape.setMap(null);
            // To show:
            drawingManager.setOptions({
              drawingControl: true
            });
          }
        }

        function showoutput() {
          alert($scope.data);
        }

        //Set map
        var map = new google.maps.Map(document.getElementById("maps"), {
          center: {
            lat: 13.713462,
            lng: 100.478819
          },
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ["satellite", "roadmap", "hybrid"]
          },
          mapTypeId: "satellite",
          zoom: 19
        });

        var infowindow = new google.maps.InfoWindow();
        var centerControlDiv = document.createElement("div");
        var centerControl = new CenterControl(centerControlDiv, map);
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          centerControlDiv
        );

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
            drawingModes: ["polygon"]
          },
          polygonOptions: {
            clickable: true,
            editable: true,
            draggable: false,
            fillColor: "red",
            strokeColor: "green",
            strokeWeight: 3
          },
          drawingMode: null
        });
        // infowindow.open(map);
        google.maps.event.addListener(
          drawingManager,
          "polygoncomplete",
          function(polygon) {
            /// Disable Controller//
            drawingManager.setOptions({
              drawingControl: false
            });

            all_overlays.push(polygon);
            console.log(all_overlays);
            drawingManager.setDrawingMode(null);

            var newShape = polygon;
            // newShape.type = polygon;

            //Edit point
            google.maps.event.addListener(
              newShape.getPath(),
              "set_at",
              function() {
                console.log("set_at");
                cal(newShape.getPath());
              }
            );

            //Insert point
            google.maps.event.addListener(
              newShape.getPath(),
              "insert_at",
              function() {
                console.log("insert_at");
                console.log(newShape.getPath());
                cal(newShape.getPath());
              }
            );

            //click shape
            google.maps.event.addListener(newShape, "click", function(e) {
              setSelection(newShape);
            });
            setSelection(newShape);

            // คำนวนและแสดง
            function cal(patch) {
              $scope.PolygonPatch = [];
              for (var i = 0; i < patch.length; i++) {
                $scope.PolygonPatch.push({
                  lat: patch
                    .getAt(i)
                    .lat()
                    .toFixed(5),
                  lng: patch
                    .getAt(i)
                    .lng()
                    .toFixed(5)
                });
              }
              console.log($scope.PolygonPatch);

              // ตารางเมตร
              var areaM2 = google.maps.geometry.spherical.computeArea(patch);
              // เอเคอร์
              var acreFormula = 0.00024711,
                // ไร่
                farmFormula = 0.000625,
                //ตารางวา
                wahFormula = 0.25,
                //งาน
                workFormula = 0.0025;

              var areaAC = (areaM2 * acreFormula).toFixed(3);
              var areaFarm = (areaM2 * farmFormula).toFixed(3);
              var areaWah = (areaM2 * wahFormula).toFixed(3);
              var areaWork = (areaM2 * workFormula).toFixed(3);

              var rai, ngan, wah;
              var modRai, modNgan, modWah;

              rai = parseInt(areaM2 / 1600);
              modRai = areaM2 % 1600;

              ngan = parseInt(modRai / 400);
              modNgan = modRai % 400;

              wah = parseInt(modNgan / 4);

              vm.area = {
                m2: areaM2.toFixed(3),
                ac: areaAC,
                // farm: areaFarm,
                // work: areaWork,
                // wah: areaWah,
                farm: rai,
                work: ngan,
                wah: wah
              };

              console.log(vm.area);

              infowindow.setContent(
                '<div id="contentmap">' +
                  '<div id="bodyContent" >' +
                  "<p>" +
                  "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
                  "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
                  vm.area.m2 +
                  " ตารางเมตร<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.farm +
                  " &nbspไร่<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.work +
                  " งาน<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.wah +
                  " ตารางวา<br> " +
                  "</div>"
              );

              infowindow.setPosition(polygon.getPath().getAt(0));
            }

            infowindow.open(map);
            cal(polygon.getPath());
          }
        );

        drawingManager.setMap(map);

        vm.save = function() {
          if ($scope.PolygonPatch.length) {
            $scope.modalmap.hide();
            $timeout(function() {
              $scope.modaledit.show();
              let area = {
                area: vm.area,
                position: $scope.PolygonPatch
              };

              let lat = "";
              let lng = "";
              for (let i = 0; i < area.position.length; i++) {
                lat += area.position[i].lat + ",";
                lng += area.position[i].lng + ",";
              }
              // let reslat = lat

              let sublat = lat.substring(0, lat.length - 1);
              let sublng = lng.substring(0, lng.length - 1);

              let resposition = {
                lat: lat.substring(0, lat.length - 1),
                lng: lng.substring(0, lng.length - 1)
              };
              let z = {
                lat: resposition.lat.split(","),
                lng: resposition.lng.split(",")
              };
              console.log(area.area);
              console.log(resposition);

              $scope.editdata.farm_area_acre = area.area.ac;
              $scope.editdata.farm_area_farm = area.area.farm;
              $scope.editdata.farm_area_m2 = area.area.m2;
              $scope.editdata.farm_area_wah = area.area.wah;
              $scope.editdata.farm_area_work = area.area.work;
              $scope.editdata.farm_lat = resposition.lat;
              $scope.editdata.farm_lng = resposition.lng;

              $scope.positionEdit = z;
            }, 500);
          } else {
          }
        };

        var triangleCoords = [];
        for (let i = 0; i < $scope.positionEdit.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.positionEdit.lat[i]),
            lng: parseFloat($scope.positionEdit.lng[i])
          };
          triangleCoords.push(k);
        }

        // Construct the polygon.
        var bermudaTriangle = new google.maps.Polygon({
          editable: true,
          paths: triangleCoords,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35
        });

        drawingManager.setOptions({
          drawingControl: false
        });

        all_overlays.push(bermudaTriangle);

        google.maps.event.addListener(bermudaTriangle, "click", function(e) {
          setSelection(bermudaTriangle);
        });

        setSelection(bermudaTriangle);

        function cal(patch) {
          vm.area = {};
          $scope.PolygonPatch = [];
          for (var i = 0; i < patch.length; i++) {
            $scope.PolygonPatch.push({
              lat: patch
                .getAt(i)
                .lat()
                .toFixed(5),
              lng: patch
                .getAt(i)
                .lng()
                .toFixed(5)
            });
          }
          // console.log($scope.PolygonPatch);

          // ตารางเมตร
          let areaM2 = google.maps.geometry.spherical.computeArea(patch);
          // เอเคอร์
          let acreFormula = 0.00024711,
            // ไร่
            farmFormula = 0.000625,
            //ตารางวา
            wahFormula = 0.25,
            //งาน
            workFormula = 0.0025;

          let areaAC = (areaM2 * acreFormula).toFixed(3);
          let areaFarm = (areaM2 * farmFormula).toFixed(3);
          let areaWah = (areaM2 * wahFormula).toFixed(3);
          let areaWork = (areaM2 * workFormula).toFixed(3);

          var rai, ngan, wah;
          var modRai, modNgan, modWah;

          rai = parseInt(areaM2 / 1600);
          modRai = areaM2 % 1600;

          ngan = parseInt(modRai / 400);
          modNgan = modRai % 400;

          wah = parseInt(modNgan / 4);

          vm.area = {
            m2: areaM2.toFixed(3),
            ac: areaAC,
            // farm: areaFarm,
            // work: areaWork,
            // wah: areaWah,
            farm: rai,
            work: ngan,
            wah: wah
          };

          infowindow.setContent(
            '<div id="contentmap">' +
              '<div id="bodyContent" >' +
              "<p>" +
              "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
              "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
              vm.area.m2 +
              " ตารางเมตร<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.farm +
              " &nbspไร่<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.work +
              " งาน<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.wah +
              " ตารางวา<br> " +
              "</div>"
          );

          infowindow.setPosition(bermudaTriangle.getPath().getAt(0));
        }

        infowindow.open(map);
        cal(bermudaTriangle.getPath());

        google.maps.event.addListener(
          bermudaTriangle.getPath(),
          "set_at",
          function() {
            console.log("set_at");
            cal(bermudaTriangle.getPath());
          }
        );

        google.maps.event.addListener(
          bermudaTriangle.getPath(),
          "insert_at",
          function() {
            cal(bermudaTriangle.getPath());
          }
        );

        bermudaTriangle.setMap(map);
      }, 500);
    };

    vm.updatepickdate = function() {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.editdata.farm_startt = data;
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
                  $scope.editdata.farm_startt = $scope.datamodal.date;
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
            $scope.editdata.farm_endt = data;
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
                  $scope.editdata.farm_endt = $scope.datamodal.date;
                }
              }
            }
          ]
        });
      }
    };

    vm.updateCrop = function() {
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "editCrop", data: $scope.editdata };
      console.log(req);
      $http.post(url, req).then(
        function(response) {
          console.log(response);
          if (response.data.status == true) {
            $ionicLoading.hide();
            $timeout(function() {
              delete $scope.data;
              $scope.modaledit.hide();
              mobiscroll.toast({
                message: "แก้ไขข้อมูลเรียบร้อย",
                color: "success"
              });
              onStart();
            }, 200);
          } else {
            $ionicLoading.hide();
            Service.timeout();
          }
        },
        function err(err) {
          $ionicLoading.hide();

          Service.timeout();
        }
      );
    };

    $scope.doRefresh = function() {
      // here refresh data code
      $scope.$broadcast("scroll.refreshComplete");
      $scope.$apply();
      onStart();
    };

    function onStart() {
      let cancellerLoadpic = $q.defer();
      let url = $rootScope.ip + "area.php";
      let req = {
        mode: "selectFarm",
        config: $rootScope.cropSet,
        global: $rootScope.global
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          $scope.status = true;

          console.log(response);
          if (response.data.status == true) {
            $scope.data = response.data;
          } else {
            $scope.data = response.data;
          }
          console.log(response);
        },
        function err(err) {
          console.log(err);
          $scope.data = [];
          $scope.status = false;
        }
      );
    }

    vm.refresh = function() {
      delete $scope.data;
      delete $scope.status;
      onStart();
    };

    onStart();

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

    $ionicModal
      .fromTemplateUrl("my-map.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modalmap = modal;
      });

    $scope.openModalMap = function() {
      $scope.modalmap.show();
    };
    $scope.closeModalMap = function() {
      $scope.modalmap.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function() {
      $scope.modalmap.remove();
    });

    $ionicModal
      .fromTemplateUrl("my-crop.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modalcrop = modal;
      });

    $scope.openModalCrop = function() {
      $scope.modalcrop.show();
    };
    $scope.closeModalCrop = function() {
      $scope.modalcrop.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function() {
      $scope.modalcrop.remove();
    });

    let platform = ionic.Platform.platform();

    vm.add5 = function(e) {
      $ionicLoading.show();
      console.log(e);
      let myJSON = JSON.stringify(e);
      let url = $rootScope.ip + "area.php";
      let req = { mode: "selectsubfarm", value: e };
      $http.post(url, req).then(
        function suscess(response) {
          if (response.data.status == true) {
            $ionicLoading.hide();

            let res = JSON.stringify(response.data.result);

            $state.go("app.detail2", { crop: myJSON, sub: res });
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    };

    vm.cropMstr = function(x) {
      $ionicLoading.show();
      $scope.areaMstr = x;
      let url = $rootScope.ip + "createArea.php";
      let req = {
        mode: "cropMstr",
        config: $rootScope.cropSet,
        global: $rootScope.global
      };
      $http.post(url, req).then(
        function suscess(response) {
          // console.log(response);
          if (response.data.status == true) {
            delete $scope.mstrCrop;
            $ionicSlideBoxDelegate.slide(0);
            $scope.mstrCrop = response.data.result;

            $timeout(function() {
              $scope.modalcrop.show();
              $ionicLoading.hide();
            }, 1000);
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    };

    $scope.lockSlide = function() {
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    vm.mstrCropSelect = function(e) {
      let myJSON = JSON.stringify(e);
      let myJsonarea = JSON.stringify($scope.areaMstr);
      $state.go("app.add6", { cropMstr: myJSON, areaMstr: myJsonarea });
    };

    // vm.key = false;
    // vm.farmerCheck = function () {
    //   $state.go('app.farmerCheck')
    //   console.log('farmerCheck')

    // }
    // vm.show = function(){
    //   if(vm.key == false){
    //     vm.key = true;
    //   }else if(vm.key == true){
    //     vm.key = false;
    //   }
    // }
    // vm.farmerResult = function () {
    //   $state.go('app.farmerResult')

    //   console.log('farmerResult')
    // }
  })

  .controller("detail2Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $ionicScrollDelegate,
    $ionicSlideBoxDelegate,
    $q,
    $ionicActionSheet
  ) {
    let vm = this;
    vm.pic_desc;
    //modal
    {
      $ionicModal
        .fromTemplateUrl("my-map.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalmap = modal;
        });

      $scope.openModalMap = function() {
        $scope.modalmap.show();
      };
      $scope.closeModalMap = function() {
        $scope.modalmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalmap.remove();
      });

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
        $scope.drawCheck = false;
        $scope.modaledit.hide();
      };

      $scope.$on("$destroy", function() {
        $scope.modaledit.remove();
      });

      $ionicModal
        .fromTemplateUrl("my-detail.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modaldetail = modal;
        });

      $scope.openModalDetail = function() {
        $scope.modaldetail.show();
      };
      $scope.closeModalDetail = function() {
        $scope.modaldetail.hide();
      };

      $scope.$on("$destroy", function() {
        $scope.modaldetail.remove();
      });

      $ionicModal
        .fromTemplateUrl("pic_desc.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalPic = modal;
        });

      $scope.openModalPic = function() {
        $scope.modalPic.show();
      };
      $scope.closeModalPic = function() {
        $scope.modalPic.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalPic.remove();
      });

      $ionicModal
        .fromTemplateUrl("list_map.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalListmap = modal;
        });

      $scope.openModalListmap = function() {
        $scope.modalListmap.show();
      };
      $scope.closeModalListmap = function() {
        $scope.modalListmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalListmap.remove();
      });
    }

    $scope.model = { farm_desc: null, farm_startt: null, farm_endt: null };
    $scope.count = [1, 2, 3, 4, 5];

    $scope.crop = JSON.parse($stateParams.crop);
    console.log($scope.crop);
    $scope.subfarm = JSON.parse($stateParams.sub);
    console.log($scope.subfarm);

    vm.listmap = function() {
      $scope.modalListmap.show();
      $ionicLoading.show();

      $timeout(function() {
        $ionicLoading.hide();

        console.log($scope.subfarm);

        let triangleCoordsListmap = [];
        let all_overlaysListmap = [];
        let polygonCoordsListmap = [];
        let polygonCoordsFarmListmap = [];
        let boundsListmap = new google.maps.LatLngBounds();
        for (let x = 0; x < $scope.subfarm.length; x++) {
          let e = $scope.subfarm[x];

          let map = new google.maps.Map(document.getElementById(x), {
            zoom: 5,
            // center: bounds.getCenter(),
            center: new google.maps.LatLng(13.760412, 100.485357),
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            zoomControl: false
          });
          triangleCoordsListmap = [];
          polygonCoordsListmap = [];
          boundsListmap = new google.maps.LatLngBounds();
          $scope.abc = {
            lat: e.sub_lat.split(","),
            lng: e.sub_lng.split(",")
          };

          // ////////console.log($scope.abc);

          // ////////console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i])
            };

            polygonCoordsListmap.push(new google.maps.LatLng(k.lat, k.lng));
            triangleCoordsListmap.push(k);
          }
          // ////////console.log(triangleCoords);

          for (i = 0; i < polygonCoordsListmap.length; i++) {
            boundsListmap.extend(polygonCoordsListmap[i]);
          }

          let bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoordsListmap,
            strokeColor: "red",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.35
          });

          all_overlaysListmap.push(bermudaTriangle);

          // console.log(all_overlaysListmap[x]);
          // console.log(map);

          all_overlaysListmap[x].setMap(map);

          map.fitBounds(boundsListmap);
          map.panTo(boundsListmap.getCenter());
        }
      }, 1000);
    };

    vm.action = function() {
      let res = JSON.stringify($scope.subDetail);
      $state.go("app.detail2-2", {
        crop: $stateParams.crop,
        sub: $stateParams.sub,
        detail: res
      });
    };

    vm.here = function() {
      map.setZoom(17);
      map.panTo(bounds.getCenter());
    };

    vm.allPolygon = function() {
      if ($scope.subfarm.length > 0) {
        for (i = 0; i < all_overlays.length; i++) {
          all_overlays[i].setMap(null); //or line[i].setVisible(false);
        }
        triangleCoords = [];
        all_overlays = [];
        polygonCoords = [];
        bounds = new google.maps.LatLngBounds();
        for (let e = 0; e < $scope.subfarm.length; e++) {
          triangleCoords.push([]);
          $scope.positionPolygon = {
            lat: $scope.subfarm[e].sub_lat.split(","),
            lng: $scope.subfarm[e].sub_lng.split(",")
          };

          for (let i = 0; i < $scope.positionPolygon.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.positionPolygon.lat[i]),
              lng: parseFloat($scope.positionPolygon.lng[i])
            };
            polygonCoords.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
            triangleCoords[e].push(k); // เอาไปวาดเส้น
          }
          // ////////console.log(polygonCoords);
          // ////////console.log(triangleCoords[e]);

          for (let i = 0; i < polygonCoords.length; i++) {
            bounds.extend(polygonCoords[i]);
          }

          var bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoords[e],
            strokeColor: color[e],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color[e],
            fillOpacity: 0.35
          });

          all_overlays.push(bermudaTriangle);
          all_overlays[e].setMap(map);
        }
        map.setCenter(bounds.getCenter());
        map.setZoom(16);
        map.panTo(bounds.getCenter());
      }
    };
    //ทำตอนเริ่ม
    // vm.allPolygon();

    $scope.imgsrc = [
      { path: "http://www.sct.ac.th/GrandCollege_files/noAvatar.png" }
    ];

    vm.picRefresh = function() {
      loadPic($scope.subDetail);
    };

    function loadPic(e) {
      let cancellerLoadpic = $q.defer();
      $ionicLoading.show();

      let url = $rootScope.ip + "area.php";
      let req = {
        mode: "loadPic",
        farm: e
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 6000);

      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          $scope.imgsrc = response.data;
          console.log($scope.imgsrc);

          $ionicLoading.hide();
          $ionicSlideBoxDelegate.update();
          $timeout(function() {
            $ionicSlideBoxDelegate.slide($scope.imgsrc.result.length - 1);
          }, 200);
        },
        function err(err) {
          $scope.imgsrc = {
            result: [
              {
                path:
                  "https://content.abt.com/media/images/products/sorry-no-image-available.png"
              }
            ],
            status: false
          };

          ////////console.log($scope.imgsrc);
          $ionicSlideBoxDelegate.update();
          $timeout(function() {
            $ionicSlideBoxDelegate.slide(0);
          }, 200);
          $ionicLoading.hide();
        }
      );
    }

    vm.deletePic = function(e) {
      if (e.pic_desc) {
        let hideSheet = $ionicActionSheet.show({
          titleText: "<b>รายละเอียด </b>: " + e.pic_desc,
          buttons: [
            {
              text: '<i class="icon ion-trash-a"></i> ลบ'
            }
          ],

          buttonClicked: function(index) {
            console.log(index);
            if (index == 0) {
              let canceller = $q.defer();

              $ionicLoading.show();
              let url = $rootScope.ip + "area.php";
              let req = {
                timeout: canceller.promise,
                mode: "deletePic",
                img: e
              };

              $http.post(url, req, { timeout: canceller.promise }).then(
                function suscess(response) {
                  console.log(response.data);
                  if (response.data == "AuthenticationSuccessful") {
                    //////console.log(response, 1);
                    $mdDialog.show(
                      $mdDialog
                        .alert()
                        .parent(
                          angular.element(
                            document.querySelector("#popupContainer")
                          )
                        )
                        .clickOutsideToClose(true)
                        .title("แจ้งเตือน")
                        .textContent("ลบรูปภาพเรียบร้อยแล้ว")
                        .ariaLabel("Alert Dialog Demo")
                        .ok("OK")
                        .targetEvent()
                    );
                    vm.picRefresh();
                    $ionicLoading.hide();
                  } else if (response.data == "AuthenticationFailed") {
                    ////////console.log(response, 2);

                    // $mdDialog.show(
                    //   $mdDialog
                    //     .alert()
                    //     .parent(
                    //       angular.element(
                    //         document.querySelector("#popupContainer")
                    //       )
                    //     )
                    //     .clickOutsideToClose(true)
                    //     .title("แจ้งเตือน")
                    //     .textContent("ไม่สามารถลบรูปภาพได้ ลองใหม่อีกครั้ง")
                    //     .ariaLabel("Alert Dialog Demo")
                    //     .ok("Got it!")
                    //     .targetEvent()
                    // );
                    mobiscroll.alert({
                      title: "แจ้งเตือน",
                      message:
                        "ไม่สามารถลบรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
                      callback: function() {
                        mobiscroll.toast({
                          message: "ยกเลิก"
                        });
                      }
                    });
                    $ionicLoading.hide();
                  }
                  // $scope.modalPic.hide();
                },
                function err(err) {
                  // $mdDialog.show(
                  //   $mdDialog
                  //     .alert()
                  //     .parent(
                  //       angular.element(
                  //         document.querySelector("#popupContainer")
                  //       )
                  //     )
                  //     .clickOutsideToClose(true)
                  //     .title("แจ้งเตือน")
                  //     .textContent("ไม่สามารถเพิ่มรูปภาพได้ ลองใหม่อีกครั้ง")
                  //     .ariaLabel("Alert Dialog Demo")
                  //     .ok("Got it!")
                  //     .targetEvent()
                  // );

                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message:
                      "ไม่สามารถลบรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
                    callback: function() {
                      mobiscroll.toast({
                        message: "ยกเลิก"
                      });
                    }
                  });
                  $ionicLoading.hide();
                  // $scope.modalPic.hide();
                }
              );

              $timeout(function() {
                canceller.resolve("user cancelled");
              }, 10000);
            }

            return true;
          }
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function() {
          hideSheet();
        }, 7000);
      }
    };

    vm.selectSubBefore = function(e, index) {
      $scope.modalListmap.hide();
      vm.selectSub(e, index);
    };
    vm.selectSub = function(e, index) {
      $scope.subDetail = e;
      loadPic($scope.subDetail);

      let map = new google.maps.Map(document.getElementById("mapbbb"), {
        zoom: 5,
        // center: bounds.getCenter(),
        center: new google.maps.LatLng(13.760412, 100.485357),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: "satellite",
        mapTypeControl: false,
        zoomControl: false
      });

      let triangleCoords = [];
      let all_overlays = [];

      let polygonCoords = [];
      let polygonCoordsFarm = [];

      let bounds = new google.maps.LatLngBounds();

      for (i = 0; i < all_overlays.length; i++) {
        all_overlays[i].setMap(null); //or line[i].setVisible(false);
      }

      triangleCoords = [];
      all_overlays = [];
      polygonCoords = [];
      bounds = new google.maps.LatLngBounds();
      $scope.abc = {
        lat: e.sub_lat.split(","),
        lng: e.sub_lng.split(",")
      };

      $timeout(function() {
        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i])
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // ////////console.log(triangleCoords);

        for (i = 0; i < polygonCoords.length; i++) {
          bounds.extend(polygonCoords[i]);
        }

        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }, 100);
    };

    if ($scope.subfarm.length > 0) {
      $scope.selected = $scope.subfarm[0];
      vm.selectSub($scope.subfarm[0]);
    }

    vm.editmap = function() {
      $scope.modaledit.hide();
      $timeout(function() {
        $scope.modalmap.show();
      }, 500);
    };

    vm.save = function() {
      $scope.modalmap.hide();
      $timeout(function() {
        $scope.modaledit.show();
        if ($scope.PolygonPatch) {
          // ////////console.log($scope.PolygonPatch);
        }
      }, 1000);
    };

    $scope.areaFarm = {
      lat: $scope.crop.farm_lat.split(","),
      lng: $scope.crop.farm_lng.split(",")
    };

    vm.createSubmap = function() {
      let triangleCoords = [];
      for (let i = 0; i < $scope.areaFarm.lat.length; i++) {
        let k = {
          lat: parseFloat($scope.areaFarm.lat[i]),
          lng: parseFloat($scope.areaFarm.lng[i])
        };
        polygonCoordsFarm.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
        triangleCoords.push(k); // เอาไปวาดเส้น
      }

      for (let i = 0; i < polygonCoordsFarm.length; i++) {
        areaFarm.extend(polygonCoordsFarm[i]);
      }

      $scope.modalmap.show();

      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      function clearMarkers() {
        setMapOnAll(null);
      }

      var all_overlays = [];
      var selectedShape;
      $scope.PolygonPatch = [];
      let all_overlaysbase = [];

      $scope.data;

      function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#fff";
        controlUI.style.border = "2px solid #fff";
        controlUI.style.borderRadius = "10px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginBottom = "22px";
        controlUI.style.marginTop = "10px";
        controlUI.style.marginRight = "10px";
        controlUI.style.textAlign = "center";
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement("div");
        controlText.style.color = "rgb(25,25,25)";
        controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "38px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";

        controlText.innerHTML = "<i class='icon ion-trash-a'> ลบเส้น";
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener("click", function() {
          deleteSelectedShape();
        });
      }

      function clearSelection() {
        if (selectedShape) {
          selectedShape.setEditable(false);
          selectedShape = null;
        }
      }

      function setSelection(shape) {
        infowindow.open(map);
        clearSelection();
        selectedShape = shape;
        shape.setEditable(true);
      }

      function deleteSelectedShape() {
        if (selectedShape) {
          infowindow.close();
          $scope.PolygonPatch = [];
          selectedShape.setMap(null);
          // To show:
          drawingManager.setOptions({
            drawingControl: false
          });

          $scope.$apply(function() {
            $scope.drawCheck = false;
          });
        }
      }

      function showoutput() {
        alert($scope.data);
      }

      vm.draw = function() {
        //////console.log("123456789");
        $scope.drawCheck = true;
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      };

      //Set map
      var map = new google.maps.Map(document.getElementById("maps"), {
        center: areaFarm.getCenter(),
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          mapTypeIds: ["satellite", "roadmap", "hybrid"]
        },
        mapTypeId: "satellite",
        zoom: 18
      });

      var infowindow = new google.maps.InfoWindow();
      var centerControlDiv = document.createElement("div");
      var centerControl = new CenterControl(centerControlDiv, map);
      centerControlDiv.index = 1;
      map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
        centerControlDiv
      );

      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
          drawingModes: ["polygon"]
        },
        polygonOptions: {
          clickable: true,
          editable: true,
          draggable: false,
          fillColor: "green",
          strokeColor: "green",
          strokeWeight: 4,
          strokeOpacity: 0.9,
          fillOpacity: 0.3
        },
        drawingMode: null
      });
      infowindow.open(map);
      google.maps.event.addListener(drawingManager, "polygoncomplete", function(
        polygon
      ) {
        /// Disable Controller//
        drawingManager.setOptions({
          drawingControl: false
        });

        $scope.$apply(function() {
          $scope.drawCheck = true;
        });

        all_overlays.push(polygon);
        drawingManager.setDrawingMode(null);

        var newShape = polygon;
        newShape.type = polygon;

        //Edit point
        google.maps.event.addListener(newShape.getPath(), "set_at", function() {
          // //////console.log(newShape.getPath())
          cal(newShape.getPath());
        });

        //Insert point
        google.maps.event.addListener(
          newShape.getPath(),
          "insert_at",
          function() {
            //////console.log(newShape.getPath());
            cal(newShape.getPath());
          }
        );

        //click shape
        google.maps.event.addListener(newShape, "click", function(e) {
          //////console.log(newShape.getPath());
          setSelection(newShape);
        });
        setSelection(newShape);

        // คำนวนและแสดง
        function cal(patch) {
          $scope.PolygonPatch = [];
          for (var i = 0; i < patch.length; i++) {
            $scope.PolygonPatch.push({
              lat: patch
                .getAt(i)
                .lat()
                .toFixed(5),
              lng: patch
                .getAt(i)
                .lng()
                .toFixed(5)
            });
          }

          // ตารางเมตร
          var areaM2 = google.maps.geometry.spherical.computeArea(patch);
          // เอเคอร์
          var acreFormula = 0.00024711,
            // ไร่
            farmFormula = 0.000625,
            //ตารางวา
            wahFormula = 0.25,
            //งาน
            workFormula = 0.0025;

          var rai, ngan, wah;
          var modRai, modNgan, modWah;

          rai = parseInt(areaM2 / 1600);
          modRai = areaM2 % 1600;

          ngan = parseInt(modRai / 400);
          modNgan = modRai % 400;

          wah = parseInt(modNgan / 4);

          var areaAC = (areaM2 * acreFormula).toFixed(3);
          var areaFarm = (areaM2 * farmFormula).toFixed(3);
          var areaWah = (areaM2 * wahFormula).toFixed(3);
          var areaWork = (areaM2 * workFormula).toFixed(3);

          vm.area = {
            m2: areaM2.toFixed(3),
            ac: areaAC,
            // farm: areaFarm,
            // work: areaWork,
            // wah: areaWah,
            farm: rai,
            work: ngan,
            wah: wah
          };
          //////console.log(vm.area);

          // infowindow.setContent("Area/ตารางเมตร =" + vm.area.m2 + " sq meters<br>" +
          //   "Area/เอเคอร์ =" + vm.area.ac + " Acre<br>");
          infowindow.setContent(
            '<div id="contentmap">' +
              // '   <img src="img/maxresdefault.jpg" style="height:100px;">' +
              '<div id="bodyContent" >' +
              // "<br><b>Description</b><br><br> " +
              // "<p>พันธุ์ : - <br> " +
              // "<p>อายุ : - <br> " +
              // "<p>อื่นๆ : - <br> " +
              "<p> " +
              "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
              "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
              vm.area.m2 +
              " ตารางเมตร<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.farm +
              " &nbspไร่<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.work +
              " งาน<br> " +
              "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
              vm.area.wah +
              " ตารางวา<br> " +
              "</div>"
            // '<div style="margin-top:10px"><button type="button" class="button button-small button-assertive icon ion-trash-a" ></button>' +
            // '<button type="button" class="button button-small  button-positive icon ion-edit" style="margin-left:3px"></button>' +
            // "</div>"
          );

          infowindow.setPosition(polygon.getPath().getAt(0));
        }

        infowindow.open(map);
        cal(polygon.getPath());
      });

      let triangleCoordsSub = [];
      let all_overlaysSub = [];
      let polygonCoordsSub = [];
      let boundsSub = new google.maps.LatLngBounds();

      for (let e = 0; e < $scope.subfarm.length; e++) {
        triangleCoordsSub.push([]);
        let positionPolygon = {
          lat: $scope.subfarm[e].sub_lat.split(","),
          lng: $scope.subfarm[e].sub_lng.split(",")
        };

        for (let i = 0; i < positionPolygon.lat.length; i++) {
          let k = {
            lat: parseFloat(positionPolygon.lat[i]),
            lng: parseFloat(positionPolygon.lng[i])
          };

          polygonCoordsSub.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
          triangleCoordsSub[e].push(k); // เอาไปวาดเส้น
        }

        // for (let i = 0; i < polygonCoordsSub.length; i++) {
        //   boundsSub.extend(polygonCoordsSub[i]);

        // }

        var bermudaTriangles = new google.maps.Polygon({
          editable: false,
          paths: triangleCoordsSub[e],
          strokeColor: "yellow",
          strokeOpacity: 0.9,
          strokeWeight: 4,
          fillColor: "green",
          fillOpacity: 0.3
        });

        all_overlaysSub.push(bermudaTriangles);
        all_overlaysSub[e].setMap(map);
      }

      /// พื้นที่ใหญ่ทั้งหมด
      var bermudaTriangle = new google.maps.Polygon({
        editable: false,
        paths: triangleCoords,
        strokeColor: "red",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        fillColor: "none",
        fillOpacity: 0.0
      });
      bermudaTriangle.setMap(map);

      // google.maps.event.addDomListener(document.getElementById('bt1'), 'click', deleteSelectedShape);
      // google.maps.event.addDomListener(document.getElementById('bt2'), 'click', showoutput);

      drawingManager.setMap(map);
    };

    vm.search = function(e) {
      //////console.log(e);
      $scope.modaldetail.hide();

      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog
        .prompt()
        .title("เชื่อมต่ออุปกรณ์")
        .textContent(
          "ป้อนรหัสอุปกรณ์เพื่อเชื่อมต่อกับโรงเรือนที่ " + e.sup_sub_id
        )
        .placeholder("รหัสอุปกรณ์,IOT ID")
        .ariaLabel("รหัสอุปกรณ์,IOT ID")
        .initialValue()
        .targetEvent()
        .required(false)
        .ok("เชื่อมต่อ")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function(result) {
          if (result) {
            let url = $rootScope.ip + "area.php";
            let req = {
              mode: "syncIOT",
              sub: e,
              iotid: result.toUpperCase(),
              global: $rootScope.global
            };
            $http.post(url, req).then(
              function suscess(response) {
                //////console.log(response);
                if (response.data.status == "allow") {
                  $mdDialog.show(
                    $mdDialog
                      .alert()
                      .parent(
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
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

                  $ionicHistory.goBack();
                } else if (response.data.status == "notallow") {
                  $mdDialog.show(
                    $mdDialog
                      .alert()
                      .parent(
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
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
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
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
              function err(err) {}
            );
          }
        },
        function(e) {}
      );
    };

    vm.addPic = function(ev) {
      let platform = ionic.Platform.platform();
      // $scope.openModalPic();

      if (platform == "android" || platform == "ios") {
        $mdDialog
          .show({
            controller: DialogController,
            templateUrl: "templates/dialog1.html",
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          })
          .then(
            function(answer) {
              switch (answer) {
                case "camera":
                  camera();
                  break;
                case "image":
                  image();
                  break;
              }
              //////console.log('You said the information was "' + answer + '".');
            },
            function() {}
          );
      } else {
        $scope.openModalPic();
        $scope.image =
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg==";
        $ionicScrollDelegate.resize();
      }
    };

    function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }

    function camera() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 40,
        sourceType: Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.DATA_URL
      });

      function onSuccess(imageData) {
        var image = document.getElementById("myImage");
        $scope.image = "data:image/jpeg;base64," + imageData;
        $scope.openModalPic();
      }

      function onFail(message) {
        alert("Failed because: " + message);
      }
    }
    function image() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 40,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1920,
        targetHeight: 1080
      });

      function onSuccess(imageData) {
        var image = document.getElementById("myImage");
        $scope.image = "data:image/jpeg;base64," + imageData;
        $scope.openModalPic();
      }

      function onFail(message) {
        alert("Failed because: " + message);
      }
    }

    vm.pushpick = function() {
      let canceller = $q.defer();

      $ionicLoading.show();
      let url = $rootScope.ip + "area.php";
      let req = {
        timeout: canceller.promise,
        mode: "pushimg",
        farm: $scope.subDetail,
        desc: vm.pic_desc,
        img: $scope.image
      };

      $http.post(url, req, { timeout: canceller.promise }).then(
        function suscess(response) {
          if (response.data == "AuthenticationSuccessful") {
            //////console.log(response, 1);
            $mdDialog.show(
              $mdDialog
                .alert()
                .parent(
                  angular.element(document.querySelector("#popupContainer"))
                )
                .clickOutsideToClose(true)
                .title("แจ้งเตือน")
                .textContent("เพิ่มรูปภาพเรียบร้อยแล้ว")
                .ariaLabel("Alert Dialog Demo")
                .ok("OK")
                .targetEvent()
            );
            vm.picRefresh();
            $scope.modalPic.hide();
            $ionicLoading.hide();
          } else if (response.data == "AuthenticationFailed") {
            ////////console.log(response, 2);

            // $mdDialog.show(
            //   $mdDialog
            //     .alert()
            //     .parent(
            //       angular.element(document.querySelector("#popupContainer"))
            //     )
            //     .clickOutsideToClose(true)
            //     .title("แจ้งเตือน")
            //     .textContent("ไม่สามารถเพิ่มรูปภาพได้ ลองใหม่อีกครั้ง")
            //     .ariaLabel("Alert Dialog Demo")
            //     .ok("Got it!")
            //     .targetEvent()
            // );
            mobiscroll.alert({
              title: "แจ้งเตือน",
              message: "ไม่สามารถเพิ่มรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
              callback: function() {
                mobiscroll.toast({
                  message: "ยกเลิก"
                });
              }
            });

            // $scope.modalPic.hide();
            $ionicLoading.hide();
          }
        },
        function err(err) {
          // $mdDialog.show(
          //   $mdDialog
          //     .alert()
          //     .parent(
          //       angular.element(document.querySelector("#popupContainer"))
          //     )
          //     .clickOutsideToClose(true)
          //     .title("แจ้งเตือน")
          //     .textContent("ไม่สามารถเพิ่มรูปภาพได้ ลองใหม่อีกครั้ง")
          //     .ariaLabel("Alert Dialog Demo")
          //     .ok("Got it!")
          //     .targetEvent()
          // );

          mobiscroll.alert({
            title: "แจ้งเตือน",
            message: "ไม่สามารถเพิ่มรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
            callback: function() {
              mobiscroll.toast({
                message: "ยกเลิก"
              });
            }
          });

          // $scope.modalPic.hide();
          $ionicLoading.hide();
        }
      );

      $timeout(function() {
        canceller.resolve("user cancelled");
      }, 10000);
    };

    vm.disconnect = function(e) {
      $scope.modaldetail.hide();
      var confirm = $mdDialog
        .confirm()
        .title("ต้องการยกเลิกการเชื่อมต่อหรือไม่ ?")
        .textContent(
          "เมื่อยกเลิกการเชื่อมต่อกับอุปกรณ์ " +
            e.iot_id +
            "  คุณจะไม่สามารถดูรายละเอียดของอุปกรณ์ และการตั้งค่าอุปกรณ์ได้"
        )
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน. ยกเลิกการเชื่อมต่อ")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function() {
          let url = $rootScope.ip + "area.php";
          let req = {
            mode: "dissyncIOT",
            sub: e,
            global: $rootScope.global
          };
          $http.post(url, req).then(
            function suscess(response) {
              $ionicHistory.goBack();
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
            function err(err) {}
          );
        },
        function() {
          ////////console.log("2");
        }
      );

      ////////console.log(e);
    };

    $scope.allImages = [
      {
        src: "img/aa.png"
      },
      {
        src: "img/bg.jpg"
      }
    ];

    $scope.zoomMin = 1;
    $scope.showImages = function(index) {
      $scope.activeSlide = index;
      $scope.showModal("templates/farmer/gallery-zoomview.html");
    };

    $scope.showModal = function(templateUrl) {
      $ionicModal
        .fromTemplateUrl(templateUrl, {
          scope: $scope
        })
        .then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
      $scope.modal.remove();
    };

    $scope.updateSlideStatus = function(slide) {
      var zoomFactor = $ionicScrollDelegate
        .$getByHandle("scrollHandle" + slide)
        .getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };
  })

  .controller("detail2-2Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $q
  ) {
    let vm = this;

    vm.back = function() {
      console.log("123");
    };

    $scope.black = function() {
      $ionicHistory.goBack();
    };

    $scope.crop = JSON.parse($stateParams.crop);
    $scope.subfarm = JSON.parse($stateParams.sub);

    function onStart() {
      let cancellerLoadpic = $q.defer();
      let url = $rootScope.ip + "area.php";
      let req = {
        mode: "selectRoute",
        config: $scope.detail,
        global: $rootScope.global
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          $scope.status = true;

          console.log(response);
          if (response.data.status == true) {
            $scope.data = response.data;
            // $scope.data.result = [{id:1},{id:2},{id:3},{id:4},{id:5}]
          } else {
            $scope.data = response.data;
          }
          console.log(response);
        },
        function err(err) {
          console.log(err);
          $scope.data = [];
          $scope.status = false;
        }
      );
    }

    if ($stateParams.detail) {
      $scope.detail = JSON.parse($stateParams.detail);
      console.log($scope.detail);
      onStart()
    }

     vm.refresh = function() {
      delete $scope.data;
      delete $scope.status;
      onStart();
    };

    // var map = new google.maps.Map(document.getElementById("mapaaaa"), {
    //   zoom: 5,
    //   // center: bounds.getCenter(),
    //   center: new google.maps.LatLng(13.760412, 100.485357),
    //   streetViewControl: false,
    //   fullscreenControl: false,
    //   mapTypeId: "satellite",
    //   mapTypeControl: false,
    //   zoomControl: false
    // });

    // var triangleCoords = [];
    // var all_overlays = [];

    // var polygonCoords = [];
    // var polygonCoordsFarm = [];

    // var bounds = new google.maps.LatLngBounds();

    // vm.selectSub = function(e, index) {
    //   $scope.subDetail = e;
    //   for (i = 0; i < all_overlays.length; i++) {
    //     all_overlays[i].setMap(null); //or line[i].setVisible(false);
    //   }

    //   triangleCoords = [];
    //   all_overlays = [];
    //   polygonCoords = [];
    //   bounds = new google.maps.LatLngBounds();
    //   $scope.abc = {
    //     lat: e.sub_lat.split(","),
    //     lng: e.sub_lng.split(",")
    //   };

    //   // ////////console.log($scope.abc);

    //   $timeout(function() {
    //     // ////////console.log("666666");

    //     for (let i = 0; i < $scope.abc.lat.length; i++) {
    //       let k = {
    //         lat: parseFloat($scope.abc.lat[i]),
    //         lng: parseFloat($scope.abc.lng[i])
    //       };

    //       polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
    //       triangleCoords.push(k);
    //     }
    //     // ////////console.log(triangleCoords);

    //     for (i = 0; i < polygonCoords.length; i++) {
    //       bounds.extend(polygonCoords[i]);
    //     }

    //     var bermudaTriangle = new google.maps.Polygon({
    //       editable: false,
    //       paths: triangleCoords,
    //       strokeColor: "red",
    //       strokeOpacity: 0.8,
    //       strokeWeight: 2,
    //       fillColor: "red",
    //       fillOpacity: 0.35
    //     });

    //     all_overlays.push(bermudaTriangle);
    //     bermudaTriangle.setMap(map);

    //     map.fitBounds(bounds);
    //     map.panTo(bounds.getCenter());
    //   }, 100);
    // };
    // if ($stateParams.detail) {
    //   vm.selectSub($scope.detail);
    // }
  });

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
    Service
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
            $scope.editdata = {date_start:null,date_end:null}
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

      function onStartFirst() {
        $ionicLoading.show();
        let url = $rootScope.ip + "dashboard.php";
        let req = { mode: "selectAreaSub", global: $rootScope.global };
        $http.post(url, req).then(
          function suscess(response) {
            console.log(response.data);
             vm.lsStatus = response.data.status;
            if (response.data.status == true) {
              vm.area = response.data.area;
              $scope.model.area = vm.area[0];
              vm.areaChange($scope.model.area);
            } else {
              vm.area = response.data.area;
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );

        // let url2 = $rootScope.iplogin + "login.php";
        // let req2 = { mode: "dashboardrealtime", global: $rootScope.global };

        // $http.post(url2, req2).then(
        //   function suscess(response) {
        //     console.log(response);
        //     if (response.data.result) {
        //       $scope.data = response.data.result;
        //     } else {
        //     }
        //     $ionicLoading.hide();
        //   },
        //   function err(err) {
        //     $ionicLoading.hide();
        //   }
        // );
      }

      onStartFirst();

      vm.areaChange = function(e) {
        $ionicLoading.show();
        delete vm.sub;
        delete $scope.dataDash;
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
        $scope.model.sub = null;

        let url = $rootScope.ip + "dashboard.php";
        let req = { mode: "selectSub", sub: e };
        $http.post(url, req).then(
          function suscess(response) {
             vm.lsStatus = response.data.status;
            //console.log(response.data);
            if (response.data.status == true) {
              vm.sub = response.data.sub;
              $scope.model.sub = vm.sub[0];
              vm.subChange($scope.model.sub);
            } else {
            }
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.subChange = function(e) {
        vm.day(e);
      };

      vm.day = function(e) {
        console.log('day')
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

      vm.findManual = function(e){
        console.log($scope.editdata)
        console.log($scope.editdata.date_start)
        console.log($scope.editdata.date_end)

        console.log($scope.editdata.date_start < $scope.editdata.date_end)
        let start;
        let end;
        if($scope.editdata.date_start > $scope.editdata.date_end){
          start =  $scope.editdata.date_end;
          end =  $scope.editdata.date_start;
          
        }else{
          start = $scope.editdata.date_start;
          end = $scope.editdata.date_end;

        }
         $ionicLoading.show();
        let url2 = $rootScope.ip + "dashboard.php";
        let req2 = {
          mode: "dashboardrealtimeHistoryM",
          global: $rootScope.global,
          value: e,
          date_start : start,
          date_end : end
        };

        $http.post(url2, req2).then(
          function suscess(response) {
            console.log(response.data)
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
      }

      vm.manual = function(e) {
        $scope.modaledit.show();
      };

      $scope.colors = ["#fdd835", "#00e5ff", "#00bfa5"];

      $scope.labels = ["Loading"];

      // $scope.series = ["AIR(%)", "TEMPERATURE(°C)", "SOIL(%)"];


      $scope.data = [0];

      $scope.onClick = function(points, evt) {
        console.log(points, evt);
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

    vm.back = function() {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go("app.farmerMenu");
    };

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

            // $ionicLoading.hide();
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
      let k = JSON.stringify(e);
      $state.go("app.setting", { iotno: e.iot_id, iotdetail: k });
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
    vm.iotdetail = JSON.parse($stateParams.iotdetail);
    vm.iotno = $stateParams.iotno;
    console.log(vm.iotno);
    console.log(vm.iotdetail);

    $scope.toggle = { meter2: true, meter3: true };

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
      // console.log(req);

      $http.post(url, req).then(
        function suscess(response) {
          // console.log(response.data);
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

    vm.toggleChange2 = function() {
      $scope.toggle.meter2 = !$scope.toggle.meter2;

      $ionicScrollDelegate.resize();
    };

    vm.toggleChange3 = function() {
      $scope.toggle.meter3 = !$scope.toggle.meter3;
      $ionicScrollDelegate.resize();
    };

    $scope.model = { status: false };

    function onStart() {
      $ionicLoading.show();
      let cancellerLoadpic = $q.defer();
      let url = $rootScope.ip + "setting.php";
      let req = {
        mode: "clockList",
        iotno: vm.iotno,
        global: $rootScope.global
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 10000);

      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          vm.statusfinal = true;
          vm.listClock = response.data;
          console.log(response.data);

          if (response.data.soil) {
            vm.model.soil = response.data.soil[0];
          } else {
            angular.merge(vm.model.soil, { sss: false });
          }
          if (response.data.air) {
            vm.model.air = response.data.air[0];
          } else {
            angular.merge(vm.model.air, { sss: false });
          }

          $ionicLoading.hide();
        },
        function err(err) {
          vm.statusfinal = false;
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    vm.ac1Add = function() {
      $state.go("app.setting3", {
        iotno: vm.iotno,
        type: "SOILMOISTURE",
        ac: "AC1"
      });
    };

    vm.ac2Add = function() {
      $state.go("app.setting4", {
        iotno: vm.iotno,
        type: "AIRMOISTURE",
        ac: "AC2"
      });
    };

    vm.editSetting = function(e) {
      let k = JSON.stringify(e);
      $state.go("app.settingedit", {
        setting: k
      });
    };

    vm.refresh = function() {
      onStart();
    };
  })

  .controller("setting3Ctrl", function(
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

    $scope.model = { status: false };

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
            $ionicHistory.goBack();
          } else {
            Service.timeout();
          }

          $ionicLoading.hide();

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

  .controller("setting4Ctrl", function(
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

    $scope.model = { status: false };

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
            $ionicHistory.goBack();
          } else {
            Service.timeout();
          }

          $ionicLoading.hide();

          console.log(response.data);
        },
        function err(err) {
          Service.timeout();
          $ionicLoading.hide();
        }
      );
    };
  })

  .controller("settingeditCtrl", function(
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
    console.log(vm.settingClock);
    vm.model = { soil: null };
    vm.model.soil = vm.settingClock;

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

    vm.save3 = function() {
      $ionicLoading.show();
      let url = $rootScope.ip + "setting.php";
      let cancellerLoadpic = $q.defer();
      let req = {
        mode: "updateSettingSoil",
        setting: vm.model.soil
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 6000);
      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function(response) {
          $ionicLoading.hide();

          console.log(response.data);
          $ionicHistory.goBack();
        },
        function err(err) {
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

    vm.deleteClock = function() {
      var confirm = $mdDialog
        .confirm()
        .title("แจ้งเตือน")
        .textContent("ต้องการลบการตั้งค่านี้หรือไม่ ?")
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function() {
          $ionicLoading.show();
          let url = $rootScope.ip + "setting.php";
          let req = { mode: "deleteClock", setting: vm.settingClock };

          $http.post(url, req).then(
            function(response) {
              if (response.data.status == true) {
                mobiscroll.alert({
                  title: "แจ้งเตือน",
                  message: "ลบการตั้งค่าเรียบร้อยแล้ว",
                  callback: function() {
                    $ionicHistory.goBack();
                  }
                });
              } else {
                mobiscroll.alert({
                  title: "แจ้งเตือน",
                  message: "ไม่สามารถลบการตั้งค่านี้ได้",
                  callback: function() {}
                });
              }
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
        },
        function() {
          console.log("2");
        }
      );
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

angular
  .module("app")

  .controller("newsettingCtrl", function(
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
          console.log(response.data);
            vm.lsStatus = response.data.status;
          if (response.data.status == true) {
            vm.status = true;
            $scope.data = response.data;
            $scope.selected = $scope.data.result[0];
            vm.onClick($scope.selected);

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

    vm.onClick = function(e) {
      console.log(e);
      vm.iotno = e.iot_id;
      onStart();
    };

    $scope.toggle = { meter2: true, meter3: true };

    $scope.manualSoil = function(e) {
      if (e == "none") {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน ")
          .textContent(
            "ไม่สามารถทำงานได้เนื้องจากอุปกรณ์อยู่ในโหมด Auto ต้องการเปลี่ยนเป็นโหมด Manual หรือไม่ ?"
          )
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("โหมด Manual")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function(result) {
          if (result) {
            $scope.auto(2);
          }
        });
        return;
      }

      // if (e == "none") {
      //   mobiscroll.alert({
      //     title: "แจ้งเตือน",
      //     message: "ไม่สามารถทำงานได้เนื้องจากอุปกรณ์อยู่ในโหมด Auto",
      //     callback: function() {
      //       console.log("55");
      //     }
      //   });
      //   return;
      // }
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
      if (e == "none") {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน ")
          .textContent(
            "ไม่สามารถทำงานได้เนื้องจากอุปกรณ์อยู่ในโหมด Auto ต้องการเปลี่ยนเป็นโหมด Manual หรือไม่ ?"
          )
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("โหมด Manual")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function(result) {
          if (result) {
            $scope.auto(2);
          }
        });
        return;
      }
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
      // console.log(req);

      $http.post(url, req).then(
        function suscess(response) {
          // console.log(response.data);
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

    vm.toggleChange2 = function() {
      $scope.toggle.meter2 = !$scope.toggle.meter2;

      $ionicScrollDelegate.resize();
    };

    vm.toggleChange3 = function() {
      $scope.toggle.meter3 = !$scope.toggle.meter3;
      $ionicScrollDelegate.resize();
    };

    $scope.model = { status: false };

    function onStart() {
      $ionicLoading.show();
      let cancellerLoadpic = $q.defer();
      let url = $rootScope.ip + "setting.php";
      let req = {
        mode: "clockList",
        iotno: vm.iotno,
        global: $rootScope.global
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
      }, 10000);

      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          vm.statusfinal = true;
          vm.listClock = response.data;
          console.log(response.data);

          if (response.data.soil) {
            vm.model.soil = response.data.soil[0];
          } else {
            angular.merge(vm.model.soil, { sss: false });
          }
          if (response.data.air) {
            vm.model.air = response.data.air[0];
          } else {
            angular.merge(vm.model.air, { sss: false });
          }

          $ionicLoading.hide();
        },
        function err(err) {
          vm.statusfinal = false;
          $ionicLoading.hide();
        }
      );
    }

    vm.ac1Add = function() {
      $state.go("app.setting3", {
        iotno: vm.iotno,
        type: "SOILMOISTURE",
        ac: "AC1"
      });
    };

    vm.ac2Add = function() {
      $state.go("app.setting4", {
        iotno: vm.iotno,
        type: "AIRMOISTURE",
        ac: "AC2"
      });
    };

    vm.editSetting = function(e) {
      let k = JSON.stringify(e);
      $state.go("app.settingedit", {
        setting: k
      });
    };

    vm.refresh = function() {
      onStart();
    };
  });

angular.module('app')

.controller('outCtrl', function($timeout,$ionicActionSheet,$ionicLoading,$scope,$rootScope,$localStorage,$ionicHistory,$state,$stateParams) {
  let vm = this;
  vm.mess = {mess:$stateParams.mess}
vm.logout = function(){


   let hideSheet = $ionicActionSheet.show({
        titleText: "Logout ",
        buttons: [
          {
            text: '<i class="icon ion-log-out"></i> Logout'
          }
          // {
          //   text: '<i class="icon ion-chatboxes"></i> Share with Sms'
          // },
          // {
          //   text: '<i class="icon ion-network"></i> Share with Social'
          // },
        ],

        buttonClicked: function(index) {
          console.log(index);
          if (index == 0) {
            $ionicLoading.show();
            $rootScope.global = {};
            delete $localStorage.globalAGRI;
            // $ionicHistory.clearCache();

            $timeout(function() {
              window.location = "index.html";
              $ionicLoading.hide();
            }, 1000);
          }

          // if (index == 1) {
          // }

          // if (index == 2) {
          // }

          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function() {
        hideSheet();
      }, 7000);
  

    }

    
})

angular
  .module("app")
  .controller("farmingCtrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog
  ) {
    let vm = this;

    vm.startPlant = function(){
      $state.go('app.startPlant')
    }

    vm.recordPlant = function(){
      $state.go('app.recordPlant')
    }

    vm.predictPlant = function(){
      $state.go('app.predictPlant')
    }

    vm.recordResult = function(){
      $state.go('app.recordResult')
    }    















    // vm.drawstatus = false;
    // vm.newShape = null;
    // var all_overlays = [];
    // var selectedShape;
    // var map = new google.maps.Map(document.getElementById("maps"), {
    //   center: {
    //     lat: 13.713462,
    //     lng: 100.478819
    //   },
    //   mapTypeControl: true,
    //   streetViewControl: false,
    //   fullscreenControl: false,
    //   mapTypeControlOptions: {
    //     style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    //     mapTypeIds: ["satellite", "roadmap", "hybrid"]
    //   },
    //   mapTypeId: "roadmap",
    //   zoom: 18
    // });

    // var drawingManager = new google.maps.drawing.DrawingManager({
    //   drawingControl: false,
    //   drawingControlOptions: {
    //     position: google.maps.ControlPosition.RIGHT_CENTER,
    //     drawingModes: ["polygon"]
    //   },
    //   polygonOptions: {
    //     clickable: true,
    //     editable: true,
    //     draggable: false,
    //     fillColor: "red",
    //     strokeColor: "green",
    //     strokeWeight: 3
    //   },
    //   drawingMode: null
    // });

    // function clearSelection() {
    //   if (selectedShape) {
    //     selectedShape.setEditable(false);
    //     selectedShape = null;
    //   }
    // }

    // function setSelection(shape) {
    //   clearSelection();
    //   selectedShape = shape;
    //   shape.setEditable(true);
    // }

    // function deleteSelectedShape() {
    //   if (selectedShape) {
    //     selectedShape.setMap(null);

    //     vm.newShape = null;
    //   }
    // }

    // google.maps.event.addListener(drawingManager, "polygoncomplete", function(
    //   polygon
    // ) {
    //   /// Disable Controller//
    //   drawingManager.setDrawingMode(null);
    //   $scope.$apply(function() {
    //     vm.newShape = polygon;
    //   });

    //   onComplete();

    //   setSelection(vm.newShape);
    // });

    // function onComplete() {
    //   google.maps.event.addListener(
    //     vm.newShape.getPath(),
    //     "set_at",
    //     function() {
    //       console.log(vm.newShape.getPath().g);
    //     }
    //   );

    //   //Insert point
    //   google.maps.event.addListener(
    //     vm.newShape.getPath(),
    //     "insert_at",
    //     function() {
    //       console.log(vm.newShape.getPath().g);
    //     }
    //   );

    //   // add a marker at each coordinate

    //   //click shape
    //   google.maps.event.addListener(vm.newShape, "click", function(e) {
    //     console.log(vm.newShape);
    //     setSelection(vm.newShape);
    //   });
    // }

    // drawingManager.setMap(map);

    // vm.delete = function() {
    //   deleteSelectedShape();
    //   vm.drawstatus = !vm.drawstatus;
    // };

    // vm.draw = function() {
    //   vm.drawstatus = !vm.drawstatus;
    //   drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    // };



  });

angular
  .module("app")
  .controller("startPlantCtrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $mdSidenav,
    $log
  ) {
    let vm = this;

    $scope.group = [
      { name: "ผัก" },
      { name: "ผลไม้" },
      { name: "พืช" },
      { name: "สัตว์" },
      { name: "อื่นๆ" }
    ];

    $scope.items = [
      {
        id: 01,
        name: "ผัก",
        list: [
          { id: 1, name: "ผักบุ้ง" },
          { id: 2, name: "ผักกาด" },
          { id: 3, name: "กะเพรา" },
          { id: 4, name: "ผักชี" },
          { id: 5, name: "ผักคะน้า" }
        ]
      },
      {
        id: 02,
        name: "ผลไม้",
        list: [
          { id: 1, name: "มังคุด" },
          { id: 2, name: "ทุเรียนหมอนทอง" },
          { id: 3, name: "มะม่วงมัน" },
          { id: 4, name: "มะม่วงอกร่อง" },
          { id: 5, name: "มะพร้าวน้ำหอม" }
        ]
      },
      {
        id: 03,
        name: "พืช",
        list: [
          { id: 1, name: "แก้วมังกร" },
          { id: 2, name: "ข้าวโพด" },
          { id: 3, name: "มันสำปะหลัง" },
          { id: 4, name: "ทานตะวัน" },
          { id: 5, name: "ถั่วเหลือง" }
        ]
      },

      {
        id: 04,
        name: "สัตว์",
        list: [
          { id: 1, name: "หมู" },
          { id: 2, name: "ไก่" },
          { id: 3, name: "ปลานิล" },
          { id: 4, name: "กุ้ง" },
          { id: 5, name: "ปลาดุก" }
        ]
      }
    ];

    $scope.currentNavItem = "page0";

    $scope.goto = function(page) {
      $scope.list = page;
    };

    $scope.goto($scope.items[0]);

    console.log($scope.items);
    $scope.selected = [];

    $scope.toggle = function(item, list) {
      var idx = list.indexOf(item);
      console.log(idx);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    };

    $scope.exists = function(item, list) {
      // console.log(list)
      return list.indexOf(item) > -1;
    };

    vm.save = function() {
      let k = JSON.stringify(angular.copy($scope.selected));
      console.log($scope.selected.length > 0);
      if ($scope.selected.length > 0) {
        $state.go("app.startPlant2", { list: k });
      } else {
        $mdDialog.show(
          $mdDialog
            .alert()
            .parent(angular.element(document.querySelector("#popupContainer")))
            .clickOutsideToClose(false)
            .title("แจ้งเตือน !")
            .textContent("ยังไม่ได้เลือกรายการ ลองใหม่อีกครั่ง..")
            .ariaLabel("Alert Dialog Demo")
            .ok("ยืนยัน")
            .targetEvent()
        );
      }
      console.log(k);
    };

    $scope.toggleRight = buildToggler("right");
    $scope.isOpenRight = function() {
      return $mdSidenav("right").isOpen();
    };

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function() {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }

    $ionicModal
      .fromTemplateUrl("my-filter.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modalFilter = modal;
      });

    $scope.openModalFilter = function() {
      $scope.modalFilter.show();
    };
    $scope.closeModalFilter = function() {
      $scope.modalFilter.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function() {
      $scope.modalFilter.remove();
    });
  })

  .controller("RightCtrl", function(
    $scope,
    $timeout,
    $mdSidenav,
    $log,
    $ionicLoading
  ) {
    $scope.close = function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav("right")
        .close()
        .then(function() {
          $log.debug("close RIGHT is done");
        });

      $ionicLoading.show({
        duration: 1000
      });

      console.log($scope.filterselected);
    };

    $scope.group = [
      { name: "ผัก" },
      { name: "ผลไม้" },
      { name: "พืช" },
      { name: "สัตว์" },
      { name: "อื่นๆ" }
    ];

    $scope.items = [
      {
        id: 01,
        name: "ผัก",
        list: [
          { id: 1, name: "ผักประเภท1" },
          { id: 2, name: "ผักประเภท2" },
          { id: 3, name: "ผักประเภท3" },
          { id: 4, name: "ผักประเภท4" },
          { id: 5, name: "ผักประเภท5" }
        ]
      },
      {
        id: 02,
        name: "ผลไม้",
        list: [
          { id: 1, name: "ผลไม้ประเภท1" },
          { id: 2, name: "ผลไม้ประเภท2" },
          { id: 3, name: "ผลไม้ประเภท3" },
          { id: 4, name: "ผลไม้ประเภท4" },
          { id: 5, name: "ผลไม้ประเภท5" }
        ]
      },
      {
        id: 03,
        name: "พืช",
        list: [
          { id: 1, name: "พืชประเภท1" },
          { id: 2, name: "พืชประเภท2" },
          { id: 3, name: "พืชประเภท3" },
          { id: 4, name: "พืชประเภท4" },
          { id: 5, name: "พืชประเภท5" }
        ]
      },

      {
        id: 04,
        name: "สัตว์",
        list: [
          { id: 1, name: "สัตว์บก" },
          { id: 2, name: "สัตว์น้ำ" },
          { id: 3, name: "สัตว์ปีก" },
          { id: 4, name: "สัตว์ครึ่งบกครึ่งน้ำ" }
        ]
      }
    ];

    $scope.currentNavItem = "page0";

    $scope.goto = function(page) {
      $scope.list = page;
    };

    $scope.goto($scope.items[0]);

    $scope.selected = [];
    $scope.filterselected = [];

    $scope.toggle = function(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    };

    $scope.exists = function(item, list) {
      // console.log(list)
      return list.indexOf(item) > -1;
    };
  })

  .controller("startPlant2Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $q
  ) {
    let vm = this;
    vm.list = JSON.parse($stateParams.list);
    $scope.crop = { frm_code: $rootScope.global.mob_farm_code };
    $rootScope.cropSet = $scope.crop;

    function onStart() {
      $ionicLoading.show();
      let cancellerLoadpic = $q.defer();
      let url = $rootScope.ip + "area.php";
      let req = {
        mode: "selectFarm",
        config: $rootScope.cropSet,
        global: $rootScope.global
      };

      $timeout(function() {
        cancellerLoadpic.resolve("user cancelled");
        $ionicLoading.hide();
      }, 8000);

      $http.post(url, req, { timeout: cancellerLoadpic.promise }).then(
        function suscess(response) {
          $scope.status = true;

          if (response.data.status == true) {
            $scope.data = response.data;
            vm.selectedss = response.data.result[0];
          } else {
            $scope.data = response.data;
          }
          $ionicLoading.hide();
        },
        function err(err) {
          console.log(err);
          $scope.data = [];
          $scope.status = false;
          $ionicLoading.hide();
        }
      );
    }

    vm.change = function(e) {
      vm.selectedss = e;
    };

    onStart();

    vm.save = function(e) {
      $ionicLoading.show();
      let myJSON = JSON.stringify(e);
      let url = $rootScope.ip + "area.php";
      let req = { mode: "selectsubfarm", value: e };
      $http.post(url, req).then(
        function suscess(response) {
          if (response.data.status == true) {
            $ionicLoading.hide();

            let res = JSON.stringify(response.data.result);
            console.log(res);
            console.log(myJSON);

            $state.go("app.startPlant3", {
              crop: myJSON,
              sub: res,
              list: $stateParams.list
            });
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    };
  })

  .controller("startPlant3Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $q,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;
    vm.pic_desc;
    //modal
    {
      $ionicModal
        .fromTemplateUrl("list_map.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalListmap = modal;
        });

      $scope.openModalListmap = function() {
        $scope.modalListmap.show();
      };
      $scope.closeModalListmap = function() {
        $scope.modalListmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalListmap.remove();
      });
    }


    $scope.crop = JSON.parse($stateParams.crop);
    $scope.subfarm = JSON.parse($stateParams.sub);
    $scope.list = JSON.parse($stateParams.list);


    vm.listmap = function() {
      $scope.modalListmap.show();
      $ionicLoading.show();

      $timeout(function() {
        $ionicLoading.hide();

        console.log($scope.subfarm);

        let triangleCoordsListmap = [];
        let all_overlaysListmap = [];
        let polygonCoordsListmap = [];
        let polygonCoordsFarmListmap = [];
        let boundsListmap = new google.maps.LatLngBounds();
        for (let x = 0; x < $scope.subfarm.length; x++) {
          let e = $scope.subfarm[x];

          let map = new google.maps.Map(document.getElementById(x), {
            zoom: 5,
            // center: bounds.getCenter(),
            center: new google.maps.LatLng(13.760412, 100.485357),
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            zoomControl: false
          });
          triangleCoordsListmap = [];
          polygonCoordsListmap = [];
          boundsListmap = new google.maps.LatLngBounds();
          $scope.abc = {
            lat: e.sub_lat.split(","),
            lng: e.sub_lng.split(",")
          };

          // ////////console.log($scope.abc);

          // ////////console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i])
            };

            polygonCoordsListmap.push(new google.maps.LatLng(k.lat, k.lng));
            triangleCoordsListmap.push(k);
          }
          // ////////console.log(triangleCoords);

          for (i = 0; i < polygonCoordsListmap.length; i++) {
            boundsListmap.extend(polygonCoordsListmap[i]);
          }

          let bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoordsListmap,
            strokeColor: "red",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.35
          });

          all_overlaysListmap.push(bermudaTriangle);

          // console.log(all_overlaysListmap[x]);
          // console.log(map);

          all_overlaysListmap[x].setMap(map);

          map.fitBounds(boundsListmap);
          map.panTo(boundsListmap.getCenter());
        }
      }, 1000);
    };

    vm.selectSubBefore = function(e, index) {
      $scope.modalListmap.hide();
      vm.selectSub(e, index);
    };

    vm.selectSub = function(e, index) {
      $scope.subDetail = e;

      let map = new google.maps.Map(document.getElementById("mapbbb"), {
        zoom: 5,
        // center: bounds.getCenter(),
        center: new google.maps.LatLng(13.760412, 100.485357),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: "satellite",
        mapTypeControl: false,
        zoomControl: false
      });

      let triangleCoords = [];
      let all_overlays = [];

      let polygonCoords = [];
      let polygonCoordsFarm = [];

      let bounds = new google.maps.LatLngBounds();

      for (i = 0; i < all_overlays.length; i++) {
        all_overlays[i].setMap(null); //or line[i].setVisible(false);
      }

      triangleCoords = [];
      all_overlays = [];
      polygonCoords = [];
      bounds = new google.maps.LatLngBounds();
      $scope.abc = {
        lat: e.sub_lat.split(","),
        lng: e.sub_lng.split(",")
      };

      $timeout(function() {
        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i])
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // ////////console.log(triangleCoords);

        for (i = 0; i < polygonCoords.length; i++) {
          bounds.extend(polygonCoords[i]);
        }

        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }, 100);
    };

    if ($scope.subfarm.length > 0) {
      $scope.selected = $scope.subfarm[0];
      vm.selectSub($scope.subfarm[0]);
    }


    vm.save = function(){
        console.log($scope.subDetail)
        console.log($scope.list)

    }


  });

angular
  .module("app")
  .controller("recordPlantCtrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $q,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;
    vm.pic_desc;
    //modal
    {
      $ionicModal
        .fromTemplateUrl("list_map.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalListmap = modal;
        });

      $scope.openModalListmap = function() {
        $scope.modalListmap.show();
      };
      $scope.closeModalListmap = function() {
        $scope.modalListmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalListmap.remove();
      });
    }
    function onStart() {
      $ionicLoading.show();
      let url = $rootScope.ip + "recordPlant.php";
      let req = { mode: "selectsubfarm" };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response.data);
          if (response.data.status == true) {
            $scope.subfarm = response.data.result;

            $scope.selected = $scope.subfarm[0];
            vm.selectSub($scope.subfarm[0]);

            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    // $scope.crop = JSON.parse($stateParams.crop);
    // $scope.subfarm = JSON.parse($stateParams.sub);
    // $scope.list = JSON.parse($stateParams.list);

    vm.listmap = function() {
      $scope.modalListmap.show();
      $ionicLoading.show();

      $timeout(function() {
        $ionicLoading.hide();

        console.log($scope.subfarm);

        let triangleCoordsListmap = [];
        let all_overlaysListmap = [];
        let polygonCoordsListmap = [];
        let polygonCoordsFarmListmap = [];
        let boundsListmap = new google.maps.LatLngBounds();
        for (let x = 0; x < $scope.subfarm.length; x++) {
          console.log(x);
          let e = $scope.subfarm[x];

          let map = new google.maps.Map(document.getElementById(x), {
            zoom: 5,
            // center: bounds.getCenter(),
            center: new google.maps.LatLng(13.760412, 100.485357),
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            zoomControl: false
          });
          triangleCoordsListmap = [];
          polygonCoordsListmap = [];
          boundsListmap = new google.maps.LatLngBounds();
          $scope.abc = {
            lat: e.sub_lat.split(","),
            lng: e.sub_lng.split(",")
          };

          console.log($scope.abc);

          // ////////console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i])
            };

            polygonCoordsListmap.push(new google.maps.LatLng(k.lat, k.lng));
            triangleCoordsListmap.push(k);
          }
          // ////////console.log(triangleCoords);

          for (i = 0; i < polygonCoordsListmap.length; i++) {
            boundsListmap.extend(polygonCoordsListmap[i]);
          }

          let bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoordsListmap,
            strokeColor: "red",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.35
          });

          all_overlaysListmap.push(bermudaTriangle);

          // console.log(all_overlaysListmap[x]);
          // console.log(map);

          all_overlaysListmap[x].setMap(map);

          map.fitBounds(boundsListmap);
          map.panTo(boundsListmap.getCenter());
        }
      }, 1000);
    };

    vm.selectSubBefore = function(e, index) {
      $scope.modalListmap.hide();
      vm.selectSub(e, index);
    };

    vm.selectSub = function(e, index) {
      $scope.subDetail = e;

      let map = new google.maps.Map(document.getElementById("mapbbb"), {
        zoom: 5,
        // center: bounds.getCenter(),
        center: new google.maps.LatLng(13.760412, 100.485357),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: "satellite",
        mapTypeControl: false,
        zoomControl: false
      });

      let triangleCoords = [];
      let all_overlays = [];

      let polygonCoords = [];
      let polygonCoordsFarm = [];

      let bounds = new google.maps.LatLngBounds();

      for (i = 0; i < all_overlays.length; i++) {
        all_overlays[i].setMap(null); //or line[i].setVisible(false);
      }

      triangleCoords = [];
      all_overlays = [];
      polygonCoords = [];
      bounds = new google.maps.LatLngBounds();
      $scope.abc = {
        lat: e.sub_lat.split(","),
        lng: e.sub_lng.split(",")
      };

      $timeout(function() {
        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i])
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // ////////console.log(triangleCoords);

        for (i = 0; i < polygonCoords.length; i++) {
          bounds.extend(polygonCoords[i]);
        }

        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }, 100);
    };

    // if ($scope.subfarm.length > 0) {
    //   $scope.selected = $scope.subfarm[0];
    //   vm.selectSub($scope.subfarm[0]);
    // }

    vm.save = function(e) {
      console.log(e);
      let k = JSON.stringify(e);
      console.log(k);
      $state.go("app.recordPlant2", { list: k });
    };

    $scope.list = [
      { id: 1, name: "ผักบุ้ง", lastupdate: "2020-01-01" },
      { id: 2, name: "ผักกาด", lastupdate: "2020-02-01" },
      { id: 3, name: "กะเพรา", lastupdate: "2020-01-15" },
      { id: 4, name: "ผักชี", lastupdate: "2020-01-25" },
      { id: 5, name: "ผักคะน้า", lastupdate: "2020-01-05" }
    ];
  })

  .controller("recordPlant2Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $q,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;
    console.log("66");
    $scope.model = { date: null, data: null };
    $scope.list = JSON.parse($stateParams.list);

    let platform = ionic.Platform.platform();

    vm.pickdate = function(e) {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.model.date = data;
            return;
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

        myPopup.then(function(data) {
          $scope.model.date = data;
          console.log(e);
          return;
        });
      }

    };
  });

angular
  .module("app")
  .controller("predictPlantCtrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $q,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;
    vm.pic_desc;
    //modal
    {
      $ionicModal
        .fromTemplateUrl("list_map.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalListmap = modal;
        });

      $scope.openModalListmap = function() {
        $scope.modalListmap.show();
      };
      $scope.closeModalListmap = function() {
        $scope.modalListmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalListmap.remove();
      });
    }
    function onStart() {
      $ionicLoading.show();
      let url = $rootScope.ip + "recordPlant.php";
      let req = { mode: "selectsubfarm" };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response.data);
          if (response.data.status == true) {
            $scope.subfarm = response.data.result;

            $scope.selected = $scope.subfarm[0];
            vm.selectSub($scope.subfarm[0]);

            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    // $scope.crop = JSON.parse($stateParams.crop);
    // $scope.subfarm = JSON.parse($stateParams.sub);
    // $scope.list = JSON.parse($stateParams.list);

    vm.listmap = function() {
      $scope.modalListmap.show();
      $ionicLoading.show();

      $timeout(function() {
        $ionicLoading.hide();

        console.log($scope.subfarm);

        let triangleCoordsListmap = [];
        let all_overlaysListmap = [];
        let polygonCoordsListmap = [];
        let polygonCoordsFarmListmap = [];
        let boundsListmap = new google.maps.LatLngBounds();
        for (let x = 0; x < $scope.subfarm.length; x++) {
          console.log(x);
          let e = $scope.subfarm[x];

          let map = new google.maps.Map(document.getElementById(x), {
            zoom: 5,
            // center: bounds.getCenter(),
            center: new google.maps.LatLng(13.760412, 100.485357),
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            zoomControl: false
          });
          triangleCoordsListmap = [];
          polygonCoordsListmap = [];
          boundsListmap = new google.maps.LatLngBounds();
          $scope.abc = {
            lat: e.sub_lat.split(","),
            lng: e.sub_lng.split(",")
          };

          console.log($scope.abc);

          // ////////console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i])
            };

            polygonCoordsListmap.push(new google.maps.LatLng(k.lat, k.lng));
            triangleCoordsListmap.push(k);
          }
          // ////////console.log(triangleCoords);

          for (i = 0; i < polygonCoordsListmap.length; i++) {
            boundsListmap.extend(polygonCoordsListmap[i]);
          }

          let bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoordsListmap,
            strokeColor: "red",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.35
          });

          all_overlaysListmap.push(bermudaTriangle);

          // console.log(all_overlaysListmap[x]);
          // console.log(map);

          all_overlaysListmap[x].setMap(map);

          map.fitBounds(boundsListmap);
          map.panTo(boundsListmap.getCenter());
        }
      }, 1000);
    };

    vm.selectSubBefore = function(e, index) {
      $scope.modalListmap.hide();
      vm.selectSub(e, index);
    };

    vm.selectSub = function(e, index) {
      $scope.subDetail = e;

      let map = new google.maps.Map(document.getElementById("mapbbb"), {
        zoom: 5,
        // center: bounds.getCenter(),
        center: new google.maps.LatLng(13.760412, 100.485357),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: "satellite",
        mapTypeControl: false,
        zoomControl: false
      });

      let triangleCoords = [];
      let all_overlays = [];

      let polygonCoords = [];
      let polygonCoordsFarm = [];

      let bounds = new google.maps.LatLngBounds();

      for (i = 0; i < all_overlays.length; i++) {
        all_overlays[i].setMap(null); //or line[i].setVisible(false);
      }

      triangleCoords = [];
      all_overlays = [];
      polygonCoords = [];
      bounds = new google.maps.LatLngBounds();
      $scope.abc = {
        lat: e.sub_lat.split(","),
        lng: e.sub_lng.split(",")
      };

      $timeout(function() {
        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i])
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // ////////console.log(triangleCoords);

        for (i = 0; i < polygonCoords.length; i++) {
          bounds.extend(polygonCoords[i]);
        }

        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }, 100);
    };

    // if ($scope.subfarm.length > 0) {
    //   $scope.selected = $scope.subfarm[0];
    //   vm.selectSub($scope.subfarm[0]);
    // }

    vm.save = function(e) {
      console.log(e);
      let k = JSON.stringify(e);
      console.log(k);
      $state.go("app.predictPlant2", { list: k });
    };

    $scope.list = [
      { id: 1, name: "ผักบุ้ง", lastupdate: "2020-01-01" },
      { id: 2, name: "ผักกาด", lastupdate: "2020-02-01" },
      { id: 3, name: "กะเพรา", lastupdate: "2020-01-15" },
      { id: 4, name: "ผักชี", lastupdate: "2020-01-25" },
      { id: 5, name: "ผักคะน้า", lastupdate: "2020-01-05" }
    ];
  })

  .controller("predictPlant2Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $q,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;
    $scope.list = JSON.parse($stateParams.list)

  });



angular
  .module("app")
  .controller("recordResultCtrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $q,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;
    vm.pic_desc;
    //modal
    {
      $ionicModal
        .fromTemplateUrl("list_map.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalListmap = modal;
        });

      $scope.openModalListmap = function() {
        $scope.modalListmap.show();
      };
      $scope.closeModalListmap = function() {
        $scope.modalListmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalListmap.remove();
      });
    }
    function onStart() {
      $ionicLoading.show();
      let url = $rootScope.ip + "recordPlant.php";
      let req = { mode: "selectsubfarm" };
      $http.post(url, req).then(
        function suscess(response) {
          console.log(response.data);
          if (response.data.status == true) {
            $scope.subfarm = response.data.result;

            $scope.selected = $scope.subfarm[0];
            vm.selectSub($scope.subfarm[0]);

            $ionicLoading.hide();
          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    // $scope.crop = JSON.parse($stateParams.crop);
    // $scope.subfarm = JSON.parse($stateParams.sub);
    // $scope.list = JSON.parse($stateParams.list);

    vm.listmap = function() {
      $scope.modalListmap.show();
      $ionicLoading.show();

      $timeout(function() {
        $ionicLoading.hide();

        console.log($scope.subfarm);

        let triangleCoordsListmap = [];
        let all_overlaysListmap = [];
        let polygonCoordsListmap = [];
        let polygonCoordsFarmListmap = [];
        let boundsListmap = new google.maps.LatLngBounds();
        for (let x = 0; x < $scope.subfarm.length; x++) {
          console.log(x);
          let e = $scope.subfarm[x];

          let map = new google.maps.Map(document.getElementById(x), {
            zoom: 5,
            // center: bounds.getCenter(),
            center: new google.maps.LatLng(13.760412, 100.485357),
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            zoomControl: false
          });
          triangleCoordsListmap = [];
          polygonCoordsListmap = [];
          boundsListmap = new google.maps.LatLngBounds();
          $scope.abc = {
            lat: e.sub_lat.split(","),
            lng: e.sub_lng.split(",")
          };

          console.log($scope.abc);

          // ////////console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i])
            };

            polygonCoordsListmap.push(new google.maps.LatLng(k.lat, k.lng));
            triangleCoordsListmap.push(k);
          }
          // ////////console.log(triangleCoords);

          for (i = 0; i < polygonCoordsListmap.length; i++) {
            boundsListmap.extend(polygonCoordsListmap[i]);
          }

          let bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoordsListmap,
            strokeColor: "red",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.35
          });

          all_overlaysListmap.push(bermudaTriangle);

          // console.log(all_overlaysListmap[x]);
          // console.log(map);

          all_overlaysListmap[x].setMap(map);

          map.fitBounds(boundsListmap);
          map.panTo(boundsListmap.getCenter());
        }
      }, 1000);
    };

    vm.selectSubBefore = function(e, index) {
      $scope.modalListmap.hide();
      vm.selectSub(e, index);
    };

    vm.selectSub = function(e, index) {
      $scope.subDetail = e;

      let map = new google.maps.Map(document.getElementById("mapbbb"), {
        zoom: 5,
        // center: bounds.getCenter(),
        center: new google.maps.LatLng(13.760412, 100.485357),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: "satellite",
        mapTypeControl: false,
        zoomControl: false
      });

      let triangleCoords = [];
      let all_overlays = [];

      let polygonCoords = [];
      let polygonCoordsFarm = [];

      let bounds = new google.maps.LatLngBounds();

      for (i = 0; i < all_overlays.length; i++) {
        all_overlays[i].setMap(null); //or line[i].setVisible(false);
      }

      triangleCoords = [];
      all_overlays = [];
      polygonCoords = [];
      bounds = new google.maps.LatLngBounds();
      $scope.abc = {
        lat: e.sub_lat.split(","),
        lng: e.sub_lng.split(",")
      };

      $timeout(function() {
        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i])
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // ////////console.log(triangleCoords);

        for (i = 0; i < polygonCoords.length; i++) {
          bounds.extend(polygonCoords[i]);
        }

        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }, 100);
    };

    // if ($scope.subfarm.length > 0) {
    //   $scope.selected = $scope.subfarm[0];
    //   vm.selectSub($scope.subfarm[0]);
    // }

    vm.save = function(e) {
      console.log(e);
      let k = JSON.stringify(e);
      console.log(k);
      $state.go("app.recordResult2", { list: k });
    };

    $scope.list = [
      { id: 1, name: "ผักบุ้ง", lastupdate: "2020-01-01" },
      { id: 2, name: "ผักกาด", lastupdate: "2020-02-01" },
      { id: 3, name: "กะเพรา", lastupdate: "2020-01-15" },
      { id: 4, name: "ผักชี", lastupdate: "2020-01-25" },
      { id: 5, name: "ผักคะน้า", lastupdate: "2020-01-05" }
    ];
  })

  .controller("recordResult2Ctrl", function(
    $ionicHistory,
    $state,
    $scope,
    $stateParams,
    $rootScope,
    $http,
    $ionicModal,
    $ionicLoading,
    $timeout,
    $ionicPopup,
    Service,
    $mdDialog,
    $q,
    $ionicSlideBoxDelegate
  ) {
    let vm = this;
    $scope.list = JSON.parse($stateParams.list)

  });

