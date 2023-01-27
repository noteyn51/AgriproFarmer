angular
  .module("app")
  .controller("recordPlantCtrl", function(
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
    vm.pic_desc;
    //modal
    {
      $ionicModal
        .fromTemplateUrl("list_map.html", {
          scope: $scope,
          animation: "slide-in-up"
        })
        .then(function(modal) {
          $scope.modalListmap = modal;
        });

      $scope.openModalListmap = function() {
        $scope.modalListmap.show();
      };
      $scope.closeModalListmap = function() {
        $scope.modalListmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function() {
        $scope.modalListmap.remove();
      });
    }
    function onStart() {
      $ionicLoading.show();
      let url = $rootScope.ip + "recordPlant.php";
      let req = { mode: "selectsubfarm",global:$rootScope.global };
      $http.post(url, req).then(
        function suscess(response) {
          //console.log(response.data);
          vm.status = response.data.status

          if (response.data.status == true) {
            $scope.subfarm = response.data.result;
            $scope.selected = $scope.subfarm[0];
            $timeout(function(){
              vm.selectSub($scope.subfarm[0]);
              $ionicLoading.hide();

            },500)

          } else {
            $ionicLoading.hide();
          }
        },
        function err(err) {
          vm.status = false;

          $ionicLoading.hide();
        }
      );
    }

    onStart();

    // $scope.crop = JSON.parse($stateParams.crop);
    // $scope.subfarm = JSON.parse($stateParams.sub);
    // $scope.list = JSON.parse($stateParams.list);

    vm.listmap = function() {
      $scope.modalListmap.show();
      $ionicLoading.show();

      $timeout(function() {
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
            zoomControl: false
          });
          triangleCoordsListmap = [];
          polygonCoordsListmap = [];
          boundsListmap = new google.maps.LatLngBounds();
          $scope.abc = {
            lat: e.sub_lat.split(","),
            lng: e.sub_lng.split(",")
          };

          //console.log($scope.abc);

          // //////////console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i])
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
            fillOpacity: 0.35
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

    vm.selectSubBefore = function(e, index) {
      $scope.modalListmap.hide();
      vm.selectSub(e, index);
    };

    vm.selectSub = function(e, index) {
      $scope.subDetail = e;

      let map = new google.maps.Map(document.getElementById("mapbbb"), {
        zoom: 5,
        // center: bounds.getCenter(),
        center: new google.maps.LatLng(13.760412, 100.485357),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: "satellite",
        mapTypeControl: false,
        zoomControl: false
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
        lng: e.sub_lng.split(",")
      };

      $timeout(function() {
        for (let i = 0; i < $scope.abc.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.abc.lat[i]),
            lng: parseFloat($scope.abc.lng[i])
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
          fillOpacity: 0.35
        });

        all_overlays.push(bermudaTriangle);
        bermudaTriangle.setMap(map);

        map.fitBounds(bounds);
        map.panTo(bounds.getCenter());
      }, 100);
    };

    // if ($scope.subfarm.length > 0) {
    //   $scope.selected = $scope.subfarm[0];
    //   vm.selectSub($scope.subfarm[0]);
    // }

    vm.save = function(e) {
      //console.log(e);
      let k = JSON.stringify(e);
      //console.log(k);
      $state.go("app.recordPlant2", { list: k });
    };

    $scope.list = [
      { id: 1, name: "ผักบุ้ง", lastupdate: "2020-01-01" },
      { id: 2, name: "ผักกาด", lastupdate: "2020-02-01" },
      { id: 3, name: "กะเพรา", lastupdate: "2020-01-15" },
      { id: 4, name: "ผักชี", lastupdate: "2020-01-25" },
      { id: 5, name: "ผักคะน้า", lastupdate: "2020-01-05" }
    ];
  })

  .controller("recordPlant2Ctrl", function(
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
    //console.log("66");
    $scope.list = JSON.parse($stateParams.list);

    $scope.model = { date: null, data: null };
    let platform = ionic.Platform.platform();
    vm.pickdate = function(e) {
      if (platform == "android" || platform == "ios") {
        document.addEventListener("deviceready", function() {
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
          buttons: [
            { text: "Cancel" },
            {
              text: "<b>Save</b>",
              type: "button-positive",
              onTap: function(e) {
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

        myPopup.then(function(data) {
          $scope.model.date = data;
          //console.log(e);
          return;
        });
      }

    };

    vm.save = function(){
      //console.log($scope.list);
      //console.log($scope.model);
    } 

  });
