<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
            v-if="item.heading"
            :key="item.heading"
            align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
              cols="6"
              class="text-center"
            >
              <a
                href="#!"
                class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title :to="item.link">
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
              :to="item.link"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            :to="item.link"
            link
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title
        style="width: 150px"
      >
      <img class="logo" src="../assets/logo.png">
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          icon
          large
          v-bind="attrs"
          v-on="on"
        >
          <v-avatar
            size="32px"
            item
          >
          <v-img
            src="../assets/user.png"
            alt="Vuetify"
          ></v-img></v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
        @click="logout()"
        >
          <v-list-item-title>Logoff</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
          <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {

    name: 'mvHeader',

    data: () => ({
        drawer: null,
        items: [
        { icon: 'mdi-home', text: 'Home', link:'/gridstructure'},
        { icon: 'mdi-file-cog', text: 'Ordens de Fabricação', link:'/gridorder' },
        { icon: 'mdi-shape', text: 'Cadastro de Estrutura', link:'/gridstructure'},
        { icon: 'mdi-cog', text: 'Configurações', link:'#'},
        { icon: '', text: 'Usuários', link:'/users' },
      ],
    }),

    methods: {
      logout: function() {
        this.$auth.logout({
          makeRequest: true,
          success: () => {
              this.$notify({
                group: "alert",
                title: "Sucesso!",
                text: "Usuário deslogado com sucesso!",
                type: "success"
              });
          },
          error: () => {
              this.$notify({
                group: "alert",
                title: "Erro!",
                text: "Ocorreu um erro, por favor tente novamente!",
                type: "error"
              });
          },
          redirect: "/"
        });
      },
    }
}
</script>

<style>
  .logo {
    height: 50px
  }
</style>