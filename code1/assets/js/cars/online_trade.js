$(function () {
  var table = layui.table;
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;

  // Define a query parameter object for server requests
  var mainSearchInf = {
    pagenum: 1, // Page number, defaults to the first page
    pagesize: 10, // Number of items per page, defaults to 10
  }

  initTable();

  // Function to fetch the car model list
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/api/cars/onlineTrade/',
      data: mainSearchInf,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('get list error');
        }
        var htmlStr = template('tpl-titles', res);
        $('thead').html(htmlStr);
        htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        // Call the pagination render function
        renderPage(res.total);
      }
    });
  }

  // Bind submit event to the filter form
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    var modelName = $('[name=sModel]').val();
    mainSearchInf.model_name = modelName;
    // Rerender the table based on new filter criteria
    initTable();
  });

  // Function to render pagination
  function renderPage(total) {
    laypage.render({
      elem: 'pageBox',
      count: total,
      even: true,
      limit: mainSearchInf.pagesize,
      curr: mainSearchInf.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [10, 20, 50, 100],
      jump: function (obj, first) {
        if (!first) {
          mainSearchInf.pagenum = obj.curr;
          mainSearchInf.pagesize = obj.limit;
          initTable();
        }
      }
    });
  }

  // Add a car for sale
  $("#add").click(function () {
    var data = {
      action: 'addTrade',
      request_type: 'post',
      flag: 'sale'
    };
    // Call the open_form utility to open the modal
    open_form("#open_div", data, 'add a new Car for sale', '680px', '282px');
  });

  var iCarModelModalIndex = 0;
  // Open car model selection dialog
  $('[name="model_name"]').on('click', function () {
    iCarModelModalIndex = layer.open({
      type: 1,
      title: 'select carModel',
      content: $('#carModelModal'),
      area: ['800px', '700px'],
      success: function () {
        loadCarModelData();
      },
      cancel: function (index, layero) {
        $('#carModelModal').hide();
        return true;
      }
    });
  });

  var searchModelInfo = {
    pagenum: 1,
    pagesize: 10,
  }

  // Load car model data
  function loadCarModelData() {
    $.ajax({
      url: '/api/cars/model/list',
      type: 'GET',
      data: searchModelInfo,
      success: function (data) {
        renderPager4CarModel(data);
      },
      error: function (xhr, status, error) {
        layer.msg('get model list failed!');
      }
    });
  }

  // Render car model pager
  function renderPager4CarModel(res) {
    var titles = res.titles;
    var cols = [{ type: 'checkbox' }];
    titles.forEach(item => {
      cols.push({ field: item, title: item });
    });
    // Render table
    table.render({
      elem: '#car-model-table',
      data: res.data,
      cols: [cols],
      page: true,
      count: res.total,
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

  // Submit to add new car for sale or buy
  form.on('submit(add_submit)', function (data) {
    var method = data.field.request_type;
    $.ajax({
      method: method,
      url: '/api/cars/onlineTrade',
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data.field),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('add car for sale failed!');
        }
        layer.msg('update car for sale ok!');
        layer.closeAll();
        $('#open_div').hide();
        initTable();
      }
    });
  });

  // Buy button click event
  $('tbody').on('click', '.btn-buy', function (e) {
    var id = $(this).attr('data-id');
    $.ajax({
      method: 'PUT',
      url: '/api/cars/onlineTrade?id=' + id,
      success: function (res) {
        layer.msg("congratulations, the car is yours!");
        initTable();
      }
    });
  });
});
