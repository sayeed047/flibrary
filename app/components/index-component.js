import Ember from 'ember';

export default Ember.Component.extend({


  emailAddress:'',

  isValid: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
  isDisabled: Ember.computed.not('isValid'),
  store: Ember.inject.service(),




  actualEmailAddress: Ember.computed('emailAddress', function() {
    console.log(this.get('emailAddress'));
    return this.get('emailAddress');
  }),



  actions: {

    saveInvitation() {
      const email = this.get('emailAddress');

      const newInvitation = this.get('store').createRecord('invitation', {
        email: email
      });

      newInvitation.save().then((response) => {
        this.set('responseMessage', `Thank you! We saved your email address with the following id: ${response.get('id')}`);
        this.set('emailAddress', '');
      });

  },againn(){
    this.set("responseMessage",'');
  }
}

});
