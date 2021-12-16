<template>
  <div>
    <md-toolbar class="md-primary">
      <h1 class="md-title" @click="mainMenu()">Liste des restaurant</h1>
      <md-button
        id="caddy"
        class="md-primary md-raised"
        @click="shoppingCart()"
      >
        <md-icon class="material-icons">shopping_cart</md-icon>
      </md-button>
      <md-button
        v-if="logout"
        class="md-icon-button md-raised md-primary"
        id="login"
        @click="active = true"
      >
        <md-icon class="material-icons">login</md-icon>
      </md-button>

      <md-button
        class="md-icon-button md-raised md-primary"
        id="login"
        v-on:click.native="logOut()"
        v-if="isAdmin"
      >
        <md-icon>logout</md-icon>
      </md-button>
    </md-toolbar>
    <div>
      <md-dialog :md-active.sync="active">
        <md-dialog-title>Connecter vous</md-dialog-title>
        <md-field>
          <label>Nom d'utilisateur</label>
          <md-input v-model="id" required="required"></md-input>
        </md-field>
        <md-field>
          <label>Mots de passe</label>
          <md-input v-model="mdp" required="required"></md-input>
        </md-field>

        <md-dialog-actions>
          <md-button class="md-primary" @click="active = false"
            >Fermer</md-button
          >

          <md-button
            class="md-primary"
            @click="
              active = false;
              connection();
            "
          >
            Connexion</md-button
          >
        </md-dialog-actions>
      </md-dialog>
      <md-dialog-alert
        :md-active.sync="alertConnect"
        md-content="Vous êtes bien connecté"
        md-confirm-text="OK"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",

  data: () => ({
    active: false,
    mdp: "",
    id: "",
    Credentials: ["admin"],
    alertConnect: false,
    isAdmin: false,
    logout: true,
  }),
  methods: {
    shoppingCart() {
      this.$router.push("/c");
    },
    loginPrompt() {
      this.active = true;
    },
    logOut() {
      this.isAdmin = false;
      this.logout = true;
      this.$router.push("/");
    },
    connection() {
      if (this.mdp === this.Credentials[0] && this.id === this.Credentials[0]) {
        this.alertConnect = true;
        this.isAdmin = true;
        this.logout = false;
        this.$router.push("/a/" + this.isAdmin);
      }
    },
    mainMenu() {
      this.$router.push("/");
    },
  },
};
</script>


<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
#caddy {
  position: absolute;
  right: 10%;
}
#login {
  position: absolute;
  right: 5%;
}

a {
  color: #42b983;
}
</style>
