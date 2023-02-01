angular
  .module("app")
  .controller(
    "singleReceiveCtrl",
    function ($scope, fachttp, $ionicModal, $ionicLoading, Service) {
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
    }
  )
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
