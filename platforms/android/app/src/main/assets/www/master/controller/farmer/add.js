angular
  .module("app")
  .controller(
    "addCtrl",
    function ($http, $rootScope, $ionicHistory, $state, $scope) {
      let vm = this;
      // $scope.data = [];
      function onStart() {
        let url = $rootScope.ip + "login.php";
        let req = { mode: "user", config: $rootScope.global };
        $http.post(url, req).then(
          function suscess(response) {
            if (response.data.status == true) {
              $scope.data = response.data;
            } else {
            }
          },
          function err(err) {}
        );
      }

      onStart();

      $scope.dtOptions = {
        searching: false,
        paging: true,
        ordering: false,
        info: false, // Showing 1 to 6 of 6 entries
        lengthChange: false,
      };

      vm.farmerdetail = function (e) {
        let myJSON = JSON.stringify(e);
        $state.go("app.add2", { farmer: myJSON });
      };
    }
  )

  .controller(
    "add2Ctrl",
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
      $mdDialog
    ) {
      let vm = this;
      $scope.aaa = function () {
        //console.log("10");
      };
      $scope.doRefresh = function () {
        // here refresh data code
        $scope.$broadcast("scroll.refreshComplete");
        $scope.$apply();
        onStart();
      };
      function onStart() {
        let url = $rootScope.ip + "createArea.php";
        let req = { mode: "selectCrop", config: $rootScope.farmerdetail };
        $http.post(url, req).then(
          function suscess(response) {
            //console.log(response);
            if (response.data.status == true) {
              $scope.data = response.data;
              //console.log($scope.data);
            } else {
              $scope.data = response.data;
            }
          },
          function err(err) {}
        );
      }

      onStart();

      $ionicModal
        .fromTemplateUrl("my-modaledit.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modaledit = modal;
        });

      $scope.openModalEdit = function () {
        $scope.modaledit.show();
      };
      $scope.closeModalEdit = function () {
        $scope.modaledit.hide();
      };

      $ionicModal
        .fromTemplateUrl("my-map.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalmap = modal;
        });

      $scope.openModalMap = function () {
        $scope.modalmap.show();
      };
      $scope.closeModalMap = function () {
        $scope.modalmap.hide();
      };

      $scope.$on("$destroy", function () {
        $scope.modalmap.remove();
      });

      //Set $scope.map to null
      $scope.$on("modalmap.hidden", function () {
        $scope.$on("$destroy", function () {});
      });

      let platform = ionic.Platform.platform();

      vm.updatepickdate = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.editdata.crop_startt = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.editdata.crop_startt = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };
      vm.updatepickdateto = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.editdata.crop_endt = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.editdata.crop_endt = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };

      vm.edit = function (e) {
        $scope.modaledit.show();
        $scope.editdata = angular.copy(e);
        //console.log($scope.editdata);
        $scope.positionEdit = {
          lat: $scope.editdata.crop_lat.split(","),
          lng: $scope.editdata.crop_lng.split(","),
        };
      };

      vm.deleteCrop = function () {
        mobiscroll.confirm({
          title: "Use location service?",
          message:
            "Help apps determine location. This means sending anonymous location data, even when no apps are running.",
          okText: "Agree",
          cancelText: "Disagree",
          callback: function (res) {
            if (res) {
              $ionicLoading.show();
              let url = $rootScope.ip + "createArea.php";
              let req = { mode: "deleteCrops", data: $scope.editdata };
              $http.post(url, req).then(
                function (response) {
                  if (response.data.status == true) {
                    $ionicLoading.hide();
                    $timeout(function () {
                      delete $scope.data;
                      $scope.modaledit.hide();
                      mobiscroll.toast({
                        message: "ลบ Crop เรียบร้อย",
                        color: "success",
                      });
                      onStart();
                    }, 200);
                  } else {
                    Service.timeout();
                  }
                },
                function err(err) {
                  Service.timeout();
                }
              );
            }
          },
        });
      };

      vm.addcrop = function () {
        $state.go("app.add3");
      };

      vm.cropdetail = function (e) {
        let myJSON = JSON.stringify(e);
        $state.go("app.add4", { crop: myJSON });
      };

      $scope.checkUpdate = function () {
        if ($scope.editdata) {
          if (
            !$scope.editdata.crop_name ||
            !$scope.editdata.crop_desc ||
            !$scope.editdata.crop_startt ||
            !$scope.editdata.crop_endt
          ) {
            return true;
          } else {
            return false;
          }
        }
      };

      vm.editMap = function (e) {
        //console.log(e);
        $scope.maptitle = e;
        var locations = [];
        var farmname = [];
        // $scope.modalmap.show();
        $ionicLoading.show();

        function initMap() {
          var map = new google.maps.Map(document.getElementById("map"), {
            zoom: 6,
            center: { lat: 10.778042, lng: 100.565925 },
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
          });

          //         var icon = {
          //     url: "htpngtps://i.ya-webdesign.com/images/map-marker-icons-png.", // url
          //     scaledSize: new google.maps.Size(50, 50), // scaled size
          //     origin: new google.maps.Point(0,0), // origin
          //     anchor: new google.maps.Point(0, 0) // anchor
          // };

          var markers = locations.map(function (location, i) {
            return new google.maps.Marker({
              position: location,

              label: {
                text: farmname[i],
                color: "white",
                fontSize: "18px",
              },
            });
          });

          var infowindow = new google.maps.InfoWindow({
            content: "",
            maxWidth: 200,
          });

          for (let i = 0; i < locations.length; i++) {
            google.maps.event.addListener(
              markers[i],
              "click",
              function (marker) {
                $scope.displayDetailCluster = $scope.detailcluster[i];

                let contentString =
                  '<ion-content overflow-scroll="true"><ion-scroll>' +
                  '<h1 class="firstHeading"> ' +
                  $scope.displayDetailCluster.farm_name +
                  "</h1>" +
                  "<br><b>Crop</b><br>" +
                  $scope.displayDetailCluster.crop_id +
                  "<br> " +
                  "<br><b>รายละเอียด</b><br>" +
                  $scope.displayDetailCluster.farm_desc +
                  "<br> " +
                  // "<p>พันธุ์ : - <br> " +
                  // "<p>อายุ : - <br> " +
                  // "<p>อื่นๆ : - <br> " +
                  "<br><p>พื้นที่ : " +
                  $scope.displayDetailCluster.farm_area_farm +
                  " &nbspไร่<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  $scope.displayDetailCluster.farm_area_wah +
                  " ตารางวา<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  +$scope.displayDetailCluster.farm_area_work +
                  " งาน<br> " +
                  "<br><b>วันที่สร้าง</b><br>" +
                  $scope.displayDetailCluster.farm_startt +
                  "<br> " +
                  "<br><b>วันที่สิ้นสุด</b><br>" +
                  $scope.displayDetailCluster.farm_endt +
                  "<br> " +
                  "</ion-scroll></ion-content>";

                mobiscroll.alert({
                  title: $scope.displayDetailCluster.crop_id,
                  message:
                    "<div>" +
                    "<br><b>ชื่อฟาร์ม</b> : " +
                    $scope.displayDetailCluster.farm_name +
                    "<br><br><b>รายละเอียด</b> : " +
                    $scope.displayDetailCluster.farm_desc +
                    "<br><br><b>ผู้ดูแล</b> : " +
                    $scope.displayDetailCluster.createname.mob_fname +
                    " " +
                    $scope.displayDetailCluster.createname.mob_lname +
                    "<br><br><b>พื้นที่</b>  " +
                    "<br>" +
                    $scope.displayDetailCluster.farm_area_farm +
                    " <b>ไร่</b>" +
                    "<br>" +
                    $scope.displayDetailCluster.farm_area_wah +
                    " <b>ตารางวา</b>" +
                    "<br>" +
                    $scope.displayDetailCluster.farm_area_work +
                    " <b>งาน</b>" +
                    "<br><br><b>วันที่สร้าง</b>  " +
                    "<br>" +
                    $scope.displayDetailCluster.farm_startt +
                    "<br><br><b>วันที่สิ้นสุด</b>  " +
                    "<br>" +
                    $scope.displayDetailCluster.farm_endt +
                    "<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p/>" +
                    "</div>",
                  callback: function () {},
                });

                // infowindow.close();
                // infowindow.setContent(contentString);
                // infowindow.open(map, markers[i]);
              }
            );
          }

          // Add a marker clusterer to manage the markers.
          var markerCluster = new MarkerClusterer(map, markers, {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
          });
        }

        let url = $rootScope.ip + "createArea.php";
        let req = {
          mode: "selectCluster",
          config: e.crop_code,
          global: $rootScope.global,
        };
        $http.post(url, req).then(
          function suscess(response) {
            //console.log(response.data);
            if (response.data.status == true) {
              $scope.modalmap.show();
              $ionicLoading.hide();

              $scope.detailcluster = response.data.result;

              for (let i = 0; i < response.data.result.length; i++) {
                let k = {
                  lat: response.data.result[i].farm_lat.split(","),
                  lng: response.data.result[i].farm_lng.split(","),
                };

                let j = {
                  lat: parseFloat(k.lat[0]),
                  lng: parseFloat(k.lng[0]),
                };

                locations.push(j);
                farmname.push(response.data.result[i].farm_name);
              }

              //console.log(locations);
              //console.log(farmname);

              initMap();
            } else {
              mobiscroll.alert({
                title: "แจ้งเตือน",
                message: "ไม่มีรายการเพาะปลูกใน Crop นี้",
                callback: function () {
                  // mobiscroll.toast({
                  //     message: 'Alert closed'
                  // });
                },
              });
              $ionicLoading.hide();
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.updateCrop = function () {
        $ionicLoading.show();
        let url = $rootScope.ip + "createArea.php";
        let req = { mode: "editCrop", data: $scope.editdata };
        //console.log(req);
        $http.post(url, req).then(
          function (response) {
            //console.log(response);
            if (response.data.status == true) {
              $ionicLoading.hide();
              $timeout(function () {
                delete $scope.data;
                $scope.modaledit.hide();
                mobiscroll.toast({
                  message: "แก้ไข Crop เรียบร้อย",
                  color: "success",
                });
                onStart();
              }, 200);
            } else {
              Service.timeout();
            }
          },
          function err(err) {
            Service.timeout();
          }
        );
      };

      vm.search = function () {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog
          .prompt()
          .title("ค้นหา")
          .textContent(
            "ป้อนข้อมูล รหัสเกษตรกร หรือ ชื่อ,นามสกุล *หากต้องการค้นหาทั้งหมดไม่ต้องใส่ข้อมูล* "
          )
          .placeholder("รหัสเกษตรกร,ชือ,นามสกุล")
          .ariaLabel("รหัสเกษตรกร,ชือ,นามสกุล")
          .initialValue()
          .targetEvent()
          .required(false)
          .ok("ค้นหา")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function (result) {
            //console.log(result);
            $scope.searchuser = result;
          },
          function (e) {}
        );
      };
    }
  )

  .controller(
    "add100Ctrl",
    function (
      $ionicHistory,
      $state,
      $scope,
      $ionicHistory,
      $rootScope,
      Service,
      $cordovaGeolocation,
      deviceService,
      $ionicLoading,
      $timeout,
      $http
    ) {
      let vm = this;

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

    
function initMap() {
  
  const map = new google.maps.Map(
    document.getElementById("map"),
    {
      center: { lat: 40.749933, lng: -73.98633 },
      zoom: 13,
      mapTypeControl: false,
    }
  );
  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input") ;
  const biasInputElement = document.getElementById(
    "use-location-bias"
  ) ;
  const strictBoundsInputElement = document.getElementById(
    "use-strict-bounds"
  ) 
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
    types: ["establishment"],
  };

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo("bounds", map);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById(
    "infowindow-content"
  ) ;

  infowindow.setContent(infowindowContent);

  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
  });

  autocomplete.addListener("place_changed", () => {
    console.log('click')
    infowindow.close();
    marker.setVisible(false);

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent =
      place.formatted_address;
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    const radioButton = document.getElementById(id);
    radioButton.addEventListener("click", () => {
      console.log('1click')
      autocomplete.setTypes(types);
      input.value = "";
    });
  }

  setupClickListener("changetype-all", []);
  setupClickListener("changetype-address", ["address"]);
  setupClickListener("changetype-establishment", ["establishment"]);
  setupClickListener("changetype-geocode", ["geocode"]);
  setupClickListener("changetype-cities", ["(cities)"]);
  setupClickListener("changetype-regions", ["(regions)"]);

  biasInputElement.addEventListener("change", () => {
    if (biasInputElement.checked) {
      autocomplete.bindTo("bounds", map);
    } else {
      // User wants to turn off location bias, so three things need to happen:
      // 1. Unbind from map
      // 2. Reset the bounds to whole world
      // 3. Uncheck the strict bounds checkbox UI (which also disables strict bounds)
      autocomplete.unbind("bounds");
      autocomplete.setBounds({ east: 180, west: -180, north: 90, south: -90 });
      strictBoundsInputElement.checked = biasInputElement.checked;
    }

    input.value = "";
  });

  strictBoundsInputElement.addEventListener("change", () => {
    autocomplete.setOptions({
      strictBounds: strictBoundsInputElement.checked,
    });

    if (strictBoundsInputElement.checked) {
      biasInputElement.checked = strictBoundsInputElement.checked;
      autocomplete.bindTo("bounds", map);
    }

    input.value = "";
  });

  $(document).on(
    {
        DOMNodeInserted: function () {
            $(".pac-item, .pac-item span", this).addClass("needsclick");
        },
    },
    ".pac-container"
);
}

initMap();

      // window.initMap = initMap;

      // $scope.searchText ='62 /40'
      // var geocoder = google.maps.Geocoder;

      // geocoder = new google.maps.Geocoder();

      // console.log(geocoder);

      // $scope.search = function () {
      //   geocode({ address:$scope.searchText});
      // };

      // function geocode(request) {

      //   console.log(request)

      //   geocoder
      //     .geocode(request)
      //     .then((result) => {
      //       const { results } = result;

      //       console.log(result)

      //       // map.setCenter(results[0].geometry.location);
      //       // marker.setPosition(results[0].geometry.location);
      //       // marker.setMap(map);
      //       // responseDiv.style.display = "block";
      //       // response.innerText = JSON.stringify(result, null, 2);
      //       return results;
      //     })
      //     .catch((e) => {
      //       alert("Geocode was not successful for the following reason: " + e);
      //     });
      // }
    }
  )

  .directive('disableTap', function($timeout) {
    return {
      link: function() {
  
        $timeout(function() {
          document.querySelector('.pac-container').setAttribute('data-tap-disabled', 'true')
        },500);
      }
    };
  })

  .controller(
    "add3Ctrl",
    function (
      $ionicHistory,
      $state,
      $scope,
      $ionicHistory,
      $rootScope,
      Service,
      $cordovaGeolocation,
      deviceService,
      $ionicLoading,
      $timeout
    ) {
      let vm = this;

      function callPosition() {
        var posOptions = { timeout: 10000, enableHighAccuracy: true };
        return $cordovaGeolocation.getCurrentPosition(posOptions).then(
          function (position) {
            vm.position = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            let latlng =
              "" +
              position.coords.latitude +
              "," +
              position.coords.longitude +
              "";

            return position;
          },
          function (err) {
            // error
          }
        );
      }
      let platform = ionic.Platform.platform();
      //console.log(platform);
      function onStart() {
        function checkGPS() {
          //Call status GPS from Service and return value to statusgps
          return new Promise(function (resolve, reject) {
            deviceService.checkGPS(function (e) {
              resolve(e);
            });
          });
        }

        async function main() {
          let statusgps = await checkGPS();
          if (statusgps == "GPS_OFF") {
            if (platform == "android") {
              deviceService.opengpsAndroid(function (e) {
                if (e == "force_gps") {
                  return callPosition();
                } else {
                  return callPosition();
                }

                return callPosition();
              });
            } else if (platform == "ios") {
            }
          } else {
            $ionicLoading.show();
            //console.log("1324");
            vm.alert = "on";
            return callPosition();
          }
        }

        if (
          platform == "win32" ||
          platform == "ios" ||
          platform == "macintel"
        ) {
          return callPosition();
        } else if (platform == "android") {
          // Android check gps ใน function
          return main();
        }
      }
      let abc = onStart();

      var markers = [];

      abc.then(function (response) {
        console.log(response)
        try {
          map.setCenter({
            lat: response.coords.latitude,
            lng: response.coords.longitude,
          });
          var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.BOUNCE,
            position: {
              lat: response.coords.latitude,
              lng: response.coords.longitude,
            },
          });
              
        markers.push(marker);
        marker.setMap(map);
        $ionicLoading.hide();
  
        } catch (error) {
          
        }
      
  
      });

      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      function clearMarkers() {
        setMapOnAll(null);
      }
      vm.here = function () {
        let ab = onStart();
        clearMarkers();
        markers = [];
        ab.then(function (response) {
          map.setCenter({
            lat: response.coords.latitude,
            lng: response.coords.longitude,
          });

          var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.BOUNCE,
            position: {
              lat: response.coords.latitude,
              lng: response.coords.longitude,
            },
          });

          markers.push(marker);
          marker.setMap(map);
          //console.log(markers);
          $ionicLoading.hide();
        });
      };

      var all_overlays = [];
      var selectedShape;
      $scope.PolygonPatch = [];
      $scope.data;

      vm.drawstatus = false;
      vm.newShape = null;

      function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement("div");
        controlUI.style.backgroundColor = "#fff";
        controlUI.style.border = "2px solid #fff";
        controlUI.style.borderRadius = "10px";
        controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
        controlUI.style.cursor = "pointer";
        controlUI.style.marginBottom = "22px";
        controlUI.style.marginTop = "10px";
        controlUI.style.marginRight = "10px";
        controlUI.style.textAlign = "center";
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement("div");
        controlText.style.color = "rgb(25,25,25)";
        controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        controlText.style.fontSize = "16px";
        controlText.style.lineHeight = "38px";
        controlText.style.paddingLeft = "5px";
        controlText.style.paddingRight = "5px";

        controlText.innerHTML = "<i class='icon ion-trash-a'> ลบเส้น";
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener("click", function () {
          deleteSelectedShape();
        });
      }

      function clearSelection() {
        if (selectedShape) {
          selectedShape.setEditable(false);
          selectedShape = null;
        }
      }

      function setSelection(shape) {
        infowindow.open(map);
        clearSelection();
        selectedShape = shape;
        shape.setEditable(true);
      }

      function deleteSelectedShape() {
        if (selectedShape) {
          infowindow.close();
          $scope.PolygonPatch = [];
          selectedShape.setMap(null);
          // To show:
          drawingManager.setOptions({
            drawingControl: false,
          });

          vm.newShape = null;
        }
      }

      function showoutput() {
        alert($scope.data);
      }

      vm.delete = function () {
        deleteSelectedShape();
        vm.drawstatus = !vm.drawstatus;
      };

      vm.draw = function () {
        vm.drawstatus = !vm.drawstatus;
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      };

      //Set map
      var map = new google.maps.Map(document.getElementById("maps"), {
        center: {
          lat: 13.713462,
          lng: 100.478819,
        },
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          mapTypeIds: ["satellite", "roadmap"],
        },
        mapTypeId: "satellite",
        zoom: 18,
      });

      vm.search = function () {};

      ///////////////

      // Create the search box and link it to the UI element.
      const input = document.getElementById("pac-input");
      const searchBox = new google.maps.places.SearchBox(input);
      // map.controls[google.maps.ControlPosition.LEFT].push(input);
      // Bias the SearchBox results towards current map's viewport.
      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
      });
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      // google.maps.event.addListener(searchBox, "places_changed", function () {
      //   console.log("sdsd");
      // });

      var timeoutPromise;

      // var input = document.getElementById('pac-input');
      google.maps.event.addDomListener(input, "keyup", function (event) {
        $timeout.cancel(timeoutPromise);
        timeoutPromise = $timeout(function () {
          console.log(input)
          // google.maps.event.trigger(input, "keydown", { keyCode: 13 });
          console.log("search");
        }, 300);
      });

      //   document.getElementById('my-button').onclick = function () {
      //     var input = document.getElementById('pac-input');

      //     google.maps.event.trigger(input, 'focus', {});
      //     google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
      //     google.maps.event.trigger(this, 'focus', {});

      // };

      searchBox.addListener("places_changed", () => {
        console.log('click')
        // $ionicLoading.show();
        const places = searchBox.getPlaces();
        console.log(places)
        if (places.length == 0) {
          return;
        }
        // Clear out the old markers.
        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
        console.log(places);
        markers.push(
          new google.maps.Marker({
            map,
            title: places[0].name,
            position: places[0].geometry.location,
          })
        );

        if (places[0].geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(places[0].geometry.viewport);
        } else {
          bounds.extend(places[0].geometry.location);
        }

        // places.forEach((place) => {
        //   if (!place.geometry) {
        //     console.log("Returned place contains no geometry");
        //     return;
        //   }
        //   $ionicLoading.hide();

        //   // Create a marker for each place.
        //   markers.push(
        //     new google.maps.Marker({
        //       map,
        //       title: place.name,
        //       position: place.geometry.location,
        //     })
        //   );

        //   if (place.geometry.viewport) {
        //     // Only geocodes have viewport.
        //     bounds.union(place.geometry.viewport);
        //   } else {
        //     bounds.extend(place.geometry.location);
        //   }

        // });
        map.fitBounds(bounds);
      });

      ///////////////

      var infowindow = new google.maps.InfoWindow();

      var drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
          drawingModes: ["polygon"],
        },
        polygonOptions: {
          clickable: true,
          editable: true,
          draggable: false,
          fillColor: "red",
          strokeColor: "green",
          strokeWeight: 3,
        },
        drawingMode: null,
      });
      infowindow.open(map);
      google.maps.event.addListener(
        drawingManager,
        "polygoncomplete",
        function (polygon) {
          /// Disable Controller//
          drawingManager.setOptions({
            drawingControl: false,
          });

          $scope.$apply(function () {
            vm.newShape = polygon;
            vm.newShape.type = polygon;
          });

          drawingManager.setDrawingMode(null);

          //Edit point
          google.maps.event.addListener(
            vm.newShape.getPath(),
            "set_at",
            function () {
              // //console.log(newShape.getPath())
              cal(vm.newShape.getPath());
            }
          );

          //Insert point
          google.maps.event.addListener(
            vm.newShape.getPath(),
            "insert_at",
            function () {
              //console.log(vm.newShape.getPath());
              cal(vm.newShape.getPath());
            }
          );

          //click shape
          google.maps.event.addListener(vm.newShape, "click", function (e) {
            //console.log(vm.newShape.getPath());
            setSelection(vm.newShape);
          });
          setSelection(vm.newShape);

          // คำนวนและแสดง
          function cal(patch) {
            $scope.PolygonPatch = [];
            for (var i = 0; i < patch.length; i++) {
              $scope.PolygonPatch.push({
                lat: patch.getAt(i).lat().toFixed(5),
                lng: patch.getAt(i).lng().toFixed(5),
              });
            }
            //console.log($scope.PolygonPatch);

            // $scope.PolygonPatch = coordinates;

            // $scope.PolygonPatch.push(coordinates)
            // //console.log($scope.PolygonPatch)
            // ตารางเมตร
            var areaM2 = google.maps.geometry.spherical.computeArea(patch);
            // เอเคอร์
            var acreFormula = 0.00024711,
              // ไร่
              farmFormula = 0.000625,
              //ตารางวา
              wahFormula = 0.25,
              //งาน
              workFormula = 0.0025;

            var rai, ngan, wah;
            var modRai, modNgan, modWah;

            rai = parseInt(areaM2 / 1600);
            modRai = areaM2 % 1600;

            ngan = parseInt(modRai / 400);
            modNgan = modRai % 400;

            wah = parseInt(modNgan / 4);

            var areaAC = (areaM2 * acreFormula).toFixed(3);
            var areaFarm = (areaM2 * farmFormula).toFixed(3);
            var areaWah = (areaM2 * wahFormula).toFixed(3);
            var areaWork = (areaM2 * workFormula).toFixed(3);

            vm.area = {
              m2: areaM2.toFixed(3),
              ac: areaAC,
              // farm: areaFarm,
              // work: areaWork,
              // wah: areaWah,
              farm: rai,
              work: ngan,
              wah: wah,
            };
            //console.log(vm.area);

            // //console.log("ตารางเมตร", areaM2.toFixed(3))
            // //console.log("ไร่ , =", areaFarm.toFixed(3))
            // //console.log("เอเคอร์, =", areaAC.toFixed(3))
            // //console.log("ตารางวา =", areaWah.toFixed(3))
            // //console.log("งาน =", areaWork.toFixed(3))

            // infowindow.setContent("Area/ตารางเมตร =" + vm.area.m2 + " sq meters<br>" +
            //   "Area/เอเคอร์ =" + vm.area.ac + " Acre<br>");
            infowindow.setContent(
              '<div id="contentmap">' +
                '<div id="bodyContent" >' +
                "<p>" +
                "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
                "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
                vm.area.m2 +
                " ตารางเมตร<br> " +
                "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                vm.area.farm +
                " &nbspไร่<br> " +
                "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                vm.area.work +
                " งาน<br> " +
                "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                vm.area.wah +
                " ตารางวา<br> " +
                "</div>"
            );

            infowindow.setPosition(polygon.getPath().getAt(0));
          }

          infowindow.open(map);
          cal(polygon.getPath());
        }
      );

      // google.maps.event.addDomListener(document.getElementById('bt1'), 'click', deleteSelectedShape);
      // google.maps.event.addDomListener(document.getElementById('bt2'), 'click', showoutput);

      drawingManager.setMap(map);

      vm.save = function () {
        if ($scope.PolygonPatch.length) {
          // $ionicHistory.nextViewOptions({
          //   disableBack: true
          // });
          $rootScope.area = {
            area: vm.area,
            position: $scope.PolygonPatch,
          };
          //console.log($rootScope.area);
          //console.log($rootScope.farmerdetail);

          $state.go("app.createArea");
        } else {
        }
      };

      // google.maps.event.addDomListener(window, "load", initMap);
    }
  )

  .controller(
    "add4Ctrl",
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
      $ionicSlideBoxDelegate
    ) {
      let vm = this;

      $scope.crop = { frm_code: $rootScope.global.mob_farm_code };
      //console.log($scope.crop);

      $rootScope.cropSet = $scope.crop;

      $scope.doRefresh = function () {
        // here refresh data code
        $scope.$broadcast("scroll.refreshComplete");
        $scope.$apply();
        onStart();
      };

      function onStart() {
        let url = $rootScope.ip + "createArea.php";
        let req = {
          mode: "selectFarm",
          config: $rootScope.cropSet,
          global: $rootScope.global,
        };
        $http.post(url, req).then(
          function suscess(response) {
            //console.log(response);
            if (response.data.status == true) {
              $scope.data = response.data;
            } else {
              $scope.data = response.data;
            }
          },
          function err(err) {
            $scope.data = [];
          }
        );
      }

      onStart();

      $ionicModal
        .fromTemplateUrl("my-modaledit.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modaledit = modal;
        });

      $scope.openModalEdit = function () {
        $scope.modaledit.show();
      };
      $scope.closeModalEdit = function () {
        $scope.modaledit.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modaledit.remove();
      });

      $ionicModal
        .fromTemplateUrl("my-map.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalmap = modal;
        });

      $scope.openModalMap = function () {
        $scope.modalmap.show();
      };
      $scope.closeModalMap = function () {
        $scope.modalmap.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalmap.remove();
      });

      $ionicModal
        .fromTemplateUrl("my-crop.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalcrop = modal;
        });

      $scope.openModalCrop = function () {
        $scope.modalcrop.show();
      };
      $scope.closeModalCrop = function () {
        $scope.modalcrop.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalcrop.remove();
      });

      let platform = ionic.Platform.platform();

      vm.updatepickdate = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.editdata.farm_startt = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.editdata.farm_startt = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };
      vm.updatepickdateto = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.editdata.farm_endt = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.editdata.farm_endt = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };

      vm.edit = function (e) {
        $scope.modaledit.show();
        $scope.editdata = angular.copy(e);
        //console.log($scope.editdata);
        $scope.positionEdit = {
          lat: $scope.editdata.farm_lat.split(","),
          lng: $scope.editdata.farm_lng.split(","),
        };
      };

      vm.deleteCrop = function () {
        mobiscroll.confirm({
          title: "Use location service?",
          message:
            "Help apps determine location. This means sending anonymous location data, even when no apps are running.",
          okText: "Agree",
          cancelText: "Disagree",
          callback: function (res) {
            if (res) {
              $ionicLoading.show();
              let url = $rootScope.ip + "createArea.php";
              let req = { mode: "deleteCrops", data: $scope.editdata };
              $http.post(url, req).then(
                function (response) {
                  if (response.data.status == true) {
                    $ionicLoading.hide();
                    $timeout(function () {
                      delete $scope.data;
                      $scope.modaledit.hide();
                      mobiscroll.toast({
                        message: "ลบ Crop เรียบร้อย",
                        color: "success",
                      });
                      onStart();
                    }, 200);
                  } else {
                    $ionicLoading.hide();
                    Service.timeout();
                  }
                },
                function err(err) {
                  $ionicLoading.hide();
                  Service.timeout();
                }
              );
            }
          },
        });
      };

      vm.addcrop = function () {
        $state.go("app.add3");
      };

      vm.add5 = function (e) {
        $ionicLoading.show();
        //console.log(e);
        let myJSON = JSON.stringify(e);
        let url = $rootScope.ip + "createArea.php";
        let req = { mode: "selectsubfarm", value: e };
        $http.post(url, req).then(
          function suscess(response) {
            if (response.data.status == true) {
              $ionicLoading.hide();

              let res = JSON.stringify(response.data.result);

              $state.go("app.add5", { crop: myJSON, sub: res });
            } else {
              $ionicLoading.hide();
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      $scope.checkUpdate = function () {
        if ($scope.editdata) {
          if (
            !$scope.editdata.farm_name ||
            !$scope.editdata.farm_user1 ||
            !$scope.editdata.farm_desc ||
            !$scope.editdata.farm_startt ||
            !$scope.editdata.farm_endt
          ) {
            return true;
          } else {
            return false;
          }
        }
      };

      vm.editMap = function () {
        //console.log($scope.positionEdit);
        $scope.modaledit.hide();
        $timeout(function () {
          $scope.modalmap.show();

          var all_overlays = [];
          var selectedShape;
          $scope.PolygonPatch = [];

          $scope.data;

          function CenterControl(controlDiv, map) {
            // Set CSS for the control border.
            var controlUI = document.createElement("div");
            controlUI.style.backgroundColor = "#fff";
            controlUI.style.border = "2px solid #fff";
            controlUI.style.borderRadius = "3px";
            controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
            controlUI.style.cursor = "pointer";
            controlUI.style.marginBottom = "22px";
            controlUI.style.marginTop = "10px";
            controlUI.style.marginRight = "10px";
            controlUI.style.textAlign = "center";
            controlDiv.appendChild(controlUI);

            // Set CSS for the control interior.
            var controlText = document.createElement("div");
            controlText.style.color = "rgb(25,25,25)";
            controlText.style.fontFamily = "Roboto,Arial,sans-serif";
            controlText.style.fontSize = "16px";
            controlText.style.lineHeight = "38px";
            controlText.style.paddingLeft = "5px";
            controlText.style.paddingRight = "5px";

            controlText.innerHTML = "Remove";
            controlUI.appendChild(controlText);

            // Setup the click event listeners: simply set the map to Chicago.
            controlUI.addEventListener("click", function () {
              deleteSelectedShape();
            });
          }

          function clearSelection() {
            if (selectedShape) {
              selectedShape.setEditable(false);
              selectedShape = null;
            }
          }

          function setSelection(shape) {
            infowindow.open(map);
            // //console.log(shape)
            clearSelection();
            selectedShape = shape;
            shape.setEditable(true);
          }

          function deleteSelectedShape() {
            if (selectedShape) {
              infowindow.close();
              $scope.PolygonPatch = [];
              selectedShape.setMap(null);
              // To show:
              drawingManager.setOptions({
                drawingControl: true,
              });
            }
          }

          function showoutput() {
            alert($scope.data);
          }

          //Set map
          var map = new google.maps.Map(document.getElementById("maps"), {
            center: {
              lat: 13.713462,
              lng: 100.478819,
            },
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ["satellite", "roadmap", "hybrid"],
            },
            mapTypeId: "satellite",
            zoom: 19,
          });

          var infowindow = new google.maps.InfoWindow();
          var centerControlDiv = document.createElement("div");
          var centerControl = new CenterControl(centerControlDiv, map);
          centerControlDiv.index = 1;
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
            centerControlDiv
          );

          var drawingManager = new google.maps.drawing.DrawingManager({
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER,
              drawingModes: ["polygon"],
            },
            polygonOptions: {
              clickable: true,
              editable: true,
              draggable: false,
              fillColor: "red",
              strokeColor: "green",
              strokeWeight: 3,
            },
            drawingMode: null,
          });
          // infowindow.open(map);
          google.maps.event.addListener(
            drawingManager,
            "polygoncomplete",
            function (polygon) {
              /// Disable Controller//
              drawingManager.setOptions({
                drawingControl: false,
              });

              all_overlays.push(polygon);
              //console.log(all_overlays);
              drawingManager.setDrawingMode(null);

              var newShape = polygon;
              // newShape.type = polygon;

              //Edit point
              google.maps.event.addListener(
                newShape.getPath(),
                "set_at",
                function () {
                  //console.log("set_at");
                  cal(newShape.getPath());
                }
              );

              //Insert point
              google.maps.event.addListener(
                newShape.getPath(),
                "insert_at",
                function () {
                  //console.log("insert_at");
                  //console.log(newShape.getPath());
                  cal(newShape.getPath());
                }
              );

              //click shape
              google.maps.event.addListener(newShape, "click", function (e) {
                setSelection(newShape);
              });
              setSelection(newShape);

              // คำนวนและแสดง
              function cal(patch) {
                $scope.PolygonPatch = [];
                for (var i = 0; i < patch.length; i++) {
                  $scope.PolygonPatch.push({
                    lat: patch.getAt(i).lat().toFixed(5),
                    lng: patch.getAt(i).lng().toFixed(5),
                  });
                }
                //console.log($scope.PolygonPatch);

                // ตารางเมตร
                var areaM2 = google.maps.geometry.spherical.computeArea(patch);
                // เอเคอร์
                var acreFormula = 0.00024711,
                  // ไร่
                  farmFormula = 0.000625,
                  //ตารางวา
                  wahFormula = 0.25,
                  //งาน
                  workFormula = 0.0025;

                var areaAC = (areaM2 * acreFormula).toFixed(3);
                var areaFarm = (areaM2 * farmFormula).toFixed(3);
                var areaWah = (areaM2 * wahFormula).toFixed(3);
                var areaWork = (areaM2 * workFormula).toFixed(3);

                var rai, ngan, wah;
                var modRai, modNgan, modWah;

                rai = parseInt(areaM2 / 1600);
                modRai = areaM2 % 1600;

                ngan = parseInt(modRai / 400);
                modNgan = modRai % 400;

                wah = parseInt(modNgan / 4);

                vm.area = {
                  m2: areaM2.toFixed(3),
                  ac: areaAC,
                  // farm: areaFarm,
                  // work: areaWork,
                  // wah: areaWah,
                  farm: rai,
                  work: ngan,
                  wah: wah,
                };

                //console.log(vm.area);

                infowindow.setContent(
                  '<div id="contentmap">' +
                    '<div id="bodyContent" >' +
                    "<p>" +
                    "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
                    "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
                    vm.area.m2 +
                    " ตารางเมตร<br> " +
                    "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                    vm.area.farm +
                    " &nbspไร่<br> " +
                    "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                    vm.area.work +
                    " งาน<br> " +
                    "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                    vm.area.wah +
                    " ตารางวา<br> " +
                    "</div>"
                );

                infowindow.setPosition(polygon.getPath().getAt(0));
              }

              infowindow.open(map);
              cal(polygon.getPath());
            }
          );

          drawingManager.setMap(map);

          vm.save = function () {
            if ($scope.PolygonPatch.length) {
              $scope.modalmap.hide();
              $timeout(function () {
                $scope.modaledit.show();
                let area = {
                  area: vm.area,
                  position: $scope.PolygonPatch,
                };

                let lat = "";
                let lng = "";
                for (let i = 0; i < area.position.length; i++) {
                  lat += area.position[i].lat + ",";
                  lng += area.position[i].lng + ",";
                }
                // let reslat = lat

                let sublat = lat.substring(0, lat.length - 1);
                let sublng = lng.substring(0, lng.length - 1);

                let resposition = {
                  lat: lat.substring(0, lat.length - 1),
                  lng: lng.substring(0, lng.length - 1),
                };
                let z = {
                  lat: resposition.lat.split(","),
                  lng: resposition.lng.split(","),
                };
                //console.log(area.area);
                //console.log(resposition);

                $scope.editdata.farm_area_acre = area.area.ac;
                $scope.editdata.farm_area_farm = area.area.farm;
                $scope.editdata.farm_area_m2 = area.area.m2;
                $scope.editdata.farm_area_wah = area.area.wah;
                $scope.editdata.farm_area_work = area.area.work;
                $scope.editdata.farm_lat = resposition.lat;
                $scope.editdata.farm_lng = resposition.lng;

                $scope.positionEdit = z;
              }, 500);
            } else {
            }
          };

          var triangleCoords = [];
          for (let i = 0; i < $scope.positionEdit.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.positionEdit.lat[i]),
              lng: parseFloat($scope.positionEdit.lng[i]),
            };
            triangleCoords.push(k);
          }

          // Construct the polygon.
          var bermudaTriangle = new google.maps.Polygon({
            editable: true,
            paths: triangleCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          });

          drawingManager.setOptions({
            drawingControl: false,
          });

          all_overlays.push(bermudaTriangle);

          google.maps.event.addListener(bermudaTriangle, "click", function (e) {
            setSelection(bermudaTriangle);
          });

          setSelection(bermudaTriangle);

          function cal(patch) {
            vm.area = {};
            $scope.PolygonPatch = [];
            for (var i = 0; i < patch.length; i++) {
              $scope.PolygonPatch.push({
                lat: patch.getAt(i).lat().toFixed(5),
                lng: patch.getAt(i).lng().toFixed(5),
              });
            }
            // //console.log($scope.PolygonPatch);

            // ตารางเมตร
            let areaM2 = google.maps.geometry.spherical.computeArea(patch);
            // เอเคอร์
            let acreFormula = 0.00024711,
              // ไร่
              farmFormula = 0.000625,
              //ตารางวา
              wahFormula = 0.25,
              //งาน
              workFormula = 0.0025;

            let areaAC = (areaM2 * acreFormula).toFixed(3);
            let areaFarm = (areaM2 * farmFormula).toFixed(3);
            let areaWah = (areaM2 * wahFormula).toFixed(3);
            let areaWork = (areaM2 * workFormula).toFixed(3);

            var rai, ngan, wah;
            var modRai, modNgan, modWah;

            rai = parseInt(areaM2 / 1600);
            modRai = areaM2 % 1600;

            ngan = parseInt(modRai / 400);
            modNgan = modRai % 400;

            wah = parseInt(modNgan / 4);

            vm.area = {
              m2: areaM2.toFixed(3),
              ac: areaAC,
              // farm: areaFarm,
              // work: areaWork,
              // wah: areaWah,
              farm: rai,
              work: ngan,
              wah: wah,
            };

            infowindow.setContent(
              '<div id="contentmap">' +
                '<div id="bodyContent" >' +
                "<p>" +
                "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
                "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
                vm.area.m2 +
                " ตารางเมตร<br> " +
                "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                vm.area.farm +
                " &nbspไร่<br> " +
                "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                vm.area.work +
                " งาน<br> " +
                "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                vm.area.wah +
                " ตารางวา<br> " +
                "</div>"
            );

            infowindow.setPosition(bermudaTriangle.getPath().getAt(0));
          }

          infowindow.open(map);
          cal(bermudaTriangle.getPath());

          google.maps.event.addListener(
            bermudaTriangle.getPath(),
            "set_at",
            function () {
              //console.log("set_at");
              cal(bermudaTriangle.getPath());
            }
          );

          google.maps.event.addListener(
            bermudaTriangle.getPath(),
            "insert_at",
            function () {
              cal(bermudaTriangle.getPath());
            }
          );

          bermudaTriangle.setMap(map);
        }, 500);
      };

      vm.updateCrop = function () {
        $ionicLoading.show();
        let url = $rootScope.ip + "createArea.php";
        let req = { mode: "editCrop", data: $scope.editdata };
        //console.log(req);
        $http.post(url, req).then(
          function (response) {
            //console.log(response);
            if (response.data.status == true) {
              $ionicLoading.hide();
              $timeout(function () {
                delete $scope.data;
                $scope.modaledit.hide();
                mobiscroll.toast({
                  message: "แก้ไขข้อมูลเรียบร้อย",
                  color: "success",
                });
                onStart();
              }, 200);
            } else {
              $ionicLoading.hide();
              Service.timeout();
            }
          },
          function err(err) {
            $ionicLoading.hide();

            Service.timeout();
          }
        );
      };

      vm.cropMstr = function (x) {
        $ionicLoading.show();
        $scope.areaMstr = x;
        let url = $rootScope.ip + "createArea.php";
        let req = {
          mode: "cropMstr",
          config: $rootScope.cropSet,
          global: $rootScope.global,
        };
        $http.post(url, req).then(
          function suscess(response) {
            // //console.log(response);
            if (response.data.status == true) {
              delete $scope.mstrCrop;
              $ionicSlideBoxDelegate.slide(0);
              $scope.mstrCrop = response.data.result;

              $timeout(function () {
                $scope.modalcrop.show();
                $ionicLoading.hide();
              }, 1000);
            } else {
              $ionicLoading.hide();
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      $scope.lockSlide = function () {
        $ionicSlideBoxDelegate.enableSlide(false);
      };

      vm.mstrCropSelect = function (e) {
        let myJSON = JSON.stringify(e);
        let myJsonarea = JSON.stringify($scope.areaMstr);
        $state.go("app.add6", { cropMstr: myJSON, areaMstr: myJsonarea });
      };
    }
  )

  .controller(
    "add5Ctrl",
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
      Service
    ) {
      let vm = this;
      //modal
      {
        $ionicModal
          .fromTemplateUrl("my-map.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modalmap = modal;
          });

        $scope.openModalMap = function () {
          $scope.modalmap.show();
        };
        $scope.closeModalMap = function () {
          $scope.modalmap.hide();
        };
        // Cleanup the modal when we're done with it!
        $scope.$on("$destroy", function () {
          $scope.modalmap.remove();
        });

        $ionicModal
          .fromTemplateUrl("my-modaledit.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modaledit = modal;
          });

        $scope.openModalEdit = function () {
          $scope.modaledit.show();
        };
        $scope.closeModalEdit = function () {
          $scope.drawCheck = false;
          $scope.modaledit.hide();
        };

        $scope.$on("$destroy", function () {
          $scope.modaledit.remove();
        });

        $ionicModal
          .fromTemplateUrl("my-detail.html", {
            scope: $scope,
            animation: "slide-in-up",
          })
          .then(function (modal) {
            $scope.modaldetail = modal;
          });

        $scope.openModalDetail = function () {
          $scope.modaldetail.show();
        };
        $scope.closeModalDetail = function () {
          $scope.modaldetail.hide();
        };

        $scope.$on("$destroy", function () {
          $scope.modaldetail.remove();
        });
      }

      $scope.model = { farm_desc: null, farm_startt: null, farm_endt: null };
      $scope.count = [1, 2, 3, 4, 5];

      $scope.crop = JSON.parse($stateParams.crop);
      $scope.subfarm = JSON.parse($stateParams.sub);
      // //console.log($scope.subfarm);
      // //console.log($scope.crop);

      vm.here = function () {
        map.setZoom(17);
        map.panTo(bounds.getCenter());
      };

      var triangleCoords = [];
      var all_overlays = [];

      var polygonCoords = [];
      var polygonCoordsFarm = [];

      var bounds = new google.maps.LatLngBounds();
      var areaFarm = new google.maps.LatLngBounds();

      var color = [
        "#ff0000",
        "#8cff00",
        "#0048ff",
        "#f6ff00",
        "#9604f7",
        "#f77104",
        "#02fcf4",
        "#eb01fc",
        "#ff0000",
        "#8cff00",
        "#0048ff",
        "#f6ff00",
        "#9604f7",
        "#f77104",
        "#02fcf4",
        "#eb01fc",
        "#ff0000",
        "#8cff00",
        "#0048ff",
        "#f6ff00",
        "#9604f7",
        "#f77104",
        "#02fcf4",
        "#eb01fc",
      ];

      var map = new google.maps.Map(document.getElementById("mapsdetail"), {
        zoom: 5,
        // center: bounds.getCenter(),
        center: new google.maps.LatLng(13.760412, 100.485357),
        streetViewControl: false,
        fullscreenControl: false,
        mapTypeId: "satellite",
        mapTypeControl: false,
        zoomControl: false,
      });

      vm.allPolygon = function () {
        if ($scope.subfarm.length > 0) {
          for (i = 0; i < all_overlays.length; i++) {
            all_overlays[i].setMap(null); //or line[i].setVisible(false);
          }
          triangleCoords = [];
          all_overlays = [];
          polygonCoords = [];
          bounds = new google.maps.LatLngBounds();
          for (let e = 0; e < $scope.subfarm.length; e++) {
            triangleCoords.push([]);
            $scope.positionPolygon = {
              lat: $scope.subfarm[e].sub_lat.split(","),
              lng: $scope.subfarm[e].sub_lng.split(","),
            };

            for (let i = 0; i < $scope.positionPolygon.lat.length; i++) {
              let k = {
                lat: parseFloat($scope.positionPolygon.lat[i]),
                lng: parseFloat($scope.positionPolygon.lng[i]),
              };
              polygonCoords.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
              triangleCoords[e].push(k); // เอาไปวาดเส้น
            }
            // //console.log(polygonCoords);
            // //console.log(triangleCoords[e]);

            for (let i = 0; i < polygonCoords.length; i++) {
              bounds.extend(polygonCoords[i]);
            }

            var bermudaTriangle = new google.maps.Polygon({
              editable: false,
              paths: triangleCoords[e],
              strokeColor: color[e],
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: color[e],
              fillOpacity: 0.35,
            });

            all_overlays.push(bermudaTriangle);
            all_overlays[e].setMap(map);
          }
          map.setCenter(bounds.getCenter());
          map.setZoom(16);
          map.panTo(bounds.getCenter());
        }
      };
      //ทำตอนเริ่ม
      vm.allPolygon();

      vm.selectSub = function (e, index) {
        $scope.subDetail = e;
        $scope.modaldetail.show();

        //console.log(all_overlays)
        //console.log($scope.subDetail);

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

        // //console.log($scope.abc);

        $timeout(function () {
          // //console.log("666666");

          for (let i = 0; i < $scope.abc.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.abc.lat[i]),
              lng: parseFloat($scope.abc.lng[i]),
            };

            polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
            triangleCoords.push(k);
          }
          // //console.log(triangleCoords);

          for (i = 0; i < polygonCoords.length; i++) {
            bounds.extend(polygonCoords[i]);
          }

          var bermudaTriangle = new google.maps.Polygon({
            editable: false,
            paths: triangleCoords,
            strokeColor: color[index],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color[index],
            fillOpacity: 0.35,
          });

          all_overlays.push(bermudaTriangle);
          bermudaTriangle.setMap(map);

          map.setZoom(17);
          map.panTo(bounds.getCenter());
          // $ionicLoading.hide();
        }, 100);
      };

      vm.editmap = function () {
        $scope.modaledit.hide();
        $timeout(function () {
          $scope.modalmap.show();
        }, 500);
      };

      vm.save = function () {
        $scope.modalmap.hide();
        $timeout(function () {
          $scope.modaledit.show();
          if ($scope.PolygonPatch) {
            // //console.log($scope.PolygonPatch);
          }
        }, 1000);
      };

      $scope.areaFarm = {
        lat: $scope.crop.farm_lat.split(","),
        lng: $scope.crop.farm_lng.split(","),
      };

      vm.createSubmap = function () {
        let triangleCoords = [];
        for (let i = 0; i < $scope.areaFarm.lat.length; i++) {
          let k = {
            lat: parseFloat($scope.areaFarm.lat[i]),
            lng: parseFloat($scope.areaFarm.lng[i]),
          };
          polygonCoordsFarm.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
          triangleCoords.push(k); // เอาไปวาดเส้น
        }

        for (let i = 0; i < polygonCoordsFarm.length; i++) {
          areaFarm.extend(polygonCoordsFarm[i]);
        }

        $scope.modalmap.show();

        function setMapOnAll(map) {
          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
          }
        }

        function clearMarkers() {
          setMapOnAll(null);
        }

        var all_overlays = [];
        var selectedShape;
        $scope.PolygonPatch = [];
        let all_overlaysbase = [];

        $scope.data;

        function CenterControl(controlDiv, map) {
          // Set CSS for the control border.
          var controlUI = document.createElement("div");
          controlUI.style.backgroundColor = "#fff";
          controlUI.style.border = "2px solid #fff";
          controlUI.style.borderRadius = "10px";
          controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
          controlUI.style.cursor = "pointer";
          controlUI.style.marginBottom = "22px";
          controlUI.style.marginTop = "10px";
          controlUI.style.marginRight = "10px";
          controlUI.style.textAlign = "center";
          controlDiv.appendChild(controlUI);

          // Set CSS for the control interior.
          var controlText = document.createElement("div");
          controlText.style.color = "rgb(25,25,25)";
          controlText.style.fontFamily = "Roboto,Arial,sans-serif";
          controlText.style.fontSize = "16px";
          controlText.style.lineHeight = "38px";
          controlText.style.paddingLeft = "5px";
          controlText.style.paddingRight = "5px";

          controlText.innerHTML = "<i class='icon ion-trash-a'> ลบเส้น";
          controlUI.appendChild(controlText);

          // Setup the click event listeners: simply set the map to Chicago.
          controlUI.addEventListener("click", function () {
            deleteSelectedShape();
          });
        }

        function clearSelection() {
          if (selectedShape) {
            selectedShape.setEditable(false);
            selectedShape = null;
          }
        }

        function setSelection(shape) {
          infowindow.open(map);
          clearSelection();
          selectedShape = shape;
          shape.setEditable(true);
        }

        function deleteSelectedShape() {
          if (selectedShape) {
            infowindow.close();
            $scope.PolygonPatch = [];
            selectedShape.setMap(null);
            // To show:
            drawingManager.setOptions({
              drawingControl: false,
            });

            $scope.$apply(function () {
              $scope.drawCheck = false;
            });
          }
        }

        function showoutput() {
          alert($scope.data);
        }

        vm.draw = function () {
          //console.log("123456789");
          $scope.drawCheck = true;
          drawingManager.setDrawingMode(
            google.maps.drawing.OverlayType.POLYGON
          );
        };

        //Set map
        var map = new google.maps.Map(document.getElementById("maps"), {
          center: areaFarm.getCenter(),
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ["satellite", "roadmap", "hybrid"],
          },
          mapTypeId: "satellite",
          zoom: 18,
        });

        var infowindow = new google.maps.InfoWindow();
        var centerControlDiv = document.createElement("div");
        var centerControl = new CenterControl(centerControlDiv, map);
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          centerControlDiv
        );

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: false,
          drawingControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER,
            drawingModes: ["polygon"],
          },
          polygonOptions: {
            clickable: true,
            editable: true,
            draggable: false,
            fillColor: "green",
            strokeColor: "green",
            strokeWeight: 4,
            strokeOpacity: 0.9,
            fillOpacity: 0.3,
          },
          drawingMode: null,
        });
        infowindow.open(map);
        google.maps.event.addListener(
          drawingManager,
          "polygoncomplete",
          function (polygon) {
            /// Disable Controller//
            drawingManager.setOptions({
              drawingControl: false,
            });

            $scope.$apply(function () {
              $scope.drawCheck = true;
            });

            all_overlays.push(polygon);
            drawingManager.setDrawingMode(null);

            var newShape = polygon;
            newShape.type = polygon;

            //Edit point
            google.maps.event.addListener(
              newShape.getPath(),
              "set_at",
              function () {
                // //console.log(newShape.getPath())
                cal(newShape.getPath());
              }
            );

            //Insert point
            google.maps.event.addListener(
              newShape.getPath(),
              "insert_at",
              function () {
                //console.log(newShape.getPath());
                cal(newShape.getPath());
              }
            );

            //click shape
            google.maps.event.addListener(newShape, "click", function (e) {
              //console.log(newShape.getPath());
              setSelection(newShape);
            });
            setSelection(newShape);

            // คำนวนและแสดง
            function cal(patch) {
              $scope.PolygonPatch = [];
              for (var i = 0; i < patch.length; i++) {
                $scope.PolygonPatch.push({
                  lat: patch.getAt(i).lat().toFixed(5),
                  lng: patch.getAt(i).lng().toFixed(5),
                });
              }
              //console.log($scope.PolygonPatch);

              // $scope.PolygonPatch = coordinates;

              // $scope.PolygonPatch.push(coordinates)
              // //console.log($scope.PolygonPatch)
              // ตารางเมตร
              var areaM2 = google.maps.geometry.spherical.computeArea(patch);
              // เอเคอร์
              var acreFormula = 0.00024711,
                // ไร่
                farmFormula = 0.000625,
                //ตารางวา
                wahFormula = 0.25,
                //งาน
                workFormula = 0.0025;

              var rai, ngan, wah;
              var modRai, modNgan, modWah;

              rai = parseInt(areaM2 / 1600);
              modRai = areaM2 % 1600;

              ngan = parseInt(modRai / 400);
              modNgan = modRai % 400;

              wah = parseInt(modNgan / 4);

              var areaAC = (areaM2 * acreFormula).toFixed(3);
              var areaFarm = (areaM2 * farmFormula).toFixed(3);
              var areaWah = (areaM2 * wahFormula).toFixed(3);
              var areaWork = (areaM2 * workFormula).toFixed(3);

              vm.area = {
                m2: areaM2.toFixed(3),
                ac: areaAC,
                // farm: areaFarm,
                // work: areaWork,
                // wah: areaWah,
                farm: rai,
                work: ngan,
                wah: wah,
              };
              //console.log(vm.area);

              // //console.log("ตารางเมตร", areaM2.toFixed(3))
              // //console.log("ไร่ , =", areaFarm.toFixed(3))
              // //console.log("เอเคอร์, =", areaAC.toFixed(3))
              // //console.log("ตารางวา =", areaWah.toFixed(3))
              // //console.log("งาน =", areaWork.toFixed(3))

              // infowindow.setContent("Area/ตารางเมตร =" + vm.area.m2 + " sq meters<br>" +
              //   "Area/เอเคอร์ =" + vm.area.ac + " Acre<br>");
              infowindow.setContent(
                '<div id="contentmap">' +
                  // '   <img src="img/maxresdefault.jpg" style="height:100px;">' +
                  '<div id="bodyContent" >' +
                  // "<br><b>Description</b><br><br> " +
                  // "<p>พันธุ์ : - <br> " +
                  // "<p>อายุ : - <br> " +
                  // "<p>อื่นๆ : - <br> " +
                  "<p> " +
                  "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
                  "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
                  vm.area.m2 +
                  " ตารางเมตร<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.farm +
                  " &nbspไร่<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.work +
                  " งาน<br> " +
                  "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
                  vm.area.wah +
                  " ตารางวา<br> " +
                  "</div>"
                // '<div style="margin-top:10px"><button type="button" class="button button-small button-assertive icon ion-trash-a" ></button>' +
                // '<button type="button" class="button button-small  button-positive icon ion-edit" style="margin-left:3px"></button>' +
                // "</div>"
              );

              infowindow.setPosition(polygon.getPath().getAt(0));
            }

            infowindow.open(map);
            cal(polygon.getPath());
          }
        );

        let triangleCoordsSub = [];
        let all_overlaysSub = [];
        let polygonCoordsSub = [];
        let boundsSub = new google.maps.LatLngBounds();

        for (let e = 0; e < $scope.subfarm.length; e++) {
          triangleCoordsSub.push([]);
          let positionPolygon = {
            lat: $scope.subfarm[e].sub_lat.split(","),
            lng: $scope.subfarm[e].sub_lng.split(","),
          };

          for (let i = 0; i < positionPolygon.lat.length; i++) {
            let k = {
              lat: parseFloat(positionPolygon.lat[i]),
              lng: parseFloat(positionPolygon.lng[i]),
            };

            polygonCoordsSub.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
            triangleCoordsSub[e].push(k); // เอาไปวาดเส้น
          }

          // for (let i = 0; i < polygonCoordsSub.length; i++) {
          //   boundsSub.extend(polygonCoordsSub[i]);

          // }

          var bermudaTriangles = new google.maps.Polygon({
            editable: false,
            paths: triangleCoordsSub[e],
            strokeColor: "yellow",
            strokeOpacity: 0.9,
            strokeWeight: 4,
            fillColor: "green",
            fillOpacity: 0.3,
          });

          all_overlaysSub.push(bermudaTriangles);
          all_overlaysSub[e].setMap(map);
        }

        /// พื้นที่ใหญ่ทั้งหมด
        var bermudaTriangle = new google.maps.Polygon({
          editable: false,
          paths: triangleCoords,
          strokeColor: "red",
          strokeOpacity: 0.8,
          strokeWeight: 4,
          fillColor: "none",
          fillOpacity: 0.0,
        });
        bermudaTriangle.setMap(map);

        // google.maps.event.addDomListener(document.getElementById('bt1'), 'click', deleteSelectedShape);
        // google.maps.event.addDomListener(document.getElementById('bt2'), 'click', showoutput);

        drawingManager.setMap(map);
      };

      vm.createSub = function () {
        $ionicLoading.show();
        let lat = "";
        let lng = "";
        for (let i = 0; i < $scope.PolygonPatch.length; i++) {
          lat += $scope.PolygonPatch[i].lat + ",";
          lng += $scope.PolygonPatch[i].lng + ",";
        }
        // let reslat = lat

        let sublat = lat.substring(0, lat.length - 1);
        let sublng = lng.substring(0, lng.length - 1);

        let resposition = {
          lat: sublat,
          lng: sublng,
        };
        let url = $rootScope.ip + "createArea.php";
        let req = {
          mode: "createSubFarm",
          area: vm.area,
          position: resposition,
          name: $scope.model,
          farm: $scope.crop,
        };
        $http.post(url, req).then(
          function suscess(response) {
            //console.log(response);
            if (response.data.status == true) {
              mobiscroll.toast({
                message: "สร้างพื้นที่เกษตรกรเรียบร้อยแล้ว",
                color: "success",
              });

              // $state.go("app.collectormenu");
              $timeout(function () {
                $ionicLoading.hide();

                $ionicHistory.goBack();

                // $ionicHistory.clearCache(["app.createArea"]);
                // $ionicHistory.clearCache(["app.add3"]);
                // $ionicHistory.clearCache(["app.add2"]);
                // $ionicHistory.clearCache(["app.add1"]);

                //console.log("clear");
              }, 1000);
            } else {
              $ionicLoading.hide();
              Service.timeout();
            }
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );
      };
    }
  )

  .controller(
    "add6Ctrl",
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
      $ionicSlideBoxDelegate,
      $mdDialog
    ) {
      let vm = this;
      $scope.cropMstr = JSON.parse($stateParams.cropMstr);
      $scope.areaMstr = JSON.parse($stateParams.areaMstr);

      //console.log($scope.cropMstr);
      //console.log($scope.areaMstr);

      function onStart() {
        $ionicLoading.show();
        let url = $rootScope.ip + "createArea.php";
        let req = {
          mode: "selectsubfarms",
          value: $scope.areaMstr,
          crop: $scope.cropMstr,
        };
        $http.post(url, req).then(
          function suscess(response) {
            if (response.data.status == true) {
              $scope.data = response.data;

              for (let i = 0; i < $scope.data.result.length; i++) {
                $scope.data.result[i] = angular.merge($scope.data.result[i], {
                  func: function () {
                    if (
                      !$scope.data.result[i].type ||
                      !$scope.data.result[i].enddate ||
                      !$scope.data.result[i].startdate ||
                      !$scope.data.result[i].result
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  },
                });
                //console.log($scope.data.result[i].func());
              }
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();

              $scope.data = response.data;
            }

            //console.log($scope.data.result);
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      }

      function onRefresh() {
        $ionicLoading.show();
        let url = $rootScope.ip + "createArea.php";
        let req = {
          mode: "selectsubfarms",
          value: $scope.areaMstr,
          crop: $scope.cropMstr,
        };
        $http.post(url, req).then(
          function suscess(response) {
            if (response.data.status == true) {
              $scope.data = response.data;
              for (let i = 0; i < $scope.data.result.length; i++) {
                $scope.data.result[i] = angular.merge($scope.data.result[i], {
                  func: function () {
                    if (
                      !$scope.data.result[i].type ||
                      !$scope.data.result[i].enddate ||
                      !$scope.data.result[i].startdate ||
                      !$scope.data.result[i].result
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  },
                });
                //console.log($scope.data.result[i].func());
              }

              $mdDialog.show(
                $mdDialog
                  .alert()
                  .parent(
                    angular.element(document.querySelector("#popupContainer"))
                  )
                  .clickOutsideToClose(true)
                  .title("แจ้งเตือน !")
                  .textContent("บันทึกข้อมูลเรียบร้อยแล้ว..")
                  .ariaLabel("Alert Dialog Demo")
                  .ok("ยืนยัน")
                  .targetEvent()
              );

              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();

              $scope.data = response.data;
            }

            //console.log($scope.data);
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      }

      onStart();

      $scope.loadUsers = function () {
        return $timeout(function () {
          return ($scope.croptype = $scope.croptype || $scope.croptypes);
        }, 1000);
      };

      $scope.loadUsersss = function () {
        let url = $rootScope.ip + "createArea.php";
        let req = { mode: "cropType", value: $scope.cropMstr };
        $http.post(url, req).then(
          function suscess(response) {
            //console.log(response);
            if (response.data.status == true) {
              $scope.croptype = response.data.result;
            } else {
              $scope.croptype = response.data.result;
            }
          },
          function err(err) {}
        );
      };

      $scope.loadUsersss();

      let platform = ionic.Platform.platform();

      vm.pickdate = function (index) {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.data.result[index].startdate = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.data.result[index].startdate = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };
      vm.pickdateto = function (index) {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              $scope.data.result[index].enddate = data;
            });
          });
        } else {
          $scope.datamodal = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datamodal.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              { text: "Cancel" },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datamodal.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.data.result[index].enddate = $scope.datamodal.date;
                  }
                },
              },
            ],
          });
        }
      };

      vm.um = [];
      vm.typeChange = function (e, index) {
        //console.log(e, index);
        vm.um[index] = $scope.croptype.filter((p) => p.pt_part == e)[0];
        //console.log(vm.um);
      };

      vm.wogen = function (ev) {
        let check = [];
        for (let i = 0; i < $scope.data.result.length; i++) {
          check.push($scope.data.result[i].func());
        }
        let k = check.includes(false);
        if (!k) {
          var confirm = $mdDialog
            .confirm()
            .title("ต้องการบันทึกข้อมูลใช่หรือไม่ ?")
            .textContent(
              "กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยันการบันทึก ต้องการบันทึกข้อมูลหรือไม่ ?"
            )
            .ariaLabel("Lucky day")
            .targetEvent(ev)
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(
            function () {
              $ionicLoading.show();
              let url = $rootScope.ip + "createArea.php";
              let req = {
                mode: "woGen",
                value: $scope.data.result,
                areamstr: $scope.areaMstr,
                cropmstr: $scope.cropMstr,
              };
              $http.post(url, req).then(
                function suscess(response) {
                  //console.log(response);
                  if (response.data.status == true) {
                    $ionicLoading.hide();

                    onRefresh();
                  } else {
                    $ionicLoading.hide();
                  }
                },
                function err(err) {
                  $ionicLoading.hide();
                }
              );
            },
            function () {}
          );
        } else {
          $mdDialog.show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(false)
              .title("แจ้งเตือน !")
              .textContent("กรอกข้อมูลให้ครบถ้วนก่อนบันทึกข้อมูล..")
              .ariaLabel("Alert Dialog Demo")
              .ok("ยืนยัน")
              .targetEvent()
          );
        }
      };
    }
  );
