import { Component, OnInit, Inject, Renderer, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { DOCUMENT } from '@angular/platform-browser';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HostListener } from '@angular/core';
import { ServiceService } from './shared/service.service';
// import { Spinkit } from 'ng-http-loader';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    // public spinkit = Spinkit;
    private _router: Subscription;
    @ViewChild(NavbarComponent) navbar: NavbarComponent;
    constructor(private renderer: Renderer2, private router: Router, @Inject(DOCUMENT)
     private document: any, private element: ElementRef, public location: Location, public service: ServiceService) {}
    ngOnInit() {
        this.service.init().subscribe((data: any) => {
            // this.settingsData = data;
            this.service.loader = false;
            console.log('App Component Started');
        });
        const navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            } else {
                window.document.activeElement.scrollTop = 0;
            }
            this.navbar.sidebarClose();
            // this.navbar.fbLogo = '../../../assets/img/SVG/fb_icon.svg';
            // this.navbar.twitterLogo = '../../../assets/img/SVG/twitter_icon.svg';
            // this.navbar.linkdInLogo = '../../../assets/img/SVG/linked_in_icon.svg';
        });
        // this.renderer.listen('window', 'scroll', (event) => {
        //     const number = window.scrollY;
            // console.log(number);
            // if (number > 50 || window.pageYOffset > 50) {
                // add logic
                // navbar.classList.remove('navbar-transparent');
                this.navbar.fbLogo = '../../../assets/img/SVG/fb_icon_dark.svg';
                this.navbar.twitterLogo = '../../../assets/img/SVG/twitter_icon_dark.svg';
                this.navbar.linkdInLogo = '../../../assets/img/SVG/linked_in_icon_dark.svg';
            // } else {
                // remove logic
            //     navbar.classList.add('navbar-transparent');
            //     this.navbar.fbLogo = '../../../assets/img/SVG/fb_icon.svg';
            //     this.navbar.twitterLogo = '../../../assets/img/SVG/twitter_icon.svg';
            //     this.navbar.linkdInLogo = '../../../assets/img/SVG/linked_in_icon.svg';
            // }
        // });
        const ua = window.navigator.userAgent;
        const trident = ua.indexOf('Trident/');
        let version = 0;
        if (trident > 0) {
            // IE 11 => return version number
            const rv = ua.indexOf('rv:');
            version = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        if (version) {
            const body = document.getElementsByTagName('body')[0];
            body.classList.add('ie-background');

        }

    }
    removeFooter() {
        const titlee = this.location.prepareExternalUrl(this.location.path());
        // const titlee_temp = titlee.slice( 1 );
        let titlee_temp = titlee.slice(1);
        titlee_temp = titlee_temp.split('?')[0];
        if (titlee_temp === 'success' || titlee_temp === 'login' ||
            titlee_temp === 'paymentMethod' || titlee_temp === 'subscribe' ||
            titlee_temp === 'paymentMethodSuccess' || titlee_temp === 'paymentSuccess' ||
            titlee_temp === 'signup') {
            return false;
        } else {
            return true;
        }
    }
}
