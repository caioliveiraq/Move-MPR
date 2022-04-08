<template>
  <v-app id="inspire">
    <v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
               <v-toolbar-title style="margin: auto"><img class="logo" src="../assets/logo.png"></v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="credentials.email"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Senha"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="credentials.password"
                    @keyup="sendEnter"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login">Entrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Trocar senha</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="credentialsToChange.password"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[passwordRules.required, passwordRules.min]"
                      :type="showPassword ? 'text' : 'password'"
                      name="input-10-1"
                      label="Senha"
                      counter
                      @click:append="showPassword = !showPassword"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="credentialsToChange.confirmPassword"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="[(credentialsToChange.password === credentialsToChange.confirmPassword) || 'Password must match']"
                      :type="showPassword ? 'text' : 'password'"
                      name="input-10-1"
                      label="Confirmar Senha"
                      counter
                      @click:append="showPassword = !showPassword"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {

    name: "Login",
    
    data(){
      return {
          loader: null,
          credentials: {
            email: "",
            password: ""
          },

          dialog: false,
          showPassword: false,
          credentialsToChange: {
            password: "",
            confirmPassword: ""
          },

          passwordRules: {
            required: value => !!value || 'Obrigatório.',
            min: v => v.length >= 8 || 'Mínimo 8 caracteres'
          },

          userIdToChage: null,
      }
    },

    methods: {

      sendEnter: function(e){
        if (e.keyCode === 13) {
          this.login()
        }      
      },
          
      login: function() {
        this.loader = this.$loading.show();
        if (!this._isValidCredentials()) {
            this.loader.hide();
            return;
        }

        const redirectObj = this.$auth.redirect();

        this.$auth.login({
            body: this.credentials,
            method: "POST",
            fetchUser: true,
            rememberMe: true
        }).then(response => {
          this.loader.hide();

          if (response.body.changeFirst == 1) {
            this.userIdToChage = response.body.id;
            this.dialog = true;
          } else {
            this.$router.push(redirectObj ? redirectObj.from.path : '/users');
          }
        }, error => {
          let alertText = "Ocorreu um erro, servidor indisponível";
          if (error.status === 400 || error.status === 403) {
              alertText = "Credenciais inválidas";
          }

          this.$notify({
              group: "alert",
              title: "Atenção!",
              text: alertText,
              type: "error"
          });

          this.credentials.password = ""
          this.loader.hide();
        });
      },

      close() {
        this.dialog = false;
      }, 

      save() {
        this.$http
            .put(`${process.env.VUE_APP_API}users/${this.userIdToChage}/password`, this.credentialsToChange)
            .then(
              response => {
                if (response.body.success) {
                  this.$notify({
                    group: "alert",
                    title: "Sucesso!",
                    text: "Senha atualizada com sucesso!",
                    type: "success"
                  });
                  this.close()

                  const redirectObj = this.$auth.redirect();
                  this.$router.push(redirectObj ? redirectObj.from.path : '/users');
                } else {
                  this.errorMessage();
                }
              },
              () => {
                this.errorMessage();
              }
            );
      },

      errorMessage() {
        this.$notify({
          group: "alert",
          title: "Erro!",
          text: "Ocorreu um erro, por favor tente novamente!",
          type: "error"
        });
      },

      _isValidCredentials: function() {
        const isValidEmail = this.credentials.email && this.credentials.email !== "";
        const isValidPassword =
          this.credentials.password && this.credentials.password !== "";

        if (!isValidEmail || !isValidPassword) {
          this.$notify({
            group: "alert",
            title: "Atenção!",
            text:
              "Por favor, verifique suas credenciais de login e tente novamente!",
            type: "warning"
          });
        }
        return isValidEmail && isValidPassword;
      }
    }
  }
</script>
<style>
  .logo {
    height: 70px
  }
</style>