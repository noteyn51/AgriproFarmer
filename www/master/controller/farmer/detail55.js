angular
  .module("app")

  .controller("detailCtrl", function (
    $scope,
    $ionicHistory,
    $state,
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
    fachttp,
    $mdDialog
  ) {
    let vm = this;

    vm.detailDisease = function () {
      $state.go('app.detailDisease', {
        wo_id: $scope.idSelected.wo_lot
      })
    }

    vm.detailGrowth = function () {
      $state.go('app.detailGrowth', {
        wo_id: $scope.idSelected.wo_lot
      })
    }


    vm.goBack = function () {

      $ionicHistory.nextViewOptions({
        disableBack: true
      });

      $ionicHistory.clearCache().then(function () {
        $state.go('app.farmerMenu');

      });

    };




    function onStartwoMstr() {
      let cancellerLoadpic = $q.defer();
      let req = {
        mode: "womstr",
      };

      $timeout(function () {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      fachttp.model('detail.php', req, {
        timeout: cancellerLoadpic.promise
      }).then(function (response) {

          $scope.status = true;
          //console.log(response);
          if (response.data.status == true) {
            vm.list = response.data;
            $scope.selectID(vm.list.result[0]);
          } else {
            vm.list = response.data;
          }
          //console.log(response);
        },
        function err(err) {
          //console.log(err);
          vm.list = [];
          $scope.status = false;
        }
      );
    }

    onStartwoMstr()

    $ionicModal
      .fromTemplateUrl("my-wo-id.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modaleMyId = modal;
      });

    $scope.openModalMyId = function () {
      $scope.modaleMyId.show();
    };
    $scope.closeModalMyId = function () {
      $scope.modaleMyId.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modaleMyId.remove();
    });


    $scope.selectID = function (e) {
      $ionicLoading.show()
      delete vm.route;
      $scope.idSelected = e;
      //console.log($scope.idSelected)
      $scope.modaleMyId.hide();

      let cancellerLoadpic = $q.defer();
      let req = {
        mode: "wr_route",
        id: e.wo_lot
      };

      $timeout(function () {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      fachttp.model('detail.php', req, {
        timeout: cancellerLoadpic.promise
      }).then(function (response) {
          $ionicLoading.hide();
          //console.log(response);
          if (response.data.status == true) {
            vm.route = response.data;
          } else {
            vm.route = response.data;
          }
          //console.log(vm.route);
        },
        function err(err) {
          $ionicLoading.hide();
          Service.timeout();
          vm.route = [];
        }
      );


      Service.toast(
        "เลือกรายการเพาะปลูก ID " + e.wo_lot,
        "info",
        "bottom"
      );
    }

    vm.detail2 = function (e) {
      function go() {
        $state.go('app.detail2', {
          wo: wo,
          route: route
        })
      }
      let wo = JSON.stringify($scope.idSelected);
      let route = JSON.stringify(e);
      if (!e.between) {
        var confirm = $mdDialog
          .confirm()
          .title("แจ้งเตือน")
          .textContent(
            "รายการนี้ยังไม่ถึงวันวันที่ต้องบันทึก ต้องการบันทึกรายการล่วงหน้าใช่หรือไม่ ?"
          )
          .ariaLabel("รายการนี้ยังไม่ถึงวันวันที่ต้องบันทึก ต้องการบันทึกรายการล่วงหน้าใช่หรือไม่ ")
          .targetEvent()
          .ok("ยืนยัน")
          .cancel("ยกเลิก");

        $mdDialog.show(confirm).then(
          function (result) {
            if (result) {
              go()
            }
          })
      } else {
        go()
      }








    }


    vm.hist = function () {
      $state.go('app.detailHist')
    }




    {


      ///////////////////////////////////////////
      //console.log($rootScope.global);
      $scope.crop = {
        frm_code: $rootScope.global.mob_farm_code
      };
      $rootScope.cropSet = $scope.crop;

      vm.addcrop = function () {
        $state.go("app.add3");
      };

      vm.edit = function (e) {
        $scope.modaledit.show();
        $scope.editdata = angular.copy(e);
        //console.log($scope.editdata);
        $scope.positionEdit = {
          lat: $scope.editdata.farm_lat.split(","),
          lng: $scope.editdata.farm_lng.split(",")
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
              let url = $rootScope.ip + "createArea.php";
              let req = {
                mode: "deleteCrops",
                data: $scope.editdata
              };
              $http.post(url, req).then(
                function (response) {
                  if (response.data.status == true) {
                    $ionicLoading.hide();
                    $timeout(function () {
                      delete $scope.data;
                      $scope.modaledit.hide();
                      mobiscroll.toast({
                        message: "ลบ Crop เรียบร้อย",
                        color: "success"
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
          }
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
                drawingControl: true
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
              lng: 100.478819
            },
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: false,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              mapTypeIds: ["satellite", "roadmap", "hybrid"]
            },
            mapTypeId: "satellite",
            zoom: 19
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
              drawingModes: ["polygon"]
            },
            polygonOptions: {
              clickable: true,
              editable: true,
              draggable: false,
              fillColor: "red",
              strokeColor: "green",
              strokeWeight: 3
            },
            drawingMode: null
          });
          // infowindow.open(map);
          google.maps.event.addListener(
            drawingManager,
            "polygoncomplete",
            function (polygon) {
              /// Disable Controller//
              drawingManager.setOptions({
                drawingControl: false
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
                    lat: patch
                      .getAt(i)
                      .lat()
                      .toFixed(5),
                    lng: patch
                      .getAt(i)
                      .lng()
                      .toFixed(5)
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
                  wah: wah
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
                  position: $scope.PolygonPatch
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
                  lng: lng.substring(0, lng.length - 1)
                };
                let z = {
                  lat: resposition.lat.split(","),
                  lng: resposition.lng.split(",")
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
            } else {}
          };

          var triangleCoords = [];
          for (let i = 0; i < $scope.positionEdit.lat.length; i++) {
            let k = {
              lat: parseFloat($scope.positionEdit.lat[i]),
              lng: parseFloat($scope.positionEdit.lng[i])
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
            fillOpacity: 0.35
          });

          drawingManager.setOptions({
            drawingControl: false
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
                lat: patch
                  .getAt(i)
                  .lat()
                  .toFixed(5),
                lng: patch
                  .getAt(i)
                  .lng()
                  .toFixed(5)
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
              wah: wah
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
            buttons: [{
                text: "Cancel"
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
                }
              }
            ]
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
            buttons: [{
                text: "Cancel"
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
                }
              }
            ]
          });
        }
      };

      vm.updateCrop = function () {
        $ionicLoading.show();
        let url = $rootScope.ip + "createArea.php";
        let req = {
          mode: "editCrop",
          data: $scope.editdata
        };
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
                  color: "success"
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

      $scope.doRefresh = function () {
        // here refresh data code
        $scope.$broadcast("scroll.refreshComplete");
        $scope.$apply();
        onStart();
      };

      function onStart() {
        let cancellerLoadpic = $q.defer();
        let url = $rootScope.ip + "area.php";
        let req = {
          mode: "selectFarm",
          config: $rootScope.cropSet,
          global: $rootScope.global
        };

        $timeout(function () {
          cancellerLoadpic.resolve("user cancelled");
        }, 8000);

        $http.post(url, req, {
          timeout: cancellerLoadpic.promise
        }).then(
          function suscess(response) {
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

      vm.refresh = function () {
        delete $scope.data;
        delete $scope.status;
        onStart();
      };

      onStart();



      $ionicModal
        .fromTemplateUrl("my-modaledit.html", {
          scope: $scope,
          animation: "slide-in-up"
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
          animation: "slide-in-up"
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
          animation: "slide-in-up"
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
        // //console.log(e);
        let myJSON = JSON.stringify(e);
        let url = $rootScope.ip + "area.php";
        let req = {
          mode: "selectsubfarm",
          value: e
        };
        $http.post(url, req).then(
          function suscess(response) {
            if (response.data.status == true) {
              $ionicLoading.hide();

              let res = JSON.stringify(response.data.result);

              $state.go("app.detail2", {
                crop: myJSON,
                sub: res
              });
            } else {
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
        let url = $rootScope.ip + "createArea.php";
        let req = {
          mode: "cropMstr",
          config: $rootScope.cropSet,
          global: $rootScope.global
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
        $state.go("app.add6", {
          cropMstr: myJSON,
          areaMstr: myJsonarea
        });
      };

    }
  })


  .controller("detail2Ctrl", function (
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
    $ionicScrollDelegate,
    $ionicSlideBoxDelegate,
    $q,
    $ionicActionSheet,
    fachttp
  ) {
    let vm = this;
    $scope.wo = JSON.parse($stateParams.wo)
    $scope.route = JSON.parse($stateParams.route)

    vm.typeChange = function (e) {
      $scope.growth.value = null
      $scope.growth.um = null

      //console.log(e)
    }
    $scope.model = {date:null,datedesc:null}

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

      $scope.model.date  = [year, monthAD, day].join('-');

      console.log($scope.model.date )

      monthBE = monthArr[month-1];

      $scope.model.datedesc = [day, monthBE, year+543].join(' ');

      console.log( $scope.model.datedesc)
    }

    startDate ()



    


    $scope.mdDateChange = function(date){
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
    }



    vm.goBack = function () {
      $state.go("app.farmerMenu");
    };

    $scope.ophist = [];
    $scope.ophistAdd = [];


    $scope.disease = {
      status: false,
      desc: null,
      pic: []
    }
    $scope.growth = {
      status: false,
      desc: null,
      pic: []
    }


    function opHist() {
      let cancellerLoadpic = $q.defer();
      let req = {
        mode: 'opHist',
        wo: $scope.wo
      };

      $timeout(function () {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      fachttp.model('detail.php', req, {
        timeout: cancellerLoadpic.promise
      }).then(function (response) {

          $scope.status = true;
          //console.log(response);
          if (response.data.status == true) {
            vm.opHist = response.data;
            vm.growthUm = response.data.growthum;
            vm.growthType = response.data.growthtype;
            vm.distype = response.data.distype;
            vm.colorlevel = response.data.colorlevel;

            $scope.growth.type = vm.growthType[0]
            $scope.growth.um = vm.growthUm[0]
            // $scope.growth.value = vm.colorlevel[0].val


            //console.log($scope.growth.um)




            //console.log(vm.colorlevel)

            $scope.model.time = response.data.datetime.time;
             
          } else {
            vm.opHist = response.data;
          }
          //console.log(response);
        },
        function err(err) {
          //console.log(err);
          vm.opHist = [];
          $scope.status = false;
        }
      );
    }

    opHist()

    // //console.log($scope.wo)
    // //console.log($scope.route)


    vm.goBack = function () {
      $ionicHistory.goBack();
    }



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

    vm.confirm = function () {
      let arr = [];
      //console.log($scope.model) //date
      //console.log(vm.opHist) //รดน้ำ อื่นๆ
      //console.log($scope.route) //route
      //console.log($scope.wo) //wo
      //console.log($scope.tempData)
      //console.log($scope.soil)
      //console.log($scope.water)

      //console.log($scope.image)

      //console.log($scope.disease)
      //console.log($scope.growth)

      if ($scope.model.date && $scope.model.time) {

        function n() {


          var confirm = $mdDialog
            .confirm()
            .title("ยืนยันการบันทึก")
            .textContent(
              "บันทึกข้อมูลการเพาะปลูกใช่หรือไม่ ?"
            )
            .ariaLabel("บันทึกข้อมูลการเพาะปลูกใช่หรือไม่")
            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(
            function (result) {
              if (result) {
                $ionicLoading.show();

                let cancellerLoadpic = $q.defer();
                let req = {
                  mode: 'recordOP',
                  wo: $scope.wo,
                  route: $scope.route,
                  ophist: vm.opHist,
                  model: $scope.model,
                  temp: $scope.tempData,
                  soil: $scope.soil,
                  water: $scope.water,
                  disease: $scope.disease,
                  growth: $scope.growth

                };

                $timeout(function () {
                  cancellerLoadpic.resolve("user cancelled");
                }, 8000);

                fachttp.model('detail.php', req, {
                  timeout: cancellerLoadpic.promise
                }).then(function (response) {
                    $ionicLoading.hide();

                    //console.log(response.data);
                    if (response.data.status == true) {
                      mobiscroll.alert({
                        title: "แจ้งเตือน",
                        message: "บันทึกข้อมูลสำเร็จ",
                        callback: function () {
                          $state.go('app.detail')
                        }
                      });
                    } else {

                    }
                  },
                  function err(err) {
                    $ionicLoading.hide();
                    Service.timeout()
                  }
                );

              }
            })
        }

        // n() 

        if ($scope.disease.status == true) {
          if ($scope.disease.desc && $scope.disease.type) {
            arr.push(true)
          } else {
            arr.push(false)
          }
        } else {
          arr.push(true)
        }

        if ($scope.growth.status == true) {
          if ($scope.growth.desc && $scope.growth.value) {
            arr.push(true)
          } else {
            arr.push(false)
          }
        } else {
          arr.push(true)
        }
        if (!arr.includes(false)) {
          n()
        } else {
          $mdDialog.show(
            $mdDialog
            .alert()
            .parent(
              angular.element(
                document.querySelector("#popupContainer")
              )
            )
            .clickOutsideToClose(false)
            .title("แจ้งเตือน")
            .textContent("กรุณาตรวจสอบข้อมูลให้ครบถ้วนก่อนบันทึก")
            .ariaLabel("Alert Dialog Demo")
            .ok("OK")
            .targetEvent()
          );
        }

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
          .textContent("ข้อมูลวันที่ไม่ครบถ้วนกรุณาตรวจวันที่บันทึก")
          .ariaLabel("Alert Dialog Demo")
          .ok("OK")
          .targetEvent()
        );
      }

      //console.log(arr)



    }

    $ionicModal
      .fromTemplateUrl("myOp.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modalAddOp = modal;
      });

    $scope.openModalOp = function () {
      $scope.modalAddOp.show();
    };
    $scope.closeModalOp = function () {
      $scope.modalAddOp.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalAddOp.remove();
    });

    $scope.tempData = [{
        code: 'temp',
        desc: 'อุณหภูมิ',
        val: null,
        url: 'img/iconOP/1.png',
        um: '°C',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/1.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "soil",
        desc: 'ความชื้นในดิน',
        val: null,
        url: 'img/iconOP/2.png',
        um: '%',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/2.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "air",
        desc: 'ความชื้นอากาศ',
        val: null,
        url: 'img/iconOP/4.png',
        um: '%',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/4.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "wind",
        desc: 'ความเร็วลม',
        val: null,
        url: 'img/iconOP/3.png',
        um: 'm/s',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/3.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
    ]

    $scope.soil = [{
        code: 'N',
        desc: 'N',
        val: null,
        url: 'img/iconOP/npk.png',
        um: '',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/npk.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "P",
        desc: 'P',
        val: null,
        url: 'img/iconOP/2.png',
        um: '',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/npk.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "K",
        desc: 'K',
        val: null,
        url: 'img/iconOP/3.png',
        um: '',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/npk.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "PH",
        desc: 'pH',
        val: null,
        url: 'img/iconOP/ph.png',
        um: '',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/ph.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      }
    ]

    $scope.water = [{
        code: 'WATERPH',
        desc: 'pH',
        val: null,
        url: 'img/iconOP/ph.png',
        um: '',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/ph.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "TEMP",
        desc: 'อุณหภูมิ',
        val: null,
        url: 'img/iconOP/1.png',
        um: '°C',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/1.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "CO2",
        desc: 'CO2',
        val: null,
        url: 'img/iconOP/co2.png',
        um: 'ppm',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/co2.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "O2",
        desc: 'O2',
        val: null,
        url: 'img/iconOP/o2.png',
        um: '%',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/o2.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      },
      {
        code: "RAIN",
        desc: 'ปริมาณน้ำฝน',
        val: null,
        url: 'img/iconOP/rainfall.png',
        um: 'mm.',
        style: {
          'height': '32px',
          'width': '32px',
          'background-image': 'url("../img/iconOP/rainfall.png")',
          'background-position': 'center',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
        }
      }
    ]

    // $scope.ophist = [];
    // $scope.ophistAdd = [];


    // $scope.disease = {
    //   status: false,
    //   desc: null,
    //   pic: []
    // }
    // $scope.growth = {
    //   status: false,
    //   desc: null,
    //   pic: []
    // }



    $scope.growthChange = function () {
      if ($scope.growth.status == false) {
        $scope.growth.pic = []
        $scope.growth.desc = null
      }
      $ionicScrollDelegate.resize();

      //console.log($scope.growth.status)
    }

    $scope.diseaseChange = function () {
      if ($scope.disease.status == false) {
        $scope.disease.pic = []
        $scope.disease.desc = null
      }
      $ionicScrollDelegate.resize();

      //console.log($scope.disease.status)
    }





    vm.addOp = function () {
      $scope.modalAddOp.show();
    }

    vm.add = function (e, i) {

      if ($scope.ophistAdd.includes(e.code)) {
        //console.log("=");
        Service.toast("รายการนี้ถูกเพิ่มไปแล้ว", "danger", "bottom");
      } else {
        $scope.ophist.push(e)
        $scope.ophistAdd.push(e.code)
        Service.toast(
          "เพิ่มการบันทึก " + e.desc + " แล้ว",
          "info",
          "bottom"
        );
      }


      // $scope.ophist.push(e)
      // $scope.ophistAdd.push(e.code)


    }

    vm.del = function (i) {
      $scope.ophistAdd.splice(i, 1);
      $scope.ophist.splice(i, 1);
    }



    $scope.checkInclude = function (e) {
      if ($scope.ophistAdd.includes(e)) {
        return true;
      } else {
        return false;
      }
    }

    vm.pic = {
      pic: [{
          style: {
            'height': '100px',
            'width': '150px',
            'background-image': 'url("data:image/gif;base64,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")',
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
          }
        }, {
          style: {
            'height': '100px',
            'width': '150px',
            'background-image': 'url("data:image/gif;base64,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")',
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
          }
        }, {
          style: {
            'height': '100px',
            'width': '150px',
            'background-image': 'url("data:image/gif;base64,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")',
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
          }
        }, {
          style: {
            'height': '100px',
            'width': '150px',
            'background-image': 'url("data:image/gif;base64,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")',
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
          }
        }, {
          style: {
            'height': '100px',
            'width': '150px',
            'background-image': 'url("data:image/gif;base64,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")',
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'background-size': 'cover',
          }
        }

      ],
      desc: null
    }


    $scope.image = [];

    vm.addPic = function (e) {
      //console.log(e)
      let platform = ionic.Platform.platform();
      // $scope.openModalPic();

      if (platform == "android" || platform == "ios") {
        camera(e);
      } else {
        let img = {
          img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg==",
        };
        e.pic.push(img);
        //console.log(e);

        $timeout(function () {
          $ionicSlideBoxDelegate.slide($scope.image.length - 1);
        }, 500);
        $ionicSlideBoxDelegate.update();
        $ionicScrollDelegate.resize();
      }
    };

    vm.selectPic = function (e) {
      let platform = ionic.Platform.platform();
      if (platform == "android" || platform == "ios") {
        image(e);
      } else {
        let img = {
          img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg==",
        };
        e.pic.push(img);
        //console.log(e);


        $timeout(function () {
          $ionicSlideBoxDelegate.slide($scope.image.length - 1);
        }, 500);
        $ionicSlideBoxDelegate.update();
        $ionicScrollDelegate.resize();
      }
    };

    function camera(e) {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 40,
        sourceType: Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1920,
        targetHeight: 1080,
      });

      function onSuccess(imageData) {
        $ionicLoading.show({
          duration: 500,
        });

        let img = {
          img: "data:image/jpeg;base64," + imageData
        };
        e.pic.push(img);
        $ionicSlideBoxDelegate.update();
        $ionicScrollDelegate.resize();
      }

      function onFail(message) {
        alert("Failed because: " + message);
      }
    }

    function image(e) {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 40,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 1920,
        targetHeight: 1080,
      });

      function onSuccess(imageData) {
        $ionicLoading.show({
          duration: 500,
        });
        let img = {
          img: "data:image/jpeg;base64," + imageData
        };
        e.pic.push(img);

        $ionicSlideBoxDelegate.update();
        $ionicScrollDelegate.resize();
      }

      function onFail(message) {
        alert("Failed because: " + message);
      }
    }

    vm.delete = function (i) {
      //console.log(i);
      $scope.image.splice(i, 1);
      $timeout(function () {
        $ionicSlideBoxDelegate.slide($scope.image.length - 1);
      }, 200);
      $ionicSlideBoxDelegate.update();
      $ionicScrollDelegate.resize();
    };


    vm.removeIcon = function (i, e) {
      //console.log(e)
      let hideSheet = $ionicActionSheet.show({
        titleText: "เลือกรายการ ",
        buttons: [{
            text: '<i class="icon ion-trash-a" ></i> ลบรูปภาพ',
          },

        ],
        buttonClicked: function (index) {
          //console.log(e)
          //console.log(index)

          if (index == 0) {
            e.pic.splice(i, 1);
            $ionicSlideBoxDelegate.update();
            $ionicScrollDelegate.resize();
          }
          return true;
        },
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 7000);

    }







    $scope.allImages = [{
      src: 'https://www.w3schools.com/w3images/lights.jpg'
    }, {
      src: 'https://image.freepik.com/free-photo/image-human-brain_99433-298.jpg'
    }, {
      src: 'https://image.shutterstock.com/image-photo/colorful-flower-on-dark-tropical-260nw-721703848.jpg'
    }];

    $scope.zoomMin = 1;

  })



  .controller("detailHistCtrl", function (
    $scope,
    $ionicHistory,
    $state,
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
    fachttp,
    $mdDialog,
    $ionicScrollDelegate
  ) {
    let vm = this;

    function opHist() {
      let cancellerLoadpic = $q.defer();
      let req = {
        mode: 'history',
      };

      $timeout(function () {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      fachttp.model('detail.php', req, {
        timeout: cancellerLoadpic.promise
      }).then(function (response) {

          $scope.status = true;
          //console.log(response);
          if (response.data.status == true) {
            vm.historyList = response.data;
          } else {
            vm.opHist = response.data;
          }
          //console.log(response);
        },
        function err(err) {
          //console.log(err);
          vm.opHist = [];
          $scope.status = false;
        }
      );
    }

    opHist()

    $ionicModal
      .fromTemplateUrl("hist.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function (modal) {
        $scope.modalHist = modal;
      });

    $scope.openModalHist = function (e) {
      $scope.histIdSelect = e;
      $scope.modalHist.show();

      let req = {
        mode: 'hisdetail',
        value: e
      };
      fachttp.model('detail.php', req).then(function (response) {

          $scope.status = true;
          //console.log(response);
          if (response.data.status == true) {
            vm.historyDetail = response.data;
          } else {
            vm.historyDetail = response.data;
          }
          //console.log(response);
          $ionicScrollDelegate.resize();

        },
        function err(err) {
          //console.log(err);
          vm.historyDetail = [];
          $scope.status = false;
        }
      );
    };
    $scope.closeModalHist = function () {
      $scope.modalHist.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on("$destroy", function () {
      $scope.modalHist.remove();
    });


    $scope.showhide = function (e) {
      $ionicScrollDelegate.resize();
      e.check = !e.check;
      //console.log("22");
      $ionicScrollDelegate.resize();
    };

  })

  .controller("detailDiseaseCtrl", function (
    $scope,
    $ionicHistory,
    $state,
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
    fachttp,
    $mdDialog,
    $ionicScrollDelegate,
    $ionicActionSheet) {
    let vm = this;

    vm.openPic = function (index, e) {
      //console.log(index)
      //console.log(e)
      $scope.allImages = e;
      // $scope.image = {src:e}
      // //console.log($scope.image)
      $scope.activeSlide = index;
      $scope.showModal('templates/modal/picmodal.html');
    };

    $scope.showModal = function (templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }

    $scope.closeModal = function () {
      $scope.modal.hide();
      $scope.modal.remove()
    };

    $scope.updateSlideStatus = function (slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };


    function onStart() {
      let req = {
        mode: "disDetail",
        woId: $stateParams.wo_id
      };


      fachttp.model('detail.php', req).then(function (response) {
          $scope.status = true;
          //console.log(response);
          if (response.data.status == true) {
            vm.list = response.data;
          } else {
            vm.list = response.data;
          }
          //console.log(response);
        },
        function err(err) {
          //console.log(err);
          vm.list = [];
          $scope.status = false;
        }
      );
    }

    onStart()

    vm.goComment = function (e) {
      //console.log(e.dis_line)
      $state.go('app.detailDiseaseComment', {
        'postId': e.dis_line
      });
    }

    vm.more = function (e) {
      //console.log(e)

      //console.log(e)
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        // buttons: [
        //   { text: '<b>Share</b> This' },
        //   { text: 'Move' }
        // ],
        destructiveText: 'ลบการบันทึกนี้',
        titleText: 'เลือกรายการ',
        cancelText: 'ยกเลิก',
        cancel: function () {
          // add cancel code..
        },
        // buttonClicked: function(index) {
        //   return true;
        // },
        destructiveButtonClicked: function () {

          var confirm = $mdDialog
            .confirm()
            .title("แจ้งเตือน !!!")
            .textContent(
              "*หากลบรายการนี้จะไม่สามารถดูการบันทึกนี้ได้อีกต่อไป  ต้องการเริ่มต้นการกระบวนการนี้หรือไม่ ?"
            )
            .ariaLabel("Lucky day")
            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(
            function () {
              $ionicLoading.show();
              let req = {
                mode: "delPost",
                post: e
              };
              fachttp.model('detail.php', req).then(function (response) {
                  $ionicLoading.hide();

                  onStart()

                },
                function err(err) {
                  $ionicLoading.hide();


                }
              );
            },
            function () {
              //console.log(2)

            }
          );




          return true;
        },
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 8000);

    }

  })

  .controller("detailGrowthCtrl", function (
    $scope,
    $ionicHistory,
    $state,
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
    fachttp,
    $mdDialog,
    $ionicScrollDelegate,
    $ionicActionSheet, $ionicBackdrop) {
    let vm = this;

    vm.openPic = function (index, e) {
      //console.log(index)
      //console.log(e)
      $scope.allImages = e;
      // $scope.image = {src:e}
      // //console.log($scope.image)
      $scope.activeSlide = index;
      $scope.showModal('templates/modal/picmodal.html');
    };

    $scope.showModal = function (templateUrl) {
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }

    $scope.closeModal = function () {
      $scope.modal.hide();
      $scope.modal.remove()
    };

    $scope.updateSlideStatus = function (slide) {
      var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
      if (zoomFactor == $scope.zoomMin) {
        $ionicSlideBoxDelegate.enableSlide(true);
      } else {
        $ionicSlideBoxDelegate.enableSlide(false);
      }
    };



    $scope.zoomMin = 1;




    vm.clossePic = function () {

    }

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['ไม่มีการบันทึก'];
    $scope.data = [
      [0, 0, 0, 0, 0, 0, 0]
    ];

    //console.log($scope.labels)
    //console.log($scope.series)
    //console.log($scope.data)

    function onStart() {
      let req = {
        mode: "growtgDetail",
        woId: $stateParams.wo_id
      };


      fachttp.model('detail.php', req).then(function (response) {
          $scope.status = true;
          //console.log(response);
          if (response.data.status == true) {
            vm.list = response.data;
            $scope.labels = response.data.labels;
            $scope.series = response.data.series;
            $scope.data = response.data.data;
            vm.list = response.data.detail;
            vm.typeAll = response.data.typeAll;
            //console.log(vm.typeAll)
            //console.log($scope.data)


            // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
            // $scope.series = ['ไม่มีการบันทึก'];
            // $scope.data = [
            //   [20, 0, 0, 0, 0, 0, 0]
            // ];



            //console.log($scope.labels)
            //console.log($scope.series)
            //console.log($scope.data)


          } else {
            vm.list = [];
          }
          //console.log(response);
        },
        function err(err) {
          //console.log(err);
          vm.list = [];
          $scope.status = false;
        }
      );
    }

    onStart()

    vm.goComment = function (e) {
      //console.log(e.dis_line)
      $state.go('app.detailDiseaseComment', {
        'postId': e.dis_line
      });
    }

    vm.more = function (e) {
      //console.log(e)

      //console.log(e)
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        // buttons: [
        //   { text: '<b>Share</b> This' },
        //   { text: 'Move' }
        // ],
        destructiveText: 'ลบการบันทึกนี้',
        titleText: 'เลือกรายการ',
        cancelText: 'ยกเลิก',
        cancel: function () {
          // add cancel code..
        },
        // buttonClicked: function(index) {
        //   return true;
        // },
        destructiveButtonClicked: function () {

          var confirm = $mdDialog
            .confirm()
            .title("แจ้งเตือน !!!")
            .textContent(
              "*หากลบรายการนี้จะไม่สามารถดูการบันทึกนี้ได้อีกต่อไป  ต้องการเริ่มต้นการกระบวนการนี้หรือไม่ ?"
            )
            .ariaLabel("Lucky day")
            .targetEvent()
            .ok("ยืนยัน")
            .cancel("ยกเลิก");

          $mdDialog.show(confirm).then(
            function () {
              $ionicLoading.show();
              let req = {
                mode: "delPost",
                post: e
              };
              fachttp.model('detail.php', req).then(function (response) {
                  $ionicLoading.hide();

                  onStart()

                },
                function err(err) {
                  $ionicLoading.hide();


                }
              );
            },
            function () {
              //console.log(2)

            }
          );




          return true;
        },
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function () {
        hideSheet();
      }, 8000);

    }

    $scope.onClick = function (points, evt) {
      //console.log(points, evt);
    };
    $scope.datasetOverride = [{
      yAxisID: 'y-axis-1'
    }, {
      yAxisID: 'y-axis-2'
    }];
    $scope.options = {
      scales: {
        yAxes: [{
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          },
          {
            id: 'y-axis-2',
            type: 'linear',
            display: false,
            position: 'right'
          }
        ]
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      pointBorderWidth: 10,
      title: {
        display: true,
        position: 'top',
        text: 'กราฟแสดงการเจริญเติบโต'
      },

      // tooltips : {
      //   bodyAlign:'center',
      //   titleAlign:'center'
      // },

      responsiveAnimationDuration: 0,




    };


    vm.changeType = function (e) {
      $ionicLoading.show();
      let req = {
        mode: "growtgChangeType",
        type: e.dis_rmks2,
        woId: $stateParams.wo_id
      };


      fachttp.model('detail.php', req).then(function (response) {
      $ionicLoading.hide();

        $scope.labels = response.data.labels;
        $scope.series = response.data.series;
        $scope.data = response.data.data;
        //console.log(response.data)

      }, function err(err) {
      $ionicLoading.hide();
        //console.log(err);

      });
    }


  })

  .controller("detailDiseaseCommentCtrl", function (
    $scope,
    $ionicHistory,
    $state,
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
    fachttp,
    $mdDialog,
    $ionicScrollDelegate) {
    let vm = this;

    vm.postId = $stateParams.postId;
    //console.log(vm.postId)

    function onStart() {
      let req = {
        mode: "disComeent",
        postId: vm.postId
      };


      fachttp.model('detail.php', req).then(function (response) {
          $scope.status = true;
          //console.log(response);
          if (response.data.status == true) {
            vm.list = response.data;
          } else {
            vm.list = response.data;
          }
          //console.log(response);
        },
        function err(err) {
          //console.log(err);
          vm.list = [];
          $scope.status = false;
        }
      );
    }

    onStart()

  

  })



  // .controller("detail2Ctrl", function (
  //   $ionicHistory,
  //   $state,
  //   $scope,
  //   $stateParams,
  //   $rootScope,
  //   $http,
  //   $ionicModal,
  //   $ionicLoading,
  //   $timeout,
  //   $ionicPopup,
  //   Service,
  //   $mdDialog,
  //   $ionicScrollDelegate,
  //   $ionicSlideBoxDelegate,
  //   $q,
  //   $ionicActionSheet
  // ) {
  //   let vm = this;
  //   vm.pic_desc;
  //   //console.log('6658')
  //   //modal
  //   {
  //     $ionicModal
  //       .fromTemplateUrl("my-map.html", {
  //         scope: $scope,
  //         animation: "slide-in-up"
  //       })
  //       .then(function (modal) {
  //         $scope.modalmap = modal;
  //       });

  //     $scope.openModalMap = function () {
  //       $scope.modalmap.show();
  //     };
  //     $scope.closeModalMap = function () {
  //       $scope.modalmap.hide();
  //     };
  //     // Cleanup the modal when we're done with it!
  //     $scope.$on("$destroy", function () {
  //       $scope.modalmap.remove();
  //     });

  //     $ionicModal
  //       .fromTemplateUrl("my-modaledit.html", {
  //         scope: $scope,
  //         animation: "slide-in-up"
  //       })
  //       .then(function (modal) {
  //         $scope.modaledit = modal;
  //       });

  //     $scope.openModalEdit = function () {
  //       $scope.modaledit.show();
  //     };
  //     $scope.closeModalEdit = function () {
  //       $scope.drawCheck = false;
  //       $scope.modaledit.hide();
  //     };

  //     $scope.$on("$destroy", function () {
  //       $scope.modaledit.remove();
  //     });

  //     $ionicModal
  //       .fromTemplateUrl("my-detail.html", {
  //         scope: $scope,
  //         animation: "slide-in-up"
  //       })
  //       .then(function (modal) {
  //         $scope.modaldetail = modal;
  //       });

  //     $scope.openModalDetail = function () {
  //       $scope.modaldetail.show();
  //     };
  //     $scope.closeModalDetail = function () {
  //       $scope.modaldetail.hide();
  //     };

  //     $scope.$on("$destroy", function () {
  //       $scope.modaldetail.remove();
  //     });

  //     $ionicModal
  //       .fromTemplateUrl("pic_desc.html", {
  //         scope: $scope,
  //         animation: "slide-in-up"
  //       })
  //       .then(function (modal) {
  //         $scope.modalPic = modal;
  //       });

  //     $scope.openModalPic = function () {
  //       $scope.modalPic.show();
  //     };
  //     $scope.closeModalPic = function () {
  //       $scope.modalPic.hide();
  //     };
  //     // Cleanup the modal when we're done with it!
  //     $scope.$on("$destroy", function () {
  //       $scope.modalPic.remove();
  //     });

  //     $ionicModal
  //       .fromTemplateUrl("list_map.html", {
  //         scope: $scope,
  //         animation: "slide-in-up"
  //       })
  //       .then(function (modal) {
  //         $scope.modalListmap = modal;
  //       });

  //     $scope.openModalListmap = function () {
  //       $scope.modalListmap.show();
  //     };
  //     $scope.closeModalListmap = function () {
  //       $scope.modalListmap.hide();
  //     };
  //     // Cleanup the modal when we're done with it!
  //     $scope.$on("$destroy", function () {
  //       $scope.modalListmap.remove();
  //     });
  //   }

  //   $scope.model = {
  //     farm_desc: null,
  //     farm_startt: null,
  //     farm_endt: null
  //   };
  //   $scope.count = [1, 2, 3, 4, 5];

  //   $scope.crop = JSON.parse($stateParams.crop);
  //   //console.log($scope.crop);
  //   $scope.subfarm = JSON.parse($stateParams.sub);
  //   //console.log($scope.subfarm);

  //   vm.listmap = function () {
  //     $scope.modalListmap.show();
  //     $ionicLoading.show();

  //     $timeout(function () {
  //       $ionicLoading.hide();

  //       //console.log($scope.subfarm);

  //       let triangleCoordsListmap = [];
  //       let all_overlaysListmap = [];
  //       let polygonCoordsListmap = [];
  //       let polygonCoordsFarmListmap = [];
  //       let boundsListmap = new google.maps.LatLngBounds();
  //       for (let x = 0; x < $scope.subfarm.length; x++) {
  //         let e = $scope.subfarm[x];

  //         let map = new google.maps.Map(document.getElementById(x), {
  //           zoom: 5,
  //           // center: bounds.getCenter(),
  //           center: new google.maps.LatLng(13.760412, 100.485357),
  //           streetViewControl: false,
  //           fullscreenControl: false,
  //           mapTypeId: "satellite",
  //           mapTypeControl: false,
  //           zoomControl: false
  //         });
  //         triangleCoordsListmap = [];
  //         polygonCoordsListmap = [];
  //         boundsListmap = new google.maps.LatLngBounds();
  //         $scope.abc = {
  //           lat: e.sub_lat.split(","),
  //           lng: e.sub_lng.split(",")
  //         };

  //         // //////////console.log($scope.abc);

  //         // //////////console.log("666666");

  //         for (let i = 0; i < $scope.abc.lat.length; i++) {
  //           let k = {
  //             lat: parseFloat($scope.abc.lat[i]),
  //             lng: parseFloat($scope.abc.lng[i])
  //           };

  //           polygonCoordsListmap.push(new google.maps.LatLng(k.lat, k.lng));
  //           triangleCoordsListmap.push(k);
  //         }
  //         // //////////console.log(triangleCoords);

  //         for (i = 0; i < polygonCoordsListmap.length; i++) {
  //           boundsListmap.extend(polygonCoordsListmap[i]);
  //         }

  //         let bermudaTriangle = new google.maps.Polygon({
  //           editable: false,
  //           paths: triangleCoordsListmap,
  //           strokeColor: "red",
  //           strokeOpacity: 0.8,
  //           strokeWeight: 2,
  //           fillColor: "red",
  //           fillOpacity: 0.35
  //         });

  //         all_overlaysListmap.push(bermudaTriangle);

  //         // //console.log(all_overlaysListmap[x]);
  //         // //console.log(map);

  //         all_overlaysListmap[x].setMap(map);

  //         map.fitBounds(boundsListmap);
  //         map.panTo(boundsListmap.getCenter());
  //       }
  //     }, 1000);
  //   };

  //   vm.action = function () {
  //     let res = JSON.stringify($scope.subDetail);
  //     let job;
  //     if ($scope.model.job) {
  //       job = JSON.stringify($scope.model.job);
  //       $state.go("app.detail2-2", {
  //         crop: $stateParams.crop,
  //         // sub: $stateParams.sub,
  //         detail: res,
  //         job: job
  //       });
  //     } else {
  //       alert('ยังไม่การเริ่มเพาะปลูกในพื้นที่นี้')
  //     }


  //   };

  //   vm.record = function(){
  //     $state.go('app.recordPlant2')
  //   }

  //   vm.here = function () {
  //     map.setZoom(17);
  //     map.panTo(bounds.getCenter());
  //   };

  //   vm.allPolygon = function () {
  //     if ($scope.subfarm.length > 0) {
  //       for (i = 0; i < all_overlays.length; i++) {
  //         all_overlays[i].setMap(null); //or line[i].setVisible(false);
  //       }
  //       triangleCoords = [];
  //       all_overlays = [];
  //       polygonCoords = [];
  //       bounds = new google.maps.LatLngBounds();
  //       for (let e = 0; e < $scope.subfarm.length; e++) {
  //         triangleCoords.push([]);
  //         $scope.positionPolygon = {
  //           lat: $scope.subfarm[e].sub_lat.split(","),
  //           lng: $scope.subfarm[e].sub_lng.split(",")
  //         };

  //         for (let i = 0; i < $scope.positionPolygon.lat.length; i++) {
  //           let k = {
  //             lat: parseFloat($scope.positionPolygon.lat[i]),
  //             lng: parseFloat($scope.positionPolygon.lng[i])
  //           };
  //           polygonCoords.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
  //           triangleCoords[e].push(k); // เอาไปวาดเส้น
  //         }
  //         // //////////console.log(polygonCoords);
  //         // //////////console.log(triangleCoords[e]);

  //         for (let i = 0; i < polygonCoords.length; i++) {
  //           bounds.extend(polygonCoords[i]);
  //         }

  //         var bermudaTriangle = new google.maps.Polygon({
  //           editable: false,
  //           paths: triangleCoords[e],
  //           strokeColor: color[e],
  //           strokeOpacity: 0.8,
  //           strokeWeight: 2,
  //           fillColor: color[e],
  //           fillOpacity: 0.35
  //         });

  //         all_overlays.push(bermudaTriangle);
  //         all_overlays[e].setMap(map);
  //       }
  //       map.setCenter(bounds.getCenter());
  //       map.setZoom(16);
  //       map.panTo(bounds.getCenter());
  //     }
  //   };
  //   //ทำตอนเริ่ม
  //   // vm.allPolygon();

  //   $scope.imgsrc = [{
  //     path: "http://www.sct.ac.th/GrandCollege_files/noAvatar.png"
  //   }];

  //   vm.picRefresh = function () {
  //     loadPic($scope.subDetail);
  //   };

  //   function loadPic(e) {
  //     let cancellerLoadpic = $q.defer();
  //     $ionicLoading.show();

  //     let url = $rootScope.ip + "area.php";
  //     let req = {
  //       mode: "loadPic",
  //       farm: e
  //     };

  //     $timeout(function () {
  //       cancellerLoadpic.resolve("user cancelled");
  //     }, 6000);

  //     $http.post(url, req, {
  //       timeout: cancellerLoadpic.promise
  //     }).then(
  //       function suscess(response) {
  //         $scope.imgsrc = response.data;
  //         //console.log($scope.imgsrc);

  //         $ionicLoading.hide();
  //         $ionicSlideBoxDelegate.update();
  //         $timeout(function () {
  //           $ionicSlideBoxDelegate.slide($scope.imgsrc.result.length - 1);
  //         }, 200);
  //       },
  //       function err(err) {
  //         $scope.imgsrc = {
  //           result: [{
  //             path: "https://content.abt.com/media/images/products/sorry-no-image-available.png"
  //           }],
  //           status: false
  //         };

  //         //////////console.log($scope.imgsrc);
  //         $ionicSlideBoxDelegate.update();
  //         $timeout(function () {
  //           $ionicSlideBoxDelegate.slide(0);
  //         }, 200);
  //         $ionicLoading.hide();
  //       }
  //     );
  //   }

  //   vm.deletePic = function (e) {
  //     if (e.pic_desc) {
  //       let hideSheet = $ionicActionSheet.show({
  //         titleText: "<b>รายละเอียด </b>: " + e.pic_desc,
  //         buttons: [{
  //           text: '<i class="icon ion-trash-a"></i> ลบ'
  //         }],

  //         buttonClicked: function (index) {
  //           //console.log(index);
  //           if (index == 0) {
  //             let canceller = $q.defer();

  //             $ionicLoading.show();
  //             let url = $rootScope.ip + "area.php";
  //             let req = {
  //               timeout: canceller.promise,
  //               mode: "deletePic",
  //               img: e
  //             };

  //             $http.post(url, req, {
  //               timeout: canceller.promise
  //             }).then(
  //               function suscess(response) {
  //                 //console.log(response.data);
  //                 if (response.data == "AuthenticationSuccessful") {
  //                   ////////console.log(response, 1);
  //                   $mdDialog.show(
  //                     $mdDialog
  //                     .alert()
  //                     .parent(
  //                       angular.element(
  //                         document.querySelector("#popupContainer")
  //                       )
  //                     )
  //                     .clickOutsideToClose(true)
  //                     .title("แจ้งเตือน")
  //                     .textContent("ลบรูปภาพเรียบร้อยแล้ว")
  //                     .ariaLabel("Alert Dialog Demo")
  //                     .ok("OK")
  //                     .targetEvent()
  //                   );
  //                   vm.picRefresh();
  //                   $ionicLoading.hide();
  //                 } else if (response.data == "AuthenticationFailed") {
  //                   //////////console.log(response, 2);

  //                   // $mdDialog.show(
  //                   //   $mdDialog
  //                   //     .alert()
  //                   //     .parent(
  //                   //       angular.element(
  //                   //         document.querySelector("#popupContainer")
  //                   //       )
  //                   //     )
  //                   //     .clickOutsideToClose(true)
  //                   //     .title("แจ้งเตือน")
  //                   //     .textContent("ไม่สามารถลบรูปภาพได้ ลองใหม่อีกครั้ง")
  //                   //     .ariaLabel("Alert Dialog Demo")
  //                   //     .ok("Got it!")
  //                   //     .targetEvent()
  //                   // );
  //                   mobiscroll.alert({
  //                     title: "แจ้งเตือน",
  //                     message: "ไม่สามารถลบรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
  //                     callback: function () {
  //                       mobiscroll.toast({
  //                         message: "ยกเลิก"
  //                       });
  //                     }
  //                   });
  //                   $ionicLoading.hide();
  //                 }
  //                 // $scope.modalPic.hide();
  //               },
  //               function err(err) {
  //                 // $mdDialog.show(
  //                 //   $mdDialog
  //                 //     .alert()
  //                 //     .parent(
  //                 //       angular.element(
  //                 //         document.querySelector("#popupContainer")
  //                 //       )
  //                 //     )
  //                 //     .clickOutsideToClose(true)
  //                 //     .title("แจ้งเตือน")
  //                 //     .textContent("ไม่สามารถเพิ่มรูปภาพได้ ลองใหม่อีกครั้ง")
  //                 //     .ariaLabel("Alert Dialog Demo")
  //                 //     .ok("Got it!")
  //                 //     .targetEvent()
  //                 // );

  //                 mobiscroll.alert({
  //                   title: "แจ้งเตือน",
  //                   message: "ไม่สามารถลบรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
  //                   callback: function () {
  //                     mobiscroll.toast({
  //                       message: "ยกเลิก"
  //                     });
  //                   }
  //                 });
  //                 $ionicLoading.hide();
  //                 // $scope.modalPic.hide();
  //               }
  //             );

  //             $timeout(function () {
  //               canceller.resolve("user cancelled");
  //             }, 10000);
  //           }

  //           return true;
  //         }
  //       });

  //       // For example's sake, hide the sheet after two seconds
  //       $timeout(function () {
  //         hideSheet();
  //       }, 7000);
  //     }
  //   };

  //   vm.selectSubBefore = function (e, index) {
  //     $scope.modalListmap.hide();
  //     vm.selectSub(e, index);
  //   };
  //   vm.selectSub = function (e, index) {
  //     $scope.subDetail = e;
  //     loadPic($scope.subDetail);

  //     let map = new google.maps.Map(document.getElementById("mapbbb"), {
  //       zoom: 5,
  //       // center: bounds.getCenter(),
  //       center: new google.maps.LatLng(13.760412, 100.485357),
  //       streetViewControl: false,
  //       fullscreenControl: false,
  //       mapTypeId: "satellite",
  //       mapTypeControl: false,
  //       zoomControl: false
  //     });

  //     let triangleCoords = [];
  //     let all_overlays = [];

  //     let polygonCoords = [];
  //     let polygonCoordsFarm = [];

  //     let bounds = new google.maps.LatLngBounds();

  //     for (i = 0; i < all_overlays.length; i++) {
  //       all_overlays[i].setMap(null); //or line[i].setVisible(false);
  //     }

  //     triangleCoords = [];
  //     all_overlays = [];
  //     polygonCoords = [];
  //     bounds = new google.maps.LatLngBounds();
  //     $scope.abc = {
  //       lat: e.sub_lat.split(","),
  //       lng: e.sub_lng.split(",")
  //     };

  //     $timeout(function () {
  //       for (let i = 0; i < $scope.abc.lat.length; i++) {
  //         let k = {
  //           lat: parseFloat($scope.abc.lat[i]),
  //           lng: parseFloat($scope.abc.lng[i])
  //         };

  //         polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
  //         triangleCoords.push(k);
  //       }
  //       // //////////console.log(triangleCoords);

  //       for (i = 0; i < polygonCoords.length; i++) {
  //         bounds.extend(polygonCoords[i]);
  //       }

  //       var bermudaTriangle = new google.maps.Polygon({
  //         editable: false,
  //         paths: triangleCoords,
  //         strokeColor: "red",
  //         strokeOpacity: 0.8,
  //         strokeWeight: 2,
  //         fillColor: "red",
  //         fillOpacity: 0.35
  //       });

  //       all_overlays.push(bermudaTriangle);
  //       bermudaTriangle.setMap(map);

  //       map.fitBounds(bounds);
  //       map.panTo(bounds.getCenter());
  //     }, 100);

  //     let url = $rootScope.ip + "area.php";
  //     let req = {
  //       mode: "selectJobno",
  //       sub: e
  //     };
  //     $http.post(url, req).then(function (response) {
  //       $scope.jobID = response.data.result;
  //       //console.log(response.data)
  //       if (response.data.status == true) {
  //         $scope.model.job = response.data.result[0]
  //         vm.jobChange($scope.model.job)
  //       } else {

  //       }
  //     })
  //   };

  //   vm.jobChange = function () {
  //     //console.log($scope.model)
  //     let url = $rootScope.ip + "area.php";
  //     let req = {
  //       mode: "jobChange",
  //       sub: $scope.subDetail,
  //       job: $scope.model.job

  //     };
  //     $http.post(url, req).then(function (response) {
  //       //console.log(response.data)
  //       if (response.data.status == true) {
  //         $scope.subDetailLot = response.data
  //         //console.log($scope.subDetailLot)
  //       } else {

  //       }
  //     })
  //   }

  //   if ($scope.subfarm.length > 0) {
  //     $scope.selected = $scope.subfarm[0];
  //     vm.selectSub($scope.subfarm[0]);
  //   }

  //   vm.editmap = function () {
  //     $scope.modaledit.hide();
  //     $timeout(function () {
  //       $scope.modalmap.show();
  //     }, 500);
  //   };

  //   vm.save = function () {
  //     $scope.modalmap.hide();
  //     $timeout(function () {
  //       $scope.modaledit.show();
  //       if ($scope.PolygonPatch) {
  //         // //////////console.log($scope.PolygonPatch);
  //       }
  //     }, 1000);
  //   };

  //   $scope.areaFarm = {
  //     lat: $scope.crop.farm_lat.split(","),
  //     lng: $scope.crop.farm_lng.split(",")
  //   };

  //   vm.createSubmap = function () {
  //     let triangleCoords = [];
  //     for (let i = 0; i < $scope.areaFarm.lat.length; i++) {
  //       let k = {
  //         lat: parseFloat($scope.areaFarm.lat[i]),
  //         lng: parseFloat($scope.areaFarm.lng[i])
  //       };
  //       polygonCoordsFarm.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
  //       triangleCoords.push(k); // เอาไปวาดเส้น
  //     }

  //     for (let i = 0; i < polygonCoordsFarm.length; i++) {
  //       areaFarm.extend(polygonCoordsFarm[i]);
  //     }

  //     $scope.modalmap.show();

  //     function setMapOnAll(map) {
  //       for (var i = 0; i < markers.length; i++) {
  //         markers[i].setMap(map);
  //       }
  //     }

  //     function clearMarkers() {
  //       setMapOnAll(null);
  //     }

  //     var all_overlays = [];
  //     var selectedShape;
  //     $scope.PolygonPatch = [];
  //     let all_overlaysbase = [];

  //     $scope.data;

  //     function CenterControl(controlDiv, map) {
  //       // Set CSS for the control border.
  //       var controlUI = document.createElement("div");
  //       controlUI.style.backgroundColor = "#fff";
  //       controlUI.style.border = "2px solid #fff";
  //       controlUI.style.borderRadius = "10px";
  //       controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
  //       controlUI.style.cursor = "pointer";
  //       controlUI.style.marginBottom = "22px";
  //       controlUI.style.marginTop = "10px";
  //       controlUI.style.marginRight = "10px";
  //       controlUI.style.textAlign = "center";
  //       controlDiv.appendChild(controlUI);

  //       // Set CSS for the control interior.
  //       var controlText = document.createElement("div");
  //       controlText.style.color = "rgb(25,25,25)";
  //       controlText.style.fontFamily = "Roboto,Arial,sans-serif";
  //       controlText.style.fontSize = "16px";
  //       controlText.style.lineHeight = "38px";
  //       controlText.style.paddingLeft = "5px";
  //       controlText.style.paddingRight = "5px";

  //       controlText.innerHTML = "<i class='icon ion-trash-a'> ลบเส้น";
  //       controlUI.appendChild(controlText);

  //       // Setup the click event listeners: simply set the map to Chicago.
  //       controlUI.addEventListener("click", function () {
  //         deleteSelectedShape();
  //       });
  //     }

  //     function clearSelection() {
  //       if (selectedShape) {
  //         selectedShape.setEditable(false);
  //         selectedShape = null;
  //       }
  //     }

  //     function setSelection(shape) {
  //       infowindow.open(map);
  //       clearSelection();
  //       selectedShape = shape;
  //       shape.setEditable(true);
  //     }

  //     function deleteSelectedShape() {
  //       if (selectedShape) {
  //         infowindow.close();
  //         $scope.PolygonPatch = [];
  //         selectedShape.setMap(null);
  //         // To show:
  //         drawingManager.setOptions({
  //           drawingControl: false
  //         });

  //         $scope.$apply(function () {
  //           $scope.drawCheck = false;
  //         });
  //       }
  //     }

  //     function showoutput() {
  //       alert($scope.data);
  //     }

  //     vm.draw = function () {
  //       ////////console.log("123456789");
  //       $scope.drawCheck = true;
  //       drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
  //     };

  //     //Set map
  //     var map = new google.maps.Map(document.getElementById("maps"), {
  //       center: areaFarm.getCenter(),
  //       mapTypeControl: true,
  //       streetViewControl: false,
  //       fullscreenControl: false,
  //       mapTypeControlOptions: {
  //         style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
  //         mapTypeIds: ["satellite", "roadmap", "hybrid"]
  //       },
  //       mapTypeId: "satellite",
  //       zoom: 18
  //     });

  //     var infowindow = new google.maps.InfoWindow();
  //     var centerControlDiv = document.createElement("div");
  //     var centerControl = new CenterControl(centerControlDiv, map);
  //     centerControlDiv.index = 1;
  //     map.controls[google.maps.ControlPosition.TOP_RIGHT].push(
  //       centerControlDiv
  //     );

  //     var drawingManager = new google.maps.drawing.DrawingManager({
  //       drawingControl: false,
  //       drawingControlOptions: {
  //         position: google.maps.ControlPosition.RIGHT_CENTER,
  //         drawingModes: ["polygon"]
  //       },
  //       polygonOptions: {
  //         clickable: true,
  //         editable: true,
  //         draggable: false,
  //         fillColor: "green",
  //         strokeColor: "green",
  //         strokeWeight: 4,
  //         strokeOpacity: 0.9,
  //         fillOpacity: 0.3
  //       },
  //       drawingMode: null
  //     });
  //     infowindow.open(map);
  //     google.maps.event.addListener(drawingManager, "polygoncomplete", function (
  //       polygon
  //     ) {
  //       /// Disable Controller//
  //       drawingManager.setOptions({
  //         drawingControl: false
  //       });

  //       $scope.$apply(function () {
  //         $scope.drawCheck = true;
  //       });

  //       all_overlays.push(polygon);
  //       drawingManager.setDrawingMode(null);

  //       var newShape = polygon;
  //       newShape.type = polygon;

  //       //Edit point
  //       google.maps.event.addListener(newShape.getPath(), "set_at", function () {
  //         // ////////console.log(newShape.getPath())
  //         cal(newShape.getPath());
  //       });

  //       //Insert point
  //       google.maps.event.addListener(
  //         newShape.getPath(),
  //         "insert_at",
  //         function () {
  //           ////////console.log(newShape.getPath());
  //           cal(newShape.getPath());
  //         }
  //       );

  //       //click shape
  //       google.maps.event.addListener(newShape, "click", function (e) {
  //         ////////console.log(newShape.getPath());
  //         setSelection(newShape);
  //       });
  //       setSelection(newShape);

  //       // คำนวนและแสดง
  //       function cal(patch) {
  //         $scope.PolygonPatch = [];
  //         for (var i = 0; i < patch.length; i++) {
  //           $scope.PolygonPatch.push({
  //             lat: patch
  //               .getAt(i)
  //               .lat()
  //               .toFixed(5),
  //             lng: patch
  //               .getAt(i)
  //               .lng()
  //               .toFixed(5)
  //           });
  //         }

  //         // ตารางเมตร
  //         var areaM2 = google.maps.geometry.spherical.computeArea(patch);
  //         // เอเคอร์
  //         var acreFormula = 0.00024711,
  //           // ไร่
  //           farmFormula = 0.000625,
  //           //ตารางวา
  //           wahFormula = 0.25,
  //           //งาน
  //           workFormula = 0.0025;

  //         var rai, ngan, wah;
  //         var modRai, modNgan, modWah;

  //         rai = parseInt(areaM2 / 1600);
  //         modRai = areaM2 % 1600;

  //         ngan = parseInt(modRai / 400);
  //         modNgan = modRai % 400;

  //         wah = parseInt(modNgan / 4);

  //         var areaAC = (areaM2 * acreFormula).toFixed(3);
  //         var areaFarm = (areaM2 * farmFormula).toFixed(3);
  //         var areaWah = (areaM2 * wahFormula).toFixed(3);
  //         var areaWork = (areaM2 * workFormula).toFixed(3);

  //         vm.area = {
  //           m2: areaM2.toFixed(3),
  //           ac: areaAC,
  //           // farm: areaFarm,
  //           // work: areaWork,
  //           // wah: areaWah,
  //           farm: rai,
  //           work: ngan,
  //           wah: wah
  //         };
  //         ////////console.log(vm.area);

  //         // infowindow.setContent("Area/ตารางเมตร =" + vm.area.m2 + " sq meters<br>" +
  //         //   "Area/เอเคอร์ =" + vm.area.ac + " Acre<br>");
  //         infowindow.setContent(
  //           '<div id="contentmap">' +
  //           // '   <img src="img/maxresdefault.jpg" style="height:100px;">' +
  //           '<div id="bodyContent" >' +
  //           // "<br><b>Description</b><br><br> " +
  //           // "<p>พันธุ์ : - <br> " +
  //           // "<p>อายุ : - <br> " +
  //           // "<p>อื่นๆ : - <br> " +
  //           "<p> " +
  //           "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAACkwAAApMBv+Bu1wAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAM3SURBVFiF7ZRPaBxlGMZ/78SZrO5poZWSghcv9V8l9mKgl5I29dJAhaWpSLtWZ3YM5BB6KT0NqD1oacC97M4EOtBioxE8iNJWaKEqIvgHtAaR3izElhIKweruZOf1kEmZbnayI25P5r18M9/7fM/zfO/3fh9sxv895N8uKJfLVqlUeg14A3gymb4hIrOqetb3/eihGXBdd3scx58Cw13JRL5X1QO+7y/m5TTyAiuVSiGO488T8d+Ag8BWYKuqvgzcUNVdwGflctnKy/tIXqBlWW8CO4FfW63WSBiGd1PpTyqVylXLsr4Fhkulkgu8n4c3dwWAVwBE5EQiLrZtT1Sr1UOAhGF4V1VPpLH9NrADIIqiKwCO4xwWkQuqOmfb9qHE3JUE+9TDMNAEKBQKRQBVvd/AhmEIwMrKSjGN7beBHwHa7fY4QBAEH6jqYRGZaDQacwCmaY4DiMgPeUlzNyFwHtgLOEAAaBAEc6m8qKqdwuaK3BUoFosfAbdVdZdt2wc689VqdRx4Afij2Wx+3HcDMzMzfwGnAUTklOd599d6nmeo6jvJ7+kwDP/Oy5v5EjqOcxPYnrlw9ew/BLBte0JELmyg87vv+0/kNuA4znPATxsQAtyJouhpANM0F4AtG4FV9dkgCH7pnM9qwtFkPOf7/pF0wvM8Y3Fx8WtVfdE0zVPJddwCfDM0NLTb87y4YzPngFdFZBRYZyCrB8YS1190JjzPi0XEBlrA6yJyDGipqt0pDiAiaxxj3YTWGZienn4U2APowMDApW6L6vX6deBtVo9QROStbuUFaLfblwAF9kxNTQ32NLC8vDwCFICf6/X67W6kAIODg+8CC8CCZVnvZeFmZ2dvAdeBx6IoGulpwDCMfaxu63IWKUCtVmuKyNE4jo/UarVeT+9lAFVddwzdmvClZLzYg5RGo/FdL0wifFFEjqvqfuBkOvdABSYnJ7cBzwN/Li0tfZmHPE9EUfQVcA8Ydl338UwDURSNstpY1+bn51v9MpC8jNcAieN4b6YBEdmXfK67fv811q5jSgN4sAcE2J98n3Ec50w/Dajq2jiWaCmkKuC67jPAtn6KZsRQorUZmwHAPylaJT32wwBUAAAAAElFTkSuQmCC'" +
  //           "style='top: 3px;position: relative;height: 20px;width: 20px; '> " +
  //           vm.area.m2 +
  //           " ตารางเมตร<br> " +
  //           "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
  //           vm.area.farm +
  //           " &nbspไร่<br> " +
  //           "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
  //           vm.area.work +
  //           " งาน<br> " +
  //           "<p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   " +
  //           vm.area.wah +
  //           " ตารางวา<br> " +
  //           "</div>"
  //           // '<div style="margin-top:10px"><button type="button" class="button button-small button-assertive icon ion-trash-a" ></button>' +
  //           // '<button type="button" class="button button-small  button-positive icon ion-edit" style="margin-left:3px"></button>' +
  //           // "</div>"
  //         );

  //         infowindow.setPosition(polygon.getPath().getAt(0));
  //       }

  //       infowindow.open(map);
  //       cal(polygon.getPath());
  //     });

  //     let triangleCoordsSub = [];
  //     let all_overlaysSub = [];
  //     let polygonCoordsSub = [];
  //     let boundsSub = new google.maps.LatLngBounds();

  //     for (let e = 0; e < $scope.subfarm.length; e++) {
  //       triangleCoordsSub.push([]);
  //       let positionPolygon = {
  //         lat: $scope.subfarm[e].sub_lat.split(","),
  //         lng: $scope.subfarm[e].sub_lng.split(",")
  //       };

  //       for (let i = 0; i < positionPolygon.lat.length; i++) {
  //         let k = {
  //           lat: parseFloat(positionPolygon.lat[i]),
  //           lng: parseFloat(positionPolygon.lng[i])
  //         };

  //         polygonCoordsSub.push(new google.maps.LatLng(k.lat, k.lng)); // หา center
  //         triangleCoordsSub[e].push(k); // เอาไปวาดเส้น
  //       }

  //       // for (let i = 0; i < polygonCoordsSub.length; i++) {
  //       //   boundsSub.extend(polygonCoordsSub[i]);

  //       // }

  //       var bermudaTriangles = new google.maps.Polygon({
  //         editable: false,
  //         paths: triangleCoordsSub[e],
  //         strokeColor: "yellow",
  //         strokeOpacity: 0.9,
  //         strokeWeight: 4,
  //         fillColor: "green",
  //         fillOpacity: 0.3
  //       });

  //       all_overlaysSub.push(bermudaTriangles);
  //       all_overlaysSub[e].setMap(map);
  //     }

  //     /// พื้นที่ใหญ่ทั้งหมด
  //     var bermudaTriangle = new google.maps.Polygon({
  //       editable: false,
  //       paths: triangleCoords,
  //       strokeColor: "red",
  //       strokeOpacity: 0.8,
  //       strokeWeight: 4,
  //       fillColor: "none",
  //       fillOpacity: 0.0
  //     });
  //     bermudaTriangle.setMap(map);

  //     // google.maps.event.addDomListener(document.getElementById('bt1'), 'click', deleteSelectedShape);
  //     // google.maps.event.addDomListener(document.getElementById('bt2'), 'click', showoutput);

  //     drawingManager.setMap(map);
  //   };

  //   vm.search = function (e) {
  //     ////////console.log(e);
  //     $scope.modaldetail.hide();

  //     // Appending dialog to document.body to cover sidenav in docs app
  //     var confirm = $mdDialog
  //       .prompt()
  //       .title("เชื่อมต่ออุปกรณ์")
  //       .textContent(
  //         "ป้อนรหัสอุปกรณ์เพื่อเชื่อมต่อกับโรงเรือนที่ " + e.sup_sub_id
  //       )
  //       .placeholder("รหัสอุปกรณ์,IOT ID")
  //       .ariaLabel("รหัสอุปกรณ์,IOT ID")
  //       .initialValue()
  //       .targetEvent()
  //       .required(false)
  //       .ok("เชื่อมต่อ")
  //       .cancel("ยกเลิก");

  //     $mdDialog.show(confirm).then(
  //       function (result) {
  //         if (result) {
  //           let url = $rootScope.ip + "area.php";
  //           let req = {
  //             mode: "syncIOT",
  //             sub: e,
  //             iotid: result.toUpperCase(),
  //             global: $rootScope.global
  //           };
  //           $http.post(url, req).then(
  //             function suscess(response) {
  //               ////////console.log(response);
  //               if (response.data.status == "allow") {
  //                 $mdDialog.show(
  //                   $mdDialog
  //                   .alert()
  //                   .parent(
  //                     angular.element(
  //                       document.querySelector("#popupContainer")
  //                     )
  //                   )
  //                   .clickOutsideToClose(true)
  //                   .title("เชื่อมต่ออุปกรณ์เรียบร้อยแล้ว")
  //                   .textContent(
  //                     "เชื่อมต่ออุปกรณ์เรียบร้อยแล้ว เปิดรายการดูอีกครั้ง"
  //                   )
  //                   .ariaLabel("Alert Dialog Demo")
  //                   .ok("Got it!")
  //                   .targetEvent()
  //                 );

  //                 $ionicHistory.goBack();
  //               } else if (response.data.status == "notallow") {
  //                 $mdDialog.show(
  //                   $mdDialog
  //                   .alert()
  //                   .parent(
  //                     angular.element(
  //                       document.querySelector("#popupContainer")
  //                     )
  //                   )
  //                   .clickOutsideToClose(true)
  //                   .title("แจ้งเตือน ไม่สามารถเชื่อมต่อได้ !")
  //                   .textContent(
  //                     "ไม่สามารถเชื่อมต่ออุปกร์นี้ได้เนื่องจาก อุปกรณ์นี้เชื่อมต่อกับพื้นที่อื่นแล้ว *หากต้องการเชื่อมต่อ ให้ยกเลิกการเชื่อมต่ออุปกรณ์กับพื้นที่เดิมก่อน*"
  //                   )
  //                   .ariaLabel("Alert Dialog Demo")
  //                   .ok("Got it!")
  //                   .targetEvent()
  //                 );
  //               } else if (response.data.status == false) {
  //                 $mdDialog.show(
  //                   $mdDialog
  //                   .alert()
  //                   .parent(
  //                     angular.element(
  //                       document.querySelector("#popupContainer")
  //                     )
  //                   )
  //                   .clickOutsideToClose(true)
  //                   .title("แจ้งเตือน . . .")
  //                   .textContent(
  //                     "ไม่พบอุปกรณ์นี้ กรุณาตรวจสอบหมายเลขอุปกรณ์อีกครั้ง หรือติดต่อผู้ให้บริการ"
  //                   )
  //                   .ariaLabel("Alert Dialog Demo")
  //                   .ok("Got it!")
  //                   .targetEvent()
  //                 );
  //               }
  //             },
  //             function err(err) {}
  //           );
  //         }
  //       },
  //       function (e) {}
  //     );
  //   };

  //   vm.addPic = function (ev) {
  //     let platform = ionic.Platform.platform();
  //     // $scope.openModalPic();

  //     if (platform == "android" || platform == "ios") {
  //       $mdDialog
  //         .show({
  //           controller: DialogController,
  //           templateUrl: "templates/dialog1.html",
  //           parent: angular.element(document.body),
  //           targetEvent: ev,
  //           clickOutsideToClose: true,
  //           fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
  //         })
  //         .then(
  //           function (answer) {
  //             switch (answer) {
  //               case "camera":
  //                 camera();
  //                 break;
  //               case "image":
  //                 image();
  //                 break;
  //             }
  //             ////////console.log('You said the information was "' + answer + '".');
  //           },
  //           function () {}
  //         );
  //     } else {
  //       $scope.openModalPic();
  //       $scope.image =
  //         "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAhFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADu3R4CAAAAK3RSTlMAMgbMyOLaEfAIxRDQ6iqeBQHnpQ75/Qry/HuF+7H0WTldD8PgDM+i7vZT5lfrpwAAAIRJREFUKM+tkNkSgjAMRQtlqcquKLIqyqL5//+TTpHQPnUYzlvumUwyl5CNHBBznZ8A8bREy5CXzunIlYjn+HJOQYLlQoRyDHUJT57HTM6TWwMVF6aykD0KOC7iav9J+IgC7o7gDYrw5xcDDRFRSvuV+ExziCWiUNodDcFXs/bOQgayNz9lFx11aSeL8AAAAABJRU5ErkJggg==";
  //       $ionicScrollDelegate.resize();
  //     }
  //   };

  //   function DialogController($scope, $mdDialog) {
  //     $scope.hide = function () {
  //       $mdDialog.hide();
  //     };

  //     $scope.cancel = function () {
  //       $mdDialog.cancel();
  //     };

  //     $scope.answer = function (answer) {
  //       $mdDialog.hide(answer);
  //     };
  //   }

  //   function camera() {
  //     navigator.camera.getPicture(onSuccess, onFail, {
  //       quality: 40,
  //       sourceType: Camera.PictureSourceType.CAMERA,
  //       destinationType: Camera.DestinationType.DATA_URL
  //     });

  //     function onSuccess(imageData) {
  //       var image = document.getElementById("myImage");
  //       $scope.image = "data:image/jpeg;base64," + imageData;
  //       $scope.openModalPic();
  //     }

  //     function onFail(message) {
  //       alert("Failed because: " + message);
  //     }
  //   }

  //   function image() {
  //     navigator.camera.getPicture(onSuccess, onFail, {
  //       quality: 40,
  //       sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
  //       destinationType: Camera.DestinationType.DATA_URL,
  //       targetWidth: 1920,
  //       targetHeight: 1080
  //     });

  //     function onSuccess(imageData) {
  //       var image = document.getElementById("myImage");
  //       $scope.image = "data:image/jpeg;base64," + imageData;
  //       $scope.openModalPic();
  //     }

  //     function onFail(message) {
  //       alert("Failed because: " + message);
  //     }
  //   }

  //   vm.pushpick = function () {
  //     let canceller = $q.defer();

  //     $ionicLoading.show();
  //     let url = $rootScope.ip + "area.php";
  //     let req = {
  //       timeout: canceller.promise,
  //       mode: "pushimg",
  //       farm: $scope.subDetail,
  //       desc: vm.pic_desc,
  //       img: $scope.image
  //     };

  //     $http.post(url, req, {
  //       timeout: canceller.promise
  //     }).then(
  //       function suscess(response) {
  //         if (response.data == "AuthenticationSuccessful") {
  //           ////////console.log(response, 1);
  //           $mdDialog.show(
  //             $mdDialog
  //             .alert()
  //             .parent(
  //               angular.element(document.querySelector("#popupContainer"))
  //             )
  //             .clickOutsideToClose(true)
  //             .title("แจ้งเตือน")
  //             .textContent("เพิ่มรูปภาพเรียบร้อยแล้ว")
  //             .ariaLabel("Alert Dialog Demo")
  //             .ok("OK")
  //             .targetEvent()
  //           );
  //           vm.picRefresh();
  //           $scope.modalPic.hide();
  //           $ionicLoading.hide();
  //         } else if (response.data == "AuthenticationFailed") {

  //           mobiscroll.alert({
  //             title: "แจ้งเตือน",
  //             message: "ไม่สามารถเพิ่มรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
  //             callback: function () {
  //               mobiscroll.toast({
  //                 message: "ยกเลิก"
  //               });
  //             }
  //           });

  //           // $scope.modalPic.hide();
  //           $ionicLoading.hide();
  //         }
  //       },
  //       function err(err) {


  //         mobiscroll.alert({
  //           title: "แจ้งเตือน",
  //           message: "ไม่สามารถเพิ่มรูปภาพได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง",
  //           callback: function () {
  //             mobiscroll.toast({
  //               message: "ยกเลิก"
  //             });
  //           }
  //         });

  //         // $scope.modalPic.hide();
  //         $ionicLoading.hide();
  //       }
  //     );

  //     $timeout(function () {
  //       canceller.resolve("user cancelled");
  //     }, 10000);
  //   };

  //   vm.disconnect = function (e) {
  //     $scope.modaldetail.hide();
  //     var confirm = $mdDialog
  //       .confirm()
  //       .title("ต้องการยกเลิกการเชื่อมต่อหรือไม่ ?")
  //       .textContent(
  //         "เมื่อยกเลิกการเชื่อมต่อกับอุปกรณ์ " +
  //         e.iot_id +
  //         "  คุณจะไม่สามารถดูรายละเอียดของอุปกรณ์ และการตั้งค่าอุปกรณ์ได้"
  //       )
  //       .ariaLabel("Lucky day")
  //       .targetEvent()
  //       .ok("ยืนยัน. ยกเลิกการเชื่อมต่อ")
  //       .cancel("ยกเลิก");

  //     $mdDialog.show(confirm).then(
  //       function () {
  //         let url = $rootScope.ip + "area.php";
  //         let req = {
  //           mode: "dissyncIOT",
  //           sub: e,
  //           global: $rootScope.global
  //         };
  //         $http.post(url, req).then(
  //           function suscess(response) {
  //             $ionicHistory.goBack();
  //             $mdDialog.show(
  //               $mdDialog
  //               .alert()
  //               .parent(
  //                 angular.element(document.querySelector("#popupContainer"))
  //               )
  //               .clickOutsideToClose(true)
  //               .title("ยกเลิกการเชื่อมต่ออุปกรณ์เรียบร้อยแล้ว")
  //               .textContent(
  //                 "ยกเลิกการเชื่อมต่ออุปกรณ์เรียบร้อยแล้ว เปิดรายการดูอีกครั้ง"
  //               )
  //               .ariaLabel("Alert Dialog Demo")
  //               .ok("Got it!")
  //               .targetEvent()
  //             );

  //             if (response.data.status == true) {} else {}
  //           },
  //           function err(err) {}
  //         );
  //       },
  //       function () {
  //         //////////console.log("2");
  //       }
  //     );

  //     //////////console.log(e);
  //   };

  //   $scope.allImages = [{
  //       src: "img/aa.png"
  //     },
  //     {
  //       src: "img/bg.jpg"
  //     }
  //   ];

  //   $scope.zoomMin = 1;
  //   $scope.showImages = function (index) {
  //     $scope.activeSlide = index;
  //     $scope.showModal("templates/farmer/gallery-zoomview.html");
  //   };

  //   $scope.showModal = function (templateUrl) {
  //     $ionicModal
  //       .fromTemplateUrl(templateUrl, {
  //         scope: $scope
  //       })
  //       .then(function (modal) {
  //         $scope.modal = modal;
  //         $scope.modal.show();
  //       });
  //   };

  //   $scope.closeModal = function () {
  //     $scope.modal.hide();
  //     $scope.modal.remove();
  //   };

  //   $scope.updateSlideStatus = function (slide) {
  //     var zoomFactor = $ionicScrollDelegate
  //       .$getByHandle("scrollHandle" + slide)
  //       .getScrollPosition().zoom;
  //     if (zoomFactor == $scope.zoomMin) {
  //       $ionicSlideBoxDelegate.enableSlide(true);
  //     } else {
  //       $ionicSlideBoxDelegate.enableSlide(false);
  //     }
  //   };
  // })

  .controller("detail2-2Ctrl", function (
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
    $q
  ) {
    let vm = this;

    vm.record = function () {
      $state.go('app.recordPlant2')
    }


    // vm.back = function () {
    //  $state.go('app.recordPlant2')
    // };

    vm.go = function (e) {
      let routing = JSON.stringify(e)
      //console.log(e)
      $state.go('app.detailAction', {
        crop: $stateParams.crop,
        // sub:$stateParams.sub,
        job: $stateParams.job,
        detail: $stateParams.detail,
        routing: routing
      })
    }

    $scope.black = function () {
      $ionicHistory.goBack();
    };

    //console.log($stateParams)

    $scope.crop = JSON.parse($stateParams.crop);
    // $scope.subfarm = JSON.parse($stateParams.sub);
    if ($stateParams.job) {
      $scope.job = JSON.parse($stateParams.job);
    } else {
      $scope.job = [];
    }

    //console.log(JSON.parse($stateParams.crop))
    // //console.log(JSON.parse($stateParams.sub))
    //console.log(JSON.parse($stateParams.detail))
    //console.log(JSON.parse($stateParams.job))


    function onStart() {
      let cancellerLoadpic = $q.defer();
      let url = $rootScope.ip + "area.php";
      let req = {
        mode: "selectRoute",
        config: $scope.detail,
        global: $rootScope.global,
        job: $scope.job

      };

      $timeout(function () {
        cancellerLoadpic.resolve("user cancelled");
      }, 8000);

      $http.post(url, req, {
        timeout: cancellerLoadpic.promise
      }).then(
        function suscess(response) {
          $scope.status = true;

          //console.log(response);
          if (response.data.status == true) {
            $scope.data = response.data;
            // $scope.data.result = [{id:1},{id:2},{id:3},{id:4},{id:5}]
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

    if ($stateParams.detail) {
      $scope.detail = JSON.parse($stateParams.detail);
      //console.log($scope.detail);
      onStart()
    }

    vm.refresh = function () {
      delete $scope.data;
      delete $scope.status;
      onStart();
    };

    // var map = new google.maps.Map(document.getElementById("mapaaaa"), {
    //   zoom: 5,
    //   // center: bounds.getCenter(),
    //   center: new google.maps.LatLng(13.760412, 100.485357),
    //   streetViewControl: false,
    //   fullscreenControl: false,
    //   mapTypeId: "satellite",
    //   mapTypeControl: false,
    //   zoomControl: false
    // });

    // var triangleCoords = [];
    // var all_overlays = [];

    // var polygonCoords = [];
    // var polygonCoordsFarm = [];

    // var bounds = new google.maps.LatLngBounds();

    // vm.selectSub = function(e, index) {
    //   $scope.subDetail = e;
    //   for (i = 0; i < all_overlays.length; i++) {
    //     all_overlays[i].setMap(null); //or line[i].setVisible(false);
    //   }

    //   triangleCoords = [];
    //   all_overlays = [];
    //   polygonCoords = [];
    //   bounds = new google.maps.LatLngBounds();
    //   $scope.abc = {
    //     lat: e.sub_lat.split(","),
    //     lng: e.sub_lng.split(",")
    //   };

    //   // //////////console.log($scope.abc);

    //   $timeout(function() {
    //     // //////////console.log("666666");

    //     for (let i = 0; i < $scope.abc.lat.length; i++) {
    //       let k = {
    //         lat: parseFloat($scope.abc.lat[i]),
    //         lng: parseFloat($scope.abc.lng[i])
    //       };

    //       polygonCoords.push(new google.maps.LatLng(k.lat, k.lng));
    //       triangleCoords.push(k);
    //     }
    //     // //////////console.log(triangleCoords);

    //     for (i = 0; i < polygonCoords.length; i++) {
    //       bounds.extend(polygonCoords[i]);
    //     }

    //     var bermudaTriangle = new google.maps.Polygon({
    //       editable: false,
    //       paths: triangleCoords,
    //       strokeColor: "red",
    //       strokeOpacity: 0.8,
    //       strokeWeight: 2,
    //       fillColor: "red",
    //       fillOpacity: 0.35
    //     });

    //     all_overlays.push(bermudaTriangle);
    //     bermudaTriangle.setMap(map);

    //     map.fitBounds(bounds);
    //     map.panTo(bounds.getCenter());
    //   }, 100);
    // };
    // if ($stateParams.detail) {
    //   vm.selectSub($scope.detail);
    // }
  })

  .controller("detailActionCtrl", function (
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
    $q
  ) {
    let vm = this;



    $scope.black = function () {
      $ionicHistory.goBack();
    };

    $scope.crop = JSON.parse($stateParams.crop);

    // $scope.subfarm = JSON.parse($stateParams.sub);
    if ($stateParams.job) {
      $scope.job = JSON.parse($stateParams.job);
    } else {
      $scope.job = [];
    }

    //console.log($stateParams)

    $scope.routing = JSON.parse($stateParams.routing);



    //console.log(JSON.parse($stateParams.crop))
    // //console.log(JSON.parse($stateParams.sub))
    //console.log(JSON.parse($stateParams.detail))
    //console.log(JSON.parse($stateParams.job))
    //console.log(JSON.parse($stateParams.routing))




  });
