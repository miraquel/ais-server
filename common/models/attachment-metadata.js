'use strict';
var CONTAINERS_URL = '/api/Attachments/';
var CONTAINERS = 'tugas';

module.exports = function(Attachmentmetadata) {

  Attachmentmetadata.upload = function (ctx,options,cb) {
    if(!options) options = {};
    ctx.req.params.Attachment = 'common';
    Attachmentmetadata.app.models.Attachment.upload(CONTAINERS,ctx.req,ctx.result,function (err,fileObj) {
      if(err) {
        cb(err);
      } else {
        // console.log(fileObj.files.file[0].name);
        var fileInfo = fileObj.files.file[0];
        Attachmentmetadata.create({
          name: fileInfo.name,
          type: fileInfo.type,
          originalFilename: fileInfo.originalFilename,
          container: fileInfo.container,
          url: CONTAINERS_URL+fileInfo.container+'/download/'+fileInfo.name
        },function (err,obj) {
          if (err !== null) {
            cb(err);
          } else {
            cb(null, obj);
          }
        });
      }
    });
  };

  Attachmentmetadata.remoteMethod(
    'upload',
    {
      description: 'Uploads a file',
      accepts: [
        { arg: 'ctx', type: 'object', http: { source:'context' } },
        { arg: 'container', type: 'object', http:{ source: 'query'} },
      ],
      returns: [
        { arg: 'error', type: 'object', root: true },
        { arg: 'fileObject', type: 'object', root: true }
      ],
      http: {verb: 'post'}
    }
  );

};
