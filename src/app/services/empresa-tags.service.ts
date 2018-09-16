import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotifyService } from '../core/notify.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaTagsService {
  empTagCollection: AngularFirestoreCollection<any>;
  empTagDocument:   AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore, private notify: NotifyService) {
    this.empTagCollection = this.afs.collection('tags');
  }

  getData(): Observable<any[]> {
    return this.empTagCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getDataTitle(): Observable<any[]> {
    return this.empTagCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          return a.payload.doc.data().title;
        });
      })
    );
  }

  getEmpTag(empTagSlug: string) {
    return this.afs.collection('tags', ref => ref.where('slug', '==', empTagSlug)).valueChanges();
  }

  getEmpTagID(id: string) {
    return this.afs.doc(`tags/${id}`).valueChanges();
  }

  salvarEmpTag(empTagForm: any) {
    const id = this.afs.createId();
    this.empTagCollection.doc(id).set(empTagForm.value)
    .then(credential => {
      this.notify.update('Salvo com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  updateEmpTag(empTagForm: any, id: string) {
    this.empTagCollection.doc(id).set(empTagForm.value)
    .then(credential => {
      this.notify.update('Atualizado com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  deleteEmpTag(id: string) {
    return this.afs.doc(`tags/${id}`).delete()
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
