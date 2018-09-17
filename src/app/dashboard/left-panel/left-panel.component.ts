import { Component, OnInit } from '@angular/core';
import { appConfig } from '../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.css']
})
export class LeftPanelComponent implements OnInit {
  leftmenuItems: any;
  ce: number = appConfig.USERS.CE;
  admin: number = appConfig.USERS.ADMIN;
  userType: number;
  admin_menu = [{
    'name': 'Dashboard',
    'icon': 'mdi-television',
    'link': 'home'
  }, {
    'name': 'New Jobs',
    'icon': 'mdi-briefcase-check',
    'link': 'new'
  },
  {
    'name': 'Progress Jobs',
    'icon': 'mdi-pause-circle',
    'link': 'underProgress'
  },
  {
    'name': 'Completed Jobs',
    'icon': 'mdi-checkbox-marked-circle',
    'link': 'completed'
  },
  {
    'name': 'Rejected Jobs',
    'icon': 'mdi-window-close',
    'link': 'rejected'
  }];
  ce_menu = [{
    'name': 'Dashboard',
    'icon': 'mdi-television',
    'link': 'home'
  }, {
    'name': 'New Jobs',
    'icon': 'mdi-briefcase-check',
    'link': 'new'
  },
  {
    'name': 'Completed Jobs',
    'icon': 'mdi-checkbox-marked-circle',
    'link': 'completed'
  }];
  constructor(private __router: Router) {
    const info = JSON.parse(localStorage.getItem('currentUser'))
    if (info != null) {
      this.userType = info.role_type
    } else {
      this.__router.navigateByUrl('/login')
    }

  }

  ngOnInit() {
    if (this.userType == this.admin) {
      this.leftmenuItems = this.admin_menu;
    }
    else if (this.userType == this.ce) {
      this.leftmenuItems = this.ce_menu
    }
  }

}
