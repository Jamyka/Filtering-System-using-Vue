<script>
import axios from "axios";
export default {
  data() {
    return {
      isLoading: false,
      err: "",
      data: [],
      changeStyle: false,
      fromDate: "",
      toDate: "",
      filteredData: [],
      totalPurchases: 0,
      categoryList: [""],
      category: "",
      priceSorting: "",
      dateSorting: "",
    };
  },
  mounted: async function () {
    await this.loadData();
    await this.loadCateg();
  },
  computed: {
    change() {
      this.changeStyle = !this.changeStyle;
    },
  },
  methods: {
    loadData: async function () {
      let result;
      this.isLoading = true;
      this.err = null;
      await axios
        .get(`http://localhost:9000/purchases`)
        .then((res) => {
          result = res;
          this.data = result.data.recordset;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.err = err;
          console.log(this.err);
        });
      //.then((res) => {
      //          if(res.ok){
      //   result = res;
      //   this.data = result.data.recordset;
      //   this.isLoading = false;
      // }else{
      // .catch((err) => {
      //   this.isLoading = false;
      //   this.err = err;
      // }
      // })
      // });
      setTimeout(this.loadCount, 3000);
      this.totalPurchases = 0;
      this.data.map((item) => {
        this.totalPurchases += item.TotalBuys;
      });
    },
    fromDateChange: function (e) {
      this.fromDate = e.target.value;
    },
    toDateChange: function (e) {
      this.toDate = e.target.value;
    },
    search: function () {
      let from = new Date(this.fromDate.toString());
      let to = new Date(this.toDate.toString());
      // let org = this.data.map((item) => {
      //   return new Date(item.DateOfBuy.split("T")[0].toString());
      // });
      let fData = this.data.filter((item) => {
        let date = new Date(item.DateOfBuy.split("T")[0].toString());
        return date >= from && date <= to;
      });
      this.totalPurchases = 0;
      fData.map((item) => {
        this.totalPurchases += item.TotalBuys;
      });
      this.filteredData = fData;
      console.log(this.totalPurchases);
      // console.log("from: ", from);
      // console.log("to: ", to);
      // console.log(this.filteredData);
      // console.log("org: ", org[0]);
    },
    reset: function () {
      this.fromDate = "";
      this.toDate = "";
      this.filteredData = [];
      this.totalPurchases = 0;
      this.data.map((item) => {
        this.totalPurchases += item.TotalBuys;
      });
    },
    loadCateg: async function () {
      this.data.forEach((item) => {
        this.categoryList.push(item.MasterModel);
      });
      let uniCat = [];
      this.categoryList.forEach((element) => {
        if (!uniCat.includes(element)) {
          uniCat.push(element);
        }
      });
      this.categoryList = uniCat;
    },
    filterByCat: function () {
      this.priceSorting = "";
      this.dateSorting = "Newest";
      setTimeout(() => {
        this.sortByDate();
      }, 5);
      let fData = this.data.filter((item) => {
        if (this.category === "") {
          return this.filteredData;
        } else {
          return item.MasterModel === this.category;
        }
      });
      this.filteredData = fData;
      this.totalPurchases = 0;
      for (let i of this.filteredData) {
        this.totalPurchases += i.TotalBuys;
      }
    },
    sortByPrice: function () {
      if (this.priceSorting === "Ascending") {
        this.dateSorting = "";
        this.filteredData.sort(function (a, b) {
          return Number(a["PriceOfBuying"]) - Number(b["PriceOfBuying"]);
        });
      } else if (this.priceSorting === "Descending") {
        this.dateSorting = "";
        this.filteredData.sort(function (a, b) {
          return Number(b["PriceOfBuying"]) - Number(a["PriceOfBuying"]);
        });
      }
    },
    sortByDate: function () {
      if (this.dateSorting === "Newest") {
        this.filteredData.sort((a, b) => {
          return new Date(a.DateOfBuy) - new Date(b.DateOfBuy);
        });
      } else if (this.dateSorting === "Oldest") {
        this.filteredData.sort((a, b) => {
          return new Date(b.DateOfBuy) - new Date(a.DateOfBuy);
        });
      }
    },
  },
};
</script>

<template>
  <!-- Loading Icon -->
  <div
    class="d-flex justify-content-center align-items-center"
    style="height: 81.5vh"
    v-if="isLoading"
  >
    <div v-if="isLoading" class="p-0 m-0">
      <img src="../assets/Loading_icon.gif" alt="loading" />
    </div>

    <p v-else-if="!isloading && err">
      Failed to load data, Please try again later
    </p>
    <p v-else-if="!isLoading && (!data || data.length === 0)">
      No Results to be Viewed
    </p>
  </div>
  <div class="about" v-if="data.length > 0">
    <h1 v-if="filteredData.length === 0">تقرير المشتريات</h1>
    <h1 v-else-if="filteredData.length > 0">
      تقرير المشتريات {{ fromDate ? " : من " + fromDate : "" }}
      {{ toDate ? "إلى " + toDate : "" }}
    </h1>

    <form class="d-flex flex-column justify-content-center align-items-center">
      <div class="d-flex">
        <div class="d-flex justify-content-between w-100 m-3">
          <label for="From" class="mx-3">From: </label>
          <input
            type="date"
            id="From"
            v-on:change="fromDateChange"
            v-model="fromDate"
          />
        </div>
        <div class="d-flex justify-content-between w-100 m-3">
          <label for="To" class="mx-3">TO: </label>
          <input
            type="date"
            id="To"
            v-on:change="toDateChange"
            v-model="toDate"
          />
        </div>
      </div>
      <!-- Filter By Date -->
      <div>
        <p v-if="fromDate !== '' && toDate !== ''">
          From : {{ fromDate }} To : {{ toDate }}
        </p>
        <button v-on:click.prevent="search" class="m-3">Search</button>
        <button v-on:click.prevent="reset" class="m-3">Reset</button>
      </div>
    </form>
    <div
      class="d-flex flex-column justify-content-center align-items-center flex-md-row justify-content-md-center align-items-md-center flex-lg-row justify-content-lg-center align-items-lg-center"
    >
      <!-- Filter By Category -->
      <div class="my-3">
        <label for="category in categoryList">Filter By Category: </label>
        <select
          id="category"
          class="mx-3"
          v-model="category"
          @change="filterByCat"
          placeholder="Category"
        >
          <option v-for="(ele, i) in categoryList" :key="i">
            {{ ele }}
          </option>
        </select>
      </div>
      <!-- Filter By Price -->
      <div class="my-3">
        <label for="price">Filter By Price: </label>
        <select
          id="price"
          class="mx-3"
          placeholder="Category"
          @change="sortByPrice"
          v-model="priceSorting"
        >
          <option>Ascending</option>
          <option>Descending</option>
        </select>
      </div>
      <!-- Filter By Date -->
      <div class="my-3">
        <label for="date">Filter By Date: </label>
        <select
          id="date"
          class="mx-3"
          @change="sortByDate"
          v-model="dateSorting"
        >
          <option>Newest</option>
          <option>Oldest</option>
        </select>
      </div>
    </div>

    <table class="table" style="direction: rtl; text-align: center">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">رقم الفاتورة</th>
          <th scope="col">الفئة</th>
          <th scope="col">اسم الصنف</th>
          <th scope="col">سعر الشراء</th>
          <th scope="col">الكمية المشتراة</th>
          <th scope="col">إجمالى الفاتورة</th>
          <th scope="col">تاريخ الفاتورة</th>
        </tr>
      </thead>
      <tbody v-if="filteredData.length === 0">
        <tr
          v-for="(row, index) in data"
          :key="row.IDSellAuto"
          @mouseenter="change"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ row.NumberInvoice }}</td>
          <td>{{ row.MasterModel }}</td>
          <td>{{ row.Model }}</td>
          <td>{{ row.PriceOfBuying }}</td>
          <td>{{ row.Amount }}</td>
          <td>{{ row.TotalBuys }}</td>
          <td>{{ row.DateOfBuy.split("T")[0] }}</td>
        </tr>
        <tr style="background-color: gray; font-weight: bolder">
          <th colspan="4">Total Purchases</th>
          <th colspan="4">
            {{
              totalPurchases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }}
            LE
          </th>
        </tr>
      </tbody>
      <tbody v-else-if="filteredData.length > 0">
        <tr
          v-for="(row, index) in filteredData"
          :key="row.IDSellAuto"
          @mouseenter="change"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ row.NumberInvoice }}</td>
          <td>{{ row.MasterModel }}</td>
          <td>{{ row.Model }}</td>
          <td>{{ row.PriceOfBuying }}</td>
          <td>{{ row.Amount }}</td>
          <td>{{ row.TotalBuys }}</td>
          <td>{{ row.DateOfBuy.split("T")[0] }}</td>
        </tr>
        <tr style="background-color: gray">
          <th colspan="4" style="font-weight: bold">Total Purchases</th>
          <th colspan="4" style="font-weight: bold">
            {{
              totalPurchases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }}
            LE
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.about {
  width: 90vw;
  margin: 0 auto;
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
