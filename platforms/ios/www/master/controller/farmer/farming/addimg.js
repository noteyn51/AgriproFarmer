angular
  .module("app")
  .controller(
    "addimgCtrl",
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
      // $scope.cropSelect = {};
      vm.cropSelect = {};
      // vm.pt_select = {};
      $scope.model = {};
      // vm.farmSelect = {};

      function onStartwoMstr() {
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "womstr",
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 8000);

        fachttp
          .model("detail.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              $scope.status = true;
              //console.log(response);
              if (response.data.status == true) {
                vm.list = response.data;
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

      onStartwoMstr();

      vm.viewimage = function (e) {
        $state.go("app.addviewbyid", { item: JSON.stringify(e) });
      };

      vm.addimage = function (e) {
        $state.go("app.addimgadd", { item: JSON.stringify(e) });
      };
    }
  )

  .controller(
    "addimgAddCtrl",
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
      vm.item = JSON.parse($stateParams.item);
      vm.desc = "";
      vm.image = [];

      vm.save = function () {
        if (vm.image.length > 0) {
          $ionicLoading.show();
          let cancellerLoadpic = $q.defer();
          let req = {
            mode: "addimage",
            global: $rootScope.global,
            image: vm.image,
            item: vm.item,
            desc: vm.desc,
          };

          $timeout(function () {
            cancellerLoadpic.resolve("user cancelled");
          }, 8000);

          // "https://digimove.365supplychain.com/agripro/agri_ociv2/model/plantimage.php"
          // $http.post("https://digimove.365supplychain.com/agripro/agri_ociv2/model/plantimage.php")

          // "https://localhost/agri_ociv2/model/plantimage.php",

          $http
            .post(
              "https://digimove.365supplychain.com/agripro/agri_ociv2/model/plantimage.php",
              req,
              {
                timeout: cancellerLoadpic.promise,
              }
            )
            .then(
              function (response) {
                $ionicLoading.hide();

                $mdDialog
                  .show(
                    $mdDialog
                      .alert()
                      .parent(
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
                      )
                      .clickOutsideToClose(true)
                      .title("แจ้งเตือน")
                      .textContent("บันทึกข้อมูลสำเร็จ")
                      .ariaLabel("Alert Dialog Demo")
                      .ok("OK")
                      .targetEvent()
                  )
                  .then(
                    function (answer) {
                      $state.go("app.addviewbyid", {
                        item: JSON.stringify(vm.item),
                      });
                    },
                    function () {}
                  );

                // console.log(response.data);
                // if (response.data.status == true) {
                //   mobiscroll.alert({
                //     title: "แจ้งเตือน",
                //     message: "บันทึกข้อมูลสำเร็จ",
                //     callback: function () {
                //       $state.go("app.detail");
                //     },
                //   });
                // } else {
                // }
              },
              function err(err) {
                $ionicLoading.hide();
                Service.timeout();
              }
            );
        } else {
          Service.toast("โปรดใส่รูปภาพอย่างน้อย 1 รูปภาพ", "info", "bottom");
        }
      };

      vm.addimage = function () {
        let imgsize = {
          min: Math.round(Math.random() * (800 - 500) + 500),
          max: Math.round(Math.random() * (800 - 500) + 500),
        };
        let imgdata =
          "https://picsum.photos/" + imgsize.min + "/" + imgsize.max;

        console.log(imgsize);
        vm.image.push(
          "data:image/gif;base64,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"
        );

        $ionicScrollDelegate.resize();

      };

      vm.deleteImg = function (i) {
        console.log(i);
        vm.image.splice(i, 1);
      };

      vm.takePicture = function () {
        let platform = ionic.Platform.platform();
        if (platform == "android" || platform == "ios") {
          camera();
        } else {
          vm.addimage();
        }
      };

      vm.selectPicture = function () {
        let platform = ionic.Platform.platform();
        if (platform == "android" || platform == "ios") {
          image();
        } else {
          vm.addimage();
        }
      };

      function camera() {
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 40,
          sourceType: Camera.PictureSourceType.CAMERA,
          destinationType: Camera.DestinationType.DATA_URL,
          targetWidth: 1200,
          targetHeight: 1200,
        });

        function onSuccess(imageData) {
          $ionicLoading.show({
            duration: 500,
          });

          let img = "data:image/jpeg;base64," + imageData;
          vm.image.push(img);
          $ionicScrollDelegate.resize();

        }

        function onFail(message) {
          alert("Failed because: " + message);
        }
      }

      function image() {
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

          let img = "data:image/jpeg;base64," + imageData;

          vm.image.push(img);
          $ionicScrollDelegate.resize();

        }

        function onFail(message) {
          alert("Failed because: " + message);
        }
      }
    }
  )

  .controller(
    "addviewbyidCtrl",
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

        // console.log(e.path);
        // vm.imgshow = e.path;
        // console.log(vm.imgshow);
        // $scope.modalimage.show();
      };
      $scope.closeModalMyImage = function () {
        $scope.modalimage.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalimage.remove();
      });

      vm.item = JSON.parse($stateParams.item);

      vm.deleteImage = function (e, a) {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน !!!")
          .textContent("ต้องการลบรูปภาพนี้หรือไม่ ?")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function (result) {
            console.log(result);
            deleteImges();
          },
          function (e) {
            console.log(e);
          }
        );

        // console.log(e);
        // console.log(a);

        function deleteImges() {
          $ionicLoading.show();
          let cancellerLoadpic = $q.defer();
          let req = {
            mode: "deletePic",
            post: e,
            image: a,
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
                onStartwoMstr();
                console.log(response);
                $ionicLoading.hide();
                Service.toast("ลบรูปภาพแล้ว", "info", "bottom");
              },

              function err(err) {
                Service.toast(
                  "เกิดข้อผิดพลาดโปรดลองใหม่อีกครั้งภายหลัง",
                  "danger",
                  "bottom"
                );

                $ionicLoading.hide();

                //console.log(err);
              }
            );
        }
      };

      function onStartwoMstr() {
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "getimgbyid",
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
