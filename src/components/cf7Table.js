import fetchData from "../api";
import { Message, MessageBox } from 'element-ui';
import { exportJsonToExcel } from "../utils/Export2Excel.js";
export default {
    data() {
        return {
            permission: true,
            level: 0,
            loading: true,
            w: {},
            formList: [],
            settings: {},
            total: 0,
            zoomPic: null,
            clickRow: {},
            dialogImage: false,
            dialogDetail: false,
            dialogEdit: false,
            dialogSettings: false,
            dialogFollowup: false,
            dialogZoomPic: false,
            tableHeight: null,
            filter: {
                fid: null,
                keyword: null,
                dateRange: null,
            },
            selectedRowKeys: [],
            pickerOptions: {
                shortcuts: [{
                    text: 'This Week',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: 'This Month',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: 'Last 3 Months',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

            columnWidthResizeOption: {
                // default false
                enable: true,
                // column resize min width
                minWidth: 30,
                // column size change
                sizeChange: ({ column, differWidth, columnWidth }) => {
                    this.columnResizeInfo.column = column;
                    this.columnResizeInfo.differWidth = differWidth;
                    this.columnResizeInfo.columnWidth = columnWidth;
                },
            },
            checkboxOption: {
                // row select change event
                selectedRowChange: ({ row, isSelected, selectedRowKeys }) => {
                    //console.log(row, isSelected, selectedRowKeys);
                    //console.log(selectedRowKeys)
                    this.selectedRowKeys = selectedRowKeys;
                },
                // selected all change event
                selectedAllChange: ({ isSelected, selectedRowKeys }) => {
                    //console.log(isSelected, selectedRowKeys);
                    //console.log(selectedRowKeys)
                    this.selectedRowKeys = selectedRowKeys;
                },
            },
            columns: [],
            columnResizeInfo: {
                column: "",
                differWidth: "",
                columnWidth: "",
                tableWidth: "",
            },
            tableData: [],
            currentPage: 1,
            pageSize: 10,
        }
    },

    computed: {
        isImage() {
            return text => {
                const PICTURE_EXPRESSION = /\.(png|jpe?g|gif|svg)(\?.*)?$/;
                return PICTURE_EXPRESSION.test(text);
            }
        },
        showHeader() {
            return this.settings.table.header;
        },
        showCheckbox() {
            return this.settings && this.settings.table && this.settings.table.showCheckbox ? this.settings.table.showCheckbox : 0;
        },
        showEllipsis() {
            return this.settings && this.settings.table && this.settings.table.ellipsis ? this.settings.table.ellipsis : 0;
        },
        pagenationStyle() {
            const align = this.settings && this.settings.table && this.settings.table.paginationBottom ? this.settings.table.paginationBottom : 'left';
            return `text-align: ${align}`;
        },
        optFixed() {
            return this.settings && this.settings.table && this.settings.table.fixedRight ? this.settings.table.fixedRight : 0;
        },
        _emptyText() {
            return this.permission ? 'No Data' : 'No Permission';
        }
    },

    watch: {
        showCheckbox() {
            this.setColumn();
        },
        showEllipsis() {
            this.setColumn();
        },
        optFixed() {
            this.setColumn();
        },
    },

    async mounted() {
        this.$set(this.filter, 'dateRange', [this.dateBeforeDays(new Date(), -30), this.dateBeforeDays(new Date(), 0)])

        this.w = window.bctr_cf7_data;

        this.resizeTable();
        await this.getFormList();
        this.getData();
    },
   
    methods: {
        async getFormList() {
            await fetchData({
                action: 'bctr_cf7_load_page',
                nonce: this.w.nonce
            }).then(res => {
                if( res['success'] && res['data'] instanceof Array ) {
                    res['data'].forEach(val => {
                        val['idString'] = val['id'].toString();
                    });
                    this.formList = res['data'];
                    this.formList.length > 0 && this.$set(this.filter, 'fid', this.formList[0].idString);
                } else if( res['data'] && res['data'].permission === false ) {
                    this.permission = false;
                }
            })
        },

        setColumn() {
            let that = this;
            const columns = [];

            if( this.settings.table.showCheckbox === '1' ) {
                const checkColumn = {
                    field: "",
                    key: "checkbox",
                    // type=checkbox
                    type: "checkbox",
                    title: "",
                    width: 50,
                    align: "center",
                };
                columns.push(checkColumn);
            }

            const indexColumn = {
                field: "index",
                key: "index",
                title: "#",
                width: 50,
                align: "center",
                fixed: "left",
                renderBodyCell: ({ row, column, rowIndex }, h) => {
                    return ++rowIndex;
                },
            };

            columns.push(indexColumn);

            this.settings.fields.forEach(val => {
                let that = this;
                if( this.SYS_FIELDS.indexOf( val.field ) === -1 && val.show === '1' ) {
                    const c = {
                        field: val.field, 
                        key: val.field, 
                        title: val.label, 
                        width: 300,
                        renderBodyCell: ({ row, column, rowIndex }, h) => {
                            if( this.isImgUrl( row[ column.field ] ) ) {
                                const img = h('img', { attrs: {class: "table-img", src: row[column.field], alt: ""} })
                                const pop = h('span', {
                                                        class: 'h-icon size-2', on: {'click': () => {this.imgDetail(row[column.field])}}
                                                        }, ['', h('span', {class: 'el-icon-zoom-in'})])
                                return h('div', {attrs: {style: "display: flex; justify-content: space-around;"}}, [ h('div', {class: "table-img-row"}, [img, pop]) ] )
                            }

                            return row[ column.field ]
                        },
                    }

                    if( this.settings.table.ellipsis === '1' ) {
                        c['ellipsis'] = {
                            showTitle: true,
                        };
                    }

                    columns.push(c);
                }
            });

            const opt = {
                field: "action",
                key: "bct-action",
                title: "Action",
                width: 160,
                renderBodyCell: ({ row, column, rowIndex }, h) => {
                    let memo;console.log(that.w)
                    if( that.m === 1 ) {
                        memo = h('span', {class: 'h-icon', on: {'click': () => {this.handleClick(row, 'memo')}}}, ['', h('span', {class: 'el-icon-tickets'})]);
                    } else {
                        memo = h('el-tooltip', { attrs: {effect: 'dark', content: "Memo: This feature is available in Pro version."} }, [
                            '', h('span', {class: 'h-icon disabled' }, ['', h('span', {class: 'el-icon-tickets'})])
                        ])
                    }

                    return h(
                        "span", 
                        {class: "bct-action"},
                        [
                            '',
                            //h('span', {class: 'h-icon', on: {'click': () => {this.handleClick(row, 'memo')}}}, ['', h('span', {class: 'el-icon-tickets'})]),
                            memo,
                            h('span', {class: 'h-icon', on: {'click': () => {this.handleClick(row, 'view')}}}, ['', h('span', {class: 'el-icon-view'})]),
                            h('span', {class: 'h-icon', on: {'click': () => {this.handleClick(row, 'edit')}}}, ['', h('span', {class: 'el-icon-edit'})]),
                            h('span', {class: 'h-icon', on: {'click': () => {this.handleClick(row, 'del')}}}, ['', h('span', {class: 'el-icon-delete'})])
                        ]
                    )
                },
            };
            if( this.settings.table.fixedRight === '1' ) {
                opt['fixed'] = "right";
            }

            columns.push(opt);

            this.columns = columns;
        },

        getData() {
            this.loading = true;
            fetchData({
                action: 'bctr_cf7_list',
                fid: this.filter.fid,
                page: this.currentPage,
                size: this.pageSize,
                begin: this.filter.dateRange && this.filter.dateRange[0] ? this.filter.dateRange[0] : null,
                end: this.filter.dateRange && this.filter.dateRange[1] ? this.filter.dateRange[1] : null,
                keyword: this.filter.keyword  ? this.filter.keyword : null,
                nonce: this.w.nonce
            }).then(res => {
                if( res['success'] ) {
                    const data = res['data'];
                    this.settings = data['settings'];

                    this.tableData = data['list'];
            
                    this.total = data['total'];

                    this.setColumn();
                }
                this.loading = false;
            })
        },

        handleTabClick() {
            this.currentPage = 1;
            this.getData();
        },

        handleClick(row, act) {
            this.clickRow = row;

            if( act === 'view' ) {

                this.dialogDetail = true;

            } else if( act === 'memo' ) {

                this.dialogFollowup = true;

            } else if( act === 'edit' ) {

                this.dialogEdit = true;

            } else if( act === 'del' ) {
                
                MessageBox.confirm('This will permanently delete the record. Are you sure that you want to proceed?', 'Notice', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                  }).then(() => {
                    this.confirmDel( [row.id] );
                  }).catch(() => {      
                  });
            }
        },

        batchDel() {
            if( this.selectedRowKeys.length ) {
                MessageBox.confirm('This will permanently delete the selected records. Are you sure that you want to proceed?', 'Notice', {
                    confirmButtonText: 'Confirm',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                  }).then(() => {
                    this.confirmDel( this.selectedRowKeys );
                  }).catch(() => {      
                  });
            } else {
                Message.warning({
                    message: 'please select the records you want to delete!',
                    showClose: true,
                });
            }
        },

        confirmDel(ids) {
            this.loading = true;

            fetchData({
                action: 'bctr_cf7_del',
                ids: ids,
                nonce: this.w.nonce
            }).then(res => {
                if( res["success"] ) {

                    Message.success({
                        message: res["data"].mess,
                        showClose: true,
                    });
                    this.getData();

                } else {

                    Message.error({
                        message: res["data"] && res["data"].mess ? res["data"].mess : "Delete fail",
                        showClose: true,
                    });
                    
                }
                this.loading = false;
            });
        },

        handleSizeChange(val) {
            console.log(`perpage ${val} `);
        },

        handleCurrentChange(val) {
            console.log(`curpage${val}`);
        },
        
        resizeTable() {
            const head = document.querySelector("#wpadminbar");
            const headHeight = head && head.offsetHeight ? head.offsetHeight : 0;
            const foot = document.querySelector("#wpfooter");
            const footHeight = foot && foot.offsetHeight ? foot.offsetHeight : 0;

            this.tableHeight = window.innerHeight - headHeight - footHeight - 350;
        },

        onEdit(form) {
            this.loading = true;
            const row_id = form.id;
            let columns = {};
            for( let column in form ) {
                if( this.SYS_FIELDS.indexOf( column ) === -1 ) {
                    columns[column] = form[column];
                }
            }

            fetchData({
                action: 'bctr_cf7_edit',
                row_id: row_id,
                columns: columns,
                nonce: this.w.nonce
            }).then(res => {
                if( res["success"] ) {

                    Message.success({
                        message: res["data"].mess,
                        showClose: true,
                    });
                    this.getData();

                } else {

                    Message.error({
                        message: res["data"] && res["data"].mess ? res["data"].mess : "Edit fail",
                        showClose: true,
                    });
                    this.loading = false;

                }
                
            })
        },

        onPageSizeChange(val) {
            this.pageSize = val;
            
            this.getData();
        },

        onPageNumberChange(val) {
            this.currentPage = val;
            
            this.getData();
        },

        async onExport() {
            try {
                this.loading = true;
                const res = await this.getExportData();

                let tHeader = [], filterVal = [];
                if( res["columns"] && res["columns"] instanceof Array ) {
                    res["columns"].forEach(c => {
                        tHeader.push(c.title);
                        filterVal.push(c.key);
                    })
                }

                const data = this.formatJson(filterVal, res.data);
                const curForm = this.formList.filter(val => Number(val.id) === Number(this.filter.fid));
                
                exportJsonToExcel({
                    header: tHeader,
                    data: data,
                    filename: curForm[0] ? curForm[0].label : 'record',
                    autoWidth: true,
                    bookType: 'xlsx'
                })
                this.loading = false;
                
                Message.success({
                    message: "Export data success!",
                    showClose: true,
                });
            } catch (error) {
                Message.error({
                    message: error,
                    showClose: true,
                });
            }
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
              return v[j]
            }))
        },

        async getExportData() {
            let columns = [];
            this.settings.fields.forEach(val => {
                const c = {
                    key: val.field, 
                    title: val.field, 
                }

                columns.push(c);
            });

            let page = 1, flag = true, dataList = [];
            while( flag ) {
                const res = await fetchData({
                    action: 'bctr_cf7_list',
                    fid: this.filter.fid,
                    page: page,
                    size: this.pageSize,
                    begin: this.filter.dateRange && this.filter.dateRange[0] ? this.filter.dateRange[0] : '',
                    end: this.filter.dateRange && this.filter.dateRange[1] ? this.filter.dateRange[1] : '',
                    keyword: this.filter.keyword  ? this.filter.keyword : null,
                    nonce: this.w.nonce
                });
                if( res['success'] ) {
                    if( res['data'] && res['data'].list instanceof Array && res['data'].list.length > 0 ) {
                        const data = res['data'].list;
                        dataList.push(...res['data'].list);
                    } else {
                        flag = false;
                    }
                } else {
                    flag = false;
                }

                page++;
            }

            return {
                columns: columns,
                data: dataList
            }
        },

        isImgUrl( str_url ) { 
            var regex = "^(https?|ftp)://(www.)?.+.*.+[.{1}](jpeg|JPEG|GIF|gif|bmp|BMP|jpg|JPG|PNG|png){1}$" ;
            return new RegExp( regex ).test( str_url )
        },

        imgDetail(src) {
            this.zoomPic = src;
            this.dialogZoomPic = true;
        },

        // @param days: positive is delay days, negtive is early days
        dateBeforeDays(dateStr = new Date(), days = 0) {
            let date = new Date (dateStr);
            date.setDate(date.getDate() + days);
            let y = date.getFullYear();
            let m = this.doubleNum(date.getMonth () + 1);
            let d = this.doubleNum(date.getDate ());
            return `${y}-${m}-${d}`;
        },

        doubleNum(n) {
            return n > 9 ? n : "0" + n
        }
    }
}