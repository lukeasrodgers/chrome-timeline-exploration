var BaseView = Backbone.View.extend({
  get_tpl: function(tpl) {
    return $(tpl).html();
  }
});
