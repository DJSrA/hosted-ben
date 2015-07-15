var LandingPage = Parse.View.extend ({

  events: {
    "click .about": 'scrollAbout',
  },

  template: _.template($('.landing-page-template').text()),
  aboutTemplate: _.template($('.about-template').text()),

  initialize: function() {
    var that = this;
    $("html, body").scrollTop(0);
    $('.template-container').html(this.$el)
    this.$el.html(this.template());
    $('.template-container').css('padding-top', '50px');
    $('.footer-template-container').show();
    this.render();
    this.getShopInfo();
    // this.fillCompanyInfo()
  },

  render: function() {
    $('.template-container').append(this.aboutTemplate);
  },

  scrollAbout: function () {
    $('html,body').animate({
      scrollTop: $(".about-us").offset().top
    },200);
  },

  getShopInfo: function(){
    var that = this;
    var query = new Parse.Query('shopInstance');
    query.limit(1500);
    query.find({
      success: function(shop){
        console.log(shop[0]);
        $('.header-txt-lg').text(shop[0].attributes.company)
        $('.header-txt-p').text(shop[0].attributes.tagline)
        $('.about-title').text(shop[0].attributes.aboutTitle)
        $('.about-body').text(shop[0].attributes.aboutBody)
      },
      error: function(error) {
        console.log('No shop found. Using Defaults.');
      }
    })
  },
  // fillCompanyInfo: function () {
  //   var that = this;
  //   var query = new Parse.Query('user');
  //   query.limit(1500);
  //   query.find({
  //     success: function(user){
  //       $('.header-txt-lg').text(shop.company))
  //       $('.header-txt-p').text(shop.tagline))
  //       $('.about-title').text(shop.aboutTitle))
  //       $('.about-body').text(shop.aboutBody))
  //     },

  //     error: function(error){
  //       console.log(error + " it failed");
  //     }
  //   })
  // }

});