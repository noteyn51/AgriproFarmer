angular
  .module("app")
  .config(function ($translateProvider) {
    $translateProvider.translations("en", {
      JANUARY: "January",
      FEBRUARY: "February",
      MARCH: "March",
      APRIL: "April",
      MAI: "Mai",
      JUNE: "June",
      JULY: "July",
      AUGUST: "August",
      SEPTEMBER: "September",
      OCTOBER: "October",
      NOVEMBER: "November",
      DECEMBER: "December",

      SUNDAY: "Sunday",
      MONDAY: "Monday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thurday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
    });
    $translateProvider.translations("fr", {
      JANUARY: "Janvier",
      FEBRUARY: "Févier",
      MARCH: "Mars",
      APRIL: "Avril",
      MAI: "Mai",
      JUNE: "Juin",
      JULY: "Juillet",
      AUGUST: "Août",
      SEPTEMBER: "Septembre",
      OCTOBER: "Octobre",
      NOVEMBER: "Novembre",
      DECEMBER: "Décembre",

      SUNDAY: "Dimanche",
      MONDAY: "Lundi",
      TUESDAY: "Mardi",
      WEDNESDAY: "Mercredi",
      THURSDAY: "Jeudi",
      FRIDAY: "Vendredi",
      SATURDAY: "Samedi",
    });
    $translateProvider.translations("pt", {
      JANUARY: "Janeiro",
      FEBRUARY: "Fevereiro",
      MARCH: "Março",
      APRIL: "Abril",
      MAI: "Maio",
      JUNE: "Junho",
      JULY: "Julho",
      AUGUST: "Agosto",
      SEPTEMBER: "Setembro",
      OCTOBER: "Outubro",
      NOVEMBER: "Novembro",
      DECEMBER: "Dezembro",

      SUNDAY: "Domingo",
      MONDAY: "Segunda",
      TUESDAY: "Terça",
      WEDNESDAY: "Quarta",
      THURSDAY: "Quinta",
      FRIDAY: "Sexta",
      SATURDAY: "Sábado",
    });
    $translateProvider.translations("th", {
      JANUARY: "มกราคม",
      FEBRUARY: "กุมภาพันธ์",
      MARCH: "มีนาคม",
      APRIL: "เมษายน",
      MAI: "พฤษภาคม",
      JUNE: "มิถุนายน",
      JULY: "กรกฏาคม",
      AUGUST: "สิงหาคม",
      SEPTEMBER: "กันยายน",
      OCTOBER: "ตุลาคม",
      NOVEMBER: "พฤศจิกายน",
      DECEMBER: "ธันวาคม",

      SUNDAY: "อาทิตย์",
      MONDAY: "จันทร์",
      TUESDAY: "อังคาร",
      WEDNESDAY: "พุธ",
      THURSDAY: "พฤหัสบดี",
      FRIDAY: "ศุกร์",
      SATURDAY: "ส",
    });
    $translateProvider.preferredLanguage("th");
  })

  .controller("nevMeetingCtrl", function (
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

    let a = [{q:'<=',v:'0'} ,{q:'>=',v:'1'}]
    let b = [{v:'0'}]





    $scope.add = function () {
      $state.go('meeting.meeting2')
    }

    $scope.shouldHide = function () {
      // //console.log($state.current.name)
      switch ($state.current.name) {
        case "meeting.meeting2":
          return true;
        case "meeting.request1":
          return true;
        case "meeting.request2":
          return true;
        default:
          return false;
      }
    };

    let vm = this;

    vm.reqeust1 = function () {
      $state.go('meeting.request1')
      $scope.modalshowmore.hide();
    }

    vm.reqeust2 = function () {
      $state.go('meeting.request2')
      $scope.modalshowmore.hide();
    }

    $scope.list = {};


    $scope.openModalmodalshowmore = function () {
      $ionicModal
        .fromTemplateUrl("showmore.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          function request1() {
            let req = {
              mode: 'request1',
            };

            fachttp.model('meeting.php', req).then(function (response) {
                //console.log(response);
                if (response.data.status == true) {
                  $scope.list.request1 = response.data;
                } else {
                  $scope.list.request1 = response.data;
                }
                //console.log(response);
              },
              function err(err) {
                $scope.list.request1  = [];
                //console.log(err);
                $scope.status = false;
              }
            );
          }

          request1()

          function request2() {
            let req = {
              mode: 'request2',
            };

            fachttp.model('meeting.php', req).then(function (response) {
                //console.log(response);
                if (response.data.status == true) {
                  $scope.list.request2 = response.data;
                } else {
                  $scope.list.request2 = response.data;
                }
                //console.log(response);
              },
              function err(err) {
                $scope.list.request2 = [];
                //console.log(err);
                $scope.status = false;
              }
            );
          }

          request2()
          $scope.modalshowmore = modal;
          $scope.modalshowmore.show();




        });
    };

    $scope.closeModalshowmore = function () {
      $scope.modalshowmore.hide();
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

    vm.modal = function () {
      $scope.openModalmodalshowmore()
    }


    $scope.calendar = function () {
      $state.go("meeting.meetingViewCalendar");
    };

    $scope.list = function () {
      $state.go("meeting.meetingViewList");
    };

    $scope.now = function () {
      $state.go("meeting.meetingViewNow");
    };
  })

  .controller("meetingViewCalendarCtrl", function (
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
    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };

      
    function request() {
      let req = {
        mode: 'allEvent',
      };

      fachttp.model('meeting.php', req).then(function (response) {
          // //console.log(response);
          if (response.data.status == true) {
            $scope.list = response.data;


            for(let i = 0; i<$scope.list.result.length ; i++){
                let item =  $scope.list.result[i];
                $scope.list.result[i].date =  new Date(item.meet_date_due);
            }

            //console.log($scope.list.result)
          } else {
            $scope.list = response.data;
          }
          // //console.log(response);
        },
        function err(err) {
          $scope.list = [];
          //console.log(err);
          $scope.status = false;
        }
      );
    }

    request()

    $scope.openModalDetail = function (e) {
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

    vm.meeting2 = function () {
      $state.go("app.meeting2");
    };

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    // //console.log(m);
    // //console.log(d, m, y);
    let nowdate = new Date(y, m, d+1).toISOString().split("T")[0];



    ("use strict");
    // With "use strict", Dates can be passed ONLY as strings (ISO format: YYYY-MM-DD)
    $scope.options = {
      defaultDate: nowdate,
      minDate: y + "-01-01",
      maxDate: y + "-12-31",
      disabledDates: [
        // "2015-06-22",
        // "2015-07-27",
        // "2015-08-13",
        // "2015-08-15"
      ],
      dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
      mondayIsFirstDay: true, //set monday as first day of week. Default is false
      eventClick: function (date) {
        // $ionicLoading.show();
        $scope.eventSelect = date.event[0]

        // $timeout(function(){
        //   $ionicLoading.hide();
        //   //console.log(date)
        //   // called before dateClick and only if clicked day has events
        //   //console.log($scope.eventSelect)
        //   $scope.openModalDetail();
        // },800)
       
      },
      dateClick: function (date) {
        // called every time a day is clicked
        // //console.log(date);
      },
      changeMonth: function (month, year) {
        // //console.log(month, year);
      },
      filteredEventsChange: function (filteredEvents) {
        // //console.log(filteredEvents);
      },
    };

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthsth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    // let current_datetime = new Date()
    // let formatted_date = current_datetime.getDate() + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear()
    $scope.events = [{
        day: "วันจันทร์",
        check: false,
        date: new Date(y, m, d + 1).toISOString().split("T")[0],
        formatted_date: new Date().getDate() + 1 + " " + monthsth[new Date().getMonth()] + " " + parseInt(new Date().getFullYear() + 543),
        List: [{
            time: "08:00",
            title: "นัดตรวจพื้นที่",
            farm_id: "FRM000001",
            start: new Date(y, m, d - +10),
            date: new Date(y, m, d - 5).toISOString().split("T")[0],
            name: "นาย บรรพต คล้ายศร",
            status: "approve",
          },
          {
            time: "09:00",
            title: "นัดตรวจพื้นที่",
            farm_id: "FRM000001",
            start: new Date(y, m, d - 15),
            date: new Date(y, m, d - 5).toISOString().split("T")[0],
            name: "นาย บรรพต คล้ายศร",
            status: "pending",
          },
        ],
      },
      {
        day: "วันอังคาร",
        check: false,
        date: new Date(y, m, d + 2).toISOString().split("T")[0],
        formatted_date: new Date().getDate() + 2 + " " + monthsth[new Date().getMonth()] + " " + parseInt(new Date().getFullYear() + 543),
        List: [{
            time: "07:00",
            title: "นัดตรวจพื้นที่",
            farm_id: "FRM000001",
            start: new Date(y, m, d - +10),
            date: new Date(y, m, d - 5).toISOString().split("T")[0],
            name: "นาย บรรพต คล้ายศร",
            status: "approve",
          },
          {
            time: "16:00",
            title: "นัดตรวจพื้นที่",
            farm_id: "FRM000001",
            start: new Date(y, m, d - 15),
            date: new Date(y, m, d - 5).toISOString().split("T")[0],
            name: "นาย บรรพต คล้ายศร",
            status: "pending",
          },
        ],
      },
      {
        day: "วันพุธ",
        check: false,
        date: new Date(y, m, d + 3).toISOString().split("T")[0],
        formatted_date: new Date().getDate() + 3 + " " + monthsth[new Date().getMonth()] + " " + parseInt(new Date().getFullYear() + 543),
        List: [{
          time: "15:00",
          title: "นัดตรวจพื้นที่",
          farm_id: "FRM000001",
          start: new Date(y, m, d - +10),
          date: new Date(y, m, d - 5).toISOString().split("T")[0],
          name: "นาย บรรพต คล้ายศร",
          status: "approve",
        }, ],
      },
      {
        day: "วันพฤหัส",
        check: false,
        date: new Date(y, m, d + 4).toISOString().split("T")[0],
        formatted_date: new Date().getDate() + 4 + " " + monthsth[new Date().getMonth()] + " " + parseInt(new Date().getFullYear() + 543),
        List: [],
      },
      {
        day: "วันศุกร์",
        check: false,
        date: new Date(y, m, d + 5).toISOString().split("T")[0],
        formatted_date: new Date().getDate() + 5 + " " + monthsth[new Date().getMonth()] + " " + parseInt(new Date().getFullYear() + 543),
        List: [{
          time: "11:00",
          title: "นัดตรวจพื้นที่",
          farm_id: "FRM000001",
          start: new Date(y, m, d - +10),
          date: new Date(y, m, d - 5).toISOString().split("T")[0],
          name: "นาย บรรพต คล้ายศร",
          status: "approve",
        }, ],
      },
      {
        day: "วันเสาร์",
        check: false,
        date: new Date(y, m, d + 6).toISOString().split("T")[0],
        formatted_date: new Date().getDate() + 6 + " " + monthsth[new Date().getMonth()] + " " + parseInt(new Date().getFullYear() + 543),
        List: [{
            time: "10:00",
            title: "นัดตรวจพื้นที่",
            farm_id: "FRM000001",
            start: new Date(y, m, d - +10),
            date: new Date(y, m, d - 5).toISOString().split("T")[0],
            name: "นาย บรรพต คล้ายศร",
            status: "approve",
          },
          {
            time: "14:00",
            title: "นัดตรวจพื้นที่",
            farm_id: "FRM000001",
            start: new Date(y, m, d - 15),
            date: new Date(y, m, d - 5).toISOString().split("T")[0],
            name: "นาย บรรพต คล้ายศร",
            status: "pending",
          },
        ],
      },
      {
        day: "วันอาทิตย์",
        check: false,
        date: new Date(y, m, d + 7).toISOString().split("T")[0],
        formatted_date: new Date().getDate() + 7 + " " + monthsth[new Date().getMonth()] + " " + parseInt(new Date().getFullYear() + 543),
        List: [{
          time: "12:00",
          title: "นัดตรวจพื้นที่",
          farm_id: "FRM000001",
          start: new Date(y, m, d - +10),
          date: new Date(y, m, d - 5).toISOString().split("T")[0],
          name: "นาย บรรพต คล้ายศร",
          status: "approve",
        }, ],
      },
    ];
    //console.log($scope.events);
  })

  .controller("meetingViewListCtrl", function (
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
      $state.go("app.farmerMenu");
    };

    $scope.openModalDetail = function (e) {
      $ionicModal
        .fromTemplateUrl("my-detail.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalDetail = modal;
          vm.detail = e;
          //console.log(e)
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

    vm.meeting2 = function () {
      $state.go("app.meeting2");
    };


    function request() {
      let req = {
        mode: 'weekEvent',
      };

      fachttp.model('meeting.php', req).then(function (response) {
          //console.log(response);
          //console.log('23232')
          if (response.data.status == true) {
            vm.meetinglist = response.data;


            // for(let i = 0; i<$scope.list.result.length ; i++){
            //     let item =  $scope.list.result[i];
            //     $scope.list.result[i].date =  new Date(item.meet_date_due);
            // }

            //console.log(vm.meetinglist)
          } else {
            vm.meetinglist = response.data;
          }
          // //console.log(response);
        },
        function err(err) {
          vm.meetinglist = [];
          //console.log(err);
          $scope.status = false;
        }
      );
    }

    request()


    // var date = new Date();
    // var d = date.getDate();
    // var m = date.getMonth();
    // var y = date.getFullYear();
    // //console.log(m);

    // //console.log(d, m, y);
    // let nowdate = new Date(y, m, d).toISOString().split("T")[0];

    // //console.log(nowdate);

    // vm.meetinglist = [{
    //     day: "วันจันทร์",
    //     check: false,
    //     List: [{
    //         time: "08:00",
    //         title: "นัดตรวจพื้นที่",
    //         farm_id: "FRM000001",
    //         start: new Date(y, m, d - +10),
    //         date: new Date(y, m, d - 5).toISOString().split("T")[0],
    //         name: "นาย บรรพต คล้ายศร",
    //         status: "approve",
    //       },
    //       {
    //         time: "09:00",
    //         title: "นัดตรวจพื้นที่",
    //         farm_id: "FRM000001",
    //         start: new Date(y, m, d - 15),
    //         date: new Date(y, m, d - 5).toISOString().split("T")[0],
    //         name: "นาย บรรพต คล้ายศร",
    //         status: "pending",
    //       },
    //     ],
    //   },
    //   {
    //     day: "วันอังคาร",
    //     check: false,
    //     List: [{
    //         time: "07:00",
    //         title: "นัดตรวจพื้นที่",
    //         farm_id: "FRM000001",
    //         start: new Date(y, m, d - +10),
    //         date: new Date(y, m, d - 5).toISOString().split("T")[0],
    //         name: "นาย บรรพต คล้ายศร",
    //         status: "approve",
    //       },
    //       {
    //         time: "16:00",
    //         title: "นัดตรวจพื้นที่",
    //         farm_id: "FRM000001",
    //         start: new Date(y, m, d - 15),
    //         date: new Date(y, m, d - 5).toISOString().split("T")[0],
    //         name: "นาย บรรพต คล้ายศร",
    //         status: "pending",
    //       },
    //     ],
    //   },
    //   {
    //     day: "วันพุธ",
    //     check: false,
    //     List: [{
    //       time: "15:00",
    //       title: "นัดตรวจพื้นที่",
    //       farm_id: "FRM000001",
    //       start: new Date(y, m, d - +10),
    //       date: new Date(y, m, d - 5).toISOString().split("T")[0],
    //       name: "นาย บรรพต คล้ายศร",
    //       status: "approve",
    //     }, ],
    //   },
    //   {
    //     day: "วันพฤหัส",
    //     check: false,
    //     List: [],
    //   },
    //   {
    //     day: "วันศุกร์",
    //     check: false,
    //     List: [{
    //       time: "11:00",
    //       title: "นัดตรวจพื้นที่",
    //       farm_id: "FRM000001",
    //       start: new Date(y, m, d - +10),
    //       date: new Date(y, m, d - 5).toISOString().split("T")[0],
    //       name: "นาย บรรพต คล้ายศร",
    //       status: "approve",
    //     }, ],
    //   },
    //   {
    //     day: "วันเสาร์",
    //     check: false,
    //     List: [{
    //         time: "10:00",
    //         title: "นัดตรวจพื้นที่",
    //         farm_id: "FRM000001",
    //         start: new Date(y, m, d - +10),
    //         date: new Date(y, m, d - 5).toISOString().split("T")[0],
    //         name: "นาย บรรพต คล้ายศร",
    //         status: "approve",
    //       },
    //       {
    //         time: "14:00",
    //         title: "นัดตรวจพื้นที่",
    //         farm_id: "FRM000001",
    //         start: new Date(y, m, d - 15),
    //         date: new Date(y, m, d - 5).toISOString().split("T")[0],
    //         name: "นาย บรรพต คล้ายศร",
    //         status: "pending",
    //       },
    //     ],
    //   },
    //   {
    //     day: "วันอาทิตย์",
    //     check: false,
    //     List: [{
    //       time: "12:00",
    //       title: "นัดตรวจพื้นที่",
    //       farm_id: "FRM000001",
    //       start: new Date(y, m, d - +10),
    //       date: new Date(y, m, d - 5).toISOString().split("T")[0],
    //       name: "นาย บรรพต คล้ายศร",
    //       status: "approve",
    //     }, ],
    //   },
    // ];
    // //console.log(vm.meetinglist);

    $scope.showhide = function (e) {
      $ionicScrollDelegate.resize();
      e.check = !e.check;
      //console.log("22");
      $ionicScrollDelegate.resize();
    };


  })

  .controller("meetingViewNowCtrl", function (
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
    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };

    $scope.openModalDetail = function (e) {
      $ionicModal
        .fromTemplateUrl("my-detail.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalDetail = modal;
          vm.detail = e;
          //console.log(e)
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



    vm.meeting2 = function () {
      $state.go("app.meeting2");
    };

    
    function request() {
      let req = {
        mode: 'eventnowdate',
      };

      fachttp.model('meeting.php', req).then(function (response) {
          // //console.log(response);
          if (response.data.status == true) {
            $scope.list = response.data;

            //console.log($scope.list)
          } else {
            $scope.list = response.data;
          }
          //console.log(response);
        },
        function err(err) {
          $scope.list = [];
          //console.log(err);
          $scope.status = false;
        }
      );
    }

    request()




    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    //console.log(m);

    //console.log(d, m, y);
    let nowdate = new Date(y, m, d).toISOString().split("T")[0];

    //console.log(nowdate);

    vm.meetinglist = [{
        time: "08:00",
        title: "นัดตรวจพื้นที่",
        farm_id: "FRM000001",
        start: new Date(y, m, d - +10),
        date: new Date(y, m, d - 5).toISOString().split("T")[0],
        name: "นาย บรรพต คล้ายศร",
        status: "approve",
      },
      {
        time: "10:00",
        title: "นัดตรวจพื้นที่",
        farm_id: "FRM000001",
        start: new Date(y, m, d - 15),
        date: new Date(y, m, d - 5).toISOString().split("T")[0],
        name: "นาย บรรพต คล้ายศร",
        status: "pending",
      },
      {
        time: "13:00",
        title: "นัดตรวจพื้นที่",
        farm_id: "FRM000001",
        start: new Date(y, m, d - 15),
        date: new Date(y, m, d - 5).toISOString().split("T")[0],
        name: "นาย บรรพต คล้ายศร",
        status: "pending",
      },
      {
        time: "15:00",
        title: "นัดตรวจพื้นที่",
        farm_id: "FRM000001",
        start: new Date(y, m, d - 15),
        date: new Date(y, m, d - 5).toISOString().split("T")[0],
        name: "นาย บรรพต คล้ายศร",
        status: "pending",
      },
    ];
  })

  .controller("meetingEventCtrl", function (
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

    $ionicModal
      .fromTemplateUrl("list_map.html", {
        scope: $scope,
        animation: "slide-in-up",
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

    function onStart() {
      $ionicLoading.show();
      let url = $rootScope.ip + "predictPlant.php";
      let req = {
        mode: "selectsubfarm",
      };
      fachttp.model("predictPlant.php", req).then(
        function (response) {
          //console.log(response.data);
          vm.status = response.data.status;
          if (response.data.resultArea.length > 0) {
            $scope.subfarm = response.data.resultArea;
            $scope.dataCropwo = response.data.resultCrop;

            $scope.selected = $scope.subfarm[0];
            $timeout(function () {
              vm.selectSub($scope.subfarm[0]);
              $ionicLoading.hide();
            }, 500);
          }

          $ionicLoading.hide();
        },
        function err(err) {
          vm.status = false;
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    vm.listmap = function () {
      $scope.modalListmap.show();
      $ionicLoading.show();

      $timeout(function () {
        $ionicLoading.hide();

        //console.log($scope.subfarm);

        let triangleCoordsListmap = [];
        let all_overlaysListmap = [];
        let polygonCoordsListmap = [];
        let polygonCoordsFarmListmap = [];
        let boundsListmap = new google.maps.LatLngBounds();
        for (let x = 0; x < $scope.subfarm.length; x++) {
          //console.log(x);
          let e = $scope.subfarm[x];

          let map = new google.maps.Map(document.getElementById(x), {
            zoom: 5,
            // center: bounds.getCenter(),
            center: new google.maps.LatLng(13.760412, 100.485357),
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            zoomControl: false,
          });
          triangleCoordsListmap = [];
          polygonCoordsListmap = [];
          boundsListmap = new google.maps.LatLngBounds();
          $scope.abc = {
            lat: e.sub_lat.split(","),
            lng: e.sub_lng.split(","),
          };

          //console.log($scope.abc);

          // //////////console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i]),
            };

            polygonCoordsListmap.push(new google.maps.LatLng(k.lat, k.lng));
            triangleCoordsListmap.push(k);
          }
          // //////////console.log(triangleCoords);

          for (i = 0; i < polygonCoordsListmap.length; i++) {
            boundsListmap.extend(polygonCoordsListmap[i]);
          }

          let bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoordsListmap,
            strokeColor: "red",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.35,
          });

          all_overlaysListmap.push(bermudaTriangle);

          // //console.log(all_overlaysListmap[x]);
          // //console.log(map);

          all_overlaysListmap[x].setMap(map);

          map.fitBounds(boundsListmap);
          map.panTo(boundsListmap.getCenter());
        }
      }, 1000);
    };

    vm.selectSub = function (e, index) {
      $scope.subDetail = e;

      let map = new google.maps.Map(document.getElementById("mapbbb"), {
        zoom: 5,
        // center: bounds.getCenter(),
        center: new google.maps.LatLng(13.760412, 100.485357),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: "satellite",
        mapTypeControl: false,
        zoomControl: false,
      });

      let triangleCoords = [];
      let all_overlays = [];

      let polygonCoords = [];
      let polygonCoordsFarm = [];

      let bounds = new google.maps.LatLngBounds();

      for (i = 0; i < all_overlays.length; i++) {
        all_overlays[i].setMap(null); //or line[i].setVisible(false);
      }

      triangleCoords = [];
      all_overlays = [];
      polygonCoords = [];
      bounds = new google.maps.LatLngBounds();
      $scope.abc = {
        lat: e.sub_lat.split(","),
        lng: e.sub_lng.split(","),
      };

      $timeout(function () {
        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i]),
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // //////////console.log(triangleCoords);

        for (i = 0; i < polygonCoords.length; i++) {
          bounds.extend(polygonCoords[i]);
        }

        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35,
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }, 100);
    };

    vm.selectSubBefore = function (e, index) {
      //console.log(e);
      $scope.modalListmap.hide();
      vm.selectSub(e, index);
    };
    
  })

  .controller("meeting2Ctrl", function (
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
    vm.goBack = function () {
      $ionicHistory.goBack();
    };

    var timeoutPromise;
    $scope.search = function (e) {
      //console.log(e)
      $timeout.cancel(timeoutPromise);
      timeoutPromise = $timeout(function () {
        vm.search = e
        let req = {
          mode: "womstrSearch",
          txt: e,
        };

        fachttp.model("meeting.php", req).then(
          function (response) {
            //console.log(response.data);
            vm.status = response.data.status;
            vm.list = response.data
            vm.listSelect = vm.list.result[0]
  
          },
          function err(err) {
            vm.status = false;
          }
        );

      }, 300);
    };





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

    

    $scope.model = {startdate:{AD:null,BE:null}}

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

      $scope.model.date= [year, monthAD, day].join('-');
      monthBE = monthArr[month-1];
      $scope.model.startdate.BE = [day, monthBE, year+543].join(' ');
    }



    $ionicModal
      .fromTemplateUrl("list_map.html", {
        scope: $scope,
        animation: "slide-in-up",
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
      .fromTemplateUrl("my-wo-id.html", {
        scope: $scope,
        animation: "slide-in-up",
      })
      .then(function (modal) {
        $scope.modalList = modal;
      });

    $scope.openModalList = function () {
      $scope.modalList.show();
    };
    $scope.closeModalList = function () {
      $scope.modalList.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalList.remove();
    });

    function onStart() {
      $ionicLoading.show();
      // let url = $rootScope.ip + "predictPlant.php";
      let req = {
        mode: "womstr",
      };
      fachttp.model("meeting.php", req).then(
        function (response) {
          //console.log(response.data);
          if(response.data.status == true){
            vm.status = response.data.status;
            vm.list = response.data
            vm.listSelect = vm.list.result[0]
            console.log(vm.list )
          }else{
            vm.status = response.data.status;
            vm.list = [];
            console.log(vm.listSelect)
          }
        

          $ionicLoading.hide();
        },
        function err(err) {
          vm.status = false;
          $ionicLoading.hide();
        }
      );
    }

    onStart();

    $scope.selectID = function (e) {
      vm.listSelect = e;
      $scope.modalList.hide();
    }

    vm.listmap = function () {
      $scope.modalListmap.show();
      $ionicLoading.show();

      $timeout(function () {
        $ionicLoading.hide();

        //console.log($scope.subfarm);

        let triangleCoordsListmap = [];
        let all_overlaysListmap = [];
        let polygonCoordsListmap = [];
        let polygonCoordsFarmListmap = [];
        let boundsListmap = new google.maps.LatLngBounds();
        for (let x = 0; x < $scope.subfarm.length; x++) {
          //console.log(x);
          let e = $scope.subfarm[x];

          let map = new google.maps.Map(document.getElementById(x), {
            zoom: 5,
            // center: bounds.getCenter(),
            center: new google.maps.LatLng(13.760412, 100.485357),
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            zoomControl: false,
          });
          triangleCoordsListmap = [];
          polygonCoordsListmap = [];
          boundsListmap = new google.maps.LatLngBounds();
          $scope.abc = {
            lat: e.sub_lat.split(","),
            lng: e.sub_lng.split(","),
          };

          //console.log($scope.abc);

          // //////////console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i]),
            };

            polygonCoordsListmap.push(new google.maps.LatLng(k.lat, k.lng));
            triangleCoordsListmap.push(k);
          }
          // //////////console.log(triangleCoords);

          for (i = 0; i < polygonCoordsListmap.length; i++) {
            boundsListmap.extend(polygonCoordsListmap[i]);
          }

          let bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoordsListmap,
            strokeColor: "red",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "red",
            fillOpacity: 0.35,
          });

          all_overlaysListmap.push(bermudaTriangle);

          // //console.log(all_overlaysListmap[x]);
          // //console.log(map);

          all_overlaysListmap[x].setMap(map);

          map.fitBounds(boundsListmap);
          map.panTo(boundsListmap.getCenter());
        }
      }, 1000);
    };

    vm.selectSub = function (e, index) {
      $scope.subDetail = e;

      let map = new google.maps.Map(document.getElementById("mapbbb"), {
        zoom: 5,
        // center: bounds.getCenter(),
        center: new google.maps.LatLng(13.760412, 100.485357),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: "satellite",
        mapTypeControl: false,
        zoomControl: false,
      });

      let triangleCoords = [];
      let all_overlays = [];

      let polygonCoords = [];
      let polygonCoordsFarm = [];

      let bounds = new google.maps.LatLngBounds();

      for (i = 0; i < all_overlays.length; i++) {
        all_overlays[i].setMap(null); //or line[i].setVisible(false);
      }

      triangleCoords = [];
      all_overlays = [];
      polygonCoords = [];
      bounds = new google.maps.LatLngBounds();
      $scope.abc = {
        lat: e.sub_lat.split(","),
        lng: e.sub_lng.split(","),
      };

      $timeout(function () {
        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i]),
          };

          polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
          triangleCoords.push(k);
        }
        // //////////console.log(triangleCoords);

        for (i = 0; i < polygonCoords.length; i++) {
          bounds.extend(polygonCoords[i]);
        }

        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "red",
          fillOpacity: 0.35,
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }, 100);
    };

    vm.selectSubBefore = function (e, index) {
      //console.log(e);
      $scope.modalListmap.hide();
      vm.selectSub(e, index);
    };


    let platform = ionic.Platform.platform();

    vm.pickdate = function (e) {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function () {
          let k = Service.pickdate();
          k.then(function suss(data) {
            $scope.model.date = data;
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
                  //console.log(1);
                  e.preventDefault();
                } else {
                  //console.log(2);
                  return $scope.data.date;
                }
              }
            }
          ]
        });

        myPopup.then(function (res) {
          $scope.model.date = res;
        });
      }
    };
    vm.picktime = function () {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function () {
          let k = Service.picktime();
          k.then(function suss(data) {
            //console.log(data)
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
            //console.log(res)
          }
        });
      }
    };

    vm.save = function () {
      if($scope.model.date && $scope.model.time && $scope.model.data ){

      
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
          mode: "meetAppoint",
          wo: vm.listSelect,
          date: $scope.model
          
        };
        fachttp.model("meeting.php", req).then(
          function (response) {
            //console.log(response.data)
            $ionicLoading.hide();

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
                // $state.go('meeting.request1')
                $ionicHistory.goBack();
                
              },
              function () {

              }
            );
          },
          function err(err) {
  
            $ionicLoading.hide();
          }
        );
      },
      function () {


      })

    }else{
      $mdDialog
            .show(
              $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(true)
              .title("แจ้งเตือน")
              .textContent("ไม่สามารถบันทึกข้อมูลได้เนื่องจากกรอกข้อมูลไม่ครบถ้วน")
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
    }
      //console.log($scope.model.date)
      //console.log($scope.model.time)
      //console.log($scope.model.data)
      //console.log(vm.listSelect)

      

    }
  })

  .controller("meetingrequest1Ctrl", function (
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
    vm.goBack = function () {
      $ionicHistory.goBack();
    };
    $scope.openModalDetail = function (e) {
      $ionicModal
        .fromTemplateUrl("my-detail.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalDetail = modal;
          vm.detail = e;
          //console.log(e)
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


    function request1() {
      let req = {
        mode: 'request1',
      };

      fachttp.model('meeting.php', req).then(function (response) {
          //console.log(response);
          if (response.data.status == true) {
            $scope.list = response.data;
          } else {
            $scope.list = response.data;
          }
          //console.log(response);
        },
        function err(err) {
          $scope.list = [];
          //console.log(err);
          $scope.status = false;
        }
      );
    }

    request1()


  })

  .controller("meetingrequest2Ctrl", function (
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
    vm.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.openModalDetail = function (e) {
      $ionicModal
        .fromTemplateUrl("my-detail.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalDetail = modal;
          vm.detail = e;
          //console.log(e)
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

    function request2() {
      let req = {
        mode: 'request2',
      };

      fachttp.model('meeting.php', req).then(function (response) {
          //console.log(response);
          if (response.data.status == true) {
            $scope.list = response.data;
          } else {
            $scope.list = response.data;
          }
          //console.log(response);
        },
        function err(err) {
          $scope.list = [];
          //console.log(err);
          $scope.status = false;
        }
      );
    }

    request2()
  })
