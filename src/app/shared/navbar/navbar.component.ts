import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private toggleButton: any;
    private sidebarVisible: boolean;
    fbLogo: any;
    twitterLogo: any;
    linkdInLogo: any;
    constructor(public location: Location, private element: ElementRef) {
        this.sidebarVisible = false;
        this.fbLogo = '../../../assets/img/SVG/fb_icon_dark.svg';
        this.fbLogo = '../../../assets/img/SVG/twitter_icon_dark.svg';
        this.fbLogo = '../../../assets/img/SVG/linked_in_icon_dark.svg';
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    }
    scrollIntoView(anchorHash) {
        setTimeout(() => {
            const anchor = document.getElementById(anchorHash);
            if (anchor) {
                anchor.focus();
                anchor.scrollIntoView();
            }
        });
    }
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        // console.log(toggleButton, 'toggle');

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        // console.log(html);
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    isHome() {
        const titlee = this.location.prepareExternalUrl(this.location.path());

        if (titlee === '/home') {
            return true;
        } else {
            return false;
        }
    }
    isDocumentation() {
        const titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '/documentation') {
            return true;
        } else {
            return false;
        }
    }
}
