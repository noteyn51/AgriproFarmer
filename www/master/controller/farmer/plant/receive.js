angular
  .module("app")
  .controller(
    "receiveCtrl",
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
      $cordovaBarcodeScanner,
      fachttp,
      $ionicScrollDelegate
    ) {
      let vm = this;

    

      vm.multiReceive = function () {
        $state.go("app.multiReceive");
      };

      vm.singleReceive = function () {
        $state.go("app.singleReceive");
      };

      var numrow1;
      var numrow2;

      $scope.openModalDoc = function () {
        $ionicModal
          .fromTemplateUrl("my-doc.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modaledoc = modal;
            $scope.modaledoc.show();
          });
      };

      $scope.closeModalDoc = function () {
        $scope.modaledoc.hide();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modaledoc) {
          $scope.modaledoc.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      vm.byDoc = function () {
        numrow1 = 0;
        numrow2 = 20;
        $ionicLoading.show();

        let req = {
          mode: "byDoc",
          user: $rootScope.global,
          numrow1: numrow1,
          numrow2: numrow2,
        };
        fachttp.model("receive.php", req).then(
          function (response) {
            $ionicLoading.hide();

            if (response.data.status == true) {
              numrow1 += 20;
              numrow2 += 20;

              vm.dataDoc = response.data.result;
              $scope.openModalDoc();
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
                  .textContent("ไม่พบรายการต้นที่ปลูก โปรดตรวจสอบรายการต้น")
                  .ariaLabel("Alert Dialog Demo")
                  .ok("OK")
                  .targetEvent()
              )
              .then(
                function (answer) {},
                function () {}
              );
            }
            //console.log(response.data);
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      $scope.showMore = function () {
        $ionicLoading.show();
        //console.log(numrow1);
        //console.log(numrow2);

        let req = {
          mode: "byDoc",
          user: $rootScope.global,
          numrow1: numrow1,
          numrow2: numrow2,
        };

        fachttp.model("receive.php", req).then(
          function (response) {
            $ionicLoading.hide();
            //console.log(response.data);

            if (response.data.status == true) {
              numrow1 += 20;
              numrow2 += 20;
              for (let i = 0; i < response.data.result.length; i++) {
                vm.dataDoc.push(response.data.result[i]);
              }
              $ionicScrollDelegate.resize();
              //console.log(vm.list);
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

      vm.enterSelect = function (e) {
        $scope.reflot = angular.copy(e);
        let k = JSON.stringify($scope.reflot);

        $state.go("app.receive2", { lotref: k });
        $scope.closeModalDoc();
      };

      vm.byScan = function () {
        document.addEventListener("deviceready", function () {
          $ionicLoading.show();

          $cordovaBarcodeScanner.scan().then(function (barcode) {
            if (!barcode.cancelled) {
              $ionicLoading.hide();

              let lot;
              if (barcode.text.substring(0, 5) == "https") {
                lotArr = barcode.text.split("/");
                lot = lotArr[lotArr.length - 1];
                scanHttp(lot);
              } else {
                lot = barcode.text;
                scanHttp(lot);
              }
            } else {
              $ionicLoading.hide();
            }
          });
        });
      };

      function scanHttp(e) {
        $ionicLoading.show();

        let req = {
          mode: "byScan",
          user: $rootScope.global,
          qr: e,
        };

        fachttp.model("receive.php", req).then(
          function (response) {
            $ionicLoading.hide();
            //console.log(response.data);

            if (response.data.status == true) {
              $scope.reflot = response.data.result[0];
              let k = JSON.stringify($scope.reflot);
              $state.go("app.receive2", { lotref: k });
            } else {
              $ionicLoading.hide();

              $mdDialog
                .show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("แจ้งเตือน")
                    .textContent("ไม่พบรายการที่ค้นหา" + " " + e)
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

            $mdDialog
              .show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("แจ้งเตือน")
                  .textContent("ไม่พบรายการที่ค้นหา" + " " + e)
                  .ariaLabel("Alert Dialog Demo")
                  .ok("OK")
                  .targetEvent()
              )
              .then(
                function (answer) {},
                function () {}
              );
            $ionicLoading.hide();
          }
        );
      }
    }
  )

  .controller(
    "receive2Ctrl",
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
      fachttp
    ) {
      let vm = this;

      $scope.reflot = JSON.parse($stateParams.lotref);
      function pt_mstr() {
        $ionicLoading.show();

        let req = {
          mode: "pt_mstr",
          user: $rootScope.global,
          qty: $scope.qtyGen,
          reflot: $scope.reflot,
        };
        fachttp.model("receive.php", req).then(
          function (response) {
            $ionicLoading.hide();
            if (response.data.status == true) {
              vm.pt_mstr = response.data.result;
            } else {
            }
            //console.log(response.data);
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      }

      pt_mstr();

      vm.enterSelect = function (e) {
        $scope.pt_mstr = angular.copy(e);
        //console.log($scope.pt_mstr);

        var confirm = $mdDialog
          .prompt()
          .title("แจ้งเตือน")
          .textContent("ป้อนจำนวนที่ต้องการรับ ")
          .placeholder("ป้อนจำนวนเป็นตัวเลข")
          .ariaLabel("รหัสเกษตรกร,ชือ,นามสกุล")
          .initialValue()
          .targetEvent()
          .required(false)
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function (result) {
            $scope.qtyGen = 0;
            let k = parseInt(result);

            if (Number.isInteger(k)) {
              if (k > 0) {
                $scope.qtyGen = k;
                //console.log(k);
                Genlot();
              } else {
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
                      .textContent("กรอกข้อมูลเฉพาะตัวเลขที่มากกว่า 0 เท่านั้น")
                      .ariaLabel("Alert Dialog Demo")
                      .ok("OK")
                      .targetEvent()
                  )
                  .then(
                    function (answer) {},
                    function () {}
                  );
              }
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
                    .textContent("กรอกข้อมูลเฉพาะตัวเลขที่มากกว่า 0 เท่านั้น")
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
          function (e) {}
        );
      };

      function Genlot() {
        $ionicLoading.show();

        let req = {
          mode: "Genlot",
          user: $rootScope.global,
          qty: $scope.qtyGen,
          reflot: $scope.reflot,
          pt_mstr: $scope.pt_mstr,
        };
        fachttp.model("receive.php", req).then(
          function (response) {
            $ionicLoading.hide();

            if (response.data.status == true) {
              $state.go("apps.recordEtcs");
            } else {
            }
            //console.log(response.data);
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      }
    }
  );
