angular
  .module("app")
  .controller("withdrawListCtrl", function (
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
    $ionicScrollDelegate,
    fachttp
  ) {
    let vm = this;
    $ionicModal
      .fromTemplateUrl("my-detail.html", {
        scope: $scope,
        animation: "slide-in-up",
      })
      .then(function (modal) {
        $scope.modalList = modal;
      });

    $scope.openModalList = function () {
      $scope.modalList.show();
    };
    $scope.closeModalList = function () {
      $scope.modalList.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalList.remove();
    });

    function onStart() {
      $ionicLoading.show();
      let req = {
        mode: "list",
      };

      fachttp.model("withdraw.php", req).then(
        function (response) {
          //console.log(response.data);
          if (response.data.status == true) {
            vm.list = response.data;
          }

          $ionicLoading.hide();
        },
        function err(err) {
          vm.status = false;
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    vm.withdrawHist = function () {
      $state.go("app.withdrawHist");
    };

    vm.modalDetail = function (e) {
      //console.log("123");
      vm.item = e;
      $scope.openModalList();
    };

    vm.del = function () {
      var confirm = $mdDialog
        .confirm()
        .title("แจ้งเตือน !!!")
        .textContent("ต้องการลบไปขอเบิกนี้หรือไม่ ?")
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function () {
          $ionicLoading.show();
          let req = {
            mode: "delList",
            list: vm.item,
          };

          fachttp.model("withdraw.php", req).then(
            function (response) {
              //console.log(response.data);
              if (response.data.stauts == true) {
              } else {
              }
              onStart();
              $scope.closeModalList();
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
        },
        function () {}
      );
    };

    vm.addDoc = function () {
      $state.go("app.withdraw");
    };
  })

  .controller("withdrawCtrl", function (
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
    $ionicScrollDelegate,
    fachttp
  ) {
    let vm = this;
    vm.pic_desc;
    $scope.modelpredict = {
      rai: null,
      result: null,
      datestart: null,
      countdate: null,
      remark: null,
    };
    //modal
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

      $ionicModal
        .fromTemplateUrl("list_Crop.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalListcrop = modal;
        });

      $scope.openModalListcrop = function () {
        $scope.modalListcrop.show();
      };
      $scope.closeModalListcrop = function () {
        $scope.modalListcrop.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalListcrop.remove();
      });

      $ionicModal
        .fromTemplateUrl("data_predict.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modaldatapredict = modal;
        });

      $scope.openModaldataPredict = function () {
        $scope.modelpredict = {
          rai: null,
          result: null,
          datestart: null,
          countdate: null,
          remark: null,
        };
        $scope.modaldatapredict.show();
      };
      $scope.closeModaldataPredict = function () {
        $scope.modaldatapredict.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modaldatapredict.remove();
      });

      $ionicModal
        .fromTemplateUrl("edit_predict.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modaleditpredict = modal;
        });

      $scope.openModalEditPredict = function (e) {
        $scope.modaleditpredict.show();
      };
      $scope.closeModalEditPredict = function () {
        $scope.modaleditpredict.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modaleditpredict.remove();
      });
    }

    function onStart() {
      $ionicLoading.show();
      let req = {
        mode: "request1",
      };

      fachttp.model("withdraw.php", req).then(
        function (response) {
          console.log(response.data);
          // vm.status = response.data.status;
          if (response.data.status == true) {
            vm.wo_mstr = response.data;
            //console.log(vm.wo_mstr.result);
          }

          $ionicLoading.hide();
        },
        function err(err) {
          vm.status = false;
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    vm.selectCrop = function (e, index) {
      //console.log(e);
      $scope.cropSelect = e;
      $scope.modalListcrop.hide();

      $ionicLoading.show();
      let req = {
        mode: "selectwodDet",
        wo_lot: $scope.cropSelect,
      };

      fachttp.model("withdraw.php", req).then(
        function (response) {
          //console.log(response.data);
          // vm.status = response.data.status;
          if (response.data.status == true) {
            vm.wod_det = response.data;
            //console.log(vm.wod_det.result);
          }

          $ionicLoading.hide();
        },
        function err(err) {
          Service.timeout();
          $ionicLoading.hide();
        }
      );
    };

    var timeoutPromise;
    $scope.search = function () {
      $timeout.cancel(timeoutPromise);
      timeoutPromise = $timeout(function () {
        //console.log("222");
      }, 800);
    };

    vm.save = function () {
      var confirm = $mdDialog
        .confirm()
        .title("แจ้งเตือน !!!")
        .textContent("ต้องการลบไปขอเบิกนี้หรือไม่ ?")
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function () {
          //console.log(vm.wod_det.result);
          $ionicLoading.show();
          let req = {
            mode: "save",
            item: vm.wod_det.result,
            idselect:$scope.cropSelect
          };

          fachttp.model("withdraw.php", req).then(
            function (response) {
              //console.log(response.data);
              // vm.status = response.data.status;
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
                      .textContent("เพิ่มไปยังใบขอเบิกแล้ว")
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
              } else {
              }

              $ionicLoading.hide();
            },
            function err(err) {
              vm.status = false;
              $ionicLoading.hide();
            }
          );
        },
        function () {}
      );
    };

    $scope.valChange = function (i, e) {
      //console.log(e);
      if (parseInt(e.qty) > parseInt(e.wod_qty_req)) {
        e.qty = e.wod_qty_req;
        //console.log(e);
      } else if (parseInt(e.qty) < 0) {
        e.qty = 0;
      }
      //console.log(e);
    };

    vm.check = function () {
      let item = [];
      angular.forEach(vm.wod_det.result, function (value, key) {
        if (value.qty > 0) {
          item.push(true);
        } else {
          item.push(false);
        }
      });

      if (item.includes(false)) {
        return true;
      } else {
        return false;
      }
    };

    $scope.dataCropwo = [
      {
        crop_code: "CROP002",
        vdad_name: "บรรพต คล้ายศร",
        vdad_addr: "VD001",
        list: [
          {
            list_crop_code: "CROP001",
            list_id: 1,
            list_routing: 1,
            list_part: "5111-2",
            list_desc: "ปุ๋ญเคมีสูตร 21-8-11",
            list_value1: "13",
            list_value2: "0",
            list_value3: "15",
            list_valuewithdraw: function (list_value1, list_value3) {
              if (list_value3 >= list_value1) {
                return list_value1;
              } else {
                return list_value3;
              }
            },
          },
          {
            list_crop_code: "CROP001",
            list_id: 1,
            list_routing: 2,
            list_part: "5111-2",
            list_desc: "ปุ๋ญเคมีสูตร 24-9-12",
            list_value1: "14",
            list_value2: "0",
            list_value3: "0",
            list_valuewithdraw: function (list_value1, list_value3) {
              if (list_value3 >= list_value1) {
                return list_value1;
              } else {
                return list_value3;
              }
            },
          },
          {
            list_crop_code: "CROP001",
            list_id: 1,
            list_routing: 3,
            list_part: "5111-3",
            list_desc: "ปุ๋ญเคมีสูตร 30-11-12",
            list_value1: "15",
            list_value2: "0",
            list_value3: "5",
            list_valuewithdraw: function (list_value1, list_value3) {
              if (list_value3 >= list_value1) {
                return list_value1;
              } else {
                return list_value3;
              }
            },
          },
          {
            list_crop_code: "CROP001",
            list_id: 1,
            list_routing: 4,
            list_part: "5111-4",
            list_desc: "ปุ๋ญเคมีสูตร 40-11-11",
            list_value1: "16",
            list_value2: "0",
            list_value3: "20",
            list_valuewithdraw: function (list_value1, list_value3) {
              if (list_value3 >= list_value1) {
                return list_value1;
              } else {
                return list_value3;
              }
            },
          },
        ],
      },
    ];

    //console.log($scope.dataCropwo);

    vm.withdrawHist = function () {
      $state.go("app.withdrawHist");
    };
  })

  .controller("withdrawHistCtrl", function (
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
    $ionicScrollDelegate,
    fachttp
  ) {
    let vm = this;
    $ionicModal
      .fromTemplateUrl("my-detail.html", {
        scope: $scope,
        animation: "slide-in-up",
      })
      .then(function (modal) {
        $scope.modalList = modal;
      });

    $scope.openModalList = function () {
      $scope.modalList.show();
    };
    $scope.closeModalList = function () {
      $scope.modalList.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalList.remove();
    });

    function onStart() {
      $ionicLoading.show();
      let req = {
        mode: "listHist",
      };

      fachttp.model("withdraw.php", req).then(
        function (response) {
          //console.log(response.data);
          if (response.data.status == true) {
            vm.list = response.data;
          }

          $ionicLoading.hide();
        },
        function err(err) {
          vm.status = false;
          $ionicLoading.hide();
        }
      );
    }

    onStart();

   


    vm.modalDetail = function (e) {
      let k = JSON.stringify(e);
      $state.go('app.withdrawHistDetail',{'pick_nbr':k})
    };



    vm.del = function () {
      var confirm = $mdDialog
        .confirm()
        .title("แจ้งเตือน !!!")
        .textContent("ต้องการลบไปขอเบิกนี้หรือไม่ ?")
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function () {
          $ionicLoading.show();
          let req = {
            mode: "delList",
            list: vm.item,
          };

          fachttp.model("withdraw.php", req).then(
            function (response) {
              //console.log(response.data);
              if (response.data.stauts == true) {
              } else {
              }
              onStart();
              $scope.closeModalList();
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
        },
        function () {}
      );
    };

    vm.addDoc = function () {
      $state.go("app.withdraw");
    };
  })

  
  .controller("withdrawHistDetailCtrl", function (
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
    $ionicScrollDelegate,
    fachttp
  ) {
    let vm = this;
    vm.pick_nbr = JSON.parse($stateParams.pick_nbr);
    //console.log(vm.pick_nbr)
    $ionicModal
      .fromTemplateUrl("my-detail.html", {
        scope: $scope,
        animation: "slide-in-up",
      })
      .then(function (modal) {
        $scope.modalList = modal;
      });

    $scope.openModalList = function () {
      $scope.modalList.show();
    };
    $scope.closeModalList = function () {
      $scope.modalList.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalList.remove();
    });

    function onStart() {
      $ionicLoading.show();
      let req = {
        mode: "listHistDetail",
        picknbr: vm.pick_nbr,

      };

      fachttp.model("withdraw.php", req).then(
        function (response) {
          //console.log(response.data);
          if (response.data.status == true) {
            vm.item = response.data.result;
          }

          $ionicLoading.hide();
        },
        function err(err) {
          vm.status = false;
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    vm.withdrawHist = function () {
      $state.go("app.withdrawHist");
    };

    vm.modalDetail = function (e) {
      //console.log("123");
      vm.item = e;
      $scope.openModalList();
    };

    vm.del = function () {
      var confirm = $mdDialog
        .confirm()
        .title("แจ้งเตือน !!!")
        .textContent("ต้องการลบไปขอเบิกนี้หรือไม่ ?")
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function () {
          $ionicLoading.show();
          let req = {
            mode: "delList",
            list: vm.item,
          };

          fachttp.model("withdraw.php", req).then(
            function (response) {
              //console.log(response.data);
              if (response.data.stauts == true) {
              } else {
              }
              onStart();
              $scope.closeModalList();
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
            }
          );
        },
        function () {}
      );
    };

    vm.openDetail = function(){
      //console.log('222')
    }

    vm.addDoc = function () {
      $state.go("app.withdraw");
    };
  })


  // .controller("withdrawHistCtrl", function (
  //   $ionicHistory,
  //   $state,
  //   $scope,
  //   $stateParams,
  //   $rootScope,
  //   $http,
  //   $ionicModal,
  //   $ionicLoading,
  //   $timeout,
  //   $ionicPopup,
  //   Service,
  //   $mdDialog,
  //   $q,
  //   $ionicSlideBoxDelegate,
  //   $ionicScrollDelegate,
  //   fachttp
  // ) {
  //   let vm = this;

  //   {
  //     $ionicModal
  //       .fromTemplateUrl("hist.html", {
  //         scope: $scope,
  //         animation: "slide-in-up",
  //       })
  //       .then(function (modal) {
  //         $scope.modalHist = modal;
  //       });

  //     $scope.openModalHist = function () {
  //       // $scope.histIdSelect = e;
  //       $scope.modalHist.show();
  //     };

  //     $scope.closeModalHist = function () {
  //       $scope.modalHist.hide();
  //     };
  //     // Cleanup the modal when we're done with it!
  //     $scope.$on("$destroy", function () {
  //       $scope.modalHist.remove();
  //     });
  //   }

  //   function onStart() {
  //     $ionicLoading.show();
  //     let req = {
  //       mode: "request1",
  //     };

  //     fachttp.model("withdraw.php", req).then(
  //       function (response) {
  //         //console.log(response.data);
  //         // vm.status = response.data.status;
  //         if (response.data.status == true) {
  //           vm.wo_mstr = response.data;
  //           //console.log(vm.wo_mstr.result);
  //         }

  //         $ionicLoading.hide();
  //       },
  //       function err(err) {
  //         vm.status = false;
  //         $ionicLoading.hide();
  //       }
  //     );
  //   }

  //   onStart();
  // });


  