angular.module('app')

.controller('farmerResultCtrl', function(Service,$scope,$ionicPopup) {
  let vm = this;
  let platform = ionic.Platform.platform();
  //console.log(platform)
  vm.pickdate = function(){
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
  }

   vm.picktime = function(){
     if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
          let k = Service.picktime();
          k.then(function suss(data) {
            vm.time = data;
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
          vm.time = res;
        });
      }
  }

})
