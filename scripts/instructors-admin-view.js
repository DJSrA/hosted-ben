var InstructorsAdminPage = Parse.View.extend ({

  events: {
    'click .edit-profile-button'      : 'toggleEditAttribute',
    'change #myFile'              : 'readURL',
    'click .add-instructor'           : 'addInstructor',
    'click .cancel-add'           : 'cancelAddInstructor',
    'click .save-instructor-update-button' : 'updateInstructor',
    'click .delete-class' : 'deleteInstructor',
    'click .save-new-edit-button' : 'saveProfileEdit'
  },

  template: _.template($('.instructors-admin-container-template').text()),
  detailTemplate: _.template($('.instructor-detail-template').text()),
  instructorInstanceTemplate: _.template($('.add-instructor-detail-template').text()),

  initialize: function() {
    if((Parse.User.current() === null) === true){
      router.navigate('#',{trigger:true})
    } else {
      $("html, body").scrollTop(0);
      $('.template-container').html(this.$el)
      this.$el.html(this.template());
      this.render();
      if(Parse.User.current().get('instructorImage')){
        $('#instructorImage-img').attr('src', Parse.User.current().get('instructorImage')._url);
      }
      $('.template-container').css('padding-top', '80px');
      this.readURL;
      this.getInstructors();
    }
  },

  render: function() {
  },

  getInstructors: function () {
    var that = this;
    var query = new Parse.Query('instructorInstance');
    query.limit(1500);
    query.find({
      success: function(instructor){
        for(i=0;i<instructor.length;i++){
          $('.instructor-list-container').prepend(that.detailTemplate({
            instructorName: instructor[i].attributes.instructorName,
            instructorTagline: instructor[i].attributes.instructorTagline,
            instructorBio: instructor[i].attributes.instructorBio,
            instructorImage: instructor[i].attributes.instructorImage._url,
            instructorId: instructor[i].id
          }));
        }
      },

      error: function(error) {
        console.log('threw an error');
      }
    })
  },

  readURL: function(){
    var x = document.getElementById("myFile");
    var txt = "";
    if ('files' in x) {
      var Reader = new FileReader();
      Reader.readAsDataURL(x.files[0]);

      Reader.onload = function (Event) {
          document.getElementById("instructorImage-img").src = Event.target.result;
      };
    } 
    else {
        if (x.value == "") {
            txt += "Select one or more files.";
        } else {
            txt += "The files property is not supported by your browser!";
            txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead. 
        }
    }
  },

  toggleEditAttribute: function(){
    if($(event.target).hasClass('active')){
      _.each($('.profile-edit'), function(){
        $('.profile-edit').prop('disabled', 'disabled');
        $('.delete-class').prop('disabled', true);
        $('.save-instructor-update-button').prop('disabled', true);
      })
      $(event.target).removeClass('active');
    }else {
      _.each($('.profile-edit'), function(){
        $('.profile-edit').prop('disabled', false);
        $('.delete-class').prop('disabled', false);
        $('.save-instructor-update-button').prop('disabled', false);


      })
      $(event.target).addClass('active');
    }
  },

  toggleAddInstructorEdit: function(){
    if($(event.target).hasClass('active')){
      _.each($('.profile-edit'), function(){
        $('.profile-edit').prop('disabled', 'disabled');
      })
      $(event.target).removeClass('active');
    }else {
      _.each($('.profile-edit'), function(){
        $('.profile-edit').prop('disabled', false);
      })
      $(event.target).addClass('active');
    }
  },

  saveProfileEdit: function () {
    var that = this;

    var InstructorInstance = Parse.Object.extend("instructorInstance");
    var instructorInstance = new InstructorInstance();

    var photoUpload = function() {
      //original photo upload function

      var fileUploadControl = $("#myFile")[0];
      if (fileUploadControl.files.length > 0) {
        var file = fileUploadControl.files[0];
        var name = "photo.jpg";
       
        return new Parse.File(name, file);
      } 
    }
    instructorInstance.set({
      instructorName:      ($('.instructor-name-input').val().length != 0 ? $('.instructor-name-input').val() : Parse.User.current().get('instructorName')),
      instructorTagline:        ($('.instructor-tagline-input').val().length != 0 ? $('.instructor-tagline-input').val() : Parse.User.current().get('instructorTagline')),
      instructorBio:    ($('.instructor-bio-textarea').val().trim().length != 0 ? $('.instructor-bio-textarea').val() : Parse.User.current().get('instructorBio')),
      instructorImage:         (photoUpload() != undefined ? photoUpload() : Parse.User.current().get('instructorImage')),
    }).save().then(function(){
        console.log(instructorInstance)
      that.cancelAddInstructor()
      $('.instructor-list-container').html('')
      that.getInstructors();
    });

    $('.edit-profile-button').click();
    $('.profile-edit').val('');
    $('.instructor-name-input').prop('placeholder', Parse.User.current().get('instructorName')),
    $('.instructor-tagline-input').prop('placeholder', Parse.User.current().get('instructorTagline'))
    $('.instructor-bio-textarea').prop('placeholder', Parse.User.current().get('instructorBio'))
  },

  updateInstructor: function (){
    var instructorId = event.target.id;
    var photoUpload = function() {
      //original photo upload function

      var fileUploadControl = $("#myFile")[0];
      if (fileUploadControl.files.length > 0) {
        var file = fileUploadControl.files[0];
        var name = "photo.jpg";
       
        return new Parse.File(name, file);
      } 
    }
    _.each($('.instructor-detail-container'), function(instructorContainer){
        if(instructorContainer.id == instructorId){
          var query = new Parse.Query('instructorInstance');
          query.equalTo('objectId', instructorId)
          query.limit(1500);
          query.find({
            success: function(instructor){

              instructor[0].set({
                instructorName: ($(instructorContainer).find('input.instructor-name-input')[0].value.length > 0 ?  $(instructorContainer).find('input.instructor-name-input')[0].value : instructor[0].get('instructorName')),
                instructorTagline: ($(instructorContainer).find('input.instructor-tagline-input')[0].value.length > 0 ?  $(instructorContainer).find('input.instructor-tagline-input')[0].value : instructor[0].get('instructorTagline')),
                instructorBio: ($(instructorContainer).find('textarea.instructor-bio-textarea')[0].value.length > 0 ?  $(instructorContainer).find('textarea.instructor-bio-textarea')[0].value : instructor[0].get('instructorBio')),
                instructorImage: (photoUpload() != undefined ? photoUpload() : instructor[0].get('instructorImage'))
              }).save().then(function(){
                router.swap( new InstructorsAdminPage() );
              })
            },
            error: function(error){
              console.log('no instructor was found');
            }
          })
          
        }
    })
  },

  addInstructor: function(){
    $('.add-instructor').text('CANCEL').addClass('cancel-add').removeClass('add-instructor')
    $('.instructor-add-container').prepend(this.instructorInstanceTemplate);
    this.toggleEditAttribute();
  },

  deleteInstructor: function(){
    var that = this;
    var thisInstructor = $(event.target).prop('id');
    var query = new Parse.Query('instructorInstance');
    query.limit(1500);
    query.equalTo('objectId', thisInstructor);
    query.find({
      success: function(instructor){
        instructor[0].destroy()
        $('div#' + thisInstructor + '').remove();
        that.toggleEditAttribute();

      },

      error: function(error){
        console.log('unable to destroy');
      }
    })
  },

  cancelAddInstructor: function() {
    $('.cancel-add').text('ADD +').addClass('add-instructor').removeClass('cancel-add')
    $('.instructor-add-container').html('')
    this.toggleEditAttribute();
    $("html, body").scrollTop(0);
  }

});