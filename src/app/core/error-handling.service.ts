import {Injectable} from "@angular/core";
import {Observable, of, tap} from "rxjs";
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class ErrorHandlingService {

  constructor(public toastController: ToastController) {
  }

  async presentToast(errorMessage: string) {
    const toast = await this.toastController.create({
      header: 'Error occurred',
      message: errorMessage,
      duration: 2000,
      color: 'danger',
      buttons: [
        {
          icon: 'bug',
          text: 'dismiss',
          role: "cancel"
        }
      ],
      position: "bottom"
    })
    await toast.present()
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (err: any): Observable<T> => {
      console.warn(`${operation} failed: ${err.message}`)
      return of(result as T).pipe(tap(() => this.presentToast(err.message)))
    }
  }

}
