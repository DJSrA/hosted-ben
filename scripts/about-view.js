var AboutView = Parse.View.extend ({

  events: {
  },

  template: _.template($('.about-template').text()),

  initialize: function() {
    var that = this;
    $("html, body").scrollTop(0);
    $('.template-container').html(this.$el)
    this.$el.html(this.template());
    $('.about-nav').prop('disabled', true);
    this.getShopInfo();
  },

  getShopInfo: function(){
    var that = this;
    var query = new Parse.Query('shopInstance');
    query.limit(1500);
    query.find({
      success: function(shop){
        console.log(shop[0]);
        $('.about-title').text(shop[0].attributes.aboutTitle)
        $('.about-body').text(shop[0].attributes.aboutBody)
      },
      error: function(error) {
        console.log('No shop found. Using Defaults.');
      }
    })
  },

});