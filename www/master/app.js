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
    "ngMaterial",
    "easypiechart",
    "flexcalendar",
    "pascalprecht.translate",
  ])

  .run(function (
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
    $ionicPlatform.ready(function () {
      // console.log = function () {};
      $rootScope.global = $localStorage.globalAGRI;

      if ($rootScope.global) {
        console.log(1);
      } else {
        console.log(2);
      }

      document.addEventListener("deviceready", function () {
        // console.log("receive");
        // Example #1: WITHOUT API URL

        var shouldSetEnabled = true;
        FirebasePlugin.setCrashlyticsCollectionEnabled(
          shouldSetEnabled,
          function () {
            console.log("Crashlytics data collection is enabled");
          },
          function (error) {
            console.error(
              "Crashlytics data collection couldn't be enabled: " + error
            );
          }
        );

        FirebasePlugin.didCrashOnPreviousExecution(
          function (didCrashOnPreviousExecution) {
            console.log(
              `Did crash on previous execution: ` + didCrashOnPreviousExecution
            );
          },
          function (error) {
            console.error(
              `Error getting Crashlytics did crash on previous execution: ${error}`
            );
          }
        );

        try {
          cordova.plugins.inappupdate.update(
            "immediate",
            function () {},
            function () {}
          );
        } catch (error) {
          console.log(error);
        }

        FirebasePlugin.getToken(
          function (fcmToken) {
            console.log(fcmToken);
          },
          function (error) {
            console.error(error);
          }
        );
        FirebasePlugin.onMessageReceived(
          function (message) {
            console.log("Message type: " + message.messageType);
            if (message.messageType === "notification") {
              console.log("Notification message received");
              if (message.tap) {
                console.log("Tapped in " + message.tap);
              }
            }
            console.dir(message);
          },
          function (error) {
            console.error(error);
          }
        );

        FirebasePlugin.grantPermission(function (hasPermission) {
          console.log(
            "Permission was " + (hasPermission ? "granted" : "denied")
          );
        });
      });

      $rootScope.ipregister =
        "https://digimove.365supplychain.com/agripro/agri_ociv2/";
      $rootScope.iplogin =
        "https://digimove.365supplychain.com/agripro/agri_ociv2/"; //365

      let platform = ionic.Platform.platform();
      if (platform == "android") {
        document.addEventListener(
          "deviceready",
          function () {
            let connection;
            // listen for Online event
            $rootScope.$on(
              "$cordovaNetwork:online",
              function (event, networkState) {
                if (platform == "android") {
                  document.addEventListener("deviceready", function () {
                    var notificationOpenedCallback = function (jsonData) {};
                  });
                } else if (platform == ios) {
                }
                connection = true;
              }
            );

            // listen for Offline event
            $rootScope.$on(
              "$cordovaNetwork:offline",
              function (event, networkState) {
                connection = false;
              }
            );

            $rootScope.$watch(
              function () {
                return connection;
              },
              function (newData, oldData) {
                if (newData == false) {
                  $ionicBackdrop.retain();
                  mobiscroll.snackbar({
                    message: "Connection offline Please check your Internet.",
                    display: "top",
                    duration: false,
                  });
                }
                if (newData == true) {
                  $ionicBackdrop.release();
                  mobiscroll.snackbar({
                    message: "Connection Online",
                    display: "top",
                    color: "success",
                    duration: 3000,
                  });
                }
              }
            );
          },
          false
        );

        document.addEventListener("deviceready", function () {
          $ionicPlatform.registerBackButtonAction(function (event) {
            if (
              $state.current.name == "app.farmerMenu" ||
              $state.current.name == "app.out"
            ) {
            } else if ($state.current.name == "app.farmerlogin") {
              var Popup = $ionicPopup.confirm({
                title: "<b>แจ้งเตือน !!</b>",

                subTitle:
                  "<center>ต้องการออกจากแอปพลิเคชั่น<br>" +
                  " หรือไม่ ?</center>",
              });

              Popup.then(function (res) {
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
      } else if (platform == "ios") {
        document.addEventListener("deviceready", function () {});
      }

      if (window.cordova && window.Keyboard) {
        window.Keyboard.hideKeyboardAccessoryBar(false);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    $rootScope.$on("$stateChangeStart", function () {
      $mdDialog.cancel();
      if ($localStorage.globalAGRI) {
        $rootScope.global = $localStorage.globalAGRI;

        $rootScope.ip =
          "https://digimove.365supplychain.com/agripro/agri_ociv2/model/"; //365

        // $rootScope.ip =
        // "http://localhost/agri_oci/model/"; //365
      } else {
        $location.path("/farmerlogin");
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // $ionicConfigProvider.views.forwardCache(false);
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.tabs.position("bottom");
    $urlRouterProvider.otherwise("/app/farmerMenu");

    $stateProvider
      .state("apps", {
        url: "/apps",
        abstract: true,
        templateUrl: "templates/navbarRecordEtc.html",
        controller: "nevCtrl as vm",
      })

      .state("apps.recordEtc", {
        url: "/recordEtc",
        views: {
          "tab-1": {
            templateUrl: "templates/farmer/plant/recordEtc.html",
            controller: "recordEtcCtrl as vm",
          },
        },
      })

      .state("apps.recordEtcs", {
        url: "/recordEtcs",
        views: {
          "tab-2": {
            templateUrl: "templates/farmer/plant/recordEtcs.html",
            controller: "recordEtcsCtrl as vm",
          },
        },
      });

    ////////////////////////

    $stateProvider
      .state("mart", {
        url: "/mart",
        abstract: true,
        templateUrl: "templates/farmer/mart/nev.html",
        controller: "martCtrl as vm",
      })

      .state("mart.rfq", {
        url: "/rfq",
        views: {
          "tab-6": {
            templateUrl: "templates/farmer/mart/rfq/rfq.html",
            controller: "rfqCtrl as vm",
          },
        },
      })
      .state("mart.rfq1", {
        url: "/rfq1/:id:user_id",
        views: {
          "tab-6": {
            templateUrl: "templates/farmer/mart/rfq/rfq1.html",
            controller: "rfq1Ctrl as vm",
          },
        },
      })

      .state("mart.rfqOrder", {
        url: "/rfqOrder",
        views: {
          "tab-7": {
            templateUrl: "templates/farmer/mart/rfq/rfqOrder.html",
            controller: "rfqOrderCtrl as vm",
          },
        },
      })

      .state("mart.rfqOrderDetail", {
        url: "/rfqOrderDetail/:id:user_id:line",
        views: {
          "tab-7": {
            templateUrl: "templates/farmer/mart/rfq/rfqOrderDetail.html",
            controller: "rfqOrderDetailCtrl as vm",
          },
        },
      })

      .state("mart.dash", {
        url: "/dash",
        views: {
          "tab-1": {
            templateUrl: "templates/farmer/mart/dash.html",
            controller: "martDashCtrl as vm",
          },
        },
      })
      .state("mart.edit", {
        url: "/dashEdit/:ml_item",
        views: {
          "tab-1": {
            templateUrl: "templates/farmer/mart/dashEdit.html",
            controller: "martDashEditCtrl as vm",
          },
        },
      })

      .state("mart.shipping", {
        url: "/shipping",
        views: {
          "tab-1": {
            templateUrl: "templates/farmer/mart/shipping.html",
            controller: "shippingCtrl as vm",
          },
        },
      })

      .state("mart.shippingDetail", {
        url: "/shippingDetail/:id",
        views: {
          "tab-1": {
            templateUrl: "templates/farmer/mart/shippingDetail.html",
            controller: "shippingDetailCtrl as vm",
          },
        },
      })

      .state("mart.booked", {
        url: "/booked",
        views: {
          "tab-2": {
            templateUrl: "templates/farmer/mart/booked.html",
            controller: "martBookedCtrl as vm",
          },
        },
      })

      .state("mart.inv", {
        url: "/inv",
        views: {
          "tab-3": {
            templateUrl: "templates/farmer/mart/inv.html",
            controller: "martInvCtrl as vm",
          },
        },
      })

      .state("mart.ship", {
        url: "/ship",
        views: {
          "tab-4": {
            templateUrl: "templates/farmer/mart/ship.html",
            controller: "martShipCtrl as vm",
          },
        },
      })

      .state("mart.finish", {
        url: "/finish",
        views: {
          "tab-5": {
            templateUrl: "templates/farmer/mart/finish.html",
            controller: "martFinishCtrl as vm",
          },
        },
      })

      .state("mart.hist", {
        url: "/hist",
        views: {
          "tab-2": {
            templateUrl: "templates/farmer/mart/histSale.html",
            controller: "martHistCtrl as vm",
          },
        },
      });

    $stateProvider
      .state("add", {
        url: "/add",
        abstract: true,
        templateUrl: "templates/farmer/mart/addnev.html",
        controller: "addnevCtrl as vm",
      })

      .state("add.add1", {
        url: "/add1",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/mart/martadd1.html",
            controller: "martAdd1Ctrl as vm",
          },
        },
      });

    $stateProvider.state("farmerlogin", {
      url: "/farmerlogin",
      templateUrl: "templates/farmerlogin.html",
      controller: "farmerloginCtrl as vm",
    });
    ///////////////////////////////////
    $stateProvider
      .state("register", {
        url: "/register",
        abstract: true,
        templateUrl: "templates/nev/registernev.html",
      })

      .state("register.regisapp", {
        url: "/regisapp",
        views: {
          regis: {
            templateUrl: "templates/regisapp.html",
            controller: "regisAppCtrl as vm",
          },
        },
      });

    ////////////////////////////////////

    $stateProvider
      .state("new", {
        url: "/news",
        abstract: true,
        templateUrl: "templates/farmer/new/navnews.html",
        controller: "nevNewsCtrl as vm",
      })

      .state("new.news", {
        url: "/news",
        views: {
          "new-news": {
            templateUrl: "templates/farmer/new/news.html",
            controller: "newsCtrl as vm",
          },
        },
      })

      .state("new.newsDetail", {
        url: "/new/newsDetail/:detail",
        views: {
          "new-news": {
            templateUrl: "templates/farmer/new/newsDetail.html",
            controller: "newsDetailCtrl as vm",
          },
        },
      })

      .state("new.notifi", {
        url: "/notifi",
        views: {
          "new-notifi": {
            templateUrl: "templates/farmer/new/notifi.html",
            controller: "notifiCtrl as vm",
          },
        },
      })

      .state("new.notifiDetail", {
        url: "/notifi/notifiDetail/:detail",
        views: {
          "new-notifi": {
            templateUrl: "templates/farmer/new/notifiDetail.html",
            controller: "notifiDetailCtrl as vm",
          },
        },
      });

    $stateProvider
      .state("account", {
        url: "/account",
        abstract: true,
        templateUrl: "templates/farmer/account/navaccount.html",
        controller: "navAccountCtrl as vm",
      })

      .state("account.sale", {
        url: "/accountsale",
        views: {
          "account-sale": {
            templateUrl: "templates/farmer/account/accountSale.html",
            controller: "accountSaleCtrl as vm",
          },
        },
      })

      .state("account.saleAdd", {
        url: "/accountsaleAdd",
        views: {
          "account-sale": {
            templateUrl: "templates/farmer/account/accountSaleAdd.html",
            controller: "accountSaleAddCtrl as vm",
          },
        },
      })

      .state("account.saleDetail", {
        url: "/accountsaleDetail/:item",
        views: {
          "account-sale": {
            templateUrl: "templates/farmer/account/accountSaleDetail.html",
            controller: "accountSaleDetailCtrl as vm",
          },
        },
      })

      .state("account.buy", {
        url: "/accountbuy",
        views: {
          "account-buy": {
            templateUrl: "templates/farmer/account/accountBuy.html",
            controller: "accountBuyCtrl as vm",
          },
        },
      })

      .state("account.buyAdd", {
        url: "/accountbuyAdd",
        views: {
          "account-buy": {
            templateUrl: "templates/farmer/account/accountBuyAdd.html",
            controller: "accountBuyAddCtrl as vm",
          },
        },
      })

      .state("account.buyDetail", {
        url: "/accountbuyDetail/:item",
        views: {
          "account-buy": {
            templateUrl: "templates/farmer/account/accountBuyDetail.html",
            controller: "accountBuyDetailCtrl as vm",
          },
        },
      })

      .state("account.total", {
        url: "/accounttotal",
        views: {
          "account-total": {
            templateUrl: "templates/farmer/account/accountTotal.html",
            controller: "accountTotalCtrl as vm",
          },
        },
      });

    $stateProvider
      .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "templates/nev/navbar.html",
        controller: "nevCtrl as vm",
      })

      .state("app.farmerMenu", {
        url: "/farmerMenu",
        views: {
          "tab-menu": {
            templateUrl: "templates/tab/farmerMenu.html",
            controller: "farmerMenuCtrl as vm",
          },
        },
      })

      .state("app.addimg", {
        url: "/farmerMenu/addimg",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/farming/addimage.html",
            controller: "addimgCtrl as vm",
          },
        },
      })

      .state("app.addimgadd", {
        url: "/farmerMenu/addimgadd:item",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/farming/addimageAdd.html",
            controller: "addimgAddCtrl as vm",
          },
        },
      })

      .state("app.addviewbyid", {
        url: "/farmerMenu/addviewbyid:item",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/farming/addviewbyid.html",
            controller: "addviewbyidCtrl as vm",
          },
        },
      })

      .state("app.viewimg", {
        url: "/farmerMenu/viewimg",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/farming/viewimage.html",
            controller: "viewimageCtrl as vm",
          },
        },
      })

      .state("app.viewimgDetail", {
        url: "/farmerMenu/viewimgDetail:id",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/farming/viewimageDetail.html",
            controller: "viewimgDetailCtrl as vm",
          },
        },
      })

      .state("app.farming", {
        url: "/farmerMenu/farming",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/farming.html",
            controller: "farmingCtrl as vm",
          },
        },
      })

      .state("app.startPlant01", {
        url: "/farmerMenu/startPlant01",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/startPlant01.html",
            controller: "startPlant01Ctrl as vm",
          },
        },
      })

      .state("app.startPlant", {
        url: "/farmerMenu/startPlant",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/startPlant.html",
            controller: "startPlantCtrl as vm",
          },
        },
      })

      .state("app.startPlantDetail", {
        url: "/farmerMenu/startPlantDetail/:wo",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/startPlantDetail.html",
            controller: "startPlantDetailCtrl as vm",
          },
        },
      })

      .state("app.startPlantSelectItem", {
        url: "/farmerMenu/startPlantSelectItem/:wo",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/startPlantSelectItem.html",
            controller: "startPlantSelectItemCtrl as vm",
          },
        },
      })

      .state("app.recordEtc1", {
        url: "/recordEtc1/:data",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/recordEtc1.html",
            controller: "recordEtc1Ctrl as vm",
          },
        },
      })

      .state("app.recordEtc2", {
        url: "/recordEtc2/:data",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/recordEtc2.html",
            controller: "recordEtc2Ctrl as vm",
          },
        },
      })

      .state("app.receive", {
        url: "/farmerMenu/receive",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/receive.html",
            controller: "receiveCtrl as vm",
          },
        },
      })

      .state("app.singleReceive", {
        url: "/singlereceive",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/receivelot/singleReceive.html",
            controller: "singleReceiveCtrl as vm",
          },
        },
      })

      .state("app.multiReceive", {
        url: "/multiReceive",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/receivelot/multiReceive.html",
            controller: "multiReceiveCtrl as vm",
          },
        },
      })
      .state("app.multiReceive2", {
        url: "/multiReceive2/:wo",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/receivelot/multiReceive2.html",
            controller: "multiReceive2Ctrl as vm",
          },
        },
      })


      .state("app.viewMultiReceive", {
        url: "/viewMultiReceive",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/receivelot/viewMultiReceive.html",
            controller: "viewMultiReceiveCtrl as vm",
          },
        },
      })

      .state("app.recordPlant", {
        url: "/recordPlant",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/recordPlant.html",
            controller: "recordPlantCtrl as vm",
          },
        },
      })

      .state("app.recordPlant2", {
        url: "/recordPlant2",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/recordPlant2.html",
            controller: "recordPlant2Ctrl as vm",
          },
        },
      })

      .state("app.recordResult", {
        url: "/recordResult/:list",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/recordResult.html",
            controller: "recordResultCtrl as vm",
          },
        },
      })

      .state("app.recordResult2", {
        url: "/recordResult2/:list",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/recordResult2.html",
            controller: "recordResult2Ctrl as vm",
          },
        },
      })

      .state("app.receive2", {
        url: "/farmerMenu/receive2/:lotref",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/receive2.html",
            controller: "receive2Ctrl as vm",
          },
        },
      })

      .state("app.withdrawList", {
        url: "/withdrawList",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/withdrawList.html",
            controller: "withdrawListCtrl as vm",
          },
        },
      })

      .state("app.withdraw", {
        url: "/withdraw",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/withdraw.html",
            controller: "withdrawCtrl as vm",
          },
        },
      })

      .state("app.withdrawHist", {
        url: "/withdrawHist",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/withdrawHist.html",
            controller: "withdrawHistCtrl as vm",
          },
        },
      })

      .state("app.withdrawHistDetail", {
        url: "/withdrawHistDetail/:pick_nbr",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/plant/withdrawHistDetail.html",
            controller: "withdrawHistDetailCtrl as vm",
          },
        },
      })

      .state("app.env", {
        url: "/env",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/environment/environment.html",
            controller: "envCtrl as vm",
          },
        },
      })

      .state("app.weather", {
        url: "/farmerMenu/weather",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/weather.html",
            controller: "weatherCtrl as vm",
          },
        },
      })

      .state("app.weatherDetail", {
        url: "/weather/Detail/:action:desc",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/weatherDetail.html",
            controller: "weatherDetailCtrl as vm",
          },
        },
      })

      .state("app.controliot", {
        url: "/controliot",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/controliot.html",
            controller: "controliotCtrl as vm",
          },
        },
      })

      .state("app.controliotwifi", {
        url: "/controliotwifi",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/controliotwifi.html",
            controller: "controliotwifiCtrl as vm",
          },
        },
      })

      .state("app.controliot2", {
        url: "/controliot2/:chart/:dataDash",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/controliot2.html",
            controller: "controliot2Ctrl as vm",
          },
        },
      })

      .state("app.controliotSetting", {
        url: "/controlSetting/:listClock/:dataDash",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/controliotSetting.html",
            controller: "controliotSettingCtrl as vm",
          },
        },
      })

      .state("app.hist", {
        url: "/hist",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/hist.html",
            controller: "histCtrl as vm",
          },
        },
      })

      .state("app.setting", {
        url: "/setting/:iotno/:iotdetail",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/setting.html",
            controller: "settingCtrl as vm",
          },
        },
      })

      .state("app.setting3", {
        url: "/setting3/:iotno:type:ac:setting",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/setting3.html",
            controller: "setting3Ctrl as vm",
          },
        },
      })

      .state("app.setting4", {
        url: "/setting4/:iotno:type:ac:setting",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/setting4.html",
            controller: "setting4Ctrl as vm",
          },
        },
      })

      .state("app.settingedit", {
        url: "/settingedit/:setting",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/settingedit.html",
            controller: "settingeditCtrl as vm",
          },
        },
      })

      .state("app.dayssetting", {
        url: "/dayssetting",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/dayssetting.html",
            controller: "dayssettingCtrl as vm",
          },
        },
      })

      .state("app.martCheck", {
        url: "/martCheck",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/mart/login/martlogin.html",
            controller: "martLoginCtrl as vm",
          },
        },
      })

      /////////////////////////

      .state("app.detail", {
        url: "/detail",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/detail/detail.html",
            controller: "detailCtrl as vm",
          },
        },
      })
      .state("app.detail2", {
        url: "/detail2/:wo/:route",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/detail/detail2.html",
            controller: "detail2Ctrl as vm",
          },
        },
      })

      .state("app.detailHist", {
        url: "/detailHist",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/detail/detailHist.html",
            controller: "detailHistCtrl as vm",
          },
        },
      })

      .state("app.detailGrowth", {
        url: "/detailGrowth/:wo_id",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/detail/detailGrowth.html",
            controller: "detailGrowthCtrl as vm",
          },
        },
      })

      .state("app.detailDisease", {
        url: "/detailDisease/:wo_id",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/detail/detailDisease.html",
            controller: "detailDiseaseCtrl as vm",
          },
        },
      })

      .state("app.detailDiseaseComment", {
        url: "/detailDiseaseComment/:postId",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/detail/detailDiseaseComment.html",
            controller: "detailDiseaseCommentCtrl as vm",
          },
        },
      })

      .state("app.detail2-2", {
        url: "/detail2-2/:crop:detail:job", //:sub
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/detail/detail2-2.html",
            controller: "detail2-2Ctrl as vm",
          },
        },
      })

      .state("app.detailAction", {
        url: "/detailAction/:crop:sub:detail:job:routing",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/detail/detailAction.html",
            controller: "detailActionCtrl as vm",
          },
        },
      })

      .state("app.appsetting", {
        url: "/appsetting",
        views: {
          "tab-appsetting": {
            templateUrl: "templates/tab/appsetting.html",
            controller: "appsettingCtrl as vm",
          },
        },
      })

      .state("app.usersetting", {
        url: "/usersetting",
        views: {
          "tab-appsetting": {
            templateUrl: "templates/tab/usersetting.html",
            controller: "usersettingCtrl as vm",
          },
        },
      })

      .state("app.area", {
        url: "/appsetting/area",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/area.html",
            controller: "areaCtrl as vm",
          },
        },
      })

      .state("app.areaEdit", {
        url: "/appsetting/areaEdit/:id",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/areaEdit.html",
            controller: "areaEditCtrl as vm",
          },
        },
      })

      .state("app.area2", {
        url: "/appsetting/area2/:crop:sub",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/area2.html",
            controller: "area2Ctrl as vm",
          },
        },
      })

      .state("app.add3", {
        url: "/appsetting/add3",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/add3.html",
            controller: "add3Ctrl as vm",
          },
        },
      })

      .state("app.add100", {
        url: "/appsetting/add100",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/add100.html",
            controller: "add100Ctrl as vm",
          },
        },
      })

      .state("app.createArea", {
        url: "/appsetting/createArea",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/createArea.html",
            controller: "createAreaCtrl as vm",
          },
        },
      })

      .state("app.predict", {
        url: "/predict",
        views: {
          "tab-menu": {
            templateUrl: "templates/farmer/predictHarvest.html",
            controller: "predictHarvestCtrl as vm",
          },
        },
      })

      ////EndMenu

      .state("app.editpassword", {
        url: "/appsetting/editpassword",
        views: {
          "tab-appsetting": {
            templateUrl: "templates/farmer/editpassword.html",
            controller: "editpasswordCtrl as vm",
          },
        },
      })

      .state("app.deleteuser", {
        url: "/appsetting/deleteuser",
        views: {
          "tab-appsetting": {
            templateUrl: "templates/tab/deleteUser.html",
            controller: "deleteUserCtrl as vm",
          },
        },
      })

      .state("app.farmerCheck", {
        url: "/farmerCheck",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/farmerCheck.html",
            controller: "farmerCheckCtrl as vm",
          },
        },
      })

      .state("app.farmerResult", {
        url: "/farmerResult",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/farmerResult.html",
            controller: "farmerResultCtrl as vm",
          },
        },
      })

      .state("app.out", {
        url: "/out/:mess",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/out.html",
            controller: "outCtrl as vm",
          },
        },
      })

      .state("app.buysale", {
        url: "/buysale",
        views: {
          menuContent: {
            templateUrl: "templates/farmer/buysale.html",
            controller: "buysaleCtrl as vm",
          },
        },
      });

    $stateProvider
      .state("meeting", {
        url: "/meeting",
        abstract: true,
        templateUrl: "templates/farmer/meeting/navmeeting.html",
        controller: "nevMeetingCtrl as vm",
      })

      .state("meeting.meetingViewCalendar", {
        url: "/meetingViewCalendar",
        views: {
          "meet-calendar": {
            templateUrl: "templates/farmer/meeting/meetingViewCalendar.html",
            controller: "meetingViewCalendarCtrl as vm",
          },
        },
      })

      .state("meeting.meetingViewList", {
        url: "/meetingViewList",
        views: {
          "meet-list": {
            templateUrl: "templates/farmer/meeting/meetingViewList.html",
            controller: "meetingViewListCtrl as vm",
          },
        },
      })

      .state("meeting.meetingViewNow", {
        url: "/meetingViewNow",
        views: {
          "meet-now": {
            templateUrl: "templates/farmer/meeting/meetingViewNow.html",
            controller: "meetingViewNowCtrl as vm",
          },
        },
      })

      .state("meeting.meeting2", {
        url: "/meeting2",
        views: {
          "meet-now": {
            templateUrl: "templates/farmer/meeting/meeting2.html",
            controller: "meeting2Ctrl as vm",
          },
        },
      })

      .state("meeting.meetingEvent", {
        url: "/meetingEvent",
        views: {
          "meet-now": {
            templateUrl: "templates/farmer/meeting/meetingEvent.html",
            controller: "meetingEventCtrl as vm",
          },
        },
      })

      .state("meeting.request1", {
        url: "/request1",
        views: {
          "meet-now": {
            templateUrl: "templates/farmer/meeting/request1.html",
            controller: "meetingrequest1Ctrl as vm",
          },
        },
      })

      .state("meeting.request2", {
        url: "/request2",
        views: {
          "meet-now": {
            templateUrl: "templates/farmer/meeting/request2.html",
            controller: "meetingrequest2Ctrl as vm",
          },
        },
      });
  })

  .config(function ($mdGestureProvider) {
    // For mobile devices without jQuery loaded, do not
    // intercept click events during the capture phase.
    $mdGestureProvider.skipClickHijack();
  })

  .config(function ($mdDateLocaleProvider) {
    var shortMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    $mdDateLocaleProvider.months = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    $mdDateLocaleProvider.shortMonths = shortMonths;
    $mdDateLocaleProvider.days = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัสบดี",
      "ศุกร์",
      "เสาร์",
    ];
    $mdDateLocaleProvider.shortDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
    $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
      return shortMonths[date.getMonth()] + " " + (date.getFullYear() + 543);
    };
    $mdDateLocaleProvider.formatDate = function (date) {
      return `${moment(date).format("DD/MM")}/${
        moment(date).get("year") + 543
      }`;
    };
    $mdDateLocaleProvider.parseDate = function (dateString) {
      var dateArray = dateString.split("/");
      dateString =
        dateArray[1] + "/" + dateArray[0] + "/" + (dateArray[2] - 543);
      var m = moment(dateString, "L", true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };
  })

  .factory("fachttp", function ($http, $rootScope, $timeout) {
    return {
      login: function (file, e) {
        let req = {
          global: $rootScope.global,
        };

        angular.merge(req, e);
        return $http.post(
          // "http://localhost/agri_oci/"+file,
          "https://digimove.365supplychain.com/agripro/agri_ociv2/" + file,
          req
        );
      },
      model: function (file, e, pms) {
        let req = {
          global: $rootScope.global,
        };
        angular.merge(req, e);
        return $http.post(
          // "http://localhost/agri_ociv2/model/"+file,
          // "http://192.168.9.51/agri_ociv4/model/" + file,
          "https://digimove.365supplychain.com/agripro/agri_ociv4/model/" +file,
          req,
          pms
        );
      },
      mart: function (file, e, pms) {
        let req = {
          global: $rootScope.global,
        };
        angular.merge(req, e);
        return $http.post(
          // "http://localhost/agri_ociv2/model/mart/" + file,
          "http://203.154.158.79/agripro-mart/Mobile/mart/" + file,
          req,
          pms
        );
      },
    };
  });
