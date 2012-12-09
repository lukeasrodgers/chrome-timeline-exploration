var UsersView = BaseView.extend({
  template: '#users',
  list_selector: 'tbody',
  render: function() {
    var user_view;
    this.$el.html(_.template(this.get_tpl(this.template)));
    this.collection.each(function(user) {
      user_view = new UserView({model:user});
      this.append(user_view);
    }, this);
    return this;
  },
  append: function(view) {
    this.$el.find(this.list_selector).append(view.render().$el);
  }
});
