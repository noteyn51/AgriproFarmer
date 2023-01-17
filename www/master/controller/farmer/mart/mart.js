angular
  .module("app")
  .controller(
    "martCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      fachttp
    ) {
      let vm = this;

      $scope.shouldHide = function () {
        // //console.log($state.current.name)
        switch ($state.current.name) {
          case "mart.edit":
            return true;
          case "mart.hist":
            return true;
          case "mart.shipping":
            return true;
          case "mart.shippingDetail":
            return true;
          case "mart.rfq1":
            return true;
          case "mart.rfqOrderDetail":
            return true;
          default:
            return false;
        }
      };

      vm.rfq = function () {
        document.getElementsByClassName("tab-nav tabs")[0].scrollLeft = 0;

        //console.log(document.getElementsByClassName("tab-nav tabs"))
        $state.go("mart.rfq");
      };
      vm.rfqOrder = function () {
        document.getElementsByClassName("tab-nav tabs")[0].scrollLeft = 100;

        //console.log(document.getElementsByClassName("tab-nav tabs"))
        $state.go("mart.rfqOrder");
      };

      vm.dash = function () {
        document.getElementsByClassName("tab-nav tabs")[0].scrollLeft = 100;
        $state.go("mart.dash");
      };

      vm.booked = function () {
        document.getElementsByClassName("tab-nav tabs")[0].scrollLeft = 300;
        $state.go("mart.booked");
      };

      vm.inv = function () {
        document.getElementsByClassName("tab-nav tabs")[0].scrollLeft = 600;

        $state.go("mart.inv");
      };

      vm.ship = function () {
        document.getElementsByClassName("tab-nav tabs")[0].scrollLeft = 600;

        //console.log(document.getElementsByClassName("tab-nav tabs"))
        $state.go("mart.ship");
      };

      vm.finish = function () {
        document.getElementsByClassName("tab-nav tabs")[0].scrollLeft = 800;

        //console.log(document.getElementsByClassName("tab-nav tabs"))
        $state.go("mart.finish");
      };

      function showList() {
        // $ionicLoading.show();
        let req = {
          mode: "martItemShip",
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            //console.log(response.data);
            $ionicLoading.hide();

            if (response.data.status == true) {
              vm.list = response.data;
              //console.log(vm.list);
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();
    }
  )

  .controller(
    "martLoginCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      $scope.model = {
        user_username: "",
        user_pass: "",
        user_repass: "",
        user_fname:
          $rootScope.global.mob_fname + " " + $rootScope.global.mob_lname,
        user_email: $rootScope.global.mob_email,
      };

      $scope.valid = { telValid: false, isTelChange: false };

      $scope.address = {
        user_title: $rootScope.global.mob_title,
        user_fname: $rootScope.global.mob_fname,
        user_lname: $rootScope.global.mob_lname,
        user_tel: $rootScope.global.mob_tel,
      };

      $ionicModal
        .fromTemplateUrl("modaRegister.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalRegister = modal;
        });

      $scope.openModalRegister = function () {
        $scope.modalRegister.show();
      };
      $scope.closeModalRegister = function () {
        $scope.modalRegister.hide();
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalRegister.remove();
      });

      $ionicModal
        .fromTemplateUrl("modalAddress.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalAddress = modal;
        });

      $scope.openModalAddress = function () {
        $scope.modalAddress.show();
      };
      $scope.closeModalAddress = function () {
        $scope.modalAddress.hide();
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalAddress.remove();
      });

      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      $scope.telChange = function () {
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if ($scope.model.user_tel.match(phoneno)) {
          $scope.valid.telValid = true;
          $scope.valid.isTelChange = true;
        } else {
          $scope.valid.telValid = false;
          $scope.valid.isTelChange = true;
        }
      };

      function onStart() {
        $ionicLoading.show();
        var req = {
          appID: $rootScope.global.mob_id,
          key: "checkRegis",
        };

        fachttp.mart("martlogin.php", req).then(
          function (response) {
            $timeout(function () {
              $ionicLoading.hide();
              $scope.martData = response.data.data;
              $scope.userType = response.data.type;
              $scope.userTypeSelected = $scope.userType[0];

              if (response.data.status === "PENDING") {
                alert(response.data.mess);
                $ionicHistory.clearCache().then(function () {
                  $state.go("app.farmerMenu");
                });
              } else if (response.data.status === true) {
                angular.merge($rootScope.global, { martdata: $scope.martData });

                console.log($rootScope.global);

                $state.go("mart.rfq");
              } else if (response.data.status === false) {
                $scope.openModalRegister();
              } else if (response.data.status === "ADDRESS") {
                vm.martid = response.data.data;
                province();
                $scope.openModalAddress();
              }
            }, 1000);

            console.log(response);
          },
          function (err) {
            console.log(err);
          }
        );
      }

      onStart();

      $scope.checkbox = {
        check1: true,
        check2: false,
      };

      $scope.checkPass = function () {
        if (
          $scope.model.user_pass != $scope.model.user_repass ||
          !$scope.model.user_pass ||
          !$scope.model.user_repass ||
          $scope.model.user_pass.length < 8 ||
          $scope.model.user_repass.length < 8
        ) {
          return false;
        } else {
          return true;
        }
      };

      $scope.checkEmail = function () {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(String($scope.model.user_email).toLowerCase());
      };

      $scope.confirm = function () {
        $scope.valid.isTelChange = true;
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // console.log(re.test(String($scope.model.user_email).toLowerCase()));

        if (
          $scope.model.user_username.length >= 6 &&
          $scope.model.user_pass &&
          $scope.model.user_repass &&
          $scope.checkPass() &&
          $scope.model.user_fname && 
          re.test(String($scope.model.user_email).toLowerCase()) &&
          $scope.userTypeSelected &&
          $scope.valid.telValid
        ) {
          $ionicLoading.show();
          console.log($scope.model);

          var req = {
            method: "POST",
            // url: "http://192.168.9.99/phpMart/Register.php",
            url: "http://203.154.158.79/agripro-mart/php/models/Signup/Signup.php",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              key: "Signup",
              item:{
                customer_type: $scope.userTypeSelected ,
                tel:$scope.model.user_tel,
                name: $scope.model.user_fname,
                email: $scope.model.user_email.toLowerCase(),
                username: $scope.model.user_username.toLowerCase(),
                password: $scope.model.user_pass,
                app: $rootScope.global.mob_id,
              }
             
            }),
          };

          $http(req).then(
            function (response) {
              $ionicLoading.hide();

              if (response.data.status == true) {
                onStart();
              } else {
                alert(response.data.msg);
              }
            },
            function (err) {
              $ionicLoading.hide();

              console.log(err);
            }
          );
        } else {
          alert(
            "ไม่สามารถลงทะเบียนได้กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนลงทะเบียน"
          );
        }
      };

      $scope.citizenId = function () {
        if ($scope.address.user_citizen_id) {
          let str = $scope.address.user_citizen_id;

          for (i = 0, sum = 0; i < 12; i++) {
            sum += parseFloat(str.charAt(i)) * (13 - i);
          }
          if ((11 - (sum % 11)) % 10 != parseFloat(str.charAt(12))) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      };

      $scope.check = {
        title() {
          if ($scope.address.user_title) {
            return true;
          } else {
            return false;
          }
        },
        fname() {
          if ($scope.address.user_fname) {
            return true;
          } else {
            return false;
          }
        },
        lname() {
          if ($scope.address.user_lname) {
            return true;
          } else {
            return false;
          }
        },
        tel() {
          if ($scope.address.user_tel) {
            return true;
          } else {
            return false;
          }
        },
        post() {
          if ($scope.address.user_post) {
            return true;
          } else {
            return false;
          }
        },
      };

      console.log($scope.check.fname());

      $scope.confirmAddress = function () {
        console.log($scope.check.title());
        console.log($scope.check.fname());
        console.log($scope.check.lname());
        console.log($scope.check.tel());
        console.log($scope.check.post());
        console.log($scope.citizenId());

        if (
          $scope.check.title() &&
          $scope.check.fname() &&
          $scope.check.lname() &&
          $scope.check.tel()  &&
          $scope.check.post() 
          // $scope.citizenId()
        ) {
          let req = {
            key: "confirmAddress",
            address: $scope.address,
            martid: vm.martid,
            pro: {
              province: vm.provinceSelect,
              aumphur: vm.aumphurSelect,
              tumbol: vm.tumbolSelect,
            },
          };

          fachttp.mart("martlogin.php", req).then(
            function (response) {
              // $ionicLoading.hide();
              console.log(response);

              if (response.data.status == true) {
                $scope.modalAddress.hide();
                $mdDialog.show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(false)
                    .title("แจ้งเตือน")
                    .textContent("ยินดีต้อนรับเข้าสู่ Agripro One")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                );

                onStart();
              } else {
                vm.list = response.data;
              }
            },
            function err(err) {
              // vm.list = response.data.result;

              $ionicLoading.hide();
            }
          );
        } else {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(false)
              .title("แจ้งเตือน")
              .textContent("ไม่สามารถบันทึกข้อมูลได้ ตรวจสอบข้อมูลอีกครั้ง")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };

      function province() {
        $ionicLoading.show();
        let url = $rootScope.ipregister + "register.php";
        let req = {
          mode: "province",
        };

        $http.post(url, req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.province = response.data.result;
              vm.provinceSelect = response.data.provinceSelect;
              vm.aumphur = response.data.aumphur;
              vm.aumphurSelect = response.data.aumphurSelect;
              vm.tumbol = response.data.tumbol;
              vm.tumbolSelect = response.data.tumbolSelect;
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
          },
          function err() {
            $ionicLoading.hide();
          }
        );
      }

      console.log("123");

      vm.provinceChange = function (e) {
        console.log(e);
        $ionicLoading.show();
        let url = $rootScope.ipregister + "register.php";
        let req = {
          mode: "AUMPHUR",
          data: e,
        };

        $http.post(url, req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.aumphur = response.data.result;
              vm.aumphurSelect = vm.aumphur[0];
              vm.aumphurChange(vm.aumphurSelect);
              // vm.tumbol =[];
              // delete vm.tumbolSelect

              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
          },
          function err() {
            $ionicLoading.hide();
          }
        );
      };

      vm.aumphurChange = function (e) {
        $ionicLoading.show();
        let url = $rootScope.ipregister + "register.php";
        let req = {
          mode: "tumbol",
          data: e,
        };

        $http.post(url, req).then(
          function (response) {
            console.log(response.data);
            if (response.data.status == true) {
              vm.tumbol = response.data.result;
              vm.tumbolSelect = vm.tumbol[0];
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
          },
          function err() {
            $ionicLoading.hide();
          }
        );
      };

      let platform = ionic.Platform.platform();

      vm.pickdate = function () {
        console.log(platform);
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.address.bd_date = data;
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
                    $scope.address.bd_date = $scope.datamodal.date;
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
    "rfqCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      $scope.openRfq1 = function (index) {
        console.log(index);
        $state.go("mart.rfq1", {
          id: vm.list.data[index].rfq_nbr,
          user_id: vm.list.data[index].rfq_user_id,
        });
      };

      function showList() {
        // $ionicLoading.show();
        let req = {
          key: "rfqmstr",
        };

        fachttp.mart("rfq.php", req).then(
          function (response) {
            // $ionicLoading.hide();
            console.log(response);

            if (response.data.status == true) {
              vm.list = response.data;
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            // vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();
    }
  )

  .controller(
    "rfq1Ctrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      $scope.model = {};
      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      console.log($stateParams);

      function showList() {
        // $ionicLoading.show();
        let req = {
          key: "rfqdet",
          data: $stateParams.id,
          userid: $stateParams.user_id,
        };

        fachttp.mart("rfq.php", req).then(
          function (response) {
            // $ionicLoading.hide();
            console.log(response);

            if (response.data.status == true) {
              vm.list = response.data;
              vm.data = vm.list.data;
              $scope.model.qty = vm.data.rfqd_quanity;
              $scope.model.price = vm.data.rfqd_price;

              console.log(vm.list);
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            // vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      $scope.rfqSubmit = function () {
        if ($scope.model.qty && $scope.model.price) {
          var confirm = $mdDialog
            .confirm()
            .title("แจ้งเตือน")
            .htmlContent(
              "<h5>ยืนยันการยื่นข้อเสนอ  " +
                vm.list.data.pt_desc1 +
                "</h5><div>จำนวน :  " +
                $scope.model.qty +
                "</div><div>ราคา :  " +
                $scope.model.price +
                "</div>"
            )
            // .textContent(
            //   "ยืนยันการยื่นข้อเสนอ " + vm.list.data.pt_desc1+"\nจำนวน "+$scope.model.qty+"ราคา "+$scope.model.price
            // )

            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(function (result) {
            if (result) {
              $ionicLoading.show();
              let req = {
                key: "rfqSubmit",
                rfq: vm.list.data,
                data: $scope.model,
              };

              fachttp.mart("rfq.php", req).then(
                function (response) {
                  $ionicLoading.hide();
                  console.log(response);

                  if (response.data.status == true) {
                    $state.go("mart.rfqOrder");
                  } else if (response.data.status == "REPEAT") {
                    $mdDialog.show(
                      $mdDialog
                        .alert()
                        .parent(
                          angular.element(
                            document.querySelector("#popupContainer")
                          )
                        )
                        .clickOutsideToClose(false)
                        .title("แจ้งเตือน")
                        .textContent(
                          "ไม่สามารถเสนอขายได้เนื่องจากมีรายการที่คุณเสนอไปแล้ว"
                        )
                        .ariaLabel("Alert Dialog Demo")
                        .ok("OK")
                        .targetEvent()
                    );
                  }
                },
                function err(err) {
                  $ionicLoading.hide();
                }
              );
            }
          });
        } else {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(false)
              .title("แจ้งเตือน")
              .textContent("กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนบันทึก")
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          );
        }
      };
    }
  )

  .controller(
    "rfqOrderCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      $scope.openRfq1 = function (index) {
        console.log(index);
        $state.go("mart.rfqOrderDetail", {
          id: vm.list.data[index].rfq_nbr,
          user_id: vm.list.data[index].rfq_user_id,
          line: vm.list.data[index].rfqdd_line,
        });
      };

      function showList() {
        // $ionicLoading.show();
        let req = {
          key: "rfqmstrOrder",
        };

        fachttp.mart("rfq.php", req).then(
          function (response) {
            // $ionicLoading.hide();
            console.log(response);

            if (response.data.status == true) {
              vm.list = response.data;
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            // vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();
    }
  )

  .controller(
    "rfqOrderDetailCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      $scope.model = {};
      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      console.log($stateParams);

      function showList() {
        // $ionicLoading.show();
        let req = {
          key: "rfqDetOrderDetail",
          data: $stateParams.id,
          userid: $stateParams.user_id,
          line: $stateParams.line,
        };

        fachttp.mart("rfq.php", req).then(
          function (response) {
            // $ionicLoading.hide();
            console.log(response);

            if (response.data.status == true) {
              vm.list = response.data;
              vm.data = vm.list.data;
              $scope.model.qty = vm.data.rfqdd_amount;
              $scope.model.price = vm.data.rfqdd_price;
              console.log(vm.list);
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            // vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      $scope.rfqSubmit = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .htmlContent(
            "<h5>ยืนยันการยื่นข้อเสนอ  " +
              vm.list.data.pt_desc1 +
              "</h5><div>จำนวน :  " +
              $scope.model.qty +
              "</div><div>ราคา :  " +
              $scope.model.price +
              "</div>"
          )
          // .textContent(
          //   "ยืนยันการยื่นข้อเสนอ " + vm.list.data.pt_desc1+"\nจำนวน "+$scope.model.qty+"ราคา "+$scope.model.price
          // )

          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function (result) {
          if (result) {
            $ionicLoading.show();
            let req = {
              key: "rfqSubmitEdit",
              rfq: vm.list.data,
              data: $scope.model,
            };

            fachttp.mart("rfq.php", req).then(
              function (response) {
                $ionicLoading.hide();
                console.log(response);

                if (response.data.status == true) {
                  $state.go("mart.rfqOrder");
                } else {
                }
              },
              function err(err) {
                $ionicLoading.hide();
              }
            );
          }
        });
      };

      $scope.rfqCancel = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .textContent("ยืนยันการยกเลิกข้อเสนอ " + vm.list.data.rfq_nbr)

          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(function (result) {
          if (result) {
            $ionicLoading.show();
            let req = {
              key: "rfqCancel",
              rfq: vm.list.data,
              data: $scope.model,
            };

            fachttp.mart("rfq.php", req).then(
              function (response) {
                $ionicLoading.hide();
                console.log(response);

                if (response.data.status == true) {
                  $state.go("mart.rfqOrder");
                } else {
                }
              },
              function err(err) {
                $ionicLoading.hide();
              }
            );
          }
        });
      };
    }
  )

  .controller(
    "martDashCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      $ionicModal
        .fromTemplateUrl("modalSetting.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalSetting = modal;
        });

      $scope.openModalSetting = function () {
        $scope.modalSetting.show();
      };
      $scope.closeModalSetting = function () {
        $scope.modalSetting.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalSetting.remove();
      });

      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      vm.addItem = function () {
        $scope.modalSetting.hide();
        $state.go("add.add1");
      };

      vm.shippingSet = function () {
        $scope.modalSetting.hide();
        $state.go("mart.shipping");
      };

      function showList() {
        // $ionicLoading.show();
        let req = {
          mode: "martItem",
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            // $ionicLoading.hide();

            if (response.data.status == true) {
              vm.list = response.data;
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      vm.edit = function (e) {
        let k = JSON.stringify(e);
        //console.log(e);
        $state.go("mart.edit", {
          ml_item: k,
        });
      };

      vm.del = function (e) {
        //console.log(e);
      };
    }
  )

  .controller(
    "martDashEditCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      vm.item = JSON.parse($stateParams.ml_item);

      vm.goBack = function () {
        $ionicHistory.goBack();
      };

      vm.clickDetail = function (e) {
        $ionicLoading.show();
        $timeout(function () {
          $ionicLoading.hide();
          $state.go("app.recordEtc1", {
            data: e.ml_lot_ref,
          });
        }, 300);
      };

      $scope.clientSideList = [
        {
          text: "ขาย",
          value: "SALE",
        },
        {
          text: "จอง",
          value: "BOOK",
        },
      ];

      $scope.model = {
        price: null,
        clientSide: "SALE",
      };
      $scope.openModalStatus = function () {
        $ionicModal
          .fromTemplateUrl("my-picstatus.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalStatus = modal;
            $scope.modalStatus.show();
          });
      };

      $scope.closeModalStatus = function () {
        $scope.modalStatus.hide();
        $scope.modalStatus.remove();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalStatus) {
          $scope.modalStatus.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      $scope.openModalUm = function () {
        $ionicModal
          .fromTemplateUrl("my-um.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalUm = modal;
            $scope.modalUm.show();
          });
      };

      $scope.closeModalUm = function () {
        $scope.modalUm.hide();
        $scope.modalUm.remove();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalUm) {
          $scope.modalUm.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      $("input.number").keyup(function (event) {
        // skip for arrow keys
        if (event.which >= 37 && event.which <= 40) return;

        // format number
        $(this).val(function (index, value) {
          return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
      });

      $scope.clientSideList = [
        {
          text: "ขาย",
          value: "SALE",
        },
        {
          text: "จอง",
          value: "BOOK",
        },
      ];

      $scope.um_mstr = [
        {
          value: "ลูก",
        },
        {
          value: "กิโลกรัม",
        },
      ];

      vm.confirm = function () {
        if ($scope.check()) {
          let req = {
            mode: "editItem",
            item: vm.item,
            total: $scope.total(),
          };

          fachttp.model("mart.php", req).then(
            function (response) {
              //console.log(response.data);
              if (response.data.status == true) {
                $ionicHistory.goBack();
              } else {
              }
            },
            function err(err) {
              Service.timeout();
            }
          );
        } else {
          mobiscroll.alert({
            title: "แจ้งเตือน",
            message: "ข้อมูลไม่ครบ ตรวจสอบข้อมูลให้ครบถ้วนก่อนบันทึก",
            callback: function () {},
          });
        }
      };

      vm.delitem = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน !!!")
          .textContent("ต้องการลบรายการนี้ออกจาก Mart หรือไม่ ?")
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            //console.log("del");
            let req = {
              mode: "delItem",
              item: vm.item,
            };

            fachttp.model("mart.php", req).then(
              function (response) {
                //console.log(response.data);
                if (response.data.status == true) {
                  $ionicHistory.goBack();
                } else {
                }
              },
              function err(err) {}
            );
          },
          function () {
            //console.log("cancel");
          }
        );
      };

      $scope.check = function () {
        //console.log(vm.item.ml_price)
        //console.log(vm.item.ml_wt)

        if (
          vm.item.ml_price != null &&
          vm.item.ml_price > 0 &&
          vm.item.ml_wt != 0 &&
          vm.item.ml_wt != null
        ) {
          return true;
        } else {
          return false;
        }
      };

      $scope.total = function () {
        //console.log(vm.item)
        if (vm.item.ml_unit_price == "กิโลกรัม") {
          return vm.item.ml_wt * vm.item.ml_price_unit;
        } else {
          return vm.item.ml_price_unit;
        }
      };
    }
  )

  .controller(
    "martBookedCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      vm.hist = function () {
        $state.go("mart.hist");
      };

      function showList() {
        // $ionicLoading.show();
        let req = {
          mode: "martItemBooked",
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            // $ionicLoading.hide();

            if (response.data.status == true) {
              vm.list = response.data;
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      $scope.openModalDetail = function (e) {
        //console.log("ss");
        $ionicModal
          .fromTemplateUrl("my-detail.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalDetail = modal;
            vm.detail = e;
            $scope.modalDetail.show();
          });
      };

      $scope.closeModalDetail = function () {
        $scope.modalDetail.hide();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalDetail) {
          $scope.modalDetail.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      $scope.getTotal = function () {
        var total = 0;
        for (var i = 0; i < vm.detail.detail.length; i++) {
          var product = vm.detail.detail[i];
          total += product.ml_price * 1;
        }
        return total;
      };
    }
  )

  .controller(
    "martInvCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      vm.hist = function () {
        $state.go("mart.hist");
      };

      function showList() {
        // $ionicLoading.show();
        let req = {
          mode: "martItemInv",
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            // $ionicLoading.hide();

            if (response.data.status == true) {
              vm.list = response.data;
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      $scope.openModalDetail = function (e) {
        //console.log("ss");
        $ionicModal
          .fromTemplateUrl("my-detail.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalDetail = modal;
            vm.detail = e;
            //console.log(vm.detail)
            $scope.modalDetail.show();
          });
      };

      $scope.closeModalDetail = function () {
        $scope.modalDetail.hide();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalDetail) {
          $scope.modalDetail.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      $scope.getTotal = function () {
        var total = {
          totalitem: 0,
          totalall: 0,
        };

        for (var i = 0; i < vm.detail.detail.length; i++) {
          var product = vm.detail.detail[i];
          total.totalitem += product.ml_price * 1;
        }
        total.totalall = total.totalitem + parseInt(vm.detail.mid_ship_prc);
        return total;
      };

      vm.clickDetail = function (e) {
        $scope.modalDetail.hide();
        $ionicLoading.show();
        $timeout(function () {
          $ionicLoading.hide();

          $state.go("app.recordEtc1", {
            data: e.ml_lot_ref,
          });
        }, 300);
      };

      vm.approve = function () {
        $ionicLoading.show();
        let req = {
          mode: "approveShip",
          value: vm.detail,
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            $ionicLoading.hide();
            //console.log(response.data)
            if (response.data.status == true) {
              $ionicScrollDelegate.resize();
            } else {
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.reject = function () {
        //console.log('reject')
      };
    }
  )

  .controller(
    "martShipCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      vm.hist = function () {
        $state.go("mart.hist");
      };

      function showList() {
        // $ionicLoading.show();
        let req = {
          mode: "martItemShip",
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            // $ionicLoading.hide();

            if (response.data.status == true) {
              vm.list = response.data;
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      $scope.openModalDetail = function (e) {
        //console.log("ss");
        $ionicModal
          .fromTemplateUrl("my-detail.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalDetail = modal;
            vm.detail = e;
            //console.log(vm.detail)
            $scope.modalDetail.show();
          });
      };

      $scope.closeModalDetail = function () {
        $scope.modalDetail.hide();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalDetail) {
          $scope.modalDetail.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      $scope.getTotal = function () {
        var total = {
          totalitem: 0,
          totalall: 0,
        };

        for (var i = 0; i < vm.detail.detail.length; i++) {
          var product = vm.detail.detail[i];
          total.totalitem += product.ml_price * 1;
        }
        total.totalall = total.totalitem + parseInt(vm.detail.mid_ship_prc);
        return total;
      };

      vm.clickDetail = function (e) {
        $scope.modalDetail.hide();
        $ionicLoading.show();
        $timeout(function () {
          $ionicLoading.hide();

          $state.go("app.recordEtc1", {
            data: e.ml_lot_ref,
          });
        }, 300);
      };

      vm.approve = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน !!!")
          .textContent(
            "ยืนยันการจัดส่งสินค้านี้ ? เมื่อกดยืนยันแล้วจะไม่สามารถแก้ไขรายการใดๆได้ทั้งสิ้น..."
          )
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");
        $mdDialog.show(confirm).then(
          function () {
            $ionicLoading.show();
            let req = {
              mode: "approveShip",
              value: vm.detail,
            };

            fachttp.model("mart.php", req).then(
              function (response) {
                $ionicLoading.hide();
                //console.log(response.data)
                if (response.data.status == true) {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message: "บันทึกข้อมูลเรียบร้อยแล้ว",
                    callback: function () {
                      $scope.modalDetail.hide();
                      showList();
                    },
                  });
                  $ionicScrollDelegate.resize();
                } else {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message: "ไม่สามารถบันทึกได้ลองใหม่อีกครั้ง",
                    callback: function () {},
                  });
                }
              },
              function err(err) {
                $ionicLoading.hide();
              }
            );
          },
          function () {}
        );
      };
    }
  )

  .controller(
    "martFinishCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      vm.hist = function () {
        $state.go("mart.hist");
      };

      function showList() {
        // $ionicLoading.show();
        let req = {
          mode: "martItemFinish",
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            // $ionicLoading.hide();

            if (response.data.status == true) {
              vm.list = response.data;
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      $scope.openModalDetail = function (e) {
        //console.log("ss");
        $ionicModal
          .fromTemplateUrl("my-detail.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalDetail = modal;
            vm.detail = e;
            //console.log(vm.detail)
            $scope.modalDetail.show();
          });
      };

      $scope.closeModalDetail = function () {
        $scope.modalDetail.hide();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalDetail) {
          $scope.modalDetail.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      $scope.getTotal = function () {
        var total = {
          totalitem: 0,
          totalall: 0,
        };

        for (var i = 0; i < vm.detail.detail.length; i++) {
          var product = vm.detail.detail[i];
          total.totalitem += product.ml_price * 1;
        }
        total.totalall = total.totalitem + parseInt(vm.detail.mid_ship_prc);
        return total;
      };

      vm.clickDetail = function (e) {
        $scope.modalDetail.hide();
        $ionicLoading.show();
        $timeout(function () {
          $ionicLoading.hide();

          $state.go("app.recordEtc1", {
            data: e.ml_lot_ref,
          });
        }, 300);
      };

      vm.approve = function () {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน !!!")
          .textContent(
            "ยืนยันการจัดส่งสินค้านี้ ? เมื่อกดยืนยันแล้วจะไม่สามารถแก้ไขรายการใดๆได้ทั้งสิ้น..."
          )
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");
        $mdDialog.show(confirm).then(
          function () {
            $ionicLoading.show();
            let req = {
              mode: "approveShip",
              value: vm.detail,
            };

            fachttp.model("mart.php", req).then(
              function (response) {
                $ionicLoading.hide();
                //console.log(response.data)
                if (response.data.status == true) {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message: "บันทึกข้อมูลเรียบร้อยแล้ว",
                    callback: function () {
                      $scope.modalDetail.hide();
                      showList();
                    },
                  });
                  $ionicScrollDelegate.resize();
                } else {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message: "ไม่สามารถบันทึกได้ลองใหม่อีกครั้ง",
                    callback: function () {},
                  });
                }
              },
              function err(err) {
                $ionicLoading.hide();
              }
            );
          },
          function () {}
        );
      };
    }
  )

  .controller(
    "addnevCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      fachttp
    ) {
      let vm = this;
    }
  )

  .controller(
    "martAdd1Ctrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;
      var numrow1 = 0;
      var numrow2 = 10;

      function showList() {
        delete vm.list;
        numrow1 = 0;
        numrow2 = 10;
        $ionicLoading.show();
        let req = {
          mode: "onStarts",
          user: $rootScope.global,
          numrow1: numrow1,
          numrow2: numrow2,
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            $ionicLoading.hide();

            if (response.data.status == true) {
              $scope.modalItem.show();
              vm.list = response.data;
              $ionicScrollDelegate.resize();

              //console.log(vm.list);
              numrow1 += 10;
              numrow2 += 10;
            } else {
              vm.list = response.data.result;
              $mdDialog
                .show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("แจ้งเตือน")
                    .textContent("ไม่พบรายการเพาะปลูก")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                )
                .then(
                  function (answer) {},
                  function () {}
                );
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      $scope.showMore = function () {
        $ionicLoading.show();
        //console.log(numrow1);
        //console.log(numrow2);

        let req = {
          mode: "onStarts",
          user: $rootScope.global,
          numrow1: numrow1,
          numrow2: numrow2,
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            $ionicLoading.hide();
            //console.log(response.data);

            if (response.data.status == true) {
              numrow1 += 10;
              numrow2 += 10;
              for (let i = 0; i < response.data.result.length; i++) {
                vm.list.result.push(response.data.result[i]);
              }
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              $mdDialog
                .show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("แจ้งเตือน")
                    .textContent("ไม่พบรายการเพาะปลูก")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                )
                .then(
                  function (answer) {},
                  function () {}
                );
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      $scope.openModalItem = function () {
        $ionicModal
          .fromTemplateUrl("my-item.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalItem = modal;

            showList();
          });
      };

      $scope.closeModalItem = function () {
        $scope.modalItem.hide();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalItem) {
          $scope.modalItem.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      // $scope.choice = {id:'SALE',desc:'ขาย'};
      // $scope.statuslist = [{id:'SALE',desc:'ขาย'},{id:'BOOK',desc:'จอง'}]

      $scope.clientSideList = [
        {
          text: "ขาย",
          value: "SALE",
        },
        {
          text: "จอง",
          value: "BOOK",
        },
      ];

      $scope.um_mstr = [
        {
          value: "ลูก",
        },
        {
          value: "กิโลกรัม",
        },
      ];

      $scope.model = {
        price: null,
        clientSide: "SALE",
        um: "กิโลกรัม",
        wt: 0,
        total: function () {
          //console.log($scope.model.um)
          if ($scope.model.um == "กิโลกรัม") {
            return $scope.model.wt * $scope.model.price;
          } else {
            return $scope.model.price;
          }
        },
      };

      vm.statusChange = function () {
        //console.log($scope.choice);
      };

      $scope.openModalStatus = function () {
        $ionicModal
          .fromTemplateUrl("my-picstatus.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalStatus = modal;
            $scope.modalStatus.show();
          });
      };

      $scope.closeModalStatus = function () {
        $scope.modalStatus.hide();
        $scope.modalStatus.remove();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalStatus) {
          $scope.modalStatus.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      $scope.openModalUm = function () {
        $ionicModal
          .fromTemplateUrl("my-um.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalUm = modal;
            $scope.modalUm.show();
          });
      };

      $scope.closeModalUm = function () {
        $scope.modalUm.hide();
        $scope.modalUm.remove();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalUm) {
          $scope.modalUm.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      vm.goBack = function () {
        $state.go("mart.dash");
      };

      vm.item = [];
      vm.itemIndex = [];

      vm.add = function (e) {
        if (vm.itemIndex.includes(e.ld_lot)) {
          //console.log("=");
          Service.toast("รายการนี้ถูกเพิ่มไปแล้ว", "danger", "bottom");
        } else {
          //console.log("!=");
          vm.item.push(e);
          vm.itemIndex.push(e.ld_lot);
          Service.toast(
            "เพิ่มรายการ รวม " + vm.item.length + " รายการ",
            "info",
            "bottom"
          );
        }
      };

      vm.delete = function (i, e) {
        vm.itemIndex.splice(i, 1);
        vm.item.splice(i, 1);
      };

      vm.addItemtoMart = function () {
        if ($scope.check()) {
          //console.log($scope.model.total())
          var confirm = $mdDialog
            .confirm()
            .title("แจ้งเตือน !!!")
            .textContent(
              "ต้องการเพิ่ม " + vm.item.length + " รายการไปยัง AgriproMart ?"
            )
            .ariaLabel("Lucky day")
            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(
            function () {
              let req = {
                mode: "addItem",
                model: $scope.model,
                item: vm.item,
                total: $scope.model.total(),
              };
              fachttp.model("mart.php", req).then(
                function (response) {
                  $ionicLoading.hide();

                  //console.log(response.data);
                  if (response.data.status == true) {
                    mobiscroll.alert({
                      title: "แจ้งเตือน",
                      message: "เพิ่มรายการลง AgriPro Mart แล้ว",
                      callback: function () {
                        $scope.model = {
                          price: null,
                          clientSide: "SALE",
                          um: "กิโลกรัม",
                          wt: 0,
                          total: function () {
                            //console.log($scope.model.um)
                            if ($scope.model.um == "กิโลกรัม") {
                              return $scope.model.wt * $scope.model.price;
                            } else if ($scope.model.um == "ลูก") {
                              return $scope.model.price;
                            }
                          },
                        };

                        vm.item = [];
                        vm.itemIndex = [];
                        $ionicHistory.clearCache().then(function () {
                          $ionicHistory.clearHistory();
                          $timeout(function () {
                            $state.go("mart.dash");
                          }, 500);
                        });
                      },
                    });
                  } else {
                    mobiscroll.alert({
                      title: "แจ้งเตือน",
                      message: "ไม่สามารถเพิ่มรายการได้ลองใหม่อีกครั้ง",
                      callback: function () {},
                    });
                  }
                },
                function err(err) {
                  mobiscroll.alert({
                    title: "แจ้งเตือน",
                    message: "ไม่สามารถเพิ่มรายการได้ลองใหม่อีกครั้ง",
                    callback: function () {},
                  });
                  $ionicLoading.hide();
                }
              );
            },
            function () {}
          );
        } else {
          mobiscroll.alert({
            title: "แจ้งเตือน",
            message: "ข้อมูลไม่ถูกต้องกรุณากรอกรายละเอียดให้ครบถ้วน",
            callback: function () {},
          });
        }
      };

      vm.godetail = function (e) {
        $state.go("app.recordEtc1", {
          data: e,
        });
      };

      $scope.check = function () {
        if (
          $scope.model.price != null &&
          $scope.model.price > 0 &&
          vm.item.length > 0 &&
          $scope.model.wt != 0 &&
          $scope.model.wt != null
        ) {
          return true;
        } else {
          return false;
        }
      };

      $("input.number").keyup(function (event) {
        // skip for arrow keys
        if (event.which >= 37 && event.which <= 40) return;

        // format number
        $(this).val(function (index, value) {
          return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
      });
    }
  )

  .controller(
    "martHistCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp
    ) {
      let vm = this;

      vm.goBack = function () {
        $ionicHistory.clearCache().then(function () {
          $state.go("app.farmerMenu");
        });
      };

      vm.hist = function () {
        $state.go("mart.hist");
      };

      function showList() {
        $ionicLoading.show();
        let req = {
          mode: "martItemBooked",
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            $ionicLoading.hide();

            if (response.data.status == true) {
              vm.list = response.data;
              //console.log(vm.list);
              $ionicScrollDelegate.resize();
            } else {
              vm.list = response.data;
            }
          },
          function err(err) {
            vm.list = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      $scope.openModalDetail = function (e) {
        //console.log("ss");
        $ionicModal
          .fromTemplateUrl("my-detail.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalDetail = modal;
            vm.detail = e;
            $scope.modalDetail.show();
          });
      };

      $scope.closeModalDetail = function () {
        $scope.modalDetail.hide();
      };

      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        if ($scope.modalDetail) {
          $scope.modalDetail.remove();
          //console.log("remove");
        } else {
          //console.log("notremove");
        }
      });

      $scope.getTotal = function () {
        var total = 0;
        for (var i = 0; i < vm.detail.detail.length; i++) {
          var product = vm.detail.detail[i];
          total += product.ml_price * 1;
        }
        return total;
      };
    }
  )

  .controller(
    "shippingCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp,
      $ionicScrollDelegate
    ) {
      let vm = this;

      function showList() {
        // $ionicLoading.show();
        let req = {
          mode: "shipingAll",
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            $ionicLoading.hide();

            if (response.data.status == true) {
              vm.shipList = response.data;
              //console.log(vm.shipList);
            } else {
              vm.shipList = response.data;
            }
          },
          function err(err) {
            vm.shipList = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      $scope.showitem = [false, false];

      $scope.shippinglist = [
        {
          shipname: "Kerry Express",
          showitem: false,
          type: [
            {
              typename: "ส่งด่วน",
              rate: [
                {
                  kg: 2,
                  price: 55,
                },
                {
                  kg: 7,
                  price: 90,
                },
                {
                  kg: 10,
                  price: 100,
                },
                {
                  kg: 15,
                  price: 145,
                },
                {
                  kg: 20,
                  price: 330,
                },
                {
                  kg: 25,
                  price: 420,
                },
              ],
            },
          ],
        },
        {
          shipname: "Thailand Post",
          showitem: false,
          type: [
            {
              typename: "ส่งด่วน",
              rate: [
                {
                  kg: 2,
                  price: 55,
                },
                {
                  kg: 7,
                  price: 90,
                },
                {
                  kg: 10,
                  price: 100,
                },
                {
                  kg: 15,
                  price: 145,
                },
                {
                  kg: 20,
                  price: 330,
                },
                {
                  kg: 25,
                  price: 420,
                },
              ],
            },
            {
              typename: "ส่งแบบลงทะเบียน",
              rate: [
                {
                  kg: 2,
                  price: 55,
                },
                {
                  kg: 7,
                  price: 90,
                },
                {
                  kg: 10,
                  price: 100,
                },
                {
                  kg: 15,
                  price: 145,
                },
                {
                  kg: 20,
                  price: 330,
                },
                {
                  kg: 25,
                  price: 420,
                },
              ],
            },
          ],
        },
      ];

      //console.log($scope.shippinglist);

      vm.chngeShow = function (e, i) {
        let k = JSON.stringify(e);
        $state.go("mart.shippingDetail", {
          id: k,
        });

        // $scope.shippinglist[i].showitem = !$scope.shippinglist[i].showitem
        // $scope.showitem[i] = !$scope.showitem[i];
        $ionicScrollDelegate.resize();
      };
    }
  )

  .controller(
    "shippingDetailCtrl",
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
      $q,
      $ionicSlideBoxDelegate,
      $ionicScrollDelegate,
      fachttp,
      $ionicScrollDelegate
    ) {
      let vm = this;
      vm.shipID = JSON.parse($stateParams.id);
      //console.log(vm.shipID)

      function showList() {
        // $ionicLoading.show();
        let req = {
          mode: "shipSetting",
          ship: vm.shipID,
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            $ionicLoading.hide();

            if (response.data.status == true) {
              vm.shipListSetting = response.data;

              //console.log(vm.shipListSetting);
            } else {
              vm.shipListSetting = response.data;
            }
          },
          function err(err) {
            vm.shipListSetting = response.data.result;

            $ionicLoading.hide();
          }
        );
      }

      showList();

      vm.change = function () {
        //console.log(vm.shipListSetting.result)
        let req = {
          mode: "changeStatus",
          status: vm.shipListSetting.result,
        };

        fachttp.model("mart.php", req).then(
          function (response) {
            $ionicLoading.hide();

            if (response.data.status == true) {
            } else {
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      // $scope.showitem = [false, false];

      // $scope.shippinglist = [
      //   {
      //     shipname: "Kerry Express",
      //     showitem: false,
      //     type: [
      //       {
      //         typename: "ส่งด่วน",
      //         rate: [
      //           { kg: 2, price: 55 },
      //           { kg: 7, price: 90 },
      //           { kg: 10, price: 100 },
      //           { kg: 15, price: 145 },
      //           { kg: 20, price: 330 },
      //           { kg: 25, price: 420 },
      //         ],
      //       },
      //     ],
      //   },
      //   {
      //     shipname: "Thailand Post",
      //     showitem: false,
      //     type: [
      //       {
      //         typename: "ส่งด่วน",
      //         rate: [
      //           { kg: 2, price: 55 },
      //           { kg: 7, price: 90 },
      //           { kg: 10, price: 100 },
      //           { kg: 15, price: 145 },
      //           { kg: 20, price: 330 },
      //           { kg: 25, price: 420 },
      //         ],
      //       },
      //       {
      //         typename: "ส่งแบบลงทะเบียน",
      //         rate: [
      //           { kg: 2, price: 55 },
      //           { kg: 7, price: 90 },
      //           { kg: 10, price: 100 },
      //           { kg: 15, price: 145 },
      //           { kg: 20, price: 330 },
      //           { kg: 25, price: 420 },
      //         ],
      //       },
      //     ],
      //   },
      // ];

      // $scope.shippingDetail = $scope.shippinglist[$stateParams.id]
      // //console.log($scope.shippingDetail)

      // //console.log($scope.shippinglist);

      // vm.chngeShow = function (e, i) {
      //   $scope.shippinglist[i].showitem = !$scope.shippinglist[i].showitem
      //   // $scope.showitem[i] = !$scope.showitem[i];
      //   $ionicScrollDelegate.resize()
      // }
    }
  );
