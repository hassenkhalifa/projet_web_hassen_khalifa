<template>
  <div>
    <md-table v-model="restaurants" md-sort="name" md-sort-order="asc" md-card>
      <md-table-toolbar>
        <div>
          <md-field md-clearable class="md-toolbar-section-start">
            <md-input
              placeholder="Recherche par nom"
              @input="rechercheRestaurant()"
              v-model="name"
            />
          </md-field>
        </div>
        <div class="buttonC">
          <md-button
            class="md-icon-button md-raised"
            @click="changeSizeValue(5)"
          >
            5
          </md-button>

          <md-button
            class="md-icon-button md-raised"
            @click="changeSizeValue(50)"
          >
            50
          </md-button>
          <md-button
            class="md-icon-button md-raised"
            @click="changeSizeValue(100)"
          >
            100
          </md-button>
        </div>
        

        <div id="buttond" class="md-toolbar-section-end">
          <md-button @click="pagePrecedente()">
            <md-icon class="material-icons">chevron_leftt</md-icon>
          </md-button>
          <md-button @click="pageSuivante()">
            <md-icon class="material-icons">chevron_right</md-icon>
          </md-button>
        </div>
      </md-table-toolbar>
      <md-table-empty-state
        md-label="Aucun restaurant ne correspond à votre recherche"
        :md-description="`Votre recherche pour '${name}' n'a pas pu être trouvée. Veuillez essayer un autre nom.`"
      >
      </md-table-empty-state>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Nom" md-sort-by="name">{{
          item.name
        }}</md-table-cell>
        <md-table-cell md-label="Cuisine" md-sort-by="cuisine">{{
          item.cuisine
        }}</md-table-cell>

        <md-table-cell>
          <md-dialog-alert
            :md-active.sync="alertsuppr"
            md-content="Le restaurant est supprimer !"
            md-confirm-text="OK"
          />
          <md-dialog-alert
            :md-active.sync="alertModif"
            md-content="Le restaurant a été modifier !"
            md-confirm-text="OK"
          />
          <md-dialog-alert
            :md-active.sync="alertAjout"
            md-content="Le restaurant a été ajouté !"
            md-confirm-text="OK"
          />

          

          <md-dialog :md-active.sync="menumodif">
            <md-dialog-title>Modifier le restaurant</md-dialog-title>
            <md-field>
              <label>Nom du restaurant</label>
              <md-input v-model="nom" type="text" required></md-input>
            </md-field>
            <md-field>
              <label>Cuisine du restaurant</label>
              <md-input v-model="cuisine" type="text" required></md-input>
            </md-field>

            <md-dialog-actions>
              <md-button class="md-primary" @click="menumodif = false"
                >Fermer</md-button
              >

              <md-button
                class="md-primary"
                @click="
                  menumodif = false;
                  alertModif = true;
                  modifierRestaurant(item);
                "
                >Modifier</md-button
              >
            </md-dialog-actions>
          </md-dialog>
          <md-dialog :md-active.sync="menuAjout">
            <md-dialog-title>Ajouter un restaurant</md-dialog-title>
            <md-field>
              <label>Nom du restaurant</label>
              <md-input v-model="nom" required="required"></md-input>
            </md-field>
            <md-field>
              <label>Cuisine du restaurant</label>
              <md-input v-model="cuisine" required="required"></md-input>
            </md-field>

            <md-dialog-actions>
              <md-button class="md-primary" @click="menuAjout = false"
                >Fermer</md-button
              >

              <md-button
                class="md-primary"
                @click="
                  menuAjout = false;
                  alertAjout = true;
                  ajouterrRestaurant();
                "
              >
                Ajouter</md-button
              >
            </md-dialog-actions>
          </md-dialog>
          

          <md-button
            class="md-icon-button md-raised"
            @click="restaurantId(item._id)"
          >
            <md-icon>read_more</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  
  name: "tableau",
  data: () => ({
    props: {
    isAdmin: Boolean
  },
    nom: "",
    cuisine: "",
    size: 5,
    page: 0,
    name: "",
    alertsuppr: false,
    menumodif: false,
    alertModif: false,
    menuAjout: false,
    alertAjout: false,
    alertSearch: false,
    nbRestaurantsTotal: 0,
    restoID: "test",
    restaurants: [],
    isAdmin: false,
  }),

  mounted() {
    this.getRestaurantsFromServer();
    setTimeout(() => {
      this.alert = false;
    }, 300);
    console.log("isAdmin : "+this.isAdmin)
    this.isAdmin = this.$route.params.isAdmin;
  },

  methods: {
    rechercheRestaurant: _.debounce(function () {
      this.getRestaurantsFromServer();
    }, 300),

    arrayIsEmpty() {
      if (this.nbRestaurantsTotal == 0) {
        this.alertSearch = true;
      }
      console.log(
        "alertSearch = " +
          this.alertSearch +
          " Resto lenght = " +
          this.nbRestaurantsTotal
      );
    },
    restaurantId(restoid) {
      this.$router.push("/d/" + restoid );
      console.log("resto id : " + restoid);
    },
    showvalue() {
      console.log(this.nom + " " + this.cuisine);
    },
    ajouterrRestaurant() {
      event.preventDefault();

      const newRestaurant = {
        nom: this.nom,
        cuisine: this.cuisine,
      };

      // On envoie une requête fetch en POST au serveur !
      // Récupération des valeurs des champs du formulaire
      // en prévision d'un envoi multipart en ajax/fetch
      let donneesFormulaire = new FormData();
      donneesFormulaire.append("nom", newRestaurant.nom);
      donneesFormulaire.append("cuisine", newRestaurant.cuisine);

      let url = "http://localhost:8080/api/restaurants/";

      fetch(url, {
        method: "POST",
        body: donneesFormulaire,
      }).then((responseJSON) => {
        responseJSON
          .json()
          .then((res) => {
            console.log(res);
            // Et quand on a la réponse on re-affiche les restaurants
            this.getRestaurantsFromServer();
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    },
    modifierRestaurant(item) {
      const modifRestaurant = {
        nom: this.nom,
        cuisine: this.cuisine,
      };
      console.log("alertModif" + this.alertModif);
      // On envoie une requête fetch en POST au serveur !
      // Récupération des valeurs des champs du formulaire
      // en prévision d'un envoi multipart en ajax/fetch
      let donneesFormulaire = new FormData();
      donneesFormulaire.append("nom", modifRestaurant.nom);
      donneesFormulaire.append("cuisine", modifRestaurant.cuisine);

      let url = "http://localhost:8080/api/restaurants/";
      url += item._id;
      fetch(url, {
        method: "PUT",
        body: donneesFormulaire,
      }).then((responseJSON) => {
        responseJSON
          .json()
          .then((res) => {
            console.log(res);
            // Et quand on a la réponse on re-affiche les restaurants
            this.getRestaurantsFromServer();
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    },
    supprimerRestaurant(item) {
      let url = "http://localhost:8080/api/restaurants/";
      url += item._id;
      fetch(url, {
        method: "DELETE",
      }).then((responseJSON) => {
        responseJSON
          .json()
          .then((res) => {
            console.log(res);
            // Et quand on a la réponse on re-affiche les restaurants
            this.getRestaurantsFromServer();
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    },
    pagePrecedente() {
      if (this.page > 0) {
        this.page--;
        this.getRestaurantsFromServer();
      }
    },
    pageSuivante() {
      this.page++;
      this.getRestaurantsFromServer();
    },
    changeSizeValue(size) {
      this.size = size;
      this.getRestaurantsFromServer();
    },
    getRestaurantsFromServer() {
      console.log(this.size + "    " + this.page);

      let url = "http://localhost:8080/api/restaurants?";
      url += "&page=" + this.page;
      url += "&pagesize=" + this.size;
      url += "&name=" + this.name;

      fetch(url)
        .then((responseJSON) => {
          responseJSON.json().then((res) => {
            this.restaurants = res.data;
            this.nbRestaurantsTotal = res.count;
            console.log(res + " nb res " + this.nbRestaurantsTotal);
            //this.arrayIsEmpty();
          });
        })
        .catch(function (err) {
          console.log(err);
        });

      // url += "&name=" + this.nomrecherche;
      /*
    fetch(url)
      .then((responseJSON) => {
        responseJSON.json().then((res) => {
          this.restaurants = res.data;
          // this.nbRestaurantsTotal = res.count;
          console.log(res);
        });
      })
      .catch(function (err) {
        console.log(err);
      })*/
    },
  },
  /* getRestaurantsFromServer() {
    let url = "http://localhost:8080/api/restaurants";
    url += "page=" + this.page;
    url += "&pagesize=" + this.size;
    // url += "&name=" + this.nomrecherche;

    fetch(url)
      .then((responseJSON) => {
        responseJSON.json().then((res) => {
          this.restaurants = res.data;
          // this.nbRestaurantsTotal = res.count;
          console.log(res);
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  },*/
};
</script>