 <template>
  <mv-header>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="orders"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          sort-by="name"
          class="elevation-1"
          @page-count="pageCount = $event"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Ordens de Fabricação</v-toolbar-title>
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
                    to="/formOrder"
                  >Nova Ordem</v-btn>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editOrder(item)"
            >
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
         <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </v-col>
    </v-row>
  </mv-header>
</template>

<script>
  export default {
    data: () => ({

      page: 1,
      pageCount: 0,
      itemsPerPage: 10,

      dataProduct: [],

      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        { text: 'Produto', value: 'sales_items.0.description_product'},
        { text: 'Ações', value: 'actions', sortable: false }
      ],
      orders: [],
    }),

    created () {
      this.initialize()
    },


    methods: {
      initialize () {
        this.$http
            .get(`${process.env.VUE_APP_API}orders`)
            .then(
              response => {
                this.orders = response.body['data']
                this.$http.get(`${process.env.VUE_APP_API}products`).then(
                  response => {
                      this.dataProduct = response.body
                  },
                  () => {
                      this.errorMessage()
                  }
                )
              },
              () => {
                this.errorMessage();
              }
            );
      },

      editOrder (item){
          this.$router.push(`/formOrder/${item.id}`);
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