/*
 *
 * Authors  : Ashwin Vasani <akvasani@asu.edu>
 *            Ravinsingh Jain <rvjain@asu.edu>
 *            Sagar Kalburgi <skalburg@asu.edu>
 *
 * Description: Ajax APIs
 */

function ajaxPOST(url, postData, successCb, errorCb) {
    $.ajax({
        type: 'POST',
        url: url,
        data: postData,
        async : 'true',
        dataType : 'json',
        contentType : 'application/json',
        timeout : 5000,
        success: successCb,
        error: errorCb,
    }).done();
}

function ajaxGET(url, successCb, errorCb) {
    $.ajax({
        type: 'GET',
        url: url,
        async : 'true',
        dataType : 'json',
        contentType : 'application/json',
        timeout : 5000,
        success: successCb,
        error: errorCb,
    }).done();
}
