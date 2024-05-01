$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // Define a query parameter object for making requests to the server
  var mainSearchInf = {
    pagenum: 1, // Page number, default is to request the first page's data
    pagesize: 10, // Number of records per page, default is 10 records per page
  }

  initTable()

  // Fetch the location list
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/api/systems/location/list',
      data: mainSearchInf,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('get location list error')
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

    var cityName = $('[name=city_name]').val()

    mainSearchInf.city_name = cityName
    // Re-render the table data based on the latest filter criteria
    initTable()
  })

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
        // Use the first value to determine how the jump callback was triggered
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

  // Delegate click event for btn-edit button
  $('tbody').on('click', '.btn-edit', function (e) {
    var id = $(this).attr('data-id')
    // Make a request to get the corresponding location data
    $.ajax({
      method: 'GET',
      url: '/api/systems/location?id=' + id,
      success: function (res) {
        var data = res.data
        data.action = 'edit'
        data.request_type = 'put'
        open_form("#open_div", data, 'location edit', '680px', '282px');
      }
    })
  })

  form.on('submit(update_submit)', function (data) {
    var method = data.field.request_type;
    var id = data.field.locationID
    $.ajax({
      method: method,
      url: '/api/systems/location?id=' + id,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data.field),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('update location failed!')
        }
        layer.msg('update location ok!');
        layer.closeAll()
        $('#open_div').hide()
        initTable();
      }
    })
  });

  $("#add").click(function () {
    var data = {};
    data.action = 'addLocation';
    data.request_type = 'post';
    // Call the utility method to open the popup
    open_form("#open_div", data, 'location add', '680px', '282px');
  });

  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    // Prompt the user whether to delete
    layer.confirm('sure to delete?', { icon: 3, title: 'tips' }, function (index) {
      $.ajax({
        method: 'delete',
        url: '/api/systems/location?id=' + id,
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

})
