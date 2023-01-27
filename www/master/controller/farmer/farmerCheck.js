angular
  .module("app")

  .controller("farmerCheckCtrl", function(
    $ionicPopup,
    Service,
    $scope,
    $ionicSlideBoxDelegate,
    $http,
    $cordovaKeyboard
  ) {



    $scope.settings = {
      lang: "th",
      theme: "ios"
    };

    $scope.allowOwerweight = false;
    $scope.consumption = 30;

    $scope.lockSlide = function() {
      $ionicSlideBoxDelegate.enableSlide(false);
    };
    let vm = this;

    vm.bomb2 = {
      date: "10/10/62",
      data: [
        {
          main: "เติมปุ๋ย",
          hr: 0,
          minor: [{ detail: "ปุ๋ย", value: 0 }, { detail: "ปุ๋ย 2", value: 0 }]
        },
        {
          main: "รดน้ำ",
          hr: 0,
          minor: [
            { detail: "รดน้ำ 1", value: 0 },
            { detail: "รดน้ำ 2", value: 0 }
          ]
        }
      ]
    };

    vm.bomb = vm.bomb2;

    vm.slideright = function(e) {
      $ionicSlideBoxDelegate.slide(e + 1);
      $ionicSlideBoxDelegate.update();

      //console.log(e + 1);
    };

    vm.slideleft = function(e) {
      $ionicSlideBoxDelegate.slide(e - 1);
      $ionicSlideBoxDelegate.update();
    };

    vm.minorChange = function(e) {
      //console.log(e);
      //console.log(vm.mino);
    };

    vm.mino = "0";
    vm.date = "2019-03-28";

    function sysdate() {
      let url = "http://192.168.9.172/agriproServer/cal.php";
      let req = { mode: "sysdate" };
      $http.post(url, req).then(function(response) {
        vm.date = response.data.sysdate;
      });
    }

    sysdate();

    vm.leftday = function() {
      vm.bomb = vm.bomb2;

      $ionicSlideBoxDelegate.update();

      let url = "http://192.168.9.172/agriproServer/cal.php";
      let req = { mode: "left", value: vm.date };
      $http.post(url, req).then(function(response) {
        vm.date = response.data.date;
      });
    };
    vm.rightday = function() {
      vm.bomb = vm.bomb2;

      $ionicSlideBoxDelegate.update();

      let url = "http://192.168.9.172/agriproServer/cal.php";
      let req = { mode: "right", value: vm.date };
      $http.post(url, req).then(function(response) {
        vm.date = response.data.date;
      });
    };

    let platform = ionic.Platform.platform();
    //console.log(platform);
    vm.pickdate = function() {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.pickdate();
          k.then(function suss(data) {
            vm.date = data;
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
          buttons: [
            { text: "Cancel" },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function(e) {
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

        myPopup.then(function(res) {
          vm.date = res;
        });
      }
    };


$scope.model = {time:0}


    vm.bombplus = function(e,i){

      let k  =  vm.bomb.data[i].minor[vm.mino].value + 0.01
      let p  = k.toFixed(2);
      let m = parseFloat(p)
      vm.bomb.data[i].minor[vm.mino].value = m

    }

    vm.bombminus = function(e,i){
      if(vm.bomb.data[i].minor[vm.mino].value != 0){

      let k  =  vm.bomb.data[i].minor[vm.mino].value - 0.01
      let p  = k.toFixed(2);
      let m = parseFloat(p)
      vm.bomb.data[i].minor[vm.mino].value = m
      }

    }


     vm.timeplus = function(e,i){

      let k  =  $scope.model.time + 0.5
      let p  = k.toFixed(2);
      let m = parseFloat(p)
       $scope.model.time = m

    }

    vm.timeminus = function(e,i){
 
 if($scope.model.time != 0){
     let k  =  $scope.model.time - 0.5
      let p  = k.toFixed(2);
      let m = parseFloat(p)
       $scope.model.time = m
 } 
 
    }
  });
