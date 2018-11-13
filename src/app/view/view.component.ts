import { Component, OnInit } from '@angular/core';
import {ApiService} from '../shared/api.service';
import {element} from 'protractor';
import { DomSanitizer } from '@angular/platform-browser';
import {Router} from '@angular/router';
import {setInterval} from "timers";
import {Observable} from "rxjs/Rx";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  private step: number;
  private search: string;
  private load: boolean;
  private gArticle: string;
  private vArticle: any = {};
  private key = 'none';
  private fuzzy: any;

  constructor(private apiService: ApiService, private _sanitizer: DomSanitizer, private router: Router) {
    this.fuzzy = require('fuzzy');
  }

  public polCategories = ['All', 'President', 'Prime Minister', 'Parliament', 'Sri Lanka'];
  public sportsCategories = ['All', 'Cricket', 'Foot Ball', 'Olympic'];
  public crimeCategories = ['All', 'Gun', 'CID'];
  public eduCategories = ['All', 'Technology', 'Exams'];

  public allArticles: any;
  public viewArticles: any;
  public catArticles: any[] = [];
  public Error: string;
  public category: string;
  public disable = false;
  public headLine:string= 'Waiting..';
  public count:number= 0;

  public setUrl(url: string) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.setCategory('talk.home');
    this.step = 1;
    if (window.sessionStorage.getItem('token')) {
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  loginPage() {
    this.router.navigate(['/login']);
  }

  setCategory(cat: string) {
    this.catArticles = [];
    this.viewArticles = [];
    this.load = true;
    this.category = cat;
    // http://35.237.151.220:8081/api/processed_news
    // https://obscure-citadel-80764.herokuapp.com/api/articles
    this.apiService.get('http://35.237.151.220:8081/api/processed_news')
      .subscribe((data: any) => {
        this.load = false;
        console.log(data._body);
        // this.category = data._body[0].category;
        this.allArticles = JSON.parse(data._body);
        // this.allArticles = this.allTest;
        // JSON.parse(this.allTest);
        this.catArticles = [];
        if (cat === 'talk.home') {
           this.allArticles.forEach((dataArticle) => {
             if (dataArticle['video-link'] || dataArticle['media-link']) {
               this.catArticles.push(dataArticle)
             }
           });
        } else {
          this.allArticles.forEach((dataArticle) => {
            // console.log(dataArticle);
            console.log(dataArticle.category.category);

            if (cat === 'rec' && dataArticle.category.category === 'rec.sport.cricket' ) {
               console.log('rec');
               this.catArticles.push(dataArticle);
            }
            if(parseFloat(dataArticle.category.pob) > 0.1 && (dataArticle['video-link']  || dataArticle['media-link']) ){
            if (cat === 'tec' && (dataArticle.category.category === 'talk.tech' || dataArticle.category.category === 'sci.space' ||  dataArticle.category.category === 'sci.health'
                || dataArticle.category.category === 'sci.electronics' || dataArticle.category.category === 'comp.graphics' || dataArticle.category.category === 'sci.crypt')) {
               console.log('tec');
               this.catArticles.push(dataArticle);

            }else if (cat === 'pol' && (dataArticle.category.category === 'talk.politics.srilanka' || dataArticle.category.category === 'talks.politics.srilanka') ) {
               console.log('pol');
              this.catArticles.push(dataArticle);

            }else if (cat === 'edu' && dataArticle.category.category === 'edu.education' ) {
               console.log('edu');
               this.catArticles.push(dataArticle);

            }else if (cat === 'soc' && dataArticle.category.category === 'soc.for') {
              console.log('soc');
              this.catArticles.push(dataArticle);

            }else if (cat === 'accident' && (dataArticle.category.category === 'soc.accident' ) ) {
              console.log('accident');
              this.catArticles.push(dataArticle);

            }else if (cat === 'med' && (dataArticle.category.category === 'talk.medical' || dataArticle.category.category === 'talk.health') ) {
                  console.log('med');
                 this.catArticles.push(dataArticle);

            }else if (cat === 'cri' && (dataArticle.category.category === 'cri.crime' || dataArticle.category.category === 'cri.criminal.guns') ) {
                 console.log('cri');
                 this.catArticles.push(dataArticle);

            // } else if (dataArticle.category.category && cat === dataArticle.category.category.toString().split('.')[0]) {
            //   console.log('another');
            //   this.catArticles.push(dataArticle);

            }
            this.catArticles = this.removeDuplicates(this.catArticles, 'heading');
            }
          });
        }
        this.viewArticles = this.catArticles.reverse();
        this.headLineView();
      }, (err) => {
        console.log(err);
        this.Error = 'Server Error ! try again later.';
        setTimeout(() => {
          this.Error = '';
        }, 3000);
      });
  }

  removeDuplicates(originalArray, prop) {
    let newArray = [];
    let lookupObject  = {};

    for (let i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (let i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}
  // setCategory(cat: string) {
  //   this.getArticle();
  //   this.category = cat;
  //   this.catArticles = [];
  //   this.allArticles.forEach((dataArticle) => {
  //     console.log(dataArticle);
  //     console.log(dataArticle.category.category);
  //     if (cat === dataArticle.category.category) {
  //       this.catArticles.push(dataArticle);
  //     }
  //
  //   });
  // }
  public viewArticle(article: any) {
    this.vArticle = article;
  }

  public change(num: number) {
    this.step = num;
  }

  public setArticle(text: string) {
    this.gArticle = text;
  }

  public reset() {
    this.vArticle = {};
    const iframe = document.getElementById('ifameId');
    // const iWindow = (<HTMLIFrameElement> iframe).contentWindow;
    // iWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
    console.log('stop');
  }

  public searchBatch(key: any) {
    console.log(key.value);
    if (key.value === '' || key.value === '') {
      this.viewArticles = this.catArticles;
    } else {
      this.key = key.value;
      this.viewArticles = [];
      this.viewArticles = this.catArticles.filter(word =>
        ('ab ' + word.content.toString()).toUpperCase().indexOf(this.key.toUpperCase()) > 1);
      // console.log(this.allArticles.filter(word => word.subject.toString().toUpperCase().indexOf(this.key.toUpperCase()) >= 1 ));
      //
      //  const options = {
      //    pre: '<'
      //    , post: '>'
      //    , extract: function (el) {
      //      return el.subject;
      //    }
      //  };
      // let results = this.fuzzy.filter(this.key, this.catArticles, options);
      // let matches = results.map(function(el) { return el.string; });
      // console.log(matches);
    }
  }

  public subSearch(key: string) {

    if (key === 'All') {
      this.viewArticles = this.catArticles;
    } else {
      this.viewArticles = [];
      this.viewArticles = this.catArticles.filter(word => ('ab ' + word.content.toString()).toUpperCase().indexOf(key.toUpperCase()) > 1);
      // console.log(this.allArticles.filter(word => word.subje
    }
  }

  public headLineView(){
              let max = this.catArticles.length;
              this.count = 0 ;
              Observable.interval(10000).subscribe((val) =>
              {
              if(this.count > max - 1){
                  this.count = 0
                }else{
                  this.count++;
                }
                if( this.catArticles[this.count] && undefined !== this.catArticles[this.count]['heading'] ) {
                  this.headLine = this.catArticles[this.count]['heading'] === undefined ? "waiting" : this.catArticles[this.count]['heading'];
                }
              });
  }
  public searchByHeadline(){

    this.viewArticles = this.catArticles.filter(word => ('ab ' + word.heading.toString()).toUpperCase().indexOf(this.headLine.toUpperCase()) > 1);

  }


}
