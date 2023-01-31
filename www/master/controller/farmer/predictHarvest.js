 angular
   .module("app")
   .controller("predictHarvestCtrl", function (
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
     $scope.myDate = new Date();
     $scope.isOpen = false;

     $scope.dChange = function(){
       console.log($scope.myDate)
     }




     vm.pic_desc;
     $scope.modelpredict = {
       rai: null,
       result: null,
       remark: null,
       diffdays: null
     };
     //modal
     {
       $ionicModal
         .fromTemplateUrl("list_map.html", {
           scope: $scope,
           animation: "slide-in-up"
         })
         .then(function (modal) {
           $scope.modalListmap = modal;
         });

       $scope.openModalListmap = function () {
         $scope.modalListmap.show();
       };
       $scope.closeModalListmap = function () {
         $scope.modalListmap.hide();
       };
       // Cleanup the modal when we're done with it!
       $scope.$on("$destroy", function () {
         $scope.modalListmap.remove();
       });

       $ionicModal
         .fromTemplateUrl("list_Crop.html", {
           scope: $scope,
           animation: "slide-in-up"
         })
         .then(function (modal) {
           $scope.modalListcrop = modal;
         });

       $scope.openModalListcrop = function () {
         let req = {
           mode: "selectCrop"
         };
         fachttp.model("predictPlant.php", req).then(
           function suscess(response) {
             $scope.dataCropwo = response.data.resultCrop;

           },
           function err(err) {


           })
         $scope.modalListcrop.show();
       };
       $scope.closeModalListcrop = function () {
         $scope.modalListcrop.hide();
       };
       // Cleanup the modal when we're done with it!
       $scope.$on("$destroy", function () {
         $scope.modalListcrop.remove();
       });


       $ionicModal
         .fromTemplateUrl("list_wo.html", {
           scope: $scope,
           animation: "slide-in-up"
         })
         .then(function (modal) {
           $scope.modalListWo = modal;
         });

       $scope.openModalListWo = function () {
         let req = {
           mode: "womstr"
         };
         fachttp.model("predictPlant.php", req).then(
           function suscess(response) {
             $scope.datawo = response.data.result;

           },
           function err(err) {


           })
         $scope.modalListWo.show();
       };
       $scope.closeModalListWo = function () {
         $scope.modalListWo.hide();
       };
       // Cleanup the modal when we're done with it!
       $scope.$on("$destroy", function () {
         $scope.modalListWo.remove();
       });

       $ionicModal
         .fromTemplateUrl("data_predict.html", {
           scope: $scope,
           animation: "slide-in-up"
         })
         .then(function (modal) {
           $scope.modaldatapredict = modal;
         });

       $scope.openModaldataPredict = function () {
         $scope.modelpredict = {
           rai: null,
           result: null,
           datestart: null,
           countdate: null,
           remark: null
         };
         $scope.modaldatapredict.show();
       };
       $scope.closeModaldataPredict = function () {
         $scope.modaldatapredict.hide();
       };
       // Cleanup the modal when we're done with it!
       $scope.$on("$destroy", function () {
         $scope.modaldatapredict.remove();
       });

       $ionicModal
         .fromTemplateUrl("edit_predict.html", {
           scope: $scope,
           animation: "slide-in-up"
         })
         .then(function (modal) {
           $scope.modaleditpredict = modal;
         });

       $scope.openModalEditPredict = function (e) {
         $scope.modaleditpredict.show();
       };
       $scope.closeModalEditPredict = function () {
         $scope.modaleditpredict.hide();
       };
       // Cleanup the modal when we're done with it!
       $scope.$on("$destroy", function () {
         $scope.modaleditpredict.remove();
       });
     }

     $scope.selectID = function (e) {
       $scope.woSelected = e;
       //console.log(e)
       $scope.closeModalListWo();
     }

     var date_diff_indays = function (date2, date1) {
       dt1 = new Date(date1);
       dt2 = new Date(date2);
       return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
     }
     //console.log(date_diff_indays('2020-02-01', '2020-01-01'));
     // //console.log(date_diff_indays('12/02/2014', '11/04/2014'));


     vm.save = function (e) {
       if (
         $scope.model.date1 &&
         $scope.model.date2 &&
         $scope.subDetail &&
         $scope.datapredict.length > 0
       ) {
         //console.log($scope.model);
         //console.log($scope.datapredict);
         //console.log($scope.subDetail);
       }
     };



     $scope.model = {
       date1: null,
       date2: null,
       sendMeetQ: false,
       sendMeetF: false,
       time: null,
       startdate:{AD:null,BE:null}
     };


     let platform = ionic.Platform.platform();





     vm.pickdate1 = function (e) {
       if (platform == "android" || platform == "ios") {
         document.addEventListener("deviceready", function () {
           let k = Service.pickdate();
           k.then(function suss(data) {
             $scope.model.date1 = data;
             return;
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
           buttons: [{
               text: "Cancel"
             },
             {
               text: "<b>Save</b>",
               type: "button-positive",
               onTap: function (e) {
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

         myPopup.then(function (data) {
           $scope.model.date1 = data;
           //console.log($scope.model.date1);
           return;
         });
       }
     };

     //  $scope.model.date2

     $scope.$watch(function () {
       return $scope.model.date2;
     }, function (newData, oldData) {

       if ($scope.model.date2) {

         let split = $scope.model.date2.split("-");
         //console.log(split)
         let month = [
           'มกราคม',
           "กุมภาพันธ์",
           "มีนาคม",
           "เมษายน",
           "พฤษภาคม",
           "มิถุนายน",
           "กรกฎาคม",
           "สิงหาคม",
           "กันยายน",
           "ตุลาคม",
           "พฤศจิกายน",
           "ธันวาคม"
         ]

         let y = parseInt(split[0]) + 543;
         let m = month[parseInt(split[1]) - 1];
         let d = parseInt(split[2]);
         $scope.showDate = d + ' ' + m + ' ' + y


         $scope.modelpredict.diffdays = date_diff_indays($scope.model.date2, $scope.woSelected.wo_ord_date)
         //console.log($scope.modelpredict)
       }

     });

     var monthArr = new Array();
     monthArr[0] = "มกราคม";
     monthArr[1] = "กุมภาพันธ์";
     monthArr[2] = "มีนาคม";
     monthArr[3] = "เมษายน";
     monthArr[4] = "พฤษภาคม";
     monthArr[5] = "มิถุนายน";
     monthArr[6] = "กรกฎาคม";
     monthArr[7] = "สิงหาคม";
     monthArr[8] = "กันยายน";
     monthArr[9] = "ตุลาคม";
     monthArr[10] = "พฤศจิกายน";
     monthArr[11] = "ธันวาคม";
 
     
 
 
     function startDate (){
       var d = new Date(),
       month = '' + (d.getMonth() + 1),
       day = '' + d.getDate(),
       year = d.getFullYear();
 
       monthAD = month;
     if (month.length < 2) 
         monthAD = '0' + month;
     if (day.length < 2) 
         day = '0' + day;
 
       $scope.model.startdate.date2 = [year, monthAD, day].join('-');
 
       monthBE = monthArr[month-1];
 
       $scope.model.startdate.BE = [day, monthBE, year+543].join(' ');
     }
 
     startDate ()
 
 
 
     $scope.mdDateChange = function(date,e){
       var d = new Date(date),
         month = '' + (d.getMonth() + 1),
         day = '' + d.getDate(),
         year = d.getFullYear();
 
         monthAD = month;
     if (month.length < 2) 
         monthAD = '0' + month;
     if (day.length < 2) 
         day = '0' + day;
 
      $scope.model.date2 = [year, monthAD, day].join('-');
       monthBE = monthArr[month-1];
       $scope.model.startdate.BE = [day, monthBE, year+543].join(' ');
     }

     vm.pickdate2 = function (e) {
       if (platform == "android" || platform == "ios") {
         document.addEventListener("deviceready", function () {
           let k = Service.pickdate();
           k.then(function suss(data) {
             $scope.model.date2 = data;
             return;
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
           buttons: [{
               text: "Cancel"
             },
             {
               text: "<b>Save</b>",
               type: "button-positive",
               onTap: function (e) {
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

         myPopup.then(function (data) {
           $scope.model.date2 = data;
           //console.log($scope.model.date1);
           return;
         });
       }
     };

     vm.picktime = function () {

       if (platform == "android" || platform == "ios") {
         document.addEventListener("deviceready", function () {
           let k = Service.picktime();
           k.then(function suss(data) {

             $scope.model.time = data.substring(0, 5);


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
           buttons: [{
               text: "Cancel"
             },
             {
               text: "<b>Save</b>",
               type: "button-positive",
               onTap: function (e) {
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

         myPopup.then(function (res) {
           if (res) {
             $scope.model.time = res;
           }
         });
       }
     };

     $scope.datapredict = [];

     vm.add = function () {
       if (
         $scope.modelpredict.rai &&
         $scope.modelpredict.result &&
         $scope.modelpredict.datestart &&
         $scope.modelpredict.countdate
       ) {
         $scope.datapredict.push($scope.modelpredict);
         //console.log($scope.modelpredict);
         $scope.closeModaldataPredict();
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
             .textContent("กรอกข้อมูลให้ครบถ้วน")
             .ariaLabel("Alert Dialog Demo")
             .ok("OK")
             .targetEvent()
           )
           .then(
             function (answer) {},
             function () {}
           );
       }
     };




     vm.confirm = function () {
       //console.log($scope.woSelected)
       //console.log($scope.model);
       //console.log($scope.modelpredict)
       if ($scope.model.date2 && $scope.modelpredict.rai && $scope.modelpredict.result) {
         var confirm = $mdDialog
           .confirm()
           .title("แจ้งเตือน !!!")
           .textContent(
             "ต้องการบันทึกคาดการณ์เก็บเกี่ยวนี้ ใช่หรือไม่ ?"
           )
           .ariaLabel("Lucky day")
           .targetEvent()
           .ok("ยืนยัน")
           .cancel("ยกเลิก");

         $mdDialog.show(confirm).then(
           function () {
         $ionicLoading.show();

             let req = {
               mode: "confirm",
               wo: $scope.woSelected,
               model: $scope.model,
               predict: $scope.modelpredict
             };

             fachttp.model("predictPlant.php", req).then(
               function suscess(response) {
              $ionicLoading.hide();

                  delete $scope.woSelected
                  $scope.model = {
                    date1: null,
                    date2: null,
                    sendMeetQ: false,
                    sendMeetF: false,
                    time: null

                  };
                  $scope.modelpredict = {
                    rai: null,
                    result: null,
                    remark: null,
                    diffdays: null
                  };
                  $ionicScrollDelegate.resize();
                 //console.log(response.data)
                 $mdDialog
                   .show(
                     $mdDialog
                     .alert()
                     .parent(
                       angular.element(document.querySelector("#popupContainer"))
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
                       
                     },
                     function () {

                     }
                   );

               },
               function err(err) {
                $ionicLoading.hide();
                 //console.log(err)
               })
           },
           function () {


           }
         );


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
             .textContent("กรอกข้อมูลให้ครบถ้วน")
             .ariaLabel("Alert Dialog Demo")
             .ok("OK")
             .targetEvent()
           )
           .then(
             function (answer) {},
             function () {}
           );
       }
     };

   })

   .controller("predictPlant2Ctrl", function (
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
     $ionicSlideBoxDelegate
   ) {
     let vm = this;
     $scope.list = JSON.parse($stateParams.list);
     $scope.model = {
       date: null,
       data: null
     };
     let platform = ionic.Platform.platform();
     vm.pickdate = function (e) {
       if (platform == "android" || platform == "ios") {
         document.addEventListener("deviceready", function () {
           let k = Service.pickdate();
           k.then(function suss(data) {
             $scope.model.date = data;
             return;
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
           buttons: [{
               text: "Cancel"
             },
             {
               text: "<b>Save</b>",
               type: "button-positive",
               onTap: function (e) {
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

         myPopup.then(function (data) {
           $scope.model.date = data;
           //console.log(e);
           return;
         });
       }
     };

     vm.confirm = function () {
       //console.log($scope.list);
       //console.log($scope.model);
     };
   });
