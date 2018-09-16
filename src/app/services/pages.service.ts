import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotifyService } from '../core/notify.service';

@Injectable({
  providedIn: 'root'
})
export class PagesService {
  private pagesCollection: AngularFirestoreCollection<any>;
  private page: AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore, private notify: NotifyService) {
    this.pagesCollection = afs.collection('pages');
  }

  getPage(pageName: string) {
    return this.afs.doc<any>(`pages/${pageName}`).valueChanges();
  }

  salvarPages(pageName: string, pageForm: any) {
    this.pagesCollection.doc(pageName).set(pageForm.value)
    .then(credential => {
      this.notify.update('Salvo com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  private handleError(error: Error) {
    console.error(error);
    this.notify.update(error.message, 'error');
  }
}
