(function (){
    angular
        .module("CarPoolApp")
        .controller("MainController",MainController);

    function MainController($scope, $location){
        $scope.$location= $location;
    }
})();