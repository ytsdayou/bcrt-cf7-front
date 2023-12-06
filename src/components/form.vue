<template>
    <div>
        <el-form label-position="top" label-width="80px" :model="form" style="padding: 0 32px;">
            <template v-for="f in fields">
                <el-form-item :label="`${f.field}:`" v-if="showField(f.field)">
                    <el-input type="textarea" v-model="form[f.field]" autosize :disabled="f.field === 'post_time'"></el-input>
                </el-form-item>
            </template>

            <!-- <div class="divider"></div> -->

            <el-form-item style="text-align: right;">
                <el-button type="primary" @click="onSubmit" size="small">Submit</el-button>
                <el-button @click="cancel" size="small">Cancel</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {},
        }
    },

    props: {
        row: {type: Object},
        fields: {type: Array},
    },

    computed: {
        showField() {
            return f => {
                return this.SYS_FIELDS.indexOf(f) === -1
            }
        }
    },

    mounted() {
        this.form = Object.assign({}, this.row);
    },

    methods: {
        onSubmit() {
            this.$emit("submit", this.form);
            this.cancel();
        },

        cancel() {
            this.$emit("update:visible", false);
        }
    }
}
</script>