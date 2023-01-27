angular
  .module("app")
  .controller("farmingCtrl", function (
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
    $mdDialog
  ) {
    let vm = this;
<<<<<<< HEAD
    console.log('1234')
=======
>>>>>>> a0092cd (Initial commit)

    $scope.chart = [
      {
        percent: 10,
        unit: "percent",
        options: {
          animate: { duration: 1000, enabled: true },
          barColor: "#1656e0",
          scaleColor: "#1656e0",
          lineWidth: 3,
          lineCap: "round",
        },
      },
      {
        percent: 50,
        unit: "temp",
        options: {
          animate: { duration: 1000, enabled: true },
          barColor: "#e3051e",
          scaleColor: "#e3051e",
          lineWidth: 3,
          lineCap: "round",
        },
      },
      {
        percent: 70,
        unit: "percent",
        options: {
          animate: { duration: 1000, enabled: true },
          barColor: "#734e03",
          scaleColor: "#734e03",
          lineWidth: 3,
          lineCap: "round",
        },
      },
    ];

    //console.log($scope.chart);
    $scope.percent = 65;
    $scope.options = {
      animate: { duration: 2000, enabled: true },
      barColor: "#1656e0",
      scaleColor: "#1656e0",
      lineWidth: 3,
      lineCap: "round",
    };

    vm.goBack = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });


      $ionicHistory.clearCache().then(function () {
      $state.go('app.farmerMenu');

    });

    };

    vm.receiveLot  = function () {
      $state.go("app.receivelot")

    };
    vm.addimg = function(){
      $state.go("app.addimg")
    }

    vm.viewimg = function(){
      $state.go("app.viewimg")
    }

    vm.detail = function(){
      $state.go("app.detail")
    }
    vm.startPlant = function () {
      $state.go("app.startPlant");
    };

    vm.recordPlant = function() {
      $state.go("app.recordPlant");
    };

    vm.predictPlant = function () {
      $state.go("app.predictPlant");
    };

    vm.recordResult = function() {
      $state.go("app.recordResult");
    };

    vm.recordEtc = function () {
      $state.go("apps.recordEtc");
    };

    vm.receive = function () {
      $state.go("app.receive");
    };

  


  });
