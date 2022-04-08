<template>
  <mv-header>
    
    <v-card elevation="5"> 
      <v-form
        ref="orderForm"
        v-model="orderValid"
      >
        <v-row>
          <v-col cols="12">
            <v-toolbar flat color="white">
              <v-toolbar-title>Ordem de Fabricação</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
                <v-chip
                  class="ma-2"
                  label
                  large
                >
                 <h1>{{orderId}}</h1><v-icon>mdi-cog</v-icon><h1 v-if="subOrderId">{{subOrderId}}</h1>
                </v-chip>

                <v-chip
                  class="ma-2"
                  label
                  large
                >
                 <h1 v-if="availableToExpedition > 0">{{this.availableToExpedition}}</h1><v-icon>mdi-application-export</v-icon>
                </v-chip>
            </v-toolbar>
            <v-container>
              <v-row>
                <v-col cols="8">
                  <v-autocomplete
                  label="Produto"
                  placeholder="Digite selecione o produto"
                  v-model="order.product_id" 
                  outlined
                  :item-text="'description'"
                  :item-value="'id'"
                  :items="dataProduct"
                  :rules="defaultRules"
                  required
                  @change="changeStructure()"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row v-if="!subOrderId">
                <v-col cols="12">
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
                        Estrutura
                        <v-icon>mdi-shape</v-icon>
                      </v-tab>
                      <v-tab href="#tab-2">
                        Pedidos em fabricação
                        <v-icon>mdi-cog-box</v-icon>
                      </v-tab>
                      <v-tab v-if="orderId" href="#tab-3">
                        Sub Ordens
                      <v-icon>mdi-file-tree</v-icon>
                    </v-tab>
                      <v-tab v-if="orderId" href="#tab-4">
                        Expedição
                      <v-icon>mdi-application-export</v-icon>
                      </v-tab>
                    </v-tabs>
                  <v-tabs-items v-model="tab">
                    <v-tab-item
                      :key="0"
                      :value="'tab-' + 1"
                    >
                      <v-card flat>
                        <v-card-text>
                            <v-row>
                              <v-col cols="12">
                                <v-data-table
                                  :headers="headersStructure"
                                  :items="order.feedstocks"
                                  sort-by="id"
                                  item-key="id"
                                  class="elevation-1"
                                  hide-default-footer
                                >
                                  <template v-slot:top>
                                    <v-toolbar flat color="white">
                                      <v-toolbar-title v-if="order.product_custom">Estrutura (Personalizada)</v-toolbar-title>
                                      <v-toolbar-title v-else>Estrutura (padrão)</v-toolbar-title>
                                      <v-dialog v-model="structureDialog" persistent max-width="800px">
                                        <v-card>
                                          <v-card-title>
                                            <span class="headline">Editar</span>
                                          </v-card-title>
                                          <v-card-text>
                                            <v-container>
                                              <v-row>
                                                <v-col cols="12">
                                                  <v-autocomplete
                                                    label="Descrição"
                                                    v-model="editedStructure.id_erp"
                                                    :item-text="'nome'"
                                                    :item-value="'id'"
                                                    :items="erpFeedstock"
                                                    @change="editedDescriptionChange()"
                                                    outlined
                                                  ></v-autocomplete>
                                                </v-col>
                                              </v-row>
                                            </v-container>
                                          </v-card-text>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeStructure()">Cancelar</v-btn>
                                            <v-btn color="blue darken-1" text @click="saveStructure()">Salvar</v-btn>
                                          </v-card-actions>
                                        </v-card>
                                      </v-dialog>
                                    </v-toolbar>
                                  </template>
                                  <template v-slot:item.actions="{ item }">
                                    <v-icon
                                      small
                                      @click="editStructure(item)"
                                    >
                                      mdi-reload
                                    </v-icon>
                                  </template>
                                </v-data-table>
                              </v-col>
                            </v-row>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                  <v-tabs-items v-model="tab">
                    <v-tab-item
                      :key="1"
                      :value="'tab-' + 2"
                    >
                      <v-card flat>
                        <v-card-text>
                            <v-row>
                              <v-col cols="12">
                                <v-toolbar flat color="white">
                                  <v-toolbar-title>Pedidos</v-toolbar-title>
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
                                    @click="openSales()"
                                  >Incluir Pedido</v-btn>
                                </v-toolbar>
                                <v-data-table
                                    :headers="headersSales"
                                    :items="order.sales_items"
                                    sort-by="id"
                                    item-key="id"
                                    class="elevation-1"
                                    hide-default-footer
                                >
                                  <template v-slot:top>
                                  </template>
                                  <template v-slot:item.actions="{ item }">
                                    <v-icon
                                        small
                                        @click="deleteSales(item)"
                                    >
                                        mdi-delete
                                    </v-icon>
                                  </template>
                                </v-data-table>
                              </v-col>
                            </v-row>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>      
                  <v-tabs-items v-model="tab" v-if="orderId">
                    <v-tab-item
                      :key="2"
                      :value="'tab-' + 3"
                    >
                      <v-card flat>
                        <v-card-text>
                            <v-row>
                              <v-col cols="12">
                                <v-toolbar flat color="white">
                                  <v-toolbar-title>Sub Ordens</v-toolbar-title>
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
                                    @click="newSubOrder()"
                                  >Incluir Sub Ordem</v-btn>
                                </v-toolbar>
                                <v-data-table
                                  :headers="headersSubOrders"
                                  :items="order.sub_orders"
                                  sort-by="id"
                                  item-key="id"
                                  class="elevation-1"
                                  hide-default-footer
                                >
                                  <template v-slot:top>
                                    <v-toolbar flat color="white">
                                      <v-toolbar-title>Incluidos</v-toolbar-title>
                                      <v-dialog v-model="newSubOrderDialog" persistent max-width="800px">
                                        <v-card>
                                          <v-card-title>
                                            <span class="headline">Nova Sub Ordem</span>
                                          </v-card-title>
                                          <v-card-text>
                                            <v-container>
                                              <v-row>
                                                <v-col cols="12" sm="6" md="4">
                                                  <v-text-field label="Nota fiscal" maskreturn-masked-value v-mask="'##############'" v-model="editedSubOrder.invoice"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                  <v-text-field label="Itens disponíveis" v-model="availableOrder" :disabled="true"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                  <v-text-field label="Quantidade de Itens" v-mask="'####'" v-model="editedSubOrder.amount"></v-text-field>
                                                </v-col>
                                              </v-row>
                                            </v-container>
                                          </v-card-text>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeSubOrder()">Cancelar</v-btn>
                                            <v-btn color="blue darken-1" text @click="saveSubOrder()">Salvar</v-btn>
                                          </v-card-actions>
                                        </v-card>
                                      </v-dialog>
                                    </v-toolbar>
                                  </template>
                                  <template v-slot:item.actions="{ item }">
                                    <v-icon
                                      small
                                      @click="editSubOrder(item)"
                                    >
                                      mdi-pencil
                                    </v-icon>
                                    <v-icon
                                      small
                                      @click="deleteSubOrder(item)"
                                    >
                                      mdi-delete
                                    </v-icon>
                                  </template>
                                </v-data-table>
                              </v-col>
                            </v-row>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>
                  <v-tabs-items v-model="tab" v-if="orderId">
                    <v-tab-item
                      :key="2"
                      :value="'tab-' + 4"
                    >
                      <v-card flat>
                        <v-card-text>
                            <v-row>
                              <v-col cols="12">
                                <v-toolbar flat color="white">
                                  <v-toolbar-title>Expedição</v-toolbar-title>
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
                                    @click="newExpedition()"
                                  >Nova Expedição</v-btn>
                                </v-toolbar>
                                <v-data-table
                                  :headers="headersExpeditions"
                                  :items="order.expeditions"
                                  sort-by="order"
                                  item-key="order"
                                  class="elevation-1"
                                  hide-default-footer
                                >
                                  <template v-slot:top>
                                    <v-toolbar flat color="white">
                                      <v-toolbar-title>Incluidos</v-toolbar-title>
                                      <v-dialog v-model="newExpeditionDialog" persistent max-width="800px">
                                        <v-card>
                                          <v-card-title>
                                            <span class="headline">Expedição</span>
                                          </v-card-title>
                                          <v-card-text>
                                            <v-container>
                                              <v-row>
                                                <v-col cols="12" sm="6" md="4">
                                                  <v-select v-model="editedExpedition.invoice" label="Pedido" :items="order.sales_items" :item-value="'id_sale'" :item-text="'id_sale'" @change="editedExpeditionInvoiceChange()"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                  <v-text-field label="Itens disponíveis" v-model="availableToExpedition" :disabled="true"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                  <v-text-field label="Itens a expedir" v-model="editedExpedition.amount" :disabled="true"></v-text-field>
                                                </v-col>
                                              </v-row>
                                            </v-container>
                                          </v-card-text>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeExpedition()">Cancelar</v-btn>
                                            <v-btn color="blue darken-1" text @click="saveExpedition()">Salvar</v-btn>
                                          </v-card-actions>
                                        </v-card>
                                      </v-dialog>
                                    </v-toolbar>
                                  </template>
                                </v-data-table>
                              </v-col>
                            </v-row>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs-items>   
                  </v-card>
                </v-col>
              </v-row>
              <v-row v-else>
                <v-col cols="12">
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
                        Etapas de Produção
                        <v-icon>mdi-debug-step-over</v-icon>
                      </v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="tab">
                      <v-tab-item
                        :key="0"
                        :value="'tab-' + 1"
                      >
                      <v-card flat v-if="order.sub_orders[this.$route.params.subid-1]">
                        <v-card-text>
                          <v-data-table
                            :headers="headersStageFactory"
                            :items="order.sub_orders[this.$route.params.subid-1].default_stage_factories"
                            item-key="order"
                            sort-by="order"
                            class="elevation-1"
                          >
                            <template v-slot:item.complete="{ item }">
                              <v-checkbox v-model="item.complete" false-value="0" true-value="1" disabled></v-checkbox>
                            </template>
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <v-toolbar-title>Incluidos</v-toolbar-title>
                                <v-dialog v-model="stepFactoryDialog" persistent max-width="800px">
                                  <v-card>
                                    <v-card-title>
                                      <span class="headline">Editar</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="6" md="4">
                                            <v-text-field label="Entrada" v-model="editedStepFactory.start" disabled ></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="6" md="4">
                                            <v-text-field label="Quebra" v-model="editedStepFactory.broken" @change="stepBrokenChange()"></v-text-field>
                                          </v-col>
                                          <v-col cols="12" sm="6" md="4">
                                            <v-text-field disabled label="Saldo" v-model="editedStepFactory.total"></v-text-field>
                                          </v-col>
                                        </v-row>
                                          <v-col cols="12" sm="6" md="4">
                                            <v-checkbox
                                              v-model="editedStepFactory.complete"
                                              label="Concluído"
                                              false-value="0" true-value="1"
                                            ></v-checkbox>
                                          </v-col>
                                        <v-row>
                                        </v-row>
                                      </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-btn color="blue darken-1" v-if="editedStepFactory.printStage" text @click="printStepFactory()">Imprimir</v-btn>
                                      <v-spacer></v-spacer>
                                      <v-btn color="blue darken-1" text @click="closeStepFactory()">Cancelar</v-btn>
                                      <v-btn color="blue darken-1" text @click="saveStepFactory()">Salvar</v-btn>
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
                            </template>
                          </v-data-table>
                        </v-card-text>
                      </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn color="blue-grey" class="ma-2" dark large @click="backOrder()" v-if="subOrderId">Voltar</v-btn>
            <v-btn color="blue-grey" class="ma-2" dark large @click="backGridOrder()" v-else>Voltar</v-btn>
            <v-btn color="success" class="ma-2" v-if="orderId == null" @click="createOrder()" dark large>Salvar</v-btn>
            <v-btn color="success" class="ma-2" v-if="orderId != null" @click="updateOrder()" dark large>Atualizar</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <template>
      <v-dialog v-model="salesDialog" persistent max-width="800px">
        <v-card flat>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-toolbar flat color="white">
                  <v-toolbar-title>Incluir pedidos</v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  ></v-divider>
                  <v-spacer></v-spacer>
                </v-toolbar>
                  <v-tabs-items v-model="salesTab">
                    <v-tab-item
                      :key="0"
                      :value="'tab-' + 1"
                    >
                      <v-data-table
                          :headers="headersSearchSales"
                          :items="searchSalesData"
                          sort-by="id"
                          item-key="id"
                          class="elevation-1"
                          hide-default-footer
                          :loading="loadingSearchSales"
                          loading-text="Loading... Please wait"
                      >
                          <template v-slot:top>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="4" md="4">
                              <v-text-field
                                  label="Cliente"
                                  placeholder="Digite o nome do cliente"
                                  v-model="searchSales.client" 
                                  outlined
                              ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="3" md="3">
                              <v-text-field
                                  label="Data Inicial"
                                  placeholder="   /   /    "
                                  v-model="searchSales.startDate" 
                                  outlined
                                  maskreturn-masked-value v-mask="'##/##/####'"
                              ></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="3" md="3">
                              <v-text-field
                                  label="Data Final"
                                  placeholder="   /   /    "
                                  v-model="searchSales.endDate" 
                                  outlined
                                  maskreturn-masked-value v-mask="'##/##/####'"
                              ></v-text-field>
                              </v-col>
                              <v-col cols="2">
                              <v-btn color="success" class="ma-2" @click="findSales()" dark large>Buscar</v-btn>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12">
                              <v-btn color="blue-grey"  class="ma-2" @click="salesDialog = false" dark large>Fechar</v-btn>
                              </v-col>
                            </v-row>
                          </v-container>
                          </template>
                          <template v-slot:item.actions="{ item }">
                            <v-icon
                              small
                              @click="selectSalesItems(item)"
                            >
                              mdi-file-find
                            </v-icon>
                          </template>
                      </v-data-table>
                    </v-tab-item>
                  </v-tabs-items>
                  <v-tabs-items v-model="salesTab">
                    <v-tab-item
                      :key="1"
                      :value="'tab-' + 2"
                    >
                      <v-data-table
                        :headers="headersSearchSalesItem"
                        :items="searchSalesItem"
                        sort-by="id"
                        item-key="id"
                        class="elevation-1"
                        hide-default-footer
                      >
                        <template v-slot:item.actions="{ item }">
                          <v-icon
                            small
                            @click="addSalesItem(item)"
                            v-if="verifySaleItem(item)"
                          >
                              mdi-sticker-plus
                          </v-icon>
                        </template>
                      </v-data-table>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <v-col cols="2">
                            <v-btn color="blue-grey"  class="ma-2" @click="backSalesItems()" dark large>Voltar</v-btn>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                  </v-tabs-items>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>

  </mv-header>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {

    data: () => ({

      loadingTasks: 2,
      
      dataProduct: [],

      erpFeedstock: [],
      
      tab: null,

      defaultRules: [
          v => !!v || 'Campo obrigatório'
      ],

      editedIndex: null,

      structureDialog: false,

      headersStructure:[
        { text: 'Ordem', value: 'order', sortable: false},
        { text: 'Descrição', value: 'description', sortable: false},
        { text: 'Ações', value: 'actions', sortable: false },
      ],

      defaultStructure: {
        id:"",
        id_erp: "",
        order:"",
        description: "", 
        height: "",
        width: "",       
        unity: "",
        amount: ""
      },

      editedStructure: {
        id:"",
        id_erp: "",
        order:"",
        description: "", 
        height: "",
        width: "",       
        unity: "",
        amount: ""
      },

      salesDialog: false,
      salesTab: "tab-1",
      searchSalesData: [],

      headersSales: [
        { text: 'Pedido', align: 'start', value: 'id_sale', sortable: false},
        { text: 'Cliente', value: 'client_sale', sortable: false },
        { text: 'Data do pedido', value: 'date_sale', sortable: false },
        { text: 'Quantidade', value: 'amount_product', sortable: false },
        { text: 'Abrir', value: 'actions', sortable: false }
      ],

      headersSearchSales: [
        { text: 'Pedido', align: 'start', value: 'id', sortable: false},
        { text: 'Cliente', value: 'nome', sortable: false },
        { text: 'Situação', value: 'situacao', sortable: false },
        { text: 'Abrir', value: 'actions', sortable: false }
      ],

      searchSales:{
        client: "",
        endDate: "",
        startDate: ""
      },

      searchSalesItem: [],

      headersSearchSalesItem: [
        { text: 'Id', align: 'start', value: 'id_produto', sortable: false},
        { text: 'Produto', value: 'descricao', sortable: false },
        { text: 'Quantidade', value: 'quantidade', sortable: false },
        { text: 'Adicionar', value: 'actions', sortable: false }
      ],

      loadingSearchSales: false,
      salesTemp: {},

      headersSubOrders: [
        { text: 'Sub id', align: 'start', value: 'sub_id', sortable: false},
        { text: 'Items', value: 'amount', sortable: false },
        { text: 'Estagio', value: 'stage', sortable: false },
        { text: 'Ações', value: 'actions', sortable: false }
      ],

      newSubOrderDialog: false,
      editedSubOrder:{
        id: "",
        amount: "",
        status: "",
        default_stage_factories: []
      },

      defaultSubOrder:{
        id: "",
        amount: "",
        status: "",
        default_stage_factories: []
      },

      headersStageFactory: [
        { text: 'Ordem', align: 'start', value: 'order', sortable: false},
        { text: 'Etapa', value: 'stage', sortable: false },
        { text: 'Entrada', value: 'start', sortable: false },
        { text: 'Saída', value: 'total', sortable: false },
        { text: 'Concluido', value: 'complete', sortable: false },
        { text: 'Ações', value: 'actions', sortable: false }
      ],

      stepFactoryDialog: false,

      defaultStageFactory: [],

      editedStepFactory:{
        start:"",
        broken: "",
        total: "",
        complete: 0
      },

      newExpeditionDialog: false,

      headersExpeditions:[
        { text: 'Ordem', align: 'start', value: 'order', sortable: false },
        { text: 'Pedido', value: 'invoice', sortable: false },
        { text: 'Quantidade', value: 'amount', sortable: false },
        { text: 'Status', value: 'status', sortable: false },
      ],

      editedExpedition:{
        id: "",
        order: "",
        product: "",
        invoice: "",
        amount: "",
        status: ""
      },

      defaultExpedition:{
        id: "",
        order: "",
        product: "",
        invoice: "",
        amount: "",
        status: ""
      },
      
      orderValid: null,
      orderId: null,
      subOrderId: null,
      availableOrder: null,

      order:{
        product_custom: false,
        product_id: "",
        id_erp: "",
        sales_items: [],
        sub_orders:[],
        feedstocks:[],
        expeditions:[]
      },

    }),

    directives: {
      mask
    },

    created(){
      this.loader = this.$loading.show();
      this.getProductsData()
      this._getErpFeedstock()
      this.orderId = this.$route.params.id
      this.subOrderId = this.$route.params.subid
    },

    watch: {
      loadingTasks: function(val) {
        if (val === 0) {
          this._getOrder()
        }
      }
    },

    computed: {
      availableToExpedition () {
        let countSales = 0
        for(let k in this.order.sub_orders){
          countSales+=parseInt(this.order.sub_orders[k].default_stage_factories[Object.keys(this.order.sub_orders[k].default_stage_factories).length-1].total)
        }

        let countExpedition = 0
        for(let k in this.order.expeditions){
          countExpedition+=parseInt(this.order.expeditions[k].amount)
        }

        return countSales ? countSales-countExpedition : 0
      }
    },

    methods:{
      _getErpFeedstock(){
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
        this.loadingTasks--
      },

      getProductsData(){
        this.$http.get(`${process.env.VUE_APP_API}products`).then(
          response => {
              this.dataProduct = response.body
              this.loadingTasks--
          },
          () => {
              this.errorMessage()
              this.loadingTasks--
          }
        )
      },

      changeStructure(){
        let productTemp = this.dataProduct.filter(item => {
          return item.id == this.order.product_id
        })

        this.order.feedstocks = productTemp[0].feedstock
        this.order.id_erp = productTemp[0].id_erp
        this.defaultStageFactory = productTemp[0].stagefactory

        this.order.product_custom = false;
      },

      editedDescriptionChange(){
        for(let k in this.erpFeedstock){
          if(this.editedStructure.id_erp == this.erpFeedstock[k].id){
            this.editedStructure.description = this.erpFeedstock[k].nome
          }
        }
      },

      editStructure (item) {
        this.editedIndex = this.order.feedstocks.indexOf(item)
        this.editedStructure = Object.assign({}, item)
        this.structureDialog = true
      },

      saveStructure() {
        this.order.product_custom = true
        Object.assign(this.order.feedstocks[this.editedIndex], this.editedStructure)
        this.closeStructure()
      },

      closeStructure () {
        this.structureDialog = false
        this.$nextTick(() => {
          this.editedStructure = Object.assign({}, this.defaultStructure)
          this.editedIndex = -1
        })
      },

      openSales (){
        this.salesDialog = true
      },

      deleteSales (item){
        const index = this.order.sales_items.indexOf(item)
        confirm('Deseja excluir o item '+item.idSale+'?') && this.order.sales_items.splice(index, 1)
      },

      findSales(){
        this.searchSales.product= this.order.id_erp
        this.loadingSearchSales=true
        this.$http.post(`${process.env.VUE_APP_API}getSales`, this.searchSales).then(
          response => {
            this.searchSalesData = response.body['data']
            this.loadingSearchSales=false
          },
          () => {
            this._errorMessage()
          }
        )
      },

      selectSalesItems(item){
        this.salesTemp = {}
        this.$http.get(`${process.env.VUE_APP_API}getSalesItem/${item.id}`).then(
          response => {
            this.searchSalesItem = response.body['itens']
            let saleReturn = response.body
            this.salesTemp.id_sale = saleReturn.id
            this.salesTemp.client_sale = saleReturn.cliente.nome
            this.salesTemp.date_sale = saleReturn.data_pedido
          },
          () => {
            this._errorMessage()
          }
        )
        this.salesTab = "tab-2"
      },

      addSalesItem(item){
        this.salesTemp.product_id = item.id_produto
        this.salesTemp.description_product = item.descricao
        this.salesTemp.amount_product = item.quantidade
        this.salesTemp.price_product = item.valor_unitario

        this.order.sales_items.push(this.salesTemp)
      },

      verifySaleItem(item){
        if(item.id_produto !== parseInt(this.order.id_erp)){
          return false
        }
        for(let k in this.order.sales_items){
          if(item.id_produto === this.order.sales_items[k].product_id){
            if(this.salesTemp.id_sale === this.order.sales_items[k].id_sale){
              return false
            }
          }
        }
        return true
      },

      backSalesItems(){
        this.salesTab = "tab-1"
      },

      backGridOrder(){
        this.$router.push(`/gridorder`)
      },

      backOrder(){
        this.$router.push(`/formorder/${this.orderId}`)
      },

      createOrder(){
        this.$http.post(`${process.env.VUE_APP_API}orders`, this.order).then(
          response => {
            if (response.body) {
              this.$notify({
                group: "alert",
                title: "Sucesso!",
                text: "Ordem criada com sucesso!",
                type: "success"
              })
              this.$router.push(`/formorder/${response.body.id}`)
            } else {
              this._errorMessage()
            }
          },
          () => {
            this._errorMessage()
          }
        )
      },

      updateOrder(){
        this.$http.put(`${process.env.VUE_APP_API}orders/${this.order.id}`, this.order).then(
          response => {
            if (response.body) {
              this.$notify({
                group: "alert",
                title: "Sucesso!",
                text: "Ordem Atualizada com sucesso!",
                type: "success"
              })
            } else {
              this._errorMessage()
            }
          },
          () => {
            this._errorMessage()
          }
        )
      },

      editSubOrder(item){
        this.$router.push(`/formorder/${this.orderId}/${item.sub_id}`)
      },

      deleteSubOrder(item){
        const index = this.order.sub_orders.indexOf(item)
        confirm('Deseja excluir o item '+item.order+'?') && this.order.sub_orders.splice(index, 1)
      },

      newSubOrder(){
        this.newSubOrderDialog = true;

        let countSales = 0
        for(let k in this.order.sales_items){
          countSales+=parseInt(this.order.sales_items[k].amount_product)
        }

        let countSubOrder = 0
        for(let k in this.order.sub_orders){
          countSubOrder+=parseInt(this.order.sub_orders[k].amount)
        }

        let countTotal = 0
        for(let k in this.order.sub_orders){
          for(let u in this.order.sub_orders[k].default_stage_factories){
              countTotal+=parseInt(this.order.sub_orders[k].default_stage_factories[u].broken)
          }
        }

        this.availableOrder = (countSales-countSubOrder)
        
        if(countTotal){
          this.availableOrder+=countTotal
        }
      },

      saveSubOrder(){
        if((this.availableOrder-this.editedSubOrder.amount) >= 0){
          let productTemp = this.dataProduct.filter(item => {
            return item.id == this.order.product_id
          })

          this.editedSubOrder.sub_id = Object.keys(this.order.sub_orders).length+1

          this.editedSubOrder.default_stage_factories = productTemp[0].stage_factory
          this.editedSubOrder.stage="Não iniciada"

          for(let k in this.editedSubOrder.default_stage_factories){
            this.editedSubOrder.default_stage_factories[k].id = ""
            this.editedSubOrder.default_stage_factories[k].start = ""
            this.editedSubOrder.default_stage_factories[k].broken = ""
            this.editedSubOrder.default_stage_factories[k].total = ""
            this.editedSubOrder.default_stage_factories[k].complete = 0
          }
          this.order.sub_orders.push(this.editedSubOrder)

          this.updateOrder()
          this.closeSubOrder()
          this._getOrder()
        }else{
          this.$notify({
            group: "alert",
            title: "Atenção",
            text: "Verifique a quantidade de itens disponiveís",
            type: "error"
          })
        }
      },

      closeSubOrder(){
        this.newSubOrderDialog = false
        this.$nextTick(() => {
          this.editedSubOrder = Object.assign({}, this.defaultSubOrder)
          this.editedIndex = -1
        })
        
      },

      newExpedition(){
        this.newExpeditionDialog = true;
        
        if(this.order.expeditions === undefined){
            this.editedExpedition.order = 1
        }else{
          this.editedExpedition.order = Object.keys(this.order.expeditions).length+1
        }
        this.editedExpedition.product = this.order.id_erp
        this.editedExpedition.status = "Concluido"
        
      },

      editedExpeditionInvoiceChange(){
        let salesTemp = this.order.sales_items.filter(item => {
          return item.id_sale == this.editedExpedition.invoice
        })
        this.editedExpedition.amount = parseInt(salesTemp[0].amount_product)
      },

      editExpedition(item){
        console.log(item)
      },
    
      saveExpedition(){
        if(this.availableToExpedition - this.editedExpedition.amount >= 0){
          this.loader = this.$loading.show();
          this.$http.post(`${process.env.VUE_APP_API}sendExpedition`, this.editedExpedition).then(
            response => {
              this.$notify({
                group: "alert",
                title: "Sucesso!",
                text: "Estoque Atualizado com sucesso ("+response.body.retorno.status_processamento+")!",
                type: "success"
              })
                this.order.expeditions.push(this.editedExpedition)
                this.closeExpedition()
                this.updateOrder()
            },
            () => {
              this._errorMessage()
            }
          )
        }else{
            this.$notify({
              group: "alert",
              title: "Atenção!",
              text: "Itens produzidos insuficientes para expedir este pedido",
              type: "error"
            })
        }
      },

      closeExpedition(){
        this.$nextTick(() => {
          this.editedExpedition = Object.assign({}, this.defaultExpedition)
          this.editedIndex = -1
        })
        this.newExpeditionDialog = false
        this.loader.hide()
      },

      editStageFactory(item){
        this.editedIndex = this.order.sub_orders[this.subOrderId-1].default_stage_factories.indexOf(item)
        this.editedStepFactory = Object.assign({}, item)
        this.stepFactoryDialog = true

        if(this.order.sub_orders[this.subOrderId-1].default_stage_factories.indexOf(item) == 0){
          this.editedStepFactory.start = this.order.sub_orders[this.subOrderId-1].amount
        }else{
          this.editedStepFactory.start = this.order.sub_orders[this.subOrderId-1].default_stage_factories[this.order.sub_orders[this.subOrderId-1].default_stage_factories.indexOf(item)-1].total
        }
      },

      stepBrokenChange(){
        this.editedStepFactory.total = this.editedStepFactory.start - this.editedStepFactory.broken
      },

      saveStepFactory(){
        Object.assign(this.order.sub_orders[this.subOrderId-1].default_stage_factories[this.editedIndex], this.editedStepFactory)
        this.stepFactoryDialog = false
        this.closeStepFactory()
      },

      closeStepFactory(){
        this.editedStepFactory = this.defaultStageFactory
        this.stepFactoryDialog = false
      },

      printStepFactory(){

      },

      _getOrder(){
        if(this.orderId){
          this.$http.get(`${process.env.VUE_APP_API}orders/${this.orderId}`).then(
            response => {
              this._parseOrder(response.body)
            },
            () => {
              this._errorMessage()
              this.loader.hide()
            }
          )
        }else{
          this.loader.hide()
        }
      },

      _parseOrder(order){
        this.order = order
        this.loader.hide()
      },
      
      _errorMessage() {
        this.$notify({
          group: "alert",
          title: "Erro!",
          text: "Ocorreu um erro, por favor tente novamente!",
          type: "error"
        })
      },

    }

}
</script>