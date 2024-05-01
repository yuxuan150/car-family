$(function () {
  var layer = layui.layer
  var form = layui.form

  initArtCateList()

  // Initialize the car model list
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/api/car_model/list',
      success: function (res) {
        var htmlStr = template('tpl-titles', res)
        $('thead').html(htmlStr)
        htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // Bind a click event to the "Add Category" button
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: 'Add Article Category',
      content: $('#dialog-add').html()
    })
  })

  // Delegate a submit event to the form-add form
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('Failed to add category!')
        }
        initArtCateList()
        layer.msg('Category added successfully!')
        // Close the corresponding popup based on the index
        layer.close(indexAdd)
      }
    })
  })

  // Delegate a click event to the btn-edit button
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // Open a layer to modify article category information
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: 'Edit Article Category',
      content: $('#dialog-edit').html()
    })

    var id = $(this).attr('data-id')
    // Make a request to get the corresponding category data
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })
  })

  // Delegate a submit event to the edit category form
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('Failed to update category data!')
        }
        layer.msg('Category data updated successfully!')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  // Delegate a click event to the delete button
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    // Prompt the user for confirmation before deletion
    layer.confirm('Are you sure you want to delete?', { icon: 3, title: 'Confirm' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('Failed to delete category!')
          }
          layer.msg('Category deleted successfully!')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })
})
