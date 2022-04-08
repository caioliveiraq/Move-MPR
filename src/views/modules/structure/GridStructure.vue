 <template>
  <mv-header>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="products"
          sort-by="name"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Cadastro de Estrutura</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    to="/formStructure"
                  >Nova Estrutura</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editUser(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </mv-header>
</template>

<script>
  export default {
    data: () => ({

      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        { text: 'ID (Tiny)', value: 'id_erp' },
        { text: 'Produto', value: 'description' },
        { text: 'Ações', value: 'actions', sortable: false }
      ],
      products: [],
    }),

    created () {
      this.initialize()
    },


    methods: {
      initialize () {
        this.$http
            .get(`${process.env.VUE_APP_API}products`)
            .then(
              response => {
                this.products = response.body
              },
              () => {
                this.errorMessage();
              }
            );
      },

      editUser (item){
          this.$router.push(`/formstructure/${item.id}`);
      },

      errorMessage() {
        this.$notify({
          group: "alert",
          title: "Erro!",
          text: "Ocorreu um erro, por favor tente novamente!",
          type: "error"
        });
      }
    },
  }
</script>