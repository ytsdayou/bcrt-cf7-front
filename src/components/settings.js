import fetchData from "../api";
import { Message } from 'element-ui';

export default {
    data() {
        return {
            w: {},
            activeName: "table",
            setting: {},
            fields: [],
        }
    },

    props: {
        settingProp: {type:Object},
        fid: {type: [String, Number]}
    },

    mounted() {
        this.w = window.bctr_cf7_data;
        this.setting = Object.assign({}, this.settingProp);

        this.fields = [];
        this.setting.fields.forEach(element => {
            if( this.SYS_FIELDS.indexOf(element.field) === -1 ) {
                this.fields.push({
                    ...element,
                    label: element.label !== undefined ? element.label : '',
                })
            }
        });
    },

    methods: {
        handleClick() {

        },

        onSubmit() {
            this.loading = true;

            this.$set(this.setting, 'fields', []);
            this.fields.forEach(val => {
                this.setting.fields.push(val);
            });
            this.SYS_FIELDS.forEach(val => {
                this.setting.fields.push({
                    field: val,
                    label: val,
                    show: true,
                })
            })

            fetchData({
                action: 'bctr_cf7_save_setting',
                fid: this.fid,
                settings: JSON.stringify(this.setting),
                nonce: this.w.nonce
            }).then(res => {
                if( res["success"] ) {

                    Message.success({
                        message: res["data"].mess,
                        showClose: true,
                    });
                    this.$emit("onSuccess", {});
                    this.cancel();

                } else {

                    Message.error({
                        message: res["data"] && res["data"].mess ? res["data"].mess : "Save settings fail",
                        showClose: true,
                    });
                    this.loading = false;

                }
            });
        },

        cancel() {
            this.$emit("update:visible", false);
        },

        handleIconClick(item) {
            console.log(item)
            item.show = item.show === '1' ? '0' : '1';
        },

        onDrop (dropResult) {
            console.log(this.fields)
            console.log(dropResult)
            this.fields = this.swapArr(this.fields, dropResult.removedIndex, dropResult.addedIndex, this.fields[dropResult.removedIndex])
        },

        swapArr (arr, index1, index2, item) {
            arr.splice(index1, 1)
            arr.splice(index2, 0, item)
            return arr
        }
    }
}