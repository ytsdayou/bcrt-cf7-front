<template>
  <section class="boo-cool-container">

    <section class="boo-cool-cf7-header">
      <div class="boo-cool-cf7-title">Contact Form 7 Record</div>
      
    </section>

    <section class="boo-cool-main" v-loading="loading">

      <template v-if="formList.length > 0">
        <el-tabs v-model="filter.fid" type="card" @tab-click="handleTabClick">
          
          <el-tab-pane :label="form.label" :name="form.idString" v-for="(form, i) in formList" :key = "i" lazy>
            <template v-if="settings.fields && settings.fields instanceof Array && settings.fields.length > 0">
              <div class="boo-cool-table-tools">
                <div class="boo-cool-filter-set">

                  <el-input placeholder="Type keyword..." v-model="filter.keyword" clearable class="mr-3" @change="getData">
                  </el-input>

                  <el-date-picker style="min-width: 260px;" class="mr-3"
                      v-model="filter.dateRange"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="-"
                      start-placeholder="begin" @change="getData"
                      end-placeholder="end" value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions">
                  </el-date-picker>

                  <el-button type="primary" @click="getData"><i class="el-icon-search mr-1"></i></el-button>

                  <template v-if="m">
                    <el-button type="primary" @click="onExport"><i class="el-icon-download"></i></el-button>
                  </template>
                  <template v-else>
                    <el-tooltip class="item" effect="dark" content="Export To Excel: This feature is available in Pro version.">
                      <el-button type="primary" class="is-disabled"><i class="el-icon-download"></i></el-button>
                    </el-tooltip>
                  </template>

                  <template v-if="m">
                    <el-button type="danger" @click="batchDel"><i class="el-icon-delete"></i></el-button>
                  </template>
                  <template v-else>
                    <el-tooltip class="item" effect="dark" content="Bulk Delete: This feature is available in Pro version.">
                      <el-button type="danger" class="is-disabled"><i class="el-icon-delete"></i></el-button>
                    </el-tooltip>
                  </template>

                </div>

                <div class="boo-cool-setting-set">

                  <el-button type="primary" icon="el-icon-setting" title="Settings" @click="dialogSettings = true"></el-button>

                </div>

              </div>

            
              <template v-if="total">
                <ve-table
                    style="width:100%"
                    :max-height="tableHeight"
                    :show-header="settings.table.header === '1'"
                    :scroll-width="0"
                    :columns="columns"
                    row-key-field-name="id"
                    :table-data="tableData"
                    :border-around="settings.table.bordered === '1'"
                    :border-x="settings.table.bordered === '1'"
                    :border-y="settings.table.bordered === '1'"
                    :column-width-resize-option="columnWidthResizeOption"
                    :checkbox-option="checkboxOption"
                />

                <div class="table-pagination" :style="pagenationStyle">
                  <ve-pagination
                      :total="total"
                      :scroll-width="0"
                      :page-index="currentPage"
                      :page-size="pageSize"
                      @on-page-size-change="onPageSizeChange"
                      @on-page-number-change="onPageNumberChange"
                  />
                </div>
              </template>
              <template v-else>
                <el-empty :description="_emptyText" :style="`height: ${tableHeight}px;`"></el-empty>
              </template>

            </template>
            <template v-else>
              <el-empty :description="_emptyText" :style="`height: ${tableHeight + 48}px;`"></el-empty>
            </template>

          </el-tab-pane>

        </el-tabs>
      </template>
      <template v-else>
        <el-empty :description="_emptyText" :style="`height: ${tableHeight}px;`"></el-empty>
      </template>
    </section>

    <el-dialog
      title="Detail"
      :visible.sync="dialogDetail"
      :close-on-click-modal="true"
      width="800px"
      >
      <div class="form-wrapper" style="overflow: auto; max-height: calc(100vh - 360px);">
        <template v-for="row in settings.fields">
          <div class="form-item">
            <div class="form-label">{{row.field}}:</div>
            <div class="form-value">
              <template v-if="isImgUrl(clickRow[row.field])">
                <el-image 
                  style="width: 100px; height: 100px"
                  :src="clickRow[row.field]" 
                  :preview-src-list="[ clickRow[row.field] ]">
                </el-image>
              </template>
              <template v-else>
                {{clickRow[row.field]}}
              </template>
            </div>
          </div>
        </template>
      </div>
    </el-dialog>

    <el-dialog title="Edit" :visible.sync="dialogEdit" :close-on-click-modal="false" top="5vh" width="660px" destroy-on-close>
      <FormVue :row="clickRow" :fields="settings.fields" v-if="dialogEdit" :visible.sync="dialogEdit" @submit="onEdit"></FormVue>
    </el-dialog>

    <el-dialog title="Settings" :visible.sync="dialogSettings" :close-on-click-modal="false" top="5vh" width="600px" destroy-on-close>
      <Settings :settingProp.sync="settings" :fid="filter.fid" v-if="dialogSettings" :visible.sync="dialogSettings" @onSuccess="getData"></Settings>
    </el-dialog>

    <el-dialog title="Memo" :visible.sync="dialogFollowup" :close-on-click-modal="false" top="5vh" width="660px" destroy-on-close>
      <FollowUp :row="clickRow" v-if="dialogFollowup" :visible.sync="dialogFollowup"></FollowUp>
    </el-dialog>

    <el-dialog title="Show Pic" :visible.sync="dialogZoomPic" :close-on-click-modal="false" top="5vh" width="660px" destroy-on-close>
      <ZoomPic :src="zoomPic" v-if="dialogZoomPic" :visible.sync="dialogZoomPic"></ZoomPic>
    </el-dialog>

  </section>
</template>
<script>
import cf7TableMixins from "./cf7Table.js";
import FormVue from "./form.vue";
import Settings from "./settings.vue";
import FollowUp from "./followUp.vue";
import ZoomPic from "./zoomPic.vue";
export default {
  name: "cf7Table",
  mixins: [cf7TableMixins],
  components: {FormVue, Settings, FollowUp, ZoomPic},
  data() {
    return {

    }
  },

  methods: {

  }
}
</script>