var AboutAdminPage = Parse.View.extend ({

  events: {
    'click .edit-profile-button'      : 'toggleEditAttribute',
    'click .save-profile-edit-button' : 'saveProfileEdit',
  },

  template: _.template($('.about-admin-template').text()),


    initialize: function() {
      if((Parse.User.current() === null) === true){
        router.navigate('#',{trigger:true})
      } else {
        $("html, body").scrollTop(0);
        $('.template-container').html(this.$el)
        this.$el.html(this.template());
        $('.template-container').css('padding-top', '80px');
        this.render();
      }
    },

    render: function() {
    },

    toggleEditAttribute: function(){
      if($(event.target).hasClass('active')){
        _.each($('.profile-edit'), function(){
          $('.profile-edit').prop('disabled', 'disabled');
        })
        // $('.save-profile-edit-button').css('opacity', 0);
        $(event.target).removeClass('active');
      }else {
        _.each($('.profile-edit'), function(){
          $('.profile-edit').prop('disabled', false);
        })
        // $('.save-profile-edit-button').css('opacity', 1);
        $(event.target).addClass('active');
      }
    },

    saveProfileEdit: function () {
      var that = this;
      var query = new Parse.Query('shopInstance');
      query.find({
        success:function(shop){
          console.log(shop[0].id);
          shop[0].set({
            aboutTitle:      ($('.about-title-input').val().length != 0 ? $('.about-title-input').val() : shop[0].attributes.aboutTitle),
            aboutBody:        ($('.about-body-textarea').val().trim().length != 0 ? $('.about-body-textarea').val() : shop[0].attributes.aboutBody),
          }).save()
          console.log(shop[0]);
          $('.edit-profile-button').click();
          $('.profile-edit').val('');
          $('.about-body-textarea').prop('placeholder', shop[0].attributes.aboutBody),
          $('.about-title-input').prop('placeholder', shop[0].attributes.aboutTitle)
        },
        error: function(error){
          console.log('no existing shop');
        }
      })
    },

});