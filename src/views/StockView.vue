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
        .get(`http://localhost:9000/stock`)
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
  },
};
</script>

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
