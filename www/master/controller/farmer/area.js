angular
  .module("app")

  .controller(
    "areaCtrl",
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
      $q,
      $cordovaGeolocation,
      deviceService,
      $mdDialog,
      fachttp,
      $ionicActionSheet
    ) {
      let vm = this;

      // //console.log($rootScope.global);
      // $scope.crop = JSON.parse($stateParams.crop);
      $scope.crop = {
        frm_code: $rootScope.global.mob_farm_code,
      };

      $rootScope.cropSet = $scope.crop;

      vm.addcrop = function () {
        $state.go("app.add3");
      };

      vm.edit = function (e) {
        $state.go("app.areaEdit", {
          id: JSON.stringify(e.farm_id),
        });
      };

      vm.deleteCrop = function () {
        mobiscroll.confirm({
          title: "แจ้งเตือน",
          message: "คุณต้องการลบพื้นที่นี้ใช่หรือไม่ ?",
          okText: "ยืนยัน",
          cancelText: "ยกเลิก",
          callback: function (res) {
            if (res) {
              $ionicLoading.show();
              let req = {
                mode: "deleteCrops",
                data: $scope.editdata,
              };
              fachttp.model("createArea.php", req).then(
                function (response) {
                  //console.log('eiei')
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

            controlText.innerHTML = "ลบที่วาด";
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

          vm.here = function () {
            $ionicLoading.show({
              duration: 3000,
            });

            function callPosition() {
              var posOptions = {
                timeout: 10000,
                enableHighAccuracy: true,
              };
              return $cordovaGeolocation.getCurrentPosition(posOptions).then(
                function (position) {
                  //console.log(position);
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

            abc.then(function (response) {
              vm.position = {
                lat: response.coords.latitude,
                lng: response.coords.longitude,
              };

              map.setZoom(25);
              map.panTo(vm.position);

              $ionicLoading.hide();
            });
          };

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
            //console.log(k);
            triangleCoords.push(k);
          }
          if (triangleCoords[0].lat != 0 || triangleCoords[0].lng != 0) {
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

            google.maps.event.addListener(
              bermudaTriangle,
              "click",
              function (e) {
                setSelection(bermudaTriangle);
              }
            );

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
          }
          //console.log(triangleCoords);

          // Construct the polygon.
        }, 500);
      };

      vm.selectIcon = function () {
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 50,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: Camera.DestinationType.DATA_URL,
          allowEdit: false,
        });

        function onSuccess(imageData) {
          $ionicLoading.show({
            duration: 500,
          });
          let img = {
            img: "data:image/jpeg;base64," + imageData,
            desc: null,
          };
          $scope.image = img.img;
          $scope.editdata.imgpath = $scope.image;

          //console.log($scope.image);
        }

        function onFail(message) {
          // alert("Failed because: " + message);
        }
      };

      vm.removeIcon = function () {
        //console.log('ss')
        let hideSheet = $ionicActionSheet.show({
          titleText: "เลือกรายการ ",
          buttons: [
            {
              text: '<i class="icon ion-trash-a" ></i> ลบรูปภาพ',
            },
          ],
          buttonClicked: function (index) {
            if (index == 0) {
              $scope.image = "REMOVE";
              delete $scope.editdata.imgpath;
              //console.log($scope.image)
            }
            return true;
          },
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
          hideSheet();
        }, 7000);
      };

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
              {
                text: "Cancel",
              },
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
              {
                text: "Cancel",
              },
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

     

      $scope.doRefresh = function () {
        // here refresh data code
        $scope.$broadcast("scroll.refreshComplete");
        $scope.$apply();
        onStart();
      };

      function onStart() {
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "selectFarm",
          config: $rootScope.cropSet,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 8000);

        fachttp
          .model("area.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              $scope.status = true;

              //console.log(response);
              if (response.data.status == true) {
                $scope.data = response.data;
              } else {
                $scope.data = response.data;
              }
              //console.log(response);
            },
            function err(err) {
              //console.log(err);
              $scope.data = [];
              $scope.status = false;
            }
          );
      }

      onStart();

      vm.refresh = function () {
        delete $scope.data;
        delete $scope.status;
        onStart();
      };

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

      vm.add5 = function (e) {
        $ionicLoading.show();
        //console.log(e);
        let myJSON = JSON.stringify(e);
        let req = {
          mode: "selectsubfarm",
          value: e,
        };
        fachttp.model("area.php", req).then(
          function (response) {
            //console.log(response.data);
            if (response.data.status == true) {
              $ionicLoading.hide();

              let res = JSON.stringify(response.data.result);

              $state.go("app.area2", {
                crop: myJSON,
                sub: res,
              });
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
                    .textContent("พื้นที่ไม่สมบูรณ์ แก้ไขพื้นที่ โดยกดรูปดินสอ")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                )
                .then(
                  function (answer) {},
                  function () {}
                );
              $ionicLoading.hide();
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.cropMstr = function (x) {
        $ionicLoading.show();
        $scope.areaMstr = x;

        let req = {
          mode: "cropMstr",
          config: $rootScope.cropSet,
        };
        fachttp.model("createArea.php", req).then(
          function (response) {
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
        $state.go("app.add6", {
          cropMstr: myJSON,
          areaMstr: myJsonarea,
        });
      };
    }
  )

  .filter("trusted", [
    "$sce",
    function ($sce) {
      return function (url) {
        try {
          var regExp =
            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
          var match = url.match(regExp);
          console.log(match);

          var video_id = "";

          if (match && match[7].length == 11) {
            video_id = match[7];
          } else {
            video_id = false;
          }

          console.log(match);
          console.log(video_id);
          return $sce.trustAsResourceUrl(
            "https://www.youtube.com/embed/" +
              video_id +
              "?enablejsapi=1&version=3&playerapiid=ytplayer"
          );
        } catch (error) {
          console.log(error);
          return false;
        }
      };
    },
  ])

  .controller(
    "areaEditCtrl",
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
      $q,
      $cordovaGeolocation,
      deviceService,
      $mdDialog,
      fachttp,
      $ionicActionSheet,
      $mdBottomSheet
    ) {
      let vm = this;

      // $scope.vdourl = "https://www.youtube.com/watch?v=75J1tGQYiU4";

      //console.log(JSON.parse($stateParams.id));
      var farmerid = JSON.parse($stateParams.id);

      $scope.imagefarm = [];
      $scope.imaeDel = [];

      $scope.showListBottomSheet = function () {
        if ($scope.imagefarm.length >= 5) {
          Service.toast("สามารถเพิ่มรูปภาพได้สูงสุด 5 ภาพ", "info");

          return;
        }
        $scope.alert = "";
        $mdBottomSheet
          .show({
            templateUrl: "action.html",
            controller: "ListBottomSheetCtrl",
          })
          .then(function (clickedItem) {
            $scope.alert = clickedItem["name"] + " clicked!";
            console.log(clickedItem);

            switch (clickedItem["icon"]) {
              case "image":
                $scope.getPicture();

                break;

              default:
                $scope.takePicture();
                break;
            }
          })
          .catch(function (error) {
            // User clicked outside or hit escape
          });
      };

      $scope.imageAction = function (i, e) {
        $scope.alert = "";
        $mdBottomSheet
          .show({
            templateUrl: "action.html",
            controller: "ListBottomSheetActionCtrl",
          })
          .then(function (clickedItem) {
            $scope.alert = clickedItem["name"] + " clicked!";
            console.log(clickedItem);

            switch (clickedItem["icon"]) {
              case "image":
                $scope.getPicture("edit", i, e);

                break;
              case "camera":
                $scope.takePicture("edit", i, e);

                break;

              default:
                $scope.imaeDel.push(e);
                $scope.imagefarm.splice(i, 1);
                break;
            }
          })
          .catch(function (error) {
            // User clicked outside or hit escape
          });
      };

      $scope.takePicture = function (e, i, d) {
        navigator.camera.getPicture(onSuccess, onFail, {
          sourceType: Camera.PictureSourceType.CAMERA,
          destinationType: Camera.DestinationType.DATA_URL,
          // targetWidth: 1024,
          // targetHeight: 1024,
          // Some common settings are 20, 50, and 100
          quality: 100,
          // In this app, dynamically set the picture source, Camera or photo gallery
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          allowEdit: false,
          correctOrientation: true,
        });

        function onSuccess(imageData) {
          $ionicLoading.show({
            duration: 500,
          });
          var image = "data:image/jpeg;base64," + imageData;

          if (e == "edit") {
            $scope.imaeDel.push(d);
            $scope.imagefarm[i] = { image_path: image };
          } else {
            var image = "data:image/jpeg;base64," + imageData;
            $scope.imagefarm.push({ image_path: image });
          }
        }

        function onFail(message) {
          console.log(message);
        }
      };

      $scope.getPicture = function (e, i, d) {
        navigator.camera.getPicture(onSuccess, onFail, {
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: Camera.DestinationType.DATA_URL,
          // targetWidth: 1024,
          // targetHeight: 1024,
          // Some common settings are 20, 50, and 100
          quality: 100,
          // In this app, dynamically set the picture source, Camera or photo gallery
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          correctOrientation: true,
        });

        function onSuccess(imageData) {
          $ionicLoading.show({
            duration: 500,
          });
          var image = "data:image/jpeg;base64," + imageData;

          if (e == "edit") {
            $scope.imaeDel.push(d);
            $scope.imagefarm[i] = { image_path: image };
          } else {
            var image = "data:image/jpeg;base64," + imageData;
            $scope.imagefarm.push({ image_path: image });
          }
        }

        function onFail(message) {
          console.log(message);
        }
      };

      $scope.deleteImg = function (i, e) {
        console.log(i);
        $scope.imaeDel.push(e);
        $scope.imagefarm.splice(i, 1);
      };

      console.log(farmerid);
      $scope.model = {};

      function onStart() {
        $ionicLoading.show();
        let req = {
          mode: "selectEdit",
          config: farmerid,
        };

        fachttp.model("area.php", req).then(
          function (response) {
            $scope.status = true;
            if (response.data.status == true) {
              console.log(response.data);
              $scope.editdata = response.data.result[0];

              vm.provinceSelect = $scope.editdata.province_select;
              vm.aumphurSelect = $scope.editdata.aumphur_select;
              vm.tumbolSelect = $scope.editdata.tumbol_select;

              vm.province = response.data.address.province;
              vm.aumphur = response.data.address.aumphur;
              vm.tumbol = response.data.address.tumbol;

              // $scope.model.vd = vm.vd[0]
              $scope.positionEdit = {
                lat: $scope.editdata.farm_lat.split(","),
                lng: $scope.editdata.farm_lng.split(","),
              };

              $scope.editdata.listimg.forEach((element) => {
                // console.log(element.pic_path)
                $scope.imagefarm.push(element);
              });
            } else {
              $scope.editdata = response.data;
            }
            $ionicLoading.hide();

            //console.log(response);
          },
          function err(err) {
            $ionicLoading.hide();

            //console.log(err);
            $scope.editdata = [];
            $scope.status = false;
          }
        );
      }
      onStart();

      vm.provinceChange = function (e) {
        $ionicLoading.show();
        let req = { mode: "AUMPHUR", data: e };

        fachttp.model("area.php", req).then(
          function (response) {
            //console.log(response.data);
            if (response.data.status == true) {
              vm.aumphur = response.data.result;
              vm.aumphurSelect = vm.aumphur[0];
              vm.aumphurChange(vm.aumphurSelect);
              // vm.tumbol =[];
              // delete vm.tumbolSelect

              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
          },
          function err() {
            $ionicLoading.hide();
          }
        );
      };

      vm.aumphurChange = function (e) {
        $ionicLoading.show();
        let req = { mode: "tumbol", data: e, global: $rootScope.global };

        fachttp.model("area.php", req).then(
          function (response) {
            //console.log(response.data);
            if (response.data.status == true) {
              vm.tumbol = response.data.result;
              vm.tumbolSelect = vm.tumbol[0];
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
            }
          },
          function err() {
            $ionicLoading.hide();
          }
        );
      };

      function reSelect() {
        $ionicLoading.show();
        let cancellerLoadpic = $q.defer();
        let req = {
          mode: "reselectFarm",
          config: cropset,
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 8000);

        fachttp
          .model("area.php", req, {
            timeout: cancellerLoadpic.promise,
          })
          .then(
            function (response) {
              $scope.status = true;

              //console.log(response);
              if (response.data.status == true) {
                $scope.editdata = response.data.result[0];
              } else {
                $scope.editdata = response.data.result[0];
              }
              //console.log(response);
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();

              //console.log(err);
              $scope.data = [];
              $scope.status = false;
            }
          );
      }

      vm.ser = {
        serNo: null,
        date: null,
      };

      vm.confirmStandard = function () {
        reSelect();
        if (vm.ser.serNo && vm.ser.date) {
          $ionicLoading.show();
          let req = {
            mode: "confirmStandard",
            data: $scope.editdata,
            standard: $scope.selectedStandart,
            standardDetail: vm.ser,
          };

          fachttp.model("area.php", req).then(
            function (response) {
              $scope.status = true;

              //console.log(response);
              $scope.closeModalStandard();

              if (response.data.status == true) {
                reSelect();
                // $scope.closeModalStandard();
              } else {
              }
              //console.log(response);
              $ionicLoading.hide();
            },
            function err(err) {
              $ionicLoading.hide();
              //console.log(err);
              $scope.status = false;
            }
          );
        } else {
          alert("กรอกรายละเอียดไม่ครบถ้วน กรุณาลองใหม่อีกครั้ง");
        }
      };

      vm.pickdateSer = function () {
        if (platform == "android" || platform == "ios") {
          document.addEventListener("deviceready", function () {
            let k = Service.pickdate();
            k.then(function suss(data) {
              vm.ser.date = data;
            });
          });
        } else {
          $scope.datas = {};

          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="datas.date">',
            title: "Enter Date Ex 25-04-2562",
            subTitle: "ป้อนข้อูลตามรูปแบบ",
            scope: $scope,
            buttons: [
              {
                text: "Cancel",
              },
              {
                text: "<b>Save</b>",
                type: "button-positive",
                onTap: function (e) {
                  if (!$scope.datas.date) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    return $scope.datas.date;
                  }
                },
              },
            ],
          });

          myPopup.then(function (res) {
            vm.ser.date = res;
          });
        }
      };

      vm.deleteStandard = function (e) {
        //console.log(e)
        mobiscroll.confirm({
          title: "แจ้งเตือน",
          message: "คุณต้องการลบรายการนี้ใช่หรือไม่ ?",
          okText: "ยืนยัน",
          cancelText: "ยกเลิก",
          callback: function (res) {
            if (res) {
              $ionicLoading.show();
              let req = {
                mode: "deleteStandard",
                data: e,
              };
              fachttp.model("area.php", req).then(
                function (response) {
                  //console.log(response.data)
                  $ionicLoading.hide();
                  reSelect();
                  // $ionicHistory.goBack();
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

      vm.currentIndex = function () {
        return $ionicSlideBoxDelegate.currentIndex();
      };

      vm.prveSlide = function () {
        $ionicSlideBoxDelegate.previous();
      };

      vm.selectStandard = function (e) {
        $scope.selectedStandart = e;
        $ionicSlideBoxDelegate.slide(1);
        //console.log($scope.selectedStandart)
      };

      $scope.lockSlide = function () {
        $ionicSlideBoxDelegate.enableSlide(false);
      };

      vm.addStandard = function () {
        delete $scope.selectedStandart;
        //console.log('ADD STANDARD')
        $ionicSlideBoxDelegate.slide(0);
        $scope.modalStandard.show();
      };

      $ionicModal
        .fromTemplateUrl("my-standard.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalStandard = modal;
        });

      $scope.openModalStandard = function () {
        $scope.modalStandard.show();
      };
      $scope.closeModalStandard = function () {
        $scope.modalStandard.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalStandard.remove();
      });

      vm.edit = function (e) {
        $scope.modaledit.show();
        $scope.editdata = angular.copy(e);
        $scope.positionEdit = {
          lat: $scope.editdata.farm_lat.split(","),
          lng: $scope.editdata.farm_lng.split(","),
        };
      };

      vm.deleteCrop = function () {
        mobiscroll.confirm({
          title: "แจ้งเตือน",
          message: "คุณต้องการลบพื้นที่นี้ใช่หรือไม่ ?",
          okText: "ยืนยัน",
          cancelText: "ยกเลิก",
          callback: function (res) {
            if (res) {
              $ionicLoading.show();
              let req = {
                mode: "deleteCrops",
                data: $scope.editdata,
              };
              fachttp.model("createArea.php", req).then(
                function (response) {
                  //console.log('eiei')
                  if (response.data.status == true) {
                    $ionicLoading.hide();
                    $timeout(function () {
                      delete $scope.data;
                      // $scope.modaledit.hide();
                      $ionicHistory.goBack();

                      mobiscroll.toast({
                        message: "ลบพื้นที่เรียบร้อย",
                        color: "success",
                      });
                      // onStart();
                    }, 200);
                  } else if (response.data.status == "approve") {
                    mobiscroll.toast({
                      message:
                        "ไม่สามารถลบรายการนี้ได้เนื่องจากพื้นที่นี้ถูกอนุมัติแล้ว โปรดติดต่อทีมส่งเสริมเพื่อแก้ไขพื้นที่",
                      color: "danger",
                    });
                    $ionicLoading.hide();
                  } else {
                    Service.timeout();
                    $ionicLoading.hide();
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

      vm.editMap = function () {
        //console.log($scope.positionEdit);
        // $scope.modaledit.hide();
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

            controlText.innerHTML = "ลบที่วาด";
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
              // style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ["satellite", "roadmap", "hybrid"],
            },
            mapTypeId: "satellite",
            zoom: 19,
          });

          vm.here = function () {
            $ionicLoading.show({
              duration: 3000,
            });

            function callPosition() {
              var posOptions = {
                timeout: 10000,
                enableHighAccuracy: true,
              };
              return $cordovaGeolocation.getCurrentPosition(posOptions).then(
                function (position) {
                  //console.log(position);
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

            abc.then(function (response) {
              vm.position = {
                lat: response.coords.latitude,
                lng: response.coords.longitude,
              };

              map.setZoom(25);
              map.panTo(vm.position);

              $ionicLoading.hide();
            });
          };

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
              $ionicLoading.show();
              $timeout(function () {
                $ionicLoading.hide();

                // $scope.modaledit.show();
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
            //console.log(k);
            triangleCoords.push(k);
          }
          if (triangleCoords[0].lat != 0 || triangleCoords[0].lng != 0) {
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

            google.maps.event.addListener(
              bermudaTriangle,
              "click",
              function (e) {
                setSelection(bermudaTriangle);
              }
            );

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
          }
          //console.log(triangleCoords);

          // Construct the polygon.
        }, 500);
      };

      vm.selectIcon = function () {
        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 50,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: Camera.DestinationType.DATA_URL,
          allowEdit: false,
        });

        function onSuccess(imageData) {
          $ionicLoading.show({
            duration: 500,
          });
          let img = {
            img: "data:image/jpeg;base64," + imageData,
            desc: null,
          };
          $scope.image = img.img;
          $scope.editdata.imgpath = $scope.image;

          //console.log($scope.image);
        }

        function onFail(message) {
          // alert("Failed because: " + message);
        }
      };

      vm.removeIcon = function () {
        //console.log('ss')
        let hideSheet = $ionicActionSheet.show({
          titleText: "เลือกรายการ ",
          buttons: [
            {
              text: '<i class="icon ion-trash-a" ></i> ลบรูปภาพ',
            },
          ],
          buttonClicked: function (index) {
            if (index == 0) {
              $scope.image = "REMOVE";
              delete $scope.editdata.imgpath;
              //console.log($scope.image)
            }
            return true;
          },
        });

        // For example's sake, hide the sheet after two seconds
        $timeout(function () {
          hideSheet();
        }, 7000);
      };

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
              {
                text: "Cancel",
              },
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
              {
                text: "Cancel",
              },
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

      vm.updateCrop = function () {
        console.log('usethis')
        $ionicLoading.show();
        let req = {
          mode: "editCrop",
          data: $scope.editdata,
          icon: $scope.image,
          address: {
            province: vm.provinceSelect,
            aumphur: vm.aumphurSelect,
            tumbol: vm.tumbolSelect,
          },
          img: $scope.imagefarm,
          imgDel: $scope.imaeDel,
        };
        //console.log(req);
        fachttp.model("createArea.php", req).then(
          function (response) {
            //console.log(response);
            if (response.data.status == true) {
              $timeout(function () {
                $ionicLoading.hide();
                $ionicHistory.goBack();
                mobiscroll.toast({
                  message: "แก้ไขข้อมูลเรียบร้อย",
                  color: "success",
                });
                // onStart();
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

      $scope.doRefresh = function () {
        // here refresh data code
        $scope.$broadcast("scroll.refreshComplete");
        $scope.$apply();
        onStart();
      };

      vm.refresh = function () {
        delete $scope.data;
        delete $scope.status;
        onStart();
      };

      $ionicModal
        .fromTemplateUrl("my-vdo.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalVdo = modal;
        });

      $scope.openModalVdo = function () {
        $scope.modalVdo.show();
      };
      $scope.closeModalVdo = function () {
        $scope.stopYt();

        $scope.modalVdo.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.stopYt();
        $scope.modalVdo.remove();
      });

      $scope.vdoUrlChange = function (e) {
        console.log(e);
      };

      $scope.stopYt = function () {
        try {
          var iframes = document.getElementsByTagName("iframe");

          if (iframes[0]) {
            var iframe = iframes[0].contentWindow;

            iframe.postMessage(
              '{"event":"command","func":"' +
                "pauseVideo" +
                '","args":"","chromeWebSecurity": false}',
              "*"
            );
          }
        } catch (error) {}
      };

      $scope.vdoFocus = function () {
        // $scope.editdata.farm_vdo = "https://youtu.be/Ht_6puWUJH4";
        document.addEventListener("deviceready", function () {
          cordova.plugins.clipboard.paste(function (text) {
            var regExp =
              /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = text.match(regExp);
            console.log(text);

            if (match && match[7].length == 11) {
              console.log("match");
              $scope.$apply(function () {
                $scope.editdata.farm_vdo = text;
              });
            } else {
              Service.toast(
                "รูปแบบ URL ไม่ถูกต้องโปรด Coppy Url จาก Youtube",
                "danger"
              );

              // $scope.vdourl = text;
            }
          });
        });

      };

      $scope.delVdo = function () {
        $scope.editdata.farm_vdo = null;
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
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalmap.remove();
      });

      let platform = ionic.Platform.platform();

      vm.add5 = function (e) {
        $ionicLoading.show();
        //console.log(e);
        let myJSON = JSON.stringify(e);
        let req = {
          mode: "selectsubfarm",
          value: e,
        };
        fachttp.model("area.php", req).then(
          function (response) {
            //console.log(response.data);
            if (response.data.status == true) {
              $ionicLoading.hide();

              let res = JSON.stringify(response.data.result);

              $state.go("app.area2", {
                crop: myJSON,
                sub: res,
              });
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
                    .textContent("พื้นที่ไม่สมบูรณ์ แก้ไขพื้นที่ โดยกดรูปดินสอ")
                    .ariaLabel("Alert Dialog Demo")
                    .ok("OK")
                    .targetEvent()
                )
                .then(
                  function (answer) {},
                  function () {}
                );
              $ionicLoading.hide();
            }
          },
          function err(err) {
            $ionicLoading.hide();
          }
        );
      };

      vm.cropMstr = function (x) {
        $ionicLoading.show();
        $scope.areaMstr = x;

        let req = {
          mode: "cropMstr",
          config: $rootScope.cropSet,
        };
        fachttp.model("createArea.php", req).then(
          function (response) {
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
        $state.go("app.add6", {
          cropMstr: myJSON,
          areaMstr: myJsonarea,
        });
      };
      // $scope.openModalVdo();
    }
  )

  .controller("ListBottomSheetCtrl", function ($scope, $mdBottomSheet) {
    $scope.items = [
      { name: "เลือกจากอัลบั้ม", icon: "image" },
      { name: "ถ่ายรูป", icon: "camera" },
    ];

    $scope.listItemClick = function ($index) {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
    };
  })

  .controller("ListBottomSheetActionCtrl", function ($scope, $mdBottomSheet) {
    $scope.items = [
      { name: "แทนที่", icon: "image" },
      { name: "ถ่ายรูปใหม่", icon: "camera" },
      { name: "ลบรูปภาพ", icon: "trash-a" },
    ];

    $scope.listItemClick = function ($index) {
      var clickedItem = $scope.items[$index];
      $mdBottomSheet.hide(clickedItem);
    };
  })

  .controller(
    "area2Ctrl",
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
      $mdDialog,
      fachttp
    ) {
      let vm = this;
      console.log("22aa");
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

      $scope.model = {
        farm_desc: null,
        farm_startt: null,
        farm_endt: null,
      };
      $scope.count = [1, 2, 3, 4, 5];

      $scope.crop = JSON.parse($stateParams.crop);
      $scope.subfarm = JSON.parse($stateParams.sub);
      //console.log($scope.crop);
      //console.log($scope.subfarm);

      vm.here = function () {
        map.setZoom(25);
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

          // map.setCenter(bounds.getCenter());
          // map.setZoom(16);
          // map.panTo(bounds.getCenter());

          map.fitBounds(bounds);
          map.panTo(bounds.getCenter());
        }
      };
      //ทำตอนเริ่ม
      vm.allPolygon();

      vm.selectSub = function (e, index) {
        //console.log(all_overlays);

        $scope.subDetail = e;
        $scope.modaldetail.show();

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

          // map.setZoom(17);
          // map.panTo(bounds.getCenter());

          map.fitBounds(bounds);
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
        //console.log($scope.outOf);
        if ($scope.outOf) {
          $scope.modalmap.hide();
          $timeout(function () {
            $scope.modaledit.show();
            if ($scope.PolygonPatch) {
              // //console.log($scope.PolygonPatch);
            }
          }, 1000);
        } else {
          mobiscroll.alert({
            title: "แจ้งเตือน",
            message: "ไม่สามารถเพิ่มพื้นที่นี้ได้ กรุณาตรวจสอบพื้นที่อีกครั้ง",
            callback: function () {},
          });
        }
      };

      //console.log($scope.crop);

      if (!$scope.crop.farm_lat || !$scope.crop.farm_lng) {
        $mdDialog
          .show(
            $mdDialog
              .alert()
              .parent(
                angular.element(document.querySelector("#popupContainer"))
              )
              .clickOutsideToClose(false)
              .title("แจ้งเตือน")
              .textContent(
                "รูปแบบพื้นที่ไม่ถูกต้อง วาดพื้นที่ให้ถูกต้องก่อนวาดแปลง"
              )
              .ariaLabel("Alert Dialog Demo")
              .ok("OK")
              .targetEvent()
          )
          .then(
            function (answer) {
              $ionicHistory.goBack();
            },
            function () {}
          );
      } else {
        $scope.areaFarm = {
          lat: $scope.crop.farm_lat.split(","),
          lng: $scope.crop.farm_lng.split(","),
        };
      }

      vm.createSubmap = function () {
        $scope.modalmap.show();

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

            vm.newShape = null;
          }
        }

        function showoutput() {
          alert($scope.data);
        }

        vm.drawstatus = false;
        vm.newShape = null;

        vm.delete = function () {
          deleteSelectedShape();
          vm.drawstatus = !vm.drawstatus;
        };

        vm.draw = function () {
          vm.drawstatus = !vm.drawstatus;
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
        // var centerControl = new CenterControl(centerControlDiv, map);
        // centerControlDiv.index = 1;
        // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
        //   centerControlDiv
        // );

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
            $scope.checkOutOfArea = function (polygon) {
              let checkOutArea = [];
              let patch = polygon.getPath();
              for (var i = 0; i < polygon.getPath().length; i++) {
                let test = new google.maps.LatLng(
                  patch.getAt(i).lat().toFixed(5),
                  patch.getAt(i).lng().toFixed(5)
                );
                let resultArea = google.maps.geometry.poly.containsLocation(
                  test,
                  bermudaTriangle
                )
                  ? true
                  : false;

                checkOutArea.push(resultArea);
              }

              if (checkOutArea.includes(false)) {
                return false;
              } else {
                return true;
              }
            };

            /// Disable Controller//
            drawingManager.setOptions({
              drawingControl: false,
            });

            $scope.$apply(function () {
              vm.newShape = polygon;
              vm.newShape.type = polygon;
            });

            all_overlays.push(polygon);
            drawingManager.setDrawingMode(null);

            vm.newShape = polygon;
            vm.newShape.type = polygon;

            //Edit point
            google.maps.event.addListener(
              vm.newShape.getPath(),
              "set_at",
              function () {
                // //console.log(newShape.getPath())
                cal(vm.newShape.getPath());
                $scope.outOf = $scope.checkOutOfArea(polygon);
              }
            );

            //Insert point
            google.maps.event.addListener(
              vm.newShape.getPath(),
              "insert_at",
              function () {
                cal(vm.newShape.getPath());
                $scope.outOf = $scope.checkOutOfArea(polygon);
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

              let message = $scope.checkOutOfArea(vm.newShape)
                ? ""
                : "แปลงที่สร้างต้องอยู่ในพื้นที่ ที่กำหนดไว้เท่านั้น";

              //console.log(message);

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
                  "<b style='color:red'>" +
                  message +
                  "</div>" +
                  "</div>"
                // '<div style="margin-top:10px"><button type="button" class="button button-small button-assertive icon ion-trash-a" ></button>' +
                // '<button type="button" class="button button-small  button-positive icon ion-edit" style="margin-left:3px"></button>' +
                // "</div>"
              );

              infowindow.setPosition(polygon.getPath().getAt(0));
            }

            infowindow.open(map);
            cal(polygon.getPath());
            $scope.outOf = $scope.checkOutOfArea(polygon);
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
        drawingManager.setMap(map);

        map.fitBounds(areaFarm);
        map.panTo(areaFarm.getCenter());
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

        let req = {
          mode: "createSubFarm",
          area: vm.area,
          position: resposition,
          name: $scope.model,
          farm: $scope.crop,
        };
        fachttp.model("createArea.php", req).then(
          function (response) {
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

      $ionicModal
        .fromTemplateUrl("modalconnect.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (modal) {
          $scope.modalconnect = modal;
        });

      $scope.openModalConnect = function () {
        $scope.modalconnect.show();
      };
      $scope.closeModalConnect = function () {
        $scope.modalconnect.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on("$destroy", function () {
        $scope.modalconnect.remove();
      });

      vm.connect = function (e) {
        //console.log(e);
        $scope.modaldetail.hide();
        console.log("222");
        $scope.openModalConnect();
        $ionicLoading.show();

        let req = {
          mode: "iotlist",
        };
        fachttp.model("area.php", req).then(
          function (response) {
            console.log(response.data);
            vm.iotlist = response.data.result;
            $ionicLoading.hide();
          },
          function err(err) {
            $ionicLoading.hide();
            Service.timeout();
          }
        );

        // Appending dialog to document.body to cover sidenav in docs app
        // var confirm = $mdDialog
        //   .prompt()
        //   .title("เชื่อมต่ออุปกรณ์")
        //   .textContent(
        //     "ป้อนรหัสอุปกรณ์เพื่อเชื่อมต่อกับโรงเรือนที่ " + e.sup_sub_id
        //   )
        //   .placeholder("รหัสอุปกรณ์,IOT ID")
        //   .ariaLabel("รหัสอุปกรณ์,IOT ID")
        //   .initialValue()
        //   .targetEvent()
        //   .required(false)
        //   .ok("เชื่อมต่อ")
        //   .cancel("ยกเลิก");

        // $mdDialog.show(confirm).then(
        //   function (result) {
        //     if (result) {
        //       $ionicLoading.show();

        //       let req = {
        //         mode: "syncIOT",
        //         sub: e,
        //         iotid: result.toUpperCase(),
        //       };
        //       fachttp.model('area.php', req).then(function (response) {
        //           $ionicLoading.hide();

        //           if (response.data.status == "allow") {
        //             $mdDialog.show(
        //               $mdDialog
        //               .alert()
        //               .parent(
        //                 angular.element(
        //                   document.querySelector("#popupContainer")
        //                 )
        //               )
        //               .clickOutsideToClose(true)
        //               .title("เชื่อมต่ออุปกรณ์เรียบร้อยแล้ว")
        //               .textContent(
        //                 "เชื่อมต่ออุปกรณ์เรียบร้อยแล้ว เปิดรายการดูอีกครั้ง"
        //               )
        //               .ariaLabel("Alert Dialog Demo")
        //               .ok("Got it!")
        //               .targetEvent()
        //             );

        //             $ionicHistory.goBack();
        //           } else if (response.data.status == "notallow") {
        //             $mdDialog.show(
        //               $mdDialog
        //               .alert()
        //               .parent(
        //                 angular.element(
        //                   document.querySelector("#popupContainer")
        //                 )
        //               )
        //               .clickOutsideToClose(true)
        //               .title("แจ้งเตือน ไม่สามารถเชื่อมต่อได้ !")
        //               .textContent(
        //                 "ไม่สามารถเชื่อมต่ออุปกร์นี้ได้เนื่องจาก อุปกรณ์นี้เชื่อมต่อกับพื้นที่อื่นแล้ว *หากต้องการเชื่อมต่อ ให้ยกเลิกการเชื่อมต่ออุปกรณ์กับพื้นที่เดิมก่อน*"
        //               )
        //               .ariaLabel("Alert Dialog Demo")
        //               .ok("Got it!")
        //               .targetEvent()
        //             );
        //           } else if (response.data.status == false) {
        //             $mdDialog.show(
        //               $mdDialog
        //               .alert()
        //               .parent(
        //                 angular.element(
        //                   document.querySelector("#popupContainer")
        //                 )
        //               )
        //               .clickOutsideToClose(true)
        //               .title("แจ้งเตือน . . .")
        //               .textContent(
        //                 "ไม่พบอุปกรณ์นี้ กรุณาตรวจสอบหมายเลขอุปกรณ์อีกครั้ง หรือติดต่อผู้ให้บริการ"
        //               )
        //               .ariaLabel("Alert Dialog Demo")
        //               .ok("Got it!")
        //               .targetEvent()
        //             );
        //           }
        //         },
        //         function err(err) {
        //           $ionicLoading.hide();
        //           Service.timeout();
        //         }
        //       );
        //     }
        //   },
        //   function (e) {}
        // );
      };

      vm.checkClick = function (e, index) {
        console.log(e.check);
        if (e.check == true) {
          // console.log(e)
          for (let i = 0; i < vm.iotlist.length; i++) {
            vm.iotlist[i].check = false;
          }
          // if()
          vm.iotlist[index].check = true;
        } else {
          vm.iotlist[index].check = false;
        }
      };

      vm.disconnect = function (e) {
        $scope.modaldetail.hide();
        var confirm = $mdDialog
          .confirm()
          .title("ต้องการยกเลิกการเชื่อมต่อหรือไม่ ?")
          .textContent(
            "เมื่อยกเลิกการเชื่อมต่อกับอุปกรณ์ " +
              e.iot_id +
              "  คุณจะไม่สามารถดูรายละเอียดของอุปกรณ์ และการตั้งค่าอุปกรณ์ได้"
          )
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน. ยกเลิกการเชื่อมต่อ")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            $ionicLoading.show();

            let req = {
              mode: "dissyncIOT",
              sub: e,
            };
            fachttp.model("area.php", req).then(
              function (response) {
                $ionicLoading.hide();
                $ionicHistory.goBack();
                $mdDialog.show(
                  $mdDialog
                    .alert()
                    .parent(
                      angular.element(document.querySelector("#popupContainer"))
                    )
                    .clickOutsideToClose(true)
                    .title("ยกเลิกการเชื่อมต่ออุปกรณ์เรียบร้อยแล้ว")
                    .textContent(
                      "ยกเลิกการเชื่อมต่ออุปกรณ์เรียบร้อยแล้ว เปิดรายการดูอีกครั้ง"
                    )
                    .ariaLabel("Alert Dialog Demo")
                    .ok("Got it!")
                    .targetEvent()
                );
                if (response.data.status == true) {
                } else {
                }
              },
              function err(err) {}
            );
          },
          function () {
            //console.log("2");
          }
        );

        //console.log(e);
      };

      vm.deleteSub = function (e) {
        $scope.modaldetail.hide();
        var confirm = $mdDialog
          .confirm()
          .title("ต้องการลบแปลงนี้ใช่หรือไม่ ?")
          .textContent(
            "เมื่อลบแปลงนี้" +
              "หากคุณเชื่อมต่ออุปกรณ์อยู่ จะยกเลิกการเชื่อมต่ออัตโนมัติ ต้องการลบแปลงนี้หรือไม่ ?"
          )
          .ariaLabel("Lucky day")
          .targetEvent()
          .ok("ยืนยัน.")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function () {
            $ionicLoading.show();
            let url = $rootScope.ip + "area.php";
            let req = {
              mode: "deleteSub",
              sub: e,
            };
            fachttp.model("area.php", req).then(
              function (response) {
                if (response.data.status == true) {
                  $ionicHistory.goBack();
                  $mdDialog.show(
                    $mdDialog
                      .alert()
                      .parent(
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
                      )
                      .clickOutsideToClose(true)
                      .title("ลบแปลงนี้เรียบร้อยแล้ว")
                      .textContent(
                        "ลบแปลงนี้เรียบร้อยแล้ว เปิดรายการดูอีกครั้ง"
                      )
                      .ariaLabel("Alert Dialog Demo")
                      .ok("ยืนยัน")
                      .targetEvent()
                  );
                } else {
                  $mdDialog.show(
                    $mdDialog
                      .alert()
                      .parent(
                        angular.element(
                          document.querySelector("#popupContainer")
                        )
                      )
                      .clickOutsideToClose(true)
                      .title("แจ้งเตือน")
                      .textContent(
                        "ไม่สามารถลบแปลงนี้ได้ เนื่องจากอยู่ในกระบวนการเพาะปลูกแล้ว"
                      )
                      .ariaLabel("Alert Dialog Demo")
                      .ok("ยืนยัน")
                      .targetEvent()
                  );
                }
                //console.log(response.data);

                $ionicLoading.hide();
              },
              function err(err) {
                $ionicLoading.hide();
              }
            );
          },
          function () {}
        );

        //console.log(e);
      };
    }
  );
