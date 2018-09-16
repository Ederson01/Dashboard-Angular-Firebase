import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotifyService } from '../core/notify.service';

@Injectable({
  providedIn: 'root'
})
export class CidadesService {

  cidadesCollection: AngularFirestoreCollection<any>;
  cidadeDocument:   AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore, private notify: NotifyService) {
    this.cidadesCollection = this.afs.collection('cidades');
  }

  getData(): Observable<any[]> {
    return this.cidadesCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getCidade(cidadeSlug: string) {
    return this.afs.collection('cidades', ref => ref.where('slug', '==', cidadeSlug)).valueChanges();
  }

  getCidadeID(id: string) {
    return this.afs.doc(`cidades/${id}`).valueChanges();
  }

  salvarCidade(cidadeForm: any) {
    const id = this.afs.createId();
    this.cidadesCollection.doc(id).set(cidadeForm.value)
    .then(credential => {
      this.notify.update('Salvo com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  updateCidade(cidadeForm: any, id: string) {
    this.cidadesCollection.doc(id).set(cidadeForm.value)
    .then(credential => {
      this.notify.update('Atualizado com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  deleteCidade(id: string) {
    return this.afs.doc(`cidades/${id}`).delete()
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
