$(function () {
  var table = layui.table;
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // Define a filter to beautify the time display
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

  // Define a query parameter object for server requests
  var mainQueryPager = {
    pagenum: 1, // Page number, defaults to the first page
    pagesize: 10, // Number of items per page, defaults to 10
  }

  initTable();

  // Function to fetch car model list
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
        renderPage(res.total);
      }
    });
  }

  // Bind the submit event to the filter form
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    var model_name = $('[name=model_name]').val();
    var reason = $('[name=reason]').val();
    var company_name = $('[name=company_name]').val();
    mainQueryPager.model_name = model_name;
    mainQueryPager.reason = reason;
    mainQueryPager.company_name = company_name;
    initTable();
  });

  // Function to render pagination
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',
      count: total,
      limit: mainQueryPager.pagesize,
      curr: mainQueryPager.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [10, 20, 50, 100],
      jump: function (obj, first) {
        if (!first) {
          mainQueryPager.pagenum = obj.curr;
          mainQueryPager.pagesize = obj.limit;
          initTable();
        }
      }
    });
  }

  // Bind click event for the 'add recall' button
  $("#addRecall").click(function () {
    var data = {};
    data.action = 'addRecall';
    data.request_type = 'post';
    open_form("#open_div", data, 'add car recall', '780px', '322px');
  });

  // Delegate the edit button click event
  $('tbody').on('click', '.btn-edit', function () {
    var id = $(this).attr('data-id');
    var data = {};
    data.action = 'editRecall';
    data.request_type = 'put';
    $.ajax({
      method: 'GET',
      url: '/api/cars/recall/?id=' + id,
      success: function (res) {
        form.val('form-edit', res.data);
        open_form("#open_div", res.data, 'edit recall record', '780px', '322px');
      }
    });
  });

  // Delegate the delete button click event
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id');
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
        }
      });
    });
  });

  // Open car model selection dialog
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
      cancel: function () {
        $('#carModelModal').hide();
        return true;
      }
    });
  });

  // Load car model data
  var searchModelInfo = {
    pagenum: 1,
    pagesize: 5,
  }

  function loadCarModelData() {
    var model_name = $('#car_model_name_q').val();
    searchModelInfo.model_name = model_name;
    $.ajax({
      url: '/api/cars/model/list',
      type: 'GET',
      data: searchModelInfo,
      success: function (res) {
        renderPager4CarModel(res);
      },
      error: function () {
        layer.msg('get model list failed!');
      }
    });
  }

  // Render the car model pager
  function renderPager4CarModel(res) {
    var titles = res.titles;
    var cols = [{ type: 'checkbox' }];
    titles.forEach(item => {
      cols.push({ field: item, title: item });
    });
    table.render({
      elem: '#car-model-table',
      data: res.data,
      cols: [cols],
      page: true,
      count: res.total,
    });
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

  // Confirm the car model selection
  $('#confirm-carModel-btn').on('click', function () {
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

  // Submit to add new car recall
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
