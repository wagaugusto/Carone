(function () {

    'use strict';

    angular
        .module("CarPoolApp")
        .controller("HomeController", HomeController)

    function HomeController($scope, CarPoolService, UserService, $location) {

        var vm = this;
        vm.findCarPool = findCarPool;
        vm.details=details;

        function init() {
            vm.carPools=null;

        }

        init();

        function findCarPool(city){

            $location.path("/searchlist/"+city);

            CarPoolService.findCarPoolByCity(city)
                .then(function(response){
                   vm.carPools=response.data;
                });
        }

        function details(pool){
             $location.path("/searchresults/"+pool._id);
        }


        var cities = [

            {
                city: 'São Bernardo do Campo',
                desc: 'A TM fica aqui =)',
                lat: -23.6898429,
                long:-46.564848100000006
            },
            {
                city: 'Diadema',
                desc: 'Um lugar escuro, onde você nunca deve ir',
                lat: -23.6816587    ,
                long: -46.620341199999984
            }
        ];

        var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(-23.6898429, -46.564848100000006),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info) {


            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.city
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });

            $scope.markers.push(marker);

        }

        for (var i = 0; i < cities.length; i++) {
            createMarker(cities[i]);
        }

        $scope.openInfoWindow = function (e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }

    }
})();