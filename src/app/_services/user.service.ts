import { Injectable } from '@angular/core';
import { appConfig } from '../app.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _apiLink: String = appConfig.apiUrl;
  constructor(private __http: HttpClient) { }

  // *********************************** USER SERVICES ******************************************//
  getReferenceData() {
    return this.__http.get(this._apiLink + 'api/cashback/reference')
  }
  getAdminJobList(status: number) {
    return this.__http.get(this._apiLink + 'api/cashback/jobs?admin_status=' + status)
  }
  getCEJobList(status) {
    return this.__http.get(this._apiLink + 'api/cashback/jobs?ce_status=' + status)
  }
  getUserList(type: number) {
    return this.__http.get(this._apiLink + 'api/users?role_type=' + type)
  }
  assignCashBackJobCE(req) {
    const data = req;
    console.log(data);
    return this.__http.put(this._apiLink + 'api/cashback/jobs/assign', data)
  }
  assignCashBackJobAdmin(req) {
    const data = req;
    console.log(data);
    return this.__http.put(this._apiLink + 'api/cashback/jobs/reassign', data)
  }
  discardJOB(req) {
    const data = req;
    console.log(data);
    return this.__http.put(this._apiLink + 'api/cashback/jobs/discard', data)
  }
  cashbackJobByID(id: number) {
    return this.__http.get(this._apiLink + 'api/cashback/jobs/' + id)
  }
  getUserSeller(id: number) {
    return this.__http.get(this._apiLink + 'api/cashback/jobs/' + id + '/sellers')
  }
  verifySeller(req, id) {
    const data = req;
    console.log(data);
    return this.__http.put(this._apiLink + 'api/cashback/jobs/' + id + '/expense', data)
  }
  updateSeller(req: any) {
    const data = req;
    console.log(req);
    return this.__http.put(this._apiLink + 'api/cashback', data)
  }
  updateSKU(req, id) {
    const data = req;
    console.log(data);
    return this.__http.put(this._apiLink + 'api/cashback/jobs/' + id + '/skus', data)
  }
  approveCashback(req) {
    const data = req;
    return this.__http.put(this._apiLink + 'api/cashback/jobs/approve', data)
  }
  getCities(stateId: number) {
    return this.__http.get(this._apiLink + 'api/cashback/states/' + stateId + '/cities')
  }
}
