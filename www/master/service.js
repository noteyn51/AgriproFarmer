angular
  .module("app")

  .service("Service", function(
    $cordovaDatePicker,
    $ionicLoading,
    $q,
    $http,
    $rootScope,
    $state,
    $timeout,
    $mdDialog
  ) {
    this.toast = function(mes, col, dis) {
      mobiscroll.toast({
        message: mes,
        color: col,
        display: dis
      });
    };

    this.timeout = function() {
      mobiscroll.snackbar({
        message: "เกิดข้อผิดพลาดหมดเวลาในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง"
      });
    };

    this.customAlertDialog = function(title,message) {
      $mdDialog.show(
        $mdDialog
          .alert()
          .parent(
            angular.element(
              document.querySelector("#popupContainer")
            )
          )
          .clickOutsideToClose(true)
          .title(title)
          .textContent(
            message
          )
          .ariaLabel("Alert Dialog Demo")
          .ok("ยืนยัน")
          .targetEvent()
      );
    };

    // console.log($rootScope.global)

    this.loopService = function(callback) {
      // $ionicLoading.show();
      function checkuser() {
        //  console.log('looppppp')
        return new Promise(function(resolve, reject) {
          let user = {
            username: $rootScope.global.mob_username,
            password: $rootScope.global.mob_password
          };
          let url = $rootScope.iplogin + "login.php"; //'http://192.168.9.172/agriprophp/login.php'
          let req = {
            mode: "checkuser",
            value: user
          };
          $http.post(url, req).then(function suscess(response) {
            // console.log(response.data)
            this.usercheck = response.data;
            // console.log(this.usercheck)
            if (
              this.usercheck.status == "reject" ||
              this.usercheck.status == "pending" ||
              this.usercheck.status == "stop"
            ) {
              $state.go("app.out", { mess: usercheck.mess });
              clearInterval(loopcheckuser);
            }

            // $ionicLoading.hide();
          });
        });
      }

      checkuser();
      let loopcheckuser = setInterval(checkuser, 15000);
    };

    function convertdate(date, month, year) {
      let resmonth;
      switch (month) {
        case "Jan":
          resmonth = "01";
          break;
        case "Feb":
          resmonth = "02";

          break;
        case "Mar":
          resmonth = "03";
          break;
        case "Apr":
          resmonth = "04";
          break;
        case "May":
          resmonth = "05";
          break;
        case "Jun":
          resmonth = "06";
          break;
        case "Jul":
          resmonth = "07";
          break;
        case "Aug":
          resmonth = "08";
          break;
        case "Sep":
          resmonth = "09";
          break;
        case "Oct":
          resmonth = "10";
          break;
        case "Nov":
          resmonth = "11";
          break;
        case "Dec":
          resmonth = "12";
          break;
      }
      let y = parseInt(year) + 543;
      let fulldate = year + "-" + resmonth + "-" + date; // ปี ค.ศ. ใช้ year พ.ศ ใช้ y
      return fulldate;
    }

    this.pickdate = function() {
      let platform = ionic.Platform.platform();
      if (platform == "android") {
        var options = {
          androidTheme: 5,
          todayText: "วันนี้",
          is24Hour: true,
          date: new Date(),
          mode: "date", // or 'time'
          // minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: false,
          doneButtonLabel: "DONE",
          doneButtonColor: "#F2F3F4",
          cancelButtonLabel: "CANCEL",
          cancelButtonColor: "#000000",
          locale: "th_th"
        };
      } else {
        // ios;
        var options = {
          mode: "date", // or 'time'
          date: new Date(),
          todayText: "วันนี้",
          is24Hour: true, // or 'time'
          // minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: "ยืนยัน",
          doneButtonColor: "#000000",
          cancelButtonLabel: "CANCEL",
          cancelButtonColor: "#000000",
          popoverArrowDirection: "up",
          locale: "th_th"
        };
      }

      return (resdate = $cordovaDatePicker.show(options).then(function(date) {
        let r = date.toString();
        let res = r.split(" ");
        return (resdate = convertdate(res[2], res[1], res[3]));
      }));
    };

    this.picktime = function() {
      let platform = ionic.Platform.platform();

      if (platform == "android") {
        var options = {
          androidTheme: 5,
          todayText: "วันนี้",
          is24Hour: true,
          date: new Date(),
          mode: "time", // or 'time'
          // minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: false,
          doneButtonLabel: "DONE",
          doneButtonColor: "#F2F3F4",
          cancelButtonLabel: "CANCEL",
          cancelButtonColor: "#000000",
          locale: "th_th"
        };
      } else {
        var options = {
          mode: "time", // or 'time'
          date: new Date(),
          // todayText: "วันนี้",
          // is24Hour: true, // or 'time'
          // minDate: new Date() - 10000,
          allowOldDates: true,
          allowFutureDates: true,
          doneButtonLabel: "ยืนยัน",
          doneButtonColor: "#000000",
          cancelButtonLabel: "CANCEL",
          cancelButtonColor: "#000000",
          popoverArrowDirection: "up",
          locale: "th_th"
        };
      }

      return (resdate = $cordovaDatePicker.show(options).then(function(date) {
        let r = date.toString();
        let res = r.split(" ");
        // return (resdate = convertdate(res[2], res[1], res[3]));
        return res[4];
      }));

      //ios
      //   var options = {
      //   mode: 'date', // or 'time'
      //   date: new Date(),
      //   todayText :'วันนี้',
      //   is24Hour:true, // or 'time'
      //   minDate: new Date() - 10000,
      //   allowOdasdsadldDates: true,
      //   allowFutureDates: true,
      //   doneButtonLabel: 'ยืนยัน',
      //   doneButtonColor: '#000000',
      //   cancelButtonLabel: 'CANCEL',
      //   cancelButtonColor: '#000000',
      //   popoverArrowDirection :'up',
      //   locale :'en_th'
      // };
    };

   

    

    // this.loopOnesig = function(e) {
    //   function checkuser(e) {
    //     let url = $rootScope.ip + "onesig.php"; //'http://192.168.9.172/agriprophp/login.php'
    //     console.log(url);
    //     let req = {
    //       mode: "onesigGettag",
    //       value: e
    //     };
    //     $http.post(url, req).then(function suscess(response) {
    //       console.log(response.data);
    //       if (response.data == true) {
    //         for (let i = 0; i < response.data.result.length; i++) {
    //           document.addEventListener("deviceready", function() {
    //             window.plugins.OneSignal.sendTag(
    //               response.data.result[i].iot_id,
    //               response.data.result[i].iot_id
    //               // ส่ง Tag
    //             );
    //             console.log(response.data.result[i].iot_id);
    //           });
    //         }
    //       }
    //     });
    //   }
    //   checkuser(e);
    // };
  })


  .service("deviceService", function(
    $http,
    $ionicPopup,
    $rootScope,
    $cordovaGeolocation,
    $ionicLoading
  ) {
    this.checkGPS = function(callback) {
      document.addEventListener("deviceready", function() {
        cordova.plugins.diagnostic.isLocationEnabled(
          function(enabled) {
            if (enabled) {
              callback("GPS_ON");
            } else {
              callback("GPS_OFF");
            }
          },
          function(error) {
            console.log("The following error occurred: " + error);
          }
        );
      });
    };

    this.opengpsAndroid = function(callback) {
      cordova.plugins.locationAccuracy.request(
        function(success) {
          console.log("Successfully requested accuracy: " + success.message);
          // Return callback()
          callback("force_gps");
        },
        function(error) {
          console.log(
            "Accuracy request failed: error code=" +
              error.code +
              "; error message=" +
              error.message
          );
          callback("notforce_gps");
          if (
            error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED
          ) {
            // Return callback()
            callback("setting_gps");
          }
        },
        cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
      );
    };
  });
