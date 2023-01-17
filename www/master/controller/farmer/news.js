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
          "เกษตรกรบ้านเชิงปราง ปลูกแตงโมในสวนปาล์มปลูกใหม่ เก็บขายได้เกือบ 2 ล้าน",
        date: "November 05, 2019",
        desc:
          "ไอเดียดี เกษตรกรบ้านเชิงปราง อ.ตะกั่วป่า จ.พังงา รวมกลุ่มกันปลูกแตงโมบนพื้นที่ 62 ไร่ ในสวนปาล์มน้ำมันปลูกใหม่ร้างรายได้ระหว่างรอปาล์มโตร่วมเกือบ 2 ล้านบาทต่อครั้ง...เมื่อวันที่ 23 ม.ค.2562 ผู้สื่อข่าวรายงานว่า ช่วงฤดูผลไม้ในพื้นที่จังหวัดพังงาซึ่งเป็นไม้ยืนต้นได้หมดลงทำให้ทางเกษตรกรหันมาหารายได้เสริม โดยเฉพาะการปลูกข้าวโพด แตงโม แตงไทย ซึ่งในช่วงหน้าแล้งยางพาราผลัดใบไม่สามารถกรีดได้ ปาล์มน้ำมันทะลายเล็กราคาตกต่ำ การปลูกพืชเสริมจึงเป็นทางเลือกให้กับเกษตรกรชาวบ้านในพื้นที่บ้านเชิงปราง ต.ตำตัว อ.ตะกั่วป่า จ.พังงาทางเกษตรกรจึงได้รวมกลุ่มกันร่วมกันปรึกษาและได้ข้อสรุปว่า ช่วงแล้งนี้จะปลูกแตงโมจำหน่ายสู่ท้องตลาดจึงเริ่มต้นปลูกตั้งแต่เดือน ตุลาคม 61 ที่ผ่านมา โดยมี น.ส.ธันย์บดี หนูเงิน หัวหน้ากองทุนฟื้นฟูและพัฒนาเกษตรกรสาขาพังงา ให้คำปรึกษาด้านต้นทุน พร้อมเข้าเยี่ยม ตลอดโครงการที่ผ่านมาล่าสุดทางกลุ่มร่วมใจการเกษตรบ้านเชิงปราง ได้เก็บเกี่ยวผลผลิตแตงโมของกลุ่มร่วมใจการเกษตรบ้านเชิงปราง ต.ตำตัว อ.ตะกั่วป่า จ.พังงา ที่สมัครขึ้นทะเบียนเป็นสมาชิกกองทุนฟื้นฟูและพัฒนาเกษตรกร สาขาพังงาและได้รับการสนับสนุนเมล็ดพันธุ์ข้าวโพดและเมล็ดพันธุ์แตงโมในส่วนหนึ่ง ใช้ในการสลับปลูกเป็นฤดูกาลโดยในรอบนี้เป็นการปลูกแตงโม ซึ่งทางกลุ่มมีสมาชิก 61 คน เข้าร่วมโครงการงบอุดหนุน 30 คนโดยมีพื้นที่เช่าที่ดินปลูกในแปลงปาล์มน้ำมันปลูกใหม่อายุ 3 ปี ขณะที่ต้นปาล์มยังเล็ก ผลปรากฏว่าได้ผลผลิต",
        img: [
          "https://www.thairath.co.th/media/dFQROr7oWzulq5FZXl62iY10m4CbX2m1xp2gsXK2zO6qguplZB87Fbc0s5p3m4pSV0Y.jpg",
          "https://www.thairath.co.th/media/Dtbezn3nNUxytg04OS6DAt85rrPuZtN1hvK7cA8joB9EkC.jpg",
          "https://www.thairath.co.th/media/Dtbezn3nNUxytg04OS6DAt85rrPuZtN1z0zmzSYMjQ0UYe.jpg",
        ],
      },
      list: [
        {
          title: "กากมะพร้าวเหลือทิ้ง มิไร้ค่า แปรรูปได้สารพัด",
          date: "November 01, 2019",
          desc:
            "นายประมวล ทรายทอง นักวิจัยในโครงการวิจัยน้ำหางกะทิและกากมะพร้าวที่เหลือทิ้งสถาบันค้นคว้าและพัฒนาผลิตภัณฑ์อาหารมหาวิทยาลัยเกษตรศาสตร์ เผยว่าแต่เมื่อนำของเหลวที่มีส่วนผสมของน้ำหางกะทิเข้าห้องแล็บตรวจวิเคราะห์พบว่า ยังมีไขมัน โปรตีนและสารอาหารต่างๆในปริมาณมาก และมีคุณค่าทางโภชนาการ ที่สามารถนำมาใช้ในการพัฒนาเป็นผลิตภัณฑ์ต่างๆได้จึงนำไปแปรรูปผลิตภัณฑ์เพื่อสุขภาพ โดยได้รับทุนวิจัยจากเครือข่ายองค์กรบริหารงานวิจัยแห่งชาติ (คอบช.)สำนักงานการวิจัยแห่งชาติ (วช.) และสำนักงานพัฒนาการวิจัยการเกษตร (องค์การมหาชน) หรือ สวก. มาตั้งแต่ปี 2559",
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYSRn0r1pooaxELN3SEyyqJxvJ3xV0a6axy284T9A2jFxlTquS6N.jpg",
          ],
        },
        {
          title: "พริกใหญ่พันธุ์ใหม่ เผ็ดน้อยโรงงานซอสชอบ",
          date: "November 02, 2019",
          desc:
            'แต่ละปีซอสพริกมีมูลค่าส่งออกมากกว่า 2 พันล้านบาทและมีแนวโน้มการส่งออกเพิ่มขึ้นทุกปี และพันธุ์พริกที่โรงงานผลิตซอสมีความ ต้องการมากที่สุด คือ พริกใหญ่ที่มีรสชาติเผ็ดน้อย แต่การพัฒนาพันธุ์พริกใหญ่ให้มีปริมาณคุณภาพตรงตามความต้องการของตลาดมีไม่มากตั้งแต่ปี 2540 เป็นต้นมา กรมวิชาการเกษตร ได้ทำการวิจัยปรับปรุงพันธุ์พริกใหญ่เพื่อให้ได้พันธุ์ที่มีคุณสมบัติตรงตามที่โรงงานผลิตซอสพริกต้องการ คือ ผลสุกมีสีแดงเข้ม เนื้อหนา ผลมีขนาดใหญ่ ยาว และรสชาติเผ็ดน้อย ล่าสุด ศูนย์วิจัยและพัฒนาการเกษตรพิจิตร ประสบความสำเร็จในการปรับปรุงพันธุ์พริกใหญ่และผ่านการพิจารณาเป็นพันธุ์แนะนำของกรมฯ ในปี 2562 โดยใช้ชื่อว่า “พริกใหญ่พันธุ์พิจิตร 2ประกันสังคม ประกาศเพิ่มสิทธิ์รักษา กลุ่มเสี่ยง-ป่วยติดเชื้อ "โควิด-19"หน้ามองฟ้า เท้าหยั่งดิน : พริก...กําไรมากสุดกปภ. แนะ 4 ขั้นตอนง่ายๆ ลงทะเบียน "คืนเงินประกันประปา" เริ่ม 15 เม.ย.63',
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYjm2p6DBXVWa7Vwkkma9wzTFdJzNzOn6injqtIo9I8zvdKVpSzV.jpg",
            "https://th-live-01.slatic.net/p/a3eb9c8d541aed7f69a95a683699074d.jpg",
          ],
        },

        {
          title:
            "ตรวจสอบเงิน “ค่าเกี่ยวข้าว” 10,000 บาท จ่ายแล้วพันล้าน คนยังไม่ได้ ต้องทำอย่างไร",
          date: "November 03, 2019",
          desc:
            'งินค่าเกี่ยวข้าว” ที่เกษตรกรทั้งประเทศเฝ้ารอ เริ่มจ่ายแล้ว บางคนได้รับเรียบร้อย บางคนยังรออย่างไร้จุดหมาย ทีมข่าวเจาะประเด็นไทยรัฐออนไลน์ ไล่เรียงช่องทางในการตรวจสอบสถานะการจ่ายเงิน และข้อมูลสำคัญเอาไว้ให้คุณ ดังต่อไปนี้เกษตรกรจะได้เงินค่าเก็บเกี่ยวและปรับปรุงคุณภาพข้าว เท่าไร?เปิดวิธีลงทะเบียน กู้เงินฉุกเฉินออมสิน เพียง 5 ขั้นตอนง่ายๆ แล้วรอรับเงินใครบ้าง เข้าเกณฑ์ได้รับเงิน "เราไม่ทิ้งกัน" จาก 15,000 เป็น 30,000 บาทเราไม่ทิ้งกัน เริ่มโอนเงินเข้าบัญชีแล้วตั้งแต่ตี 1 ผู้ผ่านเกณฑ์รอรับ SMS ได้เลย ธ.ก.ส. ดำเนินการจ่ายเงินช่วยเหลือตามโครงการช่วยเหลือค่าเก็บเกี่ยวและปรับปรุงคุณภาพข้าว ปีการผลิต 2562/63 แก่เกษตรกรที่ลงทะเบียน ผู้ปลูกข้าวกับกรมส่งเสริมการเกษตร ในอัตราไร่ละ 500 บาท ไม่เกินรายละ 20 ไร่ หรือครัวเรือนละไม่เกิน 10,000 บาทเป้าหมายเกษตรกรที่จะได้รับประโยชน์ประมาณ 4.57 ล้านครัวเรือน วงเงินงบประมาณ 25,793 ล้านบาท',
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
          "เกษตรกรบ้านเชิงปราง ปลูกแตงโมในสวนปาล์มปลูกใหม่ เก็บขายได้เกือบ 2 ล้าน",
        date: "November 05, 2019",
        desc:
          "ไอเดียดี เกษตรกรบ้านเชิงปราง อ.ตะกั่วป่า จ.พังงา รวมกลุ่มกันปลูกแตงโมบนพื้นที่ 62 ไร่ ในสวนปาล์มน้ำมันปลูกใหม่ร้างรายได้ระหว่างรอปาล์มโตร่วมเกือบ 2 ล้านบาทต่อครั้ง...เมื่อวันที่ 23 ม.ค.2562 ผู้สื่อข่าวรายงานว่า ช่วงฤดูผลไม้ในพื้นที่จังหวัดพังงาซึ่งเป็นไม้ยืนต้นได้หมดลงทำให้ทางเกษตรกรหันมาหารายได้เสริม โดยเฉพาะการปลูกข้าวโพด แตงโม แตงไทย ซึ่งในช่วงหน้าแล้งยางพาราผลัดใบไม่สามารถกรีดได้ ปาล์มน้ำมันทะลายเล็กราคาตกต่ำ การปลูกพืชเสริมจึงเป็นทางเลือกให้กับเกษตรกรชาวบ้านในพื้นที่บ้านเชิงปราง ต.ตำตัว อ.ตะกั่วป่า จ.พังงาทางเกษตรกรจึงได้รวมกลุ่มกันร่วมกันปรึกษาและได้ข้อสรุปว่า ช่วงแล้งนี้จะปลูกแตงโมจำหน่ายสู่ท้องตลาดจึงเริ่มต้นปลูกตั้งแต่เดือน ตุลาคม 61 ที่ผ่านมา โดยมี น.ส.ธันย์บดี หนูเงิน หัวหน้ากองทุนฟื้นฟูและพัฒนาเกษตรกรสาขาพังงา ให้คำปรึกษาด้านต้นทุน พร้อมเข้าเยี่ยม ตลอดโครงการที่ผ่านมาล่าสุดทางกลุ่มร่วมใจการเกษตรบ้านเชิงปราง ได้เก็บเกี่ยวผลผลิตแตงโมของกลุ่มร่วมใจการเกษตรบ้านเชิงปราง ต.ตำตัว อ.ตะกั่วป่า จ.พังงา ที่สมัครขึ้นทะเบียนเป็นสมาชิกกองทุนฟื้นฟูและพัฒนาเกษตรกร สาขาพังงาและได้รับการสนับสนุนเมล็ดพันธุ์ข้าวโพดและเมล็ดพันธุ์แตงโมในส่วนหนึ่ง ใช้ในการสลับปลูกเป็นฤดูกาลโดยในรอบนี้เป็นการปลูกแตงโม ซึ่งทางกลุ่มมีสมาชิก 61 คน เข้าร่วมโครงการงบอุดหนุน 30 คนโดยมีพื้นที่เช่าที่ดินปลูกในแปลงปาล์มน้ำมันปลูกใหม่อายุ 3 ปี ขณะที่ต้นปาล์มยังเล็ก ผลปรากฏว่าได้ผลผลิต",
        img: [
          "https://www.thairath.co.th/media/dFQROr7oWzulq5FZXl62iY10m4CbX2m1xp2gsXK2zO6qguplZB87Fbc0s5p3m4pSV0Y.jpg",
          "https://www.thairath.co.th/media/Dtbezn3nNUxytg04OS6DAt85rrPuZtN1hvK7cA8joB9EkC.jpg",
          "https://www.thairath.co.th/media/Dtbezn3nNUxytg04OS6DAt85rrPuZtN1z0zmzSYMjQ0UYe.jpg",
        ],
      },
      list: [
        {
          title: "กากมะพร้าวเหลือทิ้ง มิไร้ค่า แปรรูปได้สารพัด",
          date: "November 01, 2019",
          desc:
            "นายประมวล ทรายทอง นักวิจัยในโครงการวิจัยน้ำหางกะทิและกากมะพร้าวที่เหลือทิ้งสถาบันค้นคว้าและพัฒนาผลิตภัณฑ์อาหารมหาวิทยาลัยเกษตรศาสตร์ เผยว่าแต่เมื่อนำของเหลวที่มีส่วนผสมของน้ำหางกะทิเข้าห้องแล็บตรวจวิเคราะห์พบว่า ยังมีไขมัน โปรตีนและสารอาหารต่างๆในปริมาณมาก และมีคุณค่าทางโภชนาการ ที่สามารถนำมาใช้ในการพัฒนาเป็นผลิตภัณฑ์ต่างๆได้จึงนำไปแปรรูปผลิตภัณฑ์เพื่อสุขภาพ โดยได้รับทุนวิจัยจากเครือข่ายองค์กรบริหารงานวิจัยแห่งชาติ (คอบช.)สำนักงานการวิจัยแห่งชาติ (วช.) และสำนักงานพัฒนาการวิจัยการเกษตร (องค์การมหาชน) หรือ สวก. มาตั้งแต่ปี 2559",
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYSRn0r1pooaxELN3SEyyqJxvJ3xV0a6axy284T9A2jFxlTquS6N.jpg",
          ],
        },
        {
          title: "พริกใหญ่พันธุ์ใหม่ เผ็ดน้อยโรงงานซอสชอบ",
          date: "November 02, 2019",
          desc:
            'แต่ละปีซอสพริกมีมูลค่าส่งออกมากกว่า 2 พันล้านบาทและมีแนวโน้มการส่งออกเพิ่มขึ้นทุกปี และพันธุ์พริกที่โรงงานผลิตซอสมีความ ต้องการมากที่สุด คือ พริกใหญ่ที่มีรสชาติเผ็ดน้อย แต่การพัฒนาพันธุ์พริกใหญ่ให้มีปริมาณคุณภาพตรงตามความต้องการของตลาดมีไม่มากตั้งแต่ปี 2540 เป็นต้นมา กรมวิชาการเกษตร ได้ทำการวิจัยปรับปรุงพันธุ์พริกใหญ่เพื่อให้ได้พันธุ์ที่มีคุณสมบัติตรงตามที่โรงงานผลิตซอสพริกต้องการ คือ ผลสุกมีสีแดงเข้ม เนื้อหนา ผลมีขนาดใหญ่ ยาว และรสชาติเผ็ดน้อย ล่าสุด ศูนย์วิจัยและพัฒนาการเกษตรพิจิตร ประสบความสำเร็จในการปรับปรุงพันธุ์พริกใหญ่และผ่านการพิจารณาเป็นพันธุ์แนะนำของกรมฯ ในปี 2562 โดยใช้ชื่อว่า “พริกใหญ่พันธุ์พิจิตร 2ประกันสังคม ประกาศเพิ่มสิทธิ์รักษา กลุ่มเสี่ยง-ป่วยติดเชื้อ "โควิด-19"หน้ามองฟ้า เท้าหยั่งดิน : พริก...กําไรมากสุดกปภ. แนะ 4 ขั้นตอนง่ายๆ ลงทะเบียน "คืนเงินประกันประปา" เริ่ม 15 เม.ย.63',
          img: [
            "https://www.thairath.co.th/media/dFQROr7oWzulq5FZYjm2p6DBXVWa7Vwkkma9wzTFdJzNzOn6injqtIo9I8zvdKVpSzV.jpg",
            "https://th-live-01.slatic.net/p/a3eb9c8d541aed7f69a95a683699074d.jpg",
          ],
        },

        {
          title:
            "ตรวจสอบเงิน “ค่าเกี่ยวข้าว” 10,000 บาท จ่ายแล้วพันล้าน คนยังไม่ได้ ต้องทำอย่างไร",
          date: "November 03, 2019",
          desc:
            'งินค่าเกี่ยวข้าว” ที่เกษตรกรทั้งประเทศเฝ้ารอ เริ่มจ่ายแล้ว บางคนได้รับเรียบร้อย บางคนยังรออย่างไร้จุดหมาย ทีมข่าวเจาะประเด็นไทยรัฐออนไลน์ ไล่เรียงช่องทางในการตรวจสอบสถานะการจ่ายเงิน และข้อมูลสำคัญเอาไว้ให้คุณ ดังต่อไปนี้เกษตรกรจะได้เงินค่าเก็บเกี่ยวและปรับปรุงคุณภาพข้าว เท่าไร?เปิดวิธีลงทะเบียน กู้เงินฉุกเฉินออมสิน เพียง 5 ขั้นตอนง่ายๆ แล้วรอรับเงินใครบ้าง เข้าเกณฑ์ได้รับเงิน "เราไม่ทิ้งกัน" จาก 15,000 เป็น 30,000 บาทเราไม่ทิ้งกัน เริ่มโอนเงินเข้าบัญชีแล้วตั้งแต่ตี 1 ผู้ผ่านเกณฑ์รอรับ SMS ได้เลย ธ.ก.ส. ดำเนินการจ่ายเงินช่วยเหลือตามโครงการช่วยเหลือค่าเก็บเกี่ยวและปรับปรุงคุณภาพข้าว ปีการผลิต 2562/63 แก่เกษตรกรที่ลงทะเบียน ผู้ปลูกข้าวกับกรมส่งเสริมการเกษตร ในอัตราไร่ละ 500 บาท ไม่เกินรายละ 20 ไร่ หรือครัวเรือนละไม่เกิน 10,000 บาทเป้าหมายเกษตรกรที่จะได้รับประโยชน์ประมาณ 4.57 ล้านครัวเรือน วงเงินงบประมาณ 25,793 ล้านบาท',
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
