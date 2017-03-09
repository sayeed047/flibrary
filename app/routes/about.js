import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    add() {

      this.get('store').createRecord('library', {
        name: "HITech Library",
        address: "some address and adress",
        phone: "+91 1234567780",
        book: [
          {
            title: "C programming",
            author: "Denis Richie",
            year: "2016"
          }
        ]
      }).save().then(() => {
        console.log("succesfully added");
      });

    }
  }

});


/*
{name:"Hitech Libray",address:"temp some address",phone:"+91 1234554321",book:books}).save().then(()=>{
  console.log("succesfully added");
});
});
}*/
