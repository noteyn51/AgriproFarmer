angular
  .module("app")

  .controller(
    "nevCtrl",
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

      $scope.ww = false;
      $scope.myScroll = {
        height: "calc(100%)",
      };


      $scope.shouldHide = function () {
        // //console.log($state.current.name);
        switch ($state.current.name) {
          case "app.startPlantDetail":
            return true; 
          case "app.predict":
            return true; 
            case "app.singleReceive":
              return true; 
          case "app.multiReceive":
            return true; 
          case "app.farming":
            return true; 
          case "app.area":
            return true; 
          case "app.receive":
            return true;     
            case "app.recordEtc1":
              return true; 
          case "app.receive2":
            return true;
          case "app.deleteuser":
            return true;
          case "app.add3":
            return true;
          case "app.areaEdit":
            return true;
          case "app.area2":
            return true;
          case "app.createArea":
            return true;
          case "app.startPlant01":
            return true;
          case "app.startPlant":
            return true;
          case "app.startPlant1":
            return true;
          case "app.startPlant2":
            return true;
          case "app.startPlant3":
            return true;
          case "app.news":
            return true;
          case "app.newsDetail":
            return true;
          case "app.weather":
            return true;
          case "app.weatherDetail":
            return true;
          case "app.meeting":
            return true;
          case "app.meeting2":
            return true;
          case "app.meetingEvent":
            return true;
          case "app.controliot":
            return true;
          case "app.controliotwifi":
            return true;
          case "app.controliot2":
            return true;
          case "app.controliotSetting":
            return true;
          case "app.setting0":
            return true;
          case "app.setting":
            return true;
          case "app.setting1":
            return true;
          case "app.setting3":
            return true;
          case "app.setting4":
            return true;
          case "app.settingedit":
            return true;
          case "app.dayssetting":
            return true;
          case "app.hist":
            return true;
          case "app.detail":
            return true;
          case "app.detail2":
            return true;
          case "app.detailHist":
            return true;
          case "app.detailDisease":
            return true;
          case "app.detailGrowth":
            return true;
          case "app.detailDiseaseComment":
            return true;
          case "app.withdraw":
            return true;
          case "app.withdrawList":
            return true;
          case "app.withdrawHist":
            return true;
          case "app.withdrawHistDetail":
            return true;

          case "app.env":
            return true;
          case "app.usersetting":
            return true;
          case "app.martCheck":
            return true;
          case "app.addimg":
            return true;
          case "app.addviewbyid":
            return true;

          case "app.viewimg":
            return true;
          case "app.viewimgDetail":
            return true;
            case "app.addimgadd":
              return true;

          default:
            return false;
        }
      };

      $scope.farmermenu = function () {
        $ionicHistory.nextViewOptions({
          historyRoot: true,
        });
        $state.go("app.farmerMenu");
      };

      $scope.detail = function () {
        $state.go("app.detail");
      };

      $scope.appsetting = function () {
        $state.go("app.appsetting");
      };
    }
  );
