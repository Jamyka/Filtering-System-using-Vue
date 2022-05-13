<script>
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../assets/Fonts/IBMPlexSansArabic-SemiBold-normal";
import "../assets/Fonts/DUBAI-LIGHT-normal";

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
      totalSales: 0,
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
        .get(`http://localhost:9000/sales`)
        .then((res) => {
          result = res;
          this.data = result.data.recordset;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          this.err = err;
          console.log(this.err);
          console.log(this.isLoading);
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
      this.totalSales = 0;
      this.data.map((item) => {
        this.totalSales += item.TotalSells;
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
      //   return new Date(item.DateOfSell.split("T")[0].toString());
      // });
      let fData = this.data.filter((item) => {
        let date = new Date(item.DateOfSell.split("T")[0].toString());
        return date >= from && date <= to;
      });
      this.totalSales = 0;
      fData.map((item) => {
        this.totalSales += item.TotalSells;
      });
      this.filteredData = fData;
      console.log(this.totalSales);
      // console.log("from: ", from);
      // console.log("to: ", to);
      // console.log(this.filteredData);
      // console.log("org: ", org[0]);
    },
    reset: function () {
      this.fromDate = "";
      this.toDate = "";
      this.filteredData = [];
      this.totalSales = 0;
      this.data.map((item) => {
        this.totalSales += item.TotalSells;
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
      this.totalSales = 0;
      for (let i of this.filteredData) {
        this.totalSales += i.TotalSells;
      }
    },
    sortByPrice: function () {
      if (this.priceSorting === "Ascending") {
        this.dateSorting = "";
        this.filteredData.sort(function (a, b) {
          return Number(a["PriceofSelling"]) - Number(b["PriceofSelling"]);
        });
      } else if (this.priceSorting === "Descending") {
        this.dateSorting = "";
        this.filteredData.sort(function (a, b) {
          return Number(b["PriceofSelling"]) - Number(a["PriceofSelling"]);
        });
      }
    },
    sortByDate: function () {
      if (this.dateSorting === "Newest") {
        this.filteredData.sort((a, b) => {
          return new Date(a.DateOfSell) - new Date(b.DateOfSell);
        });
      } else if (this.dateSorting === "Oldest") {
        this.filteredData.sort((a, b) => {
          return new Date(b.DateOfSell) - new Date(a.DateOfSell);
        });
      }
    },
    exportToPdf: function () {
      const doc = new jsPDF();
      doc.setFont("IBMPlexSansArabic-SemiBold");
      autoTable(doc, {
        html: "#my-table",
        styles: { halign: "center", valign: "middle" },
        // useCss: true,
        theme: "striped",
        headStyles: { font: "IBMPlexSansArabic-SemiBold" },
        bodyStyles: { font: "IBMPlexSansArabic-SemiBold" },
        footStyles: { font: "IBMPlexSansArabic-SemiBold", fillColor: "#ccc" },
      });
      doc.save("table.pdf");
      console.log("exported");
      console.log(doc.getFontList());
    },
  },
};
</script>

<template>
  <!-- Loading Icon -->
  <div
    class="d-flex justify-content-center align-items-center"
    style="height: 78.7vh"
    v-if="data.length === 0"
  >
    <div v-if="isLoading" class="p-0 m-0">
      <img src="../assets/Loading_icon.gif" alt="loading" />
    </div>

    <p v-else-if="!isLoading && err">
      Failed to load data, Please try again later
    </p>

    <p v-else-if="!isLoading && (!data || data.length === 0)">
      No Results to be Viewed
    </p>
  </div>
  <!-- Data -->
  <div class="about" v-if="data.length > 0">
    <h1 v-if="filteredData.length === 0">تقرير المبيعات</h1>
    <h1 v-else-if="filteredData.length > 0">
      تقرير المبيعات {{ fromDate ? " : من " + fromDate : "" }}
      {{ toDate ? "إلى " + toDate : "" }}
    </h1>

    <form class="d-flex flex-column justify-content-center align-items-center">
      <!-- Date Inputs and Buttons -->
      <div class="d-flex contain">
        <div class="d-flex justify-content-between w-100 m-3">
          <label for="From" class="">From: </label>
          <input
            type="date"
            id="From"
            v-on:change="fromDateChange"
            v-model="fromDate"
          />
        </div>
        <div class="d-flex justify-content-between w-100 m-3">
          <label for="To" class="">TO: </label>
          <input
            type="date"
            id="To"
            v-on:change="toDateChange"
            v-model="toDate"
          />
        </div>
      </div>
      <!-- Other Filters -->
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
      <!-- Filter By Date -->
      <div>
        <p v-if="fromDate !== '' && toDate !== ''">
          From : {{ fromDate }} To : {{ toDate }}
        </p>
        <button v-on:click.prevent="search" class="m-3">Search</button>
        <button v-on:click.prevent="reset" class="m-3">Reset</button>
        <button v-on:click.prevent="exportToPdf" class="m-3">PDF</button>
      </div>
    </form>
    <table
      class="table"
      id="my-table"
      style="direction: rtl; text-align: center"
    >
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col" class="sm">رقم الفاتورة</th>
          <th scope="col" class="sm">الفئة</th>
          <th scope="col">اسم الصنف</th>
          <th scope="col">سعر الصنف</th>
          <th scope="col">الكمية المباعة</th>
          <th scope="col">إجمالى الفاتورة</th>
          <th scope="col" class="sm">تاريخ الفاتورة</th>
        </tr>
      </thead>
      <tbody v-if="filteredData.length === 0">
        <tr
          v-for="(row, index) in data"
          :key="row.IDSellAuto"
          @mouseenter="change"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td class="sm">{{ row.NumberInvoice }}</td>
          <td class="sm">{{ row.MasterModel }}</td>
          <td>{{ row.Model }}</td>
          <td>{{ row.PriceofSelling }}</td>
          <td>{{ row.Amount }}</td>
          <td>{{ row.TotalSells }}</td>
          <td class="sm">{{ row.DateOfSell.split("T")[0] }}</td>
        </tr>
      </tbody>
      <tbody v-else-if="filteredData.length > 0">
        <tr
          v-for="(row, index) in filteredData"
          :key="row.IDSellAuto"
          @mouseenter="change"
        >
          <th scope="row">{{ index + 1 }}</th>
          <td class="sm">{{ row.NumberInvoice }}</td>
          <td class="sm">{{ row.MasterModel }}</td>
          <td>{{ row.Model }}</td>
          <td>{{ row.PriceofSelling }}</td>
          <td>{{ row.Amount }}</td>
          <td>{{ row.TotalSells }}</td>
          <td class="sm">{{ row.DateOfSell.split("T")[0] }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr style="background-color: gray">
          <th colspan="4" style="font-weight: bold">Total Sales</th>
          <th colspan="4" style="font-weight: bold">
            {{ totalSales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
            LE
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
@charset "UTF-8";
.about {
  width: 90vw;
  margin: 0 auto;
  /* height: 100vh; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
@media (min-width: 320px) {
  .sm {
    display: none !important;
    background-color: red;
  }
  .contain {
    display: flex;
    flex-direction: column;
  }
}
</style>
