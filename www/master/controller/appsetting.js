angular
  .module("app")

  .controller(
    "appsettingCtrl",
    function (
      $scope,
      $ionicModal,
      $timeout,
      $http,
      $rootScope,
      $timeout,
      $state,
      $stateParams,
      $ionicHistory,
      $ionicActionSheet,
      $ionicLoading,
      $localStorage
    ) {
      let vm = this;

      $scope.version = null;
      document.addEventListener("deviceready", function () {
        cordova.getAppVersion.getVersionNumber().then(function (version) {
          $(".version").text(version);
          console.log(version);
          $scope.version = version;
        });
      });

      vm.area = function () {
        $state.go("app.area");
      };

      vm.usersetting = function () {
        $state.go("app.usersetting");
      };

      vm.editpassword = function () {
        $state.go("app.editpassword");
      };

      vm.deleteUser = function () {
        $state.go("app.deleteuser");
      };

      vm.startPlant = function () {
        $state.go("app.startPlant");
        $scope.modalsetting.hide();
      };

      let platform = ionic.Platform.platform();

      vm.logout = function () {
        let hideSheet = $ionicActionSheet.show({
          titleText: "ออกจากระบบ ",
          buttons: [
            {
              text: '<i class="icon ion-log-out"></i> ออกจากระบบ',
            },
          ],

          buttonClicked: function (index) {
            console.log(index);
            if (index == 0) {
              document.addEventListener("deviceready", function () {
                FirebasePlugin.getToken(
                  function (fcmToken) {
                    console.log(fcmToken);
                    let serverkey =
                      "AAAAZPwkVrk:APA91bHAHIk-v7uZbw3imZwf1QLa53Aapw_vlIxH7cmOeRzinA6bCCB9SKuJa1KfWyEG_BIeWIIM0Ah5ycNtkjY4Gqn8WtDsV-gY17W3Fb-XL1-9tdYoH1NN4PRShexXxpIidx1NcqpE";
                    $http({
                      method: "GET",
                      url:
                        "https://iid.googleapis.com/iid/info/" +
                        fcmToken +
                        "?details=true",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + serverkey,
                      },
                    }).then(function (response) {
                      console.log(response.data.rel);
                      if (response.data.rel) {
                        for (const [key, value] of Object.entries(
                          response.data.rel.topics
                        )) {
                          console.log(key);

                          FirebasePlugin.unsubscribe(
                            key,
                            function () {
                              console.log("Unsubscribed from topic", key);
                            },
                            function (error) {
                              console.error(
                                "Error unsubscribing from topic: " + error
                              );
                            }
                          );
                        }
                      }
                    });
                  },
                  function (error) {
                    console.error(error);
                  }
                );
              });

              $rootScope.global = {};
              delete $localStorage.globalAGRI;
              $state.go("farmerlogin", null, {
                location: "replace",
              });

              // $ionicLoading.show();
              // document.addEventListener("deviceready", function () {
              //   for (let i = 0; i < $rootScope.global.iot.length; i++) {
              //     if (platform == "android") {
              //       FirebasePlugin.unsubscribe(
              //         $rootScope.global.iot[i],
              //         function () {
              //           console.log("Unsubscribed from topic");
              //         },
              //         function (error) {
              //           console.error(
              //             "Error unsubscribing from topic: " + error
              //           );
              //         }
              //       );
              //     } else if (platform == "ios") {
              //       FirebasePlugin.unsubscribe(
              //         $rootScope.global.iot[i],
              //         function () {
              //           console.log($rootScope.global.iot[i]);
              //           console.log("Unsubscribed from topic");
              //         },
              //         function (error) {
              //           console.error(
              //             "Error unsubscribing from topic: " + error
              //           );
              //         }
              //       );
              //     }
              //   }
              // });

              // $rootScope.global = {};
              // delete $localStorage.globalAGRI;
              // $timeout(function () {
              //   window.location = "index.html";
              //   $ionicLoading.hide();
              // }, 5000);
            }

            return true;
          },
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
          hideSheet();
        }, 7000);

        // $state.go('app.farmerlogin')
      };

      // espSmartconfig.getNetworklist({numLevels: false}, $scope.listHandler, $scope.fail);
      // console.log('ss')

      // $scope.listHandler = function(ssids) {
      //   console.log(ssids.SSID);
      //   console.log(ssids.BSSID);
      // };

      // $scope.fail = function(e) {
      //   console.log(e);
      // };
    }
  )

  .controller(
    "usersettingCtrl",
    function (
      $scope,
      $ionicModal,
      $timeout,
      $http,
      $rootScope,
      $timeout,
      $state,
      $stateParams,
      $ionicHistory,
      $ionicActionSheet,
      $ionicLoading,
      $localStorage,
      fachttp,
      $ionicPopup,
      $mdDialog
    ) {
      let vm = this;
      console.log("ss");
      $scope.model = {};

      function onStart() {
        let req = {
          mode: "detialuser",
        };
        fachttp.model("appsetting.php", req).then(
          function (response) {
            if (response.data.status == true) {
              vm.province = response.data.province.province;
              vm.provinceSelect = response.data.province.province_select;

              vm.aumphur = response.data.province.aumphur;
              vm.aumphurSelect = response.data.province.aumphur_select;

              vm.tumbol = response.data.province.tumbol;
              vm.tumbolSelect = response.data.province.tumbol_select;
              $scope.model.user_fname = response.data.result[0].frm_fname;
              $scope.model.user_lname = response.data.result[0].frm_lname;
              $scope.model.user_birth = response.data.result[0].frm_date;
              $scope.model.user_email = response.data.result[0].frm_email;
              $scope.model.user_tel = response.data.result[0].frm_tel;
              $scope.model.user_address = response.data.result[0].frm_line1;
              $scope.model.user_moo = parseInt(
                response.data.result[0].frm__qadc01
              );
              $scope.model.user_zip = response.data.result[0].frm_zip;
            } else {
            }
            console.log(response);
          },
          function err(err) {}
        );
      }

      onStart();

      vm.provinceChange = function (e) {
        $ionicLoading.show();
        let req = {
          mode: "AUMPHUR",
          data: e,
        };
        fachttp.model("appsetting.php", req).then(
          function (response) {
            if (response.data.status == true) {
              vm.aumphur = response.data.result;
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
            console.log(response);
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.aumphurChange = function (e) {
        $ionicLoading.show();
        let req = {
          mode: "TUMBOL",
          data: e,
        };

        fachttp.model("appsetting.php", req).then(
          function (response) {
            if (response.data.status == true) {
              vm.tumbol = response.data.result;
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
            console.log(response);
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.confirm = function () {
        console.log(vm.provinceSelect);
        console.log(vm.aumphurSelect);
        console.log(vm.tumbolSelect);
        let req = {
          mode: "edit",
          data: $scope.model,
          province: vm.provinceSelect,
          aumphur: vm.aumphurSelect,
          tumbol: vm.tumbolSelect,
        };

        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน !!!")
          .textContent("ต้องการบันทึกการเปลี่ยนแปลงนี้ใช่หรือไม่ ?")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            fachttp.model("appsetting.php", req).then(
              function (response) {
                if (response.data.status == true) {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message:
                      "บันทึกข้อมูลเรียบร้อยแล้ว <br> <a style='color:red'>*หากข้อมูลยังไม่เปลี่ยนแปลงให้ลอง เข้าสู้ระบบใหม่อีกครั้ง</a>",
                    callback: function () {
                      $state.go("app.appsetting");
                    },
                  });
                } else {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message: "ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
                    callback: function () {},
                  });
                }
              },
              function err(err) {
                mobiscroll.alert({
                  title: "แจ้งเตือน",
                  message: "ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
                  callback: function () {},
                });
                $ionicLoading.hide();
              }
            );
          },
          function () {
            console.log("cancel");
          }
        );
      };

      let platform = ionic.Platform.platform();

      vm.pickbirth = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.model.user_birth = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 2019-01-31",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.model.user_birth = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };
    }
  )

  .controller(
    "deleteUserCtrl",
    function (
      $scope,
      $ionicModal,
      $timeout,
      $http,
      $rootScope,
      $timeout,
      $state,
      $stateParams,
      $ionicHistory,
      $ionicActionSheet,
      $ionicLoading,
      $localStorage,
      fachttp,
      $mdDialog,
      Service
    ) {
      function sendDelteUser() {
        $ionicLoading.show();
        let req = {
          mode: "deleteUser",
        };

        fachttp.model("checkLogin.php", req).then(
          function (response) {
            $ionicLoading.hide();

            if (response.data.status == true) {
              $state.go("app.farmerMenu");
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      }
      $scope.confirmDelete = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .textContent(
            "ต้องการลบบัญชีของคุณใช่หรือไม่ ? คุณจะไม่สามารถใช้งานแอปพลิเคชันได้อีกต่อไป"
          )
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน..ฉันต้องการลบบัญชี")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function (e) {
          if (e) {
            sendDelteUser();
          }
          console.log(e);
        });
      };
    }
  )

  .controller(
    "editpasswordCtrl",
    function (
      $scope,
      $ionicModal,
      $timeout,
      $http,
      $rootScope,
      $timeout,
      $state,
      $stateParams,
      $ionicHistory,
      $ionicActionSheet,
      $ionicLoading,
      $localStorage,
      fachttp
    ) {
      let vm = this;
      console.log("ss");
      $scope.model = {
        olduser_pass: null,
        user_pass: null,
        user_repass: null,
      };

      $scope.checkPass = function () {
        if (
          $scope.model.user_pass != $scope.model.user_repass ||
          !$scope.model.user_pass ||
          !$scope.model.user_repass
        ) {
          return false;
        } else {
          return true;
        }
      };

      vm.confirm = function () {
        let passchech = $scope.checkPass();
        if (passchech) {
          let req = {
            mode: "editpassword",
            value: $scope.model,
          };
          fachttp.model("appsetting.php", req).then(
            function (response) {
              if (response.data.status == true) {
                mobiscroll.alert({
                  title: "แจ้งเตือน",
                  message: "เปลี่ยน Password เรียบร้อย",
                  callback: function () {
                    $state.go("app.appsetting");
                  },
                });
              } else {
                mobiscroll.alert({
                  title: "แจ้งเตือน",
                  message: "รหัสผ่านไม่ถูกต้อง ตรวจสอบรหัสผ่านอีกครั้ง",
                  callback: function () {},
                });
              }
              console.log(response);
            },
            function err(err) {}
          );
        } else {
        }
      };
    }
  );
