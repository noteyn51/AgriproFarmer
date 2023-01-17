angular.module('app')

.controller('outCtrl', function($timeout,$ionicActionSheet,$ionicLoading,$scope,$rootScope,$localStorage,$ionicHistory,$state,$stateParams) {
  let vm = this;
  vm.mess = {mess:$stateParams.mess}
vm.logout = function(){


   let hideSheet = $ionicActionSheet.show({
        titleText: "Logout ",
        buttons: [
          {
            text: '<i class="icon ion-log-out"></i> Logout'
          }
          // {
          //   text: '<i class="icon ion-chatboxes"></i> Share with Sms'
          // },
          // {
          //   text: '<i class="icon ion-network"></i> Share with Social'
          // },
        ],

        buttonClicked: function(index) {
          //console.log(index);
          if (index == 0) {
            $ionicLoading.show();
            $rootScope.global = {};
            delete $localStorage.globalAGRI;
            // $ionicHistory.clearCache();

            $timeout(function() {
              window.location = "index.html";
              $ionicLoading.hide();
            }, 1000);
          }

          // if (index == 1) {
          // }

          // if (index == 2) {
          // }

          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function() {
        hideSheet();
      }, 7000);
  

    }

    
})
