angular
  .module("app")
  .controller("startPlantCtrl", function (
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
    fachttp
  ) {
    let vm = this;

  

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

      fachttp.model('startPlant.php', req, {
        timeout: cancellerLoadpic.promise
      }).then(function (response) {
          //console.log(response.data)
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

    onStart()


    vm.save = function (e) {
      let k = JSON.stringify(angular.copy(e));

      $state.go("app.startPlant1", {
        crop: k
      });


    };

  })
  .controller("startPlant1Ctrl", function (
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
    fachttp
  ) {
    let vm = this;
    $scope.crop = JSON.parse($stateParams.crop)

    function onStart() {
      $ionicLoading.show();
      let cancellerLoadpic = $q.defer();
      let req = {
        mode: "crop_type",
        value: $scope.crop
      };

      $timeout(function () {
        cancellerLoadpic.resolve("user cancelled");
        $ionicLoading.hide();
      }, 8000);

      fachttp.model('startPlant.php', req, {
        timeout: cancellerLoadpic.promise
      }).then(function (response) {
          //console.log(response.data)
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

    onStart()


    vm.save = function (e) {
      let k = JSON.stringify(angular.copy(e));

      $state.go("app.startPlant2", {
        crop: $stateParams.crop,
        type: k
      });


    };

  })


  .controller("startPlant2Ctrl", function (
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
    fachttp
  ) {
    let vm = this;
    vm.crop = JSON.parse($stateParams.crop);

    $scope.doRefresh = function () {
      // here refresh data code
      $scope.$broadcast("scroll.refreshComplete");
      $scope.$apply();
      onStart();
    };

    function onStart() {
      let cancellerLoadpic = $q.defer();
      let req = {
        mode: "selectFarm",
        config: {
          frm_code: $rootScope.global.mob_farm_code
        }

      };

      $timeout(function () {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      fachttp.model('area.php', req, {
        timeout: cancellerLoadpic.promise
      }).then(function (response) {


          $scope.status = true;

          //console.log(response);
          if (response.data.status == true) {
            $scope.data = response.data;
          } else {
            $scope.data = response.data;
          }
          //console.log(response);
        },
        function err(err) {
          //console.log(err);
          $scope.data = [];
          $scope.status = false;
        }
      );
    }

    vm.refresh = function () {
      delete $scope.data;
      delete $scope.status;
      onStart();
    };

    onStart();



    vm.go = function (e) {
      let k = JSON.stringify(e)
      $state.go("app.startPlant3", {
        crop: $stateParams.crop,
        type: $stateParams.type,
        sub: k
      });
    }


  })

  .controller("startPlant3Ctrl", function (
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
    fachttp
  ) {
    let vm = this;
    vm.pic_desc;

    // description: "พืชผัก" หมวด
    // pt_group_desc: "เกษตร" กลุ่ม
    // comments: "แตงโม พันธุ์ไร้เมล็ด" ประเภท
    // pt_desc1: "แตงโมไร้เมล็ด" รายการ

    vm.crop = JSON.parse($stateParams.crop)
    vm.sub = JSON.parse($stateParams.sub)
    vm.type = JSON.parse($stateParams.type)
  


    //console.log(vm.sub)
    //console.log(vm.crop)
    console.log(vm.type)


    //modal

    {
      $ionicModal
        .fromTemplateUrl("list_map.html", {
          scope: $scope,
          animation: "slide-in-up"
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

    function onStart() {
      $ionicLoading.show();
      let req = {
        mode: "selectsubfarm",
        farm: vm.sub
      };
      fachttp.model('startPlant.php', req).then(function (response) {
          //console.log(response.data);
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
    // $scope.list = JSON.parse($stateParams.list);

    vm.listmap = function () {
      $scope.modalListmap.show();
      $ionicLoading.show();

      $timeout(function () {
        $ionicLoading.hide();

        //console.log($scope.subfarm);

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

          // //////////console.log($scope.abc);

          // //////////console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i])
            };

            polygonCoordsListmap.push(new google.maps.LatLng(k.lat, k.lng));
            triangleCoordsListmap.push(k);
          }
          // //////////console.log(triangleCoords);

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

          // //console.log(all_overlaysListmap[x]);
          // //console.log(map);

          all_overlaysListmap[x].setMap(map);

          map.fitBounds(boundsListmap);
          map.panTo(boundsListmap.getCenter());
        }
      }, 1000);
    };

    vm.selectSubBefore = function (e, index) {
      $scope.modalListmap.hide();
      vm.selectSub(e, index);
    };

    vm.selectSub = function (e, index) {
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

      $timeout(function () {
        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i])
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // //////////console.log(triangleCoords);

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

    vm.qty = null

    vm.save = function () {
      if($scope.subDetail){
        var confirm = $mdDialog
        .confirm()
        .title("แจ้งเตือน !!!")
        .textContent(
          "ต้องการเริ่มต้นการกระบวนการนี้หรือไม่ ?"
        )
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function () {
          if (parseInt(vm.qty)) {
            $ionicLoading.show();
            let req = {
              mode: "startCrop",
              crop: vm.crop,
              type: vm.type,
              sub: vm.sub,
              subdetail: $scope.subDetail,
              qty: parseInt(vm.qty)
            };
            fachttp.model('startPlant.php', req).then(function (response) {
                //console.log(response.data);
                if (response.data.status == true) {
                  $mdDialog
                    .show(
                      $mdDialog
                      .alert()
                      .parent(
                        angular.element(document.querySelector("#popupContainer"))
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
                          $state.go('app.detail');

                        });
                      },
                      function () {}
                    );

                  $ionicLoading.hide();
                } else {
                  alert('ไม่สามารถสร้างเริ่มต้นเพาะปลูกได้กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมส่งเสริม')
                  $ionicLoading.hide();
                }
              },
              function err(err) {
                $ionicLoading.hide();
              }
            );
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
                .textContent("ตรวจสอบจำนวนเพาะปลูกก่อนบันทึก")
                .ariaLabel("Alert Dialog Demo")
                .ok("OK")
                .targetEvent()
              )
              .then(
                function (answer) {

                },
                function () {

                }
              );
          }
        },
        function () {

        }
      );

      }else{


        var confirm = $mdDialog
        .confirm()
        .title("แจ้งเตือน !!!")
        .textContent(
          "พื้นที่นี้ยังไม่ได้สร้างแปลงต้องการเริ่มการเพาะปลูกนี้หรือไม่ ระบบจะสร้างแปลงให้อัตโนมัติ"
        )
        .ariaLabel("Lucky day")
        .targetEvent()
        .ok("ยืนยัน")
        .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            if (parseInt(vm.qty)) {
              $ionicLoading.show();
              let req = {
                mode: "startCropNosub",
                crop: vm.crop,
                type: vm.type,
                sub: vm.sub,
                subdetail: $scope.subDetail,
                qty: parseInt(vm.qty)
              };
              fachttp.model('startPlant.php', req).then(function (response) {
                  //console.log(response.data);
                  if (response.data.status == true) {
                    $mdDialog
                      .show(
                        $mdDialog
                        .alert()
                        .parent(
                          angular.element(document.querySelector("#popupContainer"))
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
                            $state.go('app.detail');
  
                          });
                        },
                        function () {}
                      );
  
                    $ionicLoading.hide();
                  } else {
                    alert('ไม่สามารถสร้างเริ่มต้นเพาะปลูกได้กรุณาลองใหม่อีกครั้ง หรือติดต่อทีมส่งเสริม')
                    $ionicLoading.hide();
                  }
                },
                function err(err) {
                  $ionicLoading.hide();
                }
              );
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
                  .textContent("ตรวจสอบจำนวนเพาะปลูกก่อนบันทึก")
                  .ariaLabel("Alert Dialog Demo")
                  .ok("OK")
                  .targetEvent()
                )
                .then(
                  function (answer) {
  
                  },
                  function () {
  
                  }
                );
            }
          },
          function () {
  
          }
        );
      }

      



    };

    vm.create = function () {
      $ionicHistory.nextViewOptions({
        historyRoot: true
      });
      $state.go('app.area')
    }
  });
