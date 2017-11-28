/*import { Transfer } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

function uploadFile(name:string, path:string){

    let options = {
      fileKey: "file",
      fileName: name,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': name}
    };

    let fileTransfer = new Transfer();

    // Use the FileTransfer to upload the image

    return fileTransfer.upload(path, this.urlBase + "upload", options)
      .then(data => {
        console.log("message on filetransfer "+ JSON.stringify(data.response));

        data})
      .catch(this.handleError);

}*/