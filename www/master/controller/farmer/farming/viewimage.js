angular
  .module("app")
  .controller(
    "viewimageCtrl",
    function (
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
      fachttp,
      $ionicScrollDelegate
    ) {
      let vm = this;
      vm.cropSelect = {};
      $scope.model = {};
      $scope.crop = {
        frm_code: $rootScope.global.mob_farm_code,
      };

      $rootScope.cropSet = $scope.crop;

      function onStart() {
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "selectFarm",
          config: $rootScope.cropSet,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 8000);

        fachttp
          .model("area.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
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

      onStart();

      vm.viewimage = function (e) {
        $state.go("app.viewimgDetail", { id: JSON.stringify(e) });
      };
      vm.add = function () {
        $state.go("app.startPlant");
      };
    }
  )

  .controller(
    "viewimgDetailCtrl",
    function (
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
      fachttp,
      $ionicScrollDelegate
    ) {
      let vm = this;
      vm.item = JSON.parse($stateParams.id);

      console.log(vm.item);

      // $scope.cropSelect = {};
      vm.cropSelect = {};
      // vm.pt_select = {};
      $scope.model = {};

      vm.imgshow = "";

      $ionicModal
        .fromTemplateUrl("my-img.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalimage = modal;
        });

      $scope.openModalMyImage = function (e) {

        document.addEventListener("deviceready", function () {
          var options = {
            share: true, // default is false
            closeButton: false, // default is true
            copyToReference: true, // default is false
            headers: "", // If this is not provided, an exception will be triggered
            piccasoOptions: {}, // If this is not provided, an exception will be triggered
          };

          PhotoViewer.show(e.path, "รูปภาพ", options);
        });

        // console.log(e);
        // vm.imgshow = e.path;
        // $scope.modalimage.show();
      };
      $scope.closeModalMyImage = function () {
        $scope.modalimage.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalimage.remove();
      });

      // function onStartwoMstr() {
      //   let cancellerLoadpic = $q.defer();
      //   let req = {
      //     mode: "womstr",
      //   };

      //   $timeout(function () {
      //     cancellerLoadpic.resolve("user cancelled");
      //   }, 8000);

      //   $http.get("https://jsonplaceholder.typicode.com/photos").then(
      //     function (response) {
      //       $scope.status = true;
      //       // vm.list = response.data;
      //       console.log(response);
      //     },
      //     function err(err) {
      //       //console.log(err);
      //       vm.list = [];
      //       $scope.status = false;
      //     }
      //   );
      // }

      // onStartwoMstr();

      function onStartwoMstr() {
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "getimgbyarea",
          item: vm.item,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 8000);

        fachttp
          .model("plantimage.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              $scope.status = true;
              console.log(response);
              if (response.data.status == true) {
                vm.list = response.data.data;
              } else {
                vm.list = response.data.data;
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

      onStartwoMstr();
    }
  );
