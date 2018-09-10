(function () {
  'use strict';

  // articles.controller.js
  angular
    .module('myApp', [])
    .controller('myCtrl', myCtrl)
    .directive('fileModel', fileModel)
    .service('fileUpload', fileUpload);

  myCtrl.$inject = ['$scope', 'fileUpload'];
  fileModel.$inject = ['$parse'];
  fileUpload.$inject = ['$http'];
  

  function myCtrl($scope, fileUpload) {
    $scope.uploadFile = function () {
      var file = $scope.myFile;

      console.log('file is ');
      console.dir(file);

      var uploadUrl = "/fileUpload";
      fileUpload.uploadFileToUrl(file, uploadUrl);
    };
  };

  function fileModel($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  };

  function fileUpload($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
      var fd = new FormData();
      fd.append('file', file);

      $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        })

        .then(function (response) {
          console.log(response);
        })

        .catch(function (response) {
          console.log(response);
        });
    }
  };

  
})();