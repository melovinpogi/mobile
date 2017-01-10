// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var db = null;
var passenger = null;
var konduktor = null;
var bus     = null;
var datenow = new Date();
var discount = null;
var link = null;


angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.directives','app.services','ngCordova'])

.config(function($ionicConfigProvider, $sceDelegateProvider){
  

  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);

})

.run(function($ionicPlatform,$timeout,$cordovaSQLite, $ionicLoading, $q, $rootScope,$ionicPopup,$cordovaNetwork) {
  $ionicPlatform.ready(function() {

     // An alert dialog
     $rootScope.showAlert = function($title,$msg) {
       var alertPopup = $ionicPopup.alert({
         title: $title,
         template: $msg
       });

       alertPopup.then(function(res) {
         console.log(res);
       });
     };

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB({name: "app.db", location: 1});
    } else {
      // Ionic serve syntax
      db = window.openDatabase("app.db", "GPS", "1.0", -1);
    }

    //Check network connection
    setInterval(
      function(){
         if(window.Connection) {
            if(navigator.connection.type == Connection.NONE) {
                $rootScope.showAlert('Internet Disconnected','The internet is disconnected on your device. Please Reconnect.');
            }
          }
     }, 10000);   

    //$rootScope.deferred = $q.defer();
    /*var busTable      = "DROP TABLE bus_transaction";
    var paymentTable  = "DROP TABLE payment";
    var settingsTable = "DROP TABLE settings";
    var seatTable     = "DROP TABLE seat";
    var loadTable     = "DROP TABLE load";*/
    //var loadlistTable = "DROP TABLE loadlist";

    var tables = true;

    //Transaction Table
    var busTable = "CREATE TABLE IF NOT EXISTS bus_transaction(id integer PRIMARY KEY autoincrement NOT NULL, conductor text, passenger_id text, long text,lat text, transaction_date text,trans text,location text,bus_no text)";
    $cordovaSQLite.execute(db, busTable).then(
      function(success) {
        //$rootScope.showAlert('open database bus_transaction','Bus');
      }, 
      function(error) {
        tables  = false;
        $rootScope.showAlert('open database','creating/opening the database in bus_transaction ' + error);
      });


    //PAyment table
    var paymentTable = "CREATE TABLE IF NOT EXISTS payment(pid integer PRIMARY KEY autoincrement NOT NULL, conductor text, passenger_id text, long1 text,lat1 text,long2 text,lat2 text, transaction_date text,location1 text,location2 text,fare text,km text,bus_no text,type text)";
    $cordovaSQLite.execute(db, paymentTable).then(
      function(success) {
         //$rootScope.showAlert('open database payment',"Payment");
      }, 
      function(error) {
        tables = false;
        $rootScope.showAlert('open database','creating/opening the database in payment ' + error);
      });


    //seat table
    var seatTable = "CREATE TABLE IF NOT EXISTS seat(id integer PRIMARY KEY autoincrement NOT NULL, conductor text, passenger_id text, seat_number text,bus_no text, status text,transaction_date text )";
    $cordovaSQLite.execute(db, seatTable).then(
      function(success) {
         //$rootScope.showAlert('open database payment',"Payment");
      }, 
      function(error) {
        tables = false;
        $rootScope.showAlert('open database','creating/opening the database in seat ' + error);
      });

     //load table
    var loadTable = "CREATE TABLE IF NOT EXISTS load(id integer PRIMARY KEY autoincrement NOT NULL, conductor text, passenger_id text,bus_no text, amount_in text, amount_out text,bus_transaction_id text,transaction_date text,trans_no text )";
    $cordovaSQLite.execute(db, loadTable).then(
      function(success) {
         //$rootScope.showAlert('open database payment',"Payment");
      }, 
      function(error) {
        tables = false;
        $rootScope.showAlert('open database','creating/opening the database in seat ' + error);
      });

    //Setting table
    var settingsTable = "CREATE TABLE IF NOT EXISTS settings(id integer PRIMARY KEY autoincrement NOT NULL, conductor text,fare text,km text,succeedingfare text,host text,username text,password text,database text,bus_no text,discount text)";
    $cordovaSQLite.execute(db, settingsTable).then(
      function(success) {

        //Check if there's already inserted
        var select = "SELECT conductor FROM settings";
        $cordovaSQLite.execute(db,select,[]).then(function(res) {
          if(res.rows.length <=0){
             //Insert if created
            var query = "INSERT INTO settings (conductor, fare, km ,succeedingfare , host ,username,password,database,bus_no,discount ) VALUES (?,?,?,?,?,?,?,?,?,?)";
            $cordovaSQLite.execute(db,query,['6d656c6f76696e','75','44','1.70','http://bataantransit.naif-org.com/sync','','','','1','20']).then(function(result) {
              konduktor = res.rows.item(0).conductor;
              bus       = res.rows.item(0).bus_no;
              discount  = res.rows.item(0).discount;
              link      = res.rows.item(0).host;

              console.log("success insert settings -> " + result.insertId);
            }, function(error) {
              $rootScope.showAlert('Error Settings',error);
                  console.error(error);
            });
          }else{
            var query = "SELECT conductor, fare, km ,succeedingfare , host ,username,password,database,bus_no,discount FROM settings";
            $cordovaSQLite.execute(db,query,[]).then(function(res) {
              konduktor = res.rows.item(0).conductor;
              bus       = res.rows.item(0).bus_no;
              discount  = res.rows.item(0).discount;
              link      = res.rows.item(0).host;

            },function (err) {
                $scope.showAlert('Error',err);
                console.error(err);
              });
          }

        }, function(error) {
            $rootScope.showAlert('Error Query Settings',error);
            console.error(error);
            });

      }, 
      function(error) {
        tables = false;
        $rootScope.showAlert('open database','creating/opening the database in settings ' + error);
      });

    var settingsDeferred = $q.defer();

    settingsDeferred.promise.then(function(res) {
      $rootScope.deferred.resolve(true);
    });
  });
})

.directive('disableSideMenuDrag', ['$ionicSideMenuDelegate', '$rootScope', function($ionicSideMenuDelegate, $rootScope) {
    return {
        restrict: "A",  
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

            function stopDrag(){
              $ionicSideMenuDelegate.canDragContent(false);
            }

            function allowDrag(){
              $ionicSideMenuDelegate.canDragContent(true);
            }

            $rootScope.$on('$ionicSlides.slideChangeEnd', allowDrag);
            $element.on('touchstart', stopDrag);
            $element.on('touchend', allowDrag);
            $element.on('mousedown', stopDrag);
            $element.on('mouseup', allowDrag);

        }]
    };
}])

