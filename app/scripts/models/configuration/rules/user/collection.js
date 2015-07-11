'use strict';

angular.module('configurationApp')
  .factory('UserRuleCollection', function(UserRule, $q, $rootScope) {
    var operations = [
      {
        $order: 1,

        value: '*',
        text: 'Any'
      },
      {
        $order: 2,

        value: '@',
        text: 'Map'
      }
    ];

    function UserRuleCollection() {
      this.available = {
        names: null
      };

      this.rules = null;
    }

    UserRuleCollection.prototype.refresh = function() {
      var self = this;

      return $q.all([
        // Retrieve seen users
        $rootScope.$s.call('session.user.list').then(
          $.proxy(self.updateUsers, this),
          function() {
            return $q.reject('Unable to retrieve users');
          }
        ),

        // Retrieve user rules
        $rootScope.$s.call('rule.list', [], {type: 'user', full: true}).then(
          $.proxy(self.updateRules, this),
          function() {
            return $q.reject('Unable to retrieve user rules');
          }
        )
      ]);
    };

    UserRuleCollection.prototype.updateUsers = function(users) {
      this.available.names = [].concat(operations, _.map(users, function (user) {
        return {
          $order: 10,
          type: 'name',

          value: user.name,
          text: user.name
        };
      }));

      console.log('user - names', this.available.names);
    };

    UserRuleCollection.prototype.updateRules = function(rules) {
      // Parse rules
      this.rules = _.map(rules, function(rule) {
        return new UserRule(rule);
      });

      console.log('user - rules', this.rules);
    };

    return UserRuleCollection;
  });
