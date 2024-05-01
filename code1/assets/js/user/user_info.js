$(function() {
  var form = layui.form
  var layer = layui.layer

  form.verify({
    nickname: function(value) {
      if (value.length > 20) {
        return 'Nickname length must be between 1 ~ 20 characters!'
      }
    }
  })

  initUserInfo()

  // Initialize basic user information
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('Failed to obtain user information!')
        }
        // console.log(res)
        // transfer form.val() Quickly assign values to forms
        form.val('formUserInfo', res.data)
      }
    })
  }

  // Reset form data
  $('#btnReset').on('click', function(e) {
    // Prevent the default reset behavior of a form
    e.preventDefault()
    initUserInfo()
  })

  // Listen to form submission events
  $('.layui-form').on('submit', function(e) {
    // Prevent the default submit behavior of a form
    e.preventDefault()
    // initiate ajax data request
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('Failed to update user information!')
        }
        layer.msg('Updated user information successfully!')
        // Call the method in the parent page to re-render the user's avatar and user information
        window.parent.getUserInfo()
      }
    })
  })
})
