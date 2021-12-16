<template >
  <div>
    <div>
      <md-table v-model="caddie" md-card>
        <md-table-toolbar>
          <h1 class="md-title">Caddie</h1>
        </md-table-toolbar>
        <md-table-empty-state md-label="Votre caddie est vide !">
        </md-table-empty-state>

        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Plat" md-sort-by="Plat">{{
            item.plat
          }}</md-table-cell>
          <md-table-cell md-label="Prix" md-sort-by="Prix"
            >{{ item.prix }} €</md-table-cell
          >
          <md-table-cell md-label="Restaurant" md-sort-by="Restaurant">{{
            item.nomResto
          }}</md-table-cell>
          <md-table-cell
            ><md-button
              class="md-icon-button md-raised"
              @click="restaurantId(item.id)"
            >
              <md-icon>read_more</md-icon>
            </md-button>
            <md-button
              class="md-icon-button md-raised md-accent"
              @click="supprimerPlat(item)"
            >
              <md-icon class="material-icons">delete_forever</md-icon>
            </md-button></md-table-cell
          >
        </md-table-row>
      </md-table>
      <md-toolbar class="md-accent">
        <h3 class="md-title">Votre panier est égale à : {{ totalPrice }} €</h3>
      </md-toolbar>
    </div>
  </div>
</template>

<script >
export default {
  name: "caddy",

  mounted() {
    this.getCaddie();
    this.totalPriceCaddy();
  },
  data() {
    return {
      caddie: [],
      totalPrice: 0,
    };
  },
  methods: {
    totalPriceCaddy() {
      this.caddie.forEach((e) => {
        this.totalPrice += parseInt(e.prix);
      });
    },
    arrayIsEmpty() {
      if (this.caddie.length == 0) {
        this.alertEmpty = true;
      }
      console.log(
        "alertSearch = " +
          this.alertSearch +
          " Resto lenght = " +
          this.nbRestaurantsTotal
      );
    },
    supprimerPlat(item) {
      let url = "http://localhost:8080/api/caddie/";
      url += item._id;
      fetch(url, {
        method: "DELETE",
      }).then((responseJSON) => {
        responseJSON
          .json()
          .then((res) => {
            console.log(res);
            // Et quand on a la réponse on re-affiche le caddie
            this.getCaddie();
            (this.totalPrice = 0),
              this.caddie.forEach((e) => {
                (this.totalPrice = 0), (this.totalPrice += parseInt(e.prix));
              });
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    },
    restaurantId(restoid) {
      this.$router.push("/d/" + restoid);
      console.log("resto id : " + restoid);
    },
    getCaddie() {
      let url = "http://localhost:8080/api/caddie";

      fetch(url)
        .then((responseJSON) => {
          responseJSON.json().then((res) => {
            console.log(res.data);
            this.caddie = res.data;

            console.log("totalprice : " + this.totalPrice);
            (this.totalPrice = 0),
              this.caddie.forEach((e) => {
                this.totalPrice += parseInt(e.prix);
              });
          });
        })

        .catch(function (err) {
          console.log(err);
        });
    },
  },
  computed: {},
};
</script>

<style scoped >
</style>
