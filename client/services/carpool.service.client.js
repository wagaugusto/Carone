/**
 *Carpool project project on 2/20/2016.
 */
(function(){

    'use strict';

    angular
        .module("CarPoolApp")
        .factory("CarPoolService",CarPoolService)

    function CarPoolService($http){


        var api = {
            createCarPoolByUser: createCarPoolByUser,
            findAllCarPoolByUser: findAllCarPoolByUser,
            deleteCarPoolById: deleteCarPoolById,
            updateCarPoolById: updateCarPoolById,
            findCarPoolBySourceDestination: findCarPoolBySourceDestination,
            findCarPoolByCity: findCarPoolByCity,
            findAllCarPools: findAllCarPools,
            findCarPoolById: findCarPoolById
        };

        return api;

        // function to create Carpool for all user
        function createCarPoolByUser(userId, pool){
            return $http.post("/api/project/user/"+userId+"/carPool",pool);
        }

        function findCarPoolById(carPoolId){
            return $http.get("/api/project/carpool/"+carPoolId);
        }

        function findAllCarPools(){
            return $http.get("/api/project/carpool");
        }

        // functions finds all CarPool's created by user
        function findAllCarPoolByUser(userId){
            return $http.get("/api/project/user/"+userId+"/carpool");
        }

        // functions finds all CarPool's by source and destination
        function findCarPoolBySourceDestination(source, destination){
            return $http.get("/api/project/carpool?"+"source="+source+"&"+"destination="+destination);
        }

        // functions finds all CarPool's by city
        function findCarPoolByCity(city){
            return $http.get("/api/project/carpool?"+"city="+city);
        }


        // function to delete CarPool by id
        function deleteCarPoolById(carPoolId){
            return $http.delete("/api/project/carpool/"+carPoolId);
        }

        // function updates the CarPool by its id
        function updateCarPoolById(carPoolId,pool) {
            return $http.put("/api/project/carpool/"+carPoolId,pool);
        }
    }

})();