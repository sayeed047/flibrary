import Ember from 'ember';

export default Ember.Component.extend({

  message:'',
  email:'' ,
  store:Ember.inject.service(),

  isEmailValid: Ember.computed('email',function(){
    let e=this.get('email');
    let  atpos = e.indexOf("@");
    let  dotpos = e.lastIndexOf(".");
    if (atpos < 1 || dotpos < atpos+2 || dotpos+2 >= e.length) {
        return false;
    }
    else {
      return true;
    }
  }),


  isValid:Ember.computed('isEmailValid','isMessageEnoughLong',function(){
  if(this.get('isEmailValid') && this.get('isMessageEnoughLong')){
    return false;}
  else {
    return true;
  }
}),

  getMessage:Ember.computed('message',function(){
    return this.get('message');
}),

getEmail:Ember.computed('message',function(){
  return this.get('email');
}),


  isMessageEnoughLong:Ember.computed('message',function()
{
  console.log("changing");
  if(this.get('message').length > 5){
    return true;}
    else {
      return false;
    }
}),

  actions:{
    sucess()
    {

      this.get('store').createRecord('contact',{email: this.get('getEmail') , message:this.get('getMessage') }).save().then(()=>{
        this.set('sucessMessage',"Thank you! Your message is sent.");

      });


    },again()
    {
      this.set('sucessMessage','');
      this.set('message','');
      this.set('email','');
    }
  }
});
