import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { firebase } from '@firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { NotifyService } from './notify.service';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter, finalize } from 'rxjs/operators';

import { UploadsService } from '../services/uploads.service';

interface User {
  uid: string;
  email?: string | null;
  nome?: string;
  sobrenome?: string;
  telefone?: string;
  photoURL?: string;
}

@Injectable()
export class AuthService {
  user: Observable<User | null>;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  path: any;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notify: NotifyService,
    private storage: AngularFireStorage,
    private uploadsService: UploadsService
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  //// Email/Password Auth ////

  userCreate(userForm: any) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(userForm.value.email, userForm.value.password)
      .then(credential => {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${credential.user.uid}`);

        const data: User = {
          uid: credential.user.uid,
          email: userForm.value.email || null,
          nome: userForm.value.nome || 'Sem nome',
          sobrenome: userForm.value.sobrenome || null,
          telefone: userForm.value.telefone || null,
          photoURL: this.path || 'users/no-image.png'
        };

        this.notify.update('Usuário Criado com sucesso!', 'success');

        return userRef.set(data);
      })
      .catch(error => this.handleError(error));
  }

  emailLogin(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.router.navigate(['admin']);
        return this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error)
    );
  }

  // Sends email allowing user to reset password
  /*resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth
      .sendPasswordResetEmail(email)
      .then(() => this.notify.update('Password update email sent', 'info'))
      .catch(error => this.handleError(error));
  }*/

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['login']);
    });
  }

  updateUser(userForm: any, id: string) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${id}`
    );
    userRef.update(userForm.value)
    .then(credential => {
      this.notify.update('Atualizado com Sucesso!', 'success');
    })
    .catch(error => this.handleError(error));
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );
    userRef.valueChanges().subscribe(res=>{
      if(!res) {
        const data: User = {
          uid: user.uid,
          email: user.email,
          nome: 'Sem Nome',
          sobrenome: '',
          telefone: '',
          photoURL: ''
        };

        return userRef.set(data);
      }
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.notify.update(error.message, 'error');
  }
}
