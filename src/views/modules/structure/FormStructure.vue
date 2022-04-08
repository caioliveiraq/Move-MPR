<template>
  <mv-header>
    <v-card elevation="5"> 
      <v-form
        ref="productForm"
        v-model="productValid"
      >
        <v-row>
          <v-col cols="12">
            <v-toolbar flat color="white">
              <v-toolbar-title>Cadastro de Estrutura</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-container>
              <v-row >
                <v-col cols="2">
                  <v-text-field
                    label="SKU"
                    placeholder="Digite o SKU"
                    v-model="product.sku" 
                    outlined
                    mask
                    @change="productSkuChange()"
                    :disabled="!!productId"
                    :rules="defaultRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-autocomplete
                    label="Produto"
                    placeholder="Digite uma descrição"
                    v-model="product.id_erp" 
                    outlined
                    :item-text="'nome'"
                    :item-value="'id'"
                    :items="erpProduct"
                    :search-input.sync="productSearch"
                    @change="productDescriptionChange()"
                    @keyup="productDescriptionSearch()"
                    :rules="defaultRules"
                    required
                    :disabled="!!productId"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-card elevation="3">
                <v-tabs
                  v-model="tab"
                  background-color="deep-purple accent-4"
                  centered
                  dark
                  icons-and-text
                >
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab href="#tab-1">
                    Componentes
                    <v-icon>mdi-shape</v-icon>
                  </v-tab>

                  <v-tab href="#tab-2">
                    Etapas
                    <v-icon>mdi-cog</v-icon>
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab">
                  <v-tab-item
                    :key="0"
                    :value="'tab-' + 1"
                  >
                  <v-form
                    ref="createFeedstockForm"
                    v-model="createFeedstockValid"
                  >
                    <v-card flat>
                      <v-card-text>
                          <v-row>
                            <v-col cols="12">
                              <v-toolbar flat color="white">
                                <v-toolbar-title>Componentes</v-toolbar-title>
                                <v-spacer></v-spacer>
                              </v-toolbar>
                              <v-container> 
                                <v-row>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      label="Ordem"
                                      placeholder="Digite um numero"
                                      v-model="createdFeedstock.order" 
                                      outlined
                                      :rules="defaultRules"
                                      return-masked-value v-mask="'##'"
                                      required
                                      disabled
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="8">
                                    <v-autocomplete
                                      label="Descrição"
                                      placeholder="Digite uma descrição"
                                      v-model="createdFeedstock.id_erp" 
                                      outlined
                                      :search-input.sync="feedstockSearchCreate"
                                      :item-text="'nome'"
                                      :item-value="'id'"
                                      :items="erpFeedstock"
                                      @keyup="feedstockDescriptionSearch(feedstockSearchCreate)"
                                      @change="createdDescriptionChange()"
                                      :rules="defaultRules"
                                      required
                                    ></v-autocomplete>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="6" md="3">
                                    <v-select
                                      v-model="createdFeedstock.unity" 
                                      label="Unidade"
                                      outlined
                                      :items="structure.UNITY"
                                      :rules="defaultRules"
                                      @change="createUnityChange()"
                                      required
                                    ></v-select>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3">
                                    <v-text-field
                                      label="Comprimento (m)"
                                      placeholder="Digite o comprimento"
                                      v-model="createdFeedstock.width" 
                                      outlined
                                      :disabled="createdFeedstock.unity !== 'm2'"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3">
                                    <v-text-field
                                      label="Altura (m)"
                                      placeholder="Digite a altura"
                                      v-model="createdFeedstock.height" 
                                      @blur="createdWidthBlur()"
                                      outlined
                                      :disabled="createdFeedstock.unity !== 'm2'"
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="3">
                                    <v-text-field
                                      :label="createdFeedstock.unity === 'm2'? 'Quantidade (m²)' : 'Quantidade'"
                                      placeholder="Digite uma quantidade"
                                      v-model="createdFeedstock.amount" 
                                      outlined
                                      :disabled="createdFeedstock.unity == 'm2'"
                                      :rules="floatRules"
                                      required
                                    ></v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12">
                                    <v-btn color="blue-grey" class="ma-2" dark large @click="closeCreatedFeedstock()">Limpar</v-btn>
                                    <v-btn color="success" class="ma-2" dark large @click="saveCreatedFeedstock()">Inserir</v-btn>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12">
                                    <v-card elevation="4">
                                      <v-data-table
                                        :headers="headersFeedstock"
                                        :items="product.feedstock"
                                        item-key="order"
                                        sort-by="order"
                                        class="elevation-1"
                                      >
                                        <template v-slot:top>
                                          <v-toolbar flat color="white">
                                            <v-toolbar-title>Incluidos</v-toolbar-title>
                                            <v-dialog v-model="feedstrockDialog" persistent max-width="800px">
                                              <v-card>
                                                <v-card-title>
                                                  <span class="headline">{{ formTitle }}</span>
                                                </v-card-title>
                                                <v-card-text>
                                                  <v-container>
                                                    <v-row>
                                                      <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedFeedstock.order" label="Ordem" return-masked-value v-mask="'##'" disabled></v-text-field>
                                                      </v-col>
                                                      <v-col cols="12" sm="6" md="4">
                                                        <v-autocomplete
                                                          label="Descrição"
                                                          v-model="editedFeedstock.id_erp"
                                                          :item-text="'nome'"
                                                          :item-value="'id'"
                                                          :search-input.sync="feedstockSearchEdit"
                                                          @keyup="feedstockDescriptionSearch(feedstockSearchEdit)"
                                                          :items="erpFeedstock"
                                                          @change="editedDescriptionChange()"
                                                        ></v-autocomplete>
                                                      </v-col>
                                                      <v-col cols="12" sm="6" md="4">
                                                        <v-select :items="structure.UNITY" v-model="editedFeedstock.unity" label="Unidade" @change="editedUnityChange()"></v-select>
                                                      </v-col>
                                                      <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedFeedstock.width" :disabled="editedFeedstock.unity !== 'm2'" label="Comprimento (m)"></v-text-field>
                                                      </v-col>
                                                      <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedFeedstock.height" :disabled="editedFeedstock.unity !== 'm2'" @blur="editedWidthBlur()" label="Altura (m)"></v-text-field>
                                                      </v-col>
                                                      <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedFeedstock.amount" :disabled="editedFeedstock.unity == 'm2'" :label="editedFeedstock.unity === 'm2'? 'Quantidade (m²)' : 'Quantidade'" :rules="floatRules"
                                                        required></v-text-field>
                                                      </v-col>
                                                    </v-row>
                                                  </v-container>
                                                </v-card-text>
                                                <v-card-actions>
                                                  <v-spacer></v-spacer>
                                                  <v-btn color="blue darken-1" text @click="closeFeedstock()">Cancelar</v-btn>
                                                  <v-btn color="blue darken-1" text @click="saveFeedstock()">Salvar</v-btn>
                                                </v-card-actions>
                                              </v-card>
                                            </v-dialog>
                                          </v-toolbar>
                                        </template>
                                        <template v-slot:item.actions="{ item }"> 
                                          <v-icon
                                            small
                                            class="mr-2"
                                            @click="editFeedstock(item)"
                                          >
                                            mdi-pencil
                                          </v-icon>
                                          <v-icon
                                            small
                                            @click="deleteFeedstock(item)"
                                          >
                                              mdi-delete
                                          </v-icon>
                                        </template>
                                      </v-data-table>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-col>
                          </v-row>
                      </v-card-text>
                    </v-card>
                  </v-form>
                  </v-tab-item>
                </v-tabs-items>
                <v-tabs-items v-model="tab">
                  <v-tab-item
                    :key="1"
                    :value="'tab-' + 2"
                  >
                  <v-form
                    ref="createStageFactoryForm"
                    v-model="createStageFactoryValid"
                    lazy-validation
                  >
                    <v-card flat>
                      <v-card-text>
                          <v-row>
                            <v-col cols="12">
                              <v-toolbar flat color="white">
                                <v-toolbar-title>Etapas de produção</v-toolbar-title>
                                <v-spacer></v-spacer>
                              </v-toolbar>
                              <v-container> 
                                <v-row>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                      label="Ordem"
                                      placeholder="Digite um numero"
                                      v-model="createdStageFactory.order" 
                                      outlined
                                      return-masked-value v-mask="'##'"
                                      :rules="defaultRules"
                                      required
                                      disabled
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="8">
                                    <v-text-field
                                      label="Descrição da Etapa"
                                      placeholder="Digite uma descrição"
                                      v-model="createdStageFactory.stage" 
                                      outlined
                                      :rules="defaultRules"
                                      required
                                    ></v-text-field>
                                  </v-col>
                                  <v-col cols="12" sm="6" md="4">
                                    <v-switch
                                      v-model="createdStageFactory.printStage"
                                      label="Etapa de impressão"
                                    ></v-switch>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12">
                                    <v-btn color="blue-grey" class="ma-2" dark large @click="closeCreatedStageFactory()">Limpar</v-btn>
                                    <v-btn color="success" class="ma-2" dark large @click="saveCreatedStageFactory()">Inserir</v-btn>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12">
                                    <v-card elevation="4">
                                      <v-data-table
                                        :headers="headersStageFactory"
                                        :items="product.stageFactory"
                                        item-key="order"
                                        sort-by="order"
                                        class="elevation-1"
                                      >
                                        <template v-slot:item.printStage="{ item }">
                                          <v-simple-checkbox v-model="item.printStage" disabled></v-simple-checkbox>
                                        </template>
                                        <template v-slot:top>
                                          <v-toolbar flat color="white">
                                            <v-toolbar-title>Incluidos</v-toolbar-title>
                                            <v-dialog v-model="stageFactoryDialog" persistent max-width="800px">
                                              <v-card>
                                                <v-card-title>
                                                  <span class="headline">{{ formTitle }}</span>
                                                </v-card-title>
                                                <v-card-text>
                                                  <v-container>
                                                    <v-row>
                                                      <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedStageFactory.order" label="Ordem" disabled></v-text-field>
                                                      </v-col>
                                                      <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="editedStageFactory.stage" label="Descrição da Etapa"></v-text-field>
                                                      </v-col>
                                                      <v-col cols="12" sm="6" md="4">
                                                        <v-switch
                                                          v-model="editedStageFactory.printStage"
                                                          label="Etapa de impressão"
                                                        ></v-switch>
                                                      </v-col>
                                                    </v-row>
                                                  </v-container>
                                                </v-card-text>
                                                <v-card-actions>
                                                  <v-spacer></v-spacer>
                                                  <v-btn color="blue darken-1" text @click="closeStageFactory()">Cancelar</v-btn>
                                                  <v-btn color="blue darken-1" text @click="saveStageFactory()">Salvar</v-btn>
                                                </v-card-actions>
                                              </v-card>
                                            </v-dialog>
                                          </v-toolbar>
                                        </template>
                                        <template v-slot:item.actions="{ item }"> 
                                          <v-icon
                                            small
                                            class="mr-2"
                                            @click="editStageFactory(item)"
                                          >
                                            mdi-pencil
                                          </v-icon>
                                          <v-icon
                                            small
                                            @click="deleteStageFactory(item)"
                                          >
                                              mdi-delete
                                          </v-icon>
                                        </template>
                                      </v-data-table>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </v-container>
                            </v-col>
                          </v-row>
                      </v-card-text>
                    </v-card>
                  </v-form>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn color="blue-grey" class="ma-2" dark large @click="cancelProduct()">Voltar</v-btn>
            <v-btn color="success" class="ma-2" v-if="productId == null" @click="createProduct()" dark large>Salvar</v-btn>
            <v-btn color="success" class="ma-2" v-if="productId != null" @click="updateProduct()" dark large>Atualizar</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </mv-header>
</template>

<script>
import structure from "./constStructure.js"
import { mask } from 'vue-the-mask'

  export default {
    data: () => ({
      loadingTasks: 2,

      structure: structure,
      erpFeedstock: [],
      erpProduct: [],
      productSearch: "",
      feedstockSearchCreate: "",
      feedstockSearchEdit: "",

      tab: null,
      searchFor: "1",
      
      defaultRules: [
        v => !!v || 'Campo obrigatório'
      ],

      floatRules: [
        v => !Number.isNaN(Number(v)) || 'Numero inválido'
      ],

      createFeedstockValid: null,
      feedstrockDialog: false,

      headersFeedstock: [
        { text: 'Ordem', align: 'start', value: 'order', sortable: false},
        { text: 'Descrição', value: 'description', sortable: false },
        { text: 'Unidade', value: 'unity', sortable: false },
        { text: 'Quantidade', value: 'amount', sortable: false },
        { text: 'Ações', value: 'actions', sortable: false }
      ],

      defaultFeedstock: {
        id:"",
        id_erp: "",
        sku: "",
        order:"",
        description: "", 
        height: "",
        width: "",  
        unity: "",
        amount: ""
      },

      createdFeedstock: {
        id:"",
        id_erp: "",
        sku: "",
        order:"",
        description: "",
        height: "",
        width: "",    
        unity: "",
        amount: ""
      },

      editedFeedstock: {
        id:"",
        id_erp: "",
        sku: "",
        order:"",
        description: "", 
        height: "",
        width: "",       
        unity: "",
        amount: ""
      },
      
      createStageFactoryValid: null,
      stageFactoryDialog: false,

      headersStageFactory: [
        { text: 'Ordem', value: 'order', sortable: false},
        { text: 'Processo', value: 'stage', sortable: false },
        { text: 'Imprimir', value: 'printStage', sortable: false },
        { text: 'Ações', value: 'actions', sortable: false }
      ],

      defaultStageFactory: {
        id:"",
        order:"",
        stage:"",
        printStage:false
      },

      createdStageFactory: {
        id:"",
        order:"",
        stage:"",
        printStage:false
      },

      editedStageFactory: {
        id:"",
        order:"",
        stage:"",
        printStage:false
      },

      productValid: null,
      productId: null,

      product: {
        id:"",
        id_erp: "",
        sku: "",
        description: "",
        feedstock:[],
        stageFactory: []
      }

    }),

    directives: {
      mask
    },
    
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo' : 'Editar'
      },
    },

    created () {
      this.loader = this.$loading.show()
      this._getErpProducts()
      this._getErpFeedstocks()

      this.productId = this.$route.params.id
    },

    watch: {
      loadingTasks: function(val) {
        if (val === 0){
          this._getProduct();
        }
      },
    },

    methods: {
      _getErpProducts(){
        this.$http.get(`${process.env.VUE_APP_API}getErpProducts?description=&sku=`).then(
          response => {
            this.erpProduct = response.body['data']
            this.loadingTasks--
          },
          () => {
            this._errorMessage()
            this.loadingTasks--
          }
        )
      },

      _getErpFeedstocks(){
        this.$http.get(`${process.env.VUE_APP_API}getErpFeedStocks?description=&sku=`).then(
          response => {
            this.erpFeedstock = response.body['data']
            this.loadingTasks--
          },
          () => {
            this._errorMessage()
            this.loadingTasks--
          }
        )
      },

      productDescriptionSearch(){
        this.$http.get(`${process.env.VUE_APP_API}getErpProducts?description=${this.productSearch}&sku`).then(
          response => {
            this.erpProduct = response.body['data']
          },
          () => {
            this._errorMessage()
          }
        )
      },

      productDescriptionChange(){
        for(let k in this.erpProduct){
          if(this.product.id_erp === this.erpProduct[k].id){
            this.product.description = this.erpProduct[k].nome
            this.product.sku = this.erpProduct[k].codigo
          }
        } 
      },

      productSkuChange(){
        this.$http.get(`${process.env.VUE_APP_API}getErpProducts?description=&sku=${this.product.sku}`).then(
          response => {
            this.erpProduct = response.body['data']
            for(let k in this.erpProduct){
              if(this.product.sku === this.erpProduct[k].codigo){
                this.product.description = this.erpProduct[k].nome
                this.product.id_erp = this.erpProduct[k].id
              }
            } 
          },
          () => {
            this._errorMessage()
          }
        )

      },

      createdDescriptionChange(){
        for(let k in this.erpFeedstock){
          if(this.createdFeedstock.id_erp.toString() == this.erpFeedstock[k].id){
            this.createdFeedstock.description = this.erpFeedstock[k].nome
            this.createdFeedstock.sku = this.erpFeedstock[k].codigo
          }
        }
      },

      feedstockDescriptionSearch(search){
        this.$http.get(`${process.env.VUE_APP_API}getErpFeedStocks?description=${search}&sku`).then(
          response => {
            this.erpFeedstock = response.body['data']
          },
          () => {
            this._errorMessage()
          }
        )
      },

      editedDescriptionChange(){
        for(let k in this.erpFeedstock){
          if(this.editedFeedstock.id_erp == this.erpFeedstock[k].id){
            this.editedFeedstock.description = this.erpFeedstock[k].nome
            this.editedFeedstock.sku = this.erpFeedstock[k].codigo
          }
        }
      },

      createUnityChange(){
        if(this.createdFeedstock.unity !== "m2"){
          this.createdFeedstock.width = ""
          this.createdFeedstock.height = ""
        }
      },

      editedUnityChange(){
        if(this.editedFeedstock.unity !== "m2"){
          this.editedFeedstock.width = ""
          this.editedFeedstock.height = ""
        }
      },

      createdWidthBlur(){
        this.createdFeedstock.amount = this.createdFeedstock.width * this.createdFeedstock.height
      },

      editedWidthBlur(){
        this.editedFeedstock.amount = this.editedFeedstock.width * this.editedFeedstock.height
      },

      saveCreatedFeedstock() {
        if(this.$refs.createFeedstockForm.validate()){
          if (this.editedIndex > -1) {
            Object.assign(this.product.feedstock[this.editedIndex], this.createdFeedstock)
          } else {
            this.product.feedstock.push(this.createdFeedstock)
          }
          this.closeCreatedFeedstock()
        }else{
          this.$notify({
            group: "alert",
            title: "Atenção!",
            text: "Existem campos a serem preenchidos!",
            type: "error"
          })
        }
      },

      closeCreatedFeedstock () {
        this.$nextTick(() => {
          this.createdFeedstock = Object.assign({}, this.defaultFeedstock)
          this.editedIndex = -1
          this.$refs.createFeedstockForm.resetValidation()
          this.createdFeedstock.order = Object.keys(this.product.feedstock).length+1
          this.editedFeedstock.order = Object.keys(this.product.feedstock).length+1
        })
      },

      editFeedstock (item) {
        this.editedIndex = this.product.feedstock.indexOf(item)
        this.editedFeedstock = Object.assign({}, item)
        this.feedstrockDialog = true
      },

      deleteFeedstock(item) {
        const index = this.product.feedstock.indexOf(item)
        confirm('Deseja excluir o item '+item.order+'?') && this.product.feedstock.splice(index, 1)
      },

      saveFeedstock() {
        if (this.editedIndex > -1) {
          Object.assign(this.product.feedstock[this.editedIndex], this.editedFeedstock)
        } else {
          this.product.feedstock.push(this.editedFeedstock)
        }
        this.closeFeedstock()
      },

      closeFeedstock () {
        this.feedstrockDialog = false
        this.$nextTick(() => {
          this.editedFeedstock = Object.assign({}, this.defaultFeedstock)
          this.editedIndex = -1
          this.editedFeedstock.order = Object.keys(this.product.feedstock).length+1
          this.editedFeedstock.order = Object.keys(this.product.feedstock).length+1
        })
      },

      saveCreatedStageFactory() {
        if(this.$refs.createStageFactoryForm.validate()){
          if (this.editedIndex > -1) {
            Object.assign(this.product.stageFactory[this.editedIndex], this.createdStageFactory)
          } else {
            this.product.stageFactory.push(this.createdStageFactory)
          }
          this.closeCreatedStageFactory()
        }else{
          this.$notify({
            group: "alert",
            title: "Atenção!",
            text: "Existem campos a serem preenchidos!",
            type: "error"
          })
        }
      },

      closeCreatedStageFactory() {
        this.$nextTick(() => {
          this.createdStageFactory = Object.assign({}, this.defaultStageFactory)
          this.editedIndex = -1
          this.$refs.createStageFactoryForm.resetValidation()
          this.createdStageFactory.order = Object.keys(this.product.stageFactory).length+1
          this.editedStageFactory.order = Object.keys(this.product.stageFactory).length+1
        })
      },  

      editStageFactory (item) {
        this.editedIndex = this.product.stageFactory.indexOf(item)
        this.editedStageFactory = Object.assign({}, item)
        this.stageFactoryDialog = true
      },

      deleteStageFactory(item) {
        const index = this.product.stageFactory.indexOf(item)
        confirm('Deseja excluir o item '+item.order+'?') && this.product.stageFactory.splice(index, 1)
      },

      saveStageFactory() {
        if (this.editedIndex > -1) {
          Object.assign(this.product.stageFactory[this.editedIndex], this.editedStageFactory)
        } else {
          this.product.stageFactory.push(this.editedStageFactory)
        }
        this.closeStageFactory()
      },

      closeStageFactory () {
        this.stageFactoryDialog = false
        this.$nextTick(() => {
          this.editedFeedstock = Object.assign({}, this.defaultStageFactory)
          this.editedIndex = -1
        })
      },    

      _validOrderFeedstock(){
        let feedstockOrder = []
        for(let k in this.product.feedstock){
            feedstockOrder.push(this.product.feedstock[k].order)
        }

        return (new Set(feedstockOrder)).size == feedstockOrder.length
      },

      _validOrderStagefactory(){
        let stagefactoryOrder = []
        for(let k in this.product.stageFactory){
            stagefactoryOrder.push(this.product.stageFactory[k].order)
        }

        return (new Set(stagefactoryOrder)).size === stagefactoryOrder.length
      },

      createProduct() {
        if(this.$refs.productForm.validate()){
          if(this._validOrderFeedstock()){
            if(this._validOrderStagefactory()){
              this.$http.post(`${process.env.VUE_APP_API}products`, this.product).then(
                response => {
                  if (response.body.success) {
                    this.$notify({
                      group: "alert",
                      title: "Sucesso!",
                      text: "produto criado com sucesso!",
                      type: "success"
                    })
                    this.$router.push(`/gridstructure`)
                  } else {
                    this._errorMessage()
                  }
                },
                () => {
                  this._errorMessage()
                }
              )
            }else{
              this.$notify({
                group: "alert",
                title: "Atenção!",
                text: "Ordem de Etapas inválida",
                type: "error"
              })
            }
          }else{
            this.$notify({
              group: "alert",
              title: "Atenção!",
              text: "Ordem de Componentes inválida",
              type: "error"
            })
          }
        }else{
          this.$notify({
            group: "alert",
            title: "Atenção!",
            text: "Existem campos a serem preenchidos!",
            type: "error"
          })
        }
      }, 

      updateProduct() {
        if(this.$refs.productForm.validate()) {
          this.$http.put(`${process.env.VUE_APP_API}products/${this.productId}`, this.product).then(
            response => {
              if (response.body.success) {
                this.$notify({
                  group: "alert",
                  title: "Sucesso!",
                  text: "produto atualizado com sucesso!",
                  type: "success"
                })
                this.$router.push(`/gridstructure`)
              } else {
                this._errorMessage()
              }
            },
            () => {
              this._errorMessage()
            }
          )
        } else {
          this.$notify({
            group: "alert",
            title: "Atenção!",
            text: "Existem campos a serem preenchidos!",
            type: "error"
          })
        }
      },

      cancelProduct(){
        this.$router.push(`/gridstructure`)
      },

      _errorMessage() {
        this.$notify({
          group: "alert",
          title: "Erro!",
          text: "Ocorreu um erro, por favor tente novamente!",
          type: "error"
        })
      }, 

      _getProduct() {
        if(this.productId != null){
          this.$http.get(`${process.env.VUE_APP_API}products/${this.productId}`).then(
            response => {
              this._parseProduct(response.body)
              this.createdStageFactory.order = Object.keys(this.product.stageFactory).length+1
              this.editedStageFactory.order = Object.keys(this.product.stageFactory).length+1
              this.createdFeedstock.order = Object.keys(this.product.feedstock).length+1
              this.editedFeedstock.order = Object.keys(this.product.feedstock).length+1
            },
            () => {
              this._errorMessage()
            }
          )
        }else{
          this.createdStageFactory.order = 1
          this.editedStageFactory.order = 1
          this.createdFeedstock.order = 1
          this.editedFeedstock.order = 1
          this.loader.hide()
        }
      },

      _parseProduct(product) {
        this.product = product
        this.product.stageFactory = product.stage_factory

        this.product.feedstock.forEach((feedstock) => {
          let erpFeedstock = this.erpFeedstock.filter((item) => {
            return item.nome == feedstock.description
          })

          if (erpFeedstock.length > 0) {
            feedstock.id_erp = erpFeedstock[0].id
          }
        })
        this.productSkuChange()
        this.loader.hide()
      }
    }

  }
</script>

<style>
  .text-h6{
    text-align:left;
  }
</style>