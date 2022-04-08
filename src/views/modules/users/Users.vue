 <template>
  <mv-header>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="users"
          sort-by="name"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Usuários</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" persistent max-width="800px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >Novo Usuário</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-form
                        ref="userForm"
                        v-model="formValid"
                      >
                        <v-row>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.name" label="Nome" :rules="defaultRules" required></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.sector" label="Setor" :rules="defaultRules" required ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.email" label="E-mail" :rules="emailRules" required></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6" md="4" v-if="formTitle=='Editar Usuário'">
                            <v-switch v-model="changePassword" label="Deseja redefinir a senha?"></v-switch>
                          </v-col>
                          <v-col cols="12" sm="6" md="4" v-if="changePassword || formTitle!='Editar Usuário'">
                            <v-switch v-model="editedItem.changeFirst" true-value="1" false-value="0" label="Redefinir senha no proximo logon?"></v-switch>
                          </v-col>
                        </v-row>
                        <v-row v-if="changePassword || formTitle!=='Editar Usuário'">
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="editedItem.password"
                              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showPassword ? 'text' : 'password'"
                              name="input-10-1"
                              label="Senha"
                              counter
                              @click:append="showPassword = !showPassword"
                              :rules="[passwordRules.min]"
                              required
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field
                              v-model="confirmPassword"
                              :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                              :type="showConfirmPassword ? 'text' : 'password'"
                              name="input-10-1"
                              label="Confirmar Senha"
                              counter
                              @click:append="showConfirmPassword = !showConfirmPassword"
                              :rules="[(editedItem.password === confirmPassword) || 'Confirmação incorreta']"
                              required
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="save" :disabled="!formValid">Salvar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
            <v-icon
            v-if="item.block=='0'"
              small
              @click="blockUser(item)"
            >
              mdi-account
            </v-icon>
            <v-icon
            v-else
              small
              @click="blockUser(item)"
            >
              mdi-account-cancel
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
      dialog: false,
      formValid: "",
      changePassword: false,
      showPassword: false,
      showConfirmPassword: false,
      confirmPassword: '',

      defaultRules: [
        v => !!v || 'Campo obrigatório'
      ],
      emailRules: [ 
        v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail inválido'
      ],
      passwordRules: {
        required: value => !!value || 'Obrigatório.',
        min: v => v.length >= 8 || 'Mínimo 8 caracteres'
      },

      headers: [
        {
          text: 'Nome',
          align: 'start',
          value: 'name',
        },
        { text: 'Setor', value: 'sector' },
        { text: 'E-mail', value: 'email' },
        { text: 'Ações', value: 'actions', sortable: false },
      ],
      users: [],
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        sector: '',
        email: '',
        password: '',
        block: '0',
        changeFirst: '0'
      },
      defaultItem: {
        id: 0,
        name: '',
        sector: '',
        email: '',
        password: '',
        block: '0',
        changeFirst: '0'
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Usuário' : 'Editar Usuário'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },


    methods: {
      initialize () {
        this.$http
            .get(`${process.env.VUE_APP_API}users`)
            .then(
              response => {
                this.users = response.body
              },
              () => {
                this.errorMessage()
              }
            )
      },

      editUser (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      blockUser (item) {
        let mensage = item.block==true ? 'Deseja desbloquear o usuário' : 'Deseja bloquear o usuário'
        if(confirm(`${mensage} ${item.name}?`)){
          this.editedIndex = this.users.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.editedItem.block = this.editedItem.block=='1' ? '0':'1'
          Object.assign(this.users[this.editedIndex], this.editedItem)
          this.save()
        }
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
        this.confirmPassword = ""
      },

      save() {
        if (this.editedIndex > -1) {
          this.updateUser(this.editedItem)
          console.log(JSON.stringify(this.editedItem))
        } else {
          this.createUser(this.editedItem)
        }
      },

      createUser(user) {
        this.$http
            .post(`${process.env.VUE_APP_API}users`, user)
            .then(
              response => {
                if (response.body.success) {
                  this.$notify({
                    group: "alert",
                    title: "Sucesso!",
                    text: "Usuário criado com sucesso!",
                    type: "success"
                  })
                  this.users.push(user)
                  this.close()
                } else {
                  this.errorMessage()
                }
              },
              () => {
                this.errorMessage()
              }
            )
      },

      updateUser(user) {
        this.$http
            .put(`${process.env.VUE_APP_API}users/${user.id}`, user)
            .then(
              response => {
                if (response.body.success) {
                  if (this.changePassword) {
                    this.updateUserPassword(user)
                  }

                  this.$notify({
                    group: "alert",
                    title: "Sucesso!",
                    text: "Usuário editado com sucesso!",
                    type: "success"
                  })
                  Object.assign(this.users[this.editedIndex], user)
                  this.close()
                } else {
                  this.errorMessage()
                }
              },
              () => {
                this.errorMessage()
              }
            )
      },

      updateUserPassword(user) {
        this.$http
            .put(`${process.env.VUE_APP_API}users/${user.id}/password/user`, user)
            .then(
              response => {
                if (response.body.success) {
                  this.$notify({
                    group: "alert",
                    title: "Sucesso!",
                    text: "Senha atualizada com sucesso!",
                    type: "success"
                  })
                } else {
                  this.errorMessage()
                }
              },
              () => {
                this.errorMessage()
              }
            )
      },

      errorMessage() {
        this.$notify({
          group: "alert",
          title: "Erro!",
          text: "Ocorreu um erro, por favor tente novamente!",
          type: "error"
        })
      }
    },
  }
</script>