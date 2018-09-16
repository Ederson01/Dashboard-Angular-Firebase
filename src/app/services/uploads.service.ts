import { Injectable } from '@angular/core';

import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, QuerySnapshot } from 'angularfire2/firestore';

import { Observable, Subject, ReplaySubject, from, of, range, combineLatest } from 'rxjs';
import { tap, finalize, map, filter, switchMap, take } from 'rxjs/operators';

import { UploadEvent, UploadFile } from 'ngx-file-drop';

import { NotifyService } from '../core/notify.service';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  task: AngularFireUploadTask;

  uploads: any[];
  allPercentage: Observable<any>;
  files: AngularFirestoreCollection<any>;

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore, private notify: NotifyService) {
    this.files = this.afs.collection('midia', (ref) => ref.orderBy('time', 'asc'));
  }

  getData(): Observable<any[]> {
    return this.files.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  uploadInput(type: string, event: any) {
    this.uploads = [];
    const filelist = event;
    const allPercentage: Observable<number>[] = [];

    for(const file of filelist) {
      const id = this.afs.createId();
      const path = `${type}/${id}`;
      const ref = this.storage.ref(path);
      this.task = this.storage.upload(path, file);
      const _percentage$ = this.task.percentageChanges();
      allPercentage.push(_percentage$);

      const uploadTrack = {
        fileName: file.name,
        percentage: _percentage$
      }

      this.uploads.push(uploadTrack);

      const _t = this.task.then((f) => {
        return f.ref.getDownloadURL().then((url) => {
          return this.afs.collection('midia').add({
            name: file.name,
            size: f.metadata.size,
            type: f.metadata.contentType,
            path: path,
            url: url,
            time: new Date().toLocaleString()
          });
        })
      })
    }

    this.allPercentage = combineLatest(allPercentage).pipe(
      map((percentages) => {
        let result = 0;
        for (const percentage of percentages) {
          result = result + percentage;
        }
        return result / percentages.length;
      }),tap(console.log)
    );
  }

  updateFile(fileForm: any, id: string) {
    this.files.doc(id).update({
      title: fileForm.value.title,
      textAlter: fileForm.value.textAlter
    })
    .then(credential => {
      this.notify.update('Atualizado com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  deleteFile(path: string, id: string) {
    this.storage.ref(`${path}`).delete();
    return this.afs.doc(`midia/${id}`).delete()
    .then(credential => {
      this.notify.update('Excluido com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  private handleError(error: Error) {
    console.error(error);
    this.notify.update(error.message, 'error');
  }
}
