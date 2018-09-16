import { Component, Inject, OnInit  } from '@angular/core';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadEvent, UploadFile } from 'ngx-file-drop';

import { UploadsService } from '../../../services/uploads.service';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss']
})
export class SelectImageComponent  implements OnInit {
  files: Observable<any[]>;
  fileList: any[];
  formImage: FormGroup;

  constructor(
    private uploadsService: UploadsService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SelectImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.files = this.uploadsService.getData();

    if(!this.data.type) {
      this.formImage = this.fb.group({
        midia: ''
      });
    } else {
      this.formImage = this.fb.group({
        listMidia: this.fb.array(this.data.content)
      });
    }
  }

  compareImages(file: any) {
    for(let element of this.data.content) {
      if(element.id == file.id) {
        return true;
      }
    }
  }

  startUpload(event) {
    this.uploadsService.uploadInput('files', event.files);
  }
  dropped(event: any) {
    let cont: number = 0;
    this.fileList = [];

    for (const droppedFile of event.files) {
      cont++;
      const fileEntry = droppedFile.fileEntry;

      if(event.files.length != cont) {
        fileEntry.file((file: File) => {
          this.fileList.push(file)
        });
      } else {
        fileEntry.file((file: File) => {
          this.fileList.push(file)
          this.uploadsService.uploadInput('files', this.fileList);
        });
      }
    }
  }

  setImages(file: any, isChecked: boolean) {
    const formImages = <FormArray>this.formImage.controls.listMidia;

    if(isChecked) {
      if(formImages.controls.findIndex(x => x.value.id == file.id) == -1) {
        formImages.push(new FormControl(file));
      }
    } else {
      let index = formImages.controls.findIndex(x => x.value.id == file.id)
      formImages.removeAt(index);
    }
  }

  closeDialog(): void {
    if(!this.data.type) {
      this.dialogRef.close(this.formImage.value.midia);
    } else if(this.data.type) {
      this.dialogRef.close(this.formImage.value.listMidia);
    }
  }
}
