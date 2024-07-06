import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {PostService} from "../../services/post.service";
import {IonInfiniteScroll, ModalController, ModalOptions} from "@ionic/angular";
import {Post} from "../../models/Post";
import {BehaviorSubject, Subscription, take} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";
import {ModalComponent} from "../start-post/modal/modal.component";
import {User} from "../../../auth/models/user.model";

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent  implements OnInit, OnChanges, OnDestroy {
  @Input() postBody?: string;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  queryParams: string;
  allPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;
  userId$ = new BehaviorSubject<number>(null)
  private userSubscription: Subscription

  constructor(private postService: PostService, public authService: AuthService, public modalController: ModalController) { }

  ngOnInit() {
    this.userSubscription = this.authService.userStream.subscribe((user: User) => {
      this.allPosts.forEach((post: Post, index) => {
        if (user?.imagePath && user.id === post.author.id) {
          this.allPosts[index]['fullImagePath'] = this.authService.getFullImagePath(user.imagePath)
        }
      })
      }
    )

    this.loadPosts(false)
    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      if (!userId) this.userId$.next(null)
      this.userId$.next(userId)
    })
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const postBody = simpleChanges['postBody'].currentValue
    if (!postBody) return
    this.postService.createPost(postBody).subscribe((post: Post) => {
      this.authService.userFullImagePath.pipe(take(1)).subscribe((fullImagePath) => {
        post['fullImagePath'] = fullImagePath
        this.allPosts.unshift(post)
      })
    })
  }

  loadPosts(isInitialLoad: boolean, event?: any) {
    if (this.skipPosts === 20) {
      event.target.disabled = true
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`
    this.postService.getSelectedPosts(this.queryParams).subscribe((res: Post[]) => {
      res.map((el) => {
        const doesAuthorHaveImage = !!el.author.imagePath
        let fullImagePath = this.authService.getDefaultFullImagePath()
        if (doesAuthorHaveImage) fullImagePath = this.authService.getFullImagePath(el.author.imagePath)
        el['fullImagePath'] = fullImagePath
        this.allPosts.push(el)
      })
      if (isInitialLoad) event.target.complete()
      this.skipPosts = this.skipPosts + 5
    }, error => {
      console.log(error);
    })
  }

  loadData(event?: any) {
    this.loadPosts(true, event)
  }

  async presentEditModal(post: Post) {
    console.log(post);
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-second-custom',
      componentProps: {
        post: post
      }
    } as ModalOptions)
    await modal.present()
    const {data} = await modal.onDidDismiss()
    console.log('This is the edited data >>>', data);
    if (!data) return
    const changedBody = data.post.body.trim()
    this.postService.updatePost(post.id, changedBody).subscribe((editRes) => {
      console.log('Result of editing', editRes);
      if (!editRes) return
      // this.allPosts = this.allPosts.map((p: Post) => {
      //   if (p.id === post.id) {
      //     p.body = changedBody
      //   }
      //   return p
      // })
      const postIndex = this.allPosts.findIndex((p: Post) => p.id === post.id)
      this.allPosts[postIndex].body = changedBody
    })
  }

  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe(deletedPost => {
      console.log(deletedPost);
      if (!deletedPost) return
      this.allPosts = this.allPosts.filter((post: Post) => post.id !== postId)
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }

}
