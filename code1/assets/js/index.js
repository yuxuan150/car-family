$(function() {
  // Call getUserInfo to obtain basic user information
  getUserInfo()

  var layer = layui.layer

  // Click the button to realize the exit function
  $('#btnLogout').on('click', function() {
    // Prompts the user whether to confirm exit
    layer.confirm('confirm exit?', { icon: 3, title: 'tips' }, function(index) {
      //do something
      // 1. Clear tokens in local storage
      localStorage.removeItem('token')
      // 2. Jump back to the login page
      location.href = '/login.html'

      // Close confirm query box
      layer.close(index)
    })
  })
})

// Get basic information about the user
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function(res) {
       
      if (res.status !== 0) {
        return layui.layer.msg('get use info failed!')
      }
      // Call renderAvatar to render the user's avatar
      renderAvatar(res.data)
    }
    // Regardless of success or failure, the complete callback function will eventually be called.
    // complete: function(res) {
    //   // console.log('Executed complete callback:')
    //   // console.log(res)
    //   // IN complete In the callback function, you can use res.responseJSON Get the data returned by the server response
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === 'Identity authentication failed!') {
    //     // 1. Force clear token
    //     localStorage.removeItem('token')
    //     // 2. Force jump to login page
    //     location.href = '/login.html'
    //   }
    // }
  })
}

// Render the user's avatar
function renderAvatar(user) {
  // 1. Get user's name
  var name = user.nickname || user.username
  var role=user.role;
  if(role=='ADMIN')
  $('.auth_admin').css({'display':'block'})
  // 2. Set welcome text
  $('#welcome').html('Welcome&nbsp;&nbsp;' + name)
  // 3. Render user's avatar on demand
  if (user.user_pic !== null) {
    // 3.1 Render image avatar
    $('.layui-nav-img')
      .attr('src', user.user_pic)
      .show()
    $('.text-avatar').hide()
  } else {
    // 3.2 Render text avatar
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar')
      .html(first)
      .show()
  }
}
