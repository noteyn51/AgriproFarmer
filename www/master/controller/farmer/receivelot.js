angular
  .module("app")
  .controller(
    "singleReceiveCtrl",
    function (
      $scope,
      fachttp,
      $ionicModal,
      $ionicLoading,
      Service,
      $mdDialog,
      $state,
      $ionicHistory
    ) {
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
          data: $scope.model,
        };

        fachttp.model("controller/receiveLot.php", req).then(
          function (response) {
            try {
              if (response.data.status) {
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
              } else {
              }
            } catch (error) {}

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
  .controller("multiReceiveCtrl", function ($scope, fachttp, $state) {
    let vm = this;

    function onStartwoMstr() {
      let req = {
        mode: "womstr",
      };

      fachttp.model("detail.php", req).then(
        function (response) {
          $scope.status = true;
          if (response.data.status == true) {
            vm.list = response.data;
          } else {
            vm.list = response.data;
          }
          console.log(vm.list);
        },
        function err(err) {
          vm.list = [];
          $scope.status = false;
        }
      );
    }

    onStartwoMstr();

    $scope.selectId = function (e) {
      $state.go("app.multiReceive2", { wo: JSON.stringify(e) });
      console.log(e);
    };
  })
  .controller(
    "multiReceive2Ctrl",
    function (
      $ionicScrollDelegate,
      $ionicModal,
      $scope,
      fachttp,
      $stateParams,
      $ionicLoading,
      Service,
      $ionicHistory,
      $mdDialog
    ) {
      let vm = this;
      $scope.wo = JSON.parse($stateParams.wo);
      console.log($scope.wo);
      $scope.model = {
        gradeSelect: null,
        item: null,
        moisture: null,
        price: null,
        qty: null,
        print: null,
      };

      $scope.isSelect = { status: false, index: null };

      // $scope.model = {
      //   gradeSelect: "B",
      //   item: {
      //     pt_part: "300100200001276",
      //     pt_desc1: "ทุเรียนพันธุ์หมอนข้าง",
      //     pt_site: "TH10001",
      //     pt_um: "KG",
      //     pt_prod_line: "3",
      //     $$hashKey: "object:2499",
      //   },
      //   moisture: "30",
      //   price: "20",
      //   qty: "3000",
      // };

      $scope.gradeList = ["A", "B", "C", "D", "E", "F"];
      $scope.receiveLotList = [];
      //   $scope.receiveLotList = [
      //     {
      //         "gradeSelect": "B",
      //         "item": {
      //             "pt_part": "300100200001276",
      //             "pt_desc1": "ทุเรียนพันธุ์หมอนข้าง",
      //             "pt_site": "TH10001",
      //             "pt_um": "KG",
      //             "pt_prod_line": "3"
      //         },
      //         "moisture": "30",
      //         "price": "20",
      //         "qty": "3000"
      //     },
      //     {
      //         "gradeSelect": "A",
      //         "item": {
      //             "pt_part": "300100200001276",
      //             "pt_desc1": "ทุเรียนพันธุ์หมอนข้าง",
      //             "pt_site": "TH10001",
      //             "pt_um": "KG",
      //             "pt_prod_line": "3"
      //         },
      //         "moisture": "30",
      //         "price": "20",
      //         "qty": "100"
      //     }
      // ];

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
            mode: "getReceiveItemLine3",
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

        $scope.enterSelect = function (e) {
          $scope.model.item = e;
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

      function getItem() {
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
          },
          function err(err) {
            Service.timeout();
            $ionicLoading.hide();
          }
        );
      }

      $scope.add = function () {
        console.log($scope.model);
        let cheking = [];
        Object.keys($scope.model).forEach((key) => {
          if ($scope.model[key] != null) {
            cheking.push(true);
          } else {
            cheking.push(false);
          }
        });

        // true == edit
        if (!cheking.includes(false)) {
          if ($scope.isSelect.status) {
            $scope.receiveLotList[$scope.isSelect.index] = angular.copy(
              $scope.model
            );

            $scope.isSelect.status = false;
            $scope.isSelect.index = null;
          } else {
            // false == add

            $scope.receiveLotList.push(angular.copy($scope.model));
          }
          $scope.model.qty = null;
        } else {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(false)
              .title("แจ้งเตือน")
              .textContent("ไม่สามารถเพิ่มรายการได้ โปรดตรวจสอบข้อมูลอีกครั้ง")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }

        $ionicScrollDelegate.resize();
      };

      $scope.selectEdit = function (item, index) {
        $scope.isSelect.status = true;
        $scope.isSelect.index = index;

        $scope.model = angular.copy(item);
      };

      getItem();

      $scope.moistureChange = function () {
        if ($scope.model.moisture > 100) {
          $scope.model.moisture = 100;
        }
      };

      $scope.save = function () {
        if ($scope.receiveLotList.length > 0) {
          $ionicLoading.show();
          let req = {
            mode: "multiGenerate",
            receivelot: $scope.receiveLotList,
            wo: $scope.wo,
          };

          fachttp.model("controller/receiveLot.php", req).then(
            function (response) {
              mobiscroll.toast({
                message: "สร้าง Lot เรียนร้อยแล้ว",
                color: "success",
              });
              $ionicHistory.goBack();
              $ionicLoading.hide();
            },
            function err(err) {
              Service.timeout();
              $ionicLoading.hide();
            }
          );
        } else {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(false)
              .title("แจ้งเตือน")
              .textContent("ไม่สามารถบันทึกได้โปรต้องมีรายการมากกว่า 1 รายการ")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };

      console.log($stateParams);
    }
  )
  .controller("viewMultiReceiveCtrl", function ($scope, fachttp, $state) {
    let vm = this;
    console.log('viewmulti')

    function onStartwoMstr() {
      let req = {
        mode: "womstr",
      };

      fachttp.model("detail.php", req).then(
        function (response) {
          $scope.status = true;
          if (response.data.status == true) {
            vm.list = response.data;
          } else {
            vm.list = response.data;
          }
          console.log(vm.list);
        },
        function err(err) {
          vm.list = [];
          $scope.status = false;
        }
      );
    }

    // onStartwoMstr();

  
  });
