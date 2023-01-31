angular
  .module("app")
  .controller("singleReceiveCtrl", function ($scope, fachttp) {
    let vm = this;

    function onStartwoMstr() {
      let req = {
        mode: "getReceiveItem",
      };

      fachttp.model("controller/receiveLot.php", req).then(
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
