	var _mybankAPIgateway = angular.module('_mybankAPIgateway', []);

	_mybankAPIgateway.controller('_mybankAPIgatewayController', ["$scope","$http", function ($scope, $http) {

		$scope.customer = {};
		$scope.account = {};
		$scope.moneytransfer = {};
		$scope.reset = {};

		$scope.data = {
			query: "SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT(%fields%)), ']') as jsonresult from %TABLE_NAME%;",
			querytype: 0,
			queryresponse: "",
			eventquery: "SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('eventsource',eventsource,'eventdestination',eventdestination,'eventstatus',eventstatus,'eventdirection',eventdirection,'eventdata',eventdata,'createdate',createdate) order by createdate desc), ']') as jsonresult from tEvents;"
		};

		$scope.data.querytemplate = {
			"create": "INSERT INTO %TABLE_NAME% (%fields%) VALUES (%values%);",
			"delete": "DELETE FROM %TABLE_NAME% WHERE _ID in (%ID_LIST%);",
			"update": "UPDATE %TABLE_NAME% SET %fields% WHERE _id = %_ID%;",
			"read": "SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT(%fields%)), ']') as jsonresult from %TABLE_NAME%;"
		};

		$scope.data.customer = {
			"tablename": "tCustomer",
			"insertfields": "customername,customeraddress,customerphone",
			"selectfields": "'_ID',_ID,'customername',customername,'customeraddress',customeraddress,'customerphone',customerphone"
		};

		$scope.data.account = {
			"tablename": "tAccount",
			"insertfields": "accountname,accountbalance",
			"selectfields": "'_ID',_ID,'accountname',accountname,'accountbalance',accountbalance"
		};

		$scope.data.moneytransfer = {
			"tablename": "tMoneyTransfer",
			"insertfields": "fromaccount,toaccount,amount",
			"selectfields": "'_ID',_ID,'createdate',createdate,'fromaccount',fromaccount,'toaccount',toaccount,'amount',amount"
		};

		$scope.customer.executequery = function () {
			$http({
				method: 'POST',
				url: 'http://localhost:8081/mybank/customer/executequery/',
				dataType: 'json',
				data: {
					query: $scope.data.query,
					querytype: $scope.data.querytype
				},
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(function successCallback(response) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.msg = "Customer POST data submitted successfully!";
				$scope.data.queryresponse = response.data;

			}, function errorCallback(response) {
				$scope.msg = "Service does not exist (Customer) " + response.data;
				$scope.statusval = response.status;
				$scope.statustext = response.statusText;
				$scope.headers = response.headers();
			});
		};

		$scope.account.executequery = function () {
			$http({
				method: 'POST',
				url: 'http://localhost:8082/mybank/account/executequery/',
				dataType: 'json',
				data: {
					query: $scope.data.query,
					querytype: $scope.data.querytype
				},
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(function successCallback(response) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.msg = "Accounts POST data submitted successfully!";
				$scope.data.queryresponse = response.data;

			}, function errorCallback(response) {
				$scope.msg = "Service does not exist (Accounts) " + response.data;
				$scope.statusval = response.status;
				$scope.statustext = response.statusText;
				$scope.headers = response.headers();
			});
		};

		$scope.moneytransfer.executequery = function () {
			$http({
				method: 'POST',
				url: 'http://localhost:8083/mybank/moneytransfer/executequery/',
				dataType: 'json',
				data: {
					query: $scope.data.query,
					querytype: $scope.data.querytype
				},
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(function successCallback(response) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.msg = "MoneyTransfer POST data submitted successfully!";
				$scope.data.queryresponse = response.data;

			}, function errorCallback(response) {
				$scope.msg = "Service does not exist (MoneyTransfer) " + response.data;
				$scope.statusval = response.status;
				$scope.statustext = response.statusText;
				$scope.headers = response.headers();
			});
		};

		// 'Customer' functions
		$scope.data.customer.selectquery = function () {
			$scope.data.query = $scope.data.querytemplate.read;
			$scope.data.querytype = 0;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.customer.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.customer.selectfields);
			$scope.customer.executequery();
			$scope.showcustomertable = 1;
		};

		$scope.data.customer.insertquery = function () {
			var fieldvalues = "";
			$scope.data.query = $scope.data.querytemplate.create;
			$scope.data.querytype = 1;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.customer.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.customer.insertfields);
			fieldvalues = "'" + $scope.form.customer.name + "','" + $scope.form.customer.address + "','" + $scope.form.customer.phone + "','0'";
			$scope.data.query = $scope.data.query.replace(/%values%/, fieldvalues);
			$scope.customer.executequery();
			$scope.form.customer = angular.copy($scope.reset);
		};

		$scope.data.customer.deletequery = function () {
			$scope.data.query = $scope.data.querytemplate.delete;
			$scope.data.querytype = 1;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.customer.tablename);
			$scope.data.query = $scope.data.query.replace(/%ID_LIST%/, $scope.form.customer._ID);
			$scope.customer.executequery();
			$scope.form.customer = angular.copy($scope.reset);
		};

		$scope.data.customer.updatequery = function () {
			$scope.data.query = $scope.data.querytemplate.update;
			$scope.data.querytype = 1;
			$scope.data.customer.updatefields = "customername='" + $scope.form.customer.name + "'";
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.customer.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.customer.updatefields);
			$scope.data.query = $scope.data.query.replace(/%_ID%/, $scope.form.customer._ID);
			$scope.customer.executequery();
			$scope.form.customer = angular.copy($scope.reset);
		};

		// 'Accounts' functions
		$scope.data.account.selectquery = function () {
			$scope.data.query = $scope.data.querytemplate.read;
			$scope.data.querytype = 0;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.account.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.account.selectfields);
			$scope.account.executequery();
		};

		$scope.data.account.insertquery = function () {
			var fieldvalues = "";
			$scope.data.query = $scope.data.querytemplate.create;
			$scope.data.querytype = 1;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.account.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.account.insertfields);
			fieldvalues = "'" + $scope.form.account.name + "','" + $scope.form.account.balance + "'";
			$scope.data.query = $scope.data.query.replace(/%values%/, fieldvalues);
			$scope.account.executequery();
			$scope.form.account = angular.copy($scope.reset);
		};

		$scope.data.account.deletequery = function () {
			$scope.data.query = $scope.data.querytemplate.delete;
			$scope.data.querytype = 1;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.account.tablename);
			$scope.data.query = $scope.data.query.replace(/%ID_LIST%/, $scope.form.account._ID);
			$scope.account.executequery();
			$scope.form.account = angular.copy($scope.reset);
		};

		$scope.data.account.updatequery = function () {
			$scope.data.query = $scope.data.querytemplate.update;
			$scope.data.querytype = 1;
			$scope.data.account.updatefields = "accountname='" + $scope.form.account.name + "',accountbalance='" + $scope.form.account.balance + "'";
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.account.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.account.updatefields);
			$scope.data.query = $scope.data.query.replace(/%_ID%/, $scope.form.account._ID);
			$scope.account.executequery();
			$scope.form.account = angular.copy($scope.reset);
		};

		// 'MoneyTransfer' functions
		$scope.data.moneytransfer.selectquery = function () {
			$scope.data.query = $scope.data.querytemplate.read;
			$scope.data.querytype = 0;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.moneytransfer.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.moneytransfer.selectfields);
			$scope.moneytransfer.executequery();
			$scope.showmoneytable = 1;
		};

		$scope.data.moneytransfer.insertquery = function () {
			var fieldvalues = "";
			$scope.data.query = $scope.data.querytemplate.create;
			$scope.data.querytype = 1;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.moneytransfer.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.moneytransfer.insertfields);
			fieldvalues = "'" + $scope.form.moneytransfer.fromaccount + "','" + $scope.form.moneytransfer.toaccount + "','" + $scope.form.moneytransfer.amount + "'";
			$scope.data.query = $scope.data.query.replace(/%values%/, fieldvalues);
			$scope.moneytransfer.executequery();
			$scope.form.moneytransfer = angular.copy($scope.reset);
		};

		// redundant function for now
		$scope.data.account.vieweventlog = function () {
			$http({
				method: 'POST',
				url: 'http://localhost:8082/mybank/account/executequery/',
				dataType: 'json',
				data: {
					query: $scope.data.eventquery,
					querytype: 0
				},
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(function successCallback(response) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.msg = "EventLog POST data submitted successfully!";
				$scope.account.eventlog = response.data;

			}, function errorCallback(response) {
				$scope.msg = "Service does not exist (EventLog) " + response.data;
				$scope.statusval = response.status;
				$scope.statustext = response.statusText;
				$scope.headers = response.headers();
			});
		}
	}]);