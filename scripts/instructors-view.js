var InstructorsView = Parse.View.extend ({

  events: {
  },

  template: _.template($('.instructors-page-template').text()),
  instructorsInstanceTemplate: _.template($('.instructors-instance-template').text()),


  initialize: function() {
    console.log('instructors view');
    var that = this;
    $("html, body").scrollTop(0);
    $('.template-container').html(this.$el)
    this.$el.html(this.template());
    this.getInstructors();

  },

  getInstructors: function () {
    var that = this;
    var query = new Parse.Query('instructorInstance');
    query.limit(1500);
    query.find({
      success: function(instructor){
        console.log(instructor)
        // for(i=0;i<instructor.length;i++){
        //   $('.instructor-template-list-container').prepend(that.instructorInstanceTemplate({
        //     instructorTitle: instructor[i].attributes.instructorTitle,
        //     instructorInstructor: instructor[i].attributes.instructorInstructor,
        //     instructorDescription: instructor[i].attributes.instructorDescription,
        //     instructorImage: instructor[i].attributes.logo._url
        //   }));
        // }
      },

      error: function(error) {
        console.log('threw an error');
      }
    })
  },
});