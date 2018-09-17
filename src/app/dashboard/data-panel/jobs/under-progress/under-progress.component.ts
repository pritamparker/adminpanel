import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../_services/user.service';
import { appConfig } from '../../../../app.config';
import { NgxNotificationService } from 'ngx-notification';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../../../_services/modal.service';

@Component({
  selector: 'app-under-progress',
  templateUrl: './under-progress.component.html',
  styleUrls: ['./under-progress.component.css']
})
export class UnderProgressComponent implements OnInit {
  under_progress: number = appConfig.JOB_STATUS.UNDER_PROGRESS;
  ce: number = appConfig.USERS.CE;
  bills: any;
  assignCEView: string = 'assignCEView';
  users: any;
  jobId: number;
  userType: any;
  rawImageArray: any[] = [];
  imageArray: any[] = [];
  images: any[] = [];
  imageArrayLength: number;
  imageIndex: number = 0;
  documentDate: string;
  amount: string;
  showBillPopup: boolean = false;
  imageUrl: string = appConfig.apiUrl;
  selectedIds: any = [];
  isSelected: boolean = false;
  loaderUrl: string = '../../../assets/images/loader.gif';
  showLoader: string = 'showLoader';
  imagerotation: number = 0;
  constructor(private __router: Router, private __modalservice: ModalService, private __ngxNotificationService: NgxNotificationService, private __userservice: UserService) {
    const info = JSON.parse(localStorage.getItem('currentUser'));
    if (info != null) {
      this.userType = info.role_type
    } else {
      this.__router.navigateByUrl('/login')
    }
  }

  ngOnInit() {
    if (this.userType == appConfig.USERS.ADMIN || this.userType == appConfig.USERS.SUPERADMIN) {
      this.getAdminJobList();
    } else if (this.userType == appConfig.USERS.CE) {
      this.getCEJobList();
    }
  }
  openModal(id: string) {
    this.__modalservice.open(id);
  }

  closeModal(id: string) {
    this.__modalservice.close(id);
  }
  close($event) {
    if ($event == null) {
      this.showBillPopup = false;
    }
  }
  prevImage() {
    if (this.imageIndex > 0) {
      this.imageIndex = this.imageIndex - 1;
    }
  }
  nextImage() {
    if (this.imageIndex < this.imageArrayLength - 1) {
      this.imageIndex = this.imageIndex + 1;
    }
  }
  rotate() {
    this.imagerotation = this.imagerotation + 90;
  }
  public singleCheck(req: number) {
    if (this.selectedIds.includes(req)) {
      let _index = this.selectedIds.indexOf(req);
      if (_index > -1) {
        this.selectedIds.splice(_index, 1);
      }
    } else {
      this.selectedIds.push(req);
    }
    if (this.selectedIds.length == this.bills.data.length) {
      this.isSelected = true;
    }
    if (this.selectedIds.length == 0) {
      this.isSelected = false;
    }
    console.log(this.selectedIds)
  }
  public checkAll() {
    this.isSelected = !this.isSelected;
    this
    if (this.selectedIds.length != this.bills.data.length) {
      this.selectedIds = [];
      for (let bill of this.bills.data) {
        this.selectedIds.push(bill.id);
      }
      this.isSelected = true;
    } else {
      this.selectedIds = [];
      this.isSelected = false;
    }
    console.log(this.selectedIds)
  }
  assignCEButtonClick(req) {
    this.jobId = req;
    this[this.assignCEView + req] = !this[this.assignCEView + req];
    this.getCEList()
  }
  getAdminJobList() {
    this.__userservice.getAdminJobList(this.under_progress)
      .subscribe(bill => {
        console.log(bill)
        this.bills = bill;
      });
  }
  getCEJobList() {
    this.__userservice.getCEJobList(this.under_progress)
      .subscribe(bill => {
        console.log(bill)
        this.bills = bill;
      });
  }
  getCEList() {
    this.__userservice.getUserList(this.ce) // 4 for _ce refer to api doc
      .subscribe(users => {
        this.users = users['data'];
        console.log(this.users, "users");
      });
  }
  assignCE(res: NgForm) {
    this.__userservice.assignCashBackJobCE([{ 'id': this.jobId, 'ce_id': Number(res.value.ce_id), 'comments': res.value.comments }])
      .subscribe(res => {
        console.log("res", res);
        this.__ngxNotificationService.sendMessage('Assign Successfull', 'dark', 'bottom-right');
        this[this.assignCEView + this.jobId] = !this[this.assignCEView + this.jobId];
        this.getAdminJobList();
      }, err => {
        console.log("error", err);
      })
  }
  multiAssignCE(res: NgForm) {
    console.log(res.value);
    console.log(this.selectedIds)
    let assignJobsArray = []
    this.selectedIds.map(id => {
      return assignJobsArray.push({ 'id': id, 'ce_id': Number(res.value.ce_id), 'comments': res.value.comments })
    })
    this.__userservice.assignCashBackJobCE(assignJobsArray)
      .subscribe(res => {
        console.log("res", res);
        this.__ngxNotificationService.sendMessage('Approve Successfull', 'dark', 'bottom-right');
        this.getAdminJobList();
      }, err => {
        console.log("error", err);
      })
  }
  approveCashback(jobID: number) {
    this[this.showLoader + jobID] = !this[this.showLoader + jobID];
    this.__userservice.approveCashback([{ id: jobID }])
      .subscribe(res => {
        console.log("res", res);
        this.__ngxNotificationService.sendMessage('Approve Successfull', 'dark', 'bottom-right');
        this.getAdminJobList();
        this[this.showLoader + jobID] = !this[this.showLoader + jobID];
      }, err => {
        console.log("error", err);
        this[this.showLoader + jobID] = !this[this.showLoader + jobID];
      })
  }
  public showBill(req) {
    this.showBillPopup = false;
    this.documentDate = req.products.document_date;
    this.amount = req.products.purchase_cost;
    this.images = [];
    let count = 0;
    this.rawImageArray = req.copies;
    if (this.rawImageArray.length == 0) {
      alert("There is no image in this bill please contact Admin")
    }
    for (let i of this.rawImageArray) {
      if (i.status_type != 9) {
        this.imageArray.push(i);
        this.images.push(this.imageUrl + 'api' + i.copyUrl)
        count += 1;
      }
    }
    this.imageArrayLength = count;
    this.showBillPopup = true;
  }
  public multiApprove() {
    console.log(this.selectedIds)
    if (this.selectedIds.length == 0) {
      this.__ngxNotificationService.sendMessage('Please select at least one job', 'dark', 'bottom-right');
    } else {
      let approveJobsArray = []
      this.selectedIds.map(id => {
        return approveJobsArray.push({ 'id': id })
      })
      this.__userservice.approveCashback(approveJobsArray)
        .subscribe(res => {
          console.log("res", res);
          this.__ngxNotificationService.sendMessage('Approve Successfull', 'dark', 'bottom-right');
          this.getAdminJobList();
        }, err => {
          console.log("error", err);
        })
    }
  }
}
