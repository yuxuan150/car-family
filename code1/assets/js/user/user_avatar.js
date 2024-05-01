$(function() {
  var layer = layui.layer

  // 1.1 Get the DOM element of the cropping area
  var $image = $('#image')
  // 1.2 Configuration options
  const options = {
    // Aspect ratio
    aspectRatio: 1,
    // Specify the preview area
    preview: '.img-preview'
  }

  // 1.3 Create the cropping area
  $image.cropper(options)

  // Bind a click event to the upload button
  $('#btnChooseImage').on('click', function() {
    $('#file').click()
  })

  // Bind a change event to the file select input
  $('#file').on('change', function(e) {
    // Get the file chosen by the user
    var filelist = e.target.files
    if (filelist.length === 0) {
      return layer.msg('Please select photos！')
    }

    // 1. Grab the file chosen by the user
    var file = e.target.files[0]
    // 2. Convert the file to a path
    var imgURL = URL.createObjectURL(file)
    // 3. Reinitialize the cropping area
    $image
      .cropper('destroy') // Destroy the old cropping area
      .attr('src', imgURL) // Re-set the image path
      .cropper(options) // Reinitialize the cropping area
  })

  // Bind a click event to the confirm button
  $('#btnUpload').on('click', function() {
    // 1. Get the user's cropped avatar
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // Create a Canvas
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // Convert the content of the Canvas to a base64 string
    // 2. Call the API to upload the avatar to the server
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('Failed to change photo！')
        }
        layer.msg('Photo changed successfully！')
        window.parent.getUserInfo()
      }
    })
  })
})
