angular
  .module("app")
  .controller(
    "singleReceiveCtrl",
    function ($scope, fachttp, $ionicModal, $ionicLoading, Service, $mdDialog,$state,$ionicHistory) {
      let vm = this;

      $scope.model = { itemSelect: null, lotGenCount: null };

      $scope.valueChange = function () {
        if ($scope.model.lotGenCount <= 0) {
          $scope.model.lotGenCount = null;
        }
      };

      {
        $scope.modelItem;
        $ionicModal
          .fromTemplateUrl("item-list.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modelItem = modal;
          });

        $scope.showModalItem = function () {
          $ionicLoading.show();
          let req = {
            mode: "getReceiveItem",
          };

          fachttp.model("controller/receiveLot.php", req).then(
            function (response) {
              try {
                $scope.item = response.data.result;
              } catch (error) {
                $scope.item = [];
              }

              $ionicLoading.hide();
              $scope.modelItem.show();
            },
            function err(err) {
              Service.timeout();
              $ionicLoading.hide();
            }
          );
        };

        $scope.showModalItem();

        $scope.enterSelect = function (e) {
          $scope.model.itemSelect = e;
          $scope.hideModalItem();
        };

        $scope.hideModalItem = function () {
          $scope.modelItem.hide();
        };

        // Cleanup the modal when we're done with it!
        $scope.$on("$destroy", function () {
          if ($scope.modelItem) {
            $scope.modelItem.remove();
          } else {
          }
        });
      }

      $scope.confirmGenSingleLot = function () {
        console.log($scope.model);
        if (!$scope.model.itemSelect || $scope.model.itemSelect == null) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(true)
              .title("แจ้งเตือน")
              .textContent("โปรดเลือกรายการที่ต้องการรับ")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );

          return;
        }

        if (!$scope.model.lotGenCount) {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(true)
              .title("แจ้งเตือน")
              .textContent("โปรดระบุจำนวนต้นที่ต้องการรับ")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
          return;
        }
        $ionicLoading.show();
        let req = {
          mode: "singleGenerate",
          data:$scope.model
        };

        fachttp.model("controller/receiveLot.php", req).then(
          function (response) {
            try {
              if(response.data.status){
              $ionicHistory.goBack();

                $mdDialog.show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(false)
                    .title("แจ้งเตือน")
                    .textContent("สร้างต้นสำเร็จ")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                );

              }else{

              }
            } catch (error) {
            }

            $ionicLoading.hide();
          },
          function err(err) {
            Service.timeout();
            $ionicLoading.hide();
          }
        );
      };
    }
  )
  .controller("multiReceiveCtrl", function ($scope, fachttp) {
    let vm = this;

    // function onStartwoMstr() {
    //   let req = {
    //     mode: "womstr",
    //   };

    //   fachttp.model("detail.php", req).then(
    //     function (response) {
    //       $scope.status = true;
    //       if (response.data.status == true) {
    //         vm.list = response.data;
    //       } else {
    //         vm.list = response.data;
    //       }
    //       console.log(vm.list);
    //     },
    //     function err(err) {
    //       vm.list = [];
    //       $scope.status = false;
    //     }
    //   );
    // }

    // onStartwoMstr();

    // $scope.selectId = function (e) {
    //   console.log(e);
    // };
  });
