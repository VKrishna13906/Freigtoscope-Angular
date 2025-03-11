import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpServicesService } from '../services/http-services.service';
declare var $: any;

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {
  showDataTable: boolean = false;
  @ViewChild("dataTableContainer") dataTable!: ElementRef;
  //Fetching the initial Value
  CountryValues: any[] = [];
  CityValues: any[] = [];
  CompanyValues: any[] = [];
  UserValues: any[] = [];

  //Manipulation and display value
  tempCountryValues: any[] = [];
  tempCityValues: any[] = [];
  tempCompanyValues: any[] = [];
  tempUserValues: any[] = [];

  //Storing the Selected Value
  selectedCountryValues: any[] = [];
  selectedCityValues: any[] = [];
  selectedCompanyValues: any[] = [];
  selectedUserValues: any[] = [];
  companyData = []

  //pagination
  displayedCompanyData: any[] = []; // Data to display
  pageSize: number = 5; // Number of items per page
  currentIndex: number = 0;
  constructor(private httpservices: HttpServicesService) { }

  ngOnInit(): void {
    this.FetchDetails("country");
    this.FetchDetails("city");
    this.FetchDetails("company");
    this.FetchDetails("user");
  }
  onCountrySelect() {
    debugger
    this.tempCityValues = this.CityValues.filter(x =>
      this.selectedCountryValues.includes(x.CountryCode)
    );
    this.tempCompanyValues = this.CompanyValues.filter(x =>
      this.selectedCountryValues.includes(x.Country)
    );

    let selectCompanyCode: any[] = this.tempCompanyValues.map(company => company.CompanyID);

    this.tempUserValues = this.UserValues.filter(user =>
      selectCompanyCode.includes(user.Companyid)
    );
    console.log(this.tempUserValues);
    //handle uncheck scenario
    this.onUncheckHandles(this.selectedCountryValues);
  }
  onCitySelect(cityList: string[] = []) {

    //#region Binding Country code
    let selectedCountryCodes: string[];

    selectedCountryCodes = [...new Set(this.CityValues
      .filter(city => (cityList.length === 0 ? this.selectedCityValues : cityList)
        .includes(city.CityCode))
      .map(city => city.CountryCode)
    )];

    if (cityList.length !== 0) {
      this.selectedCityValues = cityList;
    }
    else {
      //Binding Company Based on City Selection
      this.tempCompanyValues = this.CompanyValues.filter(company =>
        this.selectedCityValues.includes(company.City)
      );
    }

    this.selectedCountryValues = selectedCountryCodes;
    //#endregion
  }

  onCompanySelect(companyList: any[] = []) {
    debugger
    console.log(this.selectedCompanyValues)
    console.log(this.CompanyValues)
    const selectedCityCode = [...new Set(this.CompanyValues
      .filter(company => (companyList.length === 0 ? this.selectedCompanyValues : companyList)
        .includes(company.CompanyID))
      .map(company => company.City))]

    if (companyList.length !== 0) {
      this.selectedCompanyValues = companyList;
    }
    else {
      this.tempUserValues = this.UserValues.filter(user =>
        this.selectedCompanyValues.includes(user.Companyid)
      );
    }
    this.onCitySelect(selectedCityCode)
  }
  onUserSelect() {
    console.log(this.selectedUserValues)
    console.log(this.UserValues)

    const selectedCompanyCode = [...new Set(this.UserValues
      .filter(user => this.selectedUserValues.includes(user.UserID))
      .map(user => user.Companyid))]
    this.onCompanySelect(selectedCompanyCode)
  }
  onClear() {
    //
    this.selectedCountryValues = [];
    this.selectedCityValues = [];
    this.selectedCompanyValues = [];
    this.selectedUserValues = [];
    this.showDataTable = false;

    //
    this.tempCountryValues = this.CountryValues;
    this.tempCityValues = this.CityValues;
    this.tempCompanyValues = this.CompanyValues;
    this.tempUserValues = this.UserValues

    ///Reseting the page
    this.displayedCompanyData = [];
    this.currentIndex = 0;
  }

  onUncheckHandles(arrayValue: any[]) {
    debugger
    if (arrayValue.length !== 0) {
      return;
    }
    if (this.selectedCountryValues.length === 0) {
      this.tempCompanyValues = this.CountryValues;
    }
    if (this.selectedCityValues.length === 0) {
      this.tempCityValues = this.CityValues;
    }
    if (this.selectedCompanyValues.length === 0) {
      this.tempCompanyValues = this.CompanyValues
    }
    if (this.selectedCompanyValues.length === 0) {
      this.tempUserValues = this.UserValues
    }
  }
  onSubmit() {
    debugger
    let arrValue = this.selectedUserValues.join(',');

    let request = {
      UserId: arrValue
    }
    this.httpservices.StoreSelection(request, "api/StoreSchedule/Submit").subscribe(
      (res: any) => {
        debugger
        if (res.Id == 200) {
          this.companyData = res.ArrayOfResponse
          console.log(this.companyData)
          // Load the first set of data
          this.loadMore();
          this.showDataTable = true;
          // Wait for the element to be available
          setTimeout(() => {
            this.dataTable?.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      },
      (error: any) => {

      });
  }

  FetchDetails(flag: string) {
    this.httpservices.FetchDetails(flag, "api/ClientDetails/Details").subscribe(
      (res: any) => {
        debugger

        if (res.Id == 200 && res.Message == "SUCCESS") {
          switch (flag) {
            case 'country':
              this.tempCountryValues = this.CountryValues = res.ArrayOfResponse;
              break;
            case 'city':
              this.tempCityValues = this.CityValues = res.ArrayOfResponse;
              break;
            case 'company':
              this.tempCompanyValues = this.CompanyValues = res.ArrayOfResponse;
              break;
            case 'user':
              this.tempUserValues = this.UserValues = res.ArrayOfResponse;
              break;
          }
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
  }
  loadMore() {
    const nextData = this.companyData.slice(this.currentIndex, this.currentIndex + this.pageSize);
    this.displayedCompanyData = [...this.displayedCompanyData, ...nextData];
    this.currentIndex += this.pageSize;
  }
}
