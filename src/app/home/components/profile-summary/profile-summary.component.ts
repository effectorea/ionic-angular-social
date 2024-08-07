import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {BehaviorSubject, from, Observable, of, Subscription, switchMap, take} from "rxjs";
import {Role} from "../../../auth/models/user.model";
import {FormControl, FormGroup} from "@angular/forms";
import {fromBuffer} from "file-type/core";
import {FileTypeResult} from "file-type/core";
import {BannerColors, BannerColorService} from "../../services/banner-color.service";

type validFileExtension = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg'

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent  implements OnInit, OnDestroy {

  form: FormGroup;

  obs$: Subscription;

  validFileExtensions: validFileExtension[] = ['png','jpg','jpeg']
  validMimeTypes: validMimeType[] = ['image/png','image/jpg','image/jpeg']

  userFullImagePath: string;
  private userImagePathSubscription: Subscription;
  fullName$ = new BehaviorSubject<string>(null)
  fullName: string = ''

  constructor(private authService: AuthService, public bannerColorService: BannerColorService) { }

  ngOnInit() {
    this.form = new FormGroup({
      file: new FormControl(null)
    })
    this.obs$ = this.authService.userRole.subscribe((role: Role) => {
      console.log('ROLE IS HERE >>>', role);
      this.bannerColorService.bannerColors = this.bannerColorService.getBannerColors(role)
    })

    this.authService.userFullName.pipe(take(1)).subscribe((userFullName: string) => {
      this.fullName = userFullName
      this.fullName$.next(userFullName)
    })
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
      this.userFullImagePath = fullImagePath
    })
  }

  ngOnDestroy() {
    this.obs$.unsubscribe()
    this.userImagePathSubscription.unsubscribe()
  }

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    from(file.arrayBuffer()).pipe(
      switchMap((buffer: Buffer) => {
        return from(fromBuffer(buffer)).pipe(
          switchMap((fileTypeResult: FileTypeResult) => {
            if (!fileTypeResult) {
              console.log({error: 'File format not supported'})
              return of();
            }
            const { ext, mime } = fileTypeResult;
            const isFileTypeLegit = this.validFileExtensions.includes(ext as any)
            const isMimeTypeLegit = this.validMimeTypes.includes(mime as any)
            const isFileLegit = isFileTypeLegit && isMimeTypeLegit
            if (!isFileLegit) {
              console.log({error: 'File format does not match file extension'})
              return of();
            }
            return this.authService.uploadUserImage(formData as FormData)
          })
        )
      })
    ).subscribe()
    this.form.reset()
  }

}
