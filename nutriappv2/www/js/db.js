var db = openDatabase("nutritech", "1.0", "Nutritech", 200000);  // Open SQLite Database



var tblUser 			= "CREATE TABLE IF NOT EXISTS  user (" +
								"id INTEGER PRIMARY KEY AUTOINCREMENT, " +
								"firstname varchar(50),  " +
								"middlename varchar(50),  " +
								"lastname varchar(50),  " +
								"username varchar(50),  " +
								"password varchar(50),  " +
								"phone_number varchar(50),  " +
								"email_address varchar(50),  " +
								"distributor_code varchar(50),  " +
								"date_created datetime)";

var insertStatement 	= "INSERT INTO user ( " +
							"username,  " +
							"password,  " +
							"firstname,  " +
							"middlename,  " +
							"lastname,  " +
							"phone_number,  " +
							"email_address,  " +
							"distributor_code,  " +
							"date_created) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

var dropStatement = "DROP TABLE user";
var deleteStament = "DELETE from user"



function initDatabase(){  // Function Call When Page is ready.
 
    try {
        if (!window.openDatabase){  // Check browser is supported SQLite or not.
            alert('Databases are not supported in this browser.');
        }
        else {
            createTable();  // If supported then call Function for create table in SQLite
        }
    }
    catch (e) {
        if (e == 2) {
            // Version number mismatch. 
            console.log("Invalid database version.");
        } 
        else {
            console.log("Unknown error " + e + ".");
        }
        return;
    }
}


function createTable(){  // Function for Create Table in SQLite.
    db.transaction(function (tx) { tx.executeSql(tblUser, [], showRecords, onError); });
}


function insertRecord(){ // Get value from Input and insert record . Function Call when Save/Submit Button Click..
 		var uname 			= $username.val();
 		var password		= $password.val();
 		var fname 			= $firstname.val();
 		var mname			= $middlename.val();
 		var lname 			= $lastname.val();
 		var phone 			= $phone.val();
 		var email 			= $email.val();
 		var code 			= $code.val();
 		var d 				= new Date();
 		var date 			= d;
 		
 		
            var record = [
                uname,
                password,
                fname,
                mname,
                lname,
                phone,
                email,
                code,
                date
            ];

 			db.transaction(function (tx) { 
 				tx.executeSql(insertStatement, record, loadAndReset(true), onError); 
 			});

 		
}


function loadAndReset(notify){ //Function for Load and Reset...
    notify = (typeof notify === "undefined") ? false : notify;

    /*if(notify == true) {
        db.transaction(function (tx) {
            tx.executeSql('select * from user limit 1', [], function (tx, result) {
                if(result.rows.length > 0) {
                    var user = result.rows.item(0);

                    if(_calculateAge(new Date(Date.parse(user.birthday))) >= 13) {
                        tx.executeSql('select c.*, f.nutrition_facts as facts from calorie c left join food f on f.name = c.food ORDER BY c.date DESC', [], function(tx, rs) { 
                            var _calorie = [];
                            for(var i = 0; i < rs.rows.length; i++) {
                                _calorie.push(rs.rows.item(i));
                            }

                            $.ajax({
                                type: "POST",
                                url: 'http://wegoride.com/update.php',
                                data: { 
                                    update : JSON.stringify(user), 
                                    calorie : JSON.stringify(_calorie) 
                                },
                                dataType: 'json',
                                success: function (data) {
                                    if(data.success) {
                                        alert("Update Sucess!");    
                                    } else {
                                        alert('Update fail');
                                        console.log(data.error);
                                    }
                                },
                                error: function(jqXHR, status, error) {
                                    alert("Profile Saved temporarily. Please connect to the internet to sync your data.");
                                }
                            });
                        });
                    } else {
                        alert("Profile Saved temporarily. You must be over 13 to sync your data.");
                    }
                } else {
                    alert("Unable to retrieve user information. Please try again.");
                }

            }, onError);
        });
    } else {
        resetForm();
        showRecords();
    }*/
}


function onError(tx, error){ // Function for Hendeling Error...
 
    alert(error.message);
 
}


function showRecords(){ // Function For Retrive data from Database Display records as list

    db.transaction(function (tx) {
 
        tx.executeSql('select * from user limit 1', [], function (tx, result) {
        	var user = '';

            if(result.rows.length > 0) {
            	item = result.rows.item(0);
            	$session_user = item.username;
            	console.log(item.username);
            }
        });
 
    });
 
}


function dropTable(){ // Function Call when Drop Button Click.. Talbe will be dropped from database.
    db.transaction(function (tx) { tx.executeSql(dropStatement, [], showRecords, onError); });
    initDatabase();
}

function deleteRecord(){ // Function Call when Drop Button Click.. Talbe will be dropped from database.
    db.transaction(function (tx) { tx.executeSql(deleteStament, [], showRecords, onError); });
    initDatabase();
}


$( document ).ready(function() {
	initDatabase();
	showRecords();

	//Count if user already register
   /*	db.transaction(function (tx) {
        tx.executeSql(selectAllStatement, [], function (tx, result) {
            dataset = result.rows;
             $usercount = dataset.length;

 			if($usercount == 0){
 				$("#user-info").modal("show");
 			}
 			else{
 				//loadAndReset();
 			}

        });
    });*/



});