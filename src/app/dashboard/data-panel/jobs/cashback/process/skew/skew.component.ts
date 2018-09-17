import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../../../../_services/user.service';
import { NgxNotificationService } from 'ngx-notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skew',
  templateUrl: './skew.component.html',
  styleUrls: ['./skew.component.css']
})
export class SkewComponent implements OnInit {
  @Input() jobDetails: any;
  skus: any;
  skuMeasurement: any;
  skuData: any = [];
  skuItems: any = [];
  skuIds: any = [];
  sellerId: number;
  jobId: number;
  constructor(private __router: Router, private __userService: UserService, private __ngxNotificationService: NgxNotificationService) { }

  ngOnInit() {
  }
  ngOnChanges() {
    console.log("from parent", this.jobDetails)
    if (this.jobDetails) {
      this.skuData = [];
      this.sellerId = this.jobDetails.seller_id;
      this.jobId = this.jobDetails.id;
      this.skus = this.jobDetails.products[0].expense_skus;
      console.log("skus", this.skus)
      this.skus.map((item, index) => {
        let res = item.sku_measurement_details.filter(sku =>
          sku.id == item.sku_measurement_id
        )
        console.log('res', res)
        if (res) {
          this.skuData.push({ 'id': item.id, 'sku_id': item.sku_id, 'name': item.sku_details.title, 'measurement_value': res[0].measurement_value, 'measurement_type': res[0].measurement_type.acronym, 'pack_numbers': res[0].pack_numbers, 'cashback_percent': res[0].cashback_percent, 'quantity': item.quantity, 'mrp': res[0].mrp, 'sku_measurement_id': item.sku_measurement_id, 'added_date': item.added_date });
        }
      })
      console.log(this.skuData)
    }
  }
  cashback(res: NgForm) {
    this.skuIds = Object.keys(res.value);
    let sellingPrice = [];
    let totalCashback = 0;
    let availableCashback = [];
    console.log("response is ", res.value)
    for (let i in res.value) {
      sellingPrice.push(res.value[i]);
    }
    // calculate available_cashback 
    for (let val = 0; val < sellingPrice.length; val++) {
      let calculate = (sellingPrice[val] * this.skuData[val].cashback_percent) / 100;
      totalCashback += calculate;
      availableCashback.push(calculate)
    }
    for (let i = 0; i < this.skuIds.length; i++) {
      this.skuItems.push({ 'id': this.skuIds[i], 'sku_id': this.skuData[i].sku_id, 'quantity': this.skuData[i].quantity, 'sku_measurement_id': this.skuData[i].sku_measurement_id, 'added_date': this.skuData[i].added_date, 'selling_price': sellingPrice[i], 'available_cashback': availableCashback[i] })
    }
    console.log(this.skuItems);
    this.__userService.updateSKU({ 'seller_id': this.sellerId, 'cashback_value': totalCashback, 'sku_items': this.skuItems }, this.jobId)
      .subscribe((res) => {
        console.log("success", res);
        this.__ngxNotificationService.sendMessage('SKU Verified', 'dark', 'bottom-right');
        this.__router.navigateByUrl('/dashboard/new');
      }, (err) => {
        console.log("error", err)
        this.skuItems = [];
        let msg;
        if (err.status == 0) {
          msg = 'No Internet available.'
        }
        msg = err.error.reason;
        this.__ngxNotificationService.sendMessage(msg, 'dark', 'bottom-right');
      })
  }
}
