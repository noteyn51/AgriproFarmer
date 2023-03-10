angular
  .module("app")
  .controller("nevNewsCtrl", function (
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
        case "new.newsDetail":
          return true;
        default:
          return false;
      }
    };

    $scope.news = function () {
      $state.go("new.news");
    };

    $scope.notifi = function () {
      $state.go("new.notifi");
    };

    function onStart() {
      let req = { mode: "newsBadge" };
      fachttp.model("news.php", req).then(
        function (response) {
          //console.log(response)
          vm.badge = response.data;
          //console.log( vm.badge )
        },
        function err(err) {
          Service.timeout();
        }
      );
    }
    onStart();
  })

  .controller("newsCtrl", function (
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
    fachttp
  ) {
    let vm = this;

    function onStart() {
      let req = { mode: "news" };
      fachttp.model("news.php", req).then(
        function (response) {
          vm.newsDataB = [];
          //console.log(response.data)
          if(response.data.status == true){
            vm.newsDataH = response.data.result[0];
            for (let i = 1; i < response.data.result.length; i++) {
              vm.newsDataB[i - 1] = response.data.result[i];
            }

            //console.log(vm.newsDataH)
            $ionicSlideBoxDelegate.update();
          }else{

          }
          //console.log(vm.newsDataH);
          //console.log(vm.newsDataB);
        },
        function err(err) {
          Service.timeout();
        }
      );
    }

    onStart();

    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };
    //console.log("123");

    $scope.newList = {
      hightlight: {
        title:
          "????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????? 2 ????????????",
        date: "November 05, 2019",
        desc:
          "???????????????????????? ????????????????????????????????????????????????????????? ???.??????????????????????????? ???.??????????????? ??????????????????????????????????????????????????????????????????????????????????????? 62 ????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 2 ?????????????????????????????????????????????...????????????????????????????????? 23 ???.???.2562 ???????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????? ??????????????? ?????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???.??????????????? ???.??????????????????????????? ???.??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????? 61 ??????????????????????????? ??????????????? ???.???.???????????????????????? ????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????? ????????????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???.??????????????? ???.??????????????????????????? ???.??????????????? ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????????????????? 61 ?????? ???????????????????????????????????????????????????????????????????????? 30 ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 3 ?????? ??????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????",
        img: [
          "https://www.thairath.co.th/media/dFQROr7oWzulq5FZXl62iY10m4CbX2m1xp2gsXK2zO6qguplZB87Fbc0s5p3m4pSV0Y.jpg",
          "https://www.thairath.co.th/media/Dtbezn3nNUxytg04OS6DAt85rrPuZtN1hvK7cA8joB9EkC.jpg",
          "https://www.thairath.co.th/media/Dtbezn3nNUxytg04OS6DAt85rrPuZtN1z0zmzSYMjQ0UYe.jpg",
        ],
      },
      list: [
        {
          title: "????????????????????????????????????????????????????????? ???????????????????????? ?????????????????????????????????????????????",
          date: "November 01, 2019",
          desc:
            "??????????????????????????? ????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? (????????????.)???????????????????????????????????????????????????????????????????????? (??????.) ???????????????????????????????????????????????????????????????????????????????????????????????? (????????????????????????????????????) ???????????? ?????????. ????????????????????????????????? 2559",
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYSRn0r1pooaxELN3SEyyqJxvJ3xV0a6axy284T9A2jFxlTquS6N.jpg",
          ],
        },
        {
          title: "?????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????",
          date: "November 02, 2019",
          desc:
            '????????????????????????????????????????????????????????????????????????????????????????????????????????? 2 ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????? ????????? ????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 2540 ??????????????????????????? ????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ????????? ???????????????????????????????????????????????? ???????????????????????? ???????????????????????????????????? ????????? ??????????????????????????????????????????????????? ?????????????????? ???????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???????????? 2562 ??????????????????????????????????????? ??????????????????????????????????????????????????????????????? 2????????????????????????????????? ?????????????????????????????????????????????????????????????????? ?????????????????????????????????-???????????????????????????????????? "???????????????-19"?????????????????????????????? ???????????????????????????????????? : ????????????...??????????????????????????????????????????. ????????? 4 ???????????????????????????????????? ??????????????????????????? "??????????????????????????????????????????????????????" ??????????????? 15 ??????.???.63',
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYjm2p6DBXVWa7Vwkkma9wzTFdJzNzOn6injqtIo9I8zvdKVpSzV.jpg",
            "https://th-live-01.slatic.net/p/a3eb9c8d541aed7f69a95a683699074d.jpg",
          ],
        },

        {
          title:
            "????????????????????????????????? ????????????????????????????????????????????? 10,000 ????????? ????????????????????????????????????????????? ????????????????????????????????? ???????????????????????????????????????",
          date: "November 03, 2019",
          desc:
            '??????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????? ???????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????????????????? ??????????????? 5 ???????????????????????????????????? ???????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????? "???????????????????????????????????????" ????????? 15,000 ???????????? 30,000 ???????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????? 1 ??????????????????????????????????????????????????? SMS ?????????????????? ???.???.???. ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????? 2562/63 ?????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????? ???????????????????????????????????? 500 ????????? ???????????????????????????????????? 20 ????????? ?????????????????????????????????????????????????????????????????? 10,000 ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 4.57 ??????????????????????????????????????? ?????????????????????????????????????????? 25,793 ?????????????????????',
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYjuhvLAhTJ4HfJuSY5jUDjr3QkIssSp3DZ303Z3GTJUVLpG3ebg.jpg",
          ],
        },
      ],
    };

    //console.log($scope.newList);

    vm.detail = function (e) {
      let k = JSON.stringify(e);
      //console.log(k);
      $state.go("new.newsDetail", { detail: k });
    };
  })

  .controller("newsDetailCtrl", function (
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
    $stateParams,
    $sce
  ) {
    let vm = this;

    //console.log($stateParams);
    $scope.detail = JSON.parse($stateParams.detail);
    vm.urlink = $sce.trustAsResourceUrl($scope.detail.news_source);

    //console.log($scope.detail);
    // vm.detail = function () {
    //   $state.go("app.newsdetail");
    // };

    $scope.detailFrame = $sce.trustAsResourceUrl(
      "https://www.youtube.com/watch?v=EeCOe7XOjw0"
    );

    // vm.urlink = $sce.trustAsResourceUrl("img/vdo/clip1.mp4?autoplay=0");
    // vm.urlink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/n7NkdVCOil8");

    // $scope.detailFrame= $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=EeCOe7XOjw0");
  })

  .controller("notifiCtrl", function (
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
    fachttp
  ) {
    let vm = this;

    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };
    //console.log('222')
    function onStart() {
      let req = { mode: "notifi" };
      fachttp.model("news.php", req).then(
        function (response) {
          //console.log(response.data)
          vm.newsDataB = [];
          if(response.data.status == true){
            vm.newsDataH = response.data.result[0];
            for (let i = 1; i < response.data.result.length; i++) {
              vm.newsDataB[i - 1] = response.data.result[i];
            }
            $ionicSlideBoxDelegate.update();
          }else{
          }
   
          //console.log(vm.newsDataH);
          //console.log(vm.newsDataB);
        },
        function err(err) {
          //console.log(err)
          Service.timeout();
        }
      );
    }

    onStart();

    $scope.newList = {
      hightlight: {
        title:
          "????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????? 2 ????????????",
        date: "November 05, 2019",
        desc:
          "???????????????????????? ????????????????????????????????????????????????????????? ???.??????????????????????????? ???.??????????????? ??????????????????????????????????????????????????????????????????????????????????????? 62 ????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 2 ?????????????????????????????????????????????...????????????????????????????????? 23 ???.???.2562 ???????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????? ??????????????? ?????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???.??????????????? ???.??????????????????????????? ???.??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????? 61 ??????????????????????????? ??????????????? ???.???.???????????????????????? ????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????? ????????????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???.??????????????? ???.??????????????????????????? ???.??????????????? ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????????????????? 61 ?????? ???????????????????????????????????????????????????????????????????????? 30 ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 3 ?????? ??????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????",
        img: [
          "https://www.thairath.co.th/media/dFQROr7oWzulq5FZXl62iY10m4CbX2m1xp2gsXK2zO6qguplZB87Fbc0s5p3m4pSV0Y.jpg",
          "https://www.thairath.co.th/media/Dtbezn3nNUxytg04OS6DAt85rrPuZtN1hvK7cA8joB9EkC.jpg",
          "https://www.thairath.co.th/media/Dtbezn3nNUxytg04OS6DAt85rrPuZtN1z0zmzSYMjQ0UYe.jpg",
        ],
      },
      list: [
        {
          title: "????????????????????????????????????????????????????????? ???????????????????????? ?????????????????????????????????????????????",
          date: "November 01, 2019",
          desc:
            "??????????????????????????? ????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? (????????????.)???????????????????????????????????????????????????????????????????????? (??????.) ???????????????????????????????????????????????????????????????????????????????????????????????? (????????????????????????????????????) ???????????? ?????????. ????????????????????????????????? 2559",
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYSRn0r1pooaxELN3SEyyqJxvJ3xV0a6axy284T9A2jFxlTquS6N.jpg",
          ],
        },
        {
          title: "?????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????",
          date: "November 02, 2019",
          desc:
            '????????????????????????????????????????????????????????????????????????????????????????????????????????? 2 ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????? ????????? ????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 2540 ??????????????????????????? ????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ????????? ???????????????????????????????????????????????? ???????????????????????? ???????????????????????????????????? ????????? ??????????????????????????????????????????????????? ?????????????????? ???????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ???????????? 2562 ??????????????????????????????????????? ??????????????????????????????????????????????????????????????? 2????????????????????????????????? ?????????????????????????????????????????????????????????????????? ?????????????????????????????????-???????????????????????????????????? "???????????????-19"?????????????????????????????? ???????????????????????????????????? : ????????????...??????????????????????????????????????????. ????????? 4 ???????????????????????????????????? ??????????????????????????? "??????????????????????????????????????????????????????" ??????????????? 15 ??????.???.63',
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYjm2p6DBXVWa7Vwkkma9wzTFdJzNzOn6injqtIo9I8zvdKVpSzV.jpg",
            "https://th-live-01.slatic.net/p/a3eb9c8d541aed7f69a95a683699074d.jpg",
          ],
        },

        {
          title:
            "????????????????????????????????? ????????????????????????????????????????????? 10,000 ????????? ????????????????????????????????????????????? ????????????????????????????????? ???????????????????????????????????????",
          date: "November 03, 2019",
          desc:
            '??????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????? ???????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????? ???????????????????????????????????????????????????????????? ??????????????? 5 ???????????????????????????????????? ???????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????? "???????????????????????????????????????" ????????? 15,000 ???????????? 30,000 ???????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????? 1 ??????????????????????????????????????????????????? SMS ?????????????????? ???.???.???. ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ??????????????????????????? 2562/63 ?????????????????????????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????? ???????????????????????????????????? 500 ????????? ???????????????????????????????????? 20 ????????? ?????????????????????????????????????????????????????????????????? 10,000 ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 4.57 ??????????????????????????????????????? ?????????????????????????????????????????? 25,793 ?????????????????????',
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYjuhvLAhTJ4HfJuSY5jUDjr3QkIssSp3DZ303Z3GTJUVLpG3ebg.jpg",
          ],
        },
      ],
    };

    //console.log($scope.newList);

    vm.detail = function (e) {
      let k = JSON.stringify(e);
      //console.log(k);
      $state.go("new.notifiDetail", { detail: k });
    };
  })

  .controller("notifiDetailCtrl", function (
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
    $stateParams,
    $sce
  ) {
    let vm = this;

    //console.log($stateParams);
    $scope.detail = JSON.parse($stateParams.detail);
    vm.urlink = $sce.trustAsResourceUrl($scope.detail.news_source);

    //console.log($scope.detail);
    // vm.detail = function () {
    //   $state.go("app.newsdetail");
    // };

    $scope.detailFrame = $sce.trustAsResourceUrl(
      "https://www.youtube.com/watch?v=EeCOe7XOjw0"
    );

    // vm.urlink = $sce.trustAsResourceUrl("img/vdo/clip1.mp4?autoplay=0");
    // vm.urlink = $sce.trustAsResourceUrl("https://www.youtube.com/embed/n7NkdVCOil8");

    // $scope.detailFrame= $sce.trustAsResourceUrl("https://www.youtube.com/watch?v=EeCOe7XOjw0");
  });
