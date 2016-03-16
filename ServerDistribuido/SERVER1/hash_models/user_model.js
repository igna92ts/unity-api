var nohm = require('nohm').Nohm;

module.exports = function(nohm){
  nohm.model('User', {
    properties: {
      name: {
        type: 'string',
        unique: true,
        validations: [
          'notEmpty'
        ]
      },
      email: {
        type: 'string',
        unique: true,
        validations: [
          'email'
        ]
      },
      country: {
        type: 'string',
        defaultValue: 'Tibet',
        validations: [
          'notEmpty'
        ]
      },
      visits: {
        type: function incrVisitsBy(value, key, old) {
          return old + value;
        },
        defaultValue: 0,
        index: true
      }
    },
    methods: {
      getContryFlag: function () {
        return 'http://example.com/flag_'+this.p('country')+'.png';
      },
    }
  });
}
