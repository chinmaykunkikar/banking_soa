	var _mybankAPIgateway = angular.module('_mybankAPIgateway', []);

	_mybankAPIgateway.controller('_mybankAPIgatewayController', ["$scope","$http", function ($scope, $http) {

		$scope.customer = {};
		$scope.account = {};
		$scope.transactions = {};
		$scope.reset = {};

		$scope.data = {
			query: "SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT(%fields%)), ']') as jsonresult from %TABLE_NAME%;",
			queryresponse: "",
			eventquery: "SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('eventsource',eventsource,'eventdestination',eventdestination,'eventstatus',eventstatus,'eventdirection',eventdirection,'eventdata',eventdata,'createdate',createdate) order by createdate desc), ']') as jsonresult from tEvents;"
		};

		$scope.data.querytemplate = {
			"create": "INSERT INTO %TABLE_NAME% (%fields%) VALUES (%values%);",
			"delete": "DELETE FROM %TABLE_NAME% WHERE _id in (%ID_LIST%);",
			"update": "UPDATE %TABLE_NAME% SET %fields% WHERE _id = %_ID%;",
			"read": "SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT(%fields%)), ']') as jsonresult from %TABLE_NAME%;"
		};

		$scope.data.customer = {
			"tablename": "tcustomer",
			"insertfields": "customername,customeraddress,customerphone",
			"selectfields": "'_id',_id,'customername',customername,'customeraddress',customeraddress,'customerphone',customerphone",
			"eventsource": "customer"
		};

		$scope.data.account = {
			"tablename": "taccount",
			"insertfields": "accountname,accountbalance",
			"selectfields": "'_id',_id,'accountname',accountname,'accountbalance',accountbalance",
			"eventsource": "account"
		};

		$scope.data.transactions = {
			"tablename": "ttransactions",
			"insertfields": "idsender,idreceiver,transferamount",
			"selectfields": "'_id',_id,'createdate',createdate,'idsender',idsender,'idreceiver',idreceiver,'transferamount',transferamount",
			"eventsource": "transactions"
		};

		$scope.customer.executequery = function () {
			$http({
				method: 'POST',
				url: 'http://localhost:8081/mybank/customer/executequery/',
				dataType: 'json',
				data: {
					query: $scope.data.query,
					source: $scope.data.customer.eventsource
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
					source: $scope.data.account.eventsource
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

		$scope.transactions.executequery = function () {
			$http({
				method: 'POST',
				url: 'http://localhost:8083/mybank/transactions/executequery/',
				dataType: 'json',
				data: {
					query: $scope.data.query,
					source: $scope.data.transactions.eventsource
				},
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			}).then(function successCallback(response) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.msg = "Transactions POST data submitted successfully!";
				$scope.data.queryresponse = response.data;

			}, function errorCallback(response) {
				$scope.msg = "Service does not exist (Transactions) " + response.data;
				$scope.statusval = response.status;
				$scope.statustext = response.statusText;
				$scope.headers = response.headers();
			});
		};

		// 'Customer' functions
		$scope.data.customer.selectquery = function () {
			$scope.data.query = $scope.data.querytemplate.read;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.customer.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.customer.selectfields);
			$scope.customer.executequery();
			$scope.showcustomertable = 1;
		};

		$scope.data.customer.insertquery = function () {
			var fieldvalues = "";
			$scope.data.query = $scope.data.querytemplate.create;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.customer.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.customer.insertfields);
			fieldvalues = "'" + $scope.form.customer.name + "','" + $scope.form.customer.address + "','" + $scope.form.customer.phone + "'";
			$scope.data.query = $scope.data.query.replace(/%values%/, fieldvalues);
			$scope.customer.executequery();
			$scope.form.customer = angular.copy($scope.reset);
		};

		$scope.data.customer.deletequery = function () {
			$scope.data.query = $scope.data.querytemplate.delete;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.customer.tablename);
			$scope.data.query = $scope.data.query.replace(/%ID_LIST%/, $scope.form.customer._id);
			$scope.customer.executequery();
			$scope.form.customer = angular.copy($scope.reset);
		};

		$scope.data.customer.updatequery = function () {
			$scope.data.query = $scope.data.querytemplate.update;
			$scope.data.customer.updatefields = "customername='" + $scope.form.customer.name + "',customeraddress='" + $scope.form.customer.address + "',customerphone='" + $scope.form.customer.phone + "'";
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.customer.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.customer.updatefields);
			$scope.data.query = $scope.data.query.replace(/%_ID%/, $scope.form.customer._id);
			$scope.customer.executequery();
			$scope.form.customer = angular.copy($scope.reset);
		};

		// 'Accounts' functions
		$scope.data.account.selectquery = function () {
			$scope.data.query = $scope.data.querytemplate.read;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.account.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.account.selectfields);
			$scope.account.executequery();
		};

		$scope.data.account.insertquery = function () {
			var fieldvalues = "";
			$scope.data.query = $scope.data.querytemplate.create;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.account.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.account.insertfields);
			fieldvalues = "'" + $scope.form.account.name + "','" + $scope.form.account.balance + "'";
			$scope.data.query = $scope.data.query.replace(/%values%/, fieldvalues);
			$scope.account.executequery();
			$scope.form.account = angular.copy($scope.reset);
		};

		$scope.data.account.deletequery = function () {
			$scope.data.query = $scope.data.querytemplate.delete;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.account.tablename);
			$scope.data.query = $scope.data.query.replace(/%ID_LIST%/, $scope.form.account._id);
			$scope.account.executequery();
			$scope.form.account = angular.copy($scope.reset);
		};

		$scope.data.account.updatequery = function () {
			$scope.data.query = $scope.data.querytemplate.update;
			$scope.data.account.updatefields = "accountname='" + $scope.form.account.name + "',accountbalance='" + $scope.form.account.balance + "'";
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.account.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.account.updatefields);
			$scope.data.query = $scope.data.query.replace(/%_ID%/, $scope.form.account._id);
			$scope.account.executequery();
			$scope.form.account = angular.copy($scope.reset);
		};

		// 'Transactions' functions
		$scope.data.transactions.selectquery = function () {
			$scope.data.query = $scope.data.querytemplate.read;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.transactions.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.transactions.selectfields);
			$scope.transactions.executequery();
		};

		$scope.data.transactions.insertquery = function () {
			var fieldvalues = "";
			$scope.data.query = $scope.data.querytemplate.create;
			$scope.data.query = $scope.data.query.replace(/%TABLE_NAME%/, $scope.data.transactions.tablename);
			$scope.data.query = $scope.data.query.replace(/%fields%/, $scope.data.transactions.insertfields);
			fieldvalues = "'" + $scope.form.transactions.idsender + "','" + $scope.form.transactions.idreceiver + "','" + $scope.form.transactions.transferamount + "'";
			$scope.data.query = $scope.data.query.replace(/%values%/, fieldvalues);
			$scope.transactions.executequery();
			$scope.form.transactions = angular.copy($scope.reset);
		};

		// redundant function for now
		$scope.data.account.vieweventlog = function () {
			$http({
				method: 'POST',
				url: 'http://localhost:8082/mybank/account/executequery/',
				dataType: 'json',
				data: {
					query: $scope.data.eventquery
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