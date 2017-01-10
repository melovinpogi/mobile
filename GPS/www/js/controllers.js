var format = ("0" + datenow.getDate()).slice(-2) + "-" + ("0"+(datenow.getMonth()+1)).slice(-2) + "-" +datenow.getFullYear() + " " + ("0" + datenow.getHours()).slice(-2) + ":" + ("0" + datenow.getMinutes()).slice(-2);
var dis = '';
var origpayment = 0;

angular.module('app.controllers', [])
  
.controller('titleCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {
	$scope.x = function(){
		$window.location.reload();	
	}
	

}])
   
.controller('homeCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('seatCtrl', ['$scope', '$stateParams', "$ionicPlatform","$ionicLoading","$ionicPopup","$cordovaSQLite","$http", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$ionicPlatform,$ionicLoading,$ionicPopup,$cordovaSQLite,$http) {
	$scope.images = [];

	$scope.showPopup = function(seat) {
	  $ionicPopup.show({
	    template: '<input type="text" id="card">',
	    title: 'Tap Card',
	    subTitle: 'Please tap passenger card',
	    scope: $scope,
	    buttons: [
	      {
	        text: '<b>Submit</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	        $ionicLoading.show();
	          passenger = $("#card").val();
	          $scope.exists(seat,passenger);
	          $ionicLoading.hide();
	        }
	      },
	       { text: 'Cancel' }
	    ]
	  });
    }


    $scope.occupied = function(seat){
    	var query = "SELECT status FROM seat WHERE seat_number = ? ORDER BY id DESC LIMIT 1";
		$cordovaSQLite.execute(db,query,[seat]).then(function(res) {
          if(res.rows.length >0){
          	if(res.rows.item(0).status == '1'){
          		return false;
          	}else{
          		$scope.showPopup(seat);
          	}
          }else{
          	$scope.showPopup(seat);
          }
        }, function (err) {
          $scope.showAlert('Error',err);
          console.error(err);
        });
    }


    $scope.exists = function(seat,pass){
    	var query = "SELECT * FROM bus_transaction WHERE passenger_id = ? ORDER BY id DESC LIMIT 1";
		$cordovaSQLite.execute(db,query,[pass]).then(function(res) {
          if(res.rows.length >0){
          		if(res.rows.item(0).trans == 'IN'){
          			$scope.selectseat(seat,pass);
          		}else{
          			$scope.showAlert('Error','Passenger ' + pass + ' already out of the bus.');
          		}
          	}else{
          		$scope.showAlert('Error','Passenger ' + pass + ' not exists in this bus.');
          	}
        }, function (err) {
          $scope.showAlert('Error',err);
          console.error(err);
        });
    }


	$scope.insert = function(conductor, passenger_id, seat_number ,bus_no,status,transaction_date) {
		var query = "INSERT INTO seat (conductor, passenger_id, seat_number ,bus_no , status ,transaction_date  ) VALUES (?,?,?,?,?,?)";
		$cordovaSQLite.execute(db,query,[conductor, passenger_id, seat_number ,bus_no,status,transaction_date]).then(function(result) {
			console.log('Message','Passenger ' + passenger_id + ' can now relax @ Seat #' + seat_number );
			//$scope.showAlert("Message",'Message','Passenger ' + passenger_id + ' can now relax @ Seat #' + seat_number )
		}, function(error) {
			$scope.showAlert('Error Seat',error);
	        console.error(error);
		});
	};


	$scope.selectseat = function(seat,pass) {
	var query = "SELECT status FROM seat WHERE seat_number = ? and passenger_id = ?  ORDER BY id DESC LIMIT 1";
	$cordovaSQLite.execute(db,query,[seat,pass]).then(function(res) {
          if(res.rows.length >0){
          	if(res.rows.item(0).status == '1'){
          		//Not available. then ask if passenger is going out
          		$scope.insert(konduktor,pass,seat,bus,'0',format);
          		console.log('out')
          		$scope.loadImages();
          	}else{
          		$scope.insert(konduktor,pass,seat,bus,'1',format);
          		$scope.showAlert('Message','Passenger ' + pass + ' can now relax @ Seat #' + seat );
          		$scope.loadImages();
          	}
          }else{
          	$scope.insert(konduktor,pass,seat,bus,'1',format);
          	$scope.showAlert('Message','Passenger ' + pass + ' can now relax @ Seat #' + seat );
          	$scope.loadImages();
          }
        }, function (err) {
          $scope.showAlert('Error',err);
          console.error(err);
        });

		$ionicLoading.hide();
	};

    $scope.loadImages = function() {
    	for(var i = 0; i < 40; i++) {
        	$scope.removeItem(i);
        }

        for(var i = 1; i <= 40; i++) {
        	var query = "SELECT status FROM seat WHERE seat_number = ? ORDER BY id DESC LIMIT 1";
			$cordovaSQLite.execute(db,query,[i]).then(function(res) {
			  console.log(res.rows.length)
	          if(res.rows.length >0 && res.rows.item(0).status == '1'){
	          	$scope.images.push({id: i, src: "img/chair.png",alt: "occupied",disable: "true"});
	          }else{
	          	$scope.images.push({id: i, src: "img/chair.png",alt: "" ,disable: "false"});
	          }
	        }, function (err) {
	          $scope.showAlert('Error',err);
	          console.error(err);
	        });
        }
    }

     $scope.removeItem = function (index) {
	   $scope.images.splice(index);
	 };

    $scope.doRefresh = function() {
	    $scope.loadImages();
	    $scope.$broadcast('scroll.refreshComplete');
	  };
   

    $scope.select= function(item) {
    	$scope.showPopup();
    	//console.log(item)
	};
}])
   
.controller('cardReaderCtrl', ['$scope', '$stateParams','$timeout',"$ionicLoading","$ionicPopup","$cordovaSQLite","$http", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$timeout,$ionicLoading,$ionicPopup,$cordovaSQLite,$http) {
	var radio = '<ion-radio ng-model="choice" ng-value="1" value="1" id="seniorcitizen" ng-change="text(1)">Senior Citizen</ion-radio><ion-radio ng-model="choice" ng-value="2" value="2" id="pwd" ng-change="text(2)">PWD</ion-radio><ion-radio ng-model="choice" ng-value="3" value="3" id="student" ng-change="text(3)">Student</ion-radio>';
	var r = 0;
	$scope.New = function(){
		$("#cardreader").val('');
		$("#longitude").val('');
		$("#latitude").val('');
        $("#from").val('');
		$("#to").val('');
        $("#totalkm").val('');
        $("#totalpayment").val('');
        $("#print").hide();
        $("#new").hide();
        $("#fare-discount").hide();
	};


	$scope.text = function(x){
		r = x;
		switch(r){
			case 1:
				dis = 'seniorcitizen';
				break;
			case 2:
				dis = 'pwd';
				break;
			case 3:
				dis = 'student';
				break;
		}
	}

	$scope.syncPayment = function(conductor, passenger_id, long1 ,lat1,long2 ,lat2, transaction_date ,location1 ,location2,fare,km,bus_no,xtype){

		$http.post(link, {conductor: conductor,
						passenger_id: passenger_id,
						long1: long1,
						lat1: lat1,
						long2: long2,
						lat2: lat2,
						transaction_date: transaction_date,
						location1: location1,
						location2: location2,
						fare: fare,
						km: km,
						bus_no: bus_no,
						type: 'payment',
						xtype: xtype
					}).then(function(response){
		 if(response =='failed'){
		 	$scope.showAlert('syncPayment',"Sync to Web failed!");
		 }

		}, function(err){
		     $scope.showAlert('syncPayment',err);
		});
	}

	$scope.Discount = function(conductor, passenger_id, long1 ,lat1 ,long2 ,lat2,format ,location1 ,location2,fare,km,bus) {
		var payment = origpayment;

	  $ionicPopup.show({
	    template: radio,
	    title: 'Choose',
	    subTitle: 'Please select discount (if any)',
	    scope: $scope,
	    buttons: [
	      {
	        text: '<b>Choose</b>',
	        type: 'button-positive',
	        onTap: function(e) {
	        $ionicLoading.show();
	          if( r > 0 ){
	          	$scope.updatepayment( origpayment - (origpayment * discount / 100  ) ,dis )
	          	$("#totalpayment").val( origpayment - (origpayment * discount / 100  )  )
	          	fare = origpayment - (origpayment * discount / 100);
	          	 $scope.syncPayment(conductor, passenger_id, long1 ,lat1 ,long2 ,lat2,format ,location1 ,location2, fare ,km,bus,dis);

	          	console.log(dis)
	          }
	          $ionicLoading.hide();
	        }
	      },
	      {
	        text: 'No Discount',
	        onTap: function(e) {
	        $scope.syncPayment(conductor, passenger_id, long1 ,lat1 ,long2 ,lat2,format ,location1 ,location2,fare,km,bus,dis);
	        }
	      }
	    ]
	  });

	 
	}


	$scope.updatepayment = function(payment,type){
		var paymentid;
		var q = "SELECT * FROM payment WHERE passenger_id = ? ORDER BY pid desc LIMIT 1";
		$cordovaSQLite.execute(db,q,[passenger]).then(function(res) {
          	paymentid      = res.rows.item(0).pid;
          	console.log(paymentid)
        }, function (err) {
          console.error(err);
        });

	var query = "UPDATE payment set fare = ?,type = ? WHERE pid = ? ";

	$cordovaSQLite.execute(db,query,[payment,type,paymentid]).then(
		function(success) {
		  //$scope.showAlert('Update Settings','Update Settings Success!');	
		  console.log(success);
        }, function (err) {
          $scope.showAlert('Error Update Settings',err);
          console.error(err);
        });
	}

}])
   
.controller('fareCtrl', ['$scope', '$stateParams',"$cordovaSQLite","$ionicLoading","$ionicPopup", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$cordovaSQLite,$ionicLoading,$ionicPopup) {



}])
   
.controller('settingsCtrl', ['$scope', '$stateParams',"$cordovaSQLite","$ionicLoading","$ionicPopup","$ionicPlatform","$rootScope","$cordovaPrinter","$cordovaNetwork","$http", // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$cordovaSQLite,$ionicLoading,$ionicPopup,$ionicPlatform,$rootScope,$cordovaPrinter,$cordovaNetwork,$http) {
var receipt = '';

$scope.Load = function() {
$ionicPopup.show({
    template: '<input placeholder="card" type="text" id="card"><br><input placeholder="amount" type="number" id="amount">',
    title: 'Tap Card',
    subTitle: 'Please tap passenger card',
    scope: $scope,
    buttons: [
      {
        text: '<b>Submit</b>',
        type: 'button-positive',
        onTap: function(e) {
        $ionicLoading.show();
        	$scope.insert(konduktor,$("#card").val(), bus, $("#amount").val(),0,0,format,datenow.getTime());

        	//Set Receipt
        	receipt = 'Receipt #L' + datenow.getTime() + '<br>'; 
			receipt += 'Bus No.:' + bus + '<br>';
			receipt += 'Conductor No.:' + konduktor + '<br>';
			receipt += 'PassengerID: ' + $("#card").val() + '<br>';
			receipt += 'Load Amount: ' + $("#amount").val() + '<br>';
			receipt += 'Transaction Date: ' + format + '<br>';
			receipt += '<br>*** Thank you for choosing us! ***<br>';

        $ionicLoading.hide();
        }
      },
       { text: 'Cancel' }
    ]
  });
}


//Print
$scope.Print = function(){
	//if($cordovaPrinter.isAvailable()) {
    	$cordovaPrinter.print(receipt);
	//} else {
     $scope.showAlert('Print','Printing is not available on device');
	//}
};

$scope.Sync = function(){

		/*$http.post(link, {'conductor': "1",
						'passenger_id': "1",
						'long': "1",
						'lat': "1",
						'transaction_date': format,
						'transaction': "1",
						'location': "1",
						'bus': "1",
						'type': 'bus_transaction'}).then(function (res){
            console.log(res);
        });*/

        /*var req = {
		method: 'POST',
		url: link,
		params: {
			conductor: conductor,
			passenger_id: passenger_id,
			long: long,
			lat: lat,
			transaction_date: format,
			transaction: transaction,
			location: location,
			bus: bus,
			type: 'bus_transaction'
		},
		headers: {
		      'Pragma': undefined, 'Cache-Control': undefined, 'X-Requested-With': undefined, 'If-Modified-Since': undefined

		 }		
	}		
     	$http(req).success(function(res) {
			console.log(res);
			console.log('Success', angular.toJson(res));
		}).error(function(err){
			console.error(angular.toJson(err))
		})*/
	
		$http.post(link, {conductor: "1",
							passenger_id: "1",
							long: "1",
							lat: "1",
							transaction_date: format,
							transaction: "1",
							location: "1",
							bus: "1",
							type : "bus_transaction"}).then(function(response){
		 console.log(response)
		}, function(response){
		     console.log(response)
		});

}


$scope.showConfirm = function() {
	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Receipt',
	     template: 'Do you want a receipt?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {
	       $scope.Print();
	     } else {
	       console.log('cancel print!');
	     }
	   });
	 };

//Get the values of settings
$scope.settings = function() {
	$ionicLoading.show();
	var query = "SELECT * FROM settings";
	$cordovaSQLite.execute(db,query,[]).then(function(res) {
		console.log(res.rows.length);
          if(res.rows.length >0){
          	$("#conductornumber").val(res.rows.item(0).conductor);
          	$("#minimumfare").val(res.rows.item(0).fare);
          	$("#minimumkm").val(res.rows.item(0).km);
          	$("#succeedingfare").val(res.rows.item(0).succeedingfare);
          	$("#servername").val(res.rows.item(0).host);
          	$("#username").val(res.rows.item(0).username);
          	$("#password").val(res.rows.item(0).password);
          	$("#database").val(res.rows.item(0).database);
          	$("#busnumber").val(res.rows.item(0).bus_no);
          	$("#discount").val(res.rows.item(0).discount);
          }
        }, function (err) {
          $scope.showAlert('Error',err);
          console.error(err);
        });

		$ionicLoading.hide();
};

$scope.syncLoad = function(conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no){

		$http.post(link, {conductor: conductor,
						passenger_id: passenger_id,
						bus_no: bus_no,
						amount_in: amount_in,
						amount_out: amount_out,
						bus_transaction_id: bus_transaction_id,
						transaction_date: transaction_date,
						trans_no: trans_no,
						type: 'load'
					}).then(function(response){
						console.log(response);
		 if(response =='failed'){
		 	$scope.showAlert('syncLoad',"Sync to Web failed!");
		 }

		}, function(err){
		     $scope.showAlert('syncLoad',err);
		});
}

$scope.insert = function(conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no ) {
	var query = "INSERT INTO load (conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no ) VALUES (?,?,?,?,?,?,?,?)";
	$cordovaSQLite.execute(db,query,[conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no]).then(function(result) {
		console.log(result);

		$scope.syncLoad(conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no);

		$ionicLoading.hide();
		//$scope.showConfirm();
		$scope.showAlert('Message','Loading Success!');
		
	}, function(error) {

		 $ionicLoading.hide();

		$scope.showAlert('Error Load',error);
        console.error(error);
	});
};

//Get the values of settings
$scope.UpdateSettings = function() {
	$ionicLoading.show();
	var query = "UPDATE settings set conductor = ?, fare = ?, km = ? ,succeedingfare = ? , host = ?,username = ?,password = ?,database = ?,bus_no = ?,discount = ?";
	var v1 = $("#conductornumber").val();
  	var v2 = $("#minimumfare").val();
  	var v3 = $("#minimumkm").val();
  	var v4 = $("#succeedingfare").val();
  	var v5 = $("#servername").val();
  	var v6 = $("#username").val();
  	var v7 = $("#password").val();
  	var v8 = $("#database").val(); 
  	var v9 = $("#busnumber").val(); 
  	var v10 = $("#discount").val(); 

	$cordovaSQLite.execute(db,query,[v1, v2, v3 ,v4 , v5 ,v6,v7,v8,v9,v10]).then(
		function(success) {
		  $scope.showAlert('Update Settings','Update Settings Success!');	
        }, function (err) {
          $scope.showAlert('Error Update Settings',err);
          console.error(err);
        });

	$ionicLoading.hide();
};


$ionicPlatform.ready( function() {
	$scope.settings();
});

}])

.controller("GeoCtrl", ["$scope", "$cordovaGeolocation", "$ionicPlatform","$ionicLoading","$ionicPopup","$interval","$cordovaSQLite","$cordovaPrinter","$cordovaNetwork","$http",
	function($scope, $cordovaGeolocation, $ionicPlatform,$ionicLoading,$ionicPopup,$interval,$cordovaSQLite,$cordovaPrinter,$cordovaNetwork,$http) {


//14.677323, 120.980569
//6d656c6f76696e

 //compute km
var latitude1;
var longitude1;
var latitude2;
var longitude2;
var loc;
var loc2;
var dist;
var payment;
var receipt = '';
//var bus;
//var datenow = new Date();



$ionicPlatform.ready( function() {

	  $scope.map = {
	    defaults: {
	      tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	      maxZoom: 18,
	      zoomControlPosition: 'bottomleft'
	    },
	    center: {
	      lat: 32.73,
	      lng: -96.97,
	      zoom: 12
	    },
	    markers : {}
	  };

	 //Interval for rfid number
	 setInterval(
      function(){
        $scope.locate();
     }, 5000);   

	//Scan ID number
  	$scope.locate = function(){
  		 $ionicLoading.show();
  		if( $("#cardreader").val() == '' ){
  			$ionicLoading.hide();
  			return false;
  		}
	    $cordovaGeolocation
	      .getCurrentPosition()
	      .then(function (position) {
	        $scope.map.center.lat = position.coords.latitude;
	        $scope.map.center.lng = position.coords.longitude;
	        $("#longitude").val(position.coords.longitude);
	        $("#latitude").val(position.coords.latitude);

	        //compute km
	        latitude1 	= $("#latitude").val();
	        longitude1 	= $("#longitude").val();
	        //13.764639, 121.065118
	        //latitude2 	= 14.677323;
	       	// longitude2 	= 120.980569;

			var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude1 + '%2C' + longitude1 + '&language=en';
			console.log( GEOCODING )
            $.getJSON(GEOCODING).done(function(location) {
            	loc = location.results[0].formatted_address;
            	$scope.select( $("#cardreader").val() );
            })
	        //$ionicLoading.hide();
	      }, function(err) { 
	        // error
	        $ionicLoading.hide();
	        $scope.showAlert('Location',err);
	        console.log(err)
	        $("#cardreader").val('');
      	});
  	};

  	//Print
  	$scope.Print = function(){
  		 if($cordovaPrinter.isAvailable()) {
            $cordovaPrinter.print(receipt);
        } else {
             $scope.showAlert('Print','Printing is not available on device');
        }
  	};

$scope.syncTransaction = function(conductor, passenger_id, long ,lat,transaction,location,bus){

		$http.post(link, {conductor: conductor,
						passenger_id: passenger_id,
						long: long,
						lat: lat,
						transaction_date: format,
						transaction: transaction,
						location: location,
						bus: bus,
						type: 'bus_transaction'
					}).then(function(response){
		 if(response =='failed'){
		 	$scope.showAlert('syncTransaction',"Sync to Web failed!");
		 }

		}, function(err){
		     $scope.showAlert('syncTransaction',err);
		});
}

$scope.syncLoad = function(conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no){

		$http.post(link, {conductor: conductor,
						passenger_id: passenger_id,
						bus_no: bus_no,
						amount_in: amount_in,
						amount_out: amount_out,
						bus_transaction_id: bus_transaction_id,
						transaction_date: transaction_date,
						trans_no: trans_no,
						type: 'load'
					}).then(function(response){
		 if(response =='failed'){
		 	$scope.showAlert('syncLoad',"Sync to Web failed!");
		 }

		}, function(err){
		     $scope.showAlert('syncLoad',err);
		});
}

//Check ID per passenger
$scope.select = function(cardid) {
	var query = "SELECT trans,conductor,bus_no FROM bus_transaction WHERE passenger_id = ? ORDER BY id DESC LIMIT 1";
	$cordovaSQLite.execute(db,query,[cardid]).then(function(res) {
		$scope.appsettings();
          if(res.rows.length >0){
          	passenger = cardid;
          	console.log(res.rows.item(0).trans)
          	if(res.rows.item(0).trans == 'IN'){

          		$scope.insert(res.rows.item(0).conductor, cardid, longitude1 ,latitude1,'OUT',loc,res.rows.item(0).bus_no);
          		$scope.selectpas(cardid);
          		$("#cardreader").val('');
          		
          	}else{
          		$scope.insert(konduktor, cardid, longitude1 ,latitude1,'IN',loc,bus);
          		//$scope.syncTransaction(konduktor, cardid, longitude1 ,latitude1,'IN',loc,bus);
          		$scope.showAlert('Message','Welcome to our Bus! Please select seat now.');

          		$("#cardreader").val('');
	          	$("#longitude").val('');
				$("#latitude").val('');
	          	$("#from").val('');
				$("#to").val('');
	          	$("#totalkm").val('');
	          	$("#totalpayment").val('');
	          	$("#print").hide();
	          	$("#new").hide();
	          	$("#fare-discount").hide();
	          	
          	}
          }else{
          	//If it's not exists or already out
          	console.log(konduktor)
          	console.log(bus)

          	passenger = cardid;
          	$scope.insert(konduktor, cardid, longitude1 ,latitude1,'IN',loc,bus);     
          	$scope.showAlert('Message','Welcome to our Bus! Please select seat now.');


          	$("#cardreader").val('');
          	$("#longitude").val('');
			$("#latitude").val('');
          	$("#from").val('');
			$("#to").val('');
          	$("#totalkm").val('');
          	$("#totalpayment").val('');
          	$("#print").hide();
          	$("#new").hide();
          	$("#fare-discount").hide();
          }
        }, function (err) {
          $scope.showAlert('Error',err);
          console.error(err);
        });

		$ionicLoading.hide();
};

//Select In and Out of Passenger
$scope.selectpas = function(cardid) {
	var rlong1;
  	var rlat1;
  	var rlong2;
  	var rlat2;
  	var rloc1;
  	var rloc2;
  	var id;

	var query = "SELECT id, conductor, passenger_id, long ,lat ,location FROM bus_transaction WHERE passenger_id = ? AND trans = 'IN' ORDER BY id DESC LIMIT 1";
	var query2 = "SELECT id, conductor, passenger_id, long ,lat ,location FROM bus_transaction WHERE passenger_id = ? AND trans = 'OUT' ORDER BY id DESC LIMIT 1";
	
	$cordovaSQLite.execute(db,query2,[cardid]).then(function(res) {
          	id      = res.rows.item(0).id;
          	rlong2 	= res.rows.item(0).long;
          	rloc2 	= res.rows.item(0).location;
          	rlat2 	= res.rows.item(0).lat;
        }, function (err) {
          console.error(err);
        });

	$cordovaSQLite.execute(db,query,[cardid]).then(function(res) {
          if(res.rows.length >0){
          	rlong1 	= res.rows.item(0).long;
          	rlat1 	= res.rows.item(0).lat;
          	rloc1 	= res.rows.item(0).location;

          	var p = 0.017453292519943295;    //This is  Math.PI / 180
			var c = Math.cos;
			var a = 0.5 - c((rlat2 - rlat1) * p)/2 + c(rlat1 * p) * c(rlat2 * p) * (1 - c((rlong2 - rlong1) * p))/2;
			var R = 6371; //  Earth distance in km so it will return the distance in km
			dist = 2 * R * Math.asin(Math.sqrt(a)); 

			var selectsettings = "SELECT conductor, fare, km ,succeedingfare from settings";
			$cordovaSQLite.execute(db,selectsettings,[]).then(function(res) {
				 if(res.rows.length >0){
				 	var basekm 			= res.rows.item(0).km;
				 	var basefare 		= res.rows.item(0).fare;
				 	var succeedingfare 	= res.rows.item(0).succeedingfare;
				 	

				 	if(dist.toFixed(1) <= basekm ){
						payment = basefare;
					}else{
						var s 	= dist.toFixed(1) - basekm;
						var sf 	= s * succeedingfare;
						payment = basefare + sf; 
					}
					$scope.appsettings();
					$scope.checkbalance(cardid,payment,id,rlong1,rlat1,rlong2,rlat2,rloc1,rloc2,payment,dist.toFixed(1),bus);

					receipt = 'Receipt #000' + id + '<br>'; 
					receipt += 'Bus No.:' + bus + '<br>';
					receipt += 'Conductor No.:' + konduktor + '<br>';
					receipt += 'From: ' + rloc1 + '<br>';
					receipt += 'To: ' + rloc2 + '<br>';
					receipt += 'KM: ' + dist.toFixed(1) + '<br>';
					receipt += 'Fare: ' + payment + '<br>';
					receipt += '<br>*** Thank you for choosing us! ***<br>';

				 }

			}, function (err) {
	          $scope.showAlert('Settings Error',err);
	          console.error(err);
	        });

			
          }
        }, function (err) {
          $scope.showAlert('Error',err);
          console.error(err);
        });
};


//Get the values of settings
$scope.appsettings = function() {
	$ionicLoading.show();
	var query = "SELECT conductor, fare, km ,succeedingfare , host ,username,password,database,bus_no FROM settings";
	$cordovaSQLite.execute(db,query,[]).then(function(res) {
          if(res.rows.length >0){
          	$("#conductornumber").val(res.rows.item(0).conductor);
          	$("#minimumfare").val(res.rows.item(0).fare);
          	$("#minimumkm").val(res.rows.item(0).km);
          	$("#succeedingfare").val(res.rows.item(0).succeedingfare);
          	$("#servername").val(res.rows.item(0).host);
          	$("#username").val(res.rows.item(0).username);
          	$("#password").val(res.rows.item(0).password);
          	$("#database").val(res.rows.item(0).database);
          	$("#busnumber").val(res.rows.item(0).bus_no);

          	bus = res.rows.item(0).bus_no;

          }
        }, function (err) {
          $scope.showAlert('Error',err);
          console.error(err);
        });

		$ionicLoading.hide();
};

//Insert 
$scope.insert = function(conductor, passenger_id, long ,lat,transaction,location,bus) {
	var query = "INSERT INTO bus_transaction (conductor, passenger_id, long ,lat , transaction_date ,trans,location,bus_no ) VALUES (?,?,?,?,?,?,?,?)";
	$cordovaSQLite.execute(db,query,[conductor, passenger_id, long ,lat , format ,transaction,location,bus]).then(function(result) {
		console.log("success insert bus -> " + result.insertId);
		if(transaction == 'IN'){
			$scope.syncTransaction(conductor, passenger_id, long ,lat,'IN',location,bus);
		}

	}, function(error) {
		$scope.showAlert('Error Bus',error);
        console.error(error);
	});
};


//Insert Payment
$scope.insertpayment = function(conductor, passenger_id, long1 ,lat1 ,long2 ,lat2 ,location1 ,location2,fare,km,bus ) {
	var query = "INSERT INTO payment (conductor, passenger_id, long1 ,lat1,long2 ,lat2, transaction_date ,location1 ,location2,fare,km,bus_no ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
	$cordovaSQLite.execute(db,query,[conductor, passenger_id, long1 ,lat1 ,long2 ,lat2,format ,location1 ,location2,fare,km,bus]).then(function(result) {
		
		//$scope.syncPayment(conductor, passenger_id, long1 ,lat1 ,long2 ,lat2,format ,location1 ,location2,fare,km,bus);

		console.log("success insert payment " + result.insertId);

	}, function(error) {
		$scope.showAlert('Error Payment',error);
        console.error(error);
	});
};


$scope.insertseat = function(conductor, passenger_id, seat_number ,bus_no,status,transaction_date) {
	var query = "INSERT INTO seat (conductor, passenger_id, seat_number ,bus_no , status ,transaction_date  ) VALUES (?,?,?,?,?,?)";
	$cordovaSQLite.execute(db,query,[conductor, passenger_id, seat_number ,bus_no,status,transaction_date]).then(function(result) {
		console.log(result);
	}, function(error) {
		$scope.showAlert('Error Seat',error);
        console.error(error);
	});
};

$scope.insertbal = function(conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no ) {
	var query = "INSERT INTO load (conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no ) VALUES (?,?,?,?,?,?,?,?)";
	$cordovaSQLite.execute(db,query,[conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no]).then(function(result) {
		console.log(result + ' load');

		$scope.syncLoad(conductor, passenger_id ,bus_no , amount_in , amount_out ,bus_transaction_id ,transaction_date,trans_no);

	}, function(error) {
		$scope.showAlert('Error Load',error);
        console.error(error);
	});
};



$scope.checkseat = function(pass) {
	var query = "SELECT conductor, passenger_id, seat_number ,bus_no , status ,transaction_date FROM seat WHERE passenger_id = ? ORDER BY id DESC LIMIT 1";
	$cordovaSQLite.execute(db,query,[pass]).then(function(res) {
      if(res.rows.length >0){
      	if(res.rows.item(0).status == '1'){
      		$scope.insertseat(konduktor,pass,res.rows.item(0).seat_number,res.rows.item(0).bus_no,'0',format);
      		console.log("alis")
      	}else{
      		$scope.showAlert('Message','Passenger has no seat.' );
      		console.log("pasok")
      	}
      }else{
      	$scope.showAlert('Message','Passenger has no seat.' );
      }
    }, function (err) {
      $scope.showAlert('Error',err);
      console.error(err);
    });
};


$scope.checkbalance = function(pass,totalamt,bus_transaction_id,rlong1,rlat1,rlong2,rlat2,rloc1,rloc2,payment,dist,bus) {
	var query = "SELECT SUM(amount_in) - SUM(amount_out) as total FROM load WHERE passenger_id = ?";
	$cordovaSQLite.execute(db,query,[pass]).then(function(res) {
      if(res.rows.length >0){
      	if(res.rows.item(0).total < totalamt){

      		var zero = res.rows.item(0).total == null ? 0 : res.rows.item(0).total;

      		$scope.delete(bus_transaction_id);
      		$scope.showAlert('Message','Insufficient Balance! You only have ' + zero );
      		$("#longitude").val('');
			$("#latitude").val('');
      	}else{
      		$scope.Discount(konduktor,pass,rlong1,rlat1,rlong2,rlat2,format,rloc1,rloc2,payment,dist,bus);
      		$scope.insertbal(konduktor,pass,bus,0,totalamt,bus_transaction_id,format,datenow.getTime())
			$scope.insertpayment(konduktor,pass,rlong1,rlat1,rlong2,rlat2,rloc1,rloc2,payment,dist,bus);
			$scope.syncTransaction(konduktor, pass, rlong2 ,rlat2,'OUT',rloc2,bus);
			$scope.checkseat(pass);
      		$scope.showAlert('Message','Thank you for choosing us!');


      		origpayment = payment;
			$("#cardreader").val('');
			$("#from").val(rloc1);
			$("#to").val(rloc2);
			$("#totalkm").val(dist);
			$("#totalpayment").val(payment);
			$("#print").show();
			$("#new").show();
			//$("#fare-discount").show();
      	}
      }else{
      	$scope.delete(bus_transaction_id);
      	$scope.showAlert('Message','Insufficient Balance! You only have 0');
      }
    }, function (err) {
      $scope.showAlert('Error',err);
      console.error(err);
    });
};

//Get the values of settings
$scope.delete = function(bus_transaction_id) {
	$ionicLoading.show();
	var query = "DELETE FROM bus_transaction WHERE id = ?";
	$cordovaSQLite.execute(db,query,[bus_transaction_id]).then(
		function(success) {
		  console.log('deleted!');	
		  console.log(bus_transaction_id);	
        }, function (err) {
          console.error(err);
        });
	$ionicLoading.hide();
};


})

}])
