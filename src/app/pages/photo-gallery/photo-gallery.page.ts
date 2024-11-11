import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,IonMenuButton,IonButton, IonGrid, IonRow, IonCol, IonImg
 } from '@ionic/angular/standalone';
 
import { PhotoService, UserPhoto } from 'src/app/services/photo.service';
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { ScreenReader } from '@capacitor/screen-reader';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.page.html',
  styleUrls: ['./photo-gallery.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonMenuButton, IonButtons, IonToolbar, IonButton, 
    IonGrid, IonRow, IonCol, IonImg, CommonModule, FormsModule]
})
export class PhotoGalleryPage implements OnInit {

  barcodeResult: string = '';
  motionEvent: any;
  constructor(
    public photoService: PhotoService
  ) {
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
  
  async showActionSheet(photo: UserPhoto, position: number) {

    const result = await ActionSheet.showActions({
      title: 'Photo Options',
      message: 'Select an option to perform',
      options: [
        {
          title: 'Delete',
          style: ActionSheetButtonStyle.Destructive,
        },
        {
          title: 'Cancel',
        },
      ],
    });

    if (result.index === 0) {
      // Delete action
      this.photoService.deletePicture(photo, position);
    }
  
    console.log('Action Sheet result:', result);
  }
  

  // ngOnInit() {
  //   console.log('Opening Photo Gallery Page')
  // }
  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  async startScan() {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL
    });
    this.barcodeResult = result.ScanResult;
  }

  async checkScreenReader() {
    const isEnabled = await ScreenReader.isEnabled();
    console.log(`Screen Reader is enabled: ${isEnabled}`);
  }
  
  async toggleScreenReader() {
    ScreenReader.addListener('stateChange', ({ value }) => {
      console.log(`Screen reader is now ${value ? 'on' : 'off'}`);
    });
  }

  sayHello = async () => {
    await ScreenReader.speak({ value: 'Investing in crypto can be a great way to diversify your portfolio and potentially earn high returns.' });
  };


}
