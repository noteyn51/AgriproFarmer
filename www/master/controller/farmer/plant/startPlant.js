angular
  .module("app")
  .controller(
    "startPlant01Ctrl",
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
      $mdSidenav,
      $log,
      $q,
      fachttp,
      $ionicScrollDelegate
    ) {
      let vm = this;
      // $scope.cropSelect = {};
      vm.cropSelect = {};
      // vm.pt_select = {};
      $scope.model = {};
      // vm.farmSelect = {};

      function onStartwoMstr() {
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "womstr",
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
              $scope.status = true;
              //console.log(response);
              if (response.data.status == true) {
                vm.list = response.data;
              } else {
                vm.list = response.data;
              }
              //console.log(response);
            },
            function err(err) {
              //console.log(err);
              vm.list = [];
              $scope.status = false;
            }
          );
      }

      onStartwoMstr();

      vm.add = function () {
        $state.go("app.startPlant");
      };

      vm.woDetail = function (e) {
        console.log(e);
        $state.go("app.startPlantDetail", { wo: JSON.stringify(e) });
      };
    }
  )

  .controller(
    "startPlantCtrl",
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
      $mdSidenav,
      $log,
      $q,
      fachttp,
      $ionicScrollDelegate
    ) {
      let vm = this;
      // $scope.cropSelect = {};
      vm.cropSelect = {};
      // vm.pt_select = {};
      $scope.model = {};
      // vm.farmSelect = {};

      function onStart() {
        $ionicLoading.show();
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "crop",
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
          $ionicLoading.hide();
        }, 8000);

        fachttp
          .model("startPlant.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              console.log(response.data);
              if (response.data.status == true) {
                $scope.crop = response.data;
              } else {
                $scope.crop = response.data;
              }
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
      }

      onStart();

      $scope.cropChange = function () {
        console.log(vm.cropSelect);
        $ionicLoading.show();
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "crop_type",
          value: vm.cropSelect,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
          $ionicLoading.hide();
        }, 8000);

        fachttp
          .model("startPlant.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              console.log(response);
              if (response.data.status == true) {
                $scope.pt_mstr = response.data;
              } else {
                $scope.pt_mstr = response.data.data;
              }
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
      };

      $scope.ptChange = function () {
        console.log(vm.pt_select);
        $scope.model = {};
        $ionicScrollDelegate.resize();
        console.log("resize");
      };

      function onStartMap() {
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "selectFarm",
          config: {
            frm_code: $rootScope.global.mob_farm_code,
          },
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 8000);

        fachttp
          .model("area.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              $scope.status = true;

              //console.log(response);
              if (response.data.status == true) {
                $scope.farmlist = response.data;
              } else {
                $scope.farmlist = response.data;
              }
              //console.log(response);
            },
            function err(err) {
              //console.log(err);
              $scope.farmlist = [];
              $scope.status = false;
            }
          );
      }
      onStartMap();

      let platform = ionic.Platform.platform();

      vm.pickdate = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              console.log(data);
              $scope.model.date = data;
              vm.changeDate();
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
            $scope.model.date = res;
            console.log($scope.model);
            vm.changeDate();
          });
        }
      };

      vm.changeDate = function () {
        $ionicLoading.show();
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "changeDate",
          date: $scope.model.date,
          pt: vm.pt_select,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
          $ionicLoading.hide();
        }, 8000);

        fachttp
          .model("startPlant.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              console.log(response.data);
              if (response.data.status == true) {
                $scope.model.dateto = response.data.result.dateend;
              } else {
                // $scope.crop = response.data;
              }
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
      };

      {
        $ionicModal
          .fromTemplateUrl("list_map.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalListmap = modal;
          });

        $scope.openModalListmap = function () {
          $scope.modalListmap.show();
        };
        $scope.closeModalListmap = function () {
          $scope.modalListmap.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on("$destroy", function () {
          $scope.modalListmap.remove();
        });
      }

      vm.go = function (e) {
        vm.farmSelect = e;
        console.log(e);
        $scope.closeModalListmap();
      };

      vm.save = function () {
        console.log(vm.cropSelect);
        console.log(vm.pt_select);
        console.log($scope.model);
        console.log(vm.farmSelect);

        if (
          vm.cropSelect &&
          vm.pt_select &&
          $scope.model.date &&
          $scope.model.dateto &&
          $scope.model.rai &&
          $scope.model.um &&
          vm.farmSelect
        ) {
          var confirm = $mdDialog
            .confirm()
            .title("แจ้งเตือน !!!")
            .textContent("ต้องการเริ่มต้นการกระบวนการนี้หรือไม่ ?")
            .ariaLabel("Lucky day")
            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(
            function () {
              $ionicLoading.show();
              let req = {
                mode: "startCrop",
                crop: vm.cropSelect,
                type: vm.pt_select,
                sub: vm.farmSelect,
                model: $scope.model,
                // subdetail: $scope.subDetail,
                // qty: parseInt(vm.qty),
              };
              fachttp.model("startPlant.php", req).then(
                function (response) {
                  //console.log(response.data);
                  if (response.data.status == true) {
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
                          .textContent("เพิ่มการเพาะปลูกเรียบร้อยแล้ว")
                          .ariaLabel("Alert Dialog Demo")
                          .ok("OK")
                          .targetEvent()
                      )
                      .then(
                        function (answer) {
                          $ionicHistory.clearCache().then(function () {
                            $ionicHistory.goBack();
                          });
                        },
                        function () {}
                      );

                    $ionicLoading.hide();
                  } else {
                    alert(
                      "ไม่สามารถสร้างเริ่มต้นเพาะปลูกได้กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมส่งเสริม"
                    );
                    $ionicLoading.hide();
                  }
                },
                function err(err) {
                  $ionicLoading.hide();
                }
              );
            },
            function () {}
          );
        } else {
          alert("ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบอีกครั้ง");
        }
      };
    }
  )

  .controller(
    "startPlantDetailCtrl",
    function (
      $ionicHistory,
      $state,
      $scope,
      $stateParams,
      $mdDialog,
      $rootScope,
      fachttp,
      $ionicModal
    ) {
      let vm = this;
      try {
        $scope.wo = JSON.parse($stateParams.wo);
      } catch (error) {
        console.log(error);
      }

      $ionicModal
        .fromTemplateUrl("end-wo.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modal = modal;
        });

      $scope.showModal = function () {
        let req = {
          mode: "getnewwo",
          ignorewo:$scope.wo.wo_lot
        };

        fachttp.model("startPlant.php", req).then(
          function (response) {
            vm.list = response.data;
            console.log(response);
            $scope.modal.show();
          },
          function err(err) {}
        );

      };
      $scope.hideModal = function () {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modal.remove();
      });

      async function init() {
        console.log("inits");
        let a = await getData();
      }


      $scope.selectWo = function(e){
        console.log(e);
      }

      async function getData() {
        let req = {
          mode: "getwotree",
          wo_lot: $scope.wo.wo_lot,
        };

        fachttp.model("startPlant.php", req).then(
          function (response) {
            console.log(response);
            if (response.data.status == true) {
              $scope.items = response.data.data;
            } else {
              $scope.items = [];
            }
          },
          function err(err) {
            $scope.status = false;
          }
        );
      }

      init();

      $rootScope.treeAdd = [];

      vm.endCrop = function () {
        $scope.showModal();
        // var confirm = $mdDialog
        //   .confirm()
        //   .title("แจ้งเตือน")
        //   .textContent("ต้องการปิดการเพาะปลูกนี้หรือไม่ ? หากปิดการเพาะปลูกนี้แล้วจะไม่สามารถ")
        //   .ariaLabel("Lucky day")
        //   .targetEvent()
        //   .ok("ยืนยัน")
        //   .cancel("ยกเลิก");

        // $mdDialog.show(confirm).then(
        //   function () {
        //     let req = {
        //       mode: "endWo",
        //     };

        //     fachttp.model("startPlant.php", req).then(
        //       function (response) {
        //         $ionicHistory.goBack();
        //         console.log(response);

        //       },
        //       function err(err) {
        //       }
        //     );
        //   },
        //   function () {
        //     //console.log("2");
        //   }
        // );
      };

      vm.add = function () {
        $state.go("app.startPlantSelectItem", {
          wo: JSON.stringify($scope.wo),
        });
      };

      vm.clickList = function (e) {
        $state.go("app.recordEtc1", { data: e.ld_lot });
      };

      // $scope.$watch("treeAdd", function (a, b) {
      //   console.log("new");
      //   console.log(a);
      //   console.log("old");
      //   console.log(b);
      // });
    }
  )

  .controller(
    "startPlantSelectItemCtrl",
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
      $mdSidenav,
      $log,
      $q,
      fachttp,
      $ionicScrollDelegate
    ) {
      let vm = this;
      // console.log($stateParams.wo)
      $scope.wo = JSON.parse($stateParams.wo);

      $scope.items = [];
      $scope.selected = [];

      async function init() {
        let a = await getData();
      }

      async function getData() {
        let req = {
          mode: "getemptytree",
        };

        fachttp.model("startPlant.php", req).then(
          function (response) {
            console.log(response);
            //console.log(response);
            if (response.data.status == true) {
              $scope.items = response.data.data;
            } else {
              $scope.items = [];
            }
          },
          function err(err) {
            $scope.status = false;
          }
        );
      }

      init();

      $scope.save = function () {
        $rootScope.treeAdd = [];
        if ($scope.selected.length > 0) {
          $scope.selected.sort((a, b) =>
            a.ld_lot > b.ld_lot ? 1 : b.ld_lot > a.ld_lot ? -1 : 0
          );

          let req = {
            mode: "addTreeToWo",
            selected: $scope.selected,
            wo: $scope.wo,
          };
          $ionicLoading.show();

          fachttp.model("startPlant.php", req).then(
            function (response) {
              $ionicLoading.hide();
              $ionicHistory.goBack();

              console.log(response);
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
        } else {
          Service.customAlertDialog(
            "แจ้งเตือน",
            "โปรดเลือกรายการอย่างน้อย 1 รายการ"
          );
        }
      };

      $scope.toggle = function (item, list) {
        var idx = list.findIndex((element) => {
          return element.ld_lot === item.ld_lot;
        });

        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(item);
        }
      };

      $scope.exists = function (item, list) {
        const index = list.findIndex((element) => {
          return element.ld_lot === item.ld_lot;
        });

        return index > -1;
      };

      $scope.isIndeterminate = function () {
        return (
          $scope.selected.length !== 0 &&
          $scope.selected.length !== $scope.items.length
        );
      };

      $scope.isChecked = function () {
        return $scope.selected.length === $scope.items.length;
      };

      $scope.toggleAll = function () {
        if ($scope.selected.length === $scope.items.length) {
          $scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
          $scope.selected = $scope.items.slice(0);
        }
      };
    }
  );
