$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // Define a filter to beautify the time format
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // Define a function for padding zeros
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }

  // Define a query parameters object for making requests to the server
  var mainSearchInf = {
    pagenum: 1, // Page number, by default request the first page's data
    pagesize: 10, // Number of records per page, default is 2 records per page

  }

  initTable()

  // Get carModel list
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/api/cars/model/list',
      data: mainSearchInf,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('get carModel list err')
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

  // Bind the submit event for the filter form
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // Get the values of the selected items in the form
    var noRecall = $('[name=no_recall]').val()
    var company_name = $('[name=company_name]').val()
    var model_name = $('[name=model_name]').val()
    var distince = $('[name=distince]').val()
    var sort_by = $('[name=order_by]').val()
    mainSearchInf.no_recall = noRecall
    mainSearchInf.company_name = company_name
    mainSearchInf.model_name = model_name
    mainSearchInf.distince = distince
    mainSearchInf.order_by = sort_by
    var cityName = $('#city_select').val()
    if (!cityName)
      mainSearchInf.location_id = ''
    // Re-render the table data based on the latest filter criteria
    initTable()
  })

  // Define the method for rendering pagination
  function renderPage(total) {
    // Call laypage.render() method to render the pagination structure
    laypage.render({
      elem: 'pageBox', // Pagination container's Id
      count: total, // Total number of records
      limit: mainSearchInf.pagesize, // Number of records per page
      curr: mainSearchInf.pagenum, // Set the default selected page
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [10, 20, 50, 100],
      // When a page change occurs, trigger the jump callback
      // There are two ways to trigger the jump callback:
      // 1. When a page number is clicked, it will trigger the jump callback
      // 2. Whenever laypage.render() method is called, it triggers the jump callback
      jump: function (obj, first) {
        // You can determine how the jump callback was triggered by the value of first
        // If the value of first is true, it means it was triggered by method 2
        // Otherwise, it was triggered by method 1
        console.log(first)
        console.log(obj.curr)
        // Update the latest page number value into the query parameters object
        mainSearchInf.pagenum = obj.curr
        // Update the latest number of items into the query parameters object's pagesize attribute
        mainSearchInf.pagesize = obj.limit
        // Fetch and render the data list based on the latest parameters
        // initTable()
        if (!first) {
          initTable()
        }
      }
    })
  }

  /** load location  */
  function initSelectItems() {

    $.ajax({
      url: '/api/getLocation', // Backend API address
      type: 'GET',
      success: function (data) {
        // Empty the dropdown list
        $('[name="city_select"]').empty();
        $('[name="city_select"]').append('<option value="">selectCity</option>')
        // Populate the dropdown list
        $.each(data.data, function (index, city) {
          $('[name="city_select"]').append(' <option value="' + city.id + '">' + city.title + '</option>');
        });

        $('[name="location_id"]').empty();
        $('[name="location_id"]').append('<option value="">selectCity</option>')
        // Populate the dropdown list
        $.each(data.data, function (index, city) {
          $('[name="location_id"]').append(' <option value="' + city.id + '">' + city.title + '</option>');
        });
        // Re-render the form
        form.render('select')

      },
      error: function (xhr, status, error) {
        // Handle request failure
        layer.msg('get city data failed!');
      }
    });

    $.ajax({
      url: '/api/systems/company/listLite', // Backend API address
      type: 'GET',
      success: function (data) {
        // Empty the dropdown list
        $('[name="company_id"]').empty();
        $('[name="company_id"]').append('<option value="">selectCompany</option>')
        // Populate the dropdown list
        $.each(data.data, function (index, company) {
          $('[name="company_id"]').append(' <option value="' + company.id + '">' + company.title + '</option>');
        });
        // Re-render the form
        form.render('select')

      },
      error: function (xhr, status, error) {
        // Handle request failure
        layer.msg('get company data failed!');
      }
    });

  }

  initSelectItems();

  /** load location End... */



  /**sale or buy car */


  //add car for sale
  $("#add_sale_car").click(function () {
    var data = {};
    data.action = 'addTrade';
    data.request_type = 'post';
    data.flag = 'sale'
    // Call the utility method to open the layer
    open_form("#open_div", data, 'add a new Car for sale', '680px', '352px');
  });
  //submit to add new car for sale/or buy 
  form.on('submit(add_submit)', function (data) {
    var method = data.field.request_type;

    $.ajax({
      method: method,
      url: '/api/cars/model',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data.field),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('add car for sale failed!')
        }

        layer.msg('update car for sale ok!');
        layer.closeAll()
        $('#open_div').hide()
        initTable();

      }
    })
  });

  $('tbody').on('click', '.btn-buy', function (e) {
    var id = $(this).attr('data-id')
    // Send a request to get the corresponding category data
    $.ajax({
      method: 'PUT',
      url: '/api/cars/model?id=' + id,
      success: function (res) {
        layer.msg("congratulations, the car is yours!")
        initTable()
      }
    })
  })
  /** sale or buy car End */

})
