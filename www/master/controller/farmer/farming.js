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

    // vm.drawstatus = false;
    // vm.newShape = null;
    // var all_overlays = [];
    // var selectedShape;
    // var map = new google.maps.Map(document.getElementById("maps"), {
    //   center: {
    //     lat: 13.713462,
    //     lng: 100.478819
    //   },
    //   mapTypeControl: true,
    //   streetViewControl: false,
    //   fullscreenControl: false,
    //   mapTypeControlOptions: {
    //     style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    //     mapTypeIds: ["satellite", "roadmap", "hybrid"]
    //   },
    //   mapTypeId: "roadmap",
    //   zoom: 18
    // });

    // var drawingManager = new google.maps.drawing.DrawingManager({
    //   drawingControl: false,
    //   drawingControlOptions: {
    //     position: google.maps.ControlPosition.RIGHT_CENTER,
    //     drawingModes: ["polygon"]
    //   },
    //   polygonOptions: {
    //     clickable: true,
    //     editable: true,
    //     draggable: false,
    //     fillColor: "red",
    //     strokeColor: "green",
    //     strokeWeight: 3
    //   },
    //   drawingMode: null
    // });

    // function clearSelection() {
    //   if (selectedShape) {
    //     selectedShape.setEditable(false);
    //     selectedShape = null;
    //   }
    // }

    // function setSelection(shape) {
    //   clearSelection();
    //   selectedShape = shape;
    //   shape.setEditable(true);
    // }

    // function deleteSelectedShape() {
    //   if (selectedShape) {
    //     selectedShape.setMap(null);

    //     vm.newShape = null;
    //   }
    // }

    // google.maps.event.addListener(drawingManager, "polygoncomplete", function(
    //   polygon
    // ) {
    //   /// Disable Controller//
    //   drawingManager.setDrawingMode(null);
    //   $scope.$apply(function() {
    //     vm.newShape = polygon;
    //   });

    //   onComplete();

    //   setSelection(vm.newShape);
    // });

    // function onComplete() {
    //   google.maps.event.addListener(
    //     vm.newShape.getPath(),
    //     "set_at",
    //     function() {
    //       //console.log(vm.newShape.getPath().g);
    //     }
    //   );

    //   //Insert point
    //   google.maps.event.addListener(
    //     vm.newShape.getPath(),
    //     "insert_at",
    //     function() {
    //       //console.log(vm.newShape.getPath().g);
    //     }
    //   );

    //   // add a marker at each coordinate

    //   //click shape
    //   google.maps.event.addListener(vm.newShape, "click", function(e) {
    //     //console.log(vm.newShape);
    //     setSelection(vm.newShape);
    //   });
    // }

    // drawingManager.setMap(map);

    // vm.delete = function() {
    //   deleteSelectedShape();
    //   vm.drawstatus = !vm.drawstatus;
    // };

    // vm.draw = function() {
    //   vm.drawstatus = !vm.drawstatus;
    //   drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    // };
  });
