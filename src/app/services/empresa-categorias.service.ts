import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NotifyService } from '../core/notify.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaCategoriasService {
  empCategoryCollection: AngularFirestoreCollection<any>;
  empCategoryDocument:   AngularFirestoreDocument<any>;

  constructor(private afs: AngularFirestore, private notify: NotifyService) {
    this.empCategoryCollection = this.afs.collection('categorias');
  }

  getData(): Observable<any[]> {
    return this.empCategoryCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          return { id: a.payload.doc.id, ...data };
        });
      })
    );
  }

  getEmpCategory(empCategorySlug: string) {
    return this.afs.collection('categorias', ref => ref.where('slug', '==', empCategorySlug)).valueChanges();
  }

  getEmpCategoryID(id: string) {
    return this.afs.doc(`categorias/${id}`).valueChanges();
  }

  salvarEmpCategory(empCategoryForm: any) {
    const id = this.afs.createId();
    this.empCategoryCollection.doc(id).set(empCategoryForm.value)
    .then(credential => {
      this.notify.update('Salvo com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  updateEmpCategory(empCategoryForm: any, id: string) {
    this.empCategoryCollection.doc(id).set(empCategoryForm.value)
    .then(credential => {
      this.notify.update('Atualizado com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  deleteEmpCategory(id: string) {
    return this.afs.doc(`categorias/${id}`).delete()
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
