import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotifyService } from '../core/notify.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  empresasCollection: AngularFirestoreCollection<any>;
  empresaDocument:   AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore, private notify: NotifyService) {
    this.empresasCollection = this.afs.collection('empresas');
  }

  getData(): Observable<any[]> {
    return this.empresasCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getEmpresa(empresaSlug: string) {
    return this.afs.collection('empresas', ref => ref.where('slug', '==', empresaSlug)).valueChanges();
  }

  getEmpresaID(id: string) {
    return this.afs.doc(`empresas/${id}`).valueChanges();
  }

  salvarEmpresa(empresaForm: any) {
    const id = this.afs.createId();
    this.empresasCollection.doc(id).set(empresaForm.value)
    .then(credential => {
      this.notify.update('Salvo com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  updateEmpresa(empresaForm: any, id: string) {
    this.empresasCollection.doc(id).set(empresaForm.value)
    .then(credential => {
      this.notify.update('Atualizado com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  deleteEmpresa(id: string) {
    return this.afs.doc(`empresas/${id}`).delete()
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
