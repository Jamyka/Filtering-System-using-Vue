<script>
import axios from "axios";

export default {
  data() {
    return {
      x: 0,
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
      let result = await axios.get(`http://localhost:9000/clients`);
      this.data = result.data.recordset;
      setTimeout(this.loadCount, 3000);
      console.log(this.data);
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
      // console.log(this.categoryList);
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
        this.filteredData.sort(function (a, b) {
          return Number(a["PriceofSelling"]) - Number(b["PriceofSelling"]);
        });
      } else if (this.priceSorting === "Descending") {
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
  },
};
</script>

<template>
  <!-- Loading Icon -->
  <div v-if="data.length === 0" class="about">No Data Found</div>
  <div
    v-else
    class="d-flex justify-content-center align-items-center"
    style="height: 82vh"
  >
    <img src="../assets/Loading_icon.gif" alt="loading" class="w-25" />
  </div>
</template>

<style scoped>
.about {
  width: 90vw;
  margin: 0 auto;
  height: 80.2vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
