$(function () {
  // Click event for "Register an Account" link
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  });

  // Click event for "Login" link
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  });

  // Get the form object from layui
  var form = layui.form;
  var layer = layui.layer;

  // Define custom validation rules using form.verify() function
  form.verify({
    // Custom validation rule named "pwd"
    pwd: [/^[\S]{6,12}$/, 'Password must be between 6 and 12 characters'],
    // Validation rule to check if two passwords match
    repwd: function (value) {
      // Get the password from the password input field
      var pwd = $('.reg-box [name=password]').val();
      // Check if the passwords match
      if (pwd !== value) {
        return 'Passwords do not match!';
      }
    }
  });

  // Listen for the submit event of the registration form
  $('#form_reg').on('submit', function (e) {
    // Prevent default form submission behavior
    e.preventDefault();
    var city_id = $('#form_reg [name=city_name]').val();
    if (!city_id || city_id <= 0) {
      layer.msg('Please select a city first!');
      return;
    }
    var username = $('#form_reg [name=username]').val();
    var userid = $('#form_reg [name=userid]').val();
    if (!username || username.length <= 0)
      username = userid;
    // Prepare data for Ajax POST request
    var data = {
      userid: userid,
      username: username,
      password: $('#form_reg [name=password]').val(),
      location: $('#form_reg [name=city_name]').val(),
    };
    // Send POST request to register user
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg('Registration success, please login!');
      // Simulate a click on the login link
      $('#link_login').click();
    });
  });

  // Listen for the submit event of the login form
  $('#form_login').submit(function (e) {
    // Prevent default form submission behavior
    e.preventDefault();
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // Quickly get data from the form
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('Login failed!');
        }
        layer.msg('Login success!');
        // Save the token received upon successful login to localStorage
        localStorage.setItem('token', res.token);
        // Redirect to the backend homepage
        location.href = '/index.html';
      }
    });
  });

  // Get location data from the backend
  $.ajax({
    url: '/api/getLocation',
    type: 'GET',
    success: function (data) {
      // Clear the dropdown list
      $('[name="city_name"]').empty();
      $('[name="city_name"]').append('<option value="">Select City</option>');
      // Populate the dropdown list
      $.each(data.data, function (index, city) {
        $('[name="city_name"]').append(' <option value="' + city.id + '">' + city.title + '</option>');
      });
      // Re-render the form
      layui.form.render('select');
    },
    error: function (xhr, status, error) {
      // Handle request failure
      layer.msg('Failed to get city data!');
    }
  });
});
