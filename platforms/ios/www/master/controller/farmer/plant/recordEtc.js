angular
  .module("app")
  .controller(
    "recordEtcCtrl",
    function (
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
      $ionicSlideBoxDelegate,
      $cordovaBarcodeScanner,
      $ionicPlatform,
      $ionicScrollDelegate,
      $cordovaGeolocation,
      deviceService,
      fachttp
    ) {
      let vm = this;
      var numrow1 = 0;
      var numrow2 = 10;

      $scope.deg = 0;
      $scope.rotate = function (angle) {
        //console.log($ionicSlideBoxDelegate.currentIndex());
        $scope.deg += angle;
        if ($scope.deg === 360) {
          $scope.deg = 0;
        }
        if ($scope.deg < 0) {
          $scope.deg += 360;
        }

        $("#" + "image" + $ionicSlideBoxDelegate.currentIndex()).css({
          "-webkit-transform": "rotate(" + $scope.deg + "deg)", //Safari 3.1+, Chrome
          "-moz-transform": "rotate(" + $scope.deg + "deg)", //Firefox 3.5-15
          "-ms-transform": "rotate(" + $scope.deg + "deg)", //IE9+
          "-o-transform": "rotate(" + $scope.deg + "deg)", //Opera 10.5-12.00
          transform: "rotate(" + $scope.deg + "deg)", //Firefox 16+, Opera 12.50+
        });

        // //console.log($ionicSlideBoxDelegate.currentIndex())
        //   $scope.angle += angle;
        //   if(($scope.angle === 360)) {
        //       $scope.angle = 0;
        //   }
        //   if($scope.angle < 0) {
        //       $scope.angle += 360;
        //   }
      };

      function onStart() {
        // $ionicLoading.show();

        let req = {
          mode: "onStart",
          user: $rootScope.global,
          numrow1: numrow1,
          numrow2: numrow2,
        };

        fachttp.model("recordEtc.php", req).then(
          function (response) {
            $ionicLoading.hide();
            vm.status = response.data.status;
            if (response.data.status == true) {
              vm.list = response.data;
              $ionicScrollDelegate.resize();

              //console.log(vm.list);
              numrow1 += 10;
              numrow2 += 10;
            } else {
              vm.list = response.data.result;
              $mdDialog
                .show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("แจ้งเตือน")
                    .textContent("ไม่พบรายการเพาะปลูก")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                )
                .then(
                  function (answer) {},
                  function () {}
                );
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      $scope.showMore = function () {
        $ionicLoading.show();
        //console.log(numrow1);
        //console.log(numrow2);

        let req = {
          mode: "onStart",
          user: $rootScope.global,
          numrow1: numrow1,
          numrow2: numrow2,
        };

        fachttp.model("recordEtc.php", req).then(
          function (response) {
            //console.log(vm.status )
            $ionicLoading.hide();
            //console.log(response.data);

            if (response.data.status == true) {
              numrow1 += 10;
              numrow2 += 10;
              for (let i = 0; i < response.data.result.length; i++) {
                vm.list.result.push(response.data.result[i]);
              }
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              $mdDialog
                .show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("แจ้งเตือน")
                    .textContent("ไม่พบรายการเพาะปลูก")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                )
                .then(
                  function (answer) {},
                  function () {}
                );
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      onStart();

      vm.marker;

      vm.clickList = function (e) {
        $state.go("app.recordEtc1", { data: e.ld_lot });
      };

      //console.log(vm.pic);
      vm.button = function () {
        let platform = ionic.Platform.platform();
        //console.log(ionic.Platform.platform());

        if (
          ionic.Platform.platform() == "android" ||
          ionic.Platform.platform() == "ios"
        ) {
          $ionicLoading.show({
            template:
              '<ion-spinner icon="spiral"  class="spinner-calm"></ion-spinner><br>กำลังค้นหา',
          });
          // https://digimove.365supplychain.com/agripro/detail-web/#/tab/detail/TH-1201-50-201050060001
          $cordovaBarcodeScanner.scan().then(
            function (barcode) {
              if (!barcode.cancelled) {
                $ionicLoading.hide();
                let lot;
                if (barcode.text.substring(0, 4) == "http") {
                  lotArr = barcode.text.split("/");
                  lot = lotArr[lotArr.length - 1];
                  //console.log("1");
                  $state.go("app.recordEtc1", { data: lot });
                } else {
                  lot = barcode.text;
                  //console.log("f");
                  $state.go("app.recordEtc1", { data: lot });
                }
              } else {
                $ionicLoading.hide();
              }
            },
            function (error) {
              $ionicLoading.hide();
            }
          );
        } else {
          $scope.abc = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="abc.lot">',
            title: "Enter Lot",
            subTitle: "Please use Lot",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.abc.lot) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.abc.lot;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            //console.log("Tapped!", res);
            if (res.substring(0, 4) == "http") {
              let lotArr = res.split("/");
              let lot = lotArr[lotArr.length - 1];
              $state.go("app.recordEtc1", { data: lot });
            } else {
              let lot = $scope.abc.lot;
              $state.go("app.recordEtc1", { data: lot });
            }
          });
        }
      };
    }
  )

  .controller(
    "recordEtcsCtrl",
    function (
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
      $ionicSlideBoxDelegate,
      $cordovaBarcodeScanner,
      $ionicPlatform,
      $ionicScrollDelegate,
      $cordovaGeolocation,
      deviceService,
      fachttp
    ) {
      let vm = this;
      var numrow1 = 0;
      var numrow2 = 10;

      $scope.deg = 0;
      $scope.rotate = function (angle) {
        //console.log($ionicSlideBoxDelegate.currentIndex());
        $scope.deg += angle;
        if ($scope.deg === 360) {
          $scope.deg = 0;
        }
        if ($scope.deg < 0) {
          $scope.deg += 360;
        }

        $("#" + "image" + $ionicSlideBoxDelegate.currentIndex()).css({
          "-webkit-transform": "rotate(" + $scope.deg + "deg)", //Safari 3.1+, Chrome
          "-moz-transform": "rotate(" + $scope.deg + "deg)", //Firefox 3.5-15
          "-ms-transform": "rotate(" + $scope.deg + "deg)", //IE9+
          "-o-transform": "rotate(" + $scope.deg + "deg)", //Opera 10.5-12.00
          transform: "rotate(" + $scope.deg + "deg)", //Firefox 16+, Opera 12.50+
        });

        // //console.log($ionicSlideBoxDelegate.currentIndex())
        //   $scope.angle += angle;
        //   if(($scope.angle === 360)) {
        //       $scope.angle = 0;
        //   }
        //   if($scope.angle < 0) {
        //       $scope.angle += 360;
        //   }
      };

      function onStart() {
        // $ionicLoading.show();
        let url = $rootScope.ip + "recordEtc.php";
        let req = {
          mode: "onStarts",
          user: $rootScope.global,
          numrow1: numrow1,
          numrow2: numrow2,
        };

        fachttp.model("recordEtc.php", req).then(
          function (response) {
            $ionicLoading.hide();
            vm.status = response.data.status;
            if (response.data.status == true) {
              vm.list = response.data;
              $ionicScrollDelegate.resize();

              //console.log(vm.list);
              numrow1 += 10;
              numrow2 += 10;
            } else {
              vm.list = response.data.result;
              $mdDialog
                .show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("แจ้งเตือน")
                    .textContent("ไม่พบรายการเพาะปลูก")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                )
                .then(
                  function (answer) {},
                  function () {}
                );
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      $scope.showMore = function () {
        $ionicLoading.show();
        //console.log(numrow1);
        //console.log(numrow2);

        let req = {
          mode: "onStarts",
          user: $rootScope.global,
          numrow1: numrow1,
          numrow2: numrow2,
        };

        fachttp.model("recordEtc.php", req).then(
          function (response) {
            $ionicLoading.hide();
            //console.log(response.data);

            if (response.data.status == true) {
              numrow1 += 10;
              numrow2 += 10;
              for (let i = 0; i < response.data.result.length; i++) {
                vm.list.result.push(response.data.result[i]);
              }
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              $mdDialog
                .show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("แจ้งเตือน")
                    .textContent("ไม่พบรายการเพาะปลูก")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                )
                .then(
                  function (answer) {},
                  function () {}
                );
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      onStart();

      vm.marker;

      vm.clickList = function (e) {
        $state.go("app.recordEtc1", { data: e.ld_lot });
      };

      //console.log(vm.pic);
      vm.button = function () {
        let platform = ionic.Platform.platform();
        //console.log(ionic.Platform.platform());

        if (
          ionic.Platform.platform() == "android" ||
          ionic.Platform.platform() == "ios"
        ) {
          $ionicLoading.show({
            template:
              '<ion-spinner icon="spiral"  class="spinner-calm"></ion-spinner><br>กำลังค้นหา',
          });

          $cordovaBarcodeScanner.scan().then(
            function (barcode) {
              if (!barcode.cancelled) {
                $ionicLoading.hide();

                let lot;
                if (barcode.text.substring(0, 4) == "http") {
                  lotArr = barcode.text.split("/");
                  lot = lotArr[lotArr.length - 1];
                  $state.go("app.recordEtc1", { data: lot });
                } else {
                  lot = barcode.text;
                  //console.log("f");
                  $state.go("app.recordEtc1", { data: lot });
                }
              } else {
                $ionicLoading.hide();
              }
            },
            function (error) {
              $ionicLoading.hide();
            }
          );
        } else {
          $scope.abc = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="abc.lot">',
            title: "Enter Lot",
            subTitle: "Please use Lot",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.abc.lot) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.abc.lot;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            //console.log("Tapped!", res);
            if (res.substring(0, 4) == "http") {
              let lotArr = res.split("/");
              let lot = lotArr[lotArr.length - 1];
              $state.go("app.recordEtc1", { data: lot });
            } else {
              let lot = $scope.abc.lot;
              $state.go("app.recordEtc1", { data: lot });
            }
          });
        }
      };
    }
  )

  .controller(
    "recordEtc1Ctrl",
    function (
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
      $ionicSlideBoxDelegate,
      $cordovaBarcodeScanner,
      $ionicPlatform,
      $ionicScrollDelegate,
      $cordovaGeolocation,
      deviceService,
      fachttp
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.goBack();
      };
      var numrow1 = 0;
      var numrow2 = 10;

      vm.ld_lot = $stateParams.data;

      $scope.fullImage = function(e){

        document.addEventListener("deviceready", function () {
          var options = {
            share: true, // default is false
            closeButton: false, // default is true
            copyToReference: true, // default is false
            headers: "", // If this is not provided, an exception will be triggered
            piccasoOptions: {}, // If this is not provided, an exception will be triggered
          };

          PhotoViewer.show(e.path, "รูปภาพ", options);
        });
      }


      httpScan(vm.ld_lot);
      //console.log(vm.ld_lot);

      $scope.deg = 0;
      $scope.rotate = function (angle) {
        //console.log($ionicSlideBoxDelegate.currentIndex());
        $scope.deg += angle;
        if ($scope.deg === 360) {
          $scope.deg = 0;
        }
        if ($scope.deg < 0) {
          $scope.deg += 360;
        }

        $("#" + "image" + $ionicSlideBoxDelegate.currentIndex()).css({
          "-webkit-transform": "rotate(" + $scope.deg + "deg)", //Safari 3.1+, Chrome
          "-moz-transform": "rotate(" + $scope.deg + "deg)", //Firefox 3.5-15
          "-ms-transform": "rotate(" + $scope.deg + "deg)", //IE9+
          "-o-transform": "rotate(" + $scope.deg + "deg)", //Opera 10.5-12.00
          transform: "rotate(" + $scope.deg + "deg)", //Firefox 16+, Opera 12.50+
        });

        // //console.log($ionicSlideBoxDelegate.currentIndex())
        //   $scope.angle += angle;
        //   if(($scope.angle === 360)) {
        //       $scope.angle = 0;
        //   }
        //   if($scope.angle < 0) {
        //       $scope.angle += 360;
        //   }
      };

      $scope.$on("$ionicView.enter", function (scopes, states) {
        if (states.fromCache) {
          loadPic();
        }
      });

      vm.marker;

      vm.share = function () {
        let t1 = "ข้อมูลแสดงการเพาะปลูกของ " + vm.data.result[0].farm_name+' ';

        let t2 = vm.data.result[0].pt_desc1;
        let t3 = vm.data.result[0].um1 + "ที่ " + vm.data.result[0].rmks1;
        let t4 = vm.data.result[0].um2
          ? vm.data.result[0].um2 + "ที่ " + vm.data.result[0].rmks2
          : "";
        let t5 = " คลิกที่ URL เพื่อเปิดลิงก์";

        console.log(t1);
        console.log(t2);
        console.log(t3);
        console.log(t4);

        let text = t1 + t2 + t3 + t4 + t5;
        let url =
          "http://www.agripromart.com/detail-web/#/tab/detail/" +
          vm.data.result[0].ld_lot;

        var options = {
          message: text, // not supported on some apps (Facebook, Instagram)
          subject: "ข้อมูลการเพาะปลูกของ Agripro Farmer", // fi. for email
          url: url,
          // chooserTitle: "Pick an app", // Android only, you can override the default share sheet title
        };

        var onSuccess = function (result) {
          console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
          console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        var onError = function (msg) {
          console.log("Sharing failed with message: " + msg);
        };

        window.plugins.socialsharing.shareWithOptions(
          options,
          onSuccess,
          onError
        );
      };

      vm.button = function () {
        let platform = ionic.Platform.platform();
        //console.log(ionic.Platform.platform());

        if (
          ionic.Platform.platform() == "android" ||
          ionic.Platform.platform() == "ios"
        ) {
          $ionicLoading.show({
            template:
              '<ion-spinner icon="spiral"  class="spinner-calm"></ion-spinner><br>กำลังค้นหา',
          });

          $cordovaBarcodeScanner.scan().then(
            function (barcode) {
              if (!barcode.cancelled) {
                let lot;
                if (barcode.text.substring(0, 4) == "http") {
                  lotArr = barcode.text.split("/");
                  lot = lotArr[lotArr.length - 1];
                  httpScan(lot);
                } else {
                  lot = barcode.text;
                  //console.log("f");
                  httpScan(lot);
                }
              } else {
                $ionicLoading.hide();
              }
            },
            function (error) {
              $ionicLoading.hide();
            }
          );
        } else {
          $scope.abc = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="abc.lot">',
            title: "Enter Lot",
            subTitle: "Please use Lot",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.abc.lot) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.abc.lot;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            //console.log("Tapped!", res);
            if (res.substring(0, 4) == "http") {
              let lotArr = res.split("/");
              let lot = lotArr[lotArr.length - 1];
              httpScan(lot);
            } else {
              let lot = $scope.abc.lot;
              httpScan(lot);
            }

            //console.log("Tapped!", res);
          });
        }
      };

      vm.pic = [
        "https://image.dek-d.com/contentimg/pay_2/durian.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Durian.jpg/800px-Durian.jpg",
      ];

      //console.log(vm.pic);

      function httpScan(e) {
        $ionicLoading.show();
        let req = {
          mode: "scan",
          br: e,
          user: $rootScope.global,
        };

        fachttp.model("recordEtc.php", req).then(
          function (response) {
            $ionicLoading.hide();
            $ionicScrollDelegate.resize();
            //console.log(response.data);

            if (response.data.status == true) {
              vm.data = response.data;
              loadPic();
              $ionicScrollDelegate.resize();
            } else {
              vm.data = response.data.result;
              $mdDialog
                .show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("แจ้งเตือน")
                    .textContent("ไม่พบรายการ QR CODE นี้อยู่")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                )
                .then(
                  function (answer) {},
                  function () {}
                );
            }
          },
          function err(err) {
            vm.data = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      function loadPic() {
        let req = {
          mode: "loadPic",
          data: vm.data.result[0],
          user: $rootScope.global,
        };

        fachttp.model("recordEtc.php", req).then(
          function (response) {
            $ionicScrollDelegate.resize();
            //console.log(response.data);
            if (response.data.status == true) {
              vm.pic = response.data.result;
              //console.log(vm.pic);
              $ionicSlideBoxDelegate.update();
              $ionicSlideBoxDelegate.slide(0);
              $ionicScrollDelegate.resize();
            } else {
              vm.pic = response.data.result;
              $ionicSlideBoxDelegate.update();
              $ionicSlideBoxDelegate.slide(0);
              $ionicScrollDelegate.resize();
            }
          },
          function err(err) {
            //console.log(err);
            $ionicSlideBoxDelegate.update();
          }
        );
      }

      vm.refreshPic = function () {
        if (vm.data.result[0].ld_lot) {
          httpScan(vm.data.result[0].ld_lot);
        } else {
          //console.log("ไม่มี");
        }
        $ionicSlideBoxDelegate.update();
        $ionicScrollDelegate.resize();
      };

      $scope.openModalMap = function () {
        $ionicModal
          .fromTemplateUrl("my-map.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalmap = modal;
            $scope.modalmap.show();
          });
      };

      $scope.closeModalMap = function () {
        $scope.modalmap.hide();
        $scope.modalmap.remove();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalmap) {
          $scope.modalmap.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      $scope.openModalEdit = function () {
        $ionicModal
          .fromTemplateUrl("my-edit.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modaledit = modal;
            $scope.modaledit.show();
          });
      };

      $scope.closeModalEdit = function () {
        $scope.modaledit.hide();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modaledit) {
          $scope.modaledit.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      vm.openMap = function () {
        $scope.openModalMap();
        $scope.selected = null;
        var marker = null;
        var map;

        $timeout(function () {
          return (map = new google.maps.Map(document.getElementById("maps"), {
            center: {
              lat: 13.70148,
              lng: 100.50857,
            },
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ["satellite", "roadmap", "hybrid"],
            },
            mapTypeId: "satellite",
            zoom: 5,
          }));
        }, 100);

        $timeout(function () {
          google.maps.event.addListener(map, "click", function (event) {
            placeMarker(event.latLng);
          });

          function placeMarker(location) {
            map.setZoom(25);

            if (marker) {
              marker.setPosition(location);
            } else {
              marker = new google.maps.Marker({
                position: location,
                map: map,
                animation: google.maps.Animation.BOUNCE,
                draggable: true,
              });

              google.maps.event.addListener(marker, "click", function (event) {
                map.setZoom(25);
                map.panTo(marker.getPosition());
              });
            }
            map.panTo(location);

            //console.log(location.lat());
            //console.log(location.lng());
          }

          vm.hereHavePosition = function () {
            vm.position = {
              lat: parseFloat(vm.data.result[0].ld_area_rfid),
              lng: parseFloat(vm.data.result[0].ld_read_back),
            };
            //console.log(vm.position);

            if (marker) {
              marker.setPosition(vm.position);
              map.setZoom(25);
              map.panTo(vm.position);
            } else {
              marker = new google.maps.Marker({
                position: vm.position,
                map: map,
                animation: google.maps.Animation.BOUNCE,
                draggable: true,
              });
              map.setZoom(25);
              map.panTo(marker.getPosition());
            }

            // mapStart();
          };

          vm.here = function () {
            $ionicLoading.show({ duration: 3000 });

            function callPosition() {
              var posOptions = { timeout: 10000, enableHighAccuracy: true };
              return $cordovaGeolocation.getCurrentPosition(posOptions).then(
                function (position) {
                  //console.log(position);
                  vm.position = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                  };
                  let latlng =
                    "" +
                    position.coords.latitude +
                    "," +
                    position.coords.longitude +
                    "";

                  return position;
                },
                function (err) {
                  // error
                }
              );
            }
            let platform = ionic.Platform.platform();
            //console.log(platform);
            function onStart() {
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
                  //console.log("1324");
                  vm.alert = "on";
                  return callPosition();
                }
              }

              if (
                platform == "win32" ||
                platform == "ios" ||
                platform == "macintel"
              ) {
                return callPosition();
              } else if (platform == "android") {
                // Android check gps ใน function
                return main();
              }
            }
            let abc = onStart();

            abc.then(function (response) {
              vm.position = {
                lat: response.coords.latitude,
                lng: response.coords.longitude,
              };
              if (marker) {
                $ionicLoading.hide();

                marker.setPosition(vm.position);
                map.setZoom(25);
                map.panTo(vm.position);
              } else {
                $ionicLoading.hide();

                marker = new google.maps.Marker({
                  position: vm.position,
                  map: map,
                  animation: google.maps.Animation.BOUNCE,
                  draggable: true,
                });

                map.setZoom(25);
                map.panTo(marker.getPosition());
              }
              $ionicLoading.hide();
            });
          };

          $timeout(function () {
            if (
              parseFloat(vm.data.result[0].ld_area_rfid) &&
              parseFloat(vm.data.result[0].ld_read_back)
            ) {
              vm.notification = {
                status: true,
                desc: "รายการนี้เพิ่มพื้นที่เรียบร้อยแล้ว",
              };
              $ionicLoading.show({ duration: 1000 });
              vm.hereHavePosition();
            } else {
              vm.notification = {
                status: false,
                desc: "รายการนี้ยังไม่ได้เพิ่มพื้นที่",
              };

              var confirm = $mdDialog
                .confirm()
                .title("แจ้งเตือน !!!")
                .textContent(
                  "รายการนี้ยังไม่ได้บอกพิกัดต้องการค้นหาพิกัดหรือไม่ ?"
                )
                .ariaLabel("Lucky day")
                .targetEvent()
                .ok("ยืนยัน")
                .cancel("ยกเลิก");

              $mdDialog.show(confirm).then(
                function () {
                  vm.here();
                },
                function () {
                  //console.log("cancel");
                }
              );
            }

            //console.log(vm.notification);
          }, 500);

          vm.save = function () {
            if (marker) {
              $ionicLoading.show();
              vm.marker = {
                lat: marker.getPosition().lat().toFixed(7),
                lng: marker.getPosition().lng().toFixed(7),
              };

              let req = {
                mode: "updateMarker",
                user: $rootScope.global,
                data: vm.data.result[0],
                marker: vm.marker,
              };
              //console.log(req);

              fachttp.model("recordEtc.php", req).then(
                function (response) {
                  //console.log(response.data);
                  $scope.closeModalMap();
                  vm.refreshPic();
                },
                function err(err) {
                  $ionicLoading.hide();

                  $scope.closeModalMap();
                  vm.refreshPic();
                }
              );
            }
          };
        }, 500);
      };

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
        "#eb01fc",
      ];

      vm.record = function () {
        let data = JSON.stringify(vm.data.result[0]);

        $state.go("app.recordEtc2", {
          data: data,
        });
        //console.log(data);

        // if ($scope.selected) {
        //   $state.go('app.recordEtc2')

        // } else {
        //   mobiscroll.alert({
        //     title: "แจ้งเตือน",
        //     message: "ไม่มีพื้นที่",
        //     callback: function() {}
        //   });
        // }
      };

      vm.deletePic = function (ev) {
        var confirm = $mdDialog
          .confirm()
          .title("ต้องการเพิ่มรูปภาพนี้ใช่หรือไม่ ?")
          .textContent("เพิ่มรูปภาพไปยัง Lot นี้")
          .ariaLabel("Lucky day")
          .targetEvent(ev)
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            $ionicLoading.show();
            //console.log(vm.pic);
            //console.log(vm.pic[$ionicSlideBoxDelegate.currentIndex()]);
            //console.log($ionicSlideBoxDelegate.currentIndex());

            let req = {
              mode: "deletePic",
              img: vm.pic[$ionicSlideBoxDelegate.currentIndex()],
              user: $rootScope.global,
            };

            fachttp.model("recordEtc.php", req).then(
              function (response) {
                vm.refreshPic();
                $ionicSlideBoxDelegate.update();
              },
              function err(err) {
                vm.refreshPic();
                $ionicSlideBoxDelegate.update();
              }
            );
          },
          function () {
            //console.log("aa");
            $ionicSlideBoxDelegate.update();
          }
        );
      };

      vm.edit = function (e) {
        vm.dataEdit = angular.copy(e);
        //console.log(e);
        $scope.openModalEdit();
      };

      vm.enterEdit = function () {
        let req = {
          mode: "updatepic",
          user: $rootScope.global,
          edit: vm.dataEdit,
        };

        fachttp.model("recordEtc.php", req).then(
          function (response) {
            $ionicLoading.hide();
            httpScan(vm.ld_lot);
            if (response.data.status == true) {
            } else {
            }

            $scope.closeModalEdit();
          },
          function err(err) {
            httpScan(vm.ld_lot);
            $scope.closeModalEdit();
          }
        );
      };
    }
  )

  .controller(
    "recordEtc2Ctrl",
    function (
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
      $ionicSlideBoxDelegate,
      $cordovaBarcodeScanner,
      $ionicPlatform,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;
      $scope.model = { desc: null };
      $scope.image = [];

      $scope.data = JSON.parse($stateParams.data);
      //console.log($scope.data);

      vm.addPic = function (ev) {
        let platform = ionic.Platform.platform();
        // $scope.openModalPic();

        if (platform == "android" || platform == "ios") {
          camera();
        } else {
          let img = {
            img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg==",
            desc: null,
          };
          $scope.image.push(img);
          //console.log($scope.image);

          $timeout(function () {
            $ionicSlideBoxDelegate.slide($scope.image.length - 1);
          }, 500);
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
        }
      };

      vm.selectPic = function () {
        let platform = ionic.Platform.platform();
        // $scope.openModalPic();

        if (platform == "android" || platform == "ios") {
          image();
        } else {
          let img = {
            img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg==",
            desc: null,
          };
          $scope.image.push(img);
          //console.log($scope.image);

          $timeout(function () {
            $ionicSlideBoxDelegate.slide($scope.image.length - 1);
          }, 500);
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
        }
      };

      function camera() {
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 40,
          sourceType: Camera.PictureSourceType.CAMERA,
          destinationType: Camera.DestinationType.DATA_URL,
          targetWidth: 1920,
          targetHeight: 1080,
        });

        function onSuccess(imageData) {
          $ionicLoading.show({
            duration: 500,
          });

          let img = {
            img: "data:image/jpeg;base64," + imageData,
            desc: null,
          };
          $scope.image.push(img);
          $timeout(function () {
            $ionicSlideBoxDelegate.slide($scope.image.length - 1);
          }, 500);
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
          //console.log($scope.image);
          //console.log($scope.image.length);
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
          targetHeight: 1080,
        });

        function onSuccess(imageData) {
          $ionicLoading.show({
            duration: 500,
          });
          let img = {
            img: "data:image/jpeg;base64," + imageData,
            desc: null,
          };
          $scope.image.push(img);
          $timeout(function () {
            $ionicSlideBoxDelegate.slide($scope.image.length - 1);
          }, 500);
          $ionicSlideBoxDelegate.update();
          //console.log($scope.image);
          //console.log($scope.image.length);

          $ionicScrollDelegate.resize();
        }

        function onFail(message) {
          alert("Failed because: " + message);
        }
      }


      
  

      vm.pushPic = function (ev) {
        //console.log($scope.image);
        //console.log(ev);
        var confirm = $mdDialog
          .confirm()
          .title("ต้องการเพิ่มรูปภาพนี้ใช่หรือไม่ ?")
          .textContent("เพิ่มรูปภาพไปยัง Lot นี้")
          .ariaLabel("Lucky day")
          .targetEvent(ev)
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            if ($scope.image.length > 0) {
              let canceller = $q.defer();

              $ionicLoading.show();
              let req = {
                timeout: canceller.promise,
                mode: "saveImg",
                data: $scope.data,
                img: $scope.image,
                user: $rootScope.global,
                desc: $scope.model,
              };

              fachttp
                .model("recordEtc.php", req, {
                  timeout: canceller.promise,
                })
                .then(
                  function (response) {
                    $ionicLoading.hide();

                    //console.log(response.data);
                    if (response.data.sftp[0] == "AuthenticationSuccessful") {
                      ////////console.log(response, 1);
                      $mdDialog
                        .show(
                          $mdDialog
                            .alert()
                            .parent(
                              angular.element(
                                document.querySelector("#popupContainer")
                              )
                            )
                            .clickOutsideToClose(true)
                            .title("แจ้งเตือน")
                            .textContent("เพิ่มรูปภาพเรียบร้อยแล้ว")
                            .ariaLabel("Alert Dialog Demo")
                            .ok("OK")
                            .targetEvent()
                        )
                        .then(
                          function (answer) {
                            $ionicHistory.goBack();
                          },
                          function () {}
                        );
                    } else if (response.data == "AuthenticationFailed") {
                      //////////console.log(response, 2);

                      mobiscroll.alert({
                        title: "แจ้งเตือน",
                        message:
                          "ไม่สามารถเพิ่มรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
                        callback: function () {
                          mobiscroll.toast({
                            message: "ยกเลิก",
                          });
                        },
                      });

                      // $scope.modalPic.hide();
                      $ionicLoading.hide();
                    }
                  },
                  function err(err) {
                    mobiscroll.alert({
                      title: "แจ้งเตือน",
                      message:
                        "ไม่สามารถเพิ่มรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
                      callback: function () {
                        mobiscroll.toast({
                          message: "ยกเลิก",
                        });
                      },
                    });

                    // $scope.modalPic.hide();
                    $ionicLoading.hide();
                  }
                );

              $timeout(function () {
                canceller.resolve("user cancelled");
              }, 10000);
            } else {
              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("แจ้งเตือน")
                  .textContent("เพิ่มรูปภาพก่อนบันทึก")
                  .ariaLabel("Alert Dialog Demo")
                  .ok("Got it!")
                  .targetEvent(ev)
              );
            }
          },
          function () {
            //console.log("aa");
          }
        );
      };

      vm.delete = function (i) {
        //console.log(i);
        $scope.image.splice(i, 1);
        $timeout(function () {
          $ionicSlideBoxDelegate.slide($scope.image.length - 1);
        }, 200);
        $ionicSlideBoxDelegate.update();
        $ionicScrollDelegate.resize();
      };
    }
  );
