angular
  .module("app")
  .controller("navAccountCtrl", function (
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

    $scope.shouldHide = function () {
      // //console.log($state.current.name);
      switch ($state.current.name) {
        case "account.saleDetail":
          return true;
        case "account.buyDetail":
          return true;
        case "account.saleAdd":
          return true;
        case "account.buyAdd":
          return true;
        default:
          return false;
      }
    };

    $scope.sale = function () {
      $state.go("account.sale");
    };

    $scope.buy = function () {
      $state.go("account.buy");
    };

    $scope.total = function () {
      $state.go("account.total");
    };


  })

  .controller("accountSaleCtrl", function (
    $http,
    $ionicLoading,
    $timeout,
    $scope,
    $state,
    $rootScope,
    $localStorage,
    $ionicHistory,
    Service,
    $ionicSlideBoxDelegate,
    fachttp,
    $ionicModal
  ) {
    let vm = this;

    function onStart() {
      $ionicLoading.show();
      let req = {
        mode: "selectSaleOrder",
      };

      fachttp.model("account.php", req).then(
        function (response) {
          //console.log(response.data)
          if (response.data.status == true) {
            vm.list = response.data.result;
            vm.totoalSale = response.data.total;
            vm.month_mstr = angular.copy(response.data.month_mstr)
            vm.choiceSelect = vm.month_mstr[response.data.month_selected]
          } else {
            vm.list = [];

          }
          $ionicLoading.hide();

        },
        function err(err) {
          vm.list = [];
          $ionicLoading.hide();


        })
    }

    vm.choiceChange = function(e){
      delete vm.list;
      delete vm.totoalSale;
      $ionicLoading.show();
      let req = {
        mode: "selectSaleOrderMonth",
        month:e
      };

      fachttp.model("account.php", req).then(
        function (response) {
          //console.log(response.data)
          if (response.data.status == true) {
            vm.list = response.data.result;
            vm.totoalSale = response.data.total;
          } else {
            vm.list = [];
            vm.totoalSale = 0;

          }
          $ionicLoading.hide();

        },
        function err(err) {
          vm.list = [];
          vm.totoalSale = 0;


        })
      // console.log(vm.choiceSelect)
      // console.log(e)
      $scope.modalMonth.hide()
    }

    onStart()

    $ionicModal
      .fromTemplateUrl("my-month.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modalMonth= modal;
      });

    $scope.openModalMonth = function () {
      $scope.modalMonth.show();
    };
    $scope.closeModalMonth = function () {
      $scope.modalMonth.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalMonth.remove();
    });





    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };

    vm.add = function () {
      $state.go('account.saleAdd')
    }

    vm.goDetail = function (e) {
      let k = JSON.stringify(e);
      $state.go('account.saleDetail', {
        item: k
      });
    }


  })

  .controller("accountSaleAddCtrl", function (
    $http,
    $ionicLoading,
    $timeout,
    $scope,
    $state,
    $rootScope,
    $localStorage,
    $ionicHistory,
    Service,
    $ionicSlideBoxDelegate,
    fachttp,
    $ionicModal,
    $mdDialog
  ) {
    let vm = this;
    vm.list = [];

    $scope.dataItem = {
      price: null,
      qty: null
    };
    $scope.doc = {}
    $scope.manual = {}

    vm.checkConfirm = function () {
      if ($scope.doc.name && $scope.doc.address && $scope.doc.tel && $scope.model.date  ) {
        return false;
      } else {
        return true;

      }
    }

    vm.checkAdd = function () {
      if ($scope.dataItem.price && $scope.dataItem.qty) {
        return false;
      } else {
        return true;

      }
    }


    vm.save = function () {
      var confirm = $mdDialog
        .confirm()
        .title("ยืนยันการบันทึก")
        .textContent(
          "ต้องการบันทึกรายการนี้ใช่หรือไม่ ?"
        )
        .ariaLabel("ต้องการบันทึกรายการนี้ใช่หรือไม่")
        .targetEvent()
        .ok("ยืนยัน")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function (result) {
          if ($scope.doc.name && $scope.doc.address && $scope.doc.tel && $scope.model.date ) {


            // let current_datetime = $scope.doc.date
            // let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes();
            $scope.doc.datetime = $scope.model.date;
            $scope.doc.item = vm.list;
            let req = {
              mode: "addSaleOrder",
              item: $scope.doc
            };

            fachttp.model("account.php", req).then(
              function (response) {
                //console.log(response.data)
                if (response.data.status == true) {

                } else {

                }
                $ionicHistory.goBack();
                //console.log(response.data)
              },
              function err(err) {

              })
          }
        },
        function (e) {

        }
      );



    }




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

    

    $scope.model = {date:null,datedesc:null}

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

      $scope.model.date = [year, monthAD, day].join('-');

      monthBE = monthArr[month-1];

      $scope.model.datedesc= [day, monthBE, year+543].join(' ');
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

      $scope.model.date = [year, monthAD, day].join('-');
      monthBE = monthArr[month-1];
      $scope.model.datedesc = [day, monthBE, year+543].join(' ');
      console.log($scope.model.date)
    }

    vm.manualAdd = function (e) {
      if (e) {

        if (e.pt_desc1 && e.qty && e.price && e.um) {
          //console.log(e)
          let item = {
            pt_desc1: e.pt_desc1,
            pt_um: e.um
          }
          vm.list.push({
            item: item,
            qty: e.qty,
            price: e.price
          })
          $scope.modalAdd.hide();
          //console.log(vm.list)
        }
      }


    }

    vm.selectAndNext = function (e) {
      $ionicSlideBoxDelegate.slide(1);
      vm.itemSelect = e;
    }

    vm.addItem = function () {
      vm.list.push({
        item: vm.itemSelect,
        qty: $scope.dataItem.qty,
        price: $scope.dataItem.price
      })
      $scope.modalAdd.hide();
      //console.log(vm.list)
    }

    $scope.lockSlide = function () {
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    vm.currentIndex = function () {
      return $ionicSlideBoxDelegate.currentIndex()
    }

    vm.prveSlide = function () {
      $ionicSlideBoxDelegate.previous()

    }


    $scope.toggleList = {
      T1: false,
      T2: false
    }
    $scope.dateChange = function (e) {
      //console.log(e)
    }


    $ionicModal
      .fromTemplateUrl("add-Edit.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modalEdit = modal;
      });

    $scope.openModalEdit = function () {
      $scope.modalEdit.show();
    }

    $scope.closeModalEdit = function () {
      $scope.modalEdit.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalEdit.remove();
    });

    vm.clickDetail = function (e, i) {
      vm.editData = e;
      vm.itemIndexSelect = i;
      //console.log(e)
      //console.log(i)
      $scope.modalEdit.show();


    }

    vm.saveEdit = function () {
      vm.list[vm.itemIndexSelect] = vm.editData;
      $scope.modalEdit.hide();

    }




    $ionicModal
      .fromTemplateUrl("add-modal.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modalAdd = modal;
      });

    $scope.openModalAdd = function () {
      $ionicLoading.show();

      let req = {
        mode: "selectPtmstr",
      };

      fachttp
        .model("account.php", req).then(
          function (response) {
            if (response.data.status == true) {
              vm.ptmstr = response.data.result
            } else {

            }
            $ionicLoading.hide();

            //console.log(response.data)
          },
          function err(err) {
            $ionicLoading.hide();

          })





      $scope.dataItem = {
        price: null,
        qty: null
      };
      $scope.manual = {}


      $ionicSlideBoxDelegate.slide(0);
      $scope.modalAdd.show();
    };


    $scope.closeModalAdd = function () {
      $scope.modalAdd.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalAdd.remove();
    });

  })

  .controller("accountSaleDetailCtrl", function (
    $http,
    $ionicLoading,
    $timeout,
    $scope,
    $state,
    $rootScope,
    $localStorage,
    $ionicHistory,
    Service,
    $ionicSlideBoxDelegate,
    fachttp,
    $stateParams
  ) {
    let vm = this;
    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };

    vm.item = JSON.parse($stateParams.item)
    //console.log(vm.item)



  })

  .controller("accountBuyCtrl", function (
    $http,
    $ionicLoading,
    $timeout,
    $scope,
    $state,
    $rootScope,
    $localStorage,
    $ionicHistory,
    Service,
    $ionicSlideBoxDelegate,
    fachttp,
    $ionicModal
  ) {
    let vm = this;

    function onStart() {
      $ionicLoading.show();
      let req = {
        mode: "selectBuyOrder",
      };

      fachttp.model("account.php", req).then(
        function (response) {
          //console.log(response.data)
          if (response.data.status == true) {
            vm.list = response.data.result;
            vm.totoalSale = response.data.total;
            vm.month_mstr = angular.copy(response.data.month_mstr)
            vm.choiceSelect = vm.month_mstr[response.data.month_selected]
          } else {
            vm.list = [];

          }
          $ionicLoading.hide();

        },
        function err(err) {
          vm.list = [];
          $ionicLoading.hide();


        })
    }


    

    vm.choiceChange = function(e){
      delete vm.list;
      delete vm.totoalSale;
      $ionicLoading.show();
      let req = {
        mode: "selectBuyOrderMonth",
        month:e
      };

      fachttp.model("account.php", req).then(
        function (response) {
          //console.log(response.data)
          if (response.data.status == true) {
            vm.list = response.data.result;
            vm.totoalSale = response.data.total;
          } else {
            vm.list = [];
            vm.totoalSale = 0;

          }
          $ionicLoading.hide();

        },
        function err(err) {
          vm.list = [];
          vm.totoalSale = 0;


        })
      // console.log(vm.choiceSelect)
      // console.log(e)
      $scope.modalMonth.hide()
    }

    onStart()

    

    $ionicModal
      .fromTemplateUrl("my-month.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modalMonth= modal;
      });

    $scope.openModalMonth = function () {
      $scope.modalMonth.show();
    };
    $scope.closeModalMonth = function () {
      $scope.modalMonth.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalMonth.remove();
    });



    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };


    vm.add = function () {
      $state.go('account.buyAdd')
    }


    vm.goDetail = function (e) {
      let k = JSON.stringify(e);
      $state.go('account.buyDetail', {
        item: k
      });
    }

  })

  .controller("accountBuyAddCtrl", function (
    $http,
    $ionicLoading,
    $timeout,
    $scope,
    $state,
    $rootScope,
    $localStorage,
    $ionicHistory,
    Service,
    $ionicSlideBoxDelegate,
    fachttp,
    $ionicModal,
    $mdDialog
  ) {
    let vm = this;
    vm.list = [];

    $scope.dataItem = {
      price: null,
      qty: null
    };
    $scope.doc = {}
    $scope.manual = {}

    vm.checkConfirm = function () {
      if ($scope.doc.name && $scope.doc.address && $scope.doc.tel && $scope.model.date) {
        return false;
      } else {
        return true;

      }
    }

    vm.checkAdd = function () {
      if ($scope.dataItem.price && $scope.dataItem.qty) {
        return false;
      } else {
        return true;

      }
    }


    vm.save = function () {
      var confirm = $mdDialog
        .confirm()
        .title("ยืนยันการบันทึก")
        .textContent(
          "ต้องการบันทึกรายการนี้ใช่หรือไม่ ?"
        )
        .ariaLabel("ต้องการบันทึกรายการนี้ใช่หรือไม่")
        .targetEvent()
        .ok("ยืนยัน")
        .cancel("ยกเลิก");

      $mdDialog.show(confirm).then(
        function (result) {
          if ($scope.doc.name && $scope.doc.address && $scope.doc.tel && $scope.model.date) {


            // let current_datetime = $scope.doc.date
            // let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes();
            $scope.doc.datetime = $scope.model.date
            $scope.doc.item = vm.list;
            let req = {
              mode: "addBuyOrder",
              item: $scope.doc
            };

            fachttp.model("account.php", req).then(
              function (response) {
                //console.log(response.data)
                if (response.data.status == true) {

                } else {

                }
                $ionicHistory.goBack();
                //console.log(response.data)
              },
              function err(err) {

              })
          }
        },
        function (e) {

        }
      );



    }




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

    

    $scope.model = {date:null,datedesc:null}

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

      $scope.model.date = [year, monthAD, day].join('-');

      monthBE = monthArr[month-1];

      $scope.model.datedesc= [day, monthBE, year+543].join(' ');
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

      $scope.model.date = [year, monthAD, day].join('-');
      monthBE = monthArr[month-1];
      $scope.model.datedesc = [day, monthBE, year+543].join(' ');
      console.log($scope.model.date)
    }

    vm.manualAdd = function (e) {
      if (e) {

        if (e.pt_desc1 && e.qty && e.price && e.um) {
          //console.log(e)
          let item = {
            pt_desc1: e.pt_desc1,
            pt_um: e.um
          }
          vm.list.push({
            item: item,
            qty: e.qty,
            price: e.price
          })
          $scope.modalAdd.hide();
          //console.log(vm.list)
        }
      }


    }

    vm.selectAndNext = function (e) {
      $ionicSlideBoxDelegate.slide(1);
      vm.itemSelect = e;
    }

    vm.addItem = function () {
      vm.list.push({
        item: vm.itemSelect,
        qty: $scope.dataItem.qty,
        price: $scope.dataItem.price
      })
      $scope.modalAdd.hide();
      //console.log(vm.list)
    }

    $scope.lockSlide = function () {
      $ionicSlideBoxDelegate.enableSlide(false);
    };

    vm.currentIndex = function () {
      return $ionicSlideBoxDelegate.currentIndex()
    }

    vm.prveSlide = function () {
      $ionicSlideBoxDelegate.previous()

    }


    $scope.toggleList = {
      T1: false,
      T2: false
    }
    $scope.dateChange = function (e) {
      //console.log(e)
    }


    $ionicModal
      .fromTemplateUrl("add-Edit.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modalEdit = modal;
      });

    $scope.openModalEdit = function () {
      $scope.modalEdit.show();
    }

    $scope.closeModalEdit = function () {
      $scope.modalEdit.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalEdit.remove();
    });

    vm.clickDetail = function (e, i) {
      vm.editData = e;
      vm.itemIndexSelect = i;
      //console.log(e)
      //console.log(i)
      $scope.modalEdit.show();


    }

    vm.saveEdit = function () {
      vm.list[vm.itemIndexSelect] = vm.editData;
      $scope.modalEdit.hide();

    }




    $ionicModal
      .fromTemplateUrl("add-modal.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modalAdd = modal;
      });

    $scope.openModalAdd = function () {
      $ionicLoading.show();

      let req = {
        mode: "selectPtmstr",
      };

      fachttp
        .model("account.php", req).then(
          function (response) {
            if (response.data.status == true) {
              vm.ptmstr = response.data.result
            } else {

            }
            $ionicLoading.hide();

            //console.log(response.data)
          },
          function err(err) {
            $ionicLoading.hide();

          })





      $scope.dataItem = {
        price: null,
        qty: null
      };
      $scope.manual = {}


      $ionicSlideBoxDelegate.slide(0);
      $scope.modalAdd.show();
    };


    $scope.closeModalAdd = function () {
      $scope.modalAdd.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalAdd.remove();
    });

  })

  .controller("accountBuyDetailCtrl", function (
    $http,
    $ionicLoading,
    $timeout,
    $scope,
    $state,
    $rootScope,
    $localStorage,
    $ionicHistory,
    Service,
    $ionicSlideBoxDelegate,
    fachttp,
    $stateParams
  ) {
    let vm = this;
    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };

    vm.goDetail = function (e) {

    }

    vm.item = JSON.parse($stateParams.item)
  })



  .controller("accountTotalCtrl", function (
    $http,
    $ionicLoading,
    $timeout,
    $scope,
    $state,
    $rootScope,
    $localStorage,
    $ionicHistory,
    Service,
    $ionicSlideBoxDelegate,
    fachttp,
    $ionicModal
  ) {
    let vm = this;
    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };


    function onStart() {
      $ionicLoading.show();
      let req = {
        mode: "selectChart",
      };

      fachttp.model("account.php", req).then(
        function (response) {
            console.log(response.data)
            $scope.labels  = response.data.labels;
            $scope.series  = response.data.series;
            $scope.data  = response.data.datas;
            $scope.number ={sale:response.data.sale,buy:response.data.buy,diff:response.data.diff}
            vm.month_mstr = angular.copy(response.data.month_mstr)
            vm.choiceSelect = vm.month_mstr[response.data.month_selected]

          $ionicLoading.hide();

        },
        function err(err) {
          $ionicLoading.hide();


        })
    }

    onStart()
    $scope.charttype = 'line';
    $scope.toggleChart = function(){
        $scope.charttype = $scope.charttype === 'line'?'bar':'line'
    }
    $scope.colors = ["#33cd5f", "#ef473a", "#00bfa5"];
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['รายรับ', 'รายจ่าย'];
    $scope.data = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $scope.options = {
      responsive: true,

      scales: {
        yAxes: [{
          id: "y-axis-1",
          type: "linear",
          display: true,
          position: "left"
        }]
      },
      legend: {
        display: true,
        position: "bottom"
      },

      elements: {
        point: {
          radius: 1,
          pointStyle: "rectRounded"
        }
      }
    };


    vm.choiceChange = function(e){
      vm.choiceSelect = e;
      console.log(e)
      $ionicLoading.show();
      let req = {
        mode: "selectChartMonth",
        month:e
      };

      fachttp.model("account.php", req).then(
        function (response) {
          console.log(response.data)
          $scope.labels  = response.data.labels;
          $scope.series  = response.data.series;
          $scope.data  = response.data.datas;
          $scope.number ={sale:response.data.sale,buy:response.data.buy,diff:response.data.diff}
          $ionicLoading.hide();

        },
        function err(err) {
        
          $ionicLoading.hide();


        })
   
      $scope.modalMonth.hide()
    }


    

    $ionicModal
      .fromTemplateUrl("my-month.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modalMonth= modal;
      });

    $scope.openModalMonth = function () {
      $scope.modalMonth.show();
    };
    $scope.closeModalMonth = function () {
      $scope.modalMonth.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalMonth.remove();
    });


  })
