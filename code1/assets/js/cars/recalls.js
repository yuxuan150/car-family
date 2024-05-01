$(function () {
  var table = layui.table;
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // Define a date formatting filter
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  }

  // Define a function to pad zeros
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }

  // Define a query parameter object for making requests to the server
  var mainQueryPager = {
    pagenum: 1, // Page number, default is to request the first page's data
    pagesize: 10, // Number of records per page, default is 10 records per page
  };

  initTable();

  // Fetch the car model list
  function initTable() {
    var urlParams = new URLSearchParams(window.location.search);
    var id = urlParams.get('id');

    $.ajax({
      method: 'GET',
      url: '/api/cars/recall/list' + (id ? '?id=' + id : ''),
      data: mainQueryPager,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('get car recall list error');
        }
        var htmlStr = template('tpl-titles', res);
        $('.main_head').html(htmlStr);
        htmlStr = template('tpl-table', res);
        $('.main_body').html(htmlStr);
        // Call the method to render pagination
        renderPage(res.total);
      }
    });
  }

  // Bind submit event to the filter form
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    var model_name = $('[name=model_name_main]').val();
    var reason = $('[name=reason]').val();
    var company_name = $('[name=company_name]').val();
    mainQueryPager.model_name = model_name;
    mainQueryPager.reason = reason;
    mainQueryPager.company_name = company_name;
    // Re-render the table data based on the latest filter criteria
    initTable();
  });

  // Define the method for rendering pagination
  function renderPage(total) {
    // Call laypage.render() method to render the pagination structure
    laypage.render({
      elem: 'pageBox', // Pagination container's Id
      count: total, // Total data count
      limit: mainQueryPager.pagesize, // Number of records per page
      curr: mainQueryPager.pagenum, // Set the default selected page
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [10, 20, 50, 100],
      jump: function (obj, first) {
        mainQueryPager.pagenum = obj.curr;
        mainQueryPager.pagesize = obj.limit;
        // Fetch and render the data list based on the latest query parameters
        if (!first) {
          initTable();
        }
      }
    });
  }

  // Bind click event for the add recall button
  $("#addRecall").click(function () {
    var data = {};
    data.action = 'addRecall';
    data.request_type = 'post';
    // Call the utility method to open the popup
    open_form("#open_div", data, 'add car recall', '780px', '322px');
  });

  // Delegate click events for the edit button
  $('tbody').on('click', '.btn-edit', function (e) {
    var id = $(this).attr('data-id');
    var data = {};
    data.action = 'editRecall';
    data.request_type = 'put';
    // Make a request to get the corresponding recall data
    $.ajax({
      method: 'GET',
      url: '/api/cars/recall/?id=' + id,
      success: function (res) {
        data = res.data;
        data.action = 'edit';
        data.request_type = 'put';
        data.recall_id = id;
        data.carid = data.carid;
        data.model_company = data.company_name;
        data.model_color = data.color;
        data.model_name = data.model;
        open_form("#open_div", data, 'edit recall record', '780px', '322px');
      }
    });
  });

  // Bind click event for the delete button
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id');
    // Prompt the user for confirmation before deletion
    layer.confirm('Are you sure you want to delete?', { icon: 3, title: 'Confirm' }, function (index) {
      $.ajax({
        method: 'DELETE',
        url: '/api/cars/recall?id=' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('delete failed!');
          }
          layer.msg('delete successful!');
          initTable();
        },
        error: function (err) {
          return layer.msg('delete failed! ' + err.responseText);
        }
      });
    });
  });

  // Open car model select dialog
  var iCarModelModalIndex = 0;
  $('[name="model_name"]').on('click', function () {
    iCarModelModalIndex = layer.open({
      type: 1,
      title: 'select car model',
      content: $('#carModelModal'),
      area: ['900px', '600px'],
      success: function () {
        loadCarModelData();
      },
      cancel: function (index, layero) {
        $('#carModelModal').hide();
        return true;
      }
    });
  });

  // Load car model data
  var searchModelInfo = {
    pagenum: 1,
    pagesize: 5,
  };
  function loadCarModelData() {
    var model_name = $('#car_model_name_q').val();
    searchModelInfo.model_name = model_name;
    $.ajax({
      url: '/api/cars/model/list',
      type: 'GET',
      data: searchModelInfo,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('get car model list error');
        }
        renderPager4CarModel(res);
      },
      error: function (xhr, status, error) {
        layer.msg('get model list failed!');
      }
    });
  }

  // Render pager for car model
  function renderPager4CarModel(res) {
    var titles = res.titles;
    var cols = [{ type: 'checkbox' }];
    titles.forEach(item => {
      cols.push({ field: item, title: item });
    });
    // Render the table
    table.render({
      elem: '#car-model-table',
      data: res.data,
      cols: [cols],
      page: false,
      count: res.total,
    });

    // Render pagination
    laypage.render({
      elem: 'pageCarModelBox',
      page: true,
      count: res.total,
      limit: searchModelInfo.pagesize,
      curr: searchModelInfo.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 5, 10, 20, 50, 100],
      jump: function (obj, first) {
        if (!first) {
          loadCarModelData();
        }
      }
    });
  }

  // Confirm selection
  $('#cancel-btn').on('click', function (e) {
    layer.close(iCarModelModalIndex);
    $('#carModelModal').hide();
  });

  // Confirm car model selection
  $('#confirm-carModel-btn').on('click', function (e) {
    var checkedData = table.checkStatus('car-model-table').data;
    if (checkedData.length === 0) {
      layer.msg('please select one record!');
      return;
    }
    var carModel = checkedData[0];
    $('[name="model_name"]').val(carModel.Model);
    $('[name="carid"]').val(carModel.CarID);
    $('[name="model_official_price"]').val(carModel.price);
    $('[name="model_color"]').val(carModel.color);
    $('[name="model_company"]').val(carModel.company_name);
    layer.close(iCarModelModalIndex);
    $('#carModelModal').hide();
  });

  // Submit to add new recall
  form.on('submit(add_submit)', function (data) {
    var method = data.field.request_type;
    $.ajax({
      method: method,
      url: '/api/cars/recall',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data.field),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('add car recall failed!');
        }
        layer.msg('update car recall successful!');
        layer.closeAll();
        $('#open_div').hide();
        initTable();
      }
    });
  });

  // Search car model
  $('#search-car-model-btn').on('click', function () {
    loadCarModelData();
  });

});
