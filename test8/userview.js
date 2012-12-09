var UserView = BaseView.extend({
  template: '#user',
  render: function() {
    var attrs = this.model.toJSON();
    this.$el.html(_.template(this.get_tpl(this.template), attrs));
    return this;
  }
});
