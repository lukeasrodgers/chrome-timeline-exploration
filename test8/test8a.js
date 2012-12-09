var user_data = [];
for (var i=0; i<100; i++) {
  user_data.push({
    name: 'some name',
    age: 30,
    job: 'foobar'
  });
}
var users = new Backbone.Collection(user_data);
var users_view = new UsersView({collection: users});
$(document).ready(function() {
  $('body').append(users_view.render().$el);
  users_view.render();
});
