<template>
  <div>
    <div class="viewport">
      <md-toolbar :md-elevation="1">
        <span class="md-title">Informations</span>
      </md-toolbar>

      <md-list class="md-double-line">
        <md-subheader>Nom</md-subheader>

        <md-list-item>
          <md-icon class="md-primary">badge</md-icon>

          <div class="md-list-item-text">
            <span>{{ restaurant.name }}</span>
          </div>
        </md-list-item>
      </md-list>
      <md-list class="md-double-line">
        <md-subheader>Cuisine</md-subheader>

        <md-list-item>
          <md-icon class="md-primary">kitchen</md-icon>

          <div class="md-list-item-text">
            <span>{{ restaurant.cuisine }}</span>
          </div>
        </md-list-item>
      </md-list>
      <md-list class="md-double-line">
        <md-subheader>Adresse</md-subheader>

        <md-list-item>
          <md-icon class="md-primary">room</md-icon>

          <div class="md-list-item-text">
            <span
              >{{ restaurant.address.street }}, Batiment :
              {{ restaurant.address.building }}, Code postale :
              {{ restaurant.address.zipcode }}, {{ restaurant.borough }}</span
            >
          </div>
        </md-list-item>
      </md-list>
      <md-list class="md-double-line">
        <md-subheader>Menu</md-subheader>

        <md-list-item>
          <md-icon class="md-primary">restaurant_menu</md-icon>

          <div class="md-list-item-text" v-for="item of menu" v-bind:key="item">
            <span>{{ item.plat }}</span> <span>{{ item.prix }} €</span>

            <md-button class="md-primary"
              ><md-icon
                class="material-icons"
                v-on:click.native="
                  addToCart(
                    item.plat,
                    item.prix,
                    restaurant.name,
                    restaurant._id
                  )
                "
                >add_shopping_cart</md-icon
              >
            </md-button>
          </div>
        </md-list-item>
        <div v-if="americanfood" id="centerdiv">
          <img src="@/assets/american/hamburger.png" />
          <img src="@/assets/american/frite.png" />
          <img src="@/assets/american/coca.png" />
        </div>
        <div v-if="Jewfood" id="centerdiv">
          <img src="@/assets/jewish/1.png" />
          <img src="@/assets/jewish/2.png" />
          <img src="@/assets/jewish/3.png" />
        </div>
        <div v-if="Chickenfood" id="centerdiv">
          <img src="@/assets/chicken/1.png" />
          <img src="@/assets/chicken/2.png" />
          <img src="@/assets/chicken/3.png" />
        </div>
        <div v-if="testFood" id="centerdiv">
          <img src="@/assets/test/1.png" />
          <img src="@/assets/test/2.png" />
          <img src="@/assets/test/3.png" />
        </div>
      </md-list>
      <md-list class="md-double-line">
        <md-subheader>Notes</md-subheader>

        <md-list-item>
          <md-icon class="md-primary">grade</md-icon>

          <div class="md-list-item-text">
            <ul id="grades">
              <li
                v-for="(grade, index) in restaurant.grades"
                v-bind:key="index"
              >
                {{ grade.date }} - {{ grade.grade }} - {{ grade.score }}
              </li>
            </ul>
          </div>
        </md-list-item>
      </md-list>
      <md-list class="md-double-line">
        <md-subheader>Carte</md-subheader>

        <md-list-item>
          <md-icon class="md-primary">map</md-icon>

          <div class="md-list-item-text"></div>
          <l-map style="height: 300px" :zoom="zoom" :center="coord">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="coord"></l-marker>
          </l-map>
        </md-list-item>
      </md-list>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data: function () {
    return {
      restaurant: [],
      coord: [],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      menu: [],
      menuprice: [],

      plats: {
        plat: null,
        prix: null,
        nom: null,
        id: null,
      },
      americanfood: false,
      Jewfood: false,
      Chickenfood: false,
      testFood: false,
    };
  },

  mounted() {
    this.$emit("toParent", this.Cart);
    console.log(this.$route.params.id);
    this.id = this.$route.params.id;
    this.getRestaurantById(this.id);
    setTimeout(() => {
      this.getMenu(this.restaurant.cuisine);
    }, 300);
  },

  name: "details",
  methods: {
    addToCart(platSelect, prixSelect, nameSelect, idSelect) {
      (this.plats.plat = platSelect),
        (this.plats.prix = prixSelect),
        (this.plats.nom = nameSelect),
        (this.plats.id = idSelect),
        console.log(
          "plat : " +
            this.plats.plat +
            " prix : " +
            this.plats.prix +
            " nom : " +
            this.plats.nom +
            " id : " +
            this.plats.id
        );

      const newplat = {
        plat: this.plats.plat,
        prix: this.plats.prix,
        nom: this.plats.nom,
        id: this.plats.id,
      };

      // On envoie une requête fetch en POST au serveur !
      // Récupération des valeurs des champs du formulaire
      // en prévision d'un envoi multipart en ajax/fetch
      let donneesFormulaire = new FormData();
      donneesFormulaire.append("plat", newplat.plat);
      donneesFormulaire.append("prix", newplat.prix);
      donneesFormulaire.append("nom", newplat.nom);
      donneesFormulaire.append("id", newplat.id);

      let url = "http://localhost:8080/api/caddie";

      fetch(url, {
        method: "POST",
        body: donneesFormulaire,
      }).then((responseJSON) => {
        responseJSON
          .json()
          .then((res) => {
            console.log("Caddie :" + res);
            // Et quand on a la réponse on re-affiche les restaurants
            console.log(res);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    },
    getMenu(cuisine) {
      if (cuisine === "American") {
        this.americanfood = true;

        return (this.menu = [
          {
            plat: "Frite",
            prix: 5,
          },
          {
            plat: "Hamburger",
            prix: 12,
          },
          {
            plat: "Soda",
            prix: 2,
          },
        ]);
      }
      if (cuisine === "Hamburgers") {
        this.americanfood = true;

        return (this.menu = [
          {
            plat: "Frite",
            prix: 5,
          },
          {
            plat: "Hamburger",
            prix: 12,
          },
          {
            plat: "Soda",
            prix: 2,
          },
        ]);
      }
      if (cuisine === "Jewish/Kosher") {
        this.Jewfood = true;

        return (this.menu = [
          {
            plat: "Shakshuka",
            prix: 15,
          },
          {
            plat: "Tajine",
            prix: 12,
          },
          {
            plat: "El ben",
            prix: 3,
          },
        ]);
      }
      if (cuisine === "Chicken") {
        this.Chickenfood = true;

        return (this.menu = [
          {
            plat: "Cuisse de poulet",
            prix: 3,
          },
          {
            plat: "poulet roti",
            prix: 15,
          },
          {
            plat: "Wings de poulet",
            prix: 1,
          },
        ]);
      } else {
        this.testFood = true;
        return (this.menu = [
          {
            plat: "Deez Nuts",
            prix: 30,
          },
          {
            plat: "Nice Guy",
            prix: 15,
          },
          {
            plat: "Angry British Guy",
            prix: 100,
          },
        ]);
      }
    },
    getRestaurantById(id) {
      fetch("http://localhost:8080/api/restaurants/" + id, {
        method: "get",
      })
        .then((responseJSON) => {
          responseJSON.json().then((responseJS) => {
            console.log(responseJS);
            this.restaurant = responseJS.restaurant;
            console.log(this.restaurant);

            this.coord[0] = this.restaurant.address.coord[1];
            this.coord[1] = this.restaurant.address.coord[0];
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
