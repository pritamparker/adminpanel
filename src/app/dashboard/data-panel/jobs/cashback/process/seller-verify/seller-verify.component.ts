import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../../../_services/user.service';
import { appConfig } from '../../../../../../app.config';
import { NgForm } from '@angular/forms';
import { NgxNotificationService } from 'ngx-notification';
import { ModalService } from '../../../../../../_services/modal.service';


@Component({
  selector: 'app-seller-verify',
  templateUrl: './seller-verify.component.html',
  styleUrls: ['./seller-verify.component.css']
})
export class SellerVerifyComponent implements OnInit {
  allSellers: any[] = [];
  sellers: any[] = [];
  @Input() jobDetails: any;
  blank: string = 'NA';
  cashbackId: number;
  documentDate: string;
  message: boolean = true;
  sellerType: any[] = [];
  sellerData: any;
  states: any[] = [];
  cities: any[] = [];
  showSellerForm: boolean = false;
  gstin: string;
  ceID: number;
  adminID: number;
  @Output() messageEvent = new EventEmitter<boolean>();
  constructor(private __modalservice: ModalService, private __router: Router, private __userService: UserService, private __ngxNotificationService: NgxNotificationService) {
  }

  ngOnInit() {
    this.getReferenceData();
  }
  ngOnChanges(changes) {
    console.log("from parent", this.jobDetails)
    if (this.jobDetails) {
      this.cashbackId = this.jobDetails.id;
      this.ceID = this.jobDetails.ce_id;
      this.adminID = this.jobDetails.admin_id;
      this.documentDate = this.jobDetails.products[0].document_date;
      this.getUserSellers();
      this.getCities(11);
    }

  }
  openModal(id: string) {
    this.__modalservice.open(id);
  }

  closeModal(id: string) {
    this.__modalservice.close(id);
  }
  getReferenceData() {
    this.__userService.getReferenceData()
      .subscribe(res => {
        // console.log("reference data", res)
        this.sellerType = res['data'].seller_types;
        this.states = res['data'].states;
        // console.log(this.states)
      })
  }
  getUserSellers() {
    this.__userService.getUserSeller(this.cashbackId)
      .subscribe(res => {
        this.allSellers = res['data'];
        console.log("sellers", res);
      })
  }
  selectSellerType(e) {
    this.sellers = [];
    if (e == 'offline') {
      this.sellers = this.allSellers['user_sellers'];
    } else if (e == 'online') {
      this.sellers = this.allSellers['online_sellers'];
    }
  }
  selectSeller(e) {
    console.log(e);
    // console.log(this.sellers);
    let selectedSeller = this.sellers.filter(seller => {
      return seller.id == e;
    })
    console.log(selectedSeller);
    this.gstin = selectedSeller[0]['gstin'];
    console.log(this.gstin)
  }
  verifySeller(res: NgForm) {
    console.log(res.value)
    if (!res.value.document_number) {
      this.__ngxNotificationService.sendMessage("Document No. is mandatory", 'dark', 'bottom-right');
    } else {
      let time = res.value.time || '00:00:00';
      let date = this.documentDate.split("T")[0] + "T" + time + "+05:30";
      console.log(date);
      let seller_id = this.jobDetails.seller_id || res.value.seller_id;
      let request_data = { 'seller_id': seller_id, 'document_number': res.value.document_number, 'document_date': date, 'gstin': res.value.gstin };
      if (request_data.seller_id == undefined) {
        delete request_data['seller_id'];
      }
      this.__userService.verifySeller(request_data, this.cashbackId)
        .subscribe((res) => {
          console.log('response after seller veriify', res)
          this.__ngxNotificationService.sendMessage('Seller Verified', 'dark', 'bottom-right');
          this.sellerData = res['data'].sellers[0];
          if (this.sellerData.state_id) {
            this.selectState(this.sellerData.state_id)
          }
          this.showSellerForm = true;
        }, (err) => {
          console.log("error", err)
          if (err.status == 409) {
            this.__ngxNotificationService.sendMessage("GSTIN is invalid JOB Discarded", 'dark', 'bottom-right');
          } else {
            this.__ngxNotificationService.sendMessage(err.error.reason, 'dark', 'bottom-right');
          }
        })
    }

  }
  updateSeller(res: NgForm) {
    console.log(res.value);
    this.messageEvent.emit(this.message)
    this.showSellerForm = false;
  }
  backToVerifySeller() {
    this.showSellerForm = false;

  }
  sellerMismatch() {
    this.__userService.discardJOB([{ 'id': this.cashbackId, 'reason_id': 1 }])
      .subscribe(res => {
        // console.log("res", res);
        this.__ngxNotificationService.sendMessage('Job discarded due to seller mismatch moved to new job', 'dark', 'bottom-right');
        this.__router.navigate(['new'])
      }, err => {
        console.log("error", err);
      })
  }
  public selectState(stateID) {
    console.log(stateID);
    let selectedState = this.states.filter(state => {
      return state.id == stateID
    })
    this.cities = selectedState[0].cities;
    console.log("selected state si", selectedState);
  }
  public getCities(stateID: number) {
    this.__userService.getCities(stateID)
      .subscribe(res => {
        // console.log("cities", res);
        this.cities = res['data'].cities;
      }, err => {
        console.log(err);
      })
  }
  assignAdmin(res: NgForm) {
    console.log(res.value)
    this.__userService.assignCashBackJobAdmin({ 'id': this.cashbackId, 'admin_id': this.adminID, 'ce_id': this.ceID, 'comments': res.value.comments })
      .subscribe(res => {
        this.__ngxNotificationService.sendMessage('Assigned to Admin !!', 'dark', 'bottom-right');
      }, err => {
        console.log(err);
      })

  }
}
