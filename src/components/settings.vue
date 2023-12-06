<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">

    <el-tab-pane label="Table Settings" name="table">

      <div class="settings-wrapper" v-if="setting.table">

        <div class="table-settings-row">

          <div class="left">Header</div>

          <div class="right">
            <el-switch
                v-model="setting.table.header"
                active-value="1"
                inactive-value="0">
            </el-switch>
          </div>

        </div>

        <div class="table-settings-row">

          <div class="left">Bordered</div>

          <div class="right">
            <el-switch
                v-model="setting.table.bordered"
                active-value="1"
                inactive-value="0">
            </el-switch>
          </div>

        </div>

        <div class="table-settings-row">

          <div class="left">Show Checkbox</div>

          <div class="right">
            <el-switch
                v-model="setting.table.showCheckbox"
                active-value="1"
                inactive-value="0">
            </el-switch>
          </div>

        </div>

        <div class="table-settings-row">

          <div class="left">Ellipsis</div>

          <div class="right">
            <el-switch
                v-model="setting.table.ellipsis"
                active-value="1"
                inactive-value="0">
            </el-switch>
          </div>

        </div>

        <div class="table-settings-row">

          <div class="left">Fixed Action</div>

          <div class="right">
            <el-switch
                v-model="setting.table.fixedRight"
                active-value="1"
                inactive-value="0">
            </el-switch>
          </div>

        </div>

        <div class="table-settings-row">

          <div class="left">Pagination Bottom</div>

          <div class="right">
            <el-radio-group v-model="setting.table.paginationBottom" size="small">
              <el-radio-button label="left">Left</el-radio-button>
              <el-radio-button label="center">Center</el-radio-button>
              <el-radio-button label="right">Right</el-radio-button>
            </el-radio-group>
          </div>

        </div>

        <div class="divider"></div>

        <div class="form-foot">
          <div></div>
          <div>
            <el-button type="primary" @click="onSubmit" size="small">Submit</el-button>
            <el-button @click="cancel" size="small">Cancel</el-button>
          </div>
        </div>

      </div>

    </el-tab-pane>

    <el-tab-pane label="Column Settings" name="column">
      
      <Container lock-axis="y" drag-handle-selector=".column-drag-handle"  @drop="onDrop">
        <Draggable v-for="item in fields" :key="item.field">
          <div class="draggable-item">
            <span class="el-icon-sort mr-2 column-drag-handle cursor-move"></span>
            <div class="sort-column">{{item.field}}</div>
            <el-input
              placeholder="Enter a name"
              v-model="item.label"
            >
              <span
                class="el-icon-view el-input__icon cursor-pointer"
                :class="{hide: item.show === '0'}"
                slot="suffix"
                @click="handleIconClick(item)">
              </span>
            </el-input>
            
          </div>
        </Draggable>
      </Container>

      <div class="divider"></div>

      <div class="form-foot">
        <div></div>
        <div>
          <el-button type="primary" @click="onSubmit" size="small">Submit</el-button>
          <el-button @click="cancel" size="small">Cancel</el-button>
        </div>
      </div>

    </el-tab-pane>

  </el-tabs>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd";
import settings from "./settings.js";
export default {
  mixins: [settings],
  components: { Container, Draggable },
  data() {
    return {
    }
  },
}
</script>