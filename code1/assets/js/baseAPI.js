// Note: Every time $.get() or $.post() or $.ajax() is called,
// The ajaxPrefilter function will be called first

// const { debug } = require("console")
const baseUrl='http://127.0.0.1:3007'
// In this function, you can get the configuration object we provided for Ajax
$.ajaxPrefilter(function(options) {
    // Before initiating a real Ajax request, the root path of the request is unified and spliced
   
    options.url =  baseUrl + options.url
     
    // Unify it into a permissioned interface and set headers request headers
    if (options.url.indexOf('/my/') !== -1 ||   options.url.indexOf('/api/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // Global unified mount complete callback function
    options.complete = function(res) {
          console.log('Executed complete callback:')
         console.log(res)
       
        // In the complete callback function, you can use res.responseJSON to get the data returned by the server response
        if (res.responseJSON.status === 1 && res.responseJSON.message === 'Identity authentication failed!') {
            // 1. Force clear token
            localStorage.removeItem('token')
                // 2. Force jump to login page
            location.href = '/login.html'
        }
    }
})