angular
  .module("app")
  .controller("envCtrl", function (
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
    $ionicScrollDelegate,
    fachttp,
    $q,
    $ionicModal,
    $ionicActionSheet,
    $ionicPopup
  ) {
    let vm = this;

    vm.goBack = function () {
      $ionicHistory.goBack();
    }

    function onStartwoMstr() {
      let cancellerLoadpic = $q.defer();
      let req = {
        mode: "womstr",
      };

      $timeout(function () {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      fachttp.model('env.php', req, {
        timeout: cancellerLoadpic.promise
      }).then(function (response) {

          $scope.status = true;
          //console.log(response);
          if (response.data.status == true) {
            vm.list = response.data;
            $scope.model = {
              date: response.data.date.date,
              time: response.data.date.time
            };
            $scope.selectID(vm.list.result[0]);
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

    onStartwoMstr()


    $ionicModal
      .fromTemplateUrl("my-wo-id.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modaleMyId = modal;
      });

    $scope.openModalMyId = function () {
      $scope.modaleMyId.show();
    };
    $scope.closeModalMyId = function () {
      $scope.modaleMyId.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modaleMyId.remove();
    });


    $scope.selectID = function (e) {
      $ionicLoading.show()
      delete vm.route;
      $scope.idSelected = e;
      //console.log($scope.idSelected)
      $scope.modaleMyId.hide();

      let cancellerLoadpic = $q.defer();
      let req = {
        mode: "wr_route",
        id: e.wo_lot
      };

      $timeout(function () {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      fachttp.model('env.php', req, {
        timeout: cancellerLoadpic.promise
      }).then(function (response) {
          $ionicLoading.hide();
          //console.log(response);
          if (response.data.status == true) {
            vm.route = response.data;
          } else {
            vm.route = response.data;
          }
          //console.log(vm.route);
        },
        function err(err) {
          $ionicLoading.hide();
          Service.timeout();
          vm.route = [];
        }
      );


      // Service.toast(
      //   "เลือกรายการเพาะปลูก ID " + e.wo_lot,
      //   "info",
      //   "bottom"
      // );
    }


    let platform = ionic.Platform.platform();

   

    vm.pickdate = function (e) {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function () {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.model.date = data;
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
          buttons: [{
              text: "Cancel"
            },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function (e) {
                if (!$scope.data.date) {
                  //don't allow the user to close unless he enters wifi password
                  //console.log(1);
                  e.preventDefault();
                } else {
                  //console.log(2);
                  return $scope.data.date;
                }
              }
            }
          ]
        });

        myPopup.then(function (res) {
          $scope.model.date = res;
        });
      }
    };
    vm.picktime = function () {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function () {
          let k = Service.picktime();
          k.then(function suss(data) {
            //console.log(data)
            $scope.model.time = data.substring(0, 5);


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
          buttons: [{
              text: "Cancel"
            },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function (e) {
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

        myPopup.then(function (res) {
          if (res) {
            $scope.model.time = res;
            //console.log(res)
          }
        });
      }
    };


    $scope.image = [];
    $scope.image2 = [];


    vm.addPic = function (imgS) {
      let platform = ionic.Platform.platform();
      // $scope.openModalPic();

      if (platform == "android" || platform == "ios") {
        camera(imgS);
      } else {
        let img = {
          img:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg==",
          desc: null,
        };
        imgS.push(img);
        //console.log(imgS);

        // $timeout(function () {
        //   $ionicSlideBoxDelegate.slide($scope.image.length - 1);
        // }, 500);
        $ionicSlideBoxDelegate.update();
        $ionicScrollDelegate.resize();
      }
    };

    vm.selectPic = function (imgS) {
      let platform = ionic.Platform.platform();
      // $scope.openModalPic();

      if (platform == "android" || platform == "ios") {
        image(imgS);
      } else {
        let img = {
          img:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg==",
          desc: null,
        };
        imgS.push(img);
   


        $ionicSlideBoxDelegate.update();
        $ionicScrollDelegate.resize();
      }
    };

    function camera(imgS) {
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
        imgS.push(img);
        // $timeout(function () {
        //   $ionicSlideBoxDelegate.slide($scope.image.length - 1);
        // }, 500);
        $ionicSlideBoxDelegate.update();
        $ionicScrollDelegate.resize();
        // //console.log($scope.image);
        // //console.log($scope.image.length);
      }

      function onFail(message) {
        alert("Failed because: " + message);
      }
    }

    function image(imgS) {
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
        imgS.push(img);
     
        $ionicSlideBoxDelegate.update();
    

        $ionicScrollDelegate.resize();
      }

      function onFail(message) {
        alert("Failed because: " + message);
      }
    }

    vm.removeIcon = function(i,es){
      //console.log(es)
      //console.log('ss')
      let hideSheet = $ionicActionSheet.show({
        titleText: "เลือกรายการ ",
        buttons: [
          // {
          //   text: 'Zoom',
          // },
          {
            text: '<i class="icon ion-trash-a" ></i> ลบรูปภาพ',
          },
          
        ],
        buttonClicked: function (index) {
 
          // if (index == 0) {
          //   $scope.image = 'REMOVE';
          //   delete $scope.editdata.imgpath
          //   //console.log($scope.image)
          // }
          if(index == 0) {
            //console.log(es)
            es.splice(i, 1);
    
            $ionicSlideBoxDelegate.update();
            $ionicScrollDelegate.resize();
          }
          return true;
        },
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 7000);

    }





  })
