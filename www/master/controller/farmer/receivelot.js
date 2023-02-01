angular
  .module("app")
  .controller("singleReceiveCtrl", function ($scope, fachttp, $ionicModal) {
    let vm = this;

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
      let req = {
        mode: "getReceiveItem",
      };

      fachttp.model("controller/receiveLot.php", req).then(
        function (response) {
          console.log(response);
        },
        function err(err) {
          vm.list = [];
        }
      );
      $scope.modelItem.show();
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

    $scope.selectId = function (e) {
      console.log(e);
    };
  })
  .controller("multiReceiveCtrl", function ($scope, fachttp) {
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
      console.log(e);
    };
  });
