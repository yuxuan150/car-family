$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // Define a query parameter object for future requests to the server
  var mainSearchInf = {
    pagenum: 1, // Page number, default is to request the first page of data
    pagesize: 10, // Number of records per page, default is 10 records

  }

  initTable()

  // Fetch the carModel list
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/api/systems/users/list',
      data: mainSearchInf,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('get user list error')
        }
        var htmlStr = template('tpl-titles', res)
        $('thead').html(htmlStr)
        htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // Call the method to render pagination
        renderPage(res.total)
      }
    })
  }

  // Bind the submit event to the filter form
  $('#form-search').on('submit', function (e) {
    e.preventDefault()

    var userId = $('[name=userid]').val()

    mainSearchInf.userId = userId
    // Re-render the table data based on the latest filter criteria
    initTable()
  })

  layui.use(['table', 'layer'], function () {
    var table = layui.table;
    var layer = layui.layer;
    var searchInfo = {
      pagenum: 1, // Page number, default is to request the first page of data
      pagesize: 10, // Number of records per page, default is 10 records
    }
    // Initialize the table ["locationID", "city_name", "latitude", "longitude"]
    // search city
    $('#search-btn').on('click', function () {
      var searchText = $('#search-input').val();
      searchInfo.city_name = searchText;
      searchInfo.pagenum = 1;

      initTable();
    });
  });

  // Define the method for rendering pagination
  function renderPage(total) {
    // Call laypage.render() method to render the pagination structure
    laypage.render({
      elem: 'pageBox', // Pagination container's Id
      count: total, // Total data count
      even: true,
      limit: mainSearchInf.pagesize, // Number of records per page
      curr: mainSearchInf.pagenum, // Set the default selected page
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [10, 20, 50, 100],
      // Trigger the jump callback when pagination changes
      // There are two ways to trigger the jump callback:
      // 1. Clicking on the page number
      // 2. Just calling laypage.render() method
      jump: function (obj, first) {
        // Determine how the jump callback was triggered by the value of 'first'
        // If first is true, it means it was triggered by method 2
        // Otherwise, it was triggered by method 1
        mainSearchInf.pagenum = obj.curr
        mainSearchInf.pagesize = obj.limit
        // Fetch and render the data list based on the latest query parameters
        if (!first) {
          initTable()
        }
      }
    })
  }

  // Bind a click event for btn-edit button using delegation
  $('tbody').on('click', '.btn-edit', function (e) {
    $('.noedit').css({ 'display': 'none' })
    var id = $(this).attr('data-id')

    // Make a request to get the corresponding category data
    $.ajax({
      method: 'GET',
      url: '/api/systems/users?id=' + id,
      success: function (res) {
        var data = res.data
        data.action = 'edit'
        data.request_type = 'put'
        data.id = id
        open_form("#open_div", data, 'location edit', '680px', '382px');
      }
    })
  })

  form.on('submit(update_submit)', function (data) {
    var method = data.field.request_type;
    var id = data.field.id
    if (data.field.password != data.field.repassword) {
      layui.msg('password not match!')
      return;
    }
    if (method == 'POST' && data.field.password.length < 6) {
      layui.msg('password length should be >=6')
      return;
    }
    $.ajax({
      method: method,
      url: '/api/systems/users?id=' + id,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data.field),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('update or add user failed!')
        }

        layer.msg('update or add user ok!');
        layer.closeAll()
        $('#open_div').hide()
        initTable();

      }
    })
  });
  $("#add").click(function () {
    $('.noedit').css({ 'display': 'block' })
    var data = {};
    data.action = 'add newUser';
    data.request_type = 'POST';
    // Call the utility method to open the popup
    open_form("#open_div", data, 'new user add', '680px', '382px');
  });

  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    // Prompt the user whether to delete
    layer.confirm('sure to delete?', { icon: 3, title: 'tips' }, function (index) {
      $.ajax({
        method: 'delete',
        url: '/api/systems/users/?id=' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('delete failed！')
          }
          layer.msg('delete ok！')
          initTable();
        }
      })
    })
  })


  function initCitys() {


    $.ajax({
      url: '/api/getLocation', // Backend API address
      type: 'GET',
      success: function (data) {
        // Clear the dropdown list
        $('[name="location_id"]').empty();
        $('[name="location_id"]').append('<option value="">select City</option>')
        // Populate the dropdown list
        $.each(data.data, function (index, city) {
          $('[name="location_id"]').append(' <option value="' + city.id + '">' + city.title + '</option>');
        });
        // Re-render the form
        layui.form.render('select');
      },
      error: function (xhr, status, error) {
        // Handle request failure
        layer.msg('get city data failed!');
      }
    });

  }

  initCitys()

})
