/*import { Injectable } from '@angular/core';
//import {LocalStorageService} from "./localStorage.service";
import {Platform} from "ionic-angular";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
//import {API} from "./api";


declare let cordova: any;

@Injectable()
export class ImageAdquistionService {


  constructor(//private storage: LocalStorageService,
              public platform: Platform,
              //private api:API
            ) {
  }


  getANewImage(src):Promise<any>{
    let options = {
      quality: 60,
      sourceType: src,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };


    return Camera.getPicture(options).then((imageData) => {

      // Special handling for Android library
      if (this.platform.is('android') && src === Camera.PictureSourceType.PHOTOLIBRARY) {


        return FilePath.resolveNativePath(imageData)
          .then(filePath => {

              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));

                return this.storage.getUserInfo().then(user => {

                    return this.copyFileToLocalDir(correctPath, currentName, this.createFileName(user._id)).then(copyResult => copyResult);


            });

            }, (error) => {
              // Handle error
              return {success: false, message: error.message};
            }
          );
      } else {

        let currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        let correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);

        return this.storage.getUserInfo().then(user => {

            return this.copyFileToLocalDir(correctPath, currentName, this.createFileName(user._id)).then(copyResult => copyResult);

        });
      }
    }, (error) => {
        // Handle error
        return {success: false, message: error.message};
      }
    )
  }
  // Create a new name for the image
  createFileName(id:string) {
    let d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";

      newFileName = id + "_" + newFileName;
      return newFileName;


  }

// Copy the image to a local folder
  copyFileToLocalDir(namePath, currentName, newFileName):Promise<any> {

    return File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {

      console.log("response of copy " + JSON.stringify(success));
      return {success: true, fileName: newFileName, filePath: this.pathForImage(newFileName)};

    }, error => {
      this.api.logIonicView("Error while storing file " + error.message);

      return {success: false, message: error.message};
    });
  }

  // Always get the accurate path to the apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

}*/