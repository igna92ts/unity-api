var nohm = require('nohm').Nohm;

module.exports = function(nohm){
  nohm.model('d_object', {
    properties: {
      GUID: {
        type: 'string',
        unique: true,
        validations: [
          'notEmpty'
        ]
      },
      position: {
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
