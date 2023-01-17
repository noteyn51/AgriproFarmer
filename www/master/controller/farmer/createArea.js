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
    $ionicLoading,
    $ionicModal
  ) {
    let vm = this;

    function province() {
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "province" ,global:$rootScope.global};

      $http.post(url, req).then(
        function(response) {
          //console.log(response.data);
          if (response.data.status == true) {
            vm.vd = response.data.vd;
            vm.province = response.data.result;
            vm.provinceSelect = response.data.provinceSelect;
            vm.aumphur = response.data.aumphur
            vm.aumphurSelect = response.data.aumphurSelect;
            vm.tumbol = response.data.tumbol
            vm.tumbolSelect = response.data.tumbolSelect;

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
      $ionicLoading.show();
      let url = $rootScope.ip + "createArea.php";
      let req = { mode: "AUMPHUR", data: e ,global:$rootScope.global};

      $http.post(url, req).then(
        function(response) {
          //console.log(response.data);
          if (response.data.status == true) {
            vm.aumphur = response.data.result;
            delete vm.aumphurSelect 
            vm.tumbol =[];
            delete vm.tumbolSelect
    
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
      let req = { mode: "tumbol", data: e,global:$rootScope.global };

      $http.post(url, req).then(
        function(response) {
          //console.log(response.data);
          if (response.data.status == true) {
            vm.tumbol = response.data.result;
            delete vm.tumbolSelect
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
      // //console.log("surveyors");
      // $state.go("app.add3");
      $ionicHistory.goBack();
    };

    vm.createNameChange = function(e) {
      $scope.model.createname = JSON.parse(e);
    };

    vm.confirm = function() {
      //console.log($scope.guarantee )
      //console.log($scope.model);

      if ($scope.model.name && vm.provinceSelect && vm.aumphurSelect && vm.tumbolSelect ) {
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
                global:$rootScope.global,
                mode: "createFarm",
                area: $rootScope.area.area,
                position: resposition,
                name: $scope.model,
                crop: $rootScope.cropSet,
                pro: pro,
                standard:$scope.guarantee
              };
              //console.log(pro);
              $http.post(url, req).then(
                function suscess(response) {
                  //console.log(response);
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

                      //console.log("clear");
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
              //console.log(req);
            }
          }
        });
      } else {
        mobiscroll.alert({
          title: "แจ้งเตือน",
          message: "กรอกข้อมูลให้ครบถ้วนก่อนการบันทึก",
          callback: function() {}
        });
      }
    };

    $scope.guarantee = [
      {id:'1',name:'GAP',en:'Good Agriculture Practices ',value:0,date:null,serNo:null,icon:'data:image/jpeg;base64,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'},
      {id:'2',name:'เกษตรอินทรีย์',en:'Organic Agriculture',value:0,date:null,serNo:null,icon:'data:image/jpeg;base64,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'}
    ]

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



    vm.pickdateSer = function(e){
      //console.log(e)

      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
          e.date = data;
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
          e.date  = res;
        });
      }
    }

    $ionicModal
    .fromTemplateUrl("standard.html", {
      scope: $scope,
      animation: "slide-in-up"
    })
    .then(function (modal) {
      $scope.standardModal = modal;
    });

  $scope.openModalStandard = function () {
    $scope.standardModal.show();
  };
  $scope.closeModalStandard = function () {
    $scope.standardModal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on("$destroy", function () {
    $scope.standardModal.remove();
  });


  });
